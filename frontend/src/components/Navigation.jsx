// Location: frontend/src/components/Navigation.jsx

import React, { useState } from 'react';
import { authAPI } from '../api';

const Navigation = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'available', name: 'Available Food', icon: '🔍' },
    { id: 'predictions', name: 'AI Predictions', icon: '✨' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'transactions', name: 'Transactions', icon: '💼' }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      authAPI.logout();
      window.location.href = '/login';
    }
  };

  const getUserTypeColor = (userType) => {
    const colors = {
      restaurant: 'bg-blue-100 text-blue-800',
      ngo: 'bg-green-100 text-green-800',
      store: 'bg-purple-100 text-purple-800',
      farm: 'bg-yellow-100 text-yellow-800',
      shelter: 'bg-orange-100 text-orange-800',
      buyer: 'bg-pink-100 text-pink-800'
    };
    return colors[userType?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌍</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Food Waste Network</h1>
                <p className="text-xs md:text-sm opacity-90 hidden sm:block">
                  AI-Powered Surplus Management
                </p>
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Info */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs opacity-90">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${getUserTypeColor(user?.user_type)}`}>
                        {user?.user_type?.toUpperCase() || 'USER'}
                      </span>
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                      👤 Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                      ⚙️ Preferences
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                      📊 My Impact
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                      💳 Billing
                    </button>
                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <span className="text-2xl">{showMobileMenu ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Desktop */}
      <nav className="bg-white shadow-md sticky top-[72px] z-40 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg fixed top-[72px] left-0 right-0 z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
          {/* Mobile Navigation */}
          <div className="py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left py-3 px-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Mobile User Menu */}
          <div className="border-t py-2">
            <div className="px-4 py-3">
              <p className="font-semibold">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${getUserTypeColor(user?.user_type)}`}>
                {user?.user_type?.toUpperCase() || 'USER'}
              </span>
            </div>
            <button className="w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors">
              👤 Profile Settings
            </button>
            <button className="w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors">
              ⚙️ Preferences
            </button>
            <button className="w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors">
              📊 My Impact
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;