import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DepartmentStats = ({ complaints, department }) => {
  const statusCount = {
    pending: complaints.filter(c => c.status === 'pending' || c.status === 'assigned').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length
  };

  const statusData = [
    { name: 'Pending', value: statusCount.pending, color: '#f59e0b' },
    { name: 'In Progress', value: statusCount.inProgress, color: '#3b82f6' },
    { name: 'Resolved', value: statusCount.resolved, color: '#10b981' },
    { name: 'Rejected', value: statusCount.rejected, color: '#ef4444' }
  ].filter(d => d.value > 0);

  // Weekly trend data (last 7 days)
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const count = complaints.filter(c => {
      const complaintDate = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
      return complaintDate.toDateString() === date.toDateString();
    }).length;
    weeklyData.push({ day: dayName, count });
  }

  const totalComplaints = complaints.length;
  const avgResolutionTime = complaints
    .filter(c => c.resolvedAt && c.createdAt)
    .reduce((sum, c) => {
      const created = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
      const resolved = c.resolvedAt.toDate ? c.resolvedAt.toDate() : new Date(c.resolvedAt);
      return sum + (resolved - created);
    }, 0) / (complaints.filter(c => c.status === 'resolved').length || 1);
  
  const avgDays = Math.floor(avgResolutionTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">{department} Department Analytics</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div>
          <h3 className="font-medium mb-3">Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">No data available</div>
          )}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Weekly Trend */}
        <div>
          <h3 className="font-medium mb-3">Weekly Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="font-medium mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary-600">
              {totalComplaints === 0 ? '0' : ((statusCount.resolved / totalComplaints) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">Resolution Rate</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary-600">
              {statusCount.pending}
            </p>
            <p className="text-xs text-gray-500">Pending Cases</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary-600">
              {Math.floor(complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0) / (totalComplaints || 1))}
            </p>
            <p className="text-xs text-gray-500">Avg Upvotes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary-600">
              {avgDays}
            </p>
            <p className="text-xs text-gray-500">Avg Resolution (days)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;