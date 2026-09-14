// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/user-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If no children provided (just redirect case), redirect to role-specific dashboard
  if (!children) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  // Return children if all conditions are met
  return children;
};

export default ProtectedRoute;