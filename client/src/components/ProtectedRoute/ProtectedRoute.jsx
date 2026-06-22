import { Navigate } from "react-router-dom";
import {jwtDecode}  from "jwt-decode";
import { useAuth } from "../../context/AuthContext";


const ProtectedRoute = ({ children }) => {
  const {token} = useAuth()
  if (!token) {
    return <Navigate to="/" />;
  } 

    let payload;
    try {
      payload = jwtDecode(token);
    } catch (err) {
      //token is not a valid JWT
      payload = null;
    }
    if (payload !== null) {
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        alert("Your Session has expired. Please Login again!");
        return <Navigate to="/" />;
      } else {
        return children;
      }
    } else {
      alert("Invalid session Please Log in Again!");
      return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
