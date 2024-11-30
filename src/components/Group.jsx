import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Backend_URL = import.meta.env.VITE_Backend_URL;

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [newRole, setNewRole] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ groupName: "", description: "", roles: [] });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${Backend_URL}/groups`);
        if (response.status === 200) {
          setGroups(response.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error.message);
      }
    };

    fetchGroups();
  }, []);

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedGroup(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${Backend_URL}/groups/${selectedGroup._id}`, selectedGroup);

      if (response.status === 200) {
        toast.success("Group updated successfully");

        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === selectedGroup._id
              ? { ...group, ...response.data.group }
              : group
          )
        );

        setTimeout(() => {
          closeEditModal()
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to update group:", error);
      toast.error("Failed to update group. Please try again.");
    }
  };

  const openDeleteModal = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setGroupToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${Backend_URL}/groups/${groupToDelete._id}`);

      if (response.status === 200) {
        toast.success("Group deleted successfully");

        setGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupToDelete._id)
        );

        closeDeleteModal();
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error("Failed to delete group. Please try again.");
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewGroup({ name: "", description: "", roles: [] });
  };

  const handleCreateNewGroup = async () => {
    if ( !newGroup.groupName.trim() || !newGroup.description.trim() || newGroup.roles.length === 0) {
      return toast.error("Please fill in all the details");
    }

    try {
      const response = await axios.post(`${Backend_URL}/groups`, newGroup);

      if (response.status === 200 || response.status === 201) {
        const createdGroup = response.data.group;
        setGroups((prevGroups) => [...prevGroups, createdGroup]);
        toast.success("Group created successfully");

        setTimeout(() => {
          closeCreateModal();
        }, 2500);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Groups</h1>
        <button
          onClick={openCreateModal}
          className=" bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Create New Group
        </button>
      </div>
      <ul className="divide-y divide-gray-200 px-5">
        {groups.map((group) => (
          <li key={group._id} className="py-4 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">{group.groupName}</h2>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <div>
              <button
                onClick={() => openEditModal(group)}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(group)}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>


      {/* Create New Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-center mb-4">Create New Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroup.groupName}
                  onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter group description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Add Role</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter a new role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => {
                      if (newRole.trim() && Array.isArray(newGroup.roles) && !newGroup.roles.includes(newRole)) {
                        setNewGroup({
                          ...newGroup,
                          roles: [...newGroup.roles, newRole.trim()],
                        });
                        setNewRole("");
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Displaying Added Roles */}
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {newGroup?.roles?.map((role, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                    >
                      <span>{role}</span>
                      <button
                        onClick={() =>
                          setNewGroup({
                            ...newGroup,
                            roles: newGroup.roles.filter((r) => r !== role),
                          })
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeCreateModal}
                className="text-gray-500 hover:underline mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewGroup}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Group Name</label>
                <input
                  type="text"
                  value={selectedGroup.groupName}
                  onChange={(e) =>
                    setSelectedGroup({ ...selectedGroup, groupName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={selectedGroup.description}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Add New Role */}
              <div>
                <label className="block text-sm font-medium mb-1">Add Role</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter a new role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => {
                      if (newRole.trim() && !selectedGroup.roles.includes(newRole)) {
                        setSelectedGroup({
                          ...selectedGroup,
                          roles: [...selectedGroup.roles, newRole],
                        });
                        setNewRole("");
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Selected Roles</label>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.roles.map((role, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 px-3 py-1 rounded-md flex items-center"
                    >
                      <span>{role}</span>
                      <button
                        onClick={() =>
                          setSelectedGroup({
                            ...selectedGroup,
                            roles: selectedGroup.roles.filter((r) => r !== role),
                          })
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:underline mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-center mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete the group "{groupToDelete?.groupName}"?
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
        autoClose={2500}
        hideProgressBar
        closeOnClick
      />
    </div>
  );

}
export default Group;
