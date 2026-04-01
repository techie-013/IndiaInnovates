import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaUserShield, FaComments, FaArrowLeft, FaEye } from 'react-icons/fa';

const DashboardLinks = () => {
  const navigate = useNavigate();

  const dashboards = [
    { 
      name: 'Citizen Dashboard', 
      icon: FaUser, 
      path: '/dashboard', 
      color: 'blue', 
      description: 'Report civic issues, track complaints, and engage with your community',
      features: ['Report Issues', 'Track Progress', 'Upvote Complaints', 'Add Comments', 'View Analytics']
    },
    { 
      name: 'Department Dashboard', 
      icon: FaBuilding, 
      path: '/department-dashboard', 
      color: 'green', 
      description: 'Manage complaints, update status, and monitor department performance',
      features: ['Filter Complaints', 'Update Status', 'Assign Officers', 'View Analytics', 'Export Reports']
    },
    { 
      name: 'Admin Dashboard', 
      icon: FaUserShield, 
      path: '/admin-dashboard', 
      color: 'purple', 
      description: 'Full platform management, user oversight, and system configuration',
      features: ['User Management', 'Department Oversight', 'System Settings', 'Security Controls', 'Analytics']
    },
    { 
      name: 'Public Forum', 
      icon: FaComments, 
      path: '/forum', 
      color: 'orange', 
      description: 'Live community discussions and real-time issue tracking',
      features: ['Live Feed', 'Real-time Updates', 'Community Engagement', 'Share Issues', 'Discuss Solutions']
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:border-blue-400' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', hover: 'hover:border-green-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:border-purple-400' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:border-orange-400' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <FaArrowLeft /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <FaEye className="text-2xl text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CivicEye
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dashboard Access Portal</h1>
          <p className="text-xl text-gray-600">Select a dashboard to start your demo experience</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {dashboards.map((dashboard, idx) => {
            const Icon = dashboard.icon;
            const colors = colorClasses[dashboard.color];
            return (
              <button
                key={idx}
                onClick={() => navigate(dashboard.path)}
                className={`bg-white rounded-2xl shadow-lg border-2 ${colors.border} ${colors.hover} transition-all duration-300 overflow-hidden text-left hover:shadow-2xl transform hover:-translate-y-1`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`text-3xl ${colors.text}`} />
                    </div>
                    <div className={`px-3 py-1 ${colors.bg} rounded-full text-sm font-medium ${colors.text}`}>
                      Demo Ready
                    </div>
                  </div>
                  
                  <h2 className={`text-2xl font-bold mb-2 ${colors.text}`}>{dashboard.name}</h2>
                  <p className="text-gray-600 mb-4">{dashboard.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h3>
                    <div className="flex flex-wrap gap-2">
                      {dashboard.features.map((feature, i) => (
                        <span key={i} className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded-full`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between pt-4 border-t ${colors.border}`}>
                    <span className={`text-sm font-medium ${colors.text}`}>Click to access</span>
                    <span className={`${colors.text} text-xl`}>→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Navigation Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-center">🏠 Home</button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-center">👤 Citizen</button>
            <button onClick={() => navigate('/department-dashboard')} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-center">🏢 Department</button>
            <button onClick={() => navigate('/admin-dashboard')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-center">🛡️ Admin</button>
            <button onClick={() => navigate('/forum')} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-center">💬 Forum</button>
            <button onClick={() => navigate('/get-started')} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-center">🚀 Get Started</button>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">📹 Demo Recording Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Start from Landing Page → Show all dashboard options</li>
            <li>• Demo each dashboard to show key features</li>
            <li>• Public Forum shows live feed with real-time updates</li>
            <li>• Department Dashboard shows filtering and management features</li>
            <li>• Admin Dashboard shows user and system management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLinks;
