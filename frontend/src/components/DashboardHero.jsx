import React from 'react';

const DashboardHero = ({ foodSaved, mealsProvided, co2Saved, moneySaved }) => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-lg shadow-lg">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full transform -translate-x-20 translate-y-20"></div>

      {/* Content */}
      <div className="relative z-10 px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              🌍 Welcome to Food Waste Network
            </h1>
            <p className="text-lg text-blue-50 max-w-2xl">
              Join our mission to reduce food waste, feed communities, and protect our planet.
            </p>
          </div>
          {/* Hero Icon */}
          <div className="hidden lg:block">
            <div className="text-8xl opacity-20">🌱</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-blue-100 text-sm font-semibold mb-1">Food Saved</p>
            <p className="text-3xl font-bold text-white">{foodSaved} kg</p>
            <p className="text-blue-200 text-xs mt-2">From landfills</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-blue-100 text-sm font-semibold mb-1">Meals Provided</p>
            <p className="text-3xl font-bold text-white">{mealsProvided}</p>
            <p className="text-blue-200 text-xs mt-2">People helped</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-blue-100 text-sm font-semibold mb-1">CO₂ Prevented</p>
            <p className="text-3xl font-bold text-white">{co2Saved} kg</p>
            <p className="text-blue-200 text-xs mt-2">Carbon offset</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition">
            <p className="text-blue-100 text-sm font-semibold mb-1">Value Saved</p>
            <p className="text-3xl font-bold text-white">${moneySaved}</p>
            <p className="text-blue-200 text-xs mt-2">Economic impact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
