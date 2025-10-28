
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminRoute = ({ children }) => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
