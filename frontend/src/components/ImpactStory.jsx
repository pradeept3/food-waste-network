import React, { useState, useEffect } from 'react';
import { benefitsAPI } from '../api';

const ImpactStory = ({ transactions = [], userType = 'provider' }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await benefitsAPI.getTestimonials(userType);
        setTestimonials(data.testimonials || []);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [userType]);

  // Calculate impact metrics
  const totalDonated = transactions.reduce((sum, trans) => {
    const qty = parseFloat(trans.quantity?.split(' ')[0] || 0);
    return sum + qty;
  }, 0);

  // Estimate meals (assume 0.5kg per meal)
  const mealsFed = Math.round(totalDonated / 0.5);

  // Estimate CO2 saved (average 2kg CO2 per kg of food)
  const co2Saved = Math.round(totalDonated * 2);

  // Prevent negative metrics
  const displayDonated = Math.max(0, totalDonated);
  const displayMeals = Math.max(0, mealsFed);
  const displayCO2 = Math.max(0, co2Saved);

  return (
    <div className="space-y-6">
      {/* Impact Metrics Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">✨ Your Real Impact</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <p className="text-sm opacity-90 mb-2">Food Diverted</p>
            <p className="text-4xl font-bold">{displayDonated}</p>
            <p className="text-sm opacity-90 mt-1">kg</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <p className="text-sm opacity-90 mb-2">Meals Provided</p>
            <p className="text-4xl font-bold">{displayMeals}</p>
            <p className="text-sm opacity-90 mt-1">people fed</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <p className="text-sm opacity-90 mb-2">CO₂ Prevented</p>
            <p className="text-4xl font-bold">{displayCO2}</p>
            <p className="text-sm opacity-90 mt-1">kg emissions</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-lg font-semibold">
            🌍 You're making a difference! Every donation counts.
          </p>
        </div>
      </div>

      {/* Partner Testimonials - Dynamic Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">💬 What Our Partners Say</h4>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading testimonials...</div>
        ) : testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((story, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border-l-4 border-blue-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{story.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-800">{story.org}</p>
                      {story.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          ✓ {story.people} people helped
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 italic text-sm">"{story.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No testimonials available</div>
        )}

        <button className="w-full mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm">
          ⭐ See more feedback from recipients →
        </button>
      </div>

      {/* Social Sharing */}
      {userType === 'provider' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600">
          <h4 className="font-bold text-gray-800 mb-3">📱 Share Your Impact</h4>

          <p className="text-gray-700 text-sm mb-4">
            Inspire others by sharing your story on social media. Show the world your commitment to reducing food waste!
          </p>

          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              📘 Share on Facebook
            </button>
            <button className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 text-sm font-medium transition-colors">
              𝕏 Share on X/Twitter
            </button>
            <button className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 text-sm font-medium transition-colors">
              📷 Share on Instagram
            </button>
          </div>

          <div className="mt-4 p-3 bg-white rounded text-sm text-gray-700 border border-gray-200">
            <p>
              <strong>Sample message:</strong> "I've donated {displayDonated.toFixed(0)}kg of food and helped feed {displayMeals.toFixed(0)} people with TableShare! 🌍"
            </p>
          </div>
        </div>
      )}

      {userType === 'recipient' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-600">
          <h4 className="font-bold text-gray-800 mb-3">🙏 Recognition & Gratitude</h4>

          <p className="text-gray-700 text-sm mb-4">
            Our top food providers are featured in our monthly "Impact Heroes" report, celebrating their commitment to our community.
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
            <p className="text-sm font-medium text-green-900 mb-2">🏆 Top Providers This Month:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Green Valley Restaurant - 450kg donated</li>
              <li>• City Market & Store - 320kg donated</li>
              <li>• Farm Valley Supplies - 285kg donated</li>
            </ul>
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors">
            📧 Send Thank You Message to Donors
          </button>
        </div>
      )}

      {/* Sustainability Badge */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-6 text-center shadow-lg">
        <p className="text-lg font-bold mb-2">🌱 You're Part of the Solution</p>
        <p className="text-sm opacity-90 mb-4">
          Your commitment to food sharing reduces waste and strengthens our community.
        </p>
        <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/40">
          <p className="text-2xl">🏅</p>
          <p className="font-bold mt-1">Sustainability Champion</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactStory;
