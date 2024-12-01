import React, {useState, useEffect} from "react";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Backend_URL = import.meta.env.VITE_Backend_URL;


const EditUserModal = ({ form, editId, setForm, onSubmit, onClose, isEditing }) => {
  const [groupsOptions, setGroupOptions] = useState([]);
  const [rolesOptions, setRolesOptions] = useState([]);
  const[groupAndOptions, setGroupAndOptions] = useState (null);

  const fetchGroupsAndRoles = async () => {
    try {
      const response = await axios.get(`${Backend_URL}/groups`);
      if (response.status === 200) {
        const groups = response.data;
        setGroupAndOptions(groups);
        setGroupOptions(groups.map((group) => group.groupName)); // Extract group names
      }
    } catch (error) {
      console.error("Failed to fetch groups and roles:", error);
    }
  };

  const updateRolesBasedOnGroups = () => {
    if (!groupAndOptions) return; 
  
    const selectedRoles = groupAndOptions
      .filter((group) => form.groups?.includes(group.groupName)) 
      .flatMap((group) => group.roles || []); 
  
    setRolesOptions([...new Set(selectedRoles)]); 
  };
  
  useEffect(() => {
    updateRolesBasedOnGroups();
  }, [form.groups, groupAndOptions]);

  useEffect(() => {
    fetchGroupsAndRoles();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    const userData = {
      username: form.username,
      email: form.email,
      role: form.role,
      groups: form.groups,
    };

    try {
      let response;
      if (isEditing) {
        console.log(userData)
        response = await axios.put(`${Backend_URL}/users/${editId}`, userData);
      } else {
        response = await axios.post(`${Backend_URL}/users`, userData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(isEditing ? "User updated successfully!" : "User created successfully!");

        setTimeout(() => {
          onClose();
        }, 2500);
      }
    } catch (error) {
      toast.error("There was an error while saving the user. Please try again.");
    }
  };

  const handleAddGroup = (group) => {
    if (!form.groups.includes(group)) {
      setForm({ ...form, groups: [...form.groups, group] });
    }
  };

  const handleRemoveGroup = (group) => {
    setForm({ ...form, groups: form.groups.filter((g) => g !== group) });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-2xl text-center font-bold mb-4">{isEditing ? "Edit User" : "Create User"}</h3>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Groups</label>
            <select
              className="w-full p-2 border border-gray-300 rounded mb-2"
              onChange={(e) => handleAddGroup(e.target.value)}
            >
              <option value="">Select a group</option>
              {groupsOptions.map((group,idx) => (
                <option key={idx} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap space-x-2">
              {form.groups.map((group) => (
                <div
                  key={group}
                  className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                >
                  <span>{group}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveGroup(group)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select a role</option>
              {rolesOptions?.map((role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleEdit}
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        closeOnClick
      />
    </div>
  );
};

export default EditUserModal;
