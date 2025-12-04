import React, { useState } from "react";
import { Button, Divider, Table, Tag } from "antd";
import ChecklistsPage from "./ChecklistsPage";
import ReviewChecklistModal from "../../components/modals/ReviewChecklistModal";
import { useGetChecklistsQuery } from "../../api/checklistApi";

// Theme Colors (Defined here for the main page table styling)
const PRIMARY_BLUE = "#164679"; // Dark Blue/Navy
const ACCENT_LIME = "#b5d334"; // Lime/Light Green
const HIGHLIGHT_GOLD = "#fcb116"; // Gold / Yellow-orange
const LIGHT_YELLOW = "#fcd716"; // Light yellow
const SECONDARY_PURPLE = "#7e6496"; // Purple / Accent shade

/* -------------------------------------------------------------------
   ⭐ MAIN PAGE: CoChecklistPage
------------------------------------------------------------------- */
const CoChecklistPage = ({ userId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const { data: checklists = [], refetch } = useGetChecklistsQuery();

  // Filter to show checklists created by the current user (Co-Creator)
  const myChecklists = checklists.filter((c) => c.createdBy?._id === userId);

  // Custom CSS is injected here since it styles this specific Table
  const customTableStyles = `
    .ant-table-wrapper {
        border-radius: 12px;
        overflow: hidden; /* Ensures border-radius applies to all corners including header */
        box-shadow: 0 10px 30px rgba(22, 70, 121, 0.08); /* Lighter, more subtle shadow */
        border: 1px solid #e0e0e0; /* Define a light, crisp outer border */
    }

    /* MODERN Header Styling: Light background, strong text, and thick accent line */
    .ant-table-thead > tr > th {
        background-color: #f7f7f7 !important; /* Very light gray header */
        color: ${PRIMARY_BLUE} !important;
        font-weight: 700;
        font-size: 15px;
        padding: 16px 16px !important;
        border-bottom: 3px solid ${ACCENT_LIME} !important; /* Thicker accent line */
        border-right: none !important; /* Remove vertical header lines */
    }
    
    /* Row Separators Only (Horizontal) */
    .ant-table-tbody > tr > td {
        border-bottom: 1px solid #f0f0f0 !important; /* Light horizontal separator */
        border-right: none !important; /* Remove vertical dividers for a cleaner look */
        padding: 14px 16px !important;
        font-size: 14px;
        color: #333; /* Softer text color */
    }

    .ant-table-tbody > tr.ant-table-row:hover > td {
        background-color: rgba(181, 211, 52, 0.1) !important; /* Light lime hover effect */
        cursor: pointer;
    }

    /* Remove Antd's default 'bordered' styling which creates heavy internal lines */
    .ant-table-bordered .ant-table-container, 
    .ant-table-bordered .ant-table-tbody > tr > td,
    .ant-table-bordered .ant-table-thead > tr > th {
        border: none !important;
    }

    /* Pagination Styling - Maintained from previous version */
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

  // Define columns array - LOGIC KEPT EXACTLY AS IS
  const columns = [
    {
      title: "DCL No",
      dataIndex: "dclNo",
      width: 200,
      render: (text) => (
        <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "custNo",
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
      ), // Use primary blue for RM name
    },
    {
      title: "Docs",
      dataIndex: "documents",
      width: 80,
      align: "center", // Center align number of documents
      render: (docs) => (
        <Tag
          color={LIGHT_YELLOW} // Using a light background for count
          style={{
            fontSize: 12,
            borderRadius: 999, // Pill shape for modern look
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
            // Using the calculated background color for the Antd color prop
            color={tagColor}
            style={{
              fontSize: 12,
              borderRadius: 999, // Pill shape for modern look
              fontWeight: "bold",
              padding: "4px 8px",
              color: PRIMARY_BLUE, // Dark blue text for better contrast
              // Overriding the background for a softer look
              backgroundColor: bgColor + "40", // Light background tint
              borderColor: bgColor,
            }}
          >
            {tagText}
          </Tag>
        );
      },
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
            color: SECONDARY_PURPLE, // Use purple for link button
            fontWeight: "bold",
            fontSize: 13,
            borderRadius: 6,
            // Add a hover effect for better UX
            "--antd-wave-shadow-color": ACCENT_LIME, // Custom Antd wave color
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Button type="primary" size="small" onClick={() => setDrawerOpen(true)}>
        Create New DCL
      </Button>

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
        columns={columns} // Using the defined columns array
        dataSource={myChecklists}
        rowKey="_id"
        size="large" // Increased size for better readability
        // IMPORTANT UX CHANGE: Removed 'bordered' to allow for modern border styling via CSS
        pagination={{
          pageSize: 5,
          showSizeChanger: true, // Allow user to change page size
          pageSizeOptions: ["5", "10", "20", "50"], // Options for page size
          position: ["bottomCenter"], // Center the pagination
        }}
        // Use rowClassName for subtle alternating row colors (good UX)
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }
      />

      {selectedChecklist && (
        <ReviewChecklistModal // ⭐ The separate component is used here
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => setSelectedChecklist(null)}
        />
      )}
    </div>
  );
};

export default CoChecklistPage;
