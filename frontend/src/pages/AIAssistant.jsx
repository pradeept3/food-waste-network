import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(null);

  // Recipe states
  const [recipeFood, setRecipeFood] = useState('');
  const [recipeQuantity, setRecipeQuantity] = useState('');
  const [recipes, setRecipes] = useState(null);
  const [recipesLoading, setRecipesLoading] = useState(false);

  React.useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ai/status');
      setAiAvailable(response.data.gemini_available);
    } catch (err) {
      console.error('Error checking AI status:', err);
      setAiAvailable(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !aiAvailable) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/ai/chat',
        null,
        { params: { message: userMessage } }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecipes = async () => {
    if (!recipeFood.trim() || !recipeQuantity.trim() || !aiAvailable) return;

    setRecipesLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/ai/recipes',
        null,
        { params: { food_item: recipeFood, quantity: recipeQuantity } }
      );
      setRecipes(response.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setRecipes({ error: true, recipes: [], other_uses: [], summary: 'Failed to fetch recipes' });
    } finally {
      setRecipesLoading(false);
    }
  };

  if (aiAvailable === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-lg">Initializing AI Assistant...</p>
        </div>
      </div>
    );
  }

  if (!aiAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Gemini AI Not Configured</h2>
          <p className="text-gray-600 mb-4">
            To use the AI Assistant, you need to set up your Gemini API key.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm text-gray-700">
              <strong>Steps:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                <li>Get your API key</li>
                <li>Add to <code className="bg-white px-2">backend/.env</code></li>
                <li>Restart the backend</li>
              </ol>
            </p>
          </div>
          <button
            onClick={checkAIStatus}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            ✨ AI Assistant
          </h1>
          <p className="text-white/90 text-lg">Powered by Google Gemini</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'recipes'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            🍳 Recipe Suggestions
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-12">
                  <p className="text-5xl mb-3">✨</p>
                  <p className="text-lg font-semibold mb-2">Hi! I'm your AI Assistant</p>
                  <p className="text-sm">Ask me anything about food waste reduction, sustainability, or recipes!</p>
                  <div className="mt-4 space-y-2 text-left max-w-xs mx-auto">
                    <p className="text-xs text-gray-500">💡 Try asking:</p>
                    <p className="text-xs text-gray-600">• How can I reduce food waste?</p>
                    <p className="text-xs text-gray-600">• What's the best way to store fresh vegetables?</p>
                    <p className="text-xs text-gray-600">• How do I start composting?</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                    <p className="text-sm">✨ Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-300 bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🍳 Recipe & Usage Suggestions</h2>
              <p className="text-gray-600 mb-4">Get creative recipe ideas and alternative uses for your surplus food</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Item</label>
                  <input
                    type="text"
                    value={recipeFood}
                    onChange={(e) => setRecipeFood(e.target.value)}
                    placeholder="e.g., tomatoes, carrots, bread"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="text"
                    value={recipeQuantity}
                    onChange={(e) => setRecipeQuantity(e.target.value)}
                    placeholder="e.g., 50 kg, 100 lbs"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                onClick={handleGetRecipes}
                disabled={recipesLoading || !recipeFood.trim() || !recipeQuantity.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 font-semibold transition-all"
              >
                {recipesLoading ? '⏳ Finding recipes...' : '🔍 Find Recipes & Ideas'}
              </button>
            </div>

            {/* Recipes Results */}
            {recipes && (
              <div className="space-y-4 mt-6 border-t pt-6">
                {recipes.error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {recipes.summary}
                  </div>
                ) : (
                  <>
                    {recipes.summary && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-900 text-sm">{recipes.summary}</p>
                      </div>
                    )}

                    {recipes.recipes && recipes.recipes.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3">🍽️ Recipes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {recipes.recipes.map((recipe, idx) => (
                            <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <h4 className="font-semibold text-gray-800">{recipe.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                👥 {recipe.servings} servings
                              </p>
                              <p className="text-sm text-gray-600">
                                📊 {recipe.difficulty} difficulty
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {recipes.other_uses && recipes.other_uses.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Other Uses</h3>
                        <ul className="space-y-2">
                          {recipes.other_uses.map((use, idx) => (
                            <li key={idx} className="flex gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <span className="text-xl">✨</span>
                              <span className="text-gray-700">{use}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
