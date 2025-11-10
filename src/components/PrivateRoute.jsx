import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  // Check if user is logged in by looking at Redux state
  const customer = useSelector((state) => state.user.customer);

  // If customer exists in Redux state, allow access to protected routes
  return customer ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
