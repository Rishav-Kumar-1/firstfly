// AuthContext.tsx
// This context stores the logged-in user's info and makes it available
// to ANY component in the app — without prop drilling.

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types';

// Define what the AuthContext will provide to components
interface AuthContextType {
  user: AuthUser | null;         // null = not logged in
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

// Create the context with a default value of null
// useContext(AuthContext) returns this value if used outside a Provider
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider wraps your entire app and provides the auth state
// Any component inside <AuthProvider> can call useAuth() to get user info
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // When the app loads, check if a user was previously logged in
  // We store the user in localStorage so login persists after page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('travelgo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('travelgo_user'); // clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  // login: save user to state AND localStorage
  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('travelgo_user', JSON.stringify(userData));
  };

  // logout: clear user from state AND localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelgo_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,        // !! converts to boolean: null → false, object → true
    isAdmin: user?.role === 'ADMIN',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — instead of writing useContext(AuthContext) every time,
// components just call useAuth() for a cleaner syntax
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
