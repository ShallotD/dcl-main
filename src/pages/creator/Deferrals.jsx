import React, { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Tag, 
  Input, 
  Select, 
  Modal, 
  message, 
  Card, 
  Spin,
  Empty,
  Divider
} from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const SECONDARY_PURPLE = "#7e6496";

const Deferrals = ({ userId }) => {
  const [deferrals, setDeferrals] = useState([]);
  const [selectedDeferral, setSelectedDeferral] = useState(null);
  const [creatorComment, setCreatorComment] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Mock data with proper structure
  const mockDeferralsData = [
    {
      _id: "1",
      customerNumber: "CUST001",
      dclNo: "DCL-2024-001",
      documentName: "Business Registration Certificate",
      deferralReason: "Client traveling, will provide next week",
      expiryDate: "2024-12-31T00:00:00.000Z",
      rmComments: "Client promised to provide upon return",
      status: "deferral_pending_creator_review",
      loanType: "Business Loan",
      assignedRM: { name: "John Doe" },
      createdAt: "2024-01-15T10:30:00.000Z"
    },
    {
      _id: "2",
      customerNumber: "CUST002",
      dclNo: "DCL-2024-002",
      documentName: "Latest Bank Statements",
      deferralReason: "Bank system down, cannot access statements",
      expiryDate: "2024-12-15T00:00:00.000Z",
      rmComments: "Bank IT issue, expecting resolution in 2 days",
      status: "deferral_pending_creator_review",
      loanType: "Personal Loan",
      assignedRM: { name: "Jane Smith" },
      createdAt: "2024-01-14T14:20:00.000Z"
    },
    {
      _id: "3",
      customerNumber: "CUST003",
      dclNo: "DCL-2024-003",
      documentName: "Tax Compliance Certificate",
      deferralReason: "KRA portal maintenance",
      expiryDate: "2024-12-20T00:00:00.000Z",
      rmComments: "Government portal issue",
      status: "deferral_pending_creator_review",
      loanType: "Mortgage",
      assignedRM: { name: "Robert Johnson" },
      createdAt: "2024-01-13T09:15:00.000Z"
    },
  ];

  useEffect(() => {
    console.log("Deferrals component mounted");
    console.log("UserId received:", userId);
    
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      console.log("Loading mock deferrals data:", mockDeferralsData);
      setDeferrals(mockDeferralsData);
      setLoading(false);
      console.log("Deferrals state set:", mockDeferralsData.length, "items");
    }, 1000);
  }, [userId]);

  const handleAction = async () => {
    console.log("Handle action called with:", {
      selectedDeferral,
      action,
      creatorComment,
      userId
    });

    if (!selectedDeferral) {
      message.error("No deferral selected");
      return;
    }

    if (!action) {
      message.error("Please select an action");
      return;
    }

    if (!creatorComment.trim()) {
      message.error("Please provide your comments");
      return;
    }

    try {
      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedDeferrals = deferrals.filter(d => d._id !== selectedDeferral._id);
      setDeferrals(updatedDeferrals);
      
      message.success(`Deferral ${action === "accept" ? "accepted" : "rejected"} successfully!`);
      
      console.log("Deferral processed:", {
        deferralId: selectedDeferral._id,
        action,
        creatorComment
      });
      
      // Reset form
      setSelectedDeferral(null);
      setCreatorComment("");
      setAction("");
      setLoading(false);
      
    } catch (err) {
      console.error("Error processing deferral:", err);
      message.error("Failed to process deferral");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer No",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 120,
      render: (text) => <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span>,
    },
    {
      title: "DCL No",
      dataIndex: "dclNo",
      key: "dclNo",
      width: 150,
      render: (text) => (
        <Tag 
          color="blue" 
          style={{ 
            fontWeight: "bold",
            borderColor: PRIMARY_BLUE,
            color: PRIMARY_BLUE,
            backgroundColor: `${PRIMARY_BLUE}10`
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
      width: 120,
    },
    {
      title: "Document",
      dataIndex: "documentName",
      key: "documentName",
      width: 200,
      render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span>,
    },
    {
      title: "Reason",
      dataIndex: "deferralReason",
      key: "reason",
      width: 250,
      render: (text) => (
        <div style={{ 
          whiteSpace: "normal",
          fontStyle: "italic",
          color: "#666"
        }}>
          {text}
        </div>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 120,
      render: (date) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const isExpired = expiryDate < today;
        
        return (
          <Tag 
            color={isExpired ? "red" : "green"}
            icon={isExpired ? <ExclamationCircleOutlined /> : null}
            style={{ fontWeight: "bold" }}
          >
            {expiryDate.toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      title: "RM",
      dataIndex: "assignedRM",
      key: "rm",
      width: 120,
      render: (rm) => <span style={{ color: PRIMARY_BLUE }}>{rm?.name || "N/A"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            console.log("Opening deferral:", record);
            setSelectedDeferral(record);
          }}
          style={{ 
            background: ACCENT_LIME,
            borderColor: ACCENT_LIME,
            borderRadius: 6
          }}
        >
          Review
        </Button>
      ),
    },
  ];

  // Custom table styles
  const tableStyles = `
    .deferrals-table .ant-table-thead > tr > th {
      background-color: #f8f9fa !important;
      color: ${PRIMARY_BLUE} !important;
      font-weight: 700 !important;
      border-bottom: 2px solid ${ACCENT_LIME} !important;
    }
    .deferrals-table .ant-table-tbody > tr:hover > td {
      background-color: rgba(22, 70, 121, 0.05) !important;
    }
  `;

  console.log("Current state:", {
    loading,
    deferralsCount: deferrals.length,
    selectedDeferral: !!selectedDeferral,
    action,
    creatorCommentLength: creatorComment.length
  });

  return (
    <div style={{ padding: 24, minHeight: "calc(100vh - 64px)" }}>
      <style>{tableStyles}</style>
      
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ margin: 0, color: PRIMARY_BLUE }}>Pending Deferrals</h2>
            <Tag 
              color="orange" 
              style={{ 
                fontSize: 14, 
                fontWeight: "bold",
                padding: "4px 12px"
              }}
            >
              {deferrals.length} Pending
            </Tag>
          </div>
        }
        style={{ 
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <p style={{ color: "#666", margin: 0 }}>
          Review deferral requests submitted by Relationship Managers. 
          Status: <Tag color="orange">deferral_pending_creator_review</Tag>
        </p>
      </Card>

      {loading ? (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: 60 
        }}>
          <Spin size="large" tip="Loading deferrals..." />
          <p style={{ marginTop: 16, color: "#666" }}>Fetching pending deferrals...</p>
        </div>
      ) : deferrals.length === 0 ? (
        <Empty
          description={
            <div>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No pending deferrals found</p>
              <p style={{ color: "#999" }}>All deferral requests have been reviewed</p>
            </div>
          }
          style={{ 
            padding: 40,
            background: "#fafafa",
            borderRadius: 8
          }}
        />
      ) : (
        <div className="deferrals-table">
          <Table
            columns={columns}
            dataSource={deferrals}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["5", "10", "20"],
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} deferrals`
            }}
            style={{ 
              background: "white",
              borderRadius: 8,
              overflow: "hidden"
            }}
          />
        </div>
      )}

      {/* Review Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: "bold", color: PRIMARY_BLUE }}>
              Review Deferral Request
            </span>
            {selectedDeferral && (
              <Tag color="blue" style={{ fontWeight: "bold" }}>
                {selectedDeferral.dclNo}
              </Tag>
            )}
          </div>
        }
        open={!!selectedDeferral}
        onCancel={() => {
          console.log("Closing modal");
          setSelectedDeferral(null);
          setCreatorComment("");
          setAction("");
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setSelectedDeferral(null);
              setCreatorComment("");
              setAction("");
            }}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleAction}
            disabled={!action || !creatorComment.trim() || loading}
            loading={loading}
            icon={action === "accept" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            style={{ 
              background: action === "accept" ? ACCENT_LIME : HIGHLIGHT_GOLD,
              borderColor: action === "accept" ? ACCENT_LIME : HIGHLIGHT_GOLD
            }}
          >
            {action === "accept" ? "Accept Deferral" : "Reject Deferral"}
          </Button>,
        ]}
        width={700}
        style={{ top: 20 }}
      >
        {selectedDeferral && (
          <div style={{ padding: "16px 0" }}>
            {/* Deferral Details */}
            <div style={{ 
              background: "#f8f9fa", 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 24
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: PRIMARY_BLUE }}>Customer:</strong>{" "}
                    {selectedDeferral.customerNumber}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: PRIMARY_BLUE }}>Loan Type:</strong>{" "}
                    {selectedDeferral.loanType}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: PRIMARY_BLUE }}>Document:</strong>{" "}
                    {selectedDeferral.documentName}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong style={{ color: PRIMARY_BLUE }}>Assigned RM:</strong>{" "}
                    {selectedDeferral.assignedRM?.name}
                  </p>
                </div>
              </div>
              
              <Divider style={{ margin: "12px 0" }} />
              
              <div>
                <p style={{ margin: "8px 0" }}>
                  <strong style={{ color: PRIMARY_BLUE }}>Deferral Reason:</strong>
                </p>
                <Card size="small" style={{ background: "#fff", marginBottom: 12 }}>
                  {selectedDeferral.deferralReason}
                </Card>
                
                <p style={{ margin: "8px 0" }}>
                  <strong style={{ color: PRIMARY_BLUE }}>RM Comments:</strong>
                </p>
                <Card size="small" style={{ background: "#fff" }}>
                  {selectedDeferral.rmComments}
                </Card>
              </div>
            </div>

            {/* Expiry Warning */}
            {new Date(selectedDeferral.expiryDate) < new Date() && (
              <div style={{ 
                background: "#fff2f0", 
                border: "1px solid #ffccc7",
                padding: 12,
                borderRadius: 6,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                  This deferral has expired on {new Date(selectedDeferral.expiryDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Decision Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block", 
                marginBottom: 8, 
                fontWeight: "bold",
                color: PRIMARY_BLUE
              }}>
                Your Decision:
              </label>
              <Select
                style={{ width: "100%", marginBottom: 16 }}
                value={action}
                onChange={(value) => {
                  console.log("Action selected:", value);
                  setAction(value);
                }}
                placeholder="Select your decision"
                size="large"
              >
                <Option value="accept">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircleOutlined style={{ color: ACCENT_LIME }} />
                    <span>Accept Deferral</span>
                  </div>
                </Option>
                <Option value="reject">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CloseCircleOutlined style={{ color: HIGHLIGHT_GOLD }} />
                    <span>Reject Deferral</span>
                  </div>
                </Option>
              </Select>
            </div>

            {/* Comments Section */}
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: 8, 
                fontWeight: "bold",
                color: PRIMARY_BLUE
              }}>
                Your Comments:
              </label>
              <TextArea
                rows={4}
                value={creatorComment}
                onChange={(e) => {
                  console.log("Comment changed:", e.target.value);
                  setCreatorComment(e.target.value);
                }}
                placeholder="Enter your comments and reasoning for this decision..."
                style={{ 
                  marginBottom: 16,
                  borderRadius: 6
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Deferrals;