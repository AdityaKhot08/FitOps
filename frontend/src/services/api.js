const BASE_URL = window.location.origin.includes('localhost:5173')
  ? 'http://localhost:5000/api'
  : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('fitops_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Authentication & Profile
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.success) {
        localStorage.setItem('fitops_token', data.data.token);
        localStorage.setItem('fitops_user', JSON.stringify(data.data));
      }
      return data;
    },
    register: async (name, email, password) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await handleResponse(res);
      if (data.success) {
        localStorage.setItem('fitops_token', data.data.token);
        localStorage.setItem('fitops_user', JSON.stringify(data.data));
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('fitops_token');
      localStorage.removeItem('fitops_user');
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      const data = await handleResponse(res);
      if (data.success) {
        // Sync local user details
        const currentUser = JSON.parse(localStorage.getItem('fitops_user') || '{}');
        const updatedUser = { ...currentUser, ...data.data };
        localStorage.setItem('fitops_user', JSON.stringify(updatedUser));
      }
      return data;
    },
    getCurrentUser: () => {
      const user = localStorage.getItem('fitops_user');
      return user ? JSON.parse(user) : null;
    },
    isAuthenticated: () => {
      return !!localStorage.getItem('fitops_token');
    },
  },

  // Workouts
  workouts: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/workouts`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (workoutData) => {
      const res = await fetch(`${BASE_URL}/workouts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(workoutData),
      });
      return handleResponse(res);
    },
    update: async (id, workoutData) => {
      const res = await fetch(`${BASE_URL}/workouts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(workoutData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Weight Tracking
  weights: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/weights`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (weight, date) => {
      const res = await fetch(`${BASE_URL}/weights`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ weight, date }),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/weights/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Goals
  goals: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/goals`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (goalData) => {
      const res = await fetch(`${BASE_URL}/goals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });
      return handleResponse(res);
    },
    update: async (id, goalData) => {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // AI Recommendations
  ai: {
    generateRecommendation: async () => {
      const res = await fetch(`${BASE_URL}/ai/recommend`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getHistory: async () => {
      const res = await fetch(`${BASE_URL}/ai/history`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Analytics
  analytics: {
    getDashboardData: async () => {
      const res = await fetch(`${BASE_URL}/analytics`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
