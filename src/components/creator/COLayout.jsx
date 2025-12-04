import React, { useState } from "react";
import { Menu } from "antd";
import { MenuOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

// lucide-react icons (NEW)
import {
  CirclePlus,
  Inbox,
  Users,
  Clock,
  CheckCircle,
  BarChart2,
  InboxIcon,
} from "lucide-react";

// Pages
import StatsReportModal from "../modals/StatsReportModal";
import BaseChecklistTableCo from "../checker/BaseChecklistTableCo";
import CoChecklistPage from "../../pages/creator/CoChecklistPage";
import Reportss from "../../pages/creator/Reports";
import Active from "../../pages/creator/Active";
import MyQueue from "../../pages/creator/MyQueue";
import CreatorReview from "../../pages/creator/CreatorReview";
import Completed from "../../pages/creator/Completed";
import Deferrals from "../../pages/creator/Deferrals";

// ----------------------- Sidebar -----------------------
const Sidebar = ({
  selectedKey,
  setSelectedKey,
  collapsed,
  toggleCollapse,
}) => {
  const handleClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <div
      style={{
        width: collapsed ? 80 : 250,
        background: "#3A2A82",
        paddingTop: 20,
        transition: "width 0.2s",
        color: "white",
        position: "relative",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 22,
          marginBottom: 35,
          fontWeight: "bold",
        }}
      >
        {collapsed ? "N" : "CO Dashboard"}
      </h2>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        inlineCollapsed={collapsed}
        style={{ background: "#3A2A82" }}
        items={[
          {
            key: "creatchecklist",
            icon: <CirclePlus size={16} className="text-gray-200" />,
            label: "Create New DCL",
          },
          {
            key: "myqueue",
            icon: <Inbox size={16} className="text-gray-200" />,
            label: "My Queue",
          },
          {
            key: "active",
            icon: <Users size={16} className="text-gray-200" />,
            label: "Active",
          },
          {
            key: "deferrals",
            icon: <Clock size={16} className="text-gray-200" />,
            label: "Deferrals",
          },
          {
            key: "completed",
            icon: <CheckCircle size={16} className="text-gray-200" />,
            label: "Completed",
          },
          {
            key: "report",
            icon: <BarChart2 size={16} className="text-gray-200" />,
            label: "Reports",
          },
        ]}
      />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          textAlign: "center",
        }}
      >
        <button
          onClick={toggleCollapse}
          style={{
            background: "#fff",
            color: "#3A2A82",
            border: "none",
            borderRadius: 4,
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
    </div>
  );
};

// ----------------------- Navbar -----------------------
const Navbar = ({ toggleSidebar }) => {
  return (
    <div
      style={{
        height: 60,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div onClick={toggleSidebar} style={{ cursor: "pointer" }}>
        <MenuOutlined style={{ fontSize: 24 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
        <UserOutlined style={{ fontSize: 20, cursor: "pointer" }} />
      </div>
    </div>
  );
};

// ----------------------- Mock Data -----------------------
const mockChecklists = [
  {
    dclNo: "DCL001",
    assignedToRM: { name: "RM John" },
    loanType: "Home Loan",
    status: "approved",
    createdAt: "2025-11-01",
    approvedAt: "2025-11-05",
    documents: ["doc1", "doc2"],
  },
  {
    dclNo: "DCL002",
    assignedToRM: { name: "RM Jane" },
    loanType: "Car Loan",
    status: "rejected",
    createdAt: "2025-11-02",
    approvedAt: null,
    documents: ["doc1"],
  },
  {
    dclNo: "DCL003",
    assignedToRM: { name: "RM John" },
    loanType: "Personal Loan",
    status: "in progress",
    createdAt: "2025-11-03",
    approvedAt: null,
    documents: ["doc1", "doc2", "doc3"],
  },
];

// ----------------------- Main Layout -----------------------
const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [selectedKey, setSelectedKey] = useState("creatchecklist");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "creatchecklist":
        return <CoChecklistPage userId={userId} />;
      case "myqueue":
        return <MyQueue />;
      case "active":
        return <Active />;
      case "report":
        return <Reportss />;
         case "completed":
        return <Completed />;
      case "deferrals":
        return <Deferrals />;
      default:
        return <h1>Dashboard Content</h1>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        collapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />

      {/* Main Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar toggleSidebar={toggleSidebar} />

        {/* ---------- MAIN CONTENT + ROUTER ---------- */}
        <div
          style={{
            padding: 20,
            flex: 1,
            overflowY: "auto",
            background: "#f0f2f5",
          }}
        >
          <Routes>
            {/* Sidebar-controlled page */}
            <Route path="/" element={renderContent()} />

            {/* Creator Review */}
            <Route path="/creator/review/:id" element={<CreatorReview />} />

            {/* Stats Report Modal route */}
            <Route
              path="/reports"
              element={
                <>
                  <button
                    onClick={() => setModalOpen(true)}
                    style={{ marginBottom: 20 }}
                  >
                    Open Stats Report
                  </button>

                  <StatsReportModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    checklists={mockChecklists}
                  />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;