import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { FaPlusCircle, FaThumbsUp, FaComment, FaShare, FaBookmark, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaClock, FaChartLine, FaTrophy, FaFire, FaStar, FaBell, FaCrown } from 'react-icons/fa';

// Image Database
const imageDatabase = {
  'Roads': 'https://images.hindustantimes.com/ht-img/img/2023/07/10/1600x900/delhi_potholes_1688969532145_1688969541430.jpg',
  'Sanitation': 'https://www.mumbailive.com/images/media/images/garbage_1547115237548.jpg',
  'Street Lights': 'https://www.deccanherald.com/sites/dh/files/articleimages/2022/11/29/street-lights-1-1166214-1669706794.jpg',
  'Water Supply': 'https://www.thehindu.com/news/cities/chennai/t8r0h5/article32645904.ece/alternates/FREE_660/01THWATERCRISIS',
  'Drainage': 'https://www.telegraphindia.com/unsafe/620x/smart/wp-content/uploads/2021/09/kolkata-rain-waterlogging-1.jpg',
  'Parks': 'https://www.deccanchronicle.com/h-upload/2022/06/05/730x450_1555590-amp-image.jpg'
};

// Enhanced Budget Database with more wards
const budgetDB = {
  'Ward 12': { allocated: 2.3, spent: 0.4, remaining: 1.9, percentage: 17, complaints: 48 },
  'Ward 5': { allocated: 1.2, spent: 0.87, remaining: 0.33, percentage: 72, complaints: 71 },
  'Ward 8': { allocated: 0.9, spent: 0.41, remaining: 0.49, percentage: 45, complaints: 33 },
  'Ward 3': { allocated: 3.1, spent: 1.72, remaining: 1.38, percentage: 55, complaints: 52 },
  'Ward 9': { allocated: 0.5, spent: 0.11, remaining: 0.39, percentage: 22, complaints: 41 },
  'Ward 7': { allocated: 0.6, spent: 0.12, remaining: 0.48, percentage: 20, complaints: 23 },
  'Ward 2': { allocated: 1.8, spent: 0.95, remaining: 0.85, percentage: 53, complaints: 38 },
  'Ward 11': { allocated: 2.1, spent: 1.2, remaining: 0.9, percentage: 57, complaints: 45 }
};

// Enhanced sample posts
const samplePosts = [
  {
    id: 1,
    userName: 'Rahul Sharma',
    userAvatar: 'RS',
    userBadge: 'Top Contributor',
    title: '🚨 Deep potholes causing multiple accidents',
    description: 'Three major potholes on this stretch have caused 5 bike accidents in the last week. Despite multiple complaints, no action taken. Children crossing to school are at risk. The road was last repaired in 2022 and has completely deteriorated.',
    category: 'Roads',
    ward: 'Ward 12',
    location: 'MG Road, Sector 14, Delhi',
    imageUrl: imageDatabase.Roads,
    upvotes: 2345,
    comments: 128,
    shares: 45,
    timeAgo: '2 hours ago',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    userName: 'Priya Patel',
    userAvatar: 'PP',
    userBadge: 'Verified Resident',
    title: '🗑️ Garbage not collected for 2 weeks',
    description: 'Overflowing garbage bins attracting stray dogs and rats. Strong foul smell in the entire block. Children are falling sick. MCGM hasn\'t collected waste despite 8 complaints.',
    category: 'Sanitation',
    ward: 'Ward 5',
    location: 'Indira Nagar, Andheri East, Mumbai',
    imageUrl: imageDatabase.Sanitation,
    upvotes: 4567,
    comments: 342,
    shares: 89,
    timeAgo: '5 hours ago',
    status: 'in-progress',
    priority: 'critical'
  },
  {
    id: 3,
    userName: 'Amit Kumar',
    userAvatar: 'AK',
    userBadge: 'Problem Solver',
    title: '💡 Street lights not working for 3 months',
    description: 'Complete darkness on this 500m stretch. Three chain snatchings reported last month. Women feel unsafe walking after 7pm. BBMP has ₹49L budget but no action.',
    category: 'Street Lights',
    ward: 'Ward 8',
    location: '5th Block, Koramangala, Bangalore',
    imageUrl: imageDatabase['Street Lights'],
    upvotes: 3891,
    comments: 256,
    shares: 67,
    timeAgo: '1 day ago',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 4,
    userName: 'Sunita Verma',
    userAvatar: 'SV',
    userBadge: 'Community Leader',
    title: '💧 Water pipeline burst, no supply for 5 days',
    description: 'Major water leakage from a broken main pipeline. 200+ families without water. Metro Water officials informed but no repair team sent.',
    category: 'Water Supply',
    ward: 'Ward 3',
    location: 'Nehru Nagar, T. Nagar, Chennai',
    imageUrl: imageDatabase['Water Supply'],
    upvotes: 5234,
    comments: 412,
    shares: 156,
    timeAgo: '3 hours ago',
    status: 'in-progress',
    priority: 'critical'
  },
  {
    id: 5,
    userName: 'Rohit Chatterjee',
    userAvatar: 'RC',
    userBadge: 'Active Citizen',
    title: '🌊 Severe waterlogging after every rain',
    description: 'Area floods with 1-2 feet water even after 30 min rain. Drains completely choked. IT hub employees can\'t reach office.',
    category: 'Drainage',
    ward: 'Ward 9',
    location: 'Sector V, Salt Lake, Kolkata',
    imageUrl: imageDatabase.Drainage,
    upvotes: 3112,
    comments: 189,
    shares: 34,
    timeAgo: '6 hours ago',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 6,
    userName: 'Meera Reddy',
    userAvatar: 'MR',
    userBadge: 'Eco Warrior',
    title: '🌳 Park completely neglected for 2 years',
    description: 'Once beautiful park now overgrown with weeds. Walking tracks broken, benches damaged. Kids have no safe place to play.',
    category: 'Parks',
    ward: 'Ward 7',
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    imageUrl: imageDatabase.Parks,
    upvotes: 2876,
    comments: 167,
    shares: 28,
    timeAgo: '1 day ago',
    status: 'pending',
    priority: 'medium'
  }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec489a', '#84cc16'];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    category: 'Roads',
    ward: 'Ward 12',
    location: ''
  });
  const [showStats, setShowStats] = useState(false);
  const [selectedWard, setSelectedWard] = useState('Ward 12');

  const categories = ['all', 'Roads', 'Sanitation', 'Street Lights', 'Water Supply', 'Drainage', 'Parks'];
  const wards = Object.keys(budgetDB);

  useEffect(() => {
    setPosts(samplePosts);
    setLoading(false);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) {
      toast.error('Please fill all fields');
      return;
    }

    const newId = posts.length + 1;
    const postData = {
      id: newId,
      userName: user?.displayName || 'Anonymous Citizen',
      userAvatar: user?.displayName?.[0]?.toUpperCase() || 'AC',
      userBadge: 'New Member',
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      ward: newPost.ward,
      location: newPost.location || newPost.ward,
      imageUrl: imageDatabase[newPost.category],
      upvotes: 0,
      comments: 0,
      shares: 0,
      timeAgo: 'Just now',
      status: 'pending',
      priority: 'low'
    };
    
    setPosts([postData, ...posts]);
    toast.success('Complaint posted successfully!');
    setShowCreateModal(false);
    setNewPost({ title: '', description: '', category: 'Roads', ward: 'Ward 12', location: '' });
  };

  const handleUpvote = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
    toast.success('Upvoted!');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return '📋';
    }
  };

  const filteredPosts = filterCategory === 'all' ? posts : posts.filter(p => p.category === filterCategory);
  const categoryStats = categories.filter(c => c !== 'all').map(cat => ({
    name: cat,
    count: posts.filter(p => p.category === cat).length,
    upvotes: posts.filter(p => p.category === cat).reduce((sum, p) => sum + p.upvotes, 0)
  }));

  const wardData = wards.map(ward => ({
    name: ward,
    complaints: budgetDB[ward].complaints,
    spent: budgetDB[ward].spent,
    allocated: budgetDB[ward].allocated,
    percentage: budgetDB[ward].percentage
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Citizen Dashboard</h1>
              <p className="text-primary-100 mt-2">Your voice matters. Make a difference!</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowStats(!showStats)}
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition flex items-center gap-2"
              >
                <FaChartLine /> {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-primary-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg"
              >
                <FaPlusCircle /> New Complaint
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        {showStats && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaChartLine className="text-primary-600" /> Community Impact Dashboard</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{posts.length}</div>
                <div className="text-sm opacity-90">Total Complaints</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{posts.reduce((sum, p) => sum + p.upvotes, 0).toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Upvotes</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{posts.filter(p => p.status === 'resolved').length}</div>
                <div className="text-sm opacity-90">Resolved Issues</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-90">Citizen Satisfaction</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Upvotes by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryStats} dataKey="upvotes" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryStats.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Stories Row */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 overflow-x-auto">
          <div className="flex gap-8">
            <button onClick={() => setFilterCategory('all')} className={`flex flex-col items-center min-w-[80px] transition-all ${filterCategory === 'all' ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-2xl shadow-lg">🏠</div>
              <span className="text-xs mt-2 font-medium">All</span>
            </button>
            {categories.filter(c => c !== 'all').map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`flex flex-col items-center min-w-[80px] transition-all ${filterCategory === cat ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl shadow-lg`}>
                  <i className={`fas fa-${cat === 'Roads' ? 'road' : cat === 'Sanitation' ? 'trash' : cat === 'Street Lights' ? 'lightbulb' : cat === 'Water Supply' ? 'water' : cat === 'Drainage' ? 'drain' : 'tree'}`}></i>
                </div>
                <span className="text-xs mt-2 font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ward Selector */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="font-semibold text-gray-700">📍 Select Ward:</span>
            {wards.map(ward => (
              <button
                key={ward}
                onClick={() => setSelectedWard(ward)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedWard === ward ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {ward}
              </button>
            ))}
          </div>
          {budgetDB[selectedWard] && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-primary-800">{selectedWard} Budget Overview</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">FY 2025-26</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center"><div className="text-xs text-gray-500">Allocated</div><div className="font-bold text-lg">₹{budgetDB[selectedWard].allocated}Cr</div></div>
                <div className="text-center"><div className="text-xs text-gray-500">Spent</div><div className="font-bold text-lg">₹{budgetDB[selectedWard].spent}Cr</div></div>
                <div className="text-center"><div className="text-xs text-gray-500">Remaining</div><div className="font-bold text-lg">₹{budgetDB[selectedWard].remaining}Cr</div></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" style={{ width: `${budgetDB[selectedWard].percentage}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span>Utilization: {budgetDB[selectedWard].percentage}%</span>
                <span>{budgetDB[selectedWard].complaints} complaints in this ward</span>
              </div>
              {budgetDB[selectedWard].remaining < 0.5 && (
                <div className="mt-3 p-2 bg-red-100 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <FaFire /> <strong>FUNDING ALERT:</strong> Only ₹{budgetDB[selectedWard].remaining}Cr remaining for {budgetDB[selectedWard].complaints} complaints!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Post Header */}
              <div className="p-5 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {post.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900">{post.userName}</h4>
                      {post.userBadge && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaStar className="w-3 h-3" /> {post.userBadge}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FaClock /> {post.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FaMapMarkerAlt /> {post.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPriorityColor(post.priority)}`}>
                    {getPriorityIcon(post.priority)} {post.priority.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="relative h-80 md:h-96 overflow-hidden group">
                  <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={post.title} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                    <p className="text-sm"><FaMapMarkerAlt className="inline mr-1" /> {post.location}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed">{post.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">#{post.category}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{post.ward}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${post.status === 'in-progress' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.status === 'in-progress' ? 'In Progress' : 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="border-t border-gray-100">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex gap-6">
                    <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition group">
                      <FaThumbsUp className="group-hover:scale-110 transition" />
                      <span className="font-semibold">{post.upvotes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
                      <FaComment />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition">
                      <FaShare />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-yellow-500 transition">
                    <FaBookmark />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold flex items-center gap-2"><FaPlusCircle className="text-primary-600" /> Report a Civic Issue</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2">Title <span className="text-red-500">*</span></label>
                <input type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="e.g., Broken street light at main crossing" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Category <span className="text-red-500">*</span></label>
                  <select className="w-full p-3 border rounded-xl" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
                    {categories.filter(c => c !== 'all').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Ward <span className="text-red-500">*</span></label>
                  <select className="w-full p-3 border rounded-xl" value={newPost.ward} onChange={(e) => setNewPost({...newPost, ward: e.target.value})}>
                    {wards.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Location (Optional)</label>
                <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g., Near City Mall, Sector 14" value={newPost.location} onChange={(e) => setNewPost({...newPost, location: e.target.value})} />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description <span className="text-red-500">*</span></label>
                <textarea rows="5" className="w-full p-3 border rounded-xl" placeholder="Describe the problem in detail..." value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition">Post Complaint</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;

