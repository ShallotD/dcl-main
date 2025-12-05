import React, { useState, useMemo } from "react";
import { Table, Button, Divider, Tag, Spin, Empty } from "antd";
import ChecklistsPage from "./ChecklistsPage.jsx";
import CreatorQueueChecklistModal from "../../components/modals/CreatorQueueChecklistModal.jsx";
import { useGetChecklistsQuery } from "../../api/checklistApi";

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";
const COMPLETED_GREEN = "#52c41a";

const Completed = ({ userId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

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

  // Filter for approved (completed) checklists
  const completedChecklists = useMemo(() => {
    return checklists.filter((c) => c.status === "approved");
  }, [checklists]);

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
  `;

  const columns = [
    {
      title: "DCL No",
      dataIndex: "dclNo",
      width: 200,
      render: (text, record) => (
        <span style={{
          fontWeight: "bold",
          color: PRIMARY_BLUE,
          backgroundColor: record.createdBy?._id === userId ? LIGHT_YELLOW + "40" : "transparent",
          padding: "4px 8px",
          borderRadius: 4,
          display: "inline-block"
        }}>
          {text}
        </span>
      ),
    },
    {
      title: "Customer Number",
      dataIndex: "customerNumber",
      width: 180,
      render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span>,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      width: 140,
    },
    {
      title: "Assigned RM",
      dataIndex: "assignedToRM",
      width: 120,
      render: (rm) => <span style={{ color: PRIMARY_BLUE, fontWeight: 500 }}>{rm?.name || "Not Assigned"}</span>,
    },
    {
      title: "# Docs",
      dataIndex: "documents",
      width: 80,
      align: "center",
      render: (docs) => (
        <Tag
          style={{
            backgroundColor: COMPLETED_GREEN + "20",
            color: COMPLETED_GREEN,
            fontSize: 12,
            borderRadius: 999,
            fontWeight: "bold",
            border: `1px solid ${COMPLETED_GREEN}`,
            padding: "2px 8px"
          }}
        >
          {Array.isArray(docs) ? docs.length : 0}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: () => (
        <Tag
          color="success"
          style={{
            fontSize: 12,
            borderRadius: 999,
            fontWeight: "bold",
            padding: "4px 8px"
          }}
        >
          Completed
        </Tag>
      ),
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
          View
        </Button>
      ),
    },
  ];

  const dataSource = Array.isArray(completedChecklists) ? completedChecklists : [];

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

      <Divider style={{ margin: "12px 0" }}>Completed Checklists</Divider>

      {isLoading || isFetching ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Spin tip="Loading completed checklists...">
            <div style={{ height: 40 }} />
          </Spin>
        </div>
      ) : error ? (
        <Empty description="Failed to load completed checklists. Check console for details." style={{ padding: 24 }} />
      ) : dataSource.length === 0 ? (
        <Empty description="No completed checklists found." style={{ padding: 24 }} />
      ) : (
        <Table
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
      )}

      {selectedChecklist && (
        <CreatorQueueChecklistModal
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => {
            setSelectedChecklist(null);
            refetch && refetch();
          }}
        />
      )}
    </div>
  );
};

export default Completed;