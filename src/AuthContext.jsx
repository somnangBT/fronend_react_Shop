import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize synchronously from storage so protected routes don't falsely redirect on refresh
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const syncStorage = () => {
      setUser(getStoredUser());
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (!localStorage.getItem('user') && !sessionStorage.getItem('user')) {
      try {
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (_) {}
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('luckshop_checkout_draft_v1');
    sessionStorage.removeItem('luckshop_checkout_completed_v1');
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check user role
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;