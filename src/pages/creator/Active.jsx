// src/pages/Active.jsx
import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Space,
  Progress,
  Drawer,
  Typography,
} from "antd";

const { Search } = Input;
const { Text, Title } = Typography;

// 🟦 MOCK DATA
const MOCK_ACTIVE = [
  {
    _id: "A1",
    customerNo: "458921",
    dclNo: "DCL-10001",
    customerName: "John Doe",
    product: "Personal Loan",
    progress: 70,
    status: "Pending Checker",
    rm: "Brian",
    lastUpdated: "2025-11-20 10:24 AM",
    checklist: [
      { name: "Employment Letter", status: "Pending RM" },
      { name: "Bank Statement", status: "Approved" },
      { name: "ID Copy", status: "Pending RM" },
    ],
  },
  {
    _id: "A2",
    customerNo: "772194",
    dclNo: "DCL-10002",
    customerName: "Mary Wanjiru",
    product: "Home Loan",
    progress: 45,
    status: "Incomplete",
    rm: "Sarah",
    lastUpdated: "2025-11-21 03:40 PM",
    checklist: [
      { name: "CR12", status: "Pending RM" },
      { name: "KRA Pin", status: "Incomplete" },
    ],
  },
  {
    _id: "A3",
    customerNo: "993015",
    dclNo: "DCL-10003",
    customerName: "David Kimani",
    product: "Credit Card",
    progress: 90,
    status: "Returned by Checker",
    rm: "Brian",
    lastUpdated: "2025-11-22 11:15 AM",
    checklist: [
      { name: "Credit Application", status: "Returned by Checker" },
      { name: "ID Copy", status: "Approved" },
    ],
  },
  {
    _id: "A4",
    customerNo: "551002",
    dclNo: "DCL-10004",
    customerName: "Linet Kariuki",
    product: "Car Loan",
    progress: 60,
    status: "Pending RM",
    rm: "Tom",
    lastUpdated: "2025-11-23 08:00 AM",
    checklist: [
      { name: "Driver's License", status: "Pending RM" },
      { name: "Insurance Certificate", status: "Pending RM" },
      { name: "Loan Agreement", status: "Approved" },
    ],
  },
];

// 🟩 COLOR MAP
const STATUS_COLORS = {
  "Pending Checker": "blue",
  Incomplete: "orange",
  "Returned by Checker": "red",
  "Pending RM": "purple",
  Approved: "green",
};

export default function Active() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const filteredData = useMemo(() => {
    return MOCK_ACTIVE.filter((row) => {
      const matchesSearch =
        row.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        row.customerNo.includes(searchText) ||
        row.dclNo.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  const columns = [
    {
      title: "Customer No",
      dataIndex: "customerNo",
      key: "customerNo",
    },
    {
      title: "DCL No",
      dataIndex: "dclNo",
      key: "dclNo",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (value) => (
        <Progress percent={value} size="small" status="active" />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag color={STATUS_COLORS[value] || "default"}>{value}</Tag>
      ),
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>Active Checklists</h2>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Customer, DCL No..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />

        <Select
          value={statusFilter}
          style={{ width: 200 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Select.Option value="All">All Statuses</Select.Option>
          <Select.Option value="Pending Checker">Pending Checker</Select.Option>
          <Select.Option value="Incomplete">Incomplete</Select.Option>
          <Select.Option value="Returned by Checker">
            Returned by Checker
          </Select.Option>
          <Select.Option value="Pending RM">Pending RM</Select.Option>
        </Select>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedChecklist(record);
            setOpenDrawer(true);
          },
          style: { cursor: "pointer" },
        })}
      />

      {/* Details Drawer */}
      <Drawer
        open={openDrawer}
        width={420}
        onClose={() => setOpenDrawer(false)}
        title={`Checklist – ${selectedChecklist?.customerName || ""}`}
      >
        {selectedChecklist && (
          <>
            <Text strong>Customer No:</Text> {selectedChecklist.customerNo}
            <br />
            <Text strong>DCL No:</Text> {selectedChecklist.dclNo}
            <br />
            <Text strong>Customer Name:</Text> {selectedChecklist.customerName}
            <br />
            <Text strong>Product:</Text> {selectedChecklist.product}
            <br />
            <Text strong>RM:</Text> {selectedChecklist.rm}
            <br />
            <Text strong>Last Updated:</Text> {selectedChecklist.lastUpdated}

            <Title level={5} style={{ marginTop: 15 }}>
              Documents Pending RM Action
            </Title>

            {selectedChecklist.checklist.map((doc) => (
              <div
                key={doc.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "0.9rem",
                }}
              >
                <span>{doc.name}</span>
                <Tag
                  color={doc.status === "Pending RM" ? "orange" : "gray"}
                >
                  {doc.status}
                </Tag>
              </div>
            ))}
          </>
        )}
      </Drawer>
    </div>
  );
}