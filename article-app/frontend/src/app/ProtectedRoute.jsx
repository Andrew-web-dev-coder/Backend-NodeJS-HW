import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../auth";

function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * ProtectedRoute
 *
 * @param {ReactNode} children
 * @param {boolean} adminOnly 
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = getToken();
  const user = getUserFromToken(token);

  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
