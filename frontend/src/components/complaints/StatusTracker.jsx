import React from 'react';
import { HiCheckCircle, HiClock, HiExclamation, HiFlag } from 'react-icons/hi';
import { formatDateTime } from '../../utils/formatters';

const StatusTracker = ({ status, createdAt, resolvedAt, updatedAt }) => {
  const steps = [
    { key: 'submitted', label: 'Submitted', icon: HiFlag, date: createdAt },
    { key: 'assigned', label: 'Assigned', icon: HiExclamation },
    { key: 'in-progress', label: 'In Progress', icon: HiClock },
    { key: 'resolved', label: 'Resolved', icon: HiCheckCircle, date: resolvedAt }
  ];

  const getCurrentStep = () => {
    switch(status) {
      case 'pending': return 0;
      case 'assigned': return 1;
      case 'in-progress': return 2;
      case 'resolved': return 3;
      default: return 0;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div 
        className="absolute left-6 top-0 w-0.5 bg-primary-500 transition-all duration-500"
        style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>
      
      {/* Steps */}
      <div className="space-y-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          
          return (
            <div key={step.key} className="flex items-start space-x-4">
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-primary-200 scale-110' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 pt-2">
                <h4 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </h4>
                {step.date && (
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(step.date)}</p>
                )}
                {isCurrent && status === 'in-progress' && updatedAt && (
                  <p className="text-xs text-primary-600 mt-1">Last updated: {formatDateTime(updatedAt)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;