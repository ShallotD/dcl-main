// src/pages/Reports.jsx
import React, { useState, useMemo } from "react";
import {
  Tabs,
  Table,
  Input,
  DatePicker,
  Select,
  Space,
  Typography,
  Tag,
  Card,
} from "antd";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Search } = Input;

const MOCK_DCLS = [
  {
    id: "DCL-10001",
    customerNo: "458921",
    workstep: "WS-001",
    product: "Personal Loan",
    status: "Completed",
    completedDate: "2025-11-20",
  },
  {
    id: "DCL-10002",
    customerNo: "772194",
    workstep: "WS-002",
    product: "Home Loan",
    status: "Pending Checker",
    completedDate: null,
  },
  {
    id: "DCL-10003",
    customerNo: "993015",
    workstep: "WS-003",
    product: "Credit Card",
    status: "Deferred",
    completedDate: "2025-11-25",
  },
  {
    id: "DCL-10004",
    customerNo: "551002",
    workstep: "WS-004",
    product: "Car Loan",
    status: "Completed",
    completedDate: "2025-11-22",
  },
];

const MOCK_DEFERRALS = [
  // Post-approval deferrals (after DCL completed)
  {
    id: "DEF-001",
    customerNo: "458921",
    workstep: "WS-001",
    document: "Income Statement",
    reason: "Updated document needed",
    expiryDate: "2025-12-05",
    creatorComments: "Please submit ASAP",
    status: "Post-Approval",
    dateRequested: "2025-11-26",
  },
  {
    id: "DEF-002",
    customerNo: "993015",
    workstep: "WS-003",
    document: "Credit Report",
    reason: "Verification pending",
    expiryDate: "2025-12-10",
    creatorComments: "Need updated info",
    status: "Post-Approval",
    dateRequested: "2025-11-27",
  },

  // Pending approval deferrals (same as Deferrals page, non-actionable)
  {
    id: "DEF-003",
    customerNo: "772194",
    workstep: "WS-002",
    document: "CR12",
    reason: "Missing signature",
    expiryDate: "2025-12-15",
    creatorComments: "",
    status: "Pending Approval",
    dateRequested: "2025-11-28",
  },
];

// Helper to render status tags consistently
const STATUS_COLOR_MAP = {
  Completed: "green",
  "Pending Checker": "blue",
  Deferred: "orange",
  "Returned by Checker": "red",
  "Pending RM": "purple",
  "Post-Approval": "cyan",
  "Pending Approval": "gold",
};

export default function Reportss() {
  // Shared filters for tabs that need them
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  // Tab key state (optional if you want to keep filter per tab)
  const [activeTab, setActiveTab] = useState("postApproval");

  // Filtered Post-Approval Deferrals (Tab A)
  const filteredPostApprovalDeferrals = useMemo(() => {
    return MOCK_DEFERRALS.filter(
      (d) =>
        d.status === "Post-Approval" &&
        (searchText === "" ||
          d.customerNo.includes(searchText) ||
          d.workstep.toLowerCase().includes(searchText.toLowerCase())) &&
        (!dateRange ||
          (d.dateRequested &&
            dayjs(d.dateRequested).isBetween(
              dateRange[0],
              dateRange[1],
              "day",
              "[]"
            )))
    );
  }, [searchText, dateRange]);

  // Filtered Pending Approval Deferrals (Tab B) — no filters needed, show all with status Pending Approval
  const filteredPendingApprovalDeferrals = MOCK_DEFERRALS.filter(
    (d) => d.status === "Pending Approval"
  );

  // Filtered All DCLs (Tab C)
  const filteredAllDCLs = useMemo(() => {
    return MOCK_DCLS.filter(
      (d) =>
        (statusFilter === "All" || d.status === statusFilter) &&
        (searchText === "" ||
          d.customerNo.includes(searchText) ||
          d.workstep.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [statusFilter, searchText]);

  // Columns for each table
  const postApprovalColumns = [
    { title: "Customer No", dataIndex: "customerNo", key: "customerNo" },
    { title: "Workstep", dataIndex: "workstep", key: "workstep" },
    { title: "Document", dataIndex: "document", key: "document" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Creator Comments",
      dataIndex: "creatorComments",
      key: "creatorComments",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLOR_MAP[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  const pendingApprovalColumns = [
    { title: "Customer No", dataIndex: "customerNo", key: "customerNo" },
    { title: "Workstep", dataIndex: "workstep", key: "workstep" },
    { title: "Document", dataIndex: "document", key: "document" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Creator Comments",
      dataIndex: "creatorComments",
      key: "creatorComments",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLOR_MAP[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  const allDCLColumns = [
    { title: "Workstep", dataIndex: "workstep", key: "workstep" },
    { title: "Customer No", dataIndex: "customerNo", key: "customerNo" },
    { title: "Product", dataIndex: "product", key: "product" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLOR_MAP[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>DCL Reports</Title>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        {/* Post-approval Deferrals */}
        <TabPane tab="Post-approval Deferrals" key="postApproval">
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search by Customer No or Workstep"
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              allowEmpty={[true, true]}
            />
          </Space>

          <Table
            columns={postApprovalColumns}
            dataSource={filteredPostApprovalDeferrals}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </TabPane>

        {/* Pending Approval Deferrals */}
        <TabPane tab="Pending Approval Deferrals" key="pendingApproval">
          <Table
            columns={pendingApprovalColumns}
            dataSource={filteredPendingApprovalDeferrals}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </TabPane>

        {/* All DCLs */}
        <TabPane tab="All DCLs" key="allDCLs">
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search by Customer No or Workstep"
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              style={{ width: 200 }}
            >
              <Select.Option value="All">All Statuses</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Pending Checker">
                Pending Checker
              </Select.Option>
              <Select.Option value="Deferred">Deferred</Select.Option>
              <Select.Option value="Returned by Checker">
                Returned by Checker
              </Select.Option>
              <Select.Option value="Pending RM">Pending RM</Select.Option>
            </Select>
          </Space>

          <Table
            columns={allDCLColumns}
            dataSource={filteredAllDCLs}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
