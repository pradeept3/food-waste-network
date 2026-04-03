import React from 'react';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  imageSrc, 
  cta, 
  onCta 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center space-y-4">
        {/* Image or Icon */}
        {imageSrc ? (
          <div className="flex justify-center mb-6">
            <img 
              src={imageSrc} 
              alt={title}
              className="w-48 h-48 object-contain"
            />
          </div>
        ) : (
          <div className="text-7xl mb-6 animate-bounce">{icon}</div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 max-w-md mx-auto text-base">
          {description}
        </p>

        {/* Call to Action */}
        {cta && onCta && (
          <button
            onClick={onCta}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {cta}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
