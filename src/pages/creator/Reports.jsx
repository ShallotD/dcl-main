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
  Row,
  Col,
  Statistic,
  Button,
  Tooltip
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Search } = Input;

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const SUCCESS_GREEN = "#52c41a";
const ERROR_RED = "#ff4d4f";
const WARNING_ORANGE = "#faad14";
const INFO_BLUE = "#1890ff";
const PURPLE = "#722ed1"; // Moved up to fix the error

// Mock Data - Updated with proper statuses
const MOCK_DCLS = [
  {
    id: "DCL-10001",
    dclNo: "DCL-10001",
    customerNo: "458921",
    customerName: "John Doe Enterprises",
    workstep: "WS-001",
    product: "Personal Loan",
    status: "Completed",
    completedDate: "2025-11-20",
    loanAmount: "KES 500,000",
    assignedRM: "Sarah Johnson",
    deferralStatus: "None"
  },
  {
    id: "DCL-10002",
    dclNo: "DCL-10002",
    customerNo: "772194",
    customerName: "Jane Smith Ltd",
    workstep: "WS-002",
    product: "Home Loan",
    status: "Active",
    completedDate: null,
    loanAmount: "KES 8,000,000",
    assignedRM: "Michael Brown",
    deferralStatus: "None"
  },
  {
    id: "DCL-10003",
    dclNo: "DCL-10003",
    customerNo: "993015",
    customerName: "Robert Kamau Enterprises",
    workstep: "WS-003",
    product: "Credit Card",
    status: "Deferred",
    completedDate: "2025-11-25",
    loanAmount: "KES 1,000,000",
    assignedRM: "Alice Williams",
    deferralStatus: "Approved"
  },
  {
    id: "DCL-10004",
    dclNo: "DCL-10004",
    customerNo: "551002",
    customerName: "Green Farms Co-op",
    workstep: "WS-004",
    product: "Car Loan",
    status: "Completed",
    completedDate: "2025-11-22",
    loanAmount: "KES 3,500,000",
    assignedRM: "David Miller",
    deferralStatus: "None"
  },
  {
    id: "DCL-10005",
    dclNo: "DCL-10005",
    customerNo: "663018",
    customerName: "Tech Solutions Ltd",
    workstep: "WS-005",
    product: "Business Loan",
    status: "Active",
    completedDate: null,
    loanAmount: "KES 12,000,000",
    assignedRM: "John Doe",
    deferralStatus: "Rejected"
  },
  {
    id: "DCL-10006",
    dclNo: "DCL-10006",
    customerNo: "774029",
    customerName: "Smart Investments",
    workstep: "WS-006",
    product: "Investment Loan",
    status: "Completed",
    completedDate: "2025-11-18",
    loanAmount: "KES 6,000,000",
    assignedRM: "Jane Smith",
    deferralStatus: "Approved"
  },
];

const MOCK_DEFERRALS = [
  // Post-approval deferrals (Approved by creator)
  {
    id: "DEF-001",
    dclNo: "DCL-10003",
    customerNo: "993015",
    customerName: "Robert Kamau Enterprises",
    workstep: "WS-003",
    document: "Credit Report",
    reason: "Awaiting updated credit information",
    expiryDate: "2025-12-10",
    creatorComments: "Client has promised to provide updated credit report by Dec 5",
    status: "Approved",
    decisionDate: "2025-11-25",
    decisionBy: "John Creator",
    loanAmount: "KES 1,000,000",
    product: "Credit Card",
    dateRequested: "2025-11-24",
    assignedRM: "Alice Williams"
  },
  {
    id: "DEF-002",
    dclNo: "DCL-10006",
    customerNo: "774029",
    customerName: "Smart Investments",
    workstep: "WS-006",
    document: "Audited Financial Statements",
    reason: "Auditor unavailable, will provide next week",
    expiryDate: "2025-12-15",
    creatorComments: "Approved with condition that statements are submitted by Dec 12",
    status: "Approved",
    decisionDate: "2025-11-19",
    decisionBy: "Jane Approver",
    loanAmount: "KES 6,000,000",
    product: "Investment Loan",
    dateRequested: "2025-11-18",
    assignedRM: "Jane Smith"
  },
  {
    id: "DEF-003",
    dclNo: "DCL-10007",
    customerNo: "885112",
    customerName: "Urban Development Ltd",
    workstep: "WS-007",
    document: "Title Deed Verification",
    reason: "County government delay in processing",
    expiryDate: "2025-12-20",
    creatorComments: "Approved given government-related delays",
    status: "Approved",
    decisionDate: "2025-11-28",
    decisionBy: "John Creator",
    loanAmount: "KES 15,000,000",
    product: "Mortgage",
    dateRequested: "2025-11-27",
    assignedRM: "Robert Johnson"
  },

  // Rejected deferrals (Rejected by creator)
  {
    id: "DEF-004",
    dclNo: "DCL-10005",
    customerNo: "663018",
    customerName: "Tech Solutions Ltd",
    workstep: "WS-005",
    document: "Bank Statements",
    reason: "Could not access online banking",
    expiryDate: "2025-12-05",
    creatorComments: "Insufficient reason provided - client can visit bank branch",
    status: "Rejected",
    decisionDate: "2025-11-26",
    decisionBy: "Mary Reviewer",
    loanAmount: "KES 12,000,000",
    product: "Business Loan",
    dateRequested: "2025-11-25",
    assignedRM: "John Doe"
  },
  {
    id: "DEF-005",
    dclNo: "DCL-10008",
    customerNo: "996023",
    customerName: "Quick Retail Ltd",
    workstep: "WS-008",
    document: "Tax Compliance Certificate",
    reason: "KRA portal issues",
    expiryDate: "2025-12-12",
    creatorComments: "RM should have advised client to visit KRA office directly",
    status: "Rejected",
    decisionDate: "2025-11-29",
    decisionBy: "John Creator",
    loanAmount: "KES 2,500,000",
    product: "Overdraft Facility",
    dateRequested: "2025-11-28",
    assignedRM: "Sarah Williams"
  },
];

// Helper to render status tags consistently
const STATUS_COLOR_MAP = {
  Completed: SUCCESS_GREEN,
  Active: INFO_BLUE,
  Deferred: WARNING_ORANGE,
  "Returned by Checker": ERROR_RED,
  "Pending RM": PURPLE,
  Approved: SUCCESS_GREEN,
  Rejected: ERROR_RED,
  "Pending Approval": "gold",
};

const DCL_STATUS_COLOR_MAP = {
  Completed: SUCCESS_GREEN,
  Active: INFO_BLUE,
  Deferred: WARNING_ORANGE,
};

export default function Reports() {
  // Shared filters
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("postApproval");

  // Statistics
  const stats = useMemo(() => {
    const approvedDeferrals = MOCK_DEFERRALS.filter(d => d.status === "Approved");
    const rejectedDeferrals = MOCK_DEFERRALS.filter(d => d.status === "Rejected");
    const completedDCLs = MOCK_DCLS.filter(d => d.status === "Completed");
    const activeDCLs = MOCK_DCLS.filter(d => d.status === "Active");
    const deferredDCLs = MOCK_DCLS.filter(d => d.status === "Deferred");

    return {
      totalApprovedDeferrals: approvedDeferrals.length,
      totalRejectedDeferrals: rejectedDeferrals.length,
      totalCompletedDCLs: completedDCLs.length,
      totalActiveDCLs: activeDCLs.length,
      totalDeferredDCLs: deferredDCLs.length,
      totalDCLs: MOCK_DCLS.length,
    };
  }, []);

  // Filtered Post-Approval Deferrals (Tab A - Approved by creator)
  const filteredPostApprovalDeferrals = useMemo(() => {
    return MOCK_DEFERRALS.filter(
      (d) =>
        d.status === "Approved" &&
        (searchText === "" ||
          d.customerNo.includes(searchText) ||
          d.dclNo.includes(searchText) ||
          d.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          d.workstep.toLowerCase().includes(searchText.toLowerCase())) &&
        (!dateRange ||
          (d.decisionDate &&
            dayjs(d.decisionDate).isBetween(
              dateRange[0],
              dateRange[1],
              "day",
              "[]"
            )))
    );
  }, [searchText, dateRange]);

  // Filtered Rejected Deferrals (Tab B - Rejected by creator)
  const filteredRejectedDeferrals = useMemo(() => {
    return MOCK_DEFERRALS.filter(
      (d) =>
        d.status === "Rejected" &&
        (searchText === "" ||
          d.customerNo.includes(searchText) ||
          d.dclNo.includes(searchText) ||
          d.customerName.toLowerCase().includes(searchText.toLowerCase())) &&
        (!dateRange ||
          (d.decisionDate &&
            dayjs(d.decisionDate).isBetween(
              dateRange[0],
              dateRange[1],
              "day",
              "[]"
            )))
    );
  }, [searchText, dateRange]);

  // Filtered All DCLs (Tab C)
  const filteredAllDCLs = useMemo(() => {
    return MOCK_DCLS.filter(
      (d) =>
        (statusFilter === "All" || d.status === statusFilter) &&
        (searchText === "" ||
          d.customerNo.includes(searchText) ||
          d.dclNo.includes(searchText) ||
          d.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          d.workstep.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [statusFilter, searchText]);

  // Columns for each table
  const postApprovalColumns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      key: "dclNo",
      render: (text) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>
          {text}
        </div>
      )
    },
    { 
      title: "Customer", 
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customerName}</div>
          <div style={{ fontSize: 11, color: "#666" }}>{record.customerNo}</div>
        </div>
      )
    },
    { 
      title: "Workstep", 
      dataIndex: "workstep", 
      key: "workstep",
      width: 80
    },
    { 
      title: "Document", 
      dataIndex: "document", 
      key: "document",
      width: 150
    },
    { 
      title: "Reason", 
      dataIndex: "reason", 
      key: "reason",
      width: 200
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 110,
      render: (date) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>
          {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
        </div>
      ),
    },
    {
      title: "Creator Comments",
      dataIndex: "creatorComments",
      key: "creatorComments",
      width: 200,
      render: (text) => (
        <div style={{ fontStyle: "italic", fontSize: 12 }}>
          {text}
        </div>
      )
    },
    {
      title: "Decision Date",
      dataIndex: "decisionDate",
      key: "decisionDate",
      width: 110,
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag 
          color={STATUS_COLOR_MAP[status]} 
          style={{ fontWeight: "bold" }}
          icon={status === "Approved" ? <CheckCircleOutlined /> : null}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const rejectedDeferralsColumns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      key: "dclNo",
      render: (text) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>
          {text}
        </div>
      )
    },
    { 
      title: "Customer", 
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customerName}</div>
          <div style={{ fontSize: 11, color: "#666" }}>{record.customerNo}</div>
        </div>
      )
    },
    { 
      title: "Workstep", 
      dataIndex: "workstep", 
      key: "workstep",
      width: 80
    },
    { 
      title: "Document", 
      dataIndex: "document", 
      key: "document",
      width: 150
    },
    { 
      title: "Reason", 
      dataIndex: "reason", 
      key: "reason",
      width: 200
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 110,
      render: (date) => (
        <div style={{ fontWeight: "bold", color: ERROR_RED }}>
          {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
        </div>
      ),
    },
    {
      title: "Rejection Reason",
      dataIndex: "creatorComments",
      key: "creatorComments",
      width: 200,
      render: (text) => (
        <div style={{ fontStyle: "italic", fontSize: 12, color: ERROR_RED }}>
          {text}
        </div>
      )
    },
    {
      title: "Decision Date",
      dataIndex: "decisionDate",
      key: "decisionDate",
      width: 110,
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag 
          color={STATUS_COLOR_MAP[status]} 
          style={{ fontWeight: "bold" }}
          icon={<CloseCircleOutlined />}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const allDCLColumns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      key: "dclNo",
      render: (text) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>
          {text}
        </div>
      )
    },
    { 
      title: "Customer", 
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customerName}</div>
          <div style={{ fontSize: 11, color: "#666" }}>{record.customerNo}</div>
        </div>
      )
    },
    { 
      title: "Workstep", 
      dataIndex: "workstep", 
      key: "workstep",
      width: 80
    },
    { 
      title: "Product", 
      dataIndex: "product", 
      key: "product",
      width: 120
    },
    { 
      title: "Loan Amount", 
      dataIndex: "loanAmount", 
      key: "loanAmount",
      width: 120,
      render: (text) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE }}>
          {text}
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag 
          color={DCL_STATUS_COLOR_MAP[status] || "default"}
          style={{ fontWeight: "bold" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Deferral Status",
      dataIndex: "deferralStatus",
      key: "deferralStatus",
      render: (status) => {
        if (status === "None") return <Tag>No Deferral</Tag>;
        if (status === "Approved") return <Tag color="green">Deferral Approved</Tag>;
        if (status === "Rejected") return <Tag color="red">Deferral Rejected</Tag>;
        return <Tag>{status}</Tag>;
      }
    },
  ];

  // Export functionality
  const exportReport = () => {
    let data = [];
    let filename = "";
    
    if (activeTab === "postApproval") {
      data = filteredPostApprovalDeferrals;
      filename = `post_approval_deferrals_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    } else if (activeTab === "rejected") {
      data = filteredRejectedDeferrals;
      filename = `rejected_deferrals_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    } else {
      data = filteredAllDCLs;
      filename = `all_dcls_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    }
    
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + 
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card
        style={{ 
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderLeft: `4px solid ${ACCENT_LIME}`
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: PRIMARY_BLUE, display: "flex", alignItems: "center", gap: 12 }}>
              <FileTextOutlined />
              DCL Reports & Analytics
            </Title>
            <Text style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
              Comprehensive reports on deferrals and DCL statuses
            </Text>
          </Col>
          
          <Col>
            <Space>
              <Tooltip title="Export Report">
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={exportReport}
                  type="primary"
                >
                  Export Report
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Total DCLs"
              value={stats.totalDCLs}
              prefix={<FileTextOutlined style={{ color: PRIMARY_BLUE }} />}
              valueStyle={{ color: PRIMARY_BLUE, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Post-approval Deferrals"
              value={stats.totalApprovedDeferrals}
              prefix={<CheckCircleOutlined style={{ color: SUCCESS_GREEN }} />}
              valueStyle={{ color: SUCCESS_GREEN, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Rejected Deferrals"
              value={stats.totalRejectedDeferrals}
              prefix={<CloseCircleOutlined style={{ color: ERROR_RED }} />}
              valueStyle={{ color: ERROR_RED, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Active DCLs"
              value={stats.totalActiveDCLs}
              prefix={<FileTextOutlined style={{ color: INFO_BLUE }} />}
              valueStyle={{ color: INFO_BLUE, fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            setActiveTab(key);
            setSearchText("");
            setDateRange(null);
            if (key !== "allDCLs") setStatusFilter("All");
          }}
          type="card"
        >
          {/* Post-approval Deferrals (Approved by creator) */}
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                Post-approval Deferrals ({stats.totalApprovedDeferrals})
              </span>
            } 
            key="postApproval"
          >
            <Space style={{ marginBottom: 16 }}>
              <Search
                placeholder="Search by DCL No, Customer No, or Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                allowEmpty={[true, true]}
                placeholder={['Start Date', 'End Date']}
                format="DD/MM/YYYY"
              />
            </Space>

            <Table
              columns={postApprovalColumns}
              dataSource={filteredPostApprovalDeferrals}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1300 }}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Total Approved Deferrals:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={6}>
                      <strong style={{ color: SUCCESS_GREEN }}>
                        {filteredPostApprovalDeferrals.length} records
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </TabPane>

          {/* Rejected Deferrals (Rejected by creator) */}
          <TabPane 
            tab={
              <span>
                <CloseCircleOutlined />
                Rejected Deferrals ({stats.totalRejectedDeferrals})
              </span>
            } 
            key="rejected"
          >
            <Space style={{ marginBottom: 16 }}>
              <Search
                placeholder="Search by DCL No, Customer No, or Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                allowEmpty={[true, true]}
                placeholder={['Start Date', 'End Date']}
                format="DD/MM/YYYY"
              />
            </Space>

            <Table
              columns={rejectedDeferralsColumns}
              dataSource={filteredRejectedDeferrals}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1300 }}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Total Rejected Deferrals:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={6}>
                      <strong style={{ color: ERROR_RED }}>
                        {filteredRejectedDeferrals.length} records
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </TabPane>

          {/* All DCLs */}
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                All DCLs ({stats.totalDCLs})
              </span>
            } 
            key="allDCLs"
          >
            <Space style={{ marginBottom: 16 }}>
              <Search
                placeholder="Search by DCL No, Customer No, or Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
              <Select
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                style={{ width: 200 }}
                placeholder="Filter by Status"
              >
                <Select.Option value="All">All Statuses</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Deferred">Deferred</Select.Option>
              </Select>
            </Space>

            <Table
              columns={allDCLColumns}
              dataSource={filteredAllDCLs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <strong>Total DCLs:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={4}>
                      <strong style={{ color: PRIMARY_BLUE }}>
                        {filteredAllDCLs.length} records
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Footer Info */}
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        background: "#f8f9fa", 
        borderRadius: 4,
        fontSize: 12,
        color: "#666"
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            Report generated on: {dayjs().format('DD/MM/YYYY HH:mm:ss')}
          </Col>
          <Col>
            <Text type="secondary">
              Showing data as of latest system update
            </Text>
          </Col>
        </Row>
      </div>
    </div>
  );
}