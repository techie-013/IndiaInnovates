import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiPhoto, HiX } from 'react-icons/hi';
import { useGeolocation } from '../../hooks/useGeolocation';

const ComplaintForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { location: geoLocation, loading: geoLoading } = useGeolocation();

  const categories = [
    'Roads', 'Water Supply', 'Sanitation', 'Electricity', 'Drainage', 'Parks', 'Other'
  ];

  const handleUseCurrentLocation = () => {
    if (geoLocation) {
      setLocation({
        lat: geoLocation.lat,
        lng: geoLocation.lng,
        address: `${geoLocation.lat.toFixed(6)}, ${geoLocation.lng.toFixed(6)}`
      });
      toast.success('Location detected!');
    } else {
      toast.error('Unable to get location');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'complaints'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        title: title.trim(),
        description: description.trim(),
        category,
        ministryId: category,
        location: location || null,
        imageUrl: imageUrl || null,
        status: 'pending',
        upvotes: 0,
        upvotedBy: [],
        createdAt: new Date()
      });
      
      toast.success('Complaint submitted successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation(null);
      setImageUrl('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">File New Complaint</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            maxLength="100"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed information about the issue"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            maxLength="1000"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Location</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={location?.address || ''}
              placeholder="Location address"
              className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
              readOnly
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <HiLocationMarker className="w-4 h-4" />
              <span>{geoLoading ? 'Getting...' : 'Current'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Click "Current" to auto-detect your location</p>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Image URL (Optional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Paste a link to an image of the issue</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;