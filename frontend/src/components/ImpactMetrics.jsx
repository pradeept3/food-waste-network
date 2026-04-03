import React, { useState, useEffect } from 'react';
import { getRecoveryOrganizations, getDigitalSolutionImpact, getDigitalSolutionSummary, getImpactMetrics } from '../utils/historicalData';

export default function ImpactMetrics({ wasteKg = 1400 }) {
  const [organizations, setOrganizations] = useState([]);
  const [digitalPlatforms, setDigitalPlatforms] = useState([]);
  const [digitalSummary, setDigitalSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userWaste, setUserWaste] = useState(wasteKg);

  const impact = getImpactMetrics(userWaste);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgs, platforms, summary] = await Promise.all([
          getRecoveryOrganizations(),
          getDigitalSolutionImpact(),
          getDigitalSolutionSummary()
        ]);

        setOrganizations(orgs);
        setDigitalPlatforms(platforms);
        setDigitalSummary(summary);
      } catch (error) {
        console.error('Error loading impact data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading impact metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      {/* User Input Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculate Your Impact</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Waste Prevented (kg/month)
            </label>
            <input
              type="number"
              value={userWaste}
              onChange={(e) => setUserWaste(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter waste amount"
            />
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xs text-gray-600">Meals</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{impact.meals_provided}</div>
          <div className="text-sm text-green-700 mt-1">People Fed</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💨</span>
            <span className="text-xs text-gray-600">CO₂</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{impact.co2_saved_kg}</div>
          <div className="text-sm text-blue-700 mt-1">kg CO₂ Prevented</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-4 rounded-lg border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💧</span>
            <span className="text-xs text-gray-600">Water</span>
          </div>
          <div className="text-3xl font-bold text-cyan-600">{(impact.water_saved_liters / 1000).toFixed(1)}k</div>
          <div className="text-sm text-cyan-700 mt-1">Liters Conserved</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xs text-gray-600">Land</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{impact.land_saved_sqm}</div>
          <div className="text-sm text-yellow-700 mt-1">m² Land Conserved</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-gray-600">Value</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">${impact.economic_value}</div>
          <div className="text-sm text-purple-700 mt-1">Economic Value</div>
        </div>
      </div>

      {/* Global Recovery Organizations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Major Waste Recovery Organizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{org.name}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{org.country}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">Meals/Year</div>
                  <div className="font-semibold text-gray-800">{(org.meals_per_year / 1000000000).toFixed(2)}B</div>
                </div>
                <div>
                  <div className="text-gray-600">Waste Diverted</div>
                  <div className="font-semibold text-gray-800">{(org.waste_diverted_mt / 1000000).toFixed(2)}M MT</div>
                </div>
                <div>
                  <div className="text-gray-600">Est. 1979</div>
                  <div className="font-semibold text-gray-800">{org.established}</div>
                </div>
                <div>
                  <div className="text-gray-600">Network Size</div>
                  <div className="font-semibold text-gray-800">
                    {org.member_food_banks ? `${org.member_food_banks} banks` : org.community_kitchens ? `${org.community_kitchens} kitchens` : org.partner_restaurants ? `${org.partner_restaurants} partners` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Solutions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact of Digital Solutions</h3>
        
        {digitalSummary && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg mb-6 border-l-4 border-indigo-500">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-700 mb-1">Global Users</div>
                <div className="text-3xl font-bold text-indigo-600">{digitalSummary.total_users_millions}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-1">Meals Saved</div>
                <div className="text-3xl font-bold text-indigo-600">{digitalSummary.total_meals_saved_millions}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-1">Avg Reduction</div>
                <div className="text-3xl font-bold text-indigo-600">{digitalSummary.average_waste_reduction}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalPlatforms.map((platform, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-indigo-400 transition">
              <h4 className="font-semibold text-gray-800 mb-3">{platform.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-semibold">{platform.year_founded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Users</span>
                  <span className="font-semibold">{platform.users_millions}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Meals Saved</span>
                  <span className="font-semibold">{platform.meals_saved_millions}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Waste Reduction</span>
                  <span className="font-semibold text-green-600">{platform.waste_reduction_percent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-900 mb-2">🌱 Quick Fact</h4>
          <p className="text-sm text-orange-800">
            Every kilogram of food waste prevented saves ~14 MJ of energy and prevents ~0.5 kg of CO₂ emissions.
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h4 className="font-semibold text-green-900 mb-2">📊 Global Scale</h4>
          <p className="text-sm text-green-800">
            1.3 billion tons of food wasted annually globally, worth over $2 trillion in economic losses.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-900 mb-2">⚡ Your Power</h4>
          <p className="text-sm text-blue-800">
            By preventing {userWaste}kg of waste, you're making a measurable difference for our planet.
          </p>
        </div>
      </div>
    </div>
  );
}
