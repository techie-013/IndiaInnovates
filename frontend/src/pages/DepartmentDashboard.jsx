import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilter, FaSort, FaDownload, FaUpload, FaEye, FaCheck, 
  FaTimes, FaClock, FaChartLine, FaMapMarkerAlt, FaUser, FaCalendar,
  FaComments, FaThumbsUp, FaFlag, FaBell, FaCog, FaFileExport,
  FaFileImport, FaHistory, FaStar, FaTrophy, FaMedal, FaChartBar,
  FaChartPie, FaList, FaTh, FaRedo, FaEnvelope, FaPhone, FaBuilding, FaUsers
} from 'react-icons/fa';

const DepartmentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWard, setFilterWard] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Sample complaints data
  const sampleComplaints = [
    { id: 1, title: 'Deep potholes on MG Road', category: 'Roads', ward: 'Ward 12', status: 'pending', priority: 'high', upvotes: 2345, date: '2024-03-15', description: 'Multiple deep potholes causing accidents' },
    { id: 2, title: 'Garbage not collected for 2 weeks', category: 'Sanitation', ward: 'Ward 5', status: 'in-progress', priority: 'critical', upvotes: 4567, date: '2024-03-14', description: 'Overflowing garbage bins' },
    { id: 3, title: 'Street lights not working', category: 'Lights', ward: 'Ward 8', status: 'pending', priority: 'high', upvotes: 3891, date: '2024-03-13', description: 'Complete darkness on 500m stretch' },
    { id: 4, title: 'Water pipeline burst', category: 'Water', ward: 'Ward 3', status: 'resolved', priority: 'critical', upvotes: 5234, date: '2024-03-12', description: 'Major water leakage' },
    { id: 5, title: 'Waterlogging after rain', category: 'Drainage', ward: 'Ward 9', status: 'in-progress', priority: 'high', upvotes: 3112, date: '2024-03-11', description: 'Severe waterlogging issues' },
  ];

  useEffect(() => {
    setComplaints(sampleComplaints);
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterWard && c.ward !== filterWard) return false;
    if (filterPriority && c.priority !== filterPriority) return false;
    if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const wards = [...new Set(complaints.map(c => c.ward))];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaBuilding className="text-2xl text-green-600" />
              <h1 className="text-2xl font-bold">Department Dashboard</h1>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><FaBell /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><FaCog /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards - 6 features */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaChartLine className="text-blue-600 text-xl" /><div className="text-2xl font-bold mt-2">{complaints.length}</div><div className="text-sm text-gray-600">Total Issues</div></div>
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaClock className="text-yellow-600 text-xl" /><div className="text-2xl font-bold mt-2">{complaints.filter(c => c.status === 'pending').length}</div><div className="text-sm text-gray-600">Pending</div></div>
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaCheck className="text-green-600 text-xl" /><div className="text-2xl font-bold mt-2">{complaints.filter(c => c.status === 'resolved').length}</div><div className="text-sm text-gray-600">Resolved</div></div>
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaChartLine className="text-purple-600 text-xl" /><div className="text-2xl font-bold mt-2">92%</div><div className="text-sm text-gray-600">Resolution Rate</div></div>
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaThumbsUp className="text-red-600 text-xl" /><div className="text-2xl font-bold mt-2">15.2k</div><div className="text-sm text-gray-600">Total Upvotes</div></div>
          <div className="bg-white rounded-lg p-4 shadow-sm"><FaStar className="text-yellow-600 text-xl" /><div className="text-2xl font-bold mt-2">4.8</div><div className="text-sm text-gray-600">Satisfaction</div></div>
        </div>

        {/* Filter and Search Section - 10+ features */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]"><div className="relative"><FaSearch className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search complaints..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
            <select className="px-4 py-2 border rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">All Status</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
            <select className="px-4 py-2 border rounded-lg" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}><option value="">All Priority</option>{priorities.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <select className="px-4 py-2 border rounded-lg" value={filterWard} onChange={(e) => setFilterWard(e.target.value)}><option value="">All Wards</option>{wards.map(w => <option key={w} value={w}>{w}</option>)}</select>
            <select className="px-4 py-2 border rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="date">Sort by Date</option><option value="upvotes">Sort by Upvotes</option><option value="priority">Sort by Priority</option></select>
            <div className="flex gap-2"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaFileExport className="inline mr-2" />Export</button><button className="px-4 py-2 border rounded-lg hover:bg-gray-50"><FaRedo className="inline mr-2" />Reset</button></div>
            <div className="flex gap-2"><button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}><FaTh /></button><button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}><FaList /></button></div>
          </div>
        </div>

        {/* Complaints Display */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4">
              <div className="flex flex-wrap gap-2 mb-2"><span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(complaint.status)}`}>{complaint.status}</span><span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(complaint.priority)}`}>{complaint.priority}</span><span className="text-xs bg-gray-100 px-2 py-1 rounded-full"><FaThumbsUp className="inline mr-1" />{complaint.upvotes}</span></div>
              <h3 className="font-semibold">{complaint.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400"><span><FaMapMarkerAlt className="inline mr-1" />{complaint.ward}</span><span><FaCalendar className="inline mr-1" />{complaint.date}</span></div>
              <div className="mt-3 flex gap-2"><select className="border rounded-lg px-3 py-2 text-sm flex-1"><option>Update Status</option><option>Mark In Progress</option><option>Mark Resolved</option></select><button onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)} className="px-3 py-2 border rounded-lg hover:bg-gray-50"><FaEye /></button></div>
              {selectedComplaint === complaint.id && <div className="mt-3 pt-3 border-t"><h4 className="font-semibold text-sm">Details</h4><p className="text-xs text-gray-600">Priority Score: {Math.min(100, (complaint.upvotes / 10) + 20)}/100</p><button className="mt-2 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Assign Officer →</button></div>}
            </div>
          ))}
        </div>

        {/* Performance Analytics - 5+ features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4"><h3 className="font-semibold mb-2"><FaChartBar className="inline mr-2" />Weekly Performance</h3><div className="space-y-2"><div className="flex justify-between text-sm"><span>Mon</span><span>12 resolved</span></div><div className="h-2 bg-gray-200 rounded"><div className="h-full bg-green-500 rounded" style={{ width: '60%' }}></div></div></div></div>
          <div className="bg-white rounded-xl p-4"><h3 className="font-semibold mb-2"><FaChartPie className="inline mr-2" />Category Distribution</h3><div><div className="text-sm">Roads: 45%</div><div className="text-sm">Sanitation: 25%</div><div className="text-sm">Lights: 20%</div></div></div>
          <div className="bg-white rounded-xl p-4"><h3 className="font-semibold mb-2"><FaTrophy className="inline mr-2" />Top Performing Wards</h3><div><div className="text-sm">Ward 3: 92%</div><div className="text-sm">Ward 5: 88%</div><div className="text-sm">Ward 12: 85%</div></div></div>
        </div>

        {/* Export Options */}
        <div className="mt-8 flex gap-3 justify-end">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50"><FaDownload className="inline mr-2" />Export CSV</button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50"><FaFileExport className="inline mr-2" />Print Report</button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50"><FaHistory className="inline mr-2" />View History</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
