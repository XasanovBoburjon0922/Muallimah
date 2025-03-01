import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { loadState } from "../config/storage";
import { message } from "antd";

export const ProtectedRoute = ({ allowedRoles }) => {
  const user = loadState("muallimah-user");
  const userRole = user?.role;

  if (!userRole) {
    message.error("The required role does not exist.");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    message.error(
      `${allowedRoles.join(", ")} role required to access this page!`
    );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
