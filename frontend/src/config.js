// Location: frontend/src/config.js

/**
 * Application Configuration
 * Central configuration file for the Food Waste Reduction Network
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000; // 30 seconds

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    register: `${API_URL}/api/users/register`,
    login: `${API_URL}/api/users/login`,
    logout: `${API_URL}/api/users/logout`,
    me: `${API_URL}/api/users/me`,
    refresh: `${API_URL}/api/users/refresh`
  },
  
  // Food Items
  food: {
    list: `${API_URL}/api/food-items`,
    create: `${API_URL}/api/food-items`,
    detail: (id) => `${API_URL}/api/food-items/${id}`,
    update: (id) => `${API_URL}/api/food-items/${id}`,
    delete: (id) => `${API_URL}/api/food-items/${id}`
  },
  
  // Predictions
  predictions: {
    surplus: `${API_URL}/api/predictions/surplus`,
    analyze: `${API_URL}/api/predictions/analyze`,
    multiDay: `${API_URL}/api/predictions/multi-day`
  },
  
  // Transactions
  transactions: {
    list: `${API_URL}/api/transactions`,
    reserve: (id) => `${API_URL}/api/transactions/reserve/${id}`,
    detail: (id) => `${API_URL}/api/transactions/${id}`,
    updateStatus: (id) => `${API_URL}/api/transactions/${id}/status`,
    rate: (id) => `${API_URL}/api/transactions/${id}/rate`
  },
  
  // Metrics
  metrics: {
    impact: `${API_URL}/api/metrics/impact`,
    user: `${API_URL}/api/metrics/user`,
    range: `${API_URL}/api/metrics/range`
  },
  
  // Logistics
  logistics: {
    optimizeRoute: `${API_URL}/api/logistics/optimize-route`,
    calculateDistance: `${API_URL}/api/logistics/calculate-distance`,
    emissions: `${API_URL}/api/logistics/emissions`
  },
  
  // Matching
  matching: {
    find: (id) => `${API_URL}/api/matching/find/${id}`,
    recommended: `${API_URL}/api/matching/recommended`
  },
  
  // Notifications
  notifications: {
    list: `${API_URL}/api/notifications`,
    markRead: (id) => `${API_URL}/api/notifications/${id}/read`,
    markAllRead: `${API_URL}/api/notifications/read-all`
  }
};

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: {
    lat: 37.7749,  // San Francisco
    lng: -122.4194
  },
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 3,
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
};

// Search/Filter Configuration
export const SEARCH_CONFIG = {
  defaultRadius: 10, // km
  radiusOptions: [5, 10, 15, 25, 50], // km
  maxResults: 50,
  minSearchLength: 2
};

// Food Categories
export const FOOD_CATEGORIES = [
  { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'fruit', label: 'Fruit', icon: '🍎' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'bakery', label: 'Bakery', icon: '🍞' },
  { value: 'meat', label: 'Meat & Poultry', icon: '🥩' },
  { value: 'seafood', label: 'Seafood', icon: '🐟' },
  { value: 'prepared', label: 'Prepared Food', icon: '🍽️' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'grains', label: 'Grains & Pasta', icon: '🌾' },
  { value: 'other', label: 'Other', icon: '🍴' }
];

// User Types
export const USER_TYPES = [
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'store', label: 'Grocery Store', icon: '🏪' },
  { value: 'farm', label: 'Farm', icon: '🌾' },
  { value: 'ngo', label: 'NGO/Food Bank', icon: '🤝' },
  { value: 'shelter', label: 'Shelter', icon: '🏠' },
  { value: 'buyer', label: 'Buyer', icon: '🛒' }
];

// Units of Measurement
export const UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'items', label: 'Items' },
  { value: 'portions', label: 'Portions' },
  { value: 'meals', label: 'Meals' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'ml', label: 'Milliliters (ml)' }
];

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Food Item Status
export const FOOD_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  COLLECTED: 'collected',
  EXPIRED: 'expired'
};

// Expiry Warning Thresholds (in hours)
export const EXPIRY_THRESHOLDS = {
  URGENT: 6,    // Less than 6 hours - Red
  HIGH: 24,     // Less than 24 hours - Orange
  MEDIUM: 48,   // Less than 48 hours - Yellow
  LOW: 72       // More than 48 hours - Green
};

// Impact Calculations
export const IMPACT_FACTORS = {
  CO2_PER_KG: 3.0,        // kg CO2 per kg food
  MEALS_PER_KG: 3,        // Average meals per kg
  WATER_PER_KG: 1000,     // Liters water per kg
  COST_PER_KG: 5.0        // Average cost per kg
};

// Pagination
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48, 96]
};

// Date/Time Formats
export const DATE_FORMATS = {
  display: 'MMM DD, YYYY',
  displayWithTime: 'MMM DD, YYYY HH:mm',
  api: 'YYYY-MM-DD',
  apiWithTime: 'YYYY-MM-DD HH:mm:ss'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  token: 'foodwaste_token',
  user: 'foodwaste_user',
  preferences: 'foodwaste_preferences',
  recentSearches: 'foodwaste_recent_searches'
};

// Feature Flags
export const FEATURES = {
  enableNotifications: true,
  enableChat: false,
  enablePayments: false,
  enableMaps: true,
  enableAIPredictions: true,
  enableAnalytics: true
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  timeout: 'Request timed out. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  itemCreated: 'Food item created successfully!',
  itemReserved: 'Food item reserved successfully!',
  itemUpdated: 'Food item updated successfully!',
  itemDeleted: 'Food item deleted successfully!',
  profileUpdated: 'Profile updated successfully!',
  passwordChanged: 'Password changed successfully!'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MATCH: 'match',
  PREDICTION: 'prediction',
  TRANSACTION: 'transaction',
  ALERT: 'alert',
  SYSTEM: 'system'
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  gray: '#6b7280'
};

// Theme Configuration
export const THEME = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    }
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

// Application Metadata
export const APP_META = {
  name: 'Food Waste Reduction Network',
  shortName: 'Food Waste Network',
  description: 'AI-Powered platform to reduce food waste and fight hunger',
  version: '1.0.0',
  author: 'Food Waste Network Team',
  supportEmail: 'support@foodwastenetwork.com',
  website: 'https://foodwastenetwork.com'
};

// Export everything as default config object
const config = {
  apiUrl: API_URL,
  apiVersion: API_VERSION,
  apiTimeout: API_TIMEOUT,
  apiEndpoints: API_ENDPOINTS,
  map: MAP_CONFIG,
  search: SEARCH_CONFIG,
  foodCategories: FOOD_CATEGORIES,
  userTypes: USER_TYPES,
  units: UNITS,
  transactionStatus: TRANSACTION_STATUS,
  foodStatus: FOOD_STATUS,
  expiryThresholds: EXPIRY_THRESHOLDS,
  impactFactors: IMPACT_FACTORS,
  pagination: PAGINATION,
  dateFormats: DATE_FORMATS,
  storageKeys: STORAGE_KEYS,
  features: FEATURES,
  errorMessages: ERROR_MESSAGES,
  successMessages: SUCCESS_MESSAGES,
  notificationTypes: NOTIFICATION_TYPES,
  chartColors: CHART_COLORS,
  theme: THEME,
  appMeta: APP_META
};

export default config;