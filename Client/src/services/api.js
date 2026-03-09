// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Set auth token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// API functions
export const api = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (userData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },

    getProfile: async () => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
  },

  // Vehicle endpoints
  vehicles: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/vehicles${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_URL}/vehicles/${id}`);
      return handleResponse(response);
    },

    create: async (vehicleData) => {
      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    },

    update: async (id, vehicleData) => {
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
  },

  // Booking endpoints
  bookings: {
    create: async (bookingData) => {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    },

    getUserBookings: async () => {
      const response = await fetch(`${API_URL}/bookings/mybookings`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },

    getAllBookings: async () => {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },

    updateStatus: async (id, status) => {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
  },
};

export default api;