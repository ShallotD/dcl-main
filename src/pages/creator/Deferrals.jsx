import React, { useState, useMemo, useEffect } from "react";
import { 
  Table, 
  Button, 
  Divider, 
  Tag, 
  Spin, 
  Empty, 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  DatePicker,
  Badge,
  Tooltip,
  Space,
  Modal,
  message,
  Input as AntInput
} from "antd";
import { 
  SearchOutlined, 
  DownloadOutlined, 
  ReloadOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CustomerServiceOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs
dayjs.extend(relativeTime);

// Theme Colors
const PRIMARY_BLUE = "#164679";
const ACCENT_LIME = "#b5d334";
const HIGHLIGHT_GOLD = "#fcb116";
const LIGHT_YELLOW = "#fcd716";
const SECONDARY_PURPLE = "#7e6496";
const SUCCESS_GREEN = "#52c41a";
const ERROR_RED = "#ff4d4f";
const WARNING_ORANGE = "#faad14";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = AntInput;

const Deferrals = ({ userId }) => {
  // State Management
  const [selectedDeferral, setSelectedDeferral] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    search: '',
    dateRange: null
  });
  const [loading, setLoading] = useState(false);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [creatorComment, setCreatorComment] = useState("");

  // Mock API integration - replace with actual API call
  const mockDeferralsData = [
    {
      _id: "1",
      dclNo: "DCL-2024-001",
      customerNumber: "CUST001",
      customerName: "Tech Innovations Ltd",
      documentName: "Business Registration Certificate",
      deferralReason: "Client traveling, will provide next week",
      rmComments: "Client promised to provide upon return",
      expiryDate: "2024-12-31T00:00:00.000Z",
      requestedDate: "2024-01-15T10:30:00.000Z",
      status: "deferral_pending_creator_review",
      loanType: "Business Loan",
      loanAmount: "KES 5,000,000",
      assignedRM: { 
        name: "John Doe", 
        id: "RM001",
        email: "john.doe@ncbabank.com"
      },
      priority: "high",
      slaStatus: "normal",
      daysRemaining: 14,
      createdAt: "2024-01-15T10:30:00.000Z",
      documents: [
        { name: "Business Reg", status: "pending" },
        { name: "Bank Statements", status: "uploaded" }
      ]
    },
    {
      _id: "2",
      dclNo: "DCL-2024-002",
      customerNumber: "CUST002",
      customerName: "Jane Mwangi",
      documentName: "Latest Bank Statements",
      deferralReason: "Bank system down, cannot access statements",
      rmComments: "Bank IT issue, expecting resolution in 2 days",
      expiryDate: "2024-12-15T00:00:00.000Z",
      requestedDate: "2024-01-14T14:20:00.000Z",
      status: "deferral_pending_creator_review",
      loanType: "Personal Loan",
      loanAmount: "KES 500,000",
      assignedRM: { 
        name: "Jane Smith", 
        id: "RM002",
        email: "jane.smith@ncbabank.com"
      },
      priority: "medium",
      slaStatus: "warning",
      daysRemaining: 3,
      createdAt: "2024-01-14T14:20:00.000Z",
      documents: [
        { name: "ID Copy", status: "uploaded" },
        { name: "Payslip", status: "pending" }
      ]
    },
    {
      _id: "3",
      dclNo: "DCL-2024-003",
      customerNumber: "CUST003",
      customerName: "Robert Kamau Enterprises",
      documentName: "Tax Compliance Certificate",
      deferralReason: "KRA portal maintenance",
      rmComments: "Government portal issue",
      expiryDate: "2024-12-20T00:00:00.000Z",
      requestedDate: "2024-01-13T09:15:00.000Z",
      status: "deferral_pending_creator_review",
      loanType: "Mortgage",
      loanAmount: "KES 15,000,000",
      assignedRM: { 
        name: "Robert Johnson", 
        id: "RM003",
        email: "robert.j@ncbabank.com"
      },
      priority: "critical",
      slaStatus: "critical",
      daysRemaining: -1,
      createdAt: "2024-01-13T09:15:00.000Z",
      documents: [
        { name: "Title Deed", status: "uploaded" },
        { name: "Valuation Report", status: "pending" }
      ]
    },
    {
      _id: "4",
      dclNo: "DCL-2024-004",
      customerNumber: "CUST004",
      customerName: "Green Farms Cooperative",
      documentName: "Audited Financial Statements",
      deferralReason: "Auditor unavailable due to illness",
      rmComments: "Auditor will return next week",
      expiryDate: "2024-12-25T00:00:00.000Z",
      requestedDate: "2024-01-12T11:45:00.000Z",
      status: "deferral_pending_creator_review",
      loanType: "Agricultural Loan",
      loanAmount: "KES 8,000,000",
      assignedRM: { 
        name: "Sarah Williams", 
        id: "RM004",
        email: "sarah.w@ncbabank.com"
      },
      priority: "medium",
      slaStatus: "normal",
      daysRemaining: 20,
      createdAt: "2024-01-12T11:45:00.000Z",
      documents: [
        { name: "Land Title", status: "uploaded" },
        { name: "Business Plan", status: "uploaded" }
      ]
    },
    {
      _id: "5",
      dclNo: "DCL-2024-005",
      customerNumber: "CUST005",
      customerName: "Smart Solutions Ltd",
      documentName: "VAT Compliance Certificate",
      deferralReason: "Awaiting KRA clearance",
      rmComments: "Processing at KRA headquarters",
      expiryDate: "2024-12-10T00:00:00.000Z",
      requestedDate: "2024-01-11T16:20:00.000Z",
      status: "deferral_pending_creator_review",
      loanType: "Equipment Financing",
      loanAmount: "KES 12,000,000",
      assignedRM: { 
        name: "Michael Brown", 
        id: "RM005",
        email: "michael.b@ncbabank.com"
      },
      priority: "low",
      slaStatus: "normal",
      daysRemaining: 15,
      createdAt: "2024-01-11T16:20:00.000Z",
      documents: [
        { name: "Invoice", status: "pending" },
        { name: "Quotation", status: "uploaded" }
      ]
    }
  ];

  // Simulate API call
  const fetchDeferrals = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // In real implementation, replace with:
      // const response = await useGetDeferralsQuery(); // or specific deferrals API
      return mockDeferralsData;
    } catch (error) {
      console.error("Error fetching deferrals:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // State for deferrals
  const [deferrals, setDeferrals] = useState([]);
  const [filteredDeferrals, setFilteredDeferrals] = useState([]);

  // Initialize
  useEffect(() => {
    loadDeferrals();
  }, []);

  const loadDeferrals = async () => {
    const data = await fetchDeferrals();
    // Filter to show only deferrals pending creator review
    const pendingReviewData = data.filter(d => d.status === "deferral_pending_creator_review");
    setDeferrals(pendingReviewData);
    setFilteredDeferrals(pendingReviewData);
  };

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [deferrals, filters]);

  const applyFilters = () => {
    let filtered = [...deferrals];

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(d => d.priority === filters.priority);
    }

    // Apply search filter - ONLY customer number and DCL No
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.customerNumber.toLowerCase().includes(searchLower) ||
        d.dclNo.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(d => {
        const createdDate = dayjs(d.createdAt);
        return createdDate.isAfter(filters.dateRange[0]) && 
               createdDate.isBefore(filters.dateRange[1]);
      });
    }

    setFilteredDeferrals(filtered);
  };

  // Handle deferral actions
  const handleApproveDeferral = async () => {
    if (!creatorComment.trim()) {
      message.error("Please enter your comments before approving");
      return;
    }

    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state - remove approved deferral from list
      const updatedDeferrals = deferrals.filter(d => d._id !== selectedDeferral._id);
      
      setDeferrals(updatedDeferrals);
      message.success("Deferral approved successfully!");
      
      // Close modal and reset
      setModalVisible(false);
      setSelectedDeferral(null);
      setCreatorComment("");
      
    } catch (error) {
      console.error("Error approving deferral:", error);
      message.error("Failed to approve deferral");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDeferral = async () => {
    if (!creatorComment.trim()) {
      message.error("Please enter your comments before rejecting");
      return;
    }

    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local state - remove rejected deferral from list
      const updatedDeferrals = deferrals.filter(d => d._id !== selectedDeferral._id);
      
      setDeferrals(updatedDeferrals);
      message.success("Deferral rejected successfully!");
      
      // Close modal and reset
      setModalVisible(false);
      setSelectedDeferral(null);
      setCreatorComment("");
      
    } catch (error) {
      console.error("Error rejecting deferral:", error);
      message.error("Failed to reject deferral");
    } finally {
      setActionLoading(false);
    }
  };

  // Export functionality
  const exportDeferrals = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Customer No,Customer Name,DCL No,Document,Loan Type,Expiry Date,RM,Priority,Days Remaining\n" +
      filteredDeferrals.map(d => 
        `${d.customerNumber},"${d.customerName}",${d.dclNo},"${d.documentName}",${d.loanType},${dayjs(d.expiryDate).format('DD/MM/YYYY')},${d.assignedRM.name},${d.priority},${d.daysRemaining}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pending_deferrals_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success("Deferrals exported successfully!");
  };

  // Custom table styles
  const customTableStyles = `
    .deferrals-table .ant-table-wrapper { 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 10px 30px rgba(22, 70, 121, 0.08); 
      border: 1px solid #e0e0e0; 
    }
    .deferrals-table .ant-table-thead > tr > th { 
      background-color: #f7f7f7 !important; 
      color: ${PRIMARY_BLUE} !important; 
      font-weight: 700; 
      fontSize: 15px; 
      padding: 16px 16px !important; 
      border-bottom: 3px solid ${ACCENT_LIME} !important; 
      border-right: none !important; 
    }
    .deferrals-table .ant-table-tbody > tr > td { 
      border-bottom: 1px solid #f0f0f0 !important; 
      border-right: none !important; 
      padding: 14px 16px !important; 
      fontSize: 14px; 
      color: #333; 
    }
    .deferrals-table .ant-table-tbody > tr.ant-table-row:hover > td { 
      background-color: rgba(181, 211, 52, 0.1) !important; 
      cursor: pointer; 
    }
    .deferrals-table .ant-table-bordered .ant-table-container, 
    .deferrals-table .ant-table-bordered .ant-table-tbody > tr > td, 
    .deferrals-table .ant-table-bordered .ant-table-thead > tr > th { 
      border: none !important; 
    }
    .deferrals-table .ant-pagination .ant-pagination-item-active { 
      background-color: ${ACCENT_LIME} !important; 
      border-color: ${ACCENT_LIME} !important; 
    }
    .deferrals-table .ant-pagination .ant-pagination-item-active a { 
      color: ${PRIMARY_BLUE} !important; 
      font-weight: 600; 
    }
    .deferrals-table .ant-pagination .ant-pagination-item:hover { 
      border-color: ${ACCENT_LIME} !important; 
    }
    .deferrals-table .ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link, 
    .deferrals-table .ant-pagination .ant-pagination-next:hover .ant-pagination-item-link { 
      color: ${ACCENT_LIME} !important; 
    }
    .deferrals-table .ant-pagination .ant-pagination-options .ant-select-selector { 
      border-radius: 8px !important; 
    }
  `;

  // Enhanced columns with deferral-specific data INCLUDING CUSTOMER NAME
  const columns = [
    { 
      title: "DCL No", 
      dataIndex: "dclNo", 
      width: 180, 
      render: (text) => (
        <div style={{ fontWeight: "bold", color: PRIMARY_BLUE, display: "flex", alignItems: "center", gap: 8 }}>
          <FileTextOutlined style={{ color: SECONDARY_PURPLE }} />
          {text}
        </div>
      )
    },
    { 
      title: "Customer Number", 
      dataIndex: "customerNumber", 
      width: 150, 
      render: (text) => (
        <div style={{ color: SECONDARY_PURPLE, fontWeight: 500, fontSize: 13 }}>
          {text}
        </div>
      )
    },
    { 
      title: "Customer Name", 
      dataIndex: "customerName", 
      width: 200, 
      render: (text, record) => (
        <div>
          <div style={{ 
            fontWeight: 600, 
            color: PRIMARY_BLUE,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2
          }}>
            <CustomerServiceOutlined style={{ fontSize: 12 }} />
            {text}
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>
            {record.loanType}
          </div>
        </div>
      )
    },
    { 
      title: "Document", 
      key: "document",
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4, color: PRIMARY_BLUE }}>
            {record.documentName}
          </div>
          <div style={{ 
            fontSize: 11, 
            color: "#666",
            fontStyle: "italic",
            lineHeight: 1.3
          }}>
            {record.deferralReason?.substring(0, 60)}...
          </div>
        </div>
      )
    },
    { 
      title: "RM", 
      dataIndex: "assignedRM", 
      width: 120, 
      render: (rm) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <UserOutlined style={{ color: PRIMARY_BLUE, fontSize: 12 }} />
          <span style={{ color: PRIMARY_BLUE, fontWeight: 500, fontSize: 13 }}>{rm?.name || "N/A"}</span>
        </div>
      )
    },
    { 
      title: "Timeline", 
      key: "timeline",
      width: 130,
      render: (_, record) => {
        const expiryDate = dayjs(record.expiryDate);
        const now = dayjs();
        const daysRemaining = expiryDate.diff(now, 'day');
        const isExpired = daysRemaining < 0;
        const isExpiringSoon = daysRemaining <= 3 && daysRemaining >= 0;

        let statusColor = SUCCESS_GREEN;
        let statusIcon = <ClockCircleOutlined />;
        let statusText = `${daysRemaining}d left`;

        if (isExpired) {
          statusColor = ERROR_RED;
          statusIcon = <ExclamationCircleOutlined />;
          statusText = `Expired`;
        } else if (isExpiringSoon) {
          statusColor = WARNING_ORANGE;
          statusIcon = <WarningOutlined />;
          statusText = `${daysRemaining}d left`;
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {React.cloneElement(statusIcon, { style: { color: statusColor, fontSize: 14 } })}
            <span style={{ color: statusColor, fontWeight: "bold", fontSize: 12 }}>
              {statusText}
            </span>
          </div>
        );
      }
    },
    { 
      title: "# Docs", 
      dataIndex: "documents", 
      width: 80, 
      align: "center", 
      render: (docs) => (
        <Tag 
          color={LIGHT_YELLOW} 
          style={{ 
            fontSize: 12, 
            borderRadius: 999, 
            fontWeight: "bold", 
            color: PRIMARY_BLUE, 
            border: `1px solid ${HIGHLIGHT_GOLD}`,
            minWidth: 32,
            textAlign: "center"
          }}
        >
          {Array.isArray(docs) ? docs.length : 0}
        </Tag>
      ) 
    },
    { 
      title: "Priority", 
      dataIndex: "priority", 
      width: 100,
      render: (priority) => {
        const priorityConfig = {
          low: { color: SUCCESS_GREEN, label: "Low" },
          medium: { color: WARNING_ORANGE, label: "Medium" },
          high: { color: ERROR_RED, label: "High" },
          critical: { color: "#8B0000", label: "Critical" }
        };
        
        const config = priorityConfig[priority] || priorityConfig.medium;
        
        return (
          <Tag 
            color={config.color}
            style={{ 
              fontWeight: "bold",
              border: "none",
              color: "white",
              width: "100%",
              textAlign: "center",
              fontSize: 11
            }}
          >
            {config.label}
          </Tag>
        );
      }
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      width: 120, 
      render: (status) => (
        <Tag 
          color="processing" 
          style={{ 
            fontSize: 11, 
            borderRadius: 999, 
            fontWeight: "bold", 
            padding: "2px 8px"
          }}
        >
          Pending Review
        </Tag>
      )
    }
  ];

  // Filter component (simplified - no status filter since all are pending)
  const renderFilters = () => (
    <Card 
      style={{ 
        marginBottom: 16,
        background: "#fafafa",
        border: `1px solid ${PRIMARY_BLUE}20`
      }}
      size="small"
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search by customer number or DCL No..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            allowClear
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="Priority"
            value={filters.priority}
            onChange={(value) => setFilters({...filters, priority: value})}
            allowClear
          >
            <Option value="all">All Priorities</Option>
            <Option value="critical">Critical</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['Start Date', 'End Date']}
            value={filters.dateRange}
            onChange={(dates) => setFilters({...filters, dateRange: dates})}
            format="DD/MM/YYYY"
          />
        </Col>
        
        <Col xs={24} sm={12} md={2}>
          <Button 
            onClick={() => setFilters({
              priority: 'all',
              search: '',
              dateRange: null
            })}
            style={{ width: '100%' }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Card>
  );

  // Handle row click to open modal
  const handleRowClick = (record) => {
    setSelectedDeferral(record);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <style>{customTableStyles}</style>

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
            <h2 style={{ margin: 0, color: PRIMARY_BLUE, display: "flex", alignItems: "center", gap: 12 }}>
              Pending Deferral Review
              <Badge 
                count={deferrals.length} 
                style={{ 
                  backgroundColor: ACCENT_LIME,
                  fontSize: 12
                }}
              />
            </h2>
            <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
              Review and approve/reject deferral requests from Relationship Managers
            </p>
          </Col>
          
          <Col>
            <Space>
              <Tooltip title="Refresh">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={loadDeferrals}
                  loading={loading}
                />
              </Tooltip>
              
              <Tooltip title="Export Pending Deferrals">
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={exportDeferrals}
                  disabled={filteredDeferrals.length === 0}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      {renderFilters()}

      {/* Table Title */}
      <Divider style={{ margin: "12px 0" }}>
        <span style={{ color: PRIMARY_BLUE, fontSize: 16, fontWeight: 600 }}>
          Pending Deferral Requests ({filteredDeferrals.length} items)
        </span>
      </Divider>

      {/* Deferrals Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40 }}>
          <Spin tip="Loading pending deferrals..." />
        </div>
      ) : filteredDeferrals.length === 0 ? (
        <Empty 
          description={
            <div>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No pending deferrals found</p>
              <p style={{ color: "#999" }}>
                {filters.search || filters.priority !== 'all' 
                  ? 'Try changing your filters' 
                  : 'All deferral requests have been processed'}
              </p>
            </div>
          } 
          style={{ padding: 40 }} 
        />
      ) : (
        <div className="deferrals-table">
          <Table 
            columns={columns} 
            dataSource={filteredDeferrals} 
            rowKey={(record) => record._id || record.id} 
            size="large" 
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true, 
              pageSizeOptions: ["10", "20", "50"], 
              position: ["bottomCenter"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pending deferrals`
            }} 
            rowClassName={(record, index) => (index % 2 === 0 ? "bg-white" : "bg-gray-50")}
            scroll={{ x: 1300 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
          />
        </div>
      )}

      {/* Deferral Review Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: "bold", color: PRIMARY_BLUE }}>
              Review Deferral Request
            </span>
            {selectedDeferral && (
              <Tag color="blue" style={{ fontWeight: "bold" }}>
                {selectedDeferral.dclNo}
              </Tag>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDeferral(null);
          setCreatorComment("");
        }}
        width={800}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setModalVisible(false);
              setSelectedDeferral(null);
              setCreatorComment("");
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="reject" 
            danger
            onClick={handleRejectDeferral}
            loading={actionLoading}
            disabled={actionLoading || !creatorComment.trim()}
          >
            Reject Deferral
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={handleApproveDeferral}
            loading={actionLoading}
            disabled={actionLoading || !creatorComment.trim()}
            style={{ background: ACCENT_LIME, borderColor: ACCENT_LIME }}
          >
            Approve Deferral
          </Button>
        ]}
      >
        {selectedDeferral && (
          <div style={{ padding: "16px 0" }}>
            {/* Summary Card - Updated with Customer Name */}
            <Card 
              size="small" 
              title="Deferral Summary"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Customer Number:</strong>
                  <div>{selectedDeferral.customerNumber}</div>
                </Col>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Customer Name:</strong>
                  <div style={{ fontWeight: 600, color: PRIMARY_BLUE }}>
                    {selectedDeferral.customerName}
                  </div>
                </Col>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Loan Type:</strong>
                  <div>{selectedDeferral.loanType} - {selectedDeferral.loanAmount}</div>
                </Col>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Document:</strong>
                  <div>{selectedDeferral.documentName}</div>
                </Col>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Priority:</strong>
                  <div>
                    <Tag 
                      color={selectedDeferral.priority === 'critical' ? 'red' : 
                             selectedDeferral.priority === 'high' ? 'orange' : 
                             selectedDeferral.priority === 'medium' ? 'blue' : 'green'}
                    >
                      {selectedDeferral.priority.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <strong style={{ color: PRIMARY_BLUE }}>Assigned RM:</strong>
                  <div>{selectedDeferral.assignedRM?.name}</div>
                </Col>
              </Row>
            </Card>

            {/* Details Card */}
            <Card size="small" title="Deferral Details" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: PRIMARY_BLUE, display: "block", marginBottom: 4 }}>
                  Deferral Reason:
                </strong>
                <div style={{ 
                  background: "#f8f9fa", 
                  padding: 12, 
                  borderRadius: 4,
                  fontStyle: "italic"
                }}>
                  {selectedDeferral.deferralReason}
                </div>
              </div>
              
              <div>
                <strong style={{ color: PRIMARY_BLUE, display: "block", marginBottom: 4 }}>
                  RM Comments:
                </strong>
                <div style={{ 
                  background: "#f8f9fa", 
                  padding: 12, 
                  borderRadius: 4
                }}>
                  {selectedDeferral.rmComments}
                </div>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card size="small" title="Timeline" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <strong>Requested:</strong>
                  <div>{dayjs(selectedDeferral.requestedDate).format('DD/MM/YYYY HH:mm')}</div>
                </Col>
                <Col span={12}>
                  <strong>Expiry:</strong>
                  <div>
                    {dayjs(selectedDeferral.expiryDate).format('DD/MM/YYYY')}
                    {selectedDeferral.daysRemaining !== undefined && (
                      <Tag 
                        color={selectedDeferral.daysRemaining < 0 ? 'red' : 
                               selectedDeferral.daysRemaining <= 3 ? 'orange' : 'green'}
                        style={{ marginLeft: 8 }}
                      >
                        {selectedDeferral.daysRemaining < 0 
                          ? `Expired ${Math.abs(selectedDeferral.daysRemaining)} days ago`
                          : `${selectedDeferral.daysRemaining} days remaining`
                        }
                      </Tag>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Creator General Comment */}
            <Card size="small" title="Creator General Comment" style={{ marginBottom: 16 }}>
              <div>
                <TextArea
                  rows={4}
                  placeholder="Enter your general comments for this deferral request..."
                  value={creatorComment}
                  onChange={(e) => setCreatorComment(e.target.value)}
                  style={{ marginBottom: 8 }}
                />
              </div>
            </Card>

            {/* Documents Card (if available) */}
            {selectedDeferral.documents && selectedDeferral.documents.length > 0 && (
              <Card size="small" title="Related Documents">
                <Row gutter={[8, 8]}>
                  {selectedDeferral.documents.map((doc, index) => (
                    <Col span={12} key={index}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 8,
                        padding: 8,
                        background: "#f8f9fa",
                        borderRadius: 4
                      }}>
                        <FileTextOutlined style={{ color: PRIMARY_BLUE }} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{doc.name}</div>
                          <Tag size="small" color={doc.status === 'uploaded' ? 'success' : 'warning'}>
                            {doc.status}
                          </Tag>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Deferrals;