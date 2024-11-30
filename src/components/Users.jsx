import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "./EditUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Backend_URL = import.meta.env.VITE_Backend_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", role: "", groups: [] });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const[activeid, setActiveid] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${Backend_URL}/users`);
      setUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`/api/users/${editId}`, form).then((res) => {
        setUsers(users.map((user) => (user.id === editId ? res.data : user)));
        resetForm();
      });
    } else {
      axios.post("/api/users", form).then((res) => {
        setUsers([...users, res.data]);
        resetForm();
      });
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user._id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setForm({ username: "", email: "", role: "", groups: [] });
    setEditId(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setActiveid(user._id)
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${Backend_URL}/users/${activeid}`)
      .then(() => {
        // Update state after successful deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== activeid));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      });

      toast.success("user Deleted Successfully")
      setTimeout(()=>{
        closeDeleteModal();
      },2500)
  };
  
  const resetForm = () => {
    setForm({ username: "", email: "", role: "", groups: "" });
    setEditId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="mb-4 px-4 flex justify-between">
        <h2 className="text-2xl font-bold mb-4 text-center px-4">Users</h2>
        <button
          className=" mr-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleCreate}
        >
          Create New User
        </button>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Roles</th>
            <th className="py-2 px-4">Groups</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.groups.join(", ")}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => openDeleteModal(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>

      </table>

      {isModalOpen && (
        <EditUserModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={resetForm}
          editId = {editId}
          isEditing={!!editId}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-center mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete?
            </p>
            <div className="flex justify-between">
              <button
                onClick={closeDeleteModal}
                className="text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        closeOnClick
      />
    </div>
  );
};

export default Users;
