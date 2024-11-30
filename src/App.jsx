import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Group from "./components/Group";
import Login from "./components/Login";

const Layout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/groups" element={<Group />} />
      </Routes>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app/*" element={<Layout />} /> 
      </Routes>
    </Router>
  );
};

export default App;
