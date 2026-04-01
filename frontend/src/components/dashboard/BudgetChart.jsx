import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock budget data
const budgetData = [
  { name: 'Roads', allocated: 55, spent: 35.2, percentage: 64 },
  { name: 'Water', allocated: 48, spent: 22.6, percentage: 47 },
  { name: 'Sanitation', allocated: 32, spent: 26.9, percentage: 84 },
  { name: 'Electricity', allocated: 65, spent: 19.5, percentage: 30 },
  { name: 'Health', allocated: 45, spent: 31.5, percentage: 70 },
  { name: 'Education', allocated: 35, spent: 31.2, percentage: 89 }
];

const COLORS = {
  allocated: '#3b82f6',
  spent: '#10b981'
};

const BudgetChart = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={budgetData} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" unit=" Cr" />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip 
            formatter={(value) => [`₹${value} Cr`, '']}
            labelFormatter={(label) => `Department: ${label}`}
          />
          <Bar dataKey="allocated" fill={COLORS.allocated} name="Allocated" />
          <Bar dataKey="spent" fill={COLORS.spent} name="Spent" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Allocated Budget</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Spent Amount</span>
        </div>
      </div>

      {/* Utilization Table */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-3">Utilization Details</h4>
        <div className="space-y-2">
          {budgetData.map(dept => (
            <div key={dept.name} className="flex items-center justify-between text-sm">
              <span className="w-24 font-medium">{dept.name}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${dept.percentage > 80 ? 'bg-green-500' : dept.percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="w-16 text-right">{dept.percentage}%</span>
              <span className="w-24 text-right text-gray-500">₹{dept.spent}/{dept.allocated}Cr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;