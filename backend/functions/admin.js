const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req, res) => {
  const { method, body, query } = req;
  const path = req.path.split('/');
  const id = path[1];
  
  try {
    // GET platform stats
    if (method === 'GET' && path[0] === 'stats') {
      const usersSnapshot = await db.collection('users').get();
      const complaintsSnapshot = await db.collection('complaints').get();
      const forumSnapshot = await db.collection('forum_posts').get();
      
      const complaints = [];
      complaintsSnapshot.forEach(doc => complaints.push(doc.data()));
      
      const resolved = complaints.filter(c => c.status === 'resolved').length;
      const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);
      
      const complaintsByStatus = {};
      const complaintsByDepartment = {};
      complaints.forEach(c => {
        complaintsByStatus[c.status] = (complaintsByStatus[c.status] || 0) + 1;
        complaintsByDepartment[c.ministryId] = (complaintsByDepartment[c.ministryId] || 0) + 1;
      });
      
      res.json({
        totalUsers: usersSnapshot.size,
        totalComplaints: complaintsSnapshot.size,
        resolvedComplaints: resolved,
        resolutionRate: complaintsSnapshot.size > 0 
          ? ((resolved / complaintsSnapshot.size) * 100).toFixed(1) 
          : 0,
        totalForumPosts: forumSnapshot.size,
        totalUpvotes,
        complaintsByStatus,
        complaintsByDepartment
      });
    }
    
    // GET all users
    else if (method === 'GET' && path[0] === 'users') {
      const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
      const users = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      res.json(users);
    }
    
    // UPDATE user role
    else if (method === 'PUT' && path[0] === 'users' && path[2] === 'role') {
      const { role, department } = body;
      
      await db.collection('users').doc(id).update({
        role,
        department: department || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, message: 'User role updated' });
    }
    
    // DELETE user
    else if (method === 'DELETE' && path[0] === 'users') {
      // Delete user's complaints
      const complaintsSnapshot = await db.collection('complaints')
        .where('userId', '==', id)
        .get();
      complaintsSnapshot.forEach(doc => doc.ref.delete());
      
      // Delete user's forum posts
      const postsSnapshot = await db.collection('forum_posts')
        .where('userId', '==', id)
        .get();
      postsSnapshot.forEach(doc => doc.ref.delete());
      
      // Delete user document
      await db.collection('users').doc(id).delete();
      
      res.json({ success: true, message: 'User deleted' });
    }
    
    // DELETE complaint
    else if (method === 'DELETE' && path[0] === 'complaints') {
      await db.collection('complaints').doc(id).delete();
      res.json({ success: true, message: 'Complaint deleted' });
    }
    
    // DELETE forum post
    else if (method === 'DELETE' && path[0] === 'posts') {
      await db.collection('forum_posts').doc(id).delete();
      res.json({ success: true, message: 'Forum post deleted' });
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Admin error:', error);
    res.status(500).json({ error: error.message });
  }
};