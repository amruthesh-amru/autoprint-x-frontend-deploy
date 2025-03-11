// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/utils/api";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to hold authentication info: whether authenticated and whether loading is in progress
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // On mount, call the backend auth-check endpoint.
    // This endpoint should verify the token from the httpOnly cookie.
    axios
      .post(API.CHECK_AUTH, {
        withCredentials: true,
      })
      .then((response) => {
        // If the token is valid, the response should indicate that the user is authenticated.
        setAuth({
          isAuthenticated: response.data.isAuthenticated,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        // If there's an error, assume the user is not authenticated.
        setAuth({
          isAuthenticated: false,
          loading: false,
        });
      });
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
