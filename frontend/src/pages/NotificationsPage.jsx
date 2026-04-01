import React from 'react';
import { useAuth } from '../hooks/useAuth';

const NotificationsPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <i className="fas fa-bell text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">No new notifications</p>
        <p className="text-sm text-gray-400 mt-2">You'll be notified when there are updates on your complaints</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
