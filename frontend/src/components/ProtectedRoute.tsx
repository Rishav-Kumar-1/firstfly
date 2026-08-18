// ProtectedRoute.tsx
// Wraps pages that require authentication.
// If the user is not logged in, they get redirected to /login.
// If adminOnly is true and the user is not an admin, redirect to home.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // While we check localStorage for the user, show a spinner
  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  // Not logged in → redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
    // "replace" means the /login page replaces the current history entry
    // so pressing "back" won't take them to the protected page again
  }

  // Logged in but not admin → redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // All checks passed → show the protected page
  return <>{children}</>;
}
