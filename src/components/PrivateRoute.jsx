import React from 'react';
import { Navigate } from 'react-router-dom';
import useAppSelector from '../hooks/useAppSelector';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  // If auth state is still loading, you could return a loading spinner here
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute; 