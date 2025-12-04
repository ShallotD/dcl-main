import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const checklistApi = createApi({
  reducerPath: "checklistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Checklist"],

  endpoints: (builder) => ({
    createChecklist: builder.mutation({
      query: (data) => ({
        url: "/checklist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checklist"],
    }),

    getChecklistById: builder.query({
      query: (id) => `/checklist/id/${id}`,
      providesTags: ["Checklist"],
    }),

    getChecklistByDclNo: builder.query({
      query: (dclNo) => `/checklist/dcl/${dclNo}`,
      providesTags: ["Checklist"],
    }),

    getChecklists: builder.query({
      query: () => "/checklist",
    providesTags: (result, error, id) => [{ type: "Checklist", id }],
    }),


    providesTags: (result, error, id) => [{ type: "Checklist", id }],
    // update checklist

    // ✅ Update checklist mutation
    updateChecklist: builder.mutation({
      query: ({ checklistId, ...patch }) => ({
        url: `/checklists/${checklistId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { checklistId }) => [
        { type: "Checklist", id: checklistId },
        { type: "Checklist", id: "LIST" },
      ],
    }),

    // Mutation to update documents, status, and assignment flags
    updateChecklistStatus: builder.mutation({
      query: ({ checklistId, ...payload }) => ({
        url: `/checklist/${checklistId}/checklist-status`,
        method: "PATCH",
        body: payload,
      }),

      invalidatesTags: (result, error, { checklistId }) => [
        { type: "Checklist", id: checklistId },
        "Checklist",
      ],
    }),

    submitRmChecklist: builder.mutation({
      query: (payload) => ({
        url: "/checklist/rm-submit",
        method: "PATCH",
        body: payload,
      }),

      invalidatesTags: ["Checklist"],
      
    }),
    

    uploadDocuments: builder.mutation({
      query: ({ id, documents }) => ({
        url: `/checklist/${id}/upload`,
        method: "PUT",
        body: { documents },
      }),
      invalidatesTags: ["Checklist"],
    }),

    deferDocument: builder.mutation({
      query: ({ id, docIndex, reason }) => ({
        url: `/checklist/${id}/defer`,
        method: "PUT",
        body: { docIndex, reason },
      }),
      invalidatesTags: ["Checklist"],
    }),

    coCreateReview: builder.mutation({
      query: (id) => ({
        url: `/checklist/${id}/co-create`,
        method: "PUT",
      }),
      invalidatesTags: ["Checklist"],
    }),

    // rm checklists
    getRMChecklists: builder.query({
      query: () => "/checklist/rm/my-checklists",
      // providesTags: ["Checklist"],
      providesTags: (result, error, id) => [{ type: "Checklist", id }],
    }),

    getRmQueue: builder.query({
      query: (coCreatorId) => `/checklist/${coCreatorId}`,
      providesTags: ["Checklist"],
    }),

    updateDocument: builder.mutation({
      query: (data) => ({ url: "/update-document", method: "PUT", body: data }),
      invalidatesTags: ["Checklist"],
    }),

    coCheckApproval: builder.mutation({
      query: (id) => ({
        url: `/checklist/${id}/co-check`,
        method: "PUT",
      }),
      invalidatesTags: ["Checklist"],
    }),

    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: "/checklist/upload",
        method: "POST",
        body: formData,
      }),
    }),

    requestDeferral: builder.mutation({
      query: (body) => ({
        url: "/checklist/deferral",
        method: "POST",
        body,
      }),
    }),

    // submitRmChecklist: builder.mutation({
    //   query: (body) => ({
    //     url: "/checklist/rm-submit",
    //     method: "POST",
    //     body,
    //   }),
    // }),
  }),
});

export const {
  useCreateChecklistMutation,
  useUploadDocumentsMutation,
  useDeferDocumentMutation,
  useCoCreateReviewMutation,
  useCoCheckApprovalMutation,
  useGetChecklistsQuery,
  useGetChecklistByIdQuery,
  useGetChecklistByDclNoQuery,
  useGetRmQueueQuery,
  useGetRMChecklistsQuery,
  useUpdateDocumentMutation,
  useUpdateChecklistMutation,
  useUploadDocumentMutation,
  useRequestDeferralMutation,
  useSubmitRmChecklistMutation,
  useUpdateChecklistStatusMutation,
} = checklistApi;
