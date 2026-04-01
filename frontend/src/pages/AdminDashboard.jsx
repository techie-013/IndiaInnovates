import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  UserPlus, 
  AlertCircle,
  Shield,
  Mail,
  Phone,
  Calendar,
  Star,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Search,
  Filter,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    thisMonthGrowth: 12.5,
    satisfactionRate: 94,
    avgResponseTime: '2.4h'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersQuery = query(collection(db, 'users'), limit(100));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinDate: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setUsers(usersList);
      
      // Fetch complaints
      const complaintsQuery = query(collection(db, 'complaints'), limit(100));
      const complaintsSnapshot = await getDocs(complaintsQuery);
      const complaintsList = complaintsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setComplaints(complaintsList);
      
      // Calculate stats
      const pending = complaintsList.filter(c => c.status === 'pending').length;
      const resolved = complaintsList.filter(c => c.status === 'resolved').length;
      
      setStats({
        totalUsers: usersList.length,
        totalComplaints: complaintsList.length,
        pendingComplaints: pending,
        resolvedComplaints: resolved,
        thisMonthGrowth: 12.5,
        satisfactionRate: 94,
        avgResponseTime: '2.4h'
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue} from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Welcome back, {currentUser?.email?.split('@')[0] || 'Admin'}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="up"
            trendValue="+12.5%"
          />
          <StatCard 
            title="Total Complaints" 
            value={stats.totalComplaints} 
            icon={FileText} 
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend="up"
            trendValue="+8.2%"
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingComplaints} 
            icon={Clock} 
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          <StatCard 
            title="Resolved" 
            value={stats.resolvedComplaints} 
            icon={CheckCircle} 
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend="up"
            trendValue="+23.1%"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Satisfaction Rate</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.satisfactionRate}%</span>
              <span className="text-green-500 text-sm mb-1">↑ 4.5%</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" style={{ width: `${stats.satisfactionRate}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Avg Response Time</h3>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</span>
              <span className="text-green-500 text-sm mb-1">↓ 0.3h</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Faster than last month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">This Month Growth</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">+{stats.thisMonthGrowth}%</span>
              <span className="text-green-500 text-sm mb-1">↑</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">New users this month</p>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-500 mt-1">Manage user roles and permissions</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.slice(0, 10).map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'official' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role || 'citizen'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.department || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.joinDate?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'citizen'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="official">Official</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
                <p className="text-sm text-gray-500 mt-1">Latest citizen complaints and their status</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All →</button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {complaints.slice(0, 5).map(complaint => (
              <div key={complaint.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {complaint.status || 'pending'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        complaint.priority === 'high' ? 'bg-red-100 text-red-700' :
                        complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {complaint.priority || 'low'} priority
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{complaint.description?.substring(0, 100)}...</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {complaint.createdAt?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
