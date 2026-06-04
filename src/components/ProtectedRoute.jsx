import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * A wrapper component that redirects to the login page if the user is not authenticated.
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;