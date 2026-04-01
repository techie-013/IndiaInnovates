import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import toast from 'react-hot-toast';

// ==================== IMAGE DATABASE ====================
const imageDatabase = {
  'Roads': [
    'https://www.hindustantimes.com/ht-img/img/2023/07/10/1600x900/delhi_potholes_1688969532145_1688969541430.jpg',
    'https://images.indianexpress.com/2022/07/potholes-2-1200.jpg',
    'https://www.livemint.com/lm-img/img/2023/08/02/600x338/potholes_1690962359885_1690962370171.jpg'
  ],
  'Sanitation': [
    'https://www.mumbailive.com/images/media/images/garbage_1547115237548.jpg',
    'https://images.mid-day.com/images/images/2023/jun/mumbai-garbage_d.jpg',
    'https://www.thehindu.com/news/cities/mumbai/article33982223.ece/alternates/FREE_660/08THGARBAGE'
  ],
  'Street Lights': [
    'https://www.deccanherald.com/sites/dh/files/articleimages/2022/11/29/street-lights-1-1166214-1669706794.jpg',
    'https://images.indianexpress.com/2022/12/street-lights-1200.jpg',
    'https://www.thehindu.com/news/cities/bangalore/3dq9qf/article32645904.ece/alternates/FREE_660/BENGALURU-STREET-LIGHTS'
  ],
  'Water Supply': [
    'https://www.thehindu.com/news/cities/chennai/t8r0h5/article32645904.ece/alternates/FREE_660/01THWATERCRISIS',
    'https://images.newindianexpress.com/uploads/user/imagelibrary/2022/5/18/w900X450/Water_pipeline.jpg',
    'https://www.deccanchronicle.com/h-upload/2022/06/10/730x450_1555590-amp-image.jpg'
  ],
  'Drainage': [
    'https://www.telegraphindia.com/unsafe/620x/smart/wp-content/uploads/2021/09/kolkata-rain-waterlogging-1.jpg',
    'https://www.livemint.com/lm-img/img/2023/07/09/600x338/kolkata_rain_1688898996203_1688898996468.jpg',
    'https://www.thehindu.com/news/cities/kolkata/7h5f9a/article32645904.ece/alternates/FREE_660/KOLKATA-RAIN'
  ],
  'Parks': [
    'https://www.deccanchronicle.com/h-upload/2022/06/05/730x450_1555590-amp-image.jpg',
    'https://images.timesofindia.indiatimes.com/photo/94459742/94459742.jpg',
    'https://www.thehindu.com/news/cities/Hyderabad/3dq9qf/article32645904.ece/alternates/FREE_660/HYDERABAD-PARK'
  ],
  'Electricity': [
    'https://images.indianexpress.com/2022/12/street-lights-1200.jpg',
    'https://www.deccanherald.com/sites/dh/files/articleimages/2022/11/29/street-lights-1-1166214-1669706794.jpg'
  ]
};

// ==================== BUDGET DATABASE ====================
const budgetDB = [
  { department: 'Roads', ward: 'Ward 12', allocated: 23000000, spent: 4000000, remaining: 19000000, year: '2025-26' },
  { department: 'Sanitation', ward: 'Ward 5', allocated: 12000000, spent: 8700000, remaining: 3300000, year: '2025-26' },
  { department: 'Street Lights', ward: 'Ward 8', allocated: 9000000, spent: 4100000, remaining: 4900000, year: '2025-26' },
  { department: 'Water Supply', ward: 'Ward 3', allocated: 31000000, spent: 17200000, remaining: 13800000, year: '2025-26' },
  { department: 'Roads', ward: 'Ward 5', allocated: 18000000, spent: 12500000, remaining: 5500000, year: '2025-26' },
  { department: 'Sanitation', ward: 'Ward 12', allocated: 9000000, spent: 2100000, remaining: 6900000, year: '2025-26' },
  { department: 'Parks', ward: 'Ward 7', allocated: 6000000, spent: 1200000, remaining: 4800000, year: '2025-26' },
  { department: 'Drainage', ward: 'Ward 9', allocated: 5000000, spent: 1100000, remaining: 3900000, year: '2025-26' }
];

const complaintDB = [
  { department: 'Roads', ward: 'Ward 12', count: 48, unresolved: 42 },
  { department: 'Sanitation', ward: 'Ward 5', count: 71, unresolved: 63 },
  { department: 'Street Lights', ward: 'Ward 8', count: 33, unresolved: 28 },
  { department: 'Water Supply', ward: 'Ward 3', count: 52, unresolved: 45 },
  { department: 'Roads', ward: 'Ward 5', count: 29, unresolved: 22 },
  { department: 'Drainage', ward: 'Ward 9', count: 41, unresolved: 38 },
  { department: 'Parks', ward: 'Ward 7', count: 23, unresolved: 19 }
];

const getBudget = (department, ward) => {
  return budgetDB.find(b => b.department === department && b.ward === ward) || null;
};

const getComplaintCount = (department, ward) => {
  const entry = complaintDB.find(c => c.department === department && c.ward === ward);
  return entry ? entry.unresolved : 0;
};

// Sample posts for initial display
const samplePosts = [
  {
    id: 'post1',
    userName: 'Rahul Sharma',
    userAvatar: 'RS',
    title: 'Deep potholes causing multiple accidents',
    description: 'Three major potholes on this stretch have caused 5 bike accidents in the last week. Despite multiple complaints, no action taken.',
    category: 'Roads',
    ward: 'Ward 12',
    location: 'MG Road, Sector 14, Delhi - 110030',
    imageUrl: 'https://images.hindustantimes.com/ht-img/img/2023/07/10/1600x900/delhi_potholes_1688969532145_1688969541430.jpg',
    upvotes: 2345,
    upvotedBy: [],
    comments: 128,
    createdAt: new Date(),
    status: 'pending'
  },
  {
    id: 'post2',
    userName: 'Priya Patel',
    userAvatar: 'PP',
    title: 'Garbage not collected for 2 weeks',
    description: 'Overflowing garbage bins attracting stray dogs and rats. Strong foul smell in the entire block.',
    category: 'Sanitation',
    ward: 'Ward 5',
    location: 'Indira Nagar, Andheri East, Mumbai - 400093',
    imageUrl: 'https://www.mumbailive.com/images/media/images/garbage_1547115237548.jpg',
    upvotes: 4567,
    upvotedBy: [],
    comments: 342,
    createdAt: new Date(),
    status: 'pending'
  },
  {
    id: 'post3',
    userName: 'Amit Kumar',
    userAvatar: 'AK',
    title: 'Street lights not working for 3 months',
    description: 'Complete darkness on this 500m stretch. Three chain snatchings reported last month.',
    category: 'Street Lights',
    ward: 'Ward 8',
    location: '5th Block, Koramangala, Bangalore - 560095',
    imageUrl: 'https://www.deccanherald.com/sites/dh/files/articleimages/2022/11/29/street-lights-1-1166214-1669706794.jpg',
    upvotes: 3891,
    upvotedBy: [],
    comments: 256,
    createdAt: new Date(),
    status: 'pending'
  },
  {
    id: 'post4',
    userName: 'Sunita Verma',
    userAvatar: 'SV',
    title: 'Water pipeline burst, no supply for 5 days',
    description: 'Major water leakage from a broken main pipeline. 200+ families without water.',
    category: 'Water Supply',
    ward: 'Ward 3',
    location: 'Nehru Nagar, T. Nagar, Chennai - 600017',
    imageUrl: 'https://www.thehindu.com/news/cities/chennai/t8r0h5/article32645904.ece/alternates/FREE_660/01THWATERCRISIS',
    upvotes: 5234,
    upvotedBy: [],
    comments: 412,
    createdAt: new Date(),
    status: 'pending'
  },
  {
    id: 'post5',
    userName: 'Rohit Chatterjee',
    userAvatar: 'RC',
    title: 'Severe waterlogging after every rain',
    description: 'Area floods with 1-2 feet water even after 30 min rain. Drains completely choked.',
    category: 'Drainage',
    ward: 'Ward 9',
    location: 'Sector V, Salt Lake, Kolkata - 700091',
    imageUrl: 'https://www.telegraphindia.com/unsafe/620x/smart/wp-content/uploads/2021/09/kolkata-rain-waterlogging-1.jpg',
    upvotes: 3112,
    upvotedBy: [],
    comments: 189,
    createdAt: new Date(),
    status: 'pending'
  },
  {
    id: 'post6',
    userName: 'Meera Reddy',
    userAvatar: 'MR',
    title: 'Park completely neglected for 2 years',
    description: 'Once beautiful park now overgrown with weeds. Walking tracks broken, benches damaged.',
    category: 'Parks',
    ward: 'Ward 7',
    location: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
    imageUrl: 'https://www.deccanchronicle.com/h-upload/2022/06/05/730x450_1555590-amp-image.jpg',
    upvotes: 2876,
    upvotedBy: [],
    comments: 167,
    createdAt: new Date(),
    status: 'pending'
  }
];

const ForumPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    category: 'Roads',
    ward: 'Ward 12',
    location: '',
    imageUrl: ''
  });
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  const categories = ['Roads', 'Sanitation', 'Street Lights', 'Water Supply', 'Drainage', 'Parks', 'Electricity', 'Transport'];
  const wards = ['Ward 3 (T. Nagar)', 'Ward 5 (Andheri)', 'Ward 8 (Koramangala)', 'Ward 12 (South Delhi)', 'Ward 7 (Jubilee Hills)', 'Ward 9 (Salt Lake)'];

  useEffect(() => {
    fetchPosts();
    initChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const initChart = () => {
    const ctx = document.getElementById('deptChart')?.getContext('2d');
    if (ctx && window.Chart && !chartInstance.current) {
      chartInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Roads', 'Sanitation', 'Lights', 'Water', 'Parks', 'Drainage'],
          datasets: [{
            data: [42, 28, 18, 35, 12, 8],
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: { 
          cutout: '65%', 
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  };

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (data.length > 0) {
        setPosts(data);
      } else {
        setPosts(samplePosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) {
      toast.error('Please fill title and description');
      return;
    }

    try {
      const categoryImages = imageDatabase[newPost.category] || imageDatabase['Roads'];
      const randomImage = newPost.imageUrl || categoryImages[Math.floor(Math.random() * categoryImages.length)];
      const wardName = newPost.ward.split(' ')[0] + ' ' + newPost.ward.split(' ')[1];
      
      const postData = {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
        userAvatar: user?.displayName?.[0]?.toUpperCase() || 'U',
        title: newPost.title,
        description: newPost.description,
        category: newPost.category,
        ward: wardName,
        location: newPost.location || wardName,
        imageUrl: randomImage,
        ministryId: newPost.category,
        status: 'pending',
        upvotes: 0,
        upvotedBy: [],
        comments: [],
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'complaints'), postData);
      toast.success('Complaint posted successfully!');
      setShowCreateModal(false);
      setNewPost({ title: '', description: '', category: 'Roads', ward: 'Ward 12', location: '', imageUrl: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to post complaint');
    }
  };

  const handleUpvote = async (postId) => {
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      const postRef = doc(db, 'complaints', postId);
      const post = posts.find(p => p.id === postId);
      const hasUpvoted = post.upvotedBy?.includes(user.uid);
      
      if (hasUpvoted) {
        await updateDoc(postRef, {
          upvotes: (post.upvotes || 0) - 1,
          upvotedBy: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          upvotes: (post.upvotes || 0) + 1,
          upvotedBy: arrayUnion(user.uid)
        });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getRandomImage = (category) => {
    const images = imageDatabase[category] || imageDatabase['Roads'];
    return images[Math.floor(Math.random() * images.length)];
  };

  const filteredPosts = filterCategory ? posts.filter(p => p.category === filterCategory) : posts;

  const renderBudgetCard = (post) => {
    const budget = getBudget(post.category, post.ward);
    if (!budget) return null;
    
    const spentPercent = (budget.spent / budget.allocated * 100).toFixed(1);
    const remainingCr = (budget.remaining / 10000000).toFixed(2);
    const allocatedCr = (budget.allocated / 10000000).toFixed(2);
    const spentLakh = (budget.spent / 100000).toFixed(2);
    const complaints = getComplaintCount(post.category, post.ward);
    const gapDetected = (budget.remaining < 2000000 && complaints > 20);
    const accountability = (budget.remaining > 10000000 && complaints > 15);

    return (
      <div className="budget-card">
        <div className="budget-header">
          <span><i className="fas fa-landmark"></i> {post.category} · {post.ward}</span>
          <span>FY {budget.year}</span>
        </div>
        <div className="budget-numbers">
          <div className="budget-item"><span className="label">Allocated</span><span className="value">₹{allocatedCr}Cr</span></div>
          <div className="budget-item"><span className="label">Spent</span><span className="value">₹{spentLakh}L</span></div>
          <div className="budget-item"><span className="label">Remaining</span><span className="value">₹{remainingCr}Cr</span></div>
        </div>
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${spentPercent}%` }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Utilized: {spentPercent}%</span>
          <span>Remaining: {(100 - spentPercent).toFixed(1)}%</span>
        </div>
        {gapDetected && (
          <div className="gap-alert">
            <i className="fas fa-exclamation-circle"></i>
            <strong>FUNDING GAP:</strong> {complaints} complaints unresolved, only ₹{(budget.remaining/100000).toFixed(1)}L left!
          </div>
        )}
        {accountability && (
          <div className="accountability-prompt">
            <i className="fas fa-question-circle"></i>
            <strong>ACCOUNTABILITY:</strong> ₹{remainingCr}Cr unspent — why are {complaints} issues not resolved?
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo" onClick={() => window.location.reload()}>
            <i className="fas fa-eye"></i> CivicLens
          </div>
          <div className="nav-icons">
            <i className="fas fa-home" title="Home"></i>
            <i className="fas fa-compass" title="Explore"></i>
            <i className="fas fa-chart-pie" title="Dashboard"></i>
            <i className="fas fa-bell" title="Notifications"></i>
            <div className="avatar-sm" title="Profile"></div>
          </div>
        </div>
      </nav>

      <main className="container">
        {/* Stories Row */}
        <div className="stories-wrapper">
          <div className="stories">
            {categories.map(cat => (
              <div key={cat} className="story" onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}>
                <div className="story-ring">
                  <div className="story-avatar">
                    <i className={`fas fa-${cat === 'Roads' ? 'road' : cat === 'Sanitation' ? 'trash' : cat === 'Street Lights' ? 'lightbulb' : cat === 'Water Supply' ? 'water' : cat === 'Drainage' ? 'drain' : cat === 'Parks' ? 'tree' : cat === 'Electricity' ? 'bolt' : 'bus'}`}></i>
                  </div>
                </div>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed + Sidebar */}
        <div className="feed-wrapper">
          {/* Left Column - Feed */}
          <div className="feed-column">
            {/* Create Post CTA */}
            <div className="create-post-card flex" id="openCreateModal" onClick={() => setShowCreateModal(true)}>
              <i className="fas fa-plus-circle" style={{ fontSize: '2.5rem', color: '#2563eb' }}></i>
              <div style={{ marginLeft: '1rem' }}>
                <strong style={{ fontSize: '1.2rem' }}>Report a civic issue</strong><br />
                <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>Add photo, location and hold officials accountable</span>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.map((post, idx) => (
              <div key={post.id} className="post-card" id={`post${idx + 1}`}>
                <div className="post-header">
                  <div className="post-avatar">{post.userAvatar || post.userName?.[0]?.toUpperCase() || 'U'}</div>
                  <div className="post-user">
                    <h4>{post.userName} <span style={{ color: '#8e8e8e', fontWeight: 'normal' }}>· Follow</span></h4>
                    <p>{post.ward} · {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}</p>
                  </div>
                  <div className="post-category-badge">
                    <i className={`fas fa-${post.category === 'Roads' ? 'road' : post.category === 'Sanitation' ? 'trash' : post.category === 'Street Lights' ? 'lightbulb' : post.category === 'Water Supply' ? 'water' : 'tag'}`}></i> {post.category}
                  </div>
                </div>
                
                <div className="post-image-container">
                  <img 
                    src={post.imageUrl || getRandomImage(post.category)} 
                    className="post-image" 
                    alt={post.title}
                    onError={(e) => e.target.src = getRandomImage(post.category)}
                  />
                  <div className="image-overlay">
                    <i className="fas fa-map-marker-alt"></i> {post.location || post.ward}
                  </div>
                </div>
                
                <div className="post-location">
                  <i className="fas fa-location-dot"></i> {post.location || post.ward}
                </div>
                
                {renderBudgetCard(post)}
                
                <div style={{ padding: '0 1.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{post.title}</strong>
                  <p style={{ fontSize: '0.95rem', color: '#374151', marginTop: '0.5rem', lineHeight: '1.6' }}>
                    {post.description}
                  </p>
                </div>
                
                <div className="post-stats">
                  <span>❤️ {post.upvotes?.toLocaleString() || 0} likes</span>
                  <span className="ml-4">💬 {post.comments?.length || 0} comments</span>
                </div>
                
                <div className="post-actions">
                  <i className={`${post.upvotedBy?.includes(user?.uid) ? 'fas' : 'far'} fa-heart like-btn`} onClick={() => handleUpvote(post.id)}></i>
                  <span className="like-count">{post.upvotes || 0}</span>
                  <i className="far fa-comment"></i><span>{post.comments?.length || 0}</span>
                  <i className="far fa-share-square"></i><span>0</span>
                  <i className="far fa-bookmark" style={{ marginLeft: 'auto' }}></i>
                </div>
                
                <div className="comment-box">
                  <input type="text" className="comment-input" placeholder="Add a comment..." />
                  <button className="comment-btn">Post</button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-side">
            <h3><i className="fas fa-chart-line" style={{ color: '#2563eb' }}></i> Budget Transparency</h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem' }}>Financial Year 2025-26 · Real-time data</p>
            
            <div className="chart-container">
              <canvas id="deptChart" width="300" height="150"></canvas>
            </div>

            <div className="dept-budget-list">
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-road" style={{ color: '#2563eb' }}></i> Roads</span>
                <span style={{ fontWeight: '700' }}>₹2.3Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '30%' }}></div></div>
                <span className="trend-up">↑12%</span>
              </div>
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-trash"></i> Sanitation</span>
                <span style={{ fontWeight: '700' }}>₹1.2Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '72%' }}></div></div>
                <span className="trend-down">↓8%</span>
              </div>
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-lightbulb"></i> Lights</span>
                <span style={{ fontWeight: '700' }}>₹0.9Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '45%' }}></div></div>
                <span className="trend-up">↑3%</span>
              </div>
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-water"></i> Water</span>
                <span style={{ fontWeight: '700' }}>₹3.1Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '55%' }}></div></div>
                <span className="trend-up">↑5%</span>
              </div>
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-tree"></i> Parks</span>
                <span style={{ fontWeight: '700' }}>₹0.6Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '20%' }}></div></div>
                <span className="trend-down">↓2%</span>
              </div>
              <div className="dept-row">
                <span className="dept-name"><i className="fas fa-drain"></i> Drainage</span>
                <span style={{ fontWeight: '700' }}>₹0.5Cr</span>
                <div className="dept-bar"><div className="dept-bar-fill" style={{ width: '10%' }}></div></div>
                <span className="trend-up">↑1%</span>
              </div>
            </div>

            <div className="funding-alert-card">
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#b91c1c', fontSize: '1.4rem' }}></i>
                <strong style={{ fontSize: '1.1rem' }}>Critical Gaps</strong>
              </div>
              <div id="fundingGapList">
                <div style={{ fontSize: '0.9rem', marginBottom: '1rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>
                  ⚠️ <strong>Ward 12 Roads:</strong> 48 complaints, ₹19L remaining
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '1rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>
                  ⚠️ <strong>Ward 5 Sanitation:</strong> 63 complaints, budget exhausted
                </div>
                <div style={{ fontSize: '0.9rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>
                  ⚠️ <strong>Ward 8 Lights:</strong> 28 complaints, 0 action
                </div>
              </div>
            </div>

            <div className="accountability-card">
              <i className="fas fa-question-circle" style={{ color: '#854d0e', fontSize: '1.5rem' }}></i>
              <strong style={{ fontSize: '1.1rem', display: 'block', margin: '0.5rem 0' }}>Accountability Check</strong>
              <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
                ₹1.9Cr unspent in Roads • 48 complaints unresolved
              </p>
              <p style={{ fontSize: '0.85rem', background: 'white', padding: '1rem', borderRadius: '16px', margin: '1rem 0' }}>
                "If money exists, why are potholes not fixed?" Tag your councilor below 👇
              </p>
              <button className="btn" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}>
                <i className="fas fa-bullhorn"></i> Demand Action
              </button>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Top Unresolved Wards</h4>
              <div style={{ background: '#f3f4f6', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span>Ward 12 (Roads)</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>42</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span>Ward 5 (Sanitation)</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>63</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ward 8 (Lights)</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>28</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="footer-text">
        <i className="fas fa-building"></i> CivicLens · Making governance transparent · 10,000+ issues resolved · © 2026
      </div>

      {/* Create Issue Modal */}
      <div className={`modal ${showCreateModal ? 'active' : ''}`} id="issueModal">
        <div className="modal-content">
          <h2 style={{ marginBottom: '2rem', display: 'flex', gap: '0.8rem' }}>
            <i className="fas fa-plus-circle" style={{ color: '#2563eb' }}></i> Report New Issue
          </h2>
          
          <div className="form-group">
            <label><i className="fas fa-heading"></i> Title</label>
            <input type="text" className="form-control" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} placeholder="e.g., Broken street light at main crossing" />
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-tag"></i> Category</label>
            <select className="form-control" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
              {categories.slice(0, 7).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-map-pin"></i> Ward</label>
            <select className="form-control" value={newPost.ward} onChange={(e) => setNewPost({...newPost, ward: e.target.value})}>
              {wards.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-align-left"></i> Description</label>
            <textarea className="form-control" rows="4" value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} placeholder="Describe the problem in detail..."></textarea>
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-image"></i> Photo URL (optional)</label>
            <input type="text" className="form-control" value={newPost.imageUrl} onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})} placeholder="https://..." />
            <small style={{ color: '#6b7280', marginTop: '0.3rem', display: 'block' }}>Leave empty for auto-generated image</small>
          </div>
          
          <div className="flex" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button className="btn" onClick={handleCreatePost}>Post Issue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
