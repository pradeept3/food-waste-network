import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getGlobalWasteTrend, getUSGlobalComparison, getWasteBySource, getWasteByStage, getTrendSummary, getEconomicImpact } from '../utils/historicalData';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4'];

export default function HistoricalTrends() {
  const [activeTab, setActiveTab] = useState('global');
  const [globalTrend, setGlobalTrend] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [wasteBySource, setWasteBySource] = useState([]);
  const [wasteByStage, setWasteByStage] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [global, comp, source, stage, econ, summ] = await Promise.all([
          getGlobalWasteTrend(),
          getUSGlobalComparison(),
          getWasteBySource(),
          getWasteByStage(),
          getEconomicImpact(),
          getTrendSummary()
        ]);

        setGlobalTrend(global);
        setComparison(comp);
        setWasteBySource(source);
        setWasteByStage(stage);
        setEconomicData(econ);
        setSummary(summ);
      } catch (error) {
        console.error('Error loading historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading historical data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Global Waste (2024)</div>
            <div className="text-2xl font-bold text-red-600">{summary.global_waste_mt}M</div>
            <div className="text-xs text-red-500">MT annually</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">US Waste (2024)</div>
            <div className="text-2xl font-bold text-orange-600">{summary.us_waste_mt}M</div>
            <div className="text-xs text-orange-500">MT annually</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">% of Food Supply</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.percent_of_supply}%</div>
            <div className="text-xs text-yellow-500">Currently wasted</div>
          </div>
          <div className={`bg-gradient-to-br p-4 rounded-lg ${summary.waste_change_percent > 0 ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100'}`}>
            <div className="text-sm text-gray-600">Trend (YoY)</div>
            <div className={`text-2xl font-bold ${summary.waste_change_percent > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {summary.waste_change_percent > 0 ? '+' : ''}{summary.waste_change_percent}%
            </div>
            <div className={`text-xs ${summary.waste_change_percent > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {summary.waste_change_percent > 0 ? 'increasing' : 'decreasing'}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'global' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          Global Trend
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'comparison' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          US vs Global
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'source' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          By Source
        </button>
        <button
          onClick={() => setActiveTab('stage')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'stage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          By Stage
        </button>
        <button
          onClick={() => setActiveTab('economic')}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === 'economic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          Economic Impact
        </button>
      </div>

      {/* Chart Content */}
      <div className="h-96">
        {/* Global Trend */}
        {activeTab === 'global' && globalTrend.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Global Food Waste Trend (2010-2024)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={globalTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Million Tons', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}M MT`} />
                <Legend />
                <Line type="monotone" dataKey="total_waste_million_tons" stroke="#ef4444" name="Global Waste" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* US vs Global */}
        {activeTab === 'comparison' && comparison.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">US vs Global Food Waste Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Million Tons', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}M MT`} />
                <Legend />
                <Line type="monotone" dataKey="global" stroke="#ef4444" name="Global" strokeWidth={2} />
                <Line type="monotone" dataKey="us" stroke="#f97316" name="USA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* By Source - Pie Chart */}
        {activeTab === 'source' && wasteBySource.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Food Waste by Source (US)</h3>
            <div className="grid grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={wasteBySource}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {wasteBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {wasteBySource.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.percentage}% ({item.amount}MT)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* By Stage - Bar Chart */}
        {activeTab === 'stage' && wasteByStage.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Food Waste by Lifecycle Stage</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={wasteByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Million Tons', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="million_tons" fill="#ef4444" name="Waste (MT)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Economic Impact */}
        {activeTab === 'economic' && economicData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Economic Impact of Food Waste</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={economicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Billion USD', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value}B`} />
                <Legend />
                <Line type="monotone" dataKey="us_value_billion" stroke="#f97316" name="US Value Lost" strokeWidth={2} />
                <Line type="monotone" dataKey="global_value_billion" stroke="#ef4444" name="Global Value Lost" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">Data Source</h4>
        <p className="text-sm text-blue-800">
          This historical data is compiled from UN FAO, USDA, World Resources Institute (WRI), and WRAP UK reports.
          Data spans from 2010 to 2024 and provides comprehensive insights into global and US food waste trends.
        </p>
      </div>
    </div>
  );
}
