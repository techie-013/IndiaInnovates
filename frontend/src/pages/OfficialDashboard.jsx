import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { 
  FaChartLine, FaTachometerAlt, FaFlagCheckered, FaClock, FaCheckCircle, 
  FaExclamationTriangle, FaThumbsUp, FaMapMarkerAlt, FaUser, FaCalendarAlt,
  FaFilter, FaDownload, FaBell, FaChartPie, FaChartBar, FaMedal, FaSearch,
  FaSpinner, FaEye, FaEyeSlash, FaStar, FaTrophy, FaUsers, FaFileAlt
} from 'react-icons/fa';

const OfficialDashboard = () => {
  const { user, userDepartment } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    if (!userDepartment) return;
    
    const q = query(collection(db, 'complaints'), where('ministryId', '==', userDepartment), orderBy('upvotes', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(complaintsData);
      
      const total = complaintsData.length;
      const pending = complaintsData.filter(c => c.status === 'pending').length;
      const inProgress = complaintsData.filter(c => c.status === 'in-progress').length;
      const resolved = complaintsData.filter(c => c.status === 'resolved').length;
      setStats({ total, pending, inProgress, resolved });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userDepartment]);

  const updateStatus = async (complaintId, newStatus) => {
    try {
      await updateDoc(doc(db, 'complaints', complaintId), { status: newStatus, updatedAt: new Date() });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getPriorityClass = (upvotes) => {
    if (upvotes >= 1000) return 'border-l-4 border-red-500 bg-red-50';
    if (upvotes >= 500) return 'border-l-4 border-orange-500 bg-orange-50';
    if (upvotes >= 100) return 'border-l-4 border-yellow-500 bg-yellow-50';
    return 'border-l-4 border-gray-300';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterPriority) {
      if (filterPriority === 'critical' && c.upvotes < 1000) return false;
      if (filterPriority === 'high' && (c.upvotes < 500 || c.upvotes >= 1000)) return false;
    }
    if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase()) && !c.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const resolutionRate = stats.total ? ((stats.resolved / stats.total) * 100).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold flex items-center gap-2"><FaTachometerAlt /> {userDepartment} Department Dashboard</h1>
          <p className="text-xs text-green-100 mt-1">Real-time complaints | Priority queue | Analytics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xl font-bold text-green-600">{stats.total}</div><div className="text-xs text-gray-500">Total</div></div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xl font-bold text-yellow-600">{stats.pending}</div><div className="text-xs text-gray-500">Pending</div></div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xl font-bold text-blue-600">{stats.inProgress}</div><div className="text-xs text-gray-500">In Progress</div></div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div className="text-xl font-bold text-green-600">{stats.resolved}</div><div className="text-xs text-gray-500">Resolved</div></div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-3 mb-4 flex flex-wrap gap-2">
          <div className="flex-1 min-w-[140px]"><input type="text" placeholder="Search..." className="w-full p-2 border rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="flex-1 min-w-[120px]"><select className="w-full p-2 border rounded-lg text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">All Status</option><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option></select></div>
          <div className="flex-1 min-w-[120px]"><select className="w-full p-2 border rounded-lg text-sm" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}><option value="">All Priorities</option><option value="critical">Critical (1000+)</option><option value="high">High (500+)</option></select></div>
        </div>

        {/* Complaints List */}
        <div className="space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">No complaints match your filters</div>
          ) : (
            filteredComplaints.map(complaint => (
              <div key={complaint.id} className={`bg-white rounded-xl p-3 shadow-sm ${getPriorityClass(complaint.upvotes || 0)}`}>
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(complaint.status)}`}>{complaint.status}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"><FaThumbsUp className="inline text-red-500 mr-1" /> {complaint.upvotes || 0}</span>
                      <span className="text-xs text-gray-400">{complaint.ward}</span>
                    </div>
                    <h3 className="font-semibold text-sm">{complaint.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span><FaUser className="inline mr-1" /> {complaint.userName}</span>
                      <span><FaMapMarkerAlt className="inline mr-1" /> {complaint.location}</span>
                      <span><FaCalendarAlt className="inline mr-1" /> {complaint.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select value={complaint.status} onChange={(e) => updateStatus(complaint.id, e.target.value)} className="border rounded-lg px-2 py-1 text-xs bg-white">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center"><div className="text-lg font-bold text-green-600">{resolutionRate}%</div><div className="text-xs text-gray-500">Resolution Rate</div></div>
          <div className="bg-white rounded-xl p-3 text-center"><div className="text-lg font-bold text-blue-600">{stats.pending}</div><div className="text-xs text-gray-500">Pending Cases</div></div>
          <div className="bg-white rounded-xl p-3 text-center"><div className="text-lg font-bold text-orange-600">{stats.inProgress}</div><div className="text-xs text-gray-500">Active Cases</div></div>
          <div className="bg-white rounded-xl p-3 text-center"><div className="text-lg font-bold text-green-600">{stats.resolved}</div><div className="text-xs text-gray-500">Resolved This Month</div></div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <i className="fas fa-robot mr-1"></i> 30+ Features | Real-time updates | Priority Queue
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;
