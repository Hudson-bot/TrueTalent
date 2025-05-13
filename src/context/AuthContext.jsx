import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set auth token for axios globally
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Fetch current user data from API
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      if (response.data.success) {
        setCurrentUser(response.data.data);
        return { success: true, user: response.data.data };
      }
      return { success: false };
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // If API call fails but we have data in localStorage, create a user object from localStorage
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      
      if (userId && userRole) {
        const user = {
          id: userId,
          name: userName || '',
          email: userEmail || '',
          role: userRole
        };
        setCurrentUser(user);
        return { success: true, user };
      }
      
      // If no valid data in localStorage, clear everything
      logout();
      return { success: false };
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        await fetchCurrentUser();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userName', response.data.user.name || '');
        localStorage.setItem('userEmail', response.data.user.email || '');
        localStorage.setItem('userRole', response.data.user.role || '');
        localStorage.setItem('isLoggedIn', 'true');
        
        setToken(response.data.token);
        setAuthToken(response.data.token);
        setCurrentUser(response.data.user);
        
        return { success: true, user: response.data.user, token: response.data.token };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Signup function
  const signup = async (name, email, password, role) => {
    try {
      // Create request body without undefined values
      const requestBody = {
        name,
        email,
        password
      };
      
      // Only add role if it's defined
      if (role !== undefined) {
        requestBody.role = role;
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/signup', requestBody);

      if (response.data.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { 
          success: false, 
          message: error.response.data?.message || 'Signup failed',
          errors: error.response.data?.errors
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return { success: false, message: 'No response from server. Please try again.' };
      } else {
        // Something happened in setting up the request that triggered an Error
        return { success: false, message: error.message || 'Signup failed' };
      }
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setCurrentUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message || 'Reset link sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset link'
      };
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: newPassword
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userName', response.data.user.name || '');
        localStorage.setItem('userEmail', response.data.user.email || '');
        localStorage.setItem('userRole', response.data.user.role || '');
        localStorage.setItem('isLoggedIn', 'true');
        
        setToken(response.data.token);
        setAuthToken(response.data.token);
        setCurrentUser(response.data.user);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed'
      };
    }
  };

  // Context value
  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};