const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req, res) => {
  const { method, body, query } = req;
  const path = req.path.split('/');
  const userId = path[0];
  const id = path[1];
  
  try {
    // GET user notifications
    if (method === 'GET' && userId) {
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      const notifications = [];
      snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
      res.json(notifications);
    }
    
    // MARK notification as read
    else if (method === 'PUT' && id && path[2] === 'read') {
      await db.collection('notifications').doc(id).update({
        read: true,
        readAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ success: true });
    }
    
    // MARK all as read
    else if (method === 'PUT' && userId && path[1] === 'read-all') {
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();
      
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, { read: true, readAt: admin.firestore.FieldValue.serverTimestamp() });
      });
      await batch.commit();
      
      res.json({ success: true, count: snapshot.size });
    }
    
    // DELETE notification
    else if (method === 'DELETE' && id) {
      await db.collection('notifications').doc(id).delete();
      res.json({ success: true });
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: error.message });
  }
};