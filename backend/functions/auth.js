const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req, res) => {
  const { method, body, query } = req;
  const path = req.path.split('/')[1];
  
  try {
    // Register new user
    if (method === 'POST' && path === 'register') {
      const { name, email, password, role, department } = body;
      
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name
      });
      
      // Create user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        name,
        email,
        role: role || 'citizen',
        department: department || null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        stats: {
          complaintsFiled: 0,
          complaintsResolved: 0,
          upvotesReceived: 0,
          forumPosts: 0
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: { uid: userRecord.uid, name, email, role: role || 'citizen' }
      });
    }
    
    // Get user profile
    else if (method === 'GET' && path === 'profile') {
      const userId = query.userId;
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(userDoc.data());
    }
    
    // Update user profile
    else if (method === 'PUT' && path === 'profile') {
      const { userId, updates } = body;
      
      await db.collection('users').doc(userId).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, message: 'Profile updated' });
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
};