// Location: frontend/src/pages/Dashboard.jsx

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/MetricCard';

const Dashboard = ({ impactMetrics, wasteByDay, wasteByCategory }) => {
  // Default data if props not provided
  const defaultImpactMetrics = impactMetrics || {
    foodSaved: 245.5,
    mealsProvided: 818,
    co2Saved: 736.5,
    moneySaved: 1950,
    connections: 12
  };

  const defaultWasteByDay = wasteByDay || [
    { day: 'Mon', waste: 45.2 },
    { day: 'Tue', waste: 32.1 },
    { day: 'Wed', waste: 28.5 },
    { day: 'Thu', waste: 35.8 },
    { day: 'Fri', waste: 42.3 },
    { day: 'Sat', waste: 38.6 },
    { day: 'Sun', waste: 23.0 }
  ];

  const defaultWasteByCategory = wasteByCategory || [
    { name: 'Vegetables', value: 75.3, color: '#10b981' },
    { name: 'Dairy', value: 45.2, color: '#3b82f6' },
    { name: 'Bakery', value: 85.0, color: '#f59e0b' },
    { name: 'Prepared', value: 40.0, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8 p-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
          <p className="text-blue-100">Here's your impact summary for this month</p>
        </div>

        {/* Impact Metrics Grid */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard title="Food Saved" value={defaultImpactMetrics.foodSaved} unit="kg" icon="🍽️" color="green" trend={15} />
            <MetricCard title="Meals Provided" value={defaultImpactMetrics.mealsProvided} unit="meals" icon="🥘" color="blue" trend={12} />
            <MetricCard title="CO₂ Saved" value={defaultImpactMetrics.co2Saved} unit="kg" icon="🌱" color="green" trend={18} />
            <MetricCard title="Money Saved" value={`$${defaultImpactMetrics.moneySaved}`} unit="" icon="💰" color="yellow" trend={10} />
            <MetricCard title="Connections" value={defaultImpactMetrics.connections} unit="NGOs" icon="🤝" color="purple" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste by Day Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Waste by Day of Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={defaultWasteByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="waste" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Waste by Category Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Waste by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={defaultWasteByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {defaultWasteByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
              <span className="text-2xl">➕</span>
              <span className="font-semibold">Add Surplus Food</span>
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
              <span className="text-2xl">🔍</span>
              <span className="font-semibold">Find Recipients</span>
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="font-semibold">View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: '✅', text: 'Food donation completed to Hope Shelter', time: '2 hours ago', color: 'text-green-600' },
              { icon: '📦', text: 'New surplus listing created: Fresh Vegetables', time: '5 hours ago', color: 'text-blue-600' },
              { icon: '🤝', text: 'Connected with Community Food Bank', time: '1 day ago', color: 'text-purple-600' },
              { icon: '📈', text: 'AI prediction: 15kg surplus expected tomorrow', time: '1 day ago', color: 'text-orange-600' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span className={`text-2xl ${activity.color}`}>{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-800">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;