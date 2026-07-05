import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  // Prevent flash routing flags while Firebase re-authenticates token keys
  if (loading) return <div>Authenticating secure session infrastructure...</div>;

  // Intercept unauthorized navigation attempts
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;