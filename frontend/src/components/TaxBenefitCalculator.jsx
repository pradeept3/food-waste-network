import React, { useState, useEffect } from 'react';
import { benefitsAPI } from '../api';

const TaxBenefitCalculator = ({ transactions = [] }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic tips from backend
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const data = await benefitsAPI.getPersonalizedTips();
        // Filter tips for providers
        const providerTips = data.tips ? data.tips.filter(tip => tip.priority === 'high').slice(0, 2) : [];
        setTips(providerTips);
      } catch (error) {
        console.error('Failed to fetch tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);
  // Calculate totals
  const totalQuantity = transactions.reduce((sum, trans) => {
    const qty = parseFloat(trans.quantity?.split(' ')[0] || 0);
    return sum + qty;
  }, 0);

  // Estimate food value at $1.50 per kg
  const foodValuePerKg = 1.50;
  const estimatedValue = (totalQuantity * foodValuePerKg).toFixed(2);
  const monthlyDeduction = estimatedValue;
  const yearlyDeduction = (estimatedValue * 12).toFixed(2);
  const taxSavings = (yearlyDeduction * 0.30).toFixed(2); // Assuming 30% tax rate

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-green-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">💰 Tax Deduction Summary</h3>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
          TAX BENEFIT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Donated</p>
          <p className="text-3xl font-bold text-green-600">{totalQuantity.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">kg</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Est. Food Value</p>
          <p className="text-3xl font-bold text-blue-600">${estimatedValue}</p>
          <p className="text-xs text-gray-500 mt-1">@$1.50/kg</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-purple-600">
        <p className="text-sm text-gray-700 font-medium mb-2">💡 Tax Impact This Month</p>
        <p className="text-2xl font-bold text-purple-600">${monthlyDeduction}</p>
        <p className="text-xs text-gray-500 mt-1">Deductible amount</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-yellow-50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Yearly Projection</p>
          <p className="text-lg font-bold text-yellow-700">${yearlyDeduction}</p>
        </div>
        <div className="bg-orange-50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Est. Tax Savings*</p>
          <p className="text-lg font-bold text-orange-700">${taxSavings}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4 italic">
        * Assumed 30% tax rate. Consult your tax advisor for accurate calculations.
      </p>

      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
          📄 Download Tax Certificate
        </button>
        <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors">
          📊 View Detailed History
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <p className="text-xs text-blue-800">
          <strong>💡 Personalized Tips:</strong>
        </p>
        {loading ? (
          <div className="text-xs text-blue-800 mt-2">Loading tips...</div>
        ) : tips.length > 0 ? (
          tips.map((tip, index) => (
            <div key={index} className="mt-2 text-xs text-blue-800">
              <p><strong>{tip.icon} {tip.title}</strong></p>
              <p className="mt-1">{tip.description}</p>
            </div>
          ))
        ) : (
          <p className="mt-2 text-xs text-blue-800">Keep donation records for accurate tax filing.</p>
        )}
      </div>
    </div>
  );
};

export default TaxBenefitCalculator;
