import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusfind_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('campusfind_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('campusfind_user', JSON.stringify(user));
      localStorage.setItem('campusfind_token', token);
    } else {
      localStorage.removeItem('campusfind_user');
      localStorage.removeItem('campusfind_token');
    }
  }, [user, token]);

  // Verify token on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const freshUser = await authService.getCurrentUser();
          if (freshUser) {
            setUser(freshUser);
          }
        } catch {
          // Token invalid or expired
        }
      }
    };
    verifyUser();
  }, [token]);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password, role);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleData) => {
    setLoading(true);
    try {
      const data = await authService.loginWithGoogle(googleData);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const normalizedRole = user?.role === 'faculty' ? 'staff' : user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        role: normalizedRole,
        isAdmin: normalizedRole === 'admin',
        isStaff: normalizedRole === 'staff',
        isFaculty: normalizedRole === 'staff', // backward-compatibility alias
        isStudent: normalizedRole === 'student',
        login,
        loginWithGoogle,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
