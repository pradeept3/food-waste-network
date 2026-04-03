import React, { useState } from 'react';

// Reusable Form Input with validation
export const FormInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  helper, 
  required = false,
  suggestions = [],
  onSuggestionSelect
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`w-full border rounded-lg px-3 py-2 transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        
        {/* Auto-suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-md">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSuggestionSelect?.(suggestion);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-b-0"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && <p className="text-red-600 text-xs mt-1">❌ {error}</p>}
      {helper && !error && <p className="text-gray-500 text-xs mt-1">ℹ️ {helper}</p>}
    </div>
  );
};

// Reusable Form Select
export const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  groups, 
  error, 
  helper, 
  required = false 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <option value="">-- Select {label} --</option>
        
        {/* Without optgroups */}
        {options && options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        
        {/* With optgroups */}
        {groups && Object.entries(groups).map(([groupName, groupOpts]) => (
          <optgroup key={groupName} label={groupName}>
            {groupOpts.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
      
      {error && <p className="text-red-600 text-xs mt-1">❌ {error}</p>}
      {helper && !error && <p className="text-gray-500 text-xs mt-1">ℹ️ {helper}</p>}
    </div>
  );
};

// Form Textarea
export const FormTextarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  helper, 
  rows = 4 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full border rounded-lg px-3 py-2 transition-colors resize-none ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      
      {error && <p className="text-red-600 text-xs mt-1">❌ {error}</p>}
      {helper && !error && <p className="text-gray-500 text-xs mt-1">ℹ️ {helper}</p>}
    </div>
  );
};

// Form Validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : 'Invalid email format';
};

export const validateRequired = (value, fieldName) => {
  return !value || value.trim() === '' ? `${fieldName} is required` : null;
};

export const validateNumber = (value, fieldName, min = 0) => {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  return null;
};

// Form Progress Indicator
export const FormProgress = ({ currentStep, totalSteps, stepNames }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-gray-600">{stepNames[currentStep - 1]}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Quick Template Button
export const QuickTemplate = ({ name, icon, description, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-medium text-gray-800">{name}</div>
    <div className="text-xs text-gray-500 mt-1">{description}</div>
  </button>
);

// Form Error Summary
export const FormErrorSummary = ({ errors }) => {
  const errorArray = Object.values(errors).filter(e => e);
  
  if (errorArray.length === 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="text-red-600 text-xl">⚠️</span>
        <div>
          <h4 className="font-medium text-red-900 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {errorArray.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Success Message
export const SuccessMessage = ({ message, onDismiss }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-green-600 text-xl">✅</span>
      <span className="text-green-800">{message}</span>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-green-600 hover:text-green-800">✕</button>
    )}
  </div>
);
