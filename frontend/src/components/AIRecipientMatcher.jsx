import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIRecipientMatcher = ({ foodData, onMatch, isOpen, onClose }) => {
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRecipients();
    }
  }, [isOpen]);

  const fetchRecipients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/recipients');
      setRecipients(response.data || []);
      // Pre-select all recipients by default
      if (response.data) {
        setSelectedRecipients(response.data.map(r => r.id));
      }
    } catch (err) {
      console.error('Error fetching recipients:', err);
      setError('Could not load recipients');
    }
  };

  const handleFindMatches = async () => {
    if (!selectedRecipients.length) {
      setError('Please select at least one recipient');
      return;
    }

    setLoading(true);
    setError('');
    setMatches(null);

    try {
      const response = await axios.post('http://localhost:8000/api/ai/match-recipients', {
        surplus_food: {
          item: foodData.item,
          quantity: foodData.quantity,
          unit: foodData.unit,
          category: foodData.category,
          description: foodData.description || ''
        },
        recipient_ids: selectedRecipients
      });

      setMatches(response.data);
    } catch (err) {
      console.error('Error finding matches:', err);
      setError(err.response?.data?.message || 'Failed to find matches. Ensure Gemini is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecipient = (id) => {
    setSelectedRecipients(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ✨ AI Recipient Matching
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            AI will help find the best recipients for: <strong>{foodData.item}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {!matches ? (
            <>
              {/* Recipient Selection */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Select Recipients to Consider:</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recipients.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recipients found. Add some first.</p>
                  ) : (
                    recipients.map(recipient => (
                      <label key={recipient.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(recipient.id)}
                          onChange={() => handleToggleRecipient(recipient.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="flex-1">
                          <span className="font-medium text-gray-800">{recipient.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({recipient.type})</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ℹ️ The AI will analyze food type, quantity, and recipient needs to find the best matches.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-900">{matches.summary}</p>
              </div>

              {/* Matches Results */}
              {matches.matches && matches.matches.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Best Matches:</h3>
                  {matches.matches.map((match, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {recipients.find(r => r.id === match.recipient_id)?.name || `Recipient ${match.recipient_id}`}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{match.reason}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full font-bold text-sm">
                            {match.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  No strong matches found. Consider reaching out to other recipients.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3">
          {!matches ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFindMatches}
                disabled={loading || selectedRecipients.length === 0}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 font-semibold transition-all"
              >
                {loading ? '⏳ Analyzing...' : '🔍 Find Best Matches'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMatches(null)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (matches.matches && matches.matches.length > 0) {
                    onMatch(matches.matches[0]);
                  }
                  onClose();
                }}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                ✓ Use Top Match
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecipientMatcher;
