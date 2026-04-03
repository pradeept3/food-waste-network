import React, { useState, useEffect } from 'react';
import { benefitsAPI } from '../api';

const BudgetSavingsDashboard = ({ transactions = [], beneficiaries = 380 }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch success stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await benefitsAPI.getSuccessStories('recipient');
        setStories(data.stories || []);
      } catch (error) {
        console.error('Failed to fetch success stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);
  // Calculate totals received
  const totalQuantity = transactions.reduce((sum, trans) => {
    const qty = parseFloat(trans.quantity?.split(' ')[0] || 0);
    return sum + qty;
  }, 0);

  // Calculate food value (assuming $1.50/kg average)
  const foodValuePerKg = 1.50;
  const budgetSaved = (totalQuantity * foodValuePerKg).toFixed(2);
  const monthlyBudgetSaved = budgetSaved;
  const yearlyProjection = (budgetSaved * 12).toFixed(2);

  // Calculate people served capacity
  const maxCapacity = 450;
  const utilizationPercent = Math.round((beneficiaries / maxCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Main Budget Savings Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">💰 Budget Savings Dashboard</h3>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
            THIS MONTH
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Food Received</p>
            <p className="text-3xl font-bold">{totalQuantity.toFixed(1)} kg</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Budget Saved</p>
            <p className="text-3xl font-bold">${budgetSaved}</p>
          </div>
        </div>

        <p className="text-xs opacity-75 mb-4">
          Market value: ~$1.50/kg average. Savings calculated vs. sourcing from markets.
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="font-semibold mb-3 text-sm">This Month You're Able To:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Feed {Math.round(beneficiaries)} people with received surplus</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Redirect savings (${budgetSaved}) to other programs</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Expand services to 150+ more beneficiaries</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Yearly Projection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
          <p className="text-sm text-gray-700 font-medium mb-2">Yearly Projection</p>
          <p className="text-3xl font-bold text-blue-600">${yearlyProjection}</p>
          <p className="text-xs text-gray-600 mt-2">
            Based on current monthly rate of {totalQuantity.toFixed(1)} kg
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
          <p className="text-sm text-gray-700 font-medium mb-2">Budget Flexibility Gained</p>
          <p className="text-3xl font-bold text-purple-600">47%</p>
          <p className="text-xs text-gray-600 mt-2">
            More funds available for other essential services
          </p>
        </div>
      </div>

      {/* Beneficiary Capacity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-bold text-gray-800 mb-4">👥 Beneficiary Capacity</h4>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Current: {beneficiaries} people</span>
            <span className="text-sm font-medium text-gray-700">Max: {maxCapacity} people</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
              style={{ width: `${utilizationPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {utilizationPercent}% capacity utilization - {maxCapacity - beneficiaries} more people can be served
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm font-medium text-green-900">
            ✓ Your surplus food supply enables you to serve {beneficiaries} people daily!
          </p>
        </div>
      </div>

      {/* Donor Reliability Score */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border-l-4 border-orange-600">
        <h4 className="font-bold text-gray-800 mb-3">🤝 Food Supply Reliability</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Green Valley Restaurant</span>
            <span className="text-sm font-bold text-green-600">95% consistent</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">City Market & Store</span>
            <span className="text-sm font-bold text-blue-600">87% consistent</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Farm Valley Supplies</span>
            <span className="text-sm font-bold text-green-600">92% consistent</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 italic">
          Consistency scores help you plan with confidence
        </p>
      </div>

      {/* Success Stories - Dynamic Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🌟 Success Stories from Similar Organizations</h3>
        
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading stories...</div>
        ) : stories.length > 0 ? (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-600">
                <p className="font-bold text-gray-800 mb-2">{story.icon} {story.title}</p>
                <p className="text-sm text-gray-700 mb-3">{story.description}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(story.metrics).map(([key, value]) => (
                    <div key={key} className="bg-white p-2 rounded border border-blue-200">
                      <p className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-bold text-blue-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No stories available yet</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          📊 View Detailed Analytics
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors">
          📈 Monthly Report
        </button>
      </div>
    </div>
  );
};

export default BudgetSavingsDashboard;
