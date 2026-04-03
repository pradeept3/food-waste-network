// Location: frontend/src/utils/formatters.js

/**
 * Format distance in kilometers
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (!distance) return 'N/A';
  
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Format expiry time relative to now
 * @param {string|Date} expiryDate - Expiry date
 * @returns {string} Human-readable expiry time
 */
export const formatExpiryTime = (expiryDate) => {
  if (!expiryDate) return 'N/A';
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) {
    return 'Expired';
  }

  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  if (diffDays < 7) {
    const days = Math.floor(diffDays);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  return expiry.toLocaleDateString();
};

/**
 * Format quantity with unit
 * @param {number} quantity - Quantity value
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted quantity string
 */
export const formatQuantity = (quantity, unit) => {
  if (!quantity) return 'N/A';
  
  const formatted = Number(quantity).toFixed(quantity % 1 === 0 ? 0 : 1);
  return `${formatted} ${unit || ''}`;
};

/**
 * Format currency
 * @param {number} amount - Amount in dollars
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return `${currency}${Number(amount).toFixed(2)}`;
};

/**
 * Format weight in kilograms
 * @param {number} weight - Weight in kg
 * @returns {string} Formatted weight string
 */
export const formatWeight = (weight) => {
  if (!weight) return '0 kg';
  
  if (weight < 1) {
    return `${(weight * 1000).toFixed(0)} g`;
  }
  
  return `${weight.toFixed(1)} kg`;
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100 or 0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return 'N/A';
  
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone string
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format address (truncate if too long)
 * @param {string} address - Full address
 * @param {number} maxLength - Maximum length
 * @returns {string} Formatted address
 */
export const formatAddress = (address, maxLength = 50) => {
  if (!address) return 'N/A';
  
  if (address.length <= maxLength) return address;
  
  return `${address.slice(0, maxLength - 3)}...`;
};

/**
 * Format status badge text
 * @param {string} status - Status value
 * @returns {string} Human-readable status
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    available: 'Available',
    reserved: 'Reserved',
    collected: 'Collected',
    expired: 'Expired',
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_transit: 'In Transit',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Format user type
 * @param {string} userType - User type value
 * @returns {string} Human-readable user type
 */
export const formatUserType = (userType) => {
  if (!userType) return 'User';
  
  const typeMap = {
    restaurant: 'Restaurant',
    store: 'Grocery Store',
    farm: 'Farm',
    ngo: 'NGO',
    shelter: 'Shelter',
    buyer: 'Buyer'
  };
  
  return typeMap[userType.toLowerCase()] || userType;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Get color class based on urgency
 * @param {string|Date} expiryDate - Expiry date
 * @returns {object} Color classes for different elements
 */
export const getUrgencyColor = (expiryDate) => {
  if (!expiryDate) return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const hoursLeft = (expiry - now) / (1000 * 60 * 60);
  
  if (hoursLeft < 0) {
    return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
  }
  
  if (hoursLeft < 6) {
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  }
  
  if (hoursLeft < 24) {
    return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  }
  
  if (hoursLeft < 48) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
  }
  
  return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
};

/**
 * Calculate CO2 savings
 * @param {number} foodKg - Food weight in kg
 * @returns {number} CO2 saved in kg
 */
export const calculateCO2Savings = (foodKg) => {
  // Average CO2 per kg of food waste = 3kg
  return foodKg * 3;
};

/**
 * Calculate meals from food weight
 * @param {number} foodKg - Food weight in kg
 * @returns {number} Estimated number of meals
 */
export const calculateMeals = (foodKg) => {
  // Average meal size = 0.33kg (330g)
  return Math.floor(foodKg * 3);
};

export default {
  formatDistance,
  formatExpiryTime,
  formatQuantity,
  formatCurrency,
  formatWeight,
  formatDateTime,
  formatRelativeTime,
  formatPercentage,
  formatPhone,
  formatAddress,
  formatStatus,
  formatUserType,
  formatNumber,
  truncateText,
  getUrgencyColor,
  calculateCO2Savings,
  calculateMeals
};