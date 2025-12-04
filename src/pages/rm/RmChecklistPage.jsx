import React, { useState } from "react";
import { Button, Divider, Table, Tag } from "antd";
import ChecklistsPage from "./ChecklistsPage";
import RmReviewChecklistModal from '../../components/modals/RmReviewChecklistModal';
import { useGetChecklistsQuery } from '../../api/checklistApi';

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";

const RmChecklistPage = ({ userId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const { data: checklists = [], refetch } = useGetChecklistsQuery();

  // Filter to show checklists created by the current user (Co-Creator)
  const myChecklists = checklists.filter((c) => c.assignedToRM?._id === userId);

  // Custom CSS for the table
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

  //Columns 
  const columns = [
    {
      title: "DCL No",
      dataIndex: "dclNo",
      width: 180,
      render: (text) => (
        <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span>
      ),
    },
    {
      title: "Loan Number",
      dataIndex: "loanNumber",
      width: 180,
      render: (text) => (
        <span style={{ fontWeight: "500", color: PRIMARY_BLUE }}>{text}</span>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      width: 180,
      render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span>,
    },
    { title: "Loan Type", dataIndex: "loanType", width: 140 },
    {
      title: "Assigned RM",
      dataIndex: "assignedToRM",
      width: 120,
      render: (rm) => (
        <span style={{ color: PRIMARY_BLUE, fontWeight: "500" }}>
          {rm?.name || "Not Assigned"}
        </span>
      ),
    },
    {
      title: "Docs",
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
            border: `1px solid ${HIGHLIGHT_GOLD}`,
          }}
        >
          {docs.length}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        let tagColor;
        let tagText;
        let bgColor;

        if (status === "approved") {
          tagText = "Approved";
          tagColor = ACCENT_LIME;
          bgColor = ACCENT_LIME;
        } else if (status === "rejected") {
          tagText = "Rejected";
          tagColor = HIGHLIGHT_GOLD;
          bgColor = HIGHLIGHT_GOLD;
        } else {
          tagText = "In Progress";
          tagColor = SECONDARY_PURPLE;
          bgColor = LIGHT_YELLOW;
        }

        return (
          <Tag
            color={tagColor}
            style={{
              fontSize: 12,
              borderRadius: 999,
              fontWeight: "bold",
              padding: "4px 8px",
              color: PRIMARY_BLUE,
              backgroundColor: bgColor + "40",
              borderColor: bgColor,
            }}
          >
            {tagText}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      {drawerOpen && (
        <ChecklistsPage
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            refetch();
          }}
          coCreatorId={userId}
        />
      )}

      <Divider style={{ margin: "12px 0" }}>Assigned Checklists</Divider>

      {/* Inject custom styles */}
      <style>{customTableStyles}</style>

      <Table
        columns={columns}
        dataSource={myChecklists}
        rowKey="_id"
        size="large"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          position: ["bottomCenter"],
        }}
        // Entire row clickable.
        onRow={(record) => ({
          onClick: () => setSelectedChecklist(record),
        })}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }
      />

      {selectedChecklist && (
        <RmReviewChecklistModal
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => setSelectedChecklist(null)}
        />
      )}
    </div>
  );
};

export default RmChecklistPage;
