import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="w-64 h-screen bg-gray-800 text-white ">
      <div className="p-4 flex flex-col justify-between h-full">
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/app/users"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 bg-gray-700 rounded-lg"
                  : "block py-2 px-4 hover:bg-gray-700 rounded-lg"
              }
            >
              User Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/app/groups"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 bg-gray-700 rounded-lg"
                  : "block py-2 px-4 hover:bg-gray-700 rounded-lg"
              }
              onClick={(e) => {
                if (role !== "Admin") {
                  toast.error("Not Authorized, contact Admin");
                  e.preventDefault();
                }
              }}
              style={{
                cursor: role !== "Admin" ? "not-allowed" : "pointer",
                opacity: role !== "Admin" ? 0.5 : 1,
              }}
            >
              Group Management
            </NavLink>
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login')
            toast.success("Logged out successfully");
          }}
          className="w-full mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
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

export default Sidebar;
