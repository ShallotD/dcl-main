// src/pages/Completed.jsx
import React, { useState, useMemo } from "react";
import { Table, Tag, Input, Space, Drawer, Typography } from "antd";

const { Search } = Input;
const { Title, Text } = Typography;

// 🟢 MOCK COMPLETED DCLs
const MOCK_COMPLETED = [
  {
    _id: "C1",
    customerNo: "458921",
    dclNo: "DCL-20011",
    customerName: "John Doe",
    product: "Personal Loan",
    completedOn: "2025-11-20 04:30 PM",
    checklist: [
      { name: "ID Copy", status: "Approved" },
      { name: "Bank Statements", status: "Approved" },
      { name: "Payslip", status: "Approved" },
    ],
    checker: "Mary K.",
  },
  {
    _id: "C2",
    customerNo: "772194",
    dclNo: "DCL-20012",
    customerName: "Mary Wanjiru",
    product: "Home Loan",
    completedOn: "2025-11-21 09:15 AM",
    checklist: [
      { name: "CR12", status: "Approved" },
      { name: "Business Registration", status: "Approved" },
    ],
    checker: "Peter N.",
  },
];

// Component
export default function Completed() {
  const [searchText, setSearchText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // 🔍 Filter logic
  const filteredData = useMemo(() => {
    return MOCK_COMPLETED.filter((row) => {
      const s = searchText.toLowerCase();
      return (
        row.customerName.toLowerCase().includes(s) ||
        row.customerNo.includes(s) ||
        row.dclNo.toLowerCase().includes(s)
      );
    });
  }, [searchText]);

  // 🧱 Table columns
  const columns = [
    {
      title: "Customer No",
      dataIndex: "customerNo",
    },
    {
      title: "DCL No",
      dataIndex: "dclNo",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Product",
      dataIndex: "product",
    },
    {
      title: "Completed On",
      dataIndex: "completedOn",
    },
    {
      title: "Status",
      render: () => <Tag color="green">Completed</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Completed Checklists</h2>

      {/* 🔍 Search */}
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Customer, DCL No..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 260 }}
        />
      </Space>

      {/* 📋 Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        onRow={(row) => ({
          onClick: () => {
            setSelectedRow(row);
            setOpenDrawer(true);
          },
        })}
      />

      {/* 📂 Drawer — Checklist Details */}
      <Drawer
        title={`Completed Checklist – ${selectedRow?.customerName}`}
        width={420}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {selectedRow && (
          <>
            <Text strong>Customer No:</Text> {selectedRow.customerNo}
            <br />
            <Text strong>DCL No:</Text> {selectedRow.dclNo}
            <br />
            <Text strong>Product:</Text> {selectedRow.product}
            <br />
            <Text strong>Checker:</Text> {selectedRow.checker}
            <br />
            <Text strong>Completed On:</Text> {selectedRow.completedOn}

            <Title level={5} style={{ marginTop: 16 }}>
              Checklist Summary
            </Title>

            {selectedRow.checklist.map((doc) => (
              <div
                key={doc.name}
                className="flex justify-between py-1 border-b text-sm"
              >
                <span>{doc.name}</span>
                <Tag color="green">{doc.status}</Tag>
              </div>
            ))}
          </>
        )}
      </Drawer>
    </div>
  );
}
