import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CivicLens</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user.displayName || user.email}!
          </h1>
          <p className="text-gray-600 mb-6">
            You are logged in as a citizen. You can now file complaints and participate in the community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold">File Complaint</h3>
              <p className="text-sm text-gray-600">Report a civic issue</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Track Status</h3>
              <p className="text-sm text-gray-600">View your complaints</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold">Community Forum</h3>
              <p className="text-sm text-gray-600">Discuss with others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
