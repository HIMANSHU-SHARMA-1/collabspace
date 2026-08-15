import { Navigate } from "react-router-dom";
import {jwtDecode}  from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useAuth();
  
  let isInvalidOrExpired = false;
  let alertMessage = "";

  if (token) {
    try {
      const payload = jwtDecode(token);
      if (payload.exp * 1000 < Date.now()) {
        isInvalidOrExpired = true;
        alertMessage = "Your Session has expired. Please Login again!";
      }
    } catch (err) {
      isInvalidOrExpired = true;
      alertMessage = "Invalid session Please Log in Again!";
    }
  }

  useEffect(() => {
    if (isInvalidOrExpired) {
      alert(alertMessage);
      logout();
    }
  }, [isInvalidOrExpired, alertMessage, logout]);

  if (!token || isInvalidOrExpired) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
