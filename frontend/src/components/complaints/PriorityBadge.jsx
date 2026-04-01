import React from 'react';

const PriorityBadge = ({ upvotes }) => {
  let priority = 'Low';
  let color = 'gray';
  let icon = '📋';
  
  if (upvotes >= 100) {
    priority = 'Critical';
    color = 'red';
    icon = '🚨';
  } else if (upvotes >= 50) {
    priority = 'High';
    color = 'orange';
    icon = '⚠️';
  } else if (upvotes >= 20) {
    priority = 'Medium';
    color = 'yellow';
    icon = '⚡';
  } else {
    priority = 'Low';
    color = 'gray';
    icon = '📋';
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
      <span>{icon}</span>
      <span>{priority}</span>
      <span className="text-xs opacity-75">({upvotes})</span>
    </span>
  );
};

export default PriorityBadge;