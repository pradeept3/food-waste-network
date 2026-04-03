import axios from 'axios';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and trigger logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Instead of redirecting to /login, dispatch a custom event
      // that the App component can listen to for logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/users/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/users/all');
    return response.data;
  },

  getUserCount: async () => {
    const response = await api.get('/api/users/count');
    return response.data;
  },
};

// Food Items API
export const foodAPI = {
  createItem: async (itemData) => {
    const response = await api.post('/api/food-items', itemData);
    return response.data;
  },

  getAvailableFood: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.latitude) params.append('latitude', filters.latitude);
    if (filters.longitude) params.append('longitude', filters.longitude);
    if (filters.radius_km) params.append('radius_km', filters.radius_km);
    if (filters.category) params.append('category', filters.category);

    const response = await api.get(`/api/food-items?${params.toString()}`);
    return response.data;
  },

  getItemById: async (itemId) => {
    const response = await api.get(`/api/food-items/${itemId}`);
    return response.data;
  },

  updateItem: async (itemId, updates) => {
    const response = await api.put(`/api/food-items/${itemId}`, updates);
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await api.delete(`/api/food-items/${itemId}`);
    return response.data;
  },
};

// Predictions API
export const predictionsAPI = {
  getSurplusPredictions: async () => {
    const response = await api.get('/api/predictions/surplus');
    return response.data;
  },

  analyzeWastePattern: async (startDate, endDate) => {
    const response = await api.post('/api/predictions/analyze', {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  },

  getMultiDayPredictions: async (days = 7) => {
    const response = await api.get(`/api/predictions/multi-day?days=${days}`);
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  reserveItem: async (itemId) => {
    const response = await api.post(`/api/transactions/reserve/${itemId}`);
    return response.data;
  },

  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/api/transactions?${params.toString()}`);
    return response.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await api.get(`/api/transactions/${transactionId}`);
    return response.data;
  },

  updateTransactionStatus: async (transactionId, status) => {
    const response = await api.put(`/api/transactions/${transactionId}/status`, {
      status,
    });
    return response.data;
  },

  rateTransaction: async (transactionId, rating, notes) => {
    const response = await api.post(`/api/transactions/${transactionId}/rate`, {
      rating,
      notes,
    });
    return response.data;
  },
};

// Metrics API
export const metricsAPI = {
  getImpactMetrics: async () => {
    const response = await api.get('/api/metrics/impact');
    return response.data;
  },

  getUserMetrics: async (userId = null) => {
    const url = userId ? `/api/metrics/user/${userId}` : '/api/metrics/user';
    const response = await api.get(url);
    return response.data;
  },

  getMetricsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/api/metrics/range', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};

// Logistics API
export const logisticsAPI = {
  optimizeRoute: async (pickupLocations, deliveryLocation) => {
    const response = await api.post('/api/logistics/optimize-route', {
      pickup_locations: pickupLocations,
      delivery_location: deliveryLocation,
    });
    return response.data;
  },

  calculateDistance: async (origin, destination) => {
    const response = await api.post('/api/logistics/calculate-distance', {
      origin,
      destination,
    });
    return response.data;
  },

  estimateEmissions: async (distance, vehicle = 'van') => {
    const response = await api.get('/api/logistics/emissions', {
      params: { distance, vehicle },
    });
    return response.data;
  },
};

// Matching API
export const matchingAPI = {
  findMatches: async (foodItemId) => {
    const response = await api.get(`/api/matching/find/${foodItemId}`);
    return response.data;
  },

  getRecommendedRecipients: async (filters = {}) => {
    const response = await api.get('/api/matching/recommended', { params: filters });
    return response.data;
  },

  getAllRecipients: async () => {
    const response = await api.get('/api/recipients');
    return response.data;
  },

  addRecipient: async (recipientData) => {
    const response = await api.post('/api/recipients', recipientData);
    return response.data;
  },
};

// Donations API
export const donationsAPI = {
  createDonation: async (donationData) => {
    const response = await api.post('/api/donations', donationData);
    return response.data;
  },

  getDonations: async () => {
    const response = await api.get('/api/donations');
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (unreadOnly = false) => {
    const response = await api.get('/api/notifications', {
      params: { unread_only: unreadOnly },
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  },
};

// Preferences API
export const preferencesAPI = {
  getPreferences: async () => {
    const response = await api.get('/api/preferences');
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/api/preferences', preferences);
    return response.data;
  },
};

// Benefits API - Dynamic personalized content
export const benefitsAPI = {
  getTestimonials: async (userType = null) => {
    try {
      const response = await api.get('/api/benefits/testimonials', {
        params: userType ? { user_type: userType } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return { testimonials: [] };
    }
  },

  getPersonalizedTips: async () => {
    try {
      const response = await api.get('/api/benefits/tips');
      return response.data;
    } catch (error) {
      console.error('Error fetching tips:', error);
      return { tips: [] };
    }
  },

  getSuccessStories: async (userType = null) => {
    try {
      const response = await api.get('/api/benefits/success-stories', {
        params: userType ? { user_type: userType } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching success stories:', error);
      return { stories: [] };
    }
  },

  getPersonalizationData: async () => {
    try {
      const response = await api.get('/api/benefits/personalization');
      return response.data;
    } catch (error) {
      console.error('Error fetching personalization data:', error);
      return {
        level: 'Growing',
        nextMilestone: 1000,
        progressToMilestone: 25,
        badge: '⭐',
        badgeText: 'Community Partner',
        recommendations: []
      };
    }
  }
};

// Utility functions
export const utils = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  geocodeAddress: async (address) => {
    const response = await api.post('/api/utils/geocode', { address });
    return response.data;
  },

  validateLocation: async (latitude, longitude) => {
    const response = await api.get('/api/utils/validate-location', {
      params: { latitude, longitude },
    });
    return response.data;
  },
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return {
      status: error.response.status,
      message,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Error in request setup
    return {
      status: -1,
      message: error.message || 'An unexpected error occurred',
    };
  }
};

// React hooks for API calls
export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo);
      setLoading(false);
      throw errorInfo;
    }
  };

  return { loading, error, callAPI };
};

export default api;