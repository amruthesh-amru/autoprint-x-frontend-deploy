import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // adjust the path accordingly

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Optionally, show a loader while checking authentication
  if (loading) return <div>Loading...</div>;

  // If authenticated, render child routes; otherwise, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
