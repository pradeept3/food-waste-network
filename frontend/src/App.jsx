import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { matchingAPI, predictionsAPI, foodAPI, transactionsAPI, metricsAPI, authAPI, donationsAPI } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './pages/AIAssistant';
import AIRecommendations from './components/AIRecommendations';
import AIRecipientMatcher from './components/AIRecipientMatcher';
import QuickFoodEntry from './components/QuickFoodEntry';
import CSVImport from './components/CSVImport';
import AdminDashboard from './components/AdminDashboard';
import DashboardHero from './components/DashboardHero';
import EmptyState from './components/EmptyState';
import TaxBenefitCalculator from './components/TaxBenefitCalculator';
import BudgetSavingsDashboard from './components/BudgetSavingsDashboard';
import ImpactStory from './components/ImpactStory';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ 
    name: 'Demo User', 
    email: 'demo@foodwaste.com',
    user_type: 'restaurant',
    is_admin: false,
    is_active: true
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    category: 'vegetables',
    description: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [predictionChartData, setPredictionChartData] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [transactionForm, setTransactionForm] = useState({
    recipientName: '',
    recipientId: '',
    quantity: ''
  });
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [recipientForm, setRecipientForm] = useState({
    name: '',
    type: 'ngo',
    address: '',
    phone: '',
    email: ''
  });
  const [customRecipients, setCustomRecipients] = useState([]);
  const [availableFood, setAvailableFood] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [showAIMatcher, setShowAIMatcher] = useState(false);
  const [selectedFoodForAI, setSelectedFoodForAI] = useState(null);
  const [impactMetrics, setImpactMetrics] = useState({
    foodSaved: 0,
    mealsProvided: 818,
    co2Saved: 736.5,
    moneySaved: 1950,
    connections: 12
  });
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUser({ 
        name: 'Demo User', 
        email: 'demo@foodwaste.com',
        user_type: 'restaurant',
        is_admin: false,
        is_active: true
      });
      setActiveTab('dashboard');
      setShowRegister(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Fetch data from backend on component mount
  useEffect(() => {
    if (!isLoggedIn) return; // Don't fetch if not logged in

    const fetchData = async () => {
      try {
        // Fetch available food items
        const foodData = await foodAPI.getAvailableFood();
        if (foodData && Array.isArray(foodData)) {
          setAvailableFood(foodData.map(item => ({
            ...item,
            quantity: item.quantity || 0,
            unit: item.unit || 'kg',
            provider: 'Provider',
            status: item.status || 'available',
            value: item.estimated_value || 0,
            expiry: '2 hours'
          })));
        }
      } catch (err) {
        console.log('No food items yet');
      }

      try {
        // Fetch transactions
        const transData = await transactionsAPI.getTransactions();
        if (transData && Array.isArray(transData)) {
          setTransactions(transData.map(trans => ({
            ...trans,
            quantity: trans.quantity ? `${trans.quantity} kg` : '0 kg',
            status: trans.status || 'pending'
          })));
        }
      } catch (err) {
        console.log('No transactions yet');
      }

      try {
        // Fetch predictions
        const predictionsData = await predictionsAPI.getSurplusPredictions();
        if (predictionsData && Array.isArray(predictionsData)) {
          // Convert API predictions to chart format
          const chartData = predictionsData.slice(0, 7).map((pred, index) => ({
            date: `Day ${index + 1}`,
            predicted: pred.confidence_score ? Math.round(pred.confidence_score * 100) / 100 : 0,
            actual: index === 0 ? Math.round(pred.confidence_score * 100) / 100 : null
          }));
          setPredictionChartData(chartData.length > 0 ? chartData : [
            { date: 'Today', actual: 12, predicted: 11.5 },
            { date: 'Tomorrow', predicted: 14.2 },
            { date: 'Day 3', predicted: 9.8 },
            { date: 'Day 4', predicted: 13.5 },
            { date: 'Day 5', predicted: 16.2 },
            { date: 'Day 6', predicted: 11.0 },
            { date: 'Day 7', predicted: 8.5 }
          ]);
        }
      } catch (err) {
        console.log('Using default predictions');
        // Use default data if API fails
        setPredictionChartData([
          { date: 'Today', actual: 12, predicted: 11.5 },
          { date: 'Tomorrow', predicted: 14.2 },
          { date: 'Day 3', predicted: 9.8 },
          { date: 'Day 4', predicted: 13.5 },
          { date: 'Day 5', predicted: 16.2 },
          { date: 'Day 6', predicted: 11.0 },
          { date: 'Day 7', predicted: 8.5 }
        ]);
      }

      try {
        // Fetch impact metrics
        const metricsData = await metricsAPI.getImpactMetrics();
        if (metricsData) {
          setImpactMetrics({
            foodSaved: metricsData.total_food_saved_kg || 0,
            mealsProvided: metricsData.total_meals_provided || 0,
            co2Saved: metricsData.co2_emissions_saved_kg || 0,
            moneySaved: metricsData.money_saved || 0,
            connections: metricsData.ngos_helped || 0
          });
        }
      } catch (err) {
        console.log('Could not fetch metrics');
      }

      try {
        // Fetch recipients
        const recipientsData = await matchingAPI.getAllRecipients();
        if (recipientsData && Array.isArray(recipientsData)) {
          setRecipients(recipientsData);
        }
      } catch (err) {
        console.log('Could not fetch recipients');
      }
    };

    fetchData();
  }, []);

  const handleAddFood = async () => {
    if (!formData.name.trim() || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newFood = {
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        description: formData.description,
        estimated_value: 0,
        expiry_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        latitude: 40.7128,
        longitude: -74.0060
      };

      await foodAPI.createItem(newFood);

      // Update available food list
      setAvailableFood([...availableFood, {
        id: availableFood.length + 1,
        ...formData,
        quantity: parseFloat(formData.quantity),
        expiry: '2 hours',
        distance: 0,
        provider: user.name,
        status: 'available',
        value: 0
      }]);

      // Update impact metrics
      setImpactMetrics({
        ...impactMetrics,
        foodSaved: impactMetrics.foodSaved + parseFloat(formData.quantity)
      });

      // Add notification
      setNotifications([{
        id: notifications.length + 1,
        type: 'food',
        message: `New surplus listed: ${formData.name} (${formData.quantity} ${formData.unit})`,
        time: 'just now',
        read: false
      }, ...notifications]);

      // Reset form and close modal
      setFormData({
        name: '',
        quantity: '',
        unit: 'kg',
        category: 'vegetables',
        description: ''
      });
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add food item. Please try again.');
      console.error('Error adding food:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonateFood = async () => {
    if (!transactionForm.recipientId || !transactionForm.quantity) {
      setError('Please select a recipient and enter quantity');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Call backend API to create donation
      const donationResponse = await donationsAPI.createDonation({
        food_item_id: selectedFood.id,
        recipient_id: parseInt(transactionForm.recipientId),
        quantity: parseFloat(transactionForm.quantity),
        recipient_name: transactionForm.recipientName
      });

      // Get recipient details for display
      const recipient = recipients.find(r => r.id === parseInt(transactionForm.recipientId));
      const recipientName = recipient?.name || transactionForm.recipientName;

      const newTransaction = {
        id: donationResponse.id || transactions.length + 1,
        date: new Date().toLocaleDateString(),
        item: selectedFood.name,
        quantity: `${transactionForm.quantity} ${selectedFood.unit}`,
        from: user.name,
        to: recipientName,
        status: 'pending',
        value: selectedFood.value
      };

      setTransactions([...transactions, newTransaction]);

      // Add notification
      setNotifications([{
        id: notifications.length + 1,
        type: 'donation',
        message: `${selectedFood.name} donated to ${recipientName}`,
        time: 'just now',
        read: false
      }, ...notifications]);

      // Remove from available food if fully donated
      const quantityDonated = parseFloat(transactionForm.quantity);
      const quantityAvailable = parseFloat(selectedFood.quantity);
      
      if (quantityDonated >= quantityAvailable) {
        setAvailableFood(availableFood.filter(food => food.id !== selectedFood.id));
      } else {
        setAvailableFood(availableFood.map(food => 
          food.id === selectedFood.id 
            ? {...food, quantity: quantityAvailable - quantityDonated}
            : food
        ));
      }

      // Reset form and close modal
      setTransactionForm({
        recipientName: '',
        recipientId: '',
        quantity: ''
      });
      setShowTransactionModal(false);
      setSelectedFood(null);
    } catch (err) {
      setError('Failed to create donation. Please try again.');
      console.error('Error creating donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = async () => {
    if (!recipientForm.name.trim()) {
      setError('Please enter recipient name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newRecipient = {
        id: Math.max(...customRecipients.map(r => r.id), 0) + 1,
        name: recipientForm.name,
        type: recipientForm.type,
        address: recipientForm.address,
        phone: recipientForm.phone,
        email: recipientForm.email,
        peopleServed: 0,
        rating: 0
      };

      setCustomRecipients([...customRecipients, newRecipient]);

      // Reset form and close modal
      setRecipientForm({
        name: '',
        type: 'ngo',
        address: '',
        phone: '',
        email: ''
      });
      
      // Add notification
      setNotifications([{
        id: notifications.length + 1,
        type: 'recipient',
        message: `New ${recipientForm.type} registered: ${recipientForm.name}`,
        time: 'just now',
        read: false
      }, ...notifications]);
      
      setShowAddRecipientModal(false);
    } catch (err) {
      setError('Failed to add recipient. Please try again.');
      console.error('Error adding recipient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindRecipients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchingAPI.getRecommendedRecipients();
      setRecipients(data);
      setShowRecipientsModal(true);
    } catch (err) {
      setError('Failed to fetch recipients. Please try again.');
      console.error('Error fetching recipients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictionsAPI.getSurplusPredictions();
      setPredictions(data);
      setShowPredictionsModal(true);
    } catch (err) {
      setError('Failed to fetch predictions. Please try again.');
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Quick Food Entry
  const handleQuickFoodEntry = async (foodData) => {
    try {
      const newFood = {
        name: foodData.name,
        quantity: parseFloat(foodData.quantity),
        unit: foodData.unit,
        category: foodData.category,
        description: foodData.description || '',
        estimated_value: 0,
        expiry_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        latitude: 40.7128,
        longitude: -74.0060
      };

      await foodAPI.createItem(newFood);

      setAvailableFood([...availableFood, {
        id: availableFood.length + 1,
        ...foodData,
        quantity: parseFloat(foodData.quantity),
        expiry: '2 hours',
        distance: 0,
        provider: user.name,
        status: 'available',
        value: 0
      }]);

      setImpactMetrics({
        ...impactMetrics,
        foodSaved: impactMetrics.foodSaved + parseFloat(foodData.quantity)
      });

      setNotifications([{
        id: notifications.length + 1,
        type: 'food',
        message: `Quick entry: ${foodData.name} (${foodData.quantity} ${foodData.unit})`,
        time: 'just now',
        read: false
      }, ...notifications]);

      setShowQuickEntry(false);
    } catch (err) {
      setError('Failed to add food item');
      console.error('Error:', err);
    }
  };

  // Handle CSV Import for Recipients
  const handleCSVImport = async (recipientsData) => {
    try {
      setLoading(true);
      
      for (const recipient of recipientsData) {
        await matchingAPI.addRecipient({
          name: recipient.name,
          type: recipient.type,
          address: recipient.address,
          phone: recipient.phone,
          email: recipient.email,
          people_served: parseInt(recipient.people_served) || 0
        });
      }

      const updated = await matchingAPI.getAllRecipients();
      setRecipients(updated);

      setNotifications([{
        id: notifications.length + 1,
        type: 'import',
        message: `Imported ${recipientsData.length} recipients successfully`,
        time: 'just now',
        read: false
      }, ...notifications]);

      setShowCSVImport(false);
    } catch (err) {
      setError(`Failed to import recipients: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic metrics based on available food and transactions
  const calculateMetrics = () => {
    const totalFoodSaved = availableFood.reduce((sum, food) => sum + parseFloat(food.quantity || 0), 0) + 
                          transactions.reduce((sum, trans) => sum + parseFloat(trans.quantity.split(' ')[0] || 0), 0);
    
    const totalTransactions = transactions.length;
    const mealsEstimate = Math.floor(totalFoodSaved * 3); // Rough estimate: 1kg serves 3 people
    const co2Saved = Math.round(totalFoodSaved * 3); // Rough estimate: 3kg CO2 per kg food
    const moneySaved = Math.round(totalFoodSaved * 8); // Rough estimate: $8 per kg food value
    
    return {
      foodSaved: totalFoodSaved.toFixed(1),
      mealsProvided: mealsEstimate,
      co2Saved: co2Saved,
      moneySaved: moneySaved,
      connections: customRecipients.length
    };
  };

  const calculatedMetrics = calculateMetrics();
  
  // Calculate waste by day dynamically from transactions
  const calculateWasteByDay = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap = {};
    
    // Initialize all days with 0
    days.forEach(day => {
      dayMap[day] = 0;
    });

    // Add available food quantities
    availableFood.forEach(food => {
      const today = new Date();
      const dayName = days[today.getDay()];
      dayMap[dayName] += parseFloat(food.quantity || 0);
    });

    // Add transaction quantities
    transactions.forEach(trans => {
      if (trans.date) {
        try {
          const transDate = new Date(trans.date);
          const dayName = days[transDate.getDay()];
          const quantity = parseFloat(trans.quantity.split(' ')[0] || 0);
          dayMap[dayName] += quantity;
        } catch (err) {
          // Ignore date parsing errors
        }
      }
    });

    return days.map(day => ({
      day,
      waste: parseFloat(dayMap[day].toFixed(1))
    }));
  };

  const wasteByDay = calculateWasteByDay();

  // Update displayed metrics
  useEffect(() => {
    setImpactMetrics(calculatedMetrics);
  }, [availableFood, transactions, customRecipients]);

  // Calculate waste by category dynamically
  const calculateWasteByCategory = () => {
    const categoryMap = {
      vegetables: { name: 'Vegetables', color: '#10b981' },
      dairy: { name: 'Dairy', color: '#3b82f6' },
      bakery: { name: 'Bakery', color: '#f59e0b' },
      prepared: { name: 'Prepared', color: '#ef4444' },
      other: { name: 'Other', color: '#8b5cf6' }
    };

    const categoryTotals = {};
    availableFood.forEach(food => {
      const category = food.category || 'other';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += parseFloat(food.quantity || 0);
    });

    return Object.entries(categoryTotals).map(([key, value]) => ({
      name: categoryMap[key]?.name || key,
      value: parseFloat(value.toFixed(1)),
      color: categoryMap[key]?.color || '#8b5cf6'
    }));
  };

  const wasteByCategory = calculateWasteByCategory().length > 0 
    ? calculateWasteByCategory()
    : [
        { name: 'Vegetables', value: 0, color: '#10b981' },
        { name: 'Dairy', value: 0, color: '#3b82f6' },
        { name: 'Bakery', value: 0, color: '#f59e0b' },
        { name: 'Prepared', value: 0, color: '#ef4444' }
      ];

  // Remove hardcoded predictionData - now using predictionChartData from API
  
  const MetricCard = ({ title, value, unit, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-gray-500 text-sm mt-1">{unit}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  const FoodItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{item.name}</h3>
          <p className="text-gray-600 text-sm">{item.provider}</p>
        </div>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
          {item.expiry}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-semibold">{item.quantity} {item.unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Distance:</span>
          <span className="font-semibold">{item.distance} km</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Value:</span>
          <span className="font-semibold text-green-600">${item.value}</span>
        </div>
      </div>
      <button 
        onClick={() => alert(`Reserved ${item.name}!`)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors"
      >
        Reserve Now
      </button>
    </div>
  );

  // If not logged in, show login or register page
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={() => {
            setShowRegister(false);
          }}
        />
      );
    }

    return (
      <Login 
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoggedIn(true);
          setActiveTab('dashboard');
        }}
        onSwitchToRegister={() => {
          setShowRegister(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">�️ TableShare</h1>
              <p className="text-sm opacity-90">Share Surplus. Save Resources. Help Communities.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-2 hover:bg-white/10 rounded-lg"
              >
                <span className="text-2xl">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                >
                  <div className="text-right">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs opacity-90">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">👤</div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">👤 Profile</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">⚙️ Settings</button>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.dispatchEvent(new CustomEvent('auth:logout'));
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {['dashboard', 'benefits', 'available', 'recipients', 'predictions', 'analytics', 'transactions', 'users', ...(user.is_admin ? ['admin'] : []), 'ai'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 capitalize font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab === 'users' ? '👥 Users' : tab === 'admin' ? '⚙️ Admin Panel' : tab === 'ai' ? '✨ AI Assistant' : tab === 'benefits' ? '🎁 Benefits' : tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-5">
        {activeTab === 'dashboard' && (
          <div>
            {/* Hero Section */}
            <DashboardHero 
              foodSaved={impactMetrics.foodSaved} 
              mealsProvided={impactMetrics.mealsProvided}
              co2Saved={impactMetrics.co2Saved}
              moneySaved={impactMetrics.moneySaved}
            />

            {/* Benefits Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {user.user_type && ['restaurant', 'store', 'farm'].includes(user.user_type) && (
                <>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-5 border-l-4 border-green-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">💵</p>
                    <p className="font-bold text-gray-800">Tax Savings</p>
                    <p className="text-sm text-gray-600 mt-1">Save thousands annually</p>
                    <button onClick={() => setActiveTab('benefits')} className="text-green-600 text-sm font-medium hover:underline mt-2">
                      Learn more →
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow p-5 border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">🌍</p>
                    <p className="font-bold text-gray-800">Community Impact</p>
                    <p className="text-sm text-gray-600 mt-1">{impactMetrics.mealsProvided || 0} meals provided</p>
                    <button onClick={() => setActiveTab('benefits')} className="text-blue-600 text-sm font-medium hover:underline mt-2">
                      View stories →
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-5 border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">📊</p>
                    <p className="font-bold text-gray-800">AI Predictions</p>
                    <p className="text-sm text-gray-600 mt-1">Predict surplus before it happens</p>
                    <button onClick={() => setActiveTab('predictions')} className="text-purple-600 text-sm font-medium hover:underline mt-2">
                      View predictions →
                    </button>
                  </div>
                </>
              )}
              {user.user_type && ['ngo', 'shelter', 'charity', 'school'].includes(user.user_type) && (
                <>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-5 border-l-4 border-green-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">💰</p>
                    <p className="font-bold text-gray-800">Budget Saved</p>
                    <p className="text-sm text-gray-600 mt-1">Increase food programs without cost</p>
                    <button onClick={() => setActiveTab('benefits')} className="text-green-600 text-sm font-medium hover:underline mt-2">
                      See savings →
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow p-5 border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">🤖</p>
                    <p className="font-bold text-gray-800">AI Matching</p>
                    <p className="text-sm text-gray-600 mt-1">Get food matched to your needs</p>
                    <button onClick={() => setActiveTab('available')} className="text-blue-600 text-sm font-medium hover:underline mt-2">
                      Find food →
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-5 border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
                    <p className="text-2xl mb-2">📈</p>
                    <p className="font-bold text-gray-800">Planning Analytics</p>
                    <p className="text-sm text-gray-600 mt-1">Data-driven decisions for growth</p>
                    <button onClick={() => setActiveTab('analytics')} className="text-purple-600 text-sm font-medium hover:underline mt-2">
                      View analytics →
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Waste by Day</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={wasteByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="waste" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Waste by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={wasteByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {wasteByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Add Surplus Food
                </button>
                <button 
                  onClick={() => setShowQuickEntry(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  🚀 Quick Entry
                </button>
                <button 
                  onClick={handleFindRecipients}
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Find Recipients
                </button>
                <button 
                  onClick={() => setShowCSVImport(true)}
                  className="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
                >
                  📊 Bulk Import
                </button>
                <button 
                  onClick={handleViewPredictions}
                  disabled={loading}
                  className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  View Predictions
                </button>
              </div>
              {user.is_admin && (
                <div className="mt-4 border-t pt-4">
                  <button 
                    onClick={() => setShowAdminDashboard(true)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 font-semibold"
                  >
                    👨‍💼 Admin Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <AIRecommendations />
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Food Nearby</h2>
              <div className="flex gap-3">
                <select className="border rounded-lg px-4 py-2">
                  <option>All Categories</option>
                  <option>Vegetables</option>
                  <option>Dairy</option>
                </select>
                <select className="border rounded-lg px-4 py-2">
                  <option>Within 5 km</option>
                  <option>Within 10 km</option>
                </select>
              </div>
            </div>
            {availableFood.length === 0 ? (
              <EmptyState 
                imageSrc="/images/empty-states/no-food.svg"
                title="No Food Items Available"
                description="There are currently no food items available. Be the first to share surplus food with our community!"
                cta="Add Surplus Food"
                onCta={() => setShowAddModal(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableFood.map(item => (
                  <FoodItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recipients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recipients & Organizations</h2>
              <button 
                onClick={() => setShowAddRecipientModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Recipient
              </button>
            </div>

            {customRecipients.length === 0 ? (
              <EmptyState 
                imageSrc="/images/empty-states/no-recipients.svg"
                title="No Recipients Added"
                description="Start connecting with NGOs, shelters, and charities to distribute food. Add your first recipient to get started!"
                cta="Add Recipient"
                onCta={() => setShowAddRecipientModal(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customRecipients.map((recipient) => (
                  <div key={recipient.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{recipient.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{recipient.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recipient.type === 'ngo' ? 'bg-blue-100 text-blue-800' :
                        recipient.type === 'shelter' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {recipient.type}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      {recipient.address && (
                        <div className="flex items-start gap-2">
                          <span>📍</span>
                          <span>{recipient.address}</span>
                        </div>
                      )}
                      {recipient.phone && (
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span>{recipient.phone}</span>
                        </div>
                      )}
                      {recipient.email && (
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span>{recipient.email}</span>
                        </div>
                      )}
                      {recipient.peopleServed > 0 && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>👥</span>
                          <span>{recipient.peopleServed} people served</span>
                        </div>
                      )}
                      {recipient.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <span>⭐</span>
                          <span>{recipient.rating.toFixed(1)} rating</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedFood(null);
                        setTransactionForm({
                          recipientName: recipient.name,
                          quantity: ''
                        });
                        setShowTransactionModal(true);
                      }}
                      className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Donate to This Organization
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">AI Surplus Predictions</h2>
                <button 
                  onClick={handleViewPredictions}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                >
                  View Details
                </button>
              </div>
              {predictionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No prediction data available yet</p>
                  <p className="text-sm mt-2">Add food items to see AI predictions</p>
                </div>
              )}
            </div>

            {/* Prediction Details */}
            {predictions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Prediction Details</h3>
                <div className="space-y-3">
                  {predictions.map((pred, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{pred.food_type || `Prediction ${index + 1}`}</h4>
                          <p className="text-gray-600 text-sm">Predicted Date: {pred.predicted_date?.split('T')[0] || 'N/A'}</p>
                          {pred.reasoning && <p className="text-sm text-gray-700 mt-2">{pred.reasoning}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {pred.confidence_score ? (pred.confidence_score * 100).toFixed(1) : 'N/A'}%
                          </p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Waste Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Current Available Surplus</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {availableFood.reduce((sum, food) => sum + parseFloat(food.quantity || 0), 0).toFixed(1)} kg
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Total Donated</p>
                  <p className="text-4xl font-bold text-green-600">
                    {transactions.reduce((sum, trans) => sum + parseFloat(trans.quantity?.split(' ')[0] || 0), 0).toFixed(1)} kg
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Food Items Listed</p>
                  <p className="text-4xl font-bold text-orange-600">{availableFood.length}</p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Breakdown by Category</h3>
              <div className="space-y-3">
                {wasteByCategory.length > 0 ? (
                  wasteByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{backgroundColor: category.color}}
                        ></div>
                        <span className="font-medium text-gray-700">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{
                              width: `${wasteByCategory.length > 0 ? (category.value / Math.max(...wasteByCategory.map(c => c.value), 1) * 100) : 0}%`,
                              backgroundColor: category.color
                            }}
                          ></div>
                        </div>
                        <p className="font-bold text-gray-800 w-16 text-right">{category.value} kg</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No food items yet. Add food to see category breakdown.</p>
                )}
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Transaction Summary</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">To</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{transaction.date}</td>
                          <td className="px-4 py-2 font-medium">{transaction.item}</td>
                          <td className="px-4 py-2">{transaction.quantity}</td>
                          <td className="px-4 py-2 text-sm">{transaction.to}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded font-medium ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <button 
                onClick={() => {
                  if (availableFood.length === 0) {
                    setError('No food items available to donate');
                    return;
                  }
                  setShowTransactionModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                + New Donation
              </button>
            </div>
            
            {transactions.length === 0 ? (
              <EmptyState 
                imageSrc="/images/empty-states/no-transactions.svg"
                title="No Transactions Yet"
                description="Start donating food items to help communities in need. Every donation makes a difference!"
                cta="Create a Donation"
                onCta={() => setShowTransactionModal(true)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{transaction.date}</td>
                        <td className="px-6 py-4 font-medium">{transaction.item}</td>
                        <td className="px-6 py-4">{transaction.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{transaction.from}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{transaction.to}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Total Users</p>
                <p className="text-4xl font-bold text-blue-600">{registeredUsers.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Food Providers</p>
                <p className="text-4xl font-bold text-green-600">
                  {registeredUsers.filter(u => ['restaurant', 'store', 'farm'].includes(u.user_type)).length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Recipients (NGO/Shelter)</p>
                <p className="text-4xl font-bold text-purple-600">
                  {registeredUsers.filter(u => ['ngo', 'shelter'].includes(u.user_type)).length}
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registered Users</h2>
                <button 
                  onClick={async () => {
                    try {
                      const data = await authAPI.getAllUsers();
                      setRegisteredUsers(data.users || []);
                    } catch (err) {
                      console.error('Error fetching users:', err);
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  🔄 Refresh Users
                </button>
              </div>

              {registeredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No users registered yet. Click "Refresh Users" to load from database.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                        <th className="px-4 py-2 text-left">Address</th>
                        <th className="px-4 py-2 text-left">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {registeredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">{user.id}</td>
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              ['restaurant', 'store', 'farm'].includes(user.user_type) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-4 py-2">{user.phone || '-'}</td>
                          <td className="px-4 py-2 text-xs">{user.address || '-'}</td>
                          <td className="px-4 py-2 text-xs">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* User Type Breakdown */}
            {registeredUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Users by Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { type: 'restaurant', label: 'Restaurants', icon: '🍽️', color: 'text-orange-600' },
                    { type: 'store', label: 'Stores', icon: '🏪', color: 'text-blue-600' },
                    { type: 'farm', label: 'Farms', icon: '🌾', color: 'text-green-600' },
                    { type: 'ngo', label: 'NGOs', icon: '🤝', color: 'text-purple-600' },
                    { type: 'shelter', label: 'Shelters', icon: '🏠', color: 'text-red-600' },
                    { type: 'buyer', label: 'Buyers', icon: '🛒', color: 'text-yellow-600' }
                  ].map(typeInfo => {
                    const count = registeredUsers.filter(u => u.user_type === typeInfo.type).length;
                    return (
                      <div key={typeInfo.type} className="border rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                        <p className="text-2xl mb-2">{typeInfo.icon}</p>
                        <p className="font-bold text-gray-800">{typeInfo.label}</p>
                        <p className={`text-2xl font-bold ${typeInfo.color}`}>{count}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && user.is_admin && (
          <AdminPanel token={localStorage.getItem('token')} currentUser={user} />
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-3">🎁 Your TableShare Benefits</h2>
              <p className="text-lg opacity-90">
                {user.user_type && ['restaurant', 'store', 'farm'].includes(user.user_type) 
                  ? "Discover how your donations create impact while saving costs and earning tax benefits."
                  : "Learn how TableShare helps you access reliable food while saving your budget."}
              </p>
            </div>

            {/* Personalization & Progress Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Your Achievement Level</p>
                  <p className="text-2xl font-bold text-gray-800 mb-3">
                    {user.donations_total > 500 ? '🏆 Sustainability Champion' : 
                     user.donations_total > 100 ? '⭐ Community Partner' : 
                     '🌱 Getting Started'}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-500"
                      style={{width: `${Math.min(100, ((user.donations_total || 0) / 500) * 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {user.donations_total || 0}kg towards next milestone
                  </p>
                </div>
                <div className="ml-6 text-6xl">
                  {user.donations_total > 500 ? '🏆' : 
                   user.donations_total > 100 ? '⭐' : 
                   '🌱'}
                </div>
              </div>
            </div>

            {/* Provider Benefits */}
            {user.user_type && ['restaurant', 'store', 'farm'].includes(user.user_type) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Financial Benefits</h3>
                  <TaxBenefitCalculator transactions={transactions} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">✨ Community Impact</h3>
                  <ImpactStory transactions={transactions} userType="provider" />
                </div>

                <div className="bg-blue-50 rounded-lg shadow p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">📊 Additional Provider Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                      <p className="font-bold text-gray-800 mb-1">🎯 Waste Disposal Savings</p>
                      <p className="text-sm text-gray-600">Avoid paying ${(transactions.reduce((sum, t) => {
                        const qty = parseFloat(t.quantity?.toString().split(' ')[0] || '0');
                        return sum + (isNaN(qty) ? 0 : qty);
                      }, 0) * 0.15).toFixed(2)}/month in disposal costs</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
                      <p className="font-bold text-gray-800 mb-1">🏆 Brand Reputation</p>
                      <p className="text-sm text-gray-600">Featured as a community partner. Build trust with customers.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
                      <p className="font-bold text-gray-800 mb-1">🤖 AI Predictions</p>
                      <p className="text-sm text-gray-600">Know exactly when surplus occurs to minimize waste.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-600">
                      <p className="font-bold text-gray-800 mb-1">⚡ One-Click Donations</p>
                      <p className="text-sm text-gray-600">Simple, fast process saves time and staff effort.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recipient Benefits */}
            {user.user_type && ['ngo', 'shelter', 'charity', 'school'].includes(user.user_type) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">💵 Budget Savings</h3>
                  <BudgetSavingsDashboard transactions={transactions} beneficiaries={280} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">✨ Community Success Stories</h3>
                  <ImpactStory transactions={transactions} userType="recipient" />
                </div>

                <div className="bg-green-50 rounded-lg shadow p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">📊 Additional Recipient Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
                      <p className="font-bold text-gray-800 mb-1">🎯 Reliable Supply</p>
                      <p className="text-sm text-gray-600">AI matching connects you with consistent, reliable donors.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                      <p className="font-bold text-gray-800 mb-1">📊 Analytics Dashboard</p>
                      <p className="text-sm text-gray-600">Plan your programs with detailed data and forecasts.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
                      <p className="font-bold text-gray-800 mb-1">🔔 Smart Notifications</p>
                      <p className="text-sm text-gray-600">Get alerted when food matching your needs is available.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-600">
                      <p className="font-bold text-gray-800 mb-1">🤝 Community Network</p>
                      <p className="text-sm text-gray-600">Connect with local businesses, NGOs, and donors.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General User */}
            {!user.user_type || (!['restaurant', 'store', 'farm'].includes(user.user_type) && !['ngo', 'shelter', 'charity', 'school'].includes(user.user_type)) && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-lg p-8 border-l-4 border-orange-600">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🌍 Welcome to TableShare!</h3>
                <p className="text-gray-700 mb-6">
                  Complete your profile to unlock personalized benefits and start making a real impact in your community.
                </p>
                <button className="bg-orange-600 text-white py-3 px-8 rounded-lg hover:bg-orange-700 font-bold text-lg">
                  Update Your Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <AIAssistant />
        )}
      </main>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Add Surplus Food</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Food Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" 
              />
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Category</option>
                <optgroup label="Fruits & Vegetables">
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="salads">Salads & Greens</option>
                  <option value="root_vegetables">Root Vegetables</option>
                </optgroup>
                <optgroup label="Dairy & Eggs">
                  <option value="dairy">Dairy</option>
                  <option value="eggs">Eggs</option>
                  <option value="cheese">Cheese</option>
                  <option value="yogurt">Yogurt & Cultured</option>
                </optgroup>
                <optgroup label="Bakery & Grains">
                  <option value="bakery">Bakery & Bread</option>
                  <option value="grains">Grains & Cereals</option>
                  <option value="pasta">Pasta & Rice</option>
                  <option value="pastries">Pastries & Desserts</option>
                </optgroup>
                <optgroup label="Meat & Seafood">
                  <option value="meat">Meat & Poultry</option>
                  <option value="seafood">Seafood & Fish</option>
                  <option value="processed_meat">Processed Meat</option>
                </optgroup>
                <optgroup label="Prepared Food">
                  <option value="prepared">Prepared Meals</option>
                  <option value="cooked_dishes">Cooked Dishes</option>
                  <option value="ready_to_eat">Ready-to-Eat</option>
                  <option value="beverages">Beverages</option>
                </optgroup>
                <optgroup label="Pantry Items">
                  <option value="canned_goods">Canned Goods</option>
                  <option value="packaged_goods">Packaged Goods</option>
                  <option value="condiments">Condiments & Sauces</option>
                  <option value="nuts_seeds">Nuts & Seeds</option>
                  <option value="oils_spices">Oils & Spices</option>
                </optgroup>
                <optgroup label="Frozen">
                  <option value="frozen_vegetables">Frozen Vegetables</option>
                  <option value="frozen_meals">Frozen Meals</option>
                  <option value="frozen_fruits">Frozen Fruits</option>
                  <option value="frozen_other">Frozen - Other</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="other">Other</option>
                  <option value="bulk">Bulk Items</option>
                  <option value="mixed">Mixed Items</option>
                </optgroup>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Quantity" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" 
                />
                <select 
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <optgroup label="Weight">
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="lbs">lbs</option>
                  </optgroup>
                  <optgroup label="Volume">
                    <option value="liters">liters</option>
                    <option value="milliliters">ml</option>
                    <option value="gallons">gallons</option>
                  </optgroup>
                  <optgroup label="Count">
                    <option value="items">items</option>
                    <option value="loaves">loaves</option>
                    <option value="boxes">boxes</option>
                    <option value="cans">cans</option>
                    <option value="bottles">bottles</option>
                    <option value="bunches">bunches</option>
                    <option value="dozens">dozens</option>
                  </optgroup>
                  <optgroup label="Servings">
                    <option value="meals">meals</option>
                    <option value="portions">portions</option>
                    <option value="servings">servings</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="trays">trays</option>
                    <option value="packages">packages</option>
                    <option value="containers">containers</option>
                    <option value="buckets">buckets</option>
                  </optgroup>
                </select>
              </div>
              <textarea 
                placeholder="Description (optional)" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddFood}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipients Modal */}
      {showRecipientsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold">AI-Matched Recipients</h2>
                <p className="text-gray-600 text-sm mt-1">Recipients ranked by AI matching based on available food</p>
              </div>
              <button onClick={() => setShowRecipientsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}
            {recipients.length > 0 ? (
              <div className="space-y-4">
                {recipients.map((recipient, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{recipient.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            recipient.type === 'shelter' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {recipient.type?.toUpperCase() || 'ORGANIZATION'}
                          </span>
                          {recipient.urgency && (
                            <span className={`px-2 py-1 text-xs rounded font-medium ${
                              recipient.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recipient.urgency.toUpperCase()} NEED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>📍 {recipient.address}</span>
                          <span>📏 {recipient.distance?.toFixed(1)} km away</span>
                        </div>
                      </div>
                      {recipient.match_score && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">{Math.round(recipient.match_score)}%</div>
                          <p className="text-xs text-gray-600">Match Score</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">People Served</p>
                          <p className="text-lg font-semibold text-gray-900">{recipient.people_served}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Rating</p>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-semibold text-yellow-600">{recipient.rating}</span>
                            <span className="text-yellow-400">★</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recent Donations</p>
                          <p className="text-lg font-semibold text-gray-900">{recipient.recent_donations}</p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Capacity Status</p>
                          <p className="text-sm text-gray-900">{recipient.capacity_status}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Hours</p>
                          <p className="text-sm text-gray-900">{recipient.operational_hours}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Languages</p>
                          <p className="text-sm text-gray-900">{recipient.languages?.join(', ') || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specializations */}
                    {(recipient.specializations || recipient.matched_specializations) && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {recipient.matched_specializations?.length > 0 ? '✓ Matched Specializations' : 'Specializations'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(recipient.matched_specializations?.length > 0 ? recipient.matched_specializations : recipient.specializations || []).map((spec, idx) => (
                            <span key={idx} className={`px-2 py-1 text-xs rounded ${
                              recipient.matched_specializations?.includes(spec) 
                                ? 'bg-green-100 text-green-800 font-medium' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="flex gap-3 pt-3 border-t border-gray-200">
                      {recipient.phone && (
                        <a href={`tel:${recipient.phone}`} className="text-sm text-blue-600 hover:underline">
                          📞 {recipient.phone}
                        </a>
                      )}
                      {recipient.email && (
                        <a href={`mailto:${recipient.email}`} className="text-sm text-blue-600 hover:underline">
                          ✉️ {recipient.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recipients found yet. Add some surplus food to see AI-matched recipients!</p>
              </div>
            )}
            <button onClick={() => setShowRecipientsModal(false)} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Predictions Modal */}
      {showPredictionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Surplus Predictions</h2>
              <button onClick={() => setShowPredictionsModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {predictions.length > 0 ? (
              <div className="space-y-3">
                {predictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{prediction.food_type || `Prediction ${index + 1}`}</h3>
                        <p className="text-gray-600">{prediction.category || 'General'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{prediction.predicted_quantity || prediction.quantity || 0}</p>
                        <p className="text-sm text-gray-500">{prediction.unit || 'kg'}</p>
                      </div>
                    </div>
                    {prediction.confidence && <p className="text-sm text-gray-500 mt-2">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No predictions available.</p>
            )}
            <button onClick={() => setShowPredictionsModal(false)} className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Donation</h2>
              <button onClick={() => setShowTransactionModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Food Item</label>
                <select 
                  value={selectedFood?.id || ''}
                  onChange={(e) => {
                    const food = availableFood.find(f => f.id === parseInt(e.target.value));
                    setSelectedFood(food);
                    setTransactionForm({...transactionForm, quantity: ''});
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Choose an item --</option>
                  {availableFood.map(food => (
                    <option key={food.id} value={food.id}>
                      {food.name} ({food.quantity} {food.unit})
                    </option>
                  ))}
                </select>
              </div>

              {selectedFood && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity to Donate</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Quantity"
                        value={transactionForm.quantity}
                        onChange={(e) => setTransactionForm({...transactionForm, quantity: e.target.value})}
                        max={selectedFood.quantity}
                        className="flex-1 border rounded-lg px-3 py-2"
                      />
                      <span className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">{selectedFood.unit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Available: {selectedFood.quantity} {selectedFood.unit}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Name/Organization</label>
                    <select 
                      value={transactionForm.recipientId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedRecipient = recipients.find(r => r.id === parseInt(selectedId));
                        setTransactionForm({
                          ...transactionForm, 
                          recipientId: selectedId,
                          recipientName: selectedRecipient?.name || ''
                        });
                      }}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">-- Select a recipient --</option>
                      {recipients.map(recipient => (
                        <option key={recipient.id} value={recipient.id}>
                          {recipient.name} ({recipient.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowTransactionModal(false)} 
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDonateFood}
                  disabled={loading || !selectedFood}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Donate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipient Modal */}
      {showAddRecipientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Recipient</h2>
              <button onClick={() => setShowAddRecipientModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Hope Shelter"
                  value={recipientForm.name}
                  onChange={(e) => setRecipientForm({...recipientForm, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  value={recipientForm.type}
                  onChange={(e) => setRecipientForm({...recipientForm, type: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="ngo">NGO</option>
                  <option value="shelter">Shelter</option>
                  <option value="charity">Charity</option>
                  <option value="school">School</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input 
                  type="text" 
                  placeholder="Street address"
                  value={recipientForm.address}
                  onChange={(e) => setRecipientForm({...recipientForm, address: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input 
                  type="tel" 
                  placeholder="Phone number"
                  value={recipientForm.phone}
                  onChange={(e) => setRecipientForm({...recipientForm, phone: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={recipientForm.email}
                  onChange={(e) => setRecipientForm({...recipientForm, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddRecipientModal(false)} 
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddRecipient}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recipient Matcher */}
      <AIRecipientMatcher 
        foodData={selectedFoodForAI || {}}
        onMatch={(match) => console.log('Matched recipient:', match)}
        isOpen={showAIMatcher}
        onClose={() => setShowAIMatcher(false)}
      />

      {/* Quick Food Entry Modal */}
      {showQuickEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
            <QuickFoodEntry 
              onSubmit={handleQuickFoodEntry}
              onClose={() => setShowQuickEntry(false)}
            />
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
            <CSVImport 
              onImport={handleCSVImport}
              onClose={() => setShowCSVImport(false)}
            />
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {showAdminDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <button 
                onClick={() => setShowAdminDashboard(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AdminDashboard 
                recipients={recipients}
                transactions={transactions}
                availableFood={availableFood}
                metrics={impactMetrics}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <button onClick={() => setShowNotificationsModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border-l-4 transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => {
                setNotifications(notifications.map(n => ({...n, read: true})));
                setShowNotificationsModal(false);
              }}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;