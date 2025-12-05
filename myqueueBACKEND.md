Backend API for MyQueue.jsx

1. Updated Checklist Controller - Add MyQueue endpoints
javascript
// src/controllers/checklistController.js

// @desc    Get checklists for MyQueue (Creator's queue)
// @route   GET /api/v1/checklists/my-queue
// @access  Private (creator)
exports.getMyQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { queueType } = req.query; // 'current' or 'previous'
    
    let query = { 
      isActive: true,
      $or: [
        { createdBy: userId },
        { assignedToCoChecker: userId }
      ]
    };

    // Filter based on queue type
    if (queueType === 'current') {
      // Current Queue: Items submitted by RM
      query.status = 'pending_creator_review';
    } else if (queueType === 'previous') {
      // Previous Queue: Items returned by Checker
      query.status = 'returned_by_checker';
    } else {
      // Get both types
      query.$or = [
        { status: 'pending_creator_review' },
        { status: 'returned_by_checker' }
      ];
    }

    const checklists = await Checklist.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedToRM', 'name email')
      .populate('assignedToCoChecker', 'name email')
      .populate('assignedToChecker', 'name email')
      .sort('-updatedAt');

    // Structure response for frontend
    const currentQueue = checklists.filter(c => c.status === 'pending_creator_review');
    const previousQueue = checklists.filter(c => c.status === 'returned_by_checker');

    res.status(200).json({
      success: true,
      data: {
        currentQueue,
        previousQueue,
        counts: {
          current: currentQueue.length,
          previous: previousQueue.length,
          total: checklists.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Process creator review action
// @route   PUT /api/v1/checklists/:id/review
// @access  Private (creator)
exports.processCreatorReview = async (req, res) => {
  try {
    const { 
      action, // 'approve', 'return_to_rm', 'resubmit_to_checker'
      documents, // Array of document updates
      creatorComment,
      sourceType // 'from_rm' or 'from_checker'
    } = req.body;
    
    const userId = req.user.id;
    const checklistId = req.params.id;

    const checklist = await Checklist.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    // Verify user is authorized (creator or co-creator)
    const isCreator = 
      checklist.createdBy.toString() === userId ||
      checklist.assignedToCoChecker?.toString() === userId;

    if (!isCreator) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to review this checklist'
      });
    }

    // Update document statuses
    if (documents && Array.isArray(documents)) {
      documents.forEach(docUpdate => {
        // Find and update the document
        checklist.documents.forEach(category => {
          category.docList.forEach(doc => {
            if (doc._id.toString() === docUpdate._id || 
                doc.docIdx === docUpdate.docIdx) {
              
              // Update document status and comments
              doc.status = docUpdate.status;
              doc.creatorComment = docUpdate.creatorComment;
              
              // If from checker and document was rejected, update checker comment
              if (sourceType === 'from_checker' && docUpdate.checkerComment) {
                doc.checkerComment = docUpdate.checkerComment;
              }
            }
          });
        });
      });
    }

    // Determine new status based on action and source
    let newStatus = checklist.status;
    let workflowAction = '';
    let workflowComment = creatorComment;

    if (sourceType === 'from_rm') {
      // Processing RM submission
      switch (action) {
        case 'approve':
          newStatus = 'pending_checker';
          workflowAction = 'submitted_to_checker';
          workflowComment = `Approved and submitted to Checker: ${creatorComment}`;
          break;
        case 'return_to_rm':
          newStatus = 'returned_to_rm';
          workflowAction = 'returned_to_rm';
          workflowComment = `Returned to RM for corrections: ${creatorComment}`;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action for RM submission'
          });
      }
    } else if (sourceType === 'from_checker') {
      // Processing checker return
      switch (action) {
        case 'resubmit_to_checker':
          newStatus = 'pending_checker';
          workflowAction = 'resubmitted_to_checker';
          workflowComment = `Resubmitted to Checker: ${creatorComment}`;
          break;
        case 'return_to_rm':
          newStatus = 'returned_to_rm';
          workflowAction = 'returned_to_rm';
          workflowComment = `Returned to RM after checker review: ${creatorComment}`;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action for checker return'
          });
      }
    }

    // Update checklist
    checklist.status = newStatus;
    checklist.creatorGeneralComment = creatorComment;
    checklist.updatedAt = new Date();

    // Add to workflow history
    checklist.workflowHistory.push({
      action: workflowAction,
      performedBy: userId,
      comments: workflowComment,
      timestamp: new Date()
    });

    // If returning to RM, clear checker comments
    if (newStatus === 'returned_to_rm') {
      checklist.checkerGeneralComment = '';
      checklist.documents.forEach(category => {
        category.docList.forEach(doc => {
          doc.checkerComment = '';
        });
      });
    }

    await checklist.save();

    // Populate before sending response
    await checklist.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedToRM', select: 'name email' },
      { path: 'assignedToChecker', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      data: checklist,
      message: `Checklist ${action === 'approve' ? 'submitted to Checker' : 'returned to RM'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get checklist statistics for dashboard
// @route   GET /api/v1/checklists/stats
// @access  Private
exports.getChecklistStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = { isActive: true };

    // Filter based on user role
    if (userRole === 'creator') {
      query.$or = [
        { createdBy: userId },
        { assignedToCoChecker: userId }
      ];
    } else if (userRole === 'rm') {
      query.assignedToRM = userId;
    } else if (userRole === 'checker') {
      query.assignedToChecker = userId;
    }

    const stats = await Checklist.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDocs: {
            $sum: {
              $size: {
                $reduce: {
                  input: '$documents',
                  initialValue: [],
                  in: { $concatArrays: ['$$value', '$$this.docList'] }
                }
              }
            }
          }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      pending_creator_review: 0,
      pending_checker: 0,
      returned_by_checker: 0,
      pending_rm: 0,
      approved: 0,
      total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};





2. Updated Routes for MyQueue
javascript
// src/routes/checklistRoutes.js

const express = require('express');
const {
  createChecklist,
  getChecklists,
  getChecklist,
  submitToCreator,
  creatorAction,
  uploadDocument,
  // NEW ENDPOINTS
  getMyQueue,
  processCreatorReview,
  getChecklistStats
} = require('../controllers/checklistController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();

// All routes are protected
router.use(protect);

// MyQueue specific routes
router.route('/my-queue')
  .get(authorize('creator'), getMyQueue);

router.route('/stats')
  .get(getChecklistStats);

router.route('/:id/review')
  .put(authorize('creator'), processCreatorReview);

// Existing routes
router.route('/')
  .get(getChecklists)
  .post(authorize('creator'), createChecklist);

router.route('/:id')
  .get(getChecklist);

// RM actions
router.route('/:id/rm-submit')
  .put(authorize('rm'), submitToCreator);

// Creator actions (legacy - keep for backward compatibility)
router.route('/:id/creator-action')
  .put(authorize('creator'), creatorAction);

// Document upload
router.route('/:id/documents/upload')
  .post(upload.single('file'), uploadDocument);

module.exports = router;



3. Updated API Integration for Frontend
javascript
// src/api/checklistApi.js (Frontend)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const checklistApi = createApi({
  reducerPath: 'checklistApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Checklist', 'Queue'],
  endpoints: (builder) => ({
    // Get MyQueue checklists
    getMyQueue: builder.query({
      query: (queueType) => `/checklists/my-queue${queueType ? `?queueType=${queueType}` : ''}`,
      providesTags: ['Queue'],
    }),

    // Get all checklists (for other pages)
    getChecklists: builder.query({
      query: () => '/checklists',
      providesTags: ['Checklist'],
    }),

    // Process creator review
    updateChecklistStatus: builder.mutation({
      query: (payload) => ({
        url: `/checklists/${payload.checklistId}/review`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Checklist', 'Queue'],
    }),

    // Legacy endpoint for backward compatibility
    submitRmChecklist: builder.mutation({
      query: (payload) => ({
        url: `/checklists/${payload.checklistId}/rm-submit`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Checklist'],
    }),

    // Get checklist statistics
    getChecklistStats: builder.query({
      query: () => '/checklists/stats',
    }),

    // Upload document
    uploadDocument: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('documentId', payload.documentId);
        formData.append('categoryId', payload.categoryId);
        
        return {
          url: `/checklists/${payload.checklistId}/documents/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Checklist'],
    }),
  }),
});

export const {
  useGetMyQueueQuery,
  useGetChecklistsQuery,
  useUpdateChecklistStatusMutation,
  useSubmitRmChecklistMutation,
  useGetChecklistStatsQuery,
  useUploadDocumentMutation,
} = checklistApi;




4. MongoDB Schema Updates for Status Tracking
javascript
// Update your Checklist model to include these statuses

const checklistSchema = new mongoose.Schema({
  // ... existing fields ...
  
  status: {
    type: String,
    enum: [
      'draft',
      'pending_rm',           // Assigned to RM, waiting for upload
      'pending_creator_review', // RM submitted, waiting for Creator review
      'pending_checker',      // Creator approved, waiting for Checker
      'approved',             // Fully approved
      'rejected',             // Rejected by Checker
      'returned_to_rm',       // Returned to RM for corrections
      'returned_by_checker',  // Returned by Checker to Creator
      'cancelled'
    ],
    default: 'draft'
  },

  // Add these fields for better tracking
  checkerGeneralComment: String,
  checkerComments: String, // For when checker returns checklist
  
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  returnedAt: Date,
  
  // Add SLA tracking
  slaExpiry: Date,
  
  // Document-level checker comments
  documents: [{
    category: String,
    docList: [{
      // ... existing fields ...
      checkerComment: String, // Add this for per-document checker feedback
      returnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      returnedAt: Date
    }]
  }]
}, {
  timestamps: true
});




5. Sample Data for Testing
javascript
// Create sample data in MongoDB
db.checklists.insertMany([
  {
    _id: ObjectId(),
    dclNo: "DCL-2024-001",
    title: "Business Loan Application",
    customerNumber: "CUST001",
    loanType: "business_loan",
    status: "pending_creator_review",
    createdBy: ObjectId("creator_id"),
    assignedToRM: ObjectId("rm_id"),
    assignedToCoChecker: ObjectId("current_user_id"), // This is YOU
    documents: [
      {
        category: "Business Documents",
        docList: [
          {
            name: "Business Registration Certificate",
            status: "uploaded",
            fileUrl: "https://example.com/doc1.pdf",
            rmComment: "Uploaded as requested",
            uploadedBy: ObjectId("rm_id")
          },
          {
            name: "Tax Compliance Certificate",
            status: "pending",
            rmComment: "Waiting for KRA clearance"
          }
        ]
      }
    ],
    workflowHistory: [
      {
        action: "submitted_to_creator",
        performedBy: ObjectId("rm_id"),
        comments: "Documents uploaded for review",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    dclNo: "DCL-2024-002",
    title: "Personal Loan Top-up",
    customerNumber: "CUST002",
    loanType: "personal_loan",
    status: "returned_by_checker",
    createdBy: ObjectId("creator_id"),
    assignedToRM: ObjectId("rm_id"),
    assignedToCoChecker: ObjectId("current_user_id"), // This is YOU
    checkerGeneralComment: "Missing signed application form. Please ensure all signatures are obtained.",
    checkerComments: "Document 3 requires customer signature",
    returnedBy: ObjectId("checker_id"),
    returnedAt: new Date(),
    documents: [
      {
        category: "Application Forms",
        docList: [
          {
            name: "Loan Application Form",
            status: "rejected",
            fileUrl: "https://example.com/form.pdf",
            checkerComment: "Missing customer signature on page 3",
            rmComment: "Form submitted",
            uploadedBy: ObjectId("rm_id")
          }
        ]
      }
    ],
    workflowHistory: [
      {
        action: "returned_by_checker",
        performedBy: ObjectId("checker_id"),
        comments: "Missing signatures, returned for correction",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
Summary of Backend Changes for MyQueue:
Endpoints Created:
GET /api/v1/checklists/my-queue - Gets current and previous queues

PUT /api/v1/checklists/:id/review - Processes creator review actions

GET /api/v1/checklists/stats - Gets dashboard statistics

Key Statuses to Track:
pending_creator_review - RM submitted, waiting for Creator (Current Queue)

returned_by_checker - Checker returned, waiting for Creator re-evaluation (Previous Queue)

pending_checker - Creator approved, sent to Checker

returned_to_rm - Creator returned to RM for corrections

Frontend Integration:
Your MyQueue.jsx should now call:

javascript
// For getting queue data
const { data: queueData, isLoading } = useGetMyQueueQuery();

// For submitting review actions
const [updateChecklistStatus, { isLoading: isUpdating }] = useUpdateChecklistStatusMutation();
This backend will fully support your MyQueue frontend with proper status tracking and role-based access control!