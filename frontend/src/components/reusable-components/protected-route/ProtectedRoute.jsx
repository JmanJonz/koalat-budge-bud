import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../atoms';

// Protected Route wrapper - redirects to login if not authenticated
export const ProtectedRoute = ({ children }) => {
  const currentUser = useAtomValue(currentUserAtom);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a brief moment for the App.jsx useEffect to fetch user data
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (isChecking) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!currentUser || !currentUser.userId) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login-page" replace />;
  }

  // User is authenticated, render the protected component
  return children;
};
