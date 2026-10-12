import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacultyRoute = ({ children }) => {
  const { isAuthenticated, isFaculty, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isFaculty && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default FacultyRoute;
