import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 relative">
      <div className="flex items-start">
        <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-green-700 text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-green-500 hover:text-green-700 transition">
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;