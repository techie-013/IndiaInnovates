import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CreateComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    ward: 'Ward 12',
    location: ''
  });

  const categories = ['Roads', 'Sanitation', 'Street Lights', 'Water Supply', 'Drainage', 'Parks', 'Electricity'];
  const wards = ['Ward 12', 'Ward 5', 'Ward 8', 'Ward 3', 'Ward 9', 'Ward 7'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'complaints'), {
        ...formData,
        userId: user.uid,
        userName: user.displayName || user.email,
        status: 'pending',
        upvotes: 0,
        upvotedBy: [],
        comments: [],
        createdAt: new Date()
      });
      toast.success('Complaint submitted successfully!');
      navigate('/citizen');
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">File a Complaint</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-lg">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Ward *</label>
            <select value={formData.ward} onChange={(e) => setFormData({...formData, ward: e.target.value})} className="w-full p-3 border rounded-lg">
              {wards.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="5" className="w-full p-3 border rounded-lg" required></textarea>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button type="button" onClick={() => navigate('/citizen')} className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
