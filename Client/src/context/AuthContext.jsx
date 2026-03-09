// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api, { setToken, removeToken } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const data = await api.auth.getProfile();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      
      if (data.success) {
        setUser(data.user);
        setToken(data.user.token);
        toast.success('Login successful!');
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.auth.register(userData);
      
      if (data.success) {
        setUser(data.user);
        setToken(data.user.token);
        toast.success('Registration successful!');
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;