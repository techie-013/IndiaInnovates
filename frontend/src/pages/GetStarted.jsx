import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaUserShield, FaArrowLeft } from 'react-icons/fa';

const GetStarted = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'citizen',
      title: 'Citizen',
      icon: FaUser,
      description: 'Report issues, track complaints, and contribute to your community',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/forum'
    },
    {
      id: 'department',
      title: 'Department',
      icon: FaBuilding,
      description: 'Manage complaints, update status, and track department performance',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      path: '/department-dashboard'
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: FaUserShield,
      description: 'Full platform oversight, user management, and analytics',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/admin-dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition"
        >
          <FaArrowLeft /> Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-600">Select how you want to engage with CivicEye</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`}></div>
                <div className="p-8 text-center">
                  <div className={`w-20 h-20 ${role.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition`}>
                    <Icon className={`text-3xl ${role.iconColor}`} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                    {role.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">{role.description}</p>
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r ${role.color} text-white font-medium group-hover:shadow-lg transition`}>
                    Continue
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>All roles are currently open. Department and Admin dashboards provide full access to platform features.</p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
