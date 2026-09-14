import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookTicket from "./pages/BookTicket";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Customize from "./pages/Customize";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
  </div>
);

// ============ FIXED AUTH FUNCTIONS ============
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || token === 'undefined' || token === 'null' || !userData) {
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    // Require a valid role to be considered authenticated
    if (user && (user.role === 'user' || user.role === 'admin')) {
      return true;
    }
  } catch (error) {
    // Ignore JSON parse errors
  }
  
  // Clean up invalid state to break redirect loops
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return false;
};

const isAdmin = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    const user = JSON.parse(userData);
    return user?.role === 'admin';
  } catch {
    return false;
  }
};

const getUserRole = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user?.role || null;
  } catch {
    return null;
  }
};

// Wrapper for routes that require authentication
const ProtectedRoute = ({ children, allowedRole }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();
  const location = window.location.pathname; // Using window.location.pathname because we don't have useLocation imported here. It works fine for loop prevention.
  
  if (!isAuth) {
    if (location === '/login') return children;
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && role !== allowedRole) {
    const target = role === 'admin' ? "/admin-dashboard" : "/dashboard";
    if (location === target) {
      if (!role) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
      }
      return children;
    }
    return <Navigate to={target} replace />;
  }
  
  return children;
};

const GuestRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();
  const location = window.location.pathname;
  
  if (isAuth) {
    const target = role === 'admin' ? "/admin-dashboard" : "/dashboard";
    if (location === target) return children;
    return <Navigate to={target} replace />;
  }
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Debug log
  useEffect(() => {
    console.log("User Role:", getUserRole());
    console.log("Is Admin:", isAdmin());
    console.log("Is Authenticated:", isAuthenticated());
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-gray-900">
          <Navbar />
          <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/customize" element={<Customize />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <GuestRoute>
                      <Register />
                    </GuestRoute>
                  } 
                />
                
                {/* User Dashboard - Only for regular users */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRole="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Dashboard - Only for admin */}
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Book Tour - Both user and admin can access? Usually only users */}
                <Route 
                  path="/book" 
                  element={
                    <ProtectedRoute>
                      <BookTicket />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 - Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;