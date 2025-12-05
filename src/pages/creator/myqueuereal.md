import React, { useMemo, useState } from "react";
import { Button, Divider, Table, Tag, Spin, Empty, Tabs, Card } from "antd";
import ChecklistsPage from "./ChecklistsPage";
import CreatorQueueChecklistModal from "../../components/modals/CreatorQueueChecklistModal";
import { useGetChecklistsQuery } from "../../api/checklistApi";

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";

const Myqueue = ({ userId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // "current" or "previous"

  const { data: rawData, isLoading, isFetching, error, refetch } = useGetChecklistsQuery();

  // Normalize API response
  const checklists = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData.checklists)) return rawData.checklists;
    if (Array.isArray(rawData.data)) return rawData.data;
    if (Array.isArray(rawData.items)) return rawData.items;
    return [];
  }, [rawData]);

  // Current Queue: Items submitted by RM (pending_creator_review)
  const currentQueue = useMemo(() => {
    return checklists.filter((c) => {
      const isAssigned =
        c.assignedToCoChecker?._id === userId ||
        c.assignedToCoChecker === userId ||
        c.createdBy?._id === userId ||
        c.createdBy === userId ||
        c.assignedToChecker?._id === userId ||
        c.assignedToChecker === userId;

      return isAssigned && c.status === "pending_creator_review";
    });
  }, [checklists, userId]);

  // Previous Queue: Items returned by Checker (returned_by_checker)
  const previousQueue = useMemo(() => {
    return checklists.filter((c) => {
      const isAssigned =
        c.assignedToCoChecker?._id === userId ||
        c.assignedToCoChecker === userId ||
        c.createdBy?._id === userId ||
        c.createdBy === userId ||
        c.assignedToChecker?._id === userId ||
        c.assignedToChecker === userId;

      return isAssigned && c.status === "returned_by_checker";
    });
  }, [checklists, userId]);

  // Custom table styles
  const customTableStyles = `
    .ant-table-wrapper { 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 10px 30px rgba(22, 70, 121, 0.08); 
      border: 1px solid #e0e0e0; 
    }
    .ant-table-thead > tr > th { 
      background-color: #f7f7f7 !important; 
      color: ${PRIMARY_BLUE} !important; 
      font-weight: 700; 
      font-size: 15px; 
      padding: 16px 16px !important; 
      border-bottom: 3px solid ${ACCENT_LIME} !important; 
      border-right: none !important; 
    }
    .ant-table-tbody > tr > td { 
      border-bottom: 1px solid #f0f0f0 !important; 
      border-right: none !important; 
      padding: 14px 16px !important; 
      font-size: 14px; 
      color: #333; 
    }
    .ant-table-tbody > tr.ant-table-row:hover > td { 
      background-color: rgba(181, 211, 52, 0.1) !important; 
      cursor: pointer; 
    }
    .ant-table-bordered .ant-table-container, 
    .ant-table-bordered .ant-table-tbody > tr > td, 
    .ant-table-bordered .ant-table-thead > tr > th { 
      border: none !important; 
    }
    .ant-pagination .ant-pagination-item-active { 
      background-color: ${ACCENT_LIME} !important; 
      border-color: ${ACCENT_LIME} !important; 
    }
    .ant-pagination .ant-pagination-item-active a { 
      color: ${PRIMARY_BLUE} !important; 
      font-weight: 600; 
    }
    .ant-pagination .ant-pagination-item:hover { 
      border-color: ${ACCENT_LIME} !important; 
    }
    .ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link, 
    .ant-pagination .ant-pagination-next:hover .ant-pagination-item-link { 
      color: ${ACCENT_LIME} !important; 
    }
    .ant-pagination .ant-pagination-options .ant-select-selector { 
      border-radius: 8px !important; 
    }
    .queue-badge { 
      margin-left: 8px; 
      font-size: 12px; 
      font-weight: bold; 
      border-radius: 10px; 
    }
    .current-queue-table .ant-table-tbody > tr > td { 
      background-color: rgba(252, 215, 22, 0.05); 
    }
    .previous-queue-table .ant-table-tbody > tr > td { 
      background-color: rgba(126, 100, 150, 0.05); 
    }
  `;

  // Base columns shared by both tables
  const baseColumns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      width: 200, 
      render: (text) => <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span> 
    },
    { 
      title: "Customer Number", 
      dataIndex: "customerNumber", 
      width: 180, 
      render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span> 
    },
    { 
      title: "Loan Type", 
      dataIndex: "loanType", 
      width: 140 
    },
    { 
      title: "Assigned RM", 
      dataIndex: "assignedToRM", 
      width: 120, 
      render: (rm) => <span style={{ color: PRIMARY_BLUE, fontWeight: 500 }}>{rm?.name || "Not Assigned"}</span> 
    },
    { 
      title: "# Docs", 
      dataIndex: "documents", 
      width: 80, 
      align: "center", 
      render: (docs) => (
        <Tag 
          color={LIGHT_YELLOW} 
          style={{ 
            fontSize: 12, 
            borderRadius: 999, 
            fontWeight: "bold", 
            color: PRIMARY_BLUE, 
            border: `1px solid ${HIGHLIGHT_GOLD}` 
          }}
        >
          {Array.isArray(docs) ? docs.length : 0}
        </Tag>
      ) 
    },
    { 
      title: "Actions", 
      width: 100, 
      render: (_, record) => (
        <Button 
          size="small" 
          type="link" 
          onClick={() => setSelectedChecklist(record)} 
          style={{ 
            color: SECONDARY_PURPLE, 
            fontWeight: "bold", 
            fontSize: 13, 
            borderRadius: 6, 
            "--antd-wave-shadow-color": ACCENT_LIME 
          }}
        >
          Review
        </Button>
      ) 
    }
  ];

  // Current Queue Columns (from RM)
  const currentQueueColumns = [
    ...baseColumns.slice(0, 5), // All base columns except actions
    {
      title: "Status",
      width: 120,
      render: () => (
        <Tag 
          color="orange" 
          style={{ 
            fontSize: 12, 
            borderRadius: 999, 
            fontWeight: "bold", 
            padding: "4px 8px" 
          }}
        >
          From RM
        </Tag>
      )
    },
    {
      title: "Submitted",
      width: 120,
      render: (_, record) => (
        <span style={{ fontSize: 12, color: "#666" }}>
          {new Date(record.updatedAt || record.createdAt).toLocaleDateString()}
        </span>
      )
    },
    baseColumns[5] // Add actions column
  ];

  // Previous Queue Columns (from Checker)
  const previousQueueColumns = [
    ...baseColumns.slice(0, 5), // All base columns except actions
    {
      title: "Status",
      width: 120,
      render: () => (
        <Tag 
          color="red" 
          style={{ 
            fontSize: 12, 
            borderRadius: 999, 
            fontWeight: "bold", 
            padding: "4px 8px" 
          }}
        >
          From Checker
        </Tag>
      )
    },
    {
      title: "Checker Comments",
      width: 200,
      render: (_, record) => (
        <span style={{ 
          color: "#ff4d4f", 
          fontStyle: "italic",
          fontSize: 12 
        }}>
          {record.checkerComments || "No comments provided"}
        </span>
      )
    },
    baseColumns[5] // Add actions column
  ];

  // Render content based on active tab
  const renderTable = () => {
    const isCurrentTab = activeTab === "current";
    const dataSource = isCurrentTab ? currentQueue : previousQueue;
    const columns = isCurrentTab ? currentQueueColumns : previousQueueColumns;
    const tableClass = isCurrentTab ? "current-queue-table" : "previous-queue-table";
    
    if (isLoading || isFetching) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Spin tip="Loading checklists..."><div style={{ height: 40 }} /></Spin>
        </div>
      );
    }

    if (error) {
      return (
        <Empty description="Failed to load checklists. Check console for details." style={{ padding: 24 }} />
      );
    }

    if (dataSource.length === 0) {
      const message = isCurrentTab 
        ? "No checklists submitted by Relationship Managers for review." 
        : "No checklists returned by Checker for re-evaluation.";
      return <Empty description={message} style={{ padding: 24 }} />;
    }

    return (
      <Table 
        className={tableClass}
        columns={columns} 
        dataSource={dataSource} 
        rowKey={(record) => record._id || record.id} 
        size="large" 
        pagination={{ 
          pageSize: 5, 
          showSizeChanger: true, 
          pageSizeOptions: ["5", "10", "20", "50"], 
          position: ["bottomCenter"] 
        }} 
        rowClassName={(record, index) => (index % 2 === 0 ? "bg-white" : "bg-gray-50")}
      />
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <style>{customTableStyles}</style>

      {drawerOpen && (
        <ChecklistsPage 
          open={drawerOpen} 
          onClose={() => { 
            setDrawerOpen(false); 
            refetch && refetch(); 
          }} 
          coCreatorId={userId} 
        />
      )}

      <Divider style={{ margin: "12px 0" }}>My Queue</Divider>

      {/* Tabs for Current and Previous Queues */}
      <Card 
        style={{ 
          borderRadius: 12, 
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: `1px solid ${ACCENT_LIME}20`
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "current",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  Current Queue (From RM)
                  <Tag 
                    color="orange" 
                    className="queue-badge"
                    style={{ marginLeft: 8 }}
                  >
                    {currentQueue.length}
                  </Tag>
                </span>
              ),
              children: (
                <div style={{ marginTop: 16 }}>
                  <p style={{ 
                    color: "#666", 
                    marginBottom: 16,
                    padding: "8px 12px",
                    backgroundColor: `${HIGHLIGHT_GOLD}15`,
                    borderRadius: 6,
                    borderLeft: `4px solid ${HIGHLIGHT_GOLD}`
                  }}>
                    <strong>Status:</strong> <Tag color="orange">pending_creator_review</Tag> | 
                    Checklists submitted by Relationship Managers requiring your review. 
                    Review RM uploads, approve/reject documents, and submit to Checker.
                  </p>
                  {renderTable()}
                </div>
              )
            },
            {
              key: "previous",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  Previous Queue (From Checker)
                  <Tag 
                    color="red" 
                    className="queue-badge"
                    style={{ marginLeft: 8 }}
                  >
                    {previousQueue.length}
                  </Tag>
                </span>
              ),
              children: (
                <div style={{ marginTop: 16 }}>
                  <p style={{ 
                    color: "#666", 
                    marginBottom: 16,
                    padding: "8px 12px",
                    backgroundColor: `${SECONDARY_PURPLE}15`,
                    borderRadius: 6,
                    borderLeft: `4px solid ${SECONDARY_PURPLE}`
                  }}>
                    <strong>Status:</strong> <Tag color="red">returned_by_checker</Tag> | 
                    Checklists returned by Checker for re-evaluation. 
                    Review Checker comments, fix issues, and resubmit.
                  </p>
                  {renderTable()}
                </div>
              )
            }
          ]}
        />
      </Card>

      {selectedChecklist && (
        <CreatorQueueChecklistModal 
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => { 
            setSelectedChecklist(null); 
            refetch && refetch(); 
          }}
          sourceType={activeTab === "current" ? "from_rm" : "from_checker"}
        />
      )}
    </div>
  );
};

export default Myqueue;