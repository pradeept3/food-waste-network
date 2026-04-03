import React, { useState } from 'react';
import { QuickTemplate, FormProgress } from './FormHelpers';

// Quick Food Entry with Templates
export const QuickFoodEntry = ({ onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [useTemplate, setUseTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    description: ''
  });

  // Pre-filled templates for common foods
  const FOOD_TEMPLATES = {
    vegetables: {
      name: 'Mixed Vegetables',
      category: 'vegetables',
      unit: 'kg',
      description: 'Fresh vegetables - various types'
    },
    bread: {
      name: 'Bread/Bakery Items',
      category: 'bakery',
      unit: 'loaves',
      description: 'Surplus bread or bakery products'
    },
    dairy: {
      name: 'Dairy Products',
      category: 'dairy',
      unit: 'items',
      description: 'Milk, cheese, yogurt, other dairy'
    },
    prepared: {
      name: 'Prepared Meals',
      category: 'prepared',
      unit: 'meals',
      description: 'Cooked meals or ready-to-eat food'
    },
    canned: {
      name: 'Canned Goods',
      category: 'canned_goods',
      unit: 'cans',
      description: 'Various canned products'
    },
    fruits: {
      name: 'Fresh Fruits',
      category: 'fruits',
      unit: 'kg',
      description: 'Fresh fruits - various types'
    }
  };

  const handleTemplateSelect = (templateKey) => {
    const template = FOOD_TEMPLATES[templateKey];
    setFormData({
      ...template,
      quantity: ''
    });
    setUseTemplate(templateKey);
    setStep(2);
  };

  const handleCustomEntry = () => {
    setUseTemplate(null);
    setStep(2);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">Quick Food Entry 🚀</h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <FormProgress 
            currentStep={step} 
            totalSteps={2} 
            stepNames={['Choose Entry Method', 'Enter Quantity']}
          />

          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium mb-6">Select a quick template or enter custom food:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <QuickTemplate 
                  icon="🥬"
                  name="Vegetables"
                  description="Quickly add mixed vegetables"
                  onClick={() => handleTemplateSelect('vegetables')}
                />
                <QuickTemplate 
                  icon="🍞"
                  name="Bread & Bakery"
                  description="Bakery items and bread surplus"
                  onClick={() => handleTemplateSelect('bread')}
                />
                <QuickTemplate 
                  icon="🥛"
                  name="Dairy Products"
                  description="Milk, cheese, yogurt, etc."
                  onClick={() => handleTemplateSelect('dairy')}
                />
                <QuickTemplate 
                  icon="🍲"
                  name="Prepared Meals"
                  description="Cooked meals and ready-to-eat"
                  onClick={() => handleTemplateSelect('prepared')}
                />
                <QuickTemplate 
                  icon="🥫"
                  name="Canned Goods"
                  description="Canned and packaged items"
                  onClick={() => handleTemplateSelect('canned')}
                />
                <QuickTemplate 
                  icon="🍎"
                  name="Fresh Fruits"
                  description="Fruits and citrus items"
                  onClick={() => handleTemplateSelect('fruits')}
                />
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">OR</span>
                </div>
              </div>

              <button
                onClick={handleCustomEntry}
                className="w-full p-4 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all text-center"
              >
                <div className="text-2xl mb-2">✏️</div>
                <div className="font-medium text-gray-800">Custom Entry</div>
                <div className="text-xs text-gray-500 mt-1">Enter any food item with custom details</div>
              </button>
            </div>
          )}

          {/* Step 2: Enter Quantity */}
          {step === 2 && (
            <div className="space-y-4">
              {useTemplate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Selected Template:</span> {formData.name}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Food Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Mixed Vegetables"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">How much do you have?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="lbs">lbs</option>
                    <option value="liters">liters</option>
                    <option value="items">items</option>
                    <option value="loaves">loaves</option>
                    <option value="cans">cans</option>
                    <option value="boxes">boxes</option>
                    <option value="meals">meals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Details (Optional)</label>
                <textarea
                  placeholder="e.g., Mixed fresh vegetables, some wilting but still good..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Quick Quantity Suggestions */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Quick Suggestions:</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 25, 50].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setFormData({...formData, quantity: qty})}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-blue-100 hover:border-blue-400 text-sm transition"
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-4 border-t">
            <button
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setUseTemplate(null);
                } else {
                  onCancel();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {step === 2 ? 'Back' : 'Cancel'}
            </button>
            
            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.quantity}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Add Food Item ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFoodEntry;
