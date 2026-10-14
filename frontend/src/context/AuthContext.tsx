import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'FARMER' | 'BUYER' | 'ADMIN') => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrione_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agrione_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data.user) {
            setUser(res.data.data.user);
            localStorage.setItem('agrione_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing stale auth token.');
          localStorage.removeItem('agrione_token');
          localStorage.removeItem('agrione_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { emailOrPhone, password });
      if (res.data.success) {
        const { user: loggedInUser, token: authToken } = res.data.data;
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem('agrione_token', authToken);
        localStorage.setItem('agrione_user', JSON.stringify(loggedInUser));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Check your network or credentials.',
      };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { user: newUser, token: authToken } = res.data.data;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('agrione_token', authToken);
        localStorage.setItem('agrione_user', JSON.stringify(newUser));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Verify input details.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('agrione_token');
    localStorage.removeItem('agrione_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const quickDemoLogin = async (role: 'FARMER' | 'BUYER' | 'ADMIN') => {
    let email = 'farmer@agrione.com';
    let password = 'Farmer@123';

    if (role === 'BUYER') {
      email = 'buyer@agrione.com';
      password = 'Buyer@123';
    } else if (role === 'ADMIN') {
      email = 'admin@agrione.com';
      password = 'Admin@123';
    }

    await login(email, password);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      localStorage.setItem('agrione_user', JSON.stringify(updated));
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
        localStorage.setItem('agrione_user', JSON.stringify(res.data.data.user));
        return { success: true, message: res.data.message || 'Profile updated successfully' };
      }
      return { success: false, message: res.data.message || 'Update failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed. Please try again.',
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      return {
        success: res.data.success,
        message: res.data.message || 'Password changed successfully',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to change password. Please verify current password.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUser,
        updateProfile,
        changePassword,
      }}
    >
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
