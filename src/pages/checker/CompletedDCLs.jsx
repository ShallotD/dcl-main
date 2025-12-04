// import React, { useState } from "react";
// import { Button, Divider, Table, Tag } from "antd";
// import ChecklistsPage from "./ChecklistsPage.jsx"; // Same import as ActiveDCLs
// import ReviewChecklistModal from "../../components/modals/CheckerReviewChecklistModal.jsx"; // Same import as ActiveDCLs
// import { useGetChecklistsQuery } from "../../api/checklistApi.js" // Same import

// // Theme Colors
// const PRIMARY_BLUE = "#164679";
// const ACCENT_LIME = "#b5d334";
// const HIGHLIGHT_GOLD = "#fcb116";
// const LIGHT_YELLOW = "#fcd716";
// const SECONDARY_PURPLE = "#7e6496";

// const CompletedDCLs = ({ userId }) => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedChecklist, setSelectedChecklist] = useState(null);

//   const { data: checklists = [], refetch } = useGetChecklistsQuery();

//   // Show checklists that have been completed (approved/rejected) by the co-checker
//   const completedChecklists = checklists.filter(
//     (c) =>
//       c.assignedToCoChecker?._id === userId &&
//       (c.status === "approved" || c.status === "rejected")
//   );

//   // Custom table styles (same as ActiveDCLs)
//   const customTableStyles = `
//     .ant-table-wrapper { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(22, 70, 121, 0.08); border: 1px solid #e0e0e0; }
//     .ant-table-thead > tr > th { background-color: #f7f7f7 !important; color: ${PRIMARY_BLUE} !important; font-weight: 700; font-size: 15px; padding: 16px 16px !important; border-bottom: 3px solid ${ACCENT_LIME} !important; border-right: none !important; }
//     .ant-table-tbody > tr > td { border-bottom: 1px solid #f0f0f0 !important; border-right: none !important; padding: 14px 16px !important; font-size: 14px; color: #333; }
//     .ant-table-tbody > tr.ant-table-row:hover > td { background-color: rgba(181, 211, 52, 0.1) !important; cursor: pointer; }
//     .ant-table-bordered .ant-table-container, .ant-table-bordered .ant-table-tbody > tr > td, .ant-table-bordered .ant-table-thead > tr > th { border: none !important; }
//     .ant-pagination .ant-pagination-item-active { background-color: ${ACCENT_LIME} !important; border-color: ${ACCENT_LIME} !important; }
//     .ant-pagination .ant-pagination-item-active a { color: ${PRIMARY_BLUE} !important; font-weight: 600; }
//     .ant-pagination .ant-pagination-item:hover { border-color: ${ACCENT_LIME} !important; }
//     .ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
//     .ant-pagination .ant-pagination-next:hover .ant-pagination-item-link { color: ${ACCENT_LIME} !important; }
//     .ant-pagination .ant-pagination-options .ant-select-selector { border-radius: 8px !important; }
//   `;

//   const columns = [
//     {
//       title: "DCL No",
//       dataIndex: "dclNo",
//       width: 200,
//       render: (text) => <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span>,
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       width: 180,
//       render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span>,
//     },
//     { title: "Loan Type", dataIndex: "loanType", width: 140 },
//     {
//       title: "Assigned RM",
//       dataIndex: "assignedToRM",
//       width: 120,
//       render: (rm) => <span style={{ color: PRIMARY_BLUE, fontWeight: "500" }}>{rm?.name || "Not Assigned"}</span>,
//     },
//     {
//       title: "# Docs",
//       dataIndex: "documents",
//       width: 80,
//       align: "center",
//       render: (docs) => (
//         <Tag
//           color={LIGHT_YELLOW}
//           style={{ fontSize: 12, borderRadius: 999, fontWeight: "bold", color: PRIMARY_BLUE, border: `1px solid ${HIGHLIGHT_GOLD}` }}
//         >
//           {docs.length}
//         </Tag>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       width: 120,
//       render: (status) => {
//         let tagText = status === "approved" ? "Approved" : "Rejected";
//         let bgColor = status === "approved" ? ACCENT_LIME : HIGHLIGHT_GOLD;

//         return (
//           <Tag
//             color={bgColor}
//             style={{
//               fontSize: 12,
//               borderRadius: 999,
//               fontWeight: "bold",
//               padding: "4px 8px",
//               color: PRIMARY_BLUE,
//               backgroundColor: bgColor + "40",
//               borderColor: bgColor,
//             }}
//           >
//             {tagText}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       width: 100,
//       render: (_, record) => (
//         <Button
//           size="small"
//           type="link"
//           onClick={() => setSelectedChecklist(record)}
//           style={{
//             color: SECONDARY_PURPLE,
//             fontWeight: "bold",
//             fontSize: 13,
//             borderRadius: 6,
//             "--antd-wave-shadow-color": ACCENT_LIME,
//           }}
//         >
//           View
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 16 }}>
//       {drawerOpen && (
//         <ChecklistsPage
//           open={drawerOpen}
//           onClose={() => {
//             setDrawerOpen(false);
//             refetch();
//           }}
//           coCreatorId={userId}
//         />
//       )}

//       <Divider style={{ margin: "12px 0" }}>Completed Checklists</Divider>

//       <style>{customTableStyles}</style>

//       <Table
//         columns={columns}
//         dataSource={completedChecklists}
//         rowKey="_id"
//         size="large"
//         pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ["5", "10", "20", "50"], position: ["bottomCenter"] }}
//         rowClassName={(record, index) => (index % 2 === 0 ? "bg-white" : "bg-gray-50")}
//       />

//       {selectedChecklist && (
//         <ReviewChecklistModal
//           checklist={selectedChecklist}
//           open={!!selectedChecklist}
//           onClose={() => setSelectedChecklist(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default CompletedDCLs;
import React, { useState } from "react";
import { Table, Button, Divider, Tag } from "antd";
import ChecklistsPage from "./ChecklistsPage.jsx";
import CheckerReviewChecklistModal from "../../components/modals/CheckerReviewChecklistModal.jsx";
import { useGetChecklistsQuery } from "../../api/checklistApi";

const PRIMARY_BLUE = "#164679";
const SECONDARY_PURPLE = "#7e6496";
const LIGHT_GREEN = "#d4edda";
const HIGHLIGHT_YELLOW = "#fff3cd";

const CompletedDCLs = ({ userId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const { data: checklists = [], refetch, isLoading, isError } = useGetChecklistsQuery();

  // Filter for approved checklists
  const myCompleted = checklists.filter(c => c.status === "approved");

  const columns = [
    {
      title: "DCL No",
      dataIndex: "dclNo",
      render: (text, record) => (
        <span style={{
          fontWeight: "bold",
          color: PRIMARY_BLUE,
          backgroundColor: record.createdBy?._id === userId ? HIGHLIGHT_YELLOW : "transparent",
          padding: "2px 6px",
          borderRadius: 4
        }}>
          {text}
        </span>
      ),
    },
    {
      title: "Customer Number",
      dataIndex: "customerNumber",
      render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span>,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
    },
    {
      title: "Assigned RM",
      dataIndex: "assignedToRM",
      render: (rm) => <span style={{ color: PRIMARY_BLUE }}>{rm?.name || "Not Assigned"}</span>,
    },
    {
      title: "# Docs",
      dataIndex: "documents",
      render: (docs) => (
        <span style={{
          backgroundColor: LIGHT_GREEN,
          padding: "2px 8px",
          borderRadius: 12,
          fontWeight: "bold",
        }}>
          {docs.length}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => <Tag color="green">Completed</Tag>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          size="small"
          type="link"
          style={{ color: SECONDARY_PURPLE, fontWeight: "bold" }}
          onClick={() => setSelectedChecklist(record)}
        >
          View
        </Button>
      ),
    },
  ];

  if (isLoading) return <div>Loading completed DCLs...</div>;
  if (isError) return <div>Error loading completed DCLs.</div>;

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

      <Divider style={{ margin: "12px 0" }}>Completed DCLs</Divider>

      <Table
        columns={columns}
        dataSource={myCompleted}
        rowKey="_id"
        pagination={{ pageSize: 5, showSizeChanger: true }}
      />

      {selectedChecklist && (
        <CheckerReviewChecklistModal
          checklist={selectedChecklist}
          open={!!selectedChecklist}
          onClose={() => {
            setSelectedChecklist(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default CompletedDCLs;
