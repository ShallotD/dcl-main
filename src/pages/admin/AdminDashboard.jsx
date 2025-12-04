import React, { useState } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useToggleActiveMutation,
  useChangeRoleMutation,
} from "../../api/userApi.js";

import UserTable from "./UserTable.jsx";
import CreateUserModal from "./CreateUserModal.jsx";

const AdminDashboard = () => {
  const { data: users = [], refetch } = useGetUsersQuery();

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [toggleActive] = useToggleActiveMutation();
  const [changeRole] = useChangeRoleMutation();

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "rm",
  });

  const handleCreate = async () => {
    await createUser(formData);
    setFormData({ name: "", email: "", password: "", role: "rm" });
    setOpenModal(false);
    refetch();
  };

  const handleToggleActive = async (id) => {
    await toggleActive(id);
    refetch();
  };

  const handleChangeRole = async (id, role) => {
    await changeRole({ id, role });
    refetch();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          🏦Admin Control Panel
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow"
        >
          + Create User
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Manage all users, roles, and account status securely.
      </p>

      <UserTable
        users={users}
        onToggleActive={handleToggleActive}
        onRoleChange={handleChangeRole}
      />

      <CreateUserModal
        visible={openModal}
        loading={isCreating}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreate}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;
