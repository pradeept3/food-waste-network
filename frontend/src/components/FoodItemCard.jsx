// Location: frontend/src/components/FoodItemCard.jsx

import React from 'react';
import { formatDistance, formatExpiryTime, formatQuantity } from '../utils/formatters';

const FoodItemCard = ({ item, onReserve, showDistance = true }) => {
  const getExpiryColor = (expiry) => {
    const hours = new Date(expiry) - new Date();
    const hoursLeft = hours / (1000 * 60 * 60);
    
    if (hoursLeft < 6) return 'bg-red-100 text-red-800';
    if (hoursLeft < 24) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getCategoryImage = (category) => {
    const imageMap = {
      vegetables: '/images/food/vegetables.svg',
      dairy: '/images/food/dairy.svg',
      bakery: '/images/food/bakery.svg',
      prepared: '/images/food/prepared.svg',
      meat: '/images/food/meat.svg',
      canned_goods: '/images/food/bakery.svg',
      frozen_meals: '/images/food/prepared.svg',
      grains: '/images/food/bakery.svg',
      fruits: '/images/food/fruits.svg',
      salads: '/images/food/vegetables.svg',
      root_vegetables: '/images/food/vegetables.svg',
      eggs: '/images/food/dairy.svg',
      cheese: '/images/food/dairy.svg',
      seafood: '/images/food/meat.svg',
      beverages: '/images/food/dairy.svg',
      default: '/images/food/vegetables.svg'
    };
    return imageMap[category?.toLowerCase()] || imageMap.default;
  };

  const handleReserve = () => {
    if (onReserve) {
      onReserve(item);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center overflow-hidden relative group">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <img 
            src={getCategoryImage(item.category)} 
            alt={item.category}
            className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {/* Overlay Badge */}
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg px-3 py-1">
          <span className="text-xs font-semibold text-gray-700 capitalize">{item.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Provider */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm flex items-center">
            <span className="mr-1">🏢</span>
            {item.provider?.name || item.provider_name || 'Food Provider'}
          </p>
        </div>

        {/* Expiry Badge */}
        <div className="mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExpiryColor(item.expiry_date)}`}>
            ⏰ Expires: {formatExpiryTime(item.expiry_date)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">📦 Quantity:</span>
            <span className="font-semibold text-gray-800">
              {formatQuantity(item.quantity, item.unit)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">🏷️ Category:</span>
            <span className="font-semibold text-gray-800 capitalize">
              {item.category}
            </span>
          </div>

          {showDistance && item.distance && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">📍 Distance:</span>
              <span className="font-semibold text-blue-600">
                {formatDistance(item.distance)}
              </span>
            </div>
          )}

          {item.estimated_value && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">💰 Value:</span>
              <span className="font-semibold text-green-600">
                ${item.estimated_value.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Status Badge */}
        <div className="mb-4">
          {item.status === 'available' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
              ✓ Available
            </span>
          )}
          {item.status === 'reserved' && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
              ⏳ Reserved
            </span>
          )}
          {item.status === 'collected' && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
              ✓ Collected
            </span>
          )}
        </div>

        {/* Action Button */}
        {item.status === 'available' && (
          <button
            onClick={handleReserve}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Reserve Now
          </button>
        )}

        {item.status === 'reserved' && (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Already Reserved
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodItemCard;