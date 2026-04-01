import React from 'react';
import { HiXCircle } from 'react-icons/hi';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 relative">
      <div className="flex items-start">
        <HiXCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition">
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;