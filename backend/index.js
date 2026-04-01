










const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const db = admin.firestore();

// Import function handlers
const authHandler = require('./functions/auth');
const complaintsHandler = require('./functions/complaints');
const forumHandler = require('./functions/forum');
const adminHandler = require('./functions/admin');
const notificationsHandler = require('./functions/notifications');
const aiHandler = require('./functions/ai-classify');
const budgetHandler = require('./functions/budget');

// Express-like routing
const handleRequest = (handler) => async (req, res) => {
  cors(req, res, async () => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// API Routes
exports.auth = functions.https.onRequest(handleRequest(authHandler));
exports.complaints = functions.https.onRequest(handleRequest(complaintsHandler));
exports.forum = functions.https.onRequest(handleRequest(forumHandler));
exports.admin = functions.https.onRequest(handleRequest(adminHandler));
exports.notifications = functions.https.onRequest(handleRequest(notificationsHandler));
exports.ai = functions.https.onRequest(handleRequest(aiHandler));
exports.budget = functions.https.onRequest(handleRequest(budgetHandler));

// ==================== TRIGGERS ====================

// When a new complaint is created
exports.onComplaintCreated = functions.firestore
  .document('complaints/{complaintId}')
  .onCreate(async (snap, context) => {
    const complaint = snap.data();
    
    // Update user stats
    const userRef = db.collection('users').doc(complaint.userId);
    await userRef.update({
      'stats.complaintsFiled': admin.firestore.FieldValue.increment(1)
    });
    
    // Send notification to department officials
    const officials = await db.collection('users')
      .where('role', '==', 'official')
      .where('department', '==', complaint.ministryId)
      .get();
    
    const notifications = [];
    officials.forEach(doc => {
      notifications.push({
        userId: doc.id,
        title: 'New Complaint Assigned',
        body: `${complaint.title} - Needs attention`,
        type: 'complaint_assigned',
        data: { complaintId: complaint.id },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    if (notifications.length > 0) {
      const batch = db.batch();
      notifications.forEach(notif => {
        const notifRef = db.collection('notifications').doc();
        batch.set(notifRef, notif);
      });
      await batch.commit();
    }
    
    return null;
  });

// When complaint status changes
exports.onComplaintStatusChanged = functions.firestore
  .document('complaints/{complaintId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.status !== after.status) {
      // Notify citizen
      await db.collection('notifications').add({
        userId: after.userId,
        title: 'Complaint Status Updated',
        body: `Your complaint "${after.title}" is now ${after.status}`,
        type: 'status_update',
        data: { complaintId: after.id, status: after.status },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // If resolved, update user stats
      if (after.status === 'resolved') {
        const userRef = db.collection('users').doc(after.userId);
        await userRef.update({
          'stats.complaintsResolved': admin.firestore.FieldValue.increment(1)
        });
      }
    }
    
    return null;
  });

// When a new forum post is created
exports.onForumPostCreated = functions.firestore
  .document('forum_posts/{postId}')
  .onCreate(async (snap, context) => {
    const post = snap.data();
    
    // Update user stats
    const userRef = db.collection('users').doc(post.userId);
    await userRef.update({
      'stats.forumPosts': admin.firestore.FieldValue.increment(1)
    });
    
    return null;
  });