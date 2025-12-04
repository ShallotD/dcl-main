import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Tag,
  Modal,
  Input,
  Space,
  Upload,
  message,
  Card,
  Descriptions,
} from "antd";
import { UploadOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useUpdateChecklistStatusMutation } from "../../api/checklistApi";

const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";

const customStyles = `
  .ant-modal-header { background-color: ${PRIMARY_BLUE} !important; color: white !important; }
  .status-tag { font-weight: 700; border-radius: 999px; padding: 3px 8px; text-transform: capitalize; display: inline-flex; align-items: center; gap: 4px; }
  .ant-input, .ant-input-textarea { border-radius: 6px !important; }
  .doc-table .ant-table-tbody > tr > td { border-bottom: 1px dashed #f0f0f0 !important; }
`;

const CreatorQueueChecklistModal = ({ checklist, open, onClose }) => {
  const [docs, setDocs] = useState([]);
  const [checkerComment, setCheckerComment] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [updateChecklistStatus, { isLoading }] =
    useUpdateChecklistStatusMutation();

  useEffect(() => {
    if (!checklist || !checklist.documents) return;

    const flattenedDocs = checklist.documents.reduce((acc, catObj) => {
      const categoryDocs = catObj.docList.map((doc, index) => ({
        ...doc,
        category: catObj.category,
        docIdx: acc.length + index,
        status: "pendingChecker", // All start as pending checker
      }));
      return acc.concat(categoryDocs);
    }, []);

    setDocs(flattenedDocs);
  }, [checklist]);

  const handleDocStatusChange = (docIdx, newStatus) => {
    const updated = [...docs];
    updated[docIdx].status = newStatus;
    setDocs(updated);
  };

  const handleAdditionalUpload = (file) => {
    setAdditionalFiles((prev) => [...prev, file]);
    message.success(`${file.name} added`);
    return false;
  };

  const submitCheckerAction = async (action) => {
    if (!checkerComment.trim()) {
      return message.error("Please enter a comment before submitting.");
    }

    try {
      const payload = {
        checklistId: checklist._id,
        status: action,
        checkerComment,
        documents: docs,
        additionalFiles,
      };

      await updateChecklistStatus(payload).unwrap();
      message.success("Checklist submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit checklist.");
    }
  };

  const downloadChecklist = () => {
    let content = `Checklist: ${checklist.title}\n\nDocuments:\n`;
    docs.forEach((doc) => {
      content += `- ${doc.name} (${doc.category}) - ${doc.status}\n`;
    });
    additionalFiles.forEach((file) => {
      content += `- Additional: ${file.name}\n`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Checklist_${checklist._id}.txt`;
    link.click();
    message.success("Checklist downloaded");
  };

  // Calculate document status counts for progress bar
  const total = docs.length;
  const pending = docs.filter(d => d.status === "pendingChecker").length;
  const approved = docs.filter(d => d.status === "approved").length;
  const rejected = docs.filter(d => d.status === "rejected").length;
  
  // Progress percentage based on approved documents
  const progressPercent = total === 0 ? 0 : Math.round((approved / total) * 100);

  const columns = [
    {
      title: "Document Name",
      dataIndex: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span style={{ color: SECONDARY_PURPLE, fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "RM Comment",
      dataIndex: "comment",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = LIGHT_YELLOW;
        let text = status;
        if (status === "pendingChecker") { color = ACCENT_LIME; text = "Pending Checker"; }
        else if (status === "approved") { color = ACCENT_LIME; text = "Approved"; }
        else if (status === "rejected") { color = HIGHLIGHT_GOLD; text = "Rejected"; }
        return <Tag className="status-tag" style={{ color, borderColor: color }}>{text}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size={4}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => window.open(record.fileUrl, "_blank")}
            disabled={!record.fileUrl}
          >
            View
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleDocStatusChange(record.docIdx, "approved")}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDocStatusChange(record.docIdx, "rejected")}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  // Check if all docs are approved for overall checklist approval
  const allDocsApproved = docs.length > 0 && docs.every(doc => doc.status === "approved");

  return (
    <>
      <style>{customStyles}</style>
      <Modal
        title={`Review Checklist — ${checklist?.title || ""}`}
        open={open}
        onCancel={onClose}
        width={1000}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={downloadChecklist}>
            Download Checklist
          </Button>,
          <Button key="return" type="default" onClick={() => submitCheckerAction("returned")}>
            Return to RM
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => submitCheckerAction("approved")}
            disabled={!allDocsApproved}
          >
            Submit to Checker
          </Button>,
        ]}
      >
        <Card size="small">
          <Descriptions column={2}>
            <Descriptions.Item label="DCL No">{checklist?._id}</Descriptions.Item>
            <Descriptions.Item label="Title">{checklist?.title}</Descriptions.Item>
            <Descriptions.Item label="Loan Type">{checklist?.loanType}</Descriptions.Item>
            <Descriptions.Item label="Created By">{checklist?.createdBy?.name}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Progress Bar Section - Added Here */}
        <div
          style={{
            padding: "16px",
            background: "#f7f9fc",
            borderRadius: 8,
            border: "1px solid #e0e0e0",
            margin: "16px 0",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: "700", color: PRIMARY_BLUE }}>
              Total Documents: {total}
            </div>
            <div style={{ fontWeight: "700", color: LIGHT_YELLOW }}>
              Pending: {pending}
            </div>
            <div style={{ fontWeight: "700", color: ACCENT_LIME }}>
              Approved: {approved}
            </div>
            <div style={{ fontWeight: "700", color: HIGHLIGHT_GOLD }}>
              Rejected: {rejected}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: "100%", height: 12, background: "#e0e0e0", borderRadius: 50 }}>
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: PRIMARY_BLUE,
                borderRadius: 50,
                transition: "width 0.4s ease",
              }}
            ></div>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: 4,
              fontWeight: "700",
              color: PRIMARY_BLUE,
            }}
          >
            {progressPercent}% Approved
          </div>
        </div>

        <h3 style={{ marginTop: 16 }}>Documents</h3>
        <Table rowKey="docIdx" columns={columns} dataSource={docs} pagination={false} />

        <h3 style={{ marginTop: 16 }}>Creator General Comment</h3>
        <Input.TextArea
          rows={4}
          value={checkerComment}
          onChange={(e) => setCheckerComment(e.target.value)}
          placeholder="Enter your comment for the checklist"
          style={{ marginBottom: 12 }}
        />

        <Upload beforeUpload={handleAdditionalUpload} multiple showUploadList>
          <Button icon={<UploadOutlined />}>Upload Additional Documents</Button>
        </Upload>
      </Modal>
    </>
  );
};

export default CreatorQueueChecklistModal;