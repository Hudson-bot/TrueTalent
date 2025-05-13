import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  // If still loading auth state, show nothing (or could show a spinner)
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and user doesn't have it, redirect
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect based on their actual role
    if (currentUser.role === 'client') {
      // return <Navigate to="/hire/profile" />;
      return <Navigate to="/hire/projects" />;
    } else if (currentUser.role === 'freelancer') {
      return <Navigate to="/gethired/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // If authenticated and has required role (or no specific role required), render children
  return children;
};

export default ProtectedRoute;