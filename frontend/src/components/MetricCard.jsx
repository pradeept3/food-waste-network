import React from 'react';

const MetricCard = ({ title, value, unit, icon, color = 'blue', trend }) => {
  const colorMap = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
  };

  const bgColorMap = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colorMap[color] || 'border-blue-500'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
          {unit && <p className="text-gray-500 text-sm mt-1">{unit}</p>}
          {trend && (
            <p className="text-green-600 text-xs font-semibold mt-2">
              ↑ {trend}% this month
            </p>
          )}
        </div>
        <div className={`text-5xl p-3 rounded-lg ${bgColorMap[color] || 'bg-blue-50'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
