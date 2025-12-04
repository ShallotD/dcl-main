// // src/components/new/cochecker/layout/ReportsPage.jsx
// import React from "react";
// import { Table, Spin, Alert } from "antd";
// import { useSelector } from "react-redux";
// import { useGetRMQueueQuery } from '../../api/queueApi'; // Correct path

// const ReportsPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const rmId = user?.id;

//   const { data, error, isLoading } = useGetRMQueueQuery(rmId);

//   if (isLoading) return <Spin size="large" />;
//   if (error) return <Alert type="error" message="Error loading reports." />;

//   const columns = [
//     { title: "DCL Number", dataIndex: "dclNo", key: "dclNo" },
//     { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
//     { title: "Loan Type", dataIndex: "loanType", key: "loanType" },
//     { title: "Status", dataIndex: "status", key: "status" },
//   ];

//   return <Table rowKey="_id" dataSource={data} columns={columns} />;
// };

// export default ReportsPage;

import React, { useState, useMemo } from "react";
import { Table, Divider, Button, Spin, Empty, Tag, Tabs, Switch } from "antd";
import {useGetChecklistsQuery } from "../../api/checklistApi";
import CheckerReviewChecklistModal from "../../components/modals/CheckerReviewChecklistModal";

const { TabPane } = Tabs;

const PRIMARY_BLUE = "#164679";
const SECONDARY_PURPLE = "#7e6496";
const LIGHT_ORANGE = "#ffe5b4";
const ACCENT_LIME = "#b5d334";

const ReportsPage = ({ userId }) => {
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  const { data: rawData = [], isLoading, isError, refetch } = useGetChecklistsQuery();

  // Normalize API response
  const checklists = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData.checklists)) return rawData.checklists;
    if (Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  // Helper to filter by role and optionally by completed status
  const filterChecklists = (role) => {
    let filtered = [];
    switch (role) {
      case "rm":
        filtered = checklists.filter((c) => c.assignedToRM?._id === userId);
        break;
      case "coCreator":
        filtered = checklists.filter((c) => c.assignedToCoChecker?._id === userId);
        break;
      case "checker":
        filtered = checklists.filter((c) => {
          if (!c) return false;
          if (c.assignedToChecker?._id === userId) return true;
          if (c.assignedToChecker && c.assignedToChecker === userId) return true;
          if (Array.isArray(c.checkerReviews) && c.checkerReviews.some((r) => r.checkerId === userId)) return true;
          return false;
        });
        break;
      default:
        filtered = [];
    }
    if (showCompletedOnly) {
      filtered = filtered.filter((c) => c.status === "approved");
    }
    return filtered;
  };

  const columns = [
    { title: "DCL No", dataIndex: "dclNo", render: (text) => <span style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>{text}</span> },
    { title: "Customer Number", dataIndex: "customerNumber", render: (text) => <span style={{ color: SECONDARY_PURPLE }}>{text}</span> },
    { title: "Loan Type", dataIndex: "loanType" },
    { title: "# Docs", dataIndex: "documents", render: (docs) => (
      <Tag color={LIGHT_ORANGE} style={{ fontWeight: "bold", borderRadius: 12 }}>
        {Array.isArray(docs) ? docs.length : 0}
      </Tag>
    )},
    { title: "Status", dataIndex: "status", render: (status) => {
      let color = ACCENT_LIME;
      let text = status;
      if (status === "approved") { color = ACCENT_LIME; text = "Approved"; }
      else if (status === "rejected") { color = "#fcb116"; text = "Rejected"; }
      else if (status === "co_creator_review") { color = "#7e6496"; text = "Co-Creator Review"; }
      else if (status === "rm_review") { color = "#b5d334"; text = "RM Review"; }
      else { color = SECONDARY_PURPLE; text = "In Progress"; }
      return <Tag color={color} style={{ fontWeight: "bold", borderRadius: 12 }}>{text}</Tag>;
    }},
    { title: "Actions", render: (_, record) => (
      <Button type="link" style={{ color: SECONDARY_PURPLE, fontWeight: "bold" }} onClick={() => setSelectedChecklist(record)}>View</Button>
    )}
  ];

  if (isLoading) return <Spin tip="Loading reports..." style={{ padding: 24 }} />;
  if (isError) return <Empty description="Error loading reports." style={{ padding: 24 }} />;

  return (
    <div style={{ padding: 16 }}>
      <Divider style={{ margin: "12px 0" }}>Reports</Divider>

      {/* Completed toggle */}
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={showCompletedOnly}
          onChange={setShowCompletedOnly}
          checkedChildren="Show Completed Only"
          unCheckedChildren="Show All"
        />
      </div>

      <Tabs defaultActiveKey="rm">
        <TabPane tab="RM Reports" key="rm">
          {filterChecklists("rm").length === 0 ? (
            <Empty description="No RM reports available." style={{ padding: 24 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filterChecklists("rm")}
              rowKey={(record) => record._id || record.id}
              pagination={{ pageSize: 5, showSizeChanger: true }}
            />
          )}
        </TabPane>

        <TabPane tab="Co-Creator Reports" key="coCreator">
          {filterChecklists("coCreator").length === 0 ? (
            <Empty description="No Co-Creator reports available." style={{ padding: 24 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filterChecklists("coCreator")}
              rowKey={(record) => record._id || record.id}
              pagination={{ pageSize: 5, showSizeChanger: true }}
            />
          )}
        </TabPane>

        <TabPane tab="Checker Reports" key="checker">
          {filterChecklists("checker").length === 0 ? (
            <Empty description="No Checker reports available." style={{ padding: 24 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filterChecklists("checker")}
              rowKey={(record) => record._id || record.id}
              pagination={{ pageSize: 5, showSizeChanger: true }}
            />
          )}
        </TabPane>
      </Tabs>

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

export default ReportsPage;

