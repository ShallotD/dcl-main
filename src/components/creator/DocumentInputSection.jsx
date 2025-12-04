// import React from "react";
// import { Select, Input, Button, Space } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const DocumentInputSection = ({
//   documents,
//   selectedCategory,
//   setSelectedCategory,
//   newDocName,
//   setNewDocName,
//   handleAddNewDocument,
// }) => {
//   return (
//     <Space>
//       <Select
//         placeholder="Select Category"
//         style={{ width: 250 }}
//         value={selectedCategory}
//         onChange={setSelectedCategory}
//       >
//         {documents.map((cat, i) => (
//           <Option key={i} value={i}>
//             {cat.category}
//           </Option>
//         ))}
//       </Select>

//       <Input
//         placeholder="Document Name"
//         value={newDocName}
//         onChange={(e) => setNewDocName(e.target.value)}
//         style={{ width: 250 }}
//       />

//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={handleAddNewDocument}
//         disabled={selectedCategory === null}
        
//       >
//         Add
//       </Button>
//     </Space>
//   );
// };

// export default DocumentInputSection;


import React from "react";
import { Input, Select, Button, message } from "antd";

const { Option } = Select;

const DocumentInputSection = ({
  uniqueCategories = [],            // default to empty array
  selectedCategoryName,
  setSelectedCategoryName = () => {}, // default to no-op
  newDocName = "",
  setNewDocName = () => {},
  handleAddNewDocument = () => {},
}) => {
  // Safe check for categories
  const categories = Array.isArray(uniqueCategories) ? uniqueCategories : [];

  const handleAddClick = () => {
    if (!newDocName.trim() || !selectedCategoryName) {
      return message.error("Please enter a document name and select a category.");
    }
    handleAddNewDocument();
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
      <Input
        placeholder="Document Name"
        value={newDocName}
        onChange={(e) => setNewDocName(e.target.value)}
        style={{ flex: 1, minWidth: 200 }}
      />
      <Select
        placeholder="Select Category"
        value={selectedCategoryName}
        onChange={setSelectedCategoryName}
        style={{ minWidth: 160 }}
        allowClear
      >
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))
        ) : (
          <Option key="none" value="">
            No categories available
          </Option>
        )}
      </Select>
      <Button type="primary" onClick={handleAddClick}>
        Add Document
      </Button>
    </div>
  );
};

export default DocumentInputSection;
