import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/ai/waste-predictions?days_history=30');
      setRecommendations(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Could not fetch AI recommendations. Make sure Gemini API is configured.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin text-3xl mb-2">⏳</div>
            <p className="text-gray-600">Loading AI recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-yellow-800">AI Not Available</h3>
            <p className="text-yellow-700 text-sm">{error}</p>
            <button
              onClick={fetchRecommendations}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Retry →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">✨</span>
        <h3 className="text-xl font-bold text-gray-800">AI Insights & Recommendations</h3>
      </div>

      {recommendations && (
        <div className="space-y-4">
          {/* Trend Analysis */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Waste Trend</h4>
                <p className="text-gray-600 capitalize">
                  {recommendations.trend === 'increasing' && '📈 '}
                  {recommendations.trend === 'decreasing' && '📉 '}
                  {recommendations.trend === 'stable' && '➡️ '}
                  {recommendations.trend}
                </p>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔮</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Next Period Prediction</h4>
                <p className="text-gray-600 text-sm">{recommendations.predictions}</p>
              </div>
            </div>
          </div>

          {/* Analysis */}
          {recommendations.analysis && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Analysis</h4>
                  <p className="text-gray-600 text-sm">{recommendations.analysis}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.recommendations && recommendations.recommendations.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-3">Action Items</h4>
                  <ul className="space-y-2">
                    {recommendations.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-green-600 font-bold">{idx + 1}.</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={fetchRecommendations}
            className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold transition-all"
          >
            🔄 Refresh Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
