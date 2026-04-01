import React from 'react';

const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;