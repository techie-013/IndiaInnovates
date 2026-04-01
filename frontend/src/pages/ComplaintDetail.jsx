import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const docRef = doc(db, 'complaints', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setComplaint({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const complaintRef = doc(db, 'complaints', id);
      const hasUpvoted = complaint.upvotedBy?.includes(user.uid);
      await updateDoc(complaintRef, {
        upvotes: (complaint.upvotes || 0) + (hasUpvoted ? -1 : 1),
        upvotedBy: hasUpvoted ? complaint.upvotedBy.filter(uid => uid !== user.uid) : [...(complaint.upvotedBy || []), user.uid]
      });
      fetchComplaint();
      toast.success(hasUpvoted ? 'Upvote removed' : 'Upvoted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!complaint) {
    return <div className="text-center py-12">Complaint not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-primary-600 hover:underline mb-4">← Back</button>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
              complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {complaint.status || 'pending'}
            </span>
            <h1 className="text-2xl font-bold mt-2">{complaint.title}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Posted by {complaint.userName} on {complaint.createdAt?.toDate().toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-4">{complaint.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <button onClick={handleUpvote} className="flex items-center gap-2 text-red-500">
                <i className={`${complaint.upvotedBy?.includes(user?.uid) ? 'fas' : 'far'} fa-heart text-xl`}></i>
                <span>{complaint.upvotes || 0} upvotes</span>
              </button>
              <span><i className="fas fa-map-marker-alt mr-1"></i> {complaint.ward}</span>
              <span><i className="fas fa-tag mr-1"></i> {complaint.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
