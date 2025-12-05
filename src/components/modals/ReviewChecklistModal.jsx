import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Tag,
  Modal,
  Input,
  Select,
  Card,
  Descriptions,
  message,
  Upload,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import DocumentInputSection from "../../components/creator/DocumentInputSection";

import {
  useSubmitRmChecklistMutation,
  useUpdateChecklistStatusMutation
} from "../../api/checklistApi";

const { Option } = Select;

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const SECONDARY_PURPLE = "#7e6496";

// Custom CSS
const customStyles = `
  .ant-modal-header { background-color: ${PRIMARY_BLUE} !important; padding: 18px 24px !important; }
  .ant-modal-title { color: white !important; font-size: 1.15rem !important; font-weight: 700 !important; letter-spacing: 0.5px; }
  .ant-modal-close-x { color: white !important; }

  .checklist-info-card .ant-card-head { border-bottom: 2px solid ${ACCENT_LIME} !important; }
  .checklist-info-card .ant-descriptions-item-label { font-weight: 600 !important; color: ${SECONDARY_PURPLE} !important; padding-bottom: 4px; }
  .checklist-info-card .ant-descriptions-item-content { color: ${PRIMARY_BLUE} !important; font-weight: 700 !important; font-size: 13px !important; }

  .doc-table.ant-table-wrapper table { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
  .doc-table .ant-table-thead > tr > th { background-color: #f7f9fc !important; color: ${PRIMARY_BLUE} !important; font-weight: 600 !important; padding: 12px 16px !important; }
  .doc-table .ant-table-tbody > tr > td { padding: 10px 16px !important; border-bottom: 1px dashed #f0f0f0 !important; }

  .ant-input, .ant-select-selector { border-radius: 6px !important; border-color: #e0e0e0 !important; }
  .ant-input:focus, .ant-select-focused .ant-select-selector { box-shadow: 0 0 0 2px rgba(22, 70, 121, 0.2) !important; border-color: ${PRIMARY_BLUE} !important; }

  .status-tag { font-weight: 700 !important; border-radius: 999px !important; padding: 3px 8px !important; text-transform: capitalize; min-width: 80px; text-align: center; display: inline-flex; align-items: center; gap: 4px; justify-content: center; }

  .ant-modal-footer .ant-btn { border-radius: 8px; font-weight: 600; height: 38px; padding: 0 16px; }
  .ant-modal-footer .ant-btn-primary { background-color: ${PRIMARY_BLUE} !important; border-color: ${PRIMARY_BLUE} !important; }
`;

const ReviewChecklistModal = ({ checklist, open, onClose }) => {
  const [docs, setDocs] = useState([]);
  const [newDocName, setNewDocName] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  const [showCheckerSubmission, setShowCheckerSubmission] = useState(false);
  const [checkerComment, setCheckerComment] = useState("");
  const [checkerFiles, setCheckerFiles] = useState([]);

  const [submitRmChecklist, { isLoading }] = useSubmitRmChecklistMutation();
  const [updateChecklistStatus, { isLoading: isCheckerSubmitting }] =
    useUpdateChecklistStatusMutation();

  useEffect(() => {
    if (!checklist || !checklist.documents) return;

    const flattenedDocs = checklist.documents.reduce((acc, categoryObj) => {
      const categoryDocs = categoryObj.docList
        .filter((doc) => doc.name && doc.name.trim() !== "")
        .map((doc, index) => ({
          ...doc,
          category: categoryObj.category,
          docIdx: acc.length + index,
        }));
      return acc.concat(categoryDocs);
    }, []);

    const preparedDocs = flattenedDocs.map((doc, idx) => ({
      ...doc,
      docIdx: idx,
      status: doc.status || "pending",
      comment: doc.comment || "",
      action: doc.action || "pending",
      fileUrl: doc.fileUrl || null,
    }));

    setDocs(preparedDocs);
  }, [checklist]);

  const handleAddNewDocument = () => {
    if (!newDocName.trim() || !selectedCategoryName) {
      return message.error(
        "Please enter a document name and select a category."
      );
    }

    setDocs((prevDocs) => {
      const newDocument = {
        docIdx: prevDocs.length,
        name: newDocName.trim(),
        category: selectedCategoryName,
        status: "pending",
        action: "pending",
        comment: "Document added by Co-Creator.",
        fileUrl: null,
      };
      return [...prevDocs, newDocument];
    });

    message.success(
      `Document '${newDocName.trim()}' added to ${selectedCategoryName}.`
    );

    setNewDocName("");
    setSelectedCategoryName(null);
  };

  const handleActionChange = (idx, value) => {
    const updated = [...docs];
    updated[idx].action = value;
    setDocs(updated);
  };

  const handleCommentChange = (idx, value) => {
    const updated = [...docs];
    updated[idx].comment = value;
    setDocs(updated);
  };

  const handleDelete = (idx) => {
    const updated = docs.filter((_, i) => i !== idx);
    const reIndexed = updated.map((doc, i) => ({ ...doc, docIdx: i }));
    setDocs(reIndexed);
    message.success("Document deleted.");
  };

  const handleFileUpload = (docIdx, file) => {
    const updated = [...docs];
    updated[docIdx].fileUrl = URL.createObjectURL(file);
    updated[docIdx].status = "uploaded";
    setDocs(updated);
    message.success("File uploaded");
    return false;
  };

  const submitToRM = async () => {
    try {
      if (!checklist?._id) throw new Error("Checklist ID missing");

      const payload = {
        checklistId: checklist._id,
        documents: docs.map((doc) => ({
          _id: doc._id || undefined,
          name: doc.name,
          category: doc.category,
          status: doc.status,
          action: doc.action,
          comment: doc.comment,
          fileUrl: doc.fileUrl || null,
        })),
      };

      await submitRmChecklist(payload).unwrap();
      message.success("Checklist submitted to RM!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error(err?.data?.error || "Failed to submit checklist to RM");
    }
  };

  const submitToCheckers = async () => {
    if (!checklist?._id) return message.error("Checklist ID missing.");

    try {
      message.loading({
        content: "Submitting checklist to Co-Checker...",
        key: "checkerSubmit",
      });

      const payload = {
        checklistId: checklist._id,
        documents: docs,
        status: "co_checker_review",
        submittedToCoChecker: true,
        assignedToCoChecker: "692bfab9b72c363184f9e160",
        finalComment: checkerComment,
        attachments: checkerFiles,
      };

      await updateChecklistStatus(payload).unwrap();

      message.success({
        content: "Checklist successfully submitted to Co-Checker!",
        key: "checkerSubmit",
        duration: 3,
      });
      onClose();
    } catch (err) {
      console.error(err);
      message.error({
        content: err?.data?.error || "Failed to submit checklist.",
        key: "checkerSubmit",
      });
    }
  };

  const uniqueCategories = [...new Set(docs.map((doc) => doc.category))];
  const allDocsApproved =
    docs.length > 0 && docs.every((doc) => doc.action === "approved");

  const renderStatusTag = (status) => {
    const statusMap = {
      pending: { color: SECONDARY_PURPLE, text: "Pending", icon: <ClockCircleOutlined /> },
      uploaded: { color: PRIMARY_BLUE, text: "Uploaded", icon: <UploadOutlined /> },
      approved: { color: ACCENT_LIME, text: "Approved", icon: <CheckCircleOutlined /> },
    };
    const { color, text, icon } = statusMap[status] || {
      color: "default",
      text: status,
      icon: <SyncOutlined spin />,
    };

    return (
      <Tag
        className="status-tag"
        style={{
          color: color,
          backgroundColor: color + "22",
          borderColor: color + "55",
        }}
      >
        {icon} {text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
      render: (text) => (
        <span style={{ fontSize: 12, color: SECONDARY_PURPLE, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: "Document Name",
      dataIndex: "name",
      width: 250,
      render: (text, record) => (
        <Input
          size="small"
          value={record.name}
          onChange={(e) => {
            const updated = [...docs];
            updated[record.docIdx].name = e.target.value;
            setDocs(updated);
          }}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 140,
      render: (text, record) => (
        <Select
          size="small"
          value={record.action}
          style={{ width: "100%" }}
          onChange={(val) => handleActionChange(record.docIdx, val)}
        >
          <Option value="pending">Pending</Option>
          <Option value="uploaded">Uploaded</Option>
          <Option value="approved">Approved</Option>
        </Select>
      ),
    },
    {
      title: "Status from co",
      dataIndex: "status",
      width: 120,
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Comment from co",
      dataIndex: "comment",
      width: 200,
      render: (text, record) => (
        <Input.TextArea
          rows={1}
          size="small"
          value={text}
          onChange={(e) => handleCommentChange(record.docIdx, e.target.value)}
        />
      ),
    },
    // NEW "View" COLUMN
    {
      title: "View",
      key: "view",
      width: 100,
      render: (_, record) => (
        record.fileUrl ? (
          <Button
            type="link"
            onClick={() => window.open(record.fileUrl, "_blank")}
          >
            View
          </Button>
        ) : (
          <span style={{ color: "#999" }}>No File</span>
        )
      ),
    },
    {
      title: "Delete",
      key: "delete",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          onClick={() => handleDelete(record.docIdx)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Progress calculations
  const total = docs.length;
  const submitted = docs.filter((d) => d.action === "approved" || d.action === "uploaded").length;
  const pending = docs.filter((d) => d.action === "pending").length;
  const deferred = docs.filter((d) => d.action === "deferred").length;
  const progressPercent = total === 0 ? 0 : Math.round((submitted / total) * 100);

  return (
    <>
      <style>{customStyles}</style>
      <Modal
        title={`Review Checklist  ${checklist?.title || ""}`}
        open={open}
        onCancel={onClose}
        width={1150}
        bodyStyle={{ padding: "0 24px 24px" }}
        footer={[
          <Button
            key="submit-checker"
            disabled={!allDocsApproved || showCheckerSubmission}
            type="default"
            onClick={() => {
              setShowCheckerSubmission(true);
              setTimeout(() => {
                const el = document.getElementById("checker-final-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 200);
            }}
            style={{
              backgroundColor: ACCENT_LIME,
              borderColor: ACCENT_LIME,
              color: PRIMARY_BLUE,
              fontWeight: "bold",
              borderRadius: 8,
              opacity: !allDocsApproved ? 0.6 : 1,
              cursor: !allDocsApproved ? "not-allowed" : "pointer",
            }}
          >
            Submit to Checker
          </Button>,
          <Button key="cancel" onClick={onClose}>
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={submitToRM}
          >
            Submit to RM
          </Button>,
        ]}
      >
        {checklist && (
          <>
            <Card
              className="checklist-info-card"
              size="small"
              title={<span style={{ color: PRIMARY_BLUE, fontSize: 14 }}>Checklist Details</span>}
              style={{ marginBottom: 18, marginTop: 24, borderRadius: 10, border: `1px solid #e0e0e0` }}
            >
              <Descriptions size="middle" column={{ xs: 1, sm: 2, lg: 3 }}>
                <Descriptions.Item label="DCL No">{checklist._id}</Descriptions.Item>
                <Descriptions.Item label="Title">{checklist.title}</Descriptions.Item>
                <Descriptions.Item label="Loan Type">{checklist.loanType}</Descriptions.Item>
                <Descriptions.Item label="Created By">{checklist.createdBy?.name}</Descriptions.Item>
                <Descriptions.Item label="RM">{checklist.assignedToRM?.name}</Descriptions.Item>
                <Descriptions.Item label="Co-Checker">{checklist.assignedToCoChecker?.name || "Pending"}</Descriptions.Item>
              </Descriptions>
            </Card>

            <div style={{ padding: "16px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e0e0e0", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontWeight: "700", color: PRIMARY_BLUE }}>Total: {total}</div>
                <div style={{ fontWeight: "700", color: SECONDARY_PURPLE }}>Pending: {pending}</div>
                <div style={{ fontWeight: "700", color: ACCENT_LIME }}>Submitted: {submitted}</div>
                <div style={{ fontWeight: "700", color: "#ff4d4f" }}>Deferred: {deferred}</div>
              </div>
              <div style={{ width: "100%", height: 12, background: "#e0e0e0", borderRadius: 50 }}>
                <div style={{ height: "100%", width: `${progressPercent}%`, background: PRIMARY_BLUE, borderRadius: 50, transition: "width 0.4s ease" }}></div>
              </div>
              <div style={{ textAlign: "right", marginTop: 4, fontWeight: "700", color: PRIMARY_BLUE }}>{progressPercent}%</div>
            </div>

            <h3 style={{ margin: "16px 0 8px", color: PRIMARY_BLUE, fontWeight: "bold" }}>Add New Document +</h3>
            <DocumentInputSection
              uniqueCategories={uniqueCategories}
              selectedCategoryName={selectedCategoryName}
              setSelectedCategoryName={setSelectedCategoryName}
              newDocName={newDocName}
              setNewDocName={setNewDocName}
              handleAddNewDocument={handleAddNewDocument}
            />

            <h3 style={{ margin: "16px 0 8px", color: PRIMARY_BLUE, fontWeight: "bold" }}>Required Documents</h3>
            <Table className="doc-table" rowKey="docIdx" size="middle" pagination={false} dataSource={docs} columns={columns} bordered={false} />

            {showCheckerSubmission && (
              <div id="checker-final-section" style={{ marginTop: 32, padding: "20px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, marginBottom: 40 }}>
                <h3 style={{ color: PRIMARY_BLUE, fontWeight: "bold", marginBottom: 12 }}>Final Comments & Attachments for Checker</h3>
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your final comments for the checker..."
                  value={checkerComment}
                  onChange={(e) => setCheckerComment(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
                <Upload
                  multiple
                  beforeUpload={(file) => {
                    setCheckerFiles((prev) => [...prev, file]);
                    return false;
                  }}
                  fileList={checkerFiles.map((file) => ({ uid: file.uid || file.name, name: file.name }))}
                  onRemove={(file) => {
                    setCheckerFiles((prev) => prev.filter((f) => f.name !== file.name));
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Files</Button>
                </Upload>
                <div style={{ marginTop: 20 }}>
                  <Button
                    type="primary"
                    loading={isCheckerSubmitting}
                    onClick={submitToCheckers}
                    disabled={checkerFiles.length === 0 && !checkerComment.trim()}
                  >
                    Submit to Checker
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ReviewChecklistModal;
