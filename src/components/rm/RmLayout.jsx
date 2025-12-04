import React, { useState } from "react";
import { Menu } from "antd";
import { BellOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import { ClipboardList, Settings } from "lucide-react";

import CreateChecklistPage from '../../pages/rm/RmChecklistPage.jsx'
import RMReviewPage from "../../pages/rm/RmReviewPage.jsx";


const Sidebar = ({
  selectedKey,
  setSelectedKey,
  collapsed,
  toggleCollapse,
}) => {
  const handleClick = (e) => setSelectedKey(e.key);

  return (
    <div
      style={{
        width: collapsed ? 80 : 260,
        background: "#2B1C67",
        color: "white",
        transition: "0.25s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "25px 20px",
          fontSize: collapsed ? 28 : 24,
          fontWeight: "bold",
          letterSpacing: collapsed ? 2 : 1,
          textAlign: collapsed ? "center" : "left",
        }}
      >
        {collapsed ? "RM" : "RM Dashboard"}
      </div>

      {/* MENU */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        style={{
          background: "transparent",
          borderRight: "none",
          fontSize: 15,
        }}
        inlineCollapsed={collapsed}
        items={[
          {
            key: "myqueue",
            label: "My Queue",
            icon: <ClipboardList size={20} />,
          },
          {
            key: "completedcl",
            label: "Completed DCL",
            icon: <ClipboardList size={20} />,
          },
          {
            key: "deferral",
            label: "Deferrals",
            icon: <ClipboardList size={20} />,
            children: [
              { key: "pendingdeferral", label: "Pending Deferral" },
              { key: "requestdeferral", label: "Request Deferral" },
            ],
          },
          {
            key: "reports",
            label: "Reports",
            icon: <Settings size={20} />,
          },
        ]}
      />

      {/* Collapse Button */}
      <div
        style={{
          marginTop: "auto",
          padding: 20,
          textAlign: "center",
        }}
      >
        <button
          onClick={toggleCollapse}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: 6,
            border: "none",
            background: "#fff",
            color: "#2B1C67",
            fontWeight: 600,
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ toggleSidebar }) => {
  return (
    <div
      style={{
        height: 65,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <MenuOutlined
        onClick={toggleSidebar}
        style={{
          fontSize: 24,
          cursor: "pointer",
          color: "#2B1C67",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
        <BellOutlined
          style={{ fontSize: 22, cursor: "pointer", color: "#2B1C67" }}
        />
        <UserOutlined
          style={{ fontSize: 22, cursor: "pointer", color: "#2B1C67" }}
        />
      </div>
    </div>
  );
};

const RmLayout = ({ userId }) => {
  const [selectedKey, setSelectedKey] = useState("myqueue");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const renderContent = () => {
    switch (selectedKey) {
      case "myqueue":
        return <CreateChecklistPage userId={userId} />;

      case "completedcl":
        return <RMReviewerPage />; // Same as old review checklist

      case "pendingdeferral":
        return <div style={pageStyle}>Pending Deferral Page</div>;

      case "requestdeferral":
        return <div style={pageStyle}>Request Deferral Page</div>;

      case "reports":
        return <div style={pageStyle}>Reports Page</div>;

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f4f6ff",
      }}
    >
      <Sidebar
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        collapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div
          style={{
            padding: "25px",
            flex: 1,
            overflowY: "auto",
            background: "#f4f6ff",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* Shared Page Style */
const pageStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#2B1C67",
};

export default RmLayout;
