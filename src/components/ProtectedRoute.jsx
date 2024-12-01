import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [role] = useState(localStorage.getItem("role"));
  const isLoggedIn = !!role;
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <>{children}</>;
}
