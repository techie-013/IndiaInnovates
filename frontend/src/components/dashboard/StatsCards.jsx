import React from 'react';
import { HiDocumentText, HiClock, HiCheckCircle, HiThumbUp } from 'react-icons/hi';

const StatsCards = ({ stats }) => {
  const cards = [
    { title: 'Total Complaints', value: stats.total, icon: HiDocumentText, color: 'blue' },
    { title: 'Pending', value: stats.pending, icon: HiClock, color: 'yellow' },
    { title: 'In Progress', value: stats.inProgress, icon: HiClock, color: 'orange' },
    { title: 'Resolved', value: stats.resolved, icon: HiCheckCircle, color: 'green' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <card.icon className={`w-10 h-10 text-${card.color}-500`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;