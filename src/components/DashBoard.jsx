import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Users from "./Users";
import Group from "./Group";

const DashBoard = () => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1">
            <Router>
                <Routes>
                    <Route path="/app/users" element={<Users />} />
                    <Route path="/app/groups" element={<Group />} />
                </Routes>
            </Router>
        </div>
    </div>
);

export default DashBoard;