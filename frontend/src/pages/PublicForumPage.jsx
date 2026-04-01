// src/pages/PublicForumPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, getDocs, updateDoc, doc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

const PublicForumPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Roads',
    ward: 'Ward 12',
    description: '',
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Image Database (Shortened URLs)
  const imageDatabase = {
    'Roads': [
      'https://picsum.photos/id/104/800/500',
      'https://picsum.photos/id/96/800/500',
      'https://picsum.photos/id/15/800/500'
    ],
    'Sanitation': [
      'https://picsum.photos/id/20/800/500',
      'https://picsum.photos/id/22/800/500',
      'https://picsum.photos/id/24/800/500'
    ],
    'Street Lights': [
      'https://picsum.photos/id/28/800/500',
      'https://picsum.photos/id/30/800/500',
      'https://picsum.photos/id/32/800/500'
    ],
    'Water Supply': [
      'https://picsum.photos/id/38/800/500',
      'https://picsum.photos/id/42/800/500',
      'https://picsum.photos/id/44/800/500'
    ],
    'Drainage': [
      'https://picsum.photos/id/48/800/500',
      'https://picsum.photos/id/50/800/500',
      'https://picsum.photos/id/52/800/500'
    ],
    'Parks': [
      'https://picsum.photos/id/56/800/500',
      'https://picsum.photos/id/58/800/500',
      'https://picsum.photos/id/60/800/500'
    ]
  };

  // Budget Database (exactly as in HTML)
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

  // Complaint Database
  const complaintDB = [
    { department: 'Roads', ward: 'Ward 12', count: 48, unresolved: 42 },
    { department: 'Sanitation', ward: 'Ward 5', count: 71, unresolved: 63 },
    { department: 'Street Lights', ward: 'Ward 8', count: 33, unresolved: 28 },
    { department: 'Water Supply', ward: 'Ward 3', count: 52, unresolved: 45 },
    { department: 'Roads', ward: 'Ward 5', count: 29, unresolved: 22 },
    { department: 'Drainage', ward: 'Ward 9', count: 41, unresolved: 38 },
    { department: 'Parks', ward: 'Ward 7', count: 23, unresolved: 19 }
  ];

  // Sample Posts (with shortened image URLs)
  const samplePosts = [
    {
      id: 'post1',
      title: 'Deep potholes causing multiple accidents',
      category: 'Roads',
      ward: 'Ward 12',
      description: 'Three major potholes on this stretch have caused 5 bike accidents in the last week. Despite multiple complaints, no action taken. Children crossing to school are at risk. The road was last repaired in 2022 and has completely deteriorated.',
      userName: 'Rahul Sharma',
      userInitials: 'RS',
      upvotes: 2345,
      comments: 128,
      shares: 45,
      imageUrl: 'https://picsum.photos/id/104/800/500',
      location: 'MG Road, Sector 14, Delhi - 110030',
      overlayLocation: 'Sector 14, near HP Petrol Pump',
      timeAgo: '2 hours ago'
    },
    {
      id: 'post2',
      title: 'Garbage not collected for 2 weeks',
      category: 'Sanitation',
      ward: 'Ward 5',
      description: 'Overflowing garbage bins attracting stray dogs and rats. Strong foul smell in the entire block. Children are falling sick. MCGM hasn\'t collected waste despite 8 complaints. Budget allocated but no action taken.',
      userName: 'Priya Patel',
      userInitials: 'PP',
      upvotes: 4567,
      comments: 342,
      shares: 89,
      imageUrl: 'https://picsum.photos/id/20/800/500',
      location: 'Indira Nagar, Andheri East, Mumbai - 400093',
      overlayLocation: 'Block C, Indira Nagar, Andheri East',
      timeAgo: '5 hours ago'
    },
    {
      id: 'post3',
      title: 'Street lights not working for 3 months',
      category: 'Street Lights',
      ward: 'Ward 8',
      description: 'Complete darkness on this 500m stretch. Three chain snatchings reported last month. Women feel unsafe walking after 7pm. BBMP has ₹49L budget for lights in this ward but no action taken. 28 complaints filed, zero resolution.',
      userName: 'Amit Kumar',
      userInitials: 'AK',
      upvotes: 3891,
      comments: 256,
      shares: 67,
      imageUrl: 'https://picsum.photos/id/28/800/500',
      location: '5th Block, Koramangala, Bangalore - 560095',
      overlayLocation: 'Gandhi Marg, Koramangala',
      timeAgo: '1 day ago'
    },
    {
      id: 'post4',
      title: 'Water pipeline burst, no supply for 5 days',
      category: 'Water Supply',
      ward: 'Ward 3',
      description: 'Major water leakage from a broken main pipeline. 200+ families without water. Metro Water officials informed but no repair team sent. Water is being wasted 24/7. ₹1.38Cr budget remains unused for this ward.',
      userName: 'Sunita Verma',
      userInitials: 'SV',
      upvotes: 5234,
      comments: 412,
      shares: 156,
      imageUrl: 'https://picsum.photos/id/38/800/500',
      location: 'Nehru Nagar, T. Nagar, Chennai - 600017',
      overlayLocation: 'Nehru Nagar, T. Nagar',
      timeAgo: '3 hours ago'
    },
    {
      id: 'post5',
      title: 'Severe waterlogging after every rain',
      category: 'Drainage',
      ward: 'Ward 9',
      description: 'Area floods with 1-2 feet water even after 30 min rain. Drains completely choked. IT hub employees can\'t reach office. Vehicles break down. KMDA allocated ₹50L for drainage but only 10% spent. 3 years and no desilting done.',
      userName: 'Rohit Chatterjee',
      userInitials: 'RC',
      upvotes: 3112,
      comments: 189,
      shares: 34,
      imageUrl: 'https://picsum.photos/id/48/800/500',
      location: 'Sector V, Salt Lake, Kolkata - 700091',
      overlayLocation: 'Salt Lake, Sector V',
      timeAgo: '6 hours ago'
    },
    {
      id: 'post6',
      title: 'Park completely neglected for 2 years',
      category: 'Parks',
      ward: 'Ward 7',
      description: 'Once beautiful park now overgrown with weeds. Walking tracks broken, benches damaged. Kids have no safe place to play. GHMC allocated ₹60L for park maintenance but spent nothing. Senior citizens demand immediate renovation.',
      userName: 'Meera Reddy',
      userInitials: 'MR',
      upvotes: 2876,
      comments: 167,
      shares: 28,
      imageUrl: 'https://picsum.photos/id/56/800/500',
      location: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
      overlayLocation: 'Jubilee Hills Park',
      timeAgo: '1 day ago'
    }
  ];

  const categories = ['Roads', 'Sanitation', 'Street Lights', 'Water Supply', 'Drainage', 'Parks', 'Electricity', 'Transport'];
  const wards = ['Ward 3 (T. Nagar)', 'Ward 5 (Andheri)', 'Ward 8 (Koramangala)', 'Ward 12 (South Delhi)', 'Ward 7 (Jubilee Hills)', 'Ward 9 (Salt Lake)'];

  useEffect(() => {
    fetchPosts();
    initializeChart();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setPosts(postsData.length ? postsData : samplePosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  const initializeChart = () => {
    if (chartRef.current && !chartInstanceRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx && window.Chart) {
        chartInstanceRef.current = new window.Chart(ctx, {
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
    }
  };

  const getBudget = (department, ward) => {
    return budgetDB.find(b => b.department === department && b.ward === ward) || null;
  };

  const getComplaintCount = (department, ward) => {
    const entry = complaintDB.find(c => c.department === department && c.ward === ward);
    return entry ? entry.unresolved : 0;
  };

  const handleLike = async (postId, currentLikes) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, upvotes: (post.upvotes || 0) + 1, userLiked: true } : post
      ));
      
      if (currentUser) {
        const postRef = doc(db, 'forumPosts', postId);
        await updateDoc(postRef, {
          upvotes: increment(1)
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to create a post');
      return;
    }

    if (!newPost.title || !newPost.description) {
      alert('Please fill title and description');
      return;
    }

    setSubmitting(true);

    try {
      const categoryKey = newPost.category === 'Street Lights' ? 'Street Lights' : 
                         newPost.category === 'Water Supply' ? 'Water Supply' : newPost.category;
      const images = imageDatabase[categoryKey] || imageDatabase['Roads'];
      const randomImage = newPost.imageUrl || images[Math.floor(Math.random() * images.length)];

      const postData = {
        title: newPost.title,
        category: newPost.category,
        ward: newPost.ward.split(' ')[0] + ' ' + newPost.ward.split(' ')[1],
        description: newPost.description,
        imageUrl: randomImage,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        userInitials: (currentUser.displayName || currentUser.email?.[0] || 'U').toUpperCase(),
        upvotes: 0,
        comments: 0,
        shares: 0,
        location: newPost.ward,
        overlayLocation: newPost.ward,
        timeAgo: 'Just now',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'forumPosts'), postData);
      
      setPosts([{
        id: docRef.id,
        ...postData,
        createdAt: new Date()
      }, ...posts]);
      
      setNewPost({
        title: '',
        category: 'Roads',
        ward: 'Ward 12 (South Delhi)',
        description: '',
        imageUrl: ''
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const BudgetCard = ({ department, ward }) => {
    const budget = getBudget(department, ward);
    if (!budget) return null;
    
    const spentPercent = (budget.spent / budget.allocated * 100).toFixed(1);
    const remainingCr = (budget.remaining / 10000000).toFixed(2);
    const allocatedCr = (budget.allocated / 10000000).toFixed(2);
    const spentLakh = (budget.spent / 100000).toFixed(2);
    const complaints = getComplaintCount(department, ward);
    
    const gapDetected = (budget.remaining < 2000000 && complaints > 20);
    const accountability = (budget.remaining > 10000000 && complaints > 15);

    return (
      <div className="budget-card" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f0ff 100%)', borderRadius: '20px', padding: '1.2rem', margin: '1rem 1.5rem', border: '1px solid #bfdbfe' }}>
        <div className="budget-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '1rem' }}>
          <span><i className="fas fa-landmark"></i> {department} · {ward}</span>
          <span>FY {budget.year}</span>
        </div>
        <div className="budget-numbers" style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', background: 'white', borderRadius: '30px', padding: '0.8rem' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Allocated</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{allocatedCr}Cr</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Spent</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{spentLakh}L</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Remaining</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#10b981' }}>₹{remainingCr}Cr</div>
          </div>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ height: '8px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '10px', width: `${spentPercent}%` }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span>Utilized: {spentPercent}%</span>
          <span>Remaining: {(100 - spentPercent).toFixed(1)}%</span>
        </div>
        {gapDetected && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '14px', padding: '0.8rem', marginTop: '1rem', fontSize: '0.8rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-exclamation-circle"></i>
            <strong>FUNDING GAP:</strong> {complaints} complaints unresolved, only ₹{(budget.remaining/100000).toFixed(1)}L left!
          </div>
        )}
        {accountability && (
          <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '14px', padding: '0.8rem', marginTop: '1rem', fontSize: '0.8rem', color: '#854d0e', display: 'flex', gap: '0.5rem' }}>
            <i className="fas fa-question-circle"></i>
            <strong>ACCOUNTABILITY QUESTION:</strong> ₹{remainingCr}Cr unspent — why are {complaints} issues not resolved?
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading civic issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar" style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #dbdbdb', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            <div className="logo" onClick={() => window.location.reload()} style={{ fontSize: '1.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              <i className="fas fa-eye" style={{ color: '#2563eb', marginRight: '4px' }}></i> CivicEye
            </div>
            <div className="nav-icons" style={{ display: 'flex', gap: '1.8rem', fontSize: '1.5rem', color: '#262626' }}>
              <i className="fas fa-home" title="Home"></i>
              <i className="fas fa-compass" title="Explore"></i>
              <i className="fas fa-chart-pie" title="Dashboard"></i>
              <i className="fas fa-bell" title="Notifications"></i>
              <div className="avatar-sm" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'inline-block', cursor: 'pointer' }}></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Stories Row */}
        <div className="stories-wrapper" style={{ background: 'white', borderRadius: '24px', padding: '1.2rem 1.5rem', margin: '1.5rem 0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #efefef' }}>
          <div className="stories" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {categories.map(cat => (
              <div key={cat} className="story" onClick={() => filterByCategory(cat)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '70px' }}>
                <div className="story-ring" style={{ width: '76px', height: '76px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="story-avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2563eb', border: '3px solid white', fontSize: '1.8rem' }}>
                    <i className={`fas fa-${cat === 'Roads' ? 'road' : cat === 'Sanitation' ? 'trash' : cat === 'Street Lights' ? 'lightbulb' : cat === 'Water Supply' ? 'water' : cat === 'Drainage' ? 'drain' : cat === 'Parks' ? 'tree' : cat === 'Electricity' ? 'bolt' : 'bus'}`}></i>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: selectedCategory === cat ? '#2563eb' : '#262626' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed + Sidebar */}
        <div className="feed-wrapper" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          {/* LEFT COLUMN - FEED */}
          <div className="feed-column">
            {/* Create Post CTA */}
            <div className="create-post-card" onClick={() => setShowModal(true)} style={{ background: 'white', borderRadius: '30px', padding: '1.5rem', marginBottom: '2rem', border: '2px dashed #2563eb', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <i className="fas fa-plus-circle" style={{ fontSize: '2.5rem', color: '#2563eb' }}></i>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>Report a civic issue</strong><br />
                <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>Add photo, location and hold officials accountable</span>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.map(post => (
              <div key={post.id} className="post-card" style={{ background: 'white', borderRadius: '24px', marginBottom: '2rem', border: '1px solid #efefef', overflow: 'hidden', transition: 'all 0.3s' }}>
                <div className="post-header" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1.5rem', gap: '0.75rem' }}>
                  <div className="post-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '1.2rem' }}>
                    {post.userInitials || (post.userName?.[0] || 'U')}
                  </div>
                  <div className="post-user">
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#262626' }}>{post.userName}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#8e8e8e' }}>{post.ward} · {post.timeAgo || 'Just now'}</p>
                  </div>
                  <div className="post-category-badge" style={{ marginLeft: 'auto', background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 1.2rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <i className={`fas fa-${post.category === 'Roads' ? 'road' : post.category === 'Sanitation' ? 'trash' : post.category === 'Street Lights' ? 'lightbulb' : post.category === 'Water Supply' ? 'water' : post.category === 'Drainage' ? 'drain' : 'tree'}`}></i> {post.category}
                  </div>
                </div>

                <div className="post-image-container" style={{ width: '100%', height: '500px', overflow: 'hidden', background: '#1a1a1a', position: 'relative' }}>
                  <img src={post.imageUrl} className="post-image" alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="image-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '2rem 1.5rem 1rem', color: 'white' }}>
                    <i className="fas fa-map-marker-alt"></i> {post.overlayLocation || post.location}
                  </div>
                </div>

                <div className="post-location" style={{ padding: '1rem 1.5rem 0', fontSize: '0.9rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <i className="fas fa-location-dot" style={{ color: '#ef4444' }}></i> {post.location}
                </div>

                <BudgetCard department={post.category} ward={post.ward} />

                <div style={{ padding: '0 1.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{post.title}</strong>
                  <p style={{ fontSize: '0.95rem', color: '#374151', marginTop: '0.5rem', lineHeight: '1.6' }}>{post.description}</p>
                </div>

                <div className="post-stats" style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <span>❤️ {post.upvotes?.toLocaleString?.() || 0} likes</span>
                </div>

                <div className="post-actions" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1.5rem', fontSize: '1.6rem', color: '#262626', borderTop: '1px solid #efefef', marginTop: '0.5rem' }}>
                  <i className={`${post.userLiked ? 'fas' : 'far'} fa-heart like-btn`} onClick={() => handleLike(post.id, post.upvotes)} style={{ cursor: 'pointer', color: post.userLiked ? '#ef4444' : '#262626' }}></i>
                  <span className="like-count" style={{ fontSize: '1rem', alignSelf: 'center' }}>{post.upvotes?.toLocaleString?.() || 0}</span>
                  <i className="far fa-comment" style={{ cursor: 'pointer' }}></i><span style={{ fontSize: '1rem', alignSelf: 'center' }}>{post.comments || 0}</span>
                  <i className="far fa-share-square" style={{ cursor: 'pointer' }}></i><span style={{ fontSize: '1rem', alignSelf: 'center' }}>{post.shares || 0}</span>
                  <i className="far fa-bookmark" style={{ marginLeft: 'auto', cursor: 'pointer' }}></i>
                </div>

                <div className="comment-box" style={{ display: 'flex', gap: '0.8rem', padding: '0.8rem 1.5rem 1.5rem' }}>
                  <input type="text" className="comment-input" placeholder="Add a comment..." style={{ flex: 1, border: 'none', background: '#f3f4f6', borderRadius: '40px', padding: '0.8rem 1.2rem', fontSize: '0.9rem' }} />
                  <button className="comment-btn" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>Post</button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="dashboard-side" style={{ background: 'white', borderRadius: '30px', padding: '1.8rem', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', position: 'sticky', top: '80px', height: 'fit-content', border: '1px solid #efefef' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem' }}><i className="fas fa-chart-line" style={{ color: '#2563eb' }}></i> Budget Transparency</h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem' }}>Financial Year 2025-26 · Real-time data</p>
            
            <div className="chart-container" style={{ height: '200px', margin: '1.5rem 0' }}>
              <canvas ref={chartRef} width="300" height="150"></canvas>
            </div>

            <div className="dept-budget-list" style={{ margin: '2rem 0' }}>
              {[
                { name: 'Roads', icon: 'road', budget: '2.3Cr', spent: '30%', trend: 'up' },
                { name: 'Sanitation', icon: 'trash', budget: '1.2Cr', spent: '72%', trend: 'down' },
                { name: 'Lights', icon: 'lightbulb', budget: '0.9Cr', spent: '45%', trend: 'up' },
                { name: 'Water', icon: 'water', budget: '3.1Cr', spent: '55%', trend: 'up' },
                { name: 'Parks', icon: 'tree', budget: '0.6Cr', spent: '20%', trend: 'down' },
                { name: 'Drainage', icon: 'drain', budget: '0.5Cr', spent: '10%', trend: 'up' }
              ].map((dept, idx) => (
                <div key={idx} className="dept-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span className="dept-name" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px' }}><i className={`fas fa-${dept.icon}`} style={{ color: '#2563eb' }}></i> {dept.name}</span>
                  <span style={{ fontWeight: 'bold' }}>₹{dept.budget}</span>
                  <div className="dept-bar" style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '10px', margin: '0 1rem', maxWidth: '120px' }}>
                    <div className="dept-bar-fill" style={{ height: '8px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '10px', width: dept.spent }}></div>
                  </div>
                  <span className={dept.trend === 'up' ? 'trend-up' : 'trend-down'} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: dept.trend === 'up' ? '#10b981' : '#ef4444' }}>{dept.trend === 'up' ? '↑' : '↓'} {dept.spent}</span>
                </div>
              ))}
            </div>

            <div className="funding-alert-card" style={{ background: '#fee2e2', borderRadius: '20px', padding: '1.5rem', margin: '1.5rem 0' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#b91c1c', fontSize: '1.4rem' }}></i>
                <strong style={{ fontSize: '1.1rem' }}>Critical Gaps</strong>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', marginBottom: '1rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>⚠️ <strong>Ward 12 Roads:</strong> 48 complaints, ₹19L remaining</div>
                <div style={{ fontSize: '0.9rem', marginBottom: '1rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>⚠️ <strong>Ward 5 Sanitation:</strong> 63 complaints, budget exhausted</div>
                <div style={{ fontSize: '0.9rem', padding: '0.8rem', background: 'white', borderRadius: '14px' }}>⚠️ <strong>Ward 8 Lights:</strong> 28 complaints, 0 action</div>
              </div>
            </div>

            <div className="accountability-card" style={{ background: 'linear-gradient(135deg, #fef9c3, #fef3c7)', borderRadius: '20px', padding: '1.5rem' }}>
              <i className="fas fa-question-circle" style={{ color: '#854d0e', fontSize: '1.5rem' }}></i>
              <strong style={{ fontSize: '1.1rem', display: 'block', margin: '0.5rem 0' }}>Accountability Check</strong>
              <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>₹1.9Cr unspent in Roads • 48 complaints unresolved</p>
              <p style={{ fontSize: '0.85rem', background: 'white', padding: '1rem', borderRadius: '16px', margin: '1rem 0' }}>"If money exists, why are potholes not fixed?" Tag your councilor below 👇</p>
              <button className="btn" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fas fa-bullhorn"></i> Demand Action</button>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Top Unresolved Wards</h4>
              <div style={{ background: '#f3f4f6', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}><span>Ward 12 (Roads)</span><span style={{ fontWeight: 'bold', color: '#ef4444' }}>42</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}><span>Ward 5 (Sanitation)</span><span style={{ fontWeight: 'bold', color: '#ef4444' }}>63</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ward 8 (Lights)</span><span style={{ fontWeight: 'bold', color: '#ef4444' }}>28</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="footer-text" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '0.9rem', borderTop: '1px solid #efefef', marginTop: '2rem' }}>
        <i className="fas fa-building"></i> CivicEye · Making governance transparent · 10,000+ issues resolved · © 2026
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal active" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ background: 'white', maxWidth: '550px', width: '90%', borderRadius: '40px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '2rem', display: 'flex', gap: '0.8rem' }}><i className="fas fa-plus-circle" style={{ color: '#2563eb' }}></i> Report New Issue</h2>
            
            <form onSubmit={handleSubmitPost}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block', color: '#374151' }}><i className="fas fa-heading"></i> Title</label>
                <input type="text" className="form-control" style={{ width: '100%', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '20px', fontSize: '1rem' }} placeholder="e.g., Broken street light at main crossing" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required />
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block', color: '#374151' }}><i className="fas fa-tag"></i> Category</label>
                <select className="form-control" style={{ width: '100%', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '20px', fontSize: '1rem' }} value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
                  <option>Roads</option>
                  <option>Sanitation</option>
                  <option>Street Lights</option>
                  <option>Water Supply</option>
                  <option>Drainage</option>
                  <option>Parks</option>
                  <option>Electricity</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block', color: '#374151' }}><i className="fas fa-map-pin"></i> Ward</label>
                <select className="form-control" style={{ width: '100%', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '20px', fontSize: '1rem' }} value={newPost.ward} onChange={(e) => setNewPost({...newPost, ward: e.target.value})}>
                  {wards.map(ward => <option key={ward}>{ward}</option>)}
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block', color: '#374151' }}><i className="fas fa-align-left"></i> Description</label>
                <textarea className="form-control" rows="4" style={{ width: '100%', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '20px', fontSize: '1rem' }} placeholder="Describe the problem in detail..." value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} required></textarea>
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block', color: '#374151' }}><i className="fas fa-image"></i> Photo URL (optional)</label>
                <input type="text" className="form-control" style={{ width: '100%', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '20px', fontSize: '1rem' }} placeholder="https://..." value={newPost.imageUrl} onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})} />
                <small style={{ color: '#6b7280', marginTop: '0.3rem', display: 'block' }}>Leave empty for auto-generated image</small>
              </div>
              
              <div className="flex" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '2px solid #2563eb', color: '#2563eb', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn" disabled={submitting} style={{ background: '#2563eb', color: 'white', padding: '1rem 2.5rem', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>{submitting ? 'Posting...' : 'Post Issue'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .post-card {
          animation: fadeIn 0.5s;
        }
        .loading-spinner {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .stories::-webkit-scrollbar {
          height: 4px;
        }
        .stories::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 10px;
        }
        @media (max-width: 968px) {
          .feed-wrapper {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicForumPage;
