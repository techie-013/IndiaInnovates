import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);
        setName(data.name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), { name, updatedAt: new Date() });
      setProfile({ ...profile, name });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            {!editing ? (
              <>
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">Role: {profile?.role || 'citizen'}</p>
                {profile?.department && <p className="text-sm text-primary-600">Department: {profile.department}</p>}
              </>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
                <button onClick={handleUpdate} className="bg-primary-600 text-white px-4 py-2 rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
              </div>
            )}
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="ml-auto text-primary-600 hover:text-primary-700">
              <i className="fas fa-edit"></i> Edit
            </button>
          )}
        </div>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-primary-600">{profile?.stats?.complaintsFiled || 0}</div>
              <div className="text-sm text-gray-500">Complaints Filed</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-600">{profile?.stats?.complaintsResolved || 0}</div>
              <div className="text-sm text-gray-500">Resolved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
