import React, { useMemo, useState, useEffect } from "react";
import { Button, Divider, Table, Tag, Spin, Empty, Tabs, Card } from "antd";
import ChecklistsPage from "./ChecklistsPage";
import CreatorQueueChecklistModal from "../../components/modals/CreatorQueueChecklistModal";
// import { useGetChecklistsQuery } from "../../api/checklistApi";

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";

// MOCK DATA
const MOCK_CHECKLISTS = [
  {
    _id: "1",
    dclNo: "DCL-2024-001",
    customerNumber: "CUST001",
    customerName: "Alpha Enterprises Ltd",
    loanType: "Business Loan",
    title: "Business Expansion Loan",
    assignedToRM: { _id: "rm1", name: "John Kamau", email: "john.kamau@ncba.co.ke" },
    assignedToCoChecker: { _id: "current_user", name: "Creator User" },
    createdBy: { _id: "creator1", name: "Sarah Wangui", email: "sarah.w@ncba.co.ke" },
    status: "pending_creator_review",
    priority: "high",
    slaExpiry: "2024-12-20T23:59:59Z",
    rmGeneralComment: "All documents uploaded as requested. Customer awaiting approval.",
    checkerComments: "",
    createdAt: "2024-12-01T09:30:00Z",
    updatedAt: "2024-12-15T14:20:00Z",
    documents: [
      {
        category: "Business Registration",
        docList: [
          { 
            _id: "doc1_1", 
            name: "Certificate of Incorporation", 
            status: "uploaded", 
            fileUrl: "https://example.com/doc1.pdf",
            rmComment: "Uploaded certified copy",
            uploadedAt: "2024-12-15T14:15:00Z"
          },
          { 
            _id: "doc1_2", 
            name: "Business Permit", 
            status: "uploaded", 
            fileUrl: "https://example.com/doc2.pdf",
            rmComment: "Valid until Dec 2025",
            uploadedAt: "2024-12-15T14:18:00Z"
          }
        ]
      }
    ]
  },
  {
    _id: "2",
    dclNo: "DCL-2024-003",
    customerNumber: "CUST003",
    customerName: "Premium Motors Ltd",
    loanType: "Asset Finance",
    title: "Fleet Vehicle Purchase",
    assignedToRM: { _id: "rm2", name: "Jane Akinyi", email: "jane.a@ncba.co.ke" },
    assignedToCoChecker: { _id: "current_user", name: "Creator User" },
    createdBy: { _id: "creator2", name: "David Omondi", email: "david.o@ncba.co.ke" },
    status: "pending_creator_review",
    priority: "medium",
    slaExpiry: "2024-12-22T23:59:59Z",
    rmGeneralComment: "Vehicle quotations attached. Customer ready to proceed.",
    checkerComments: "",
    createdAt: "2024-12-05T11:15:00Z",
    updatedAt: "2024-12-16T10:45:00Z",
    documents: [
      {
        category: "Vehicle Documents",
        docList: [
          { 
            _id: "doc3_1", 
            name: "Proforma Invoice", 
            status: "uploaded", 
            fileUrl: "https://example.com/doc4.pdf",
            rmComment: "From Toyota Kenya",
            uploadedAt: "2024-12-16T10:30:00Z"
          }
        ]
      }
    ]
  },
  {
    _id: "3",
    dclNo: "DCL-2024-002",
    customerNumber: "CUST002",
    customerName: "Greenfield Developers",
    loanType: "Mortgage",
    title: "Residential Mortgage",
    assignedToRM: { _id: "rm1", name: "John Kamau", email: "john.kamau@ncba.co.ke" },
    assignedToCoChecker: { _id: "current_user", name: "Creator User" },
    assignedToChecker: { _id: "checker1", name: "Michael Chengo", email: "michael.c@ncba.co.ke" },
    createdBy: { _id: "creator1", name: "Sarah Wangui", email: "sarah.w@ncba.co.ke" },
    status: "returned_by_checker",
    priority: "high",
    slaExpiry: "2024-12-25T23:59:59Z",
    rmGeneralComment: "All property documents provided",
    checkerComments: "Missing valuation report for the property.",
    returnedBy: { _id: "checker1", name: "Michael Chengo" },
    returnedAt: "2024-12-16T16:30:00Z",
    createdAt: "2024-12-02T14:20:00Z",
    updatedAt: "2024-12-16T16:30:00Z",
    documents: [
      {
        category: "Property Documents",
        docList: [
          { 
            _id: "doc5_1", 
            name: "Title Deed", 
            status: "approved", 
            fileUrl: "https://example.com/doc8.pdf",
            rmComment: "Original scanned",
            checkerComment: "",
            uploadedAt: "2024-12-10T11:20:00Z"
          }
        ]
      }
    ]
  }
];

const Myqueue = ({ userId = "current_user" }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(true);
  const [mockData, setMockData] = useState([]);

  // Load data
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      const userChecklists = MOCK_CHECKLISTS.filter((c) => {
        const isAssigned =
          c.assignedToCoChecker?._id === userId ||
          c.assignedToCoChecker === userId ||
          c.createdBy?._id === userId ||
          c.createdBy === userId;
        
        return isAssigned;
      });
      
      setMockData(userChecklists);
      setLoading(false);
    }, 300);
  }, [userId]);

  // Current Queue
  const currentQueue = useMemo(() => {
    return mockData.filter((c) => c.status === "pending_creator_review");
  }, [mockData]);

  // Previous Queue
  const previousQueue = useMemo(() => {
    return mockData.filter((c) => c.status === "returned_by_checker");
  }, [mockData]);

  // Refetch function
  const refetch = () => {
    setLoading(true);
    setTimeout(() => {
      setMockData([...MOCK_CHECKLISTS]);
      setLoading(false);
    }, 200);
  };

  // Table styles
  const customTableStyles = `
    .myqueue-table .ant-table-wrapper { 
      border-radius: 8px; 
      overflow: hidden; 
      border: 1px solid #e0e0e0; 
    }
    .myqueue-table .ant-table-thead > tr > th { 
      background-color: #f8f9fa !important; 
      color: ${PRIMARY_BLUE} !important; 
      font-weight: 600; 
      padding: 12px 16px !important; 
    }
    .myqueue-table .ant-table-tbody > tr > td { 
      padding: 12px 16px !important; 
    }
    .myqueue-table .ant-table-tbody > tr:hover > td { 
      background-color: #f5f5f5 !important; 
    }
    .urgent-row {
      border-left: 4px solid #ff4d4f;
    }
    .high-row {
      border-left: 4px solid #faad14;
    }
  `;

  // Base columns
  const baseColumns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      width: 150, 
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.title}</div>
        </div>
      ) 
    },
    { 
      title: "Customer", 
      width: 180, 
      render: (_, record) => (
        <div>
          <div style={{ color: SECONDARY_PURPLE, fontWeight: 500 }}>{record.customerNumber}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.customerName}</div>
        </div>
      ) 
    },
    { 
      title: "Loan Type", 
      dataIndex: "loanType", 
      width: 120 
    },
    { 
      title: "RM", 
      dataIndex: "assignedToRM", 
      width: 100, 
      render: (rm) => <span style={{ color: PRIMARY_BLUE }}>{rm?.name || "-"}</span> 
    },
    { 
      title: "Docs", 
      dataIndex: "documents", 
      width: 60, 
      align: "center", 
      render: (docs) => {
        const totalDocs = docs?.reduce((total, category) => total + (category.docList?.length || 0), 0) || 0;
        return (
          <Tag 
            style={{ 
              fontSize: 11, 
              borderRadius: 12, 
              fontWeight: "bold", 
              color: PRIMARY_BLUE,
              background: LIGHT_YELLOW,
              border: "none"
            }}
          >
            {totalDocs}
          </Tag>
        );
      } 
    },
    { 
      title: "Actions", 
      width: 90, 
      render: (_, record) => (
        <Button 
          size="small" 
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedChecklist(record);
          }} 
          style={{ 
            background: ACCENT_LIME,
            borderColor: ACCENT_LIME,
            fontWeight: "bold", 
            fontSize: 12, 
            borderRadius: 4,
            padding: "0 8px",
            height: 24
          }}
        >
          Review
        </Button>
      ) 
    }
  ];

  // Current Queue Columns
  const currentQueueColumns = [
    ...baseColumns,
    {
      title: "Status",
      width: 100,
      render: () => (
        <Tag color="orange" style={{ fontSize: 11, borderRadius: 12 }}>
          From RM
        </Tag>
      )
    }
  ];

  // Previous Queue Columns
  const previousQueueColumns = [
    ...baseColumns,
    {
      title: "Status",
      width: 100,
      render: () => (
        <Tag color="red" style={{ fontSize: 11, borderRadius: 12 }}>
          Returned
        </Tag>
      )
    }
  ];

  // Render table
  const renderTable = () => {
    const isCurrentTab = activeTab === "current";
    const dataSource = isCurrentTab ? currentQueue : previousQueue;
    const columns = isCurrentTab ? currentQueueColumns : previousQueueColumns;
    
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40 }}>
          <Spin tip="Loading checklists...">
            <div style={{ height: 40 }} />
          </Spin>
        </div>
      );
    }

    if (dataSource.length === 0) {
      const message = isCurrentTab 
        ? "No checklists from RM for review" 
        : "No checklists returned by Checker";
      return (
        <Empty 
          description={message}
          style={{ padding: 40 }} 
        />
      );
    }

    return (
      <Table 
        className="myqueue-table"
        columns={columns} 
        dataSource={dataSource} 
        rowKey={(record) => record._id} 
        size="middle"
        pagination={{ 
          pageSize: 5, 
          showSizeChanger: false,
          size: "small"
        }} 
        rowClassName={(record) => {
          if (record.priority === "urgent") return "urgent-row";
          if (record.priority === "high") return "high-row";
          return "";
        }}
        onRow={(record) => ({
          onClick: () => setSelectedChecklist(record),
        })}
        style={{ marginTop: 16 }}
      />
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <style>{customTableStyles}</style>

      <Divider style={{ margin: "12px 0" }}>
        <span style={{ fontSize: 20, fontWeight: "bold", color: PRIMARY_BLUE }}>My Queue</span>
      </Divider>

      <Card 
        style={{ 
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "current",
              label: (
                <span>
                  Current Queue
                  {currentQueue.length > 0 && (
                    <span style={{ 
                      marginLeft: 8,
                      background: HIGHLIGHT_GOLD,
                      color: "white",
                      borderRadius: "50%",
                      padding: "0 6px",
                      fontSize: 12
                    }}>
                      {currentQueue.length}
                    </span>
                  )}
                </span>
              ),
              children: (
                <div style={{ marginTop: 8 }}>
                  <div style={{ 
                    padding: 12,
                    background: `${HIGHLIGHT_GOLD}15`,
                    borderRadius: 6,
                    marginBottom: 16,
                    fontSize: 14
                  }}>
                    <strong>Status:</strong> <Tag color="orange" size="small">pending_creator_review</Tag>
                    <span style={{ marginLeft: 8, color: "#666" }}>
                      Checklists from Relationship Managers
                    </span>
                  </div>
                  {renderTable()}
                </div>
              )
            },
            {
              key: "previous",
              label: (
                <span>
                  Previous Queue
                  {previousQueue.length > 0 && (
                    <span style={{ 
                      marginLeft: 8,
                      background: "#ff4d4f",
                      color: "white",
                      borderRadius: "50%",
                      padding: "0 6px",
                      fontSize: 12
                    }}>
                      {previousQueue.length}
                    </span>
                  )}
                </span>
              ),
              children: (
                <div style={{ marginTop: 8 }}>
                  <div style={{ 
                    padding: 12,
                    background: `${SECONDARY_PURPLE}15`,
                    borderRadius: 6,
                    marginBottom: 16,
                    fontSize: 14
                  }}>
                    <strong>Status:</strong> <Tag color="red" size="small">returned_by_checker</Tag>
                    <span style={{ marginLeft: 8, color: "#666" }}>
                      Checklists returned by Checker for fixes
                    </span>
                  </div>
                  {renderTable()}
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Modal */}
      {selectedChecklist && (
        <CreatorQueueChecklistModal 
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => { 
            setSelectedChecklist(null); 
            refetch(); 
          }}
          sourceType={activeTab === "current" ? "from_rm" : "from_checker"}
        />
      )}
    </div>
  );
};

export default Myqueue;