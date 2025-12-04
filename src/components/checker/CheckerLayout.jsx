// import React, { useState, useEffect } from "react";
// import { Menu } from "antd";
// import {
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   FileTextOutlined,
//   BarChartOutlined,
//   MenuOutlined,
//   BellOutlined,
//   UserOutlined,
// } from "@ant-design/icons";

// // Page imports
// // import ActiveDCLs from "../../pages/checker/ActiveDCLs"
// // import CompletedDCLs from "../../pages/checker/CompletedDCLs";
// // import ReportsPage from "../../pages/checker/ReportsPage";
// // import CoChecklistPage from "../../" // My Queue
// import { useSelector } from "react-redux";
// import ActiveDCLs from "../../pages/checker/ActiveDCLs";
// import CompletedDCLs from "../../pages/checker/CompletedDCLs";
// import ReportsPage from "../../pages/checker/ReportsPage";
// import CoChecklistPage from "../../pages/creator/CoChecklistPage";
// import Myqueue from "../../pages/checker/CoChecklistPage";
// // import CoChecklistPage from "../../pages/creator/CoChecklistPage";
// // import ChecklistsPage from "../../pages/creator/ChecklistsPage";

// // Sidebar Component
// const Sidebar = ({ selectedKey, setSelectedKey, collapsed, toggleCollapse }) => {
//   const handleClick = (e) => setSelectedKey(e.key);

//   return (
//     <div
//       style={{
//         width: collapsed ? 80 : 250,
//         background: "#3A2A82",
//         paddingTop: 20,
//         transition: "width 0.2s",
//         color: "white",
//         position: "relative",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           fontSize: 22,
//           marginBottom: 35,
//           fontWeight: "bold",
//         }}
//       >
//         {collapsed ? "N" : "CO Checker Dashboard"}
//       </h2>

//       <Menu
//         theme="dark"
//         mode="inline"
//         selectedKeys={[selectedKey]}
//         onClick={handleClick}
//         style={{ background: "#3A2A82" }}
//         inlineCollapsed={collapsed}
//         items={[
//           { key: "myQueue", icon: <ClockCircleOutlined />, label: "My Queue" },
//           { key: "activeDCLs", icon: <FileTextOutlined />, label: "Active DCLs" },
//           { key: "completedDCLs", icon: <CheckCircleOutlined />, label: "Completed DCLs" },
//           { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
//         ]}
//       />

//       <div
//         style={{
//           position: "absolute",
//           bottom: 20,
//           width: "100%",
//           textAlign: "center",
//         }}
//       >
//         <button
//           onClick={toggleCollapse}
//           style={{
//             background: "#fff",
//             color: "#3A2A82",
//             border: "none",
//             borderRadius: 4,
//             padding: "5px 10px",
//             cursor: "pointer",
//           }}
//         >
//           {collapsed ? "Expand" : "Collapse"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // Navbar Component
// const Navbar = ({ toggleSidebar }) => (
//   <div
//     style={{
//       height: 60,
//       background: "#fff",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: "0 20px",
//       boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//       position: "sticky",
//       top: 0,
//       zIndex: 100,
//     }}
//   >
//     <div onClick={toggleSidebar} style={{ cursor: "pointer" }}>
//       <MenuOutlined style={{ fontSize: 24 }} />
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//       <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
//       <UserOutlined style={{ fontSize: 20, cursor: "pointer" }} />
//     </div>
//   </div>
// );

// // Main Layout
// const CheckerLayout = () => {
//   const { user } = useSelector((state) => state.auth);
//   const userId = user?.id;

//   const [selectedKey, setSelectedKey] = useState("myQueue");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

//   // Keep the active menu item highlighted correctly after collapse/expand
//   useEffect(() => {
//     if (!selectedKey) setSelectedKey("myQueue");
//   }, [sidebarCollapsed, selectedKey]);

//   const renderContent = () => {
//     switch (selectedKey) {
//       case "myQueue":
//         return <Myqueue/>;
//       case "activeDCLs":
//         return <ActiveDCLs />;
//       case "completedDCLs":
//         return <CompletedDCLs />;
//       case "reports":
//         return <ReportsPage />;
//       default:
//         return <CoChecklistPage userId={userId} />;
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       <Sidebar
//         selectedKey={selectedKey}
//         setSelectedKey={setSelectedKey}
//         collapsed={sidebarCollapsed}
//         toggleCollapse={toggleSidebar}
//       />

//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Navbar toggleSidebar={toggleSidebar} />
//         <div
//           style={{
//             padding: 20,
//             flex: 1,
//             overflowY: "auto",
//             background: "#f0f2f5",
//           }}
//         >
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckerLayout;

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  MenuOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

// Page imports
// import ActiveDCLs from "./ActiveDCLs";
// import CompletedDCLs from "./CompletedDCLs";
// import ReportsPage from "./ReportsPage";
// import CoChecklistPage from "../CoChecklistPage"; // My Queue
import { useSelector } from "react-redux";
import CoChecklistPage from "../../pages/creator/CoChecklistPage";
import ActiveDCLs from "../../pages/checker/ActiveDCLs";
import CompletedDCLs from "../../pages/checker/CompletedDCLs";
import ReportsPage from "../../pages/checker/ReportsPage";
import Myqueue from "../../pages/checker/CoChecklistPage";

// Sidebar Component
const Sidebar = ({ selectedKey, setSelectedKey, collapsed, toggleCollapse }) => {
  const handleClick = (e) => setSelectedKey(e.key);

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
        {collapsed ? "N" : "CO Checker Dashboard"}
      </h2>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        style={{ background: "#3A2A82" }}
        inlineCollapsed={collapsed}
        items={[
          { key: "myQueue", icon: <ClockCircleOutlined />, label: "My Queue" },
          // { key: "activeDCLs", icon: <FileTextOutlined />, label: "Active DCLs" },
          { key: "completedDCLs", icon: <CheckCircleOutlined />, label: "Completed DCLs" },
          { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
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

// Navbar Component
const Navbar = ({ toggleSidebar }) => (
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

// Main Layout
const CheckerLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [selectedKey, setSelectedKey] = useState("myQueue");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Keep the active menu item highlighted correctly after collapse/expand
  useEffect(() => {
    if (!selectedKey) setSelectedKey("myQueue");
  }, [sidebarCollapsed, selectedKey]);

  const renderContent = () => {
    switch (selectedKey) {
      case "myQueue":
        return <Myqueue userId={userId} />;
      // case "activeDCLs":
      //   return <ActiveDCLs />;
      case "completedDCLs":
        return <CompletedDCLs />;
      case "reports":
        return <ReportsPage />;
      default:
        return <CoChecklistPage userId={userId} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
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
            padding: 20,
            flex: 1,
            overflowY: "auto",
            background: "#f0f2f5",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CheckerLayout;

