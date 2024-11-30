import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white ">
      <nav className="p-4">
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
            >
              Group Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
