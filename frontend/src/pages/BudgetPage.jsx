import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const BudgetPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize chart when component mounts
    const ctx = document.getElementById('budgetChart')?.getContext('2d');
    if (ctx && window.Chart) {
      new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Roads', 'Sanitation', 'Street Lights', 'Water', 'Parks', 'Drainage'],
          datasets: [{
            data: [42, 28, 18, 35, 12, 8],
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: { cutout: '65%', plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Transparency Dashboard</h1>
      <p className="text-gray-600 mb-6">Financial Year 2025-26 · Real-time data</p>
      
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Department-wise Allocation</h2>
        <div className="h-80">
          <canvas id="budgetChart"></canvas>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left">Department</th><th className="px-6 py-3 text-right">Allocated</th><th className="px-6 py-3 text-right">Spent</th><th className="px-6 py-3 text-center">Utilization</th></tr>
          </thead>
          <tbody>
            {[
              { name: 'Roads', allocated: 55, spent: 35.2, percent: 64 },
              { name: 'Water Supply', allocated: 48, spent: 22.6, percent: 47 },
              { name: 'Sanitation', allocated: 32, spent: 26.9, percent: 84 },
              { name: 'Electricity', allocated: 65, spent: 19.5, percent: 30 },
              { name: 'Health', allocated: 45, spent: 31.5, percent: 70 },
              { name: 'Education', allocated: 35, spent: 31.2, percent: 89 }
            ].map(dept => (
              <tr key={dept.name} className="border-b">
                <td className="px-6 py-4 font-medium">{dept.name}</td>
                <td className="px-6 py-4 text-right">₹{dept.allocated}Cr</td>
                <td className="px-6 py-4 text-right">₹{dept.spent}Cr</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${dept.percent > 80 ? 'bg-green-500' : dept.percent > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${dept.percent}%` }}></div></div>
                    <span>{dept.percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetPage;