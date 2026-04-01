const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req, res) => {
  const { method, body, query } = req;
  const path = req.path.split('/');
  const id = path[1];
  
  try {
    // GET all complaints
    if (method === 'GET' && !id) {
      let complaintsQuery = db.collection('complaints');
      
      // Apply filters
      if (query.status) complaintsQuery = complaintsQuery.where('status', '==', query.status);
      if (query.department) complaintsQuery = complaintsQuery.where('ministryId', '==', query.department);
      if (query.category) complaintsQuery = complaintsQuery.where('category', '==', query.category);
      
      complaintsQuery = complaintsQuery.orderBy('createdAt', 'desc').limit(parseInt(query.limit) || 50);
      
      const snapshot = await complaintsQuery.get();
      const complaints = [];
      snapshot.forEach(doc => complaints.push({ id: doc.id, ...doc.data() }));
      
      res.json(complaints);
    }
    
    // GET single complaint
    else if (method === 'GET' && id && !path[2]) {
      const complaintDoc = await db.collection('complaints').doc(id).get();
      
      if (!complaintDoc.exists) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      
      res.json({ id: complaintDoc.id, ...complaintDoc.data() });
    }
    
    // POST new complaint
    else if (method === 'POST' && !id) {
      const { userId, userName, title, description, category, ministryId, location, imageUrl } = body;
      
      const newComplaint = {
        userId,
        userName,
        title,
        description,
        category,
        ministryId,
        location: location || null,
        imageUrl: imageUrl || null,
        status: 'pending',
        priority: 0,
        upvotes: 0,
        upvotedBy: [],
        aiConfidence: 0.85,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('complaints').add(newComplaint);
      res.status(201).json({ id: docRef.id, ...newComplaint });
    }
    
    // UPDATE complaint status
    else if (method === 'PUT' && id && path[2] === 'status') {
      const { status, note } = body;
      
      const updates = {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      if (status === 'resolved') {
        updates.resolvedAt = admin.firestore.FieldValue.serverTimestamp();
        updates.resolutionNote = note;
      }
      
      await db.collection('complaints').doc(id).update(updates);
      res.json({ success: true, message: `Status updated to ${status}` });
    }
    
    // UPVOTE complaint
    else if (method === 'POST' && id && path[2] === 'upvote') {
      const { userId } = body;
      const complaintRef = db.collection('complaints').doc(id);
      const complaint = await complaintRef.get();
      
      if (!complaint.exists) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      
      const data = complaint.data();
      const hasUpvoted = data.upvotedBy?.includes(userId);
      
      if (hasUpvoted) {
        await complaintRef.update({
          upvotes: admin.firestore.FieldValue.increment(-1),
          upvotedBy: admin.firestore.FieldValue.arrayRemove(userId)
        });
      } else {
        await complaintRef.update({
          upvotes: admin.firestore.FieldValue.increment(1),
          upvotedBy: admin.firestore.FieldValue.arrayUnion(userId)
        });
        
        // Update priority based on new upvotes
        const newUpvotes = (data.upvotes || 0) + 1;
        let priority = 0;
        if (newUpvotes >= 100) priority = 3;
        else if (newUpvotes >= 50) priority = 2;
        else if (newUpvotes >= 20) priority = 1;
        
        await complaintRef.update({ priority });
      }
      
      res.json({ success: true });
    }
    
    // GET complaints by user
    else if (method === 'GET' && !id && query.userId) {
      const snapshot = await db.collection('complaints')
        .where('userId', '==', query.userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const complaints = [];
      snapshot.forEach(doc => complaints.push({ id: doc.id, ...doc.data() }));
      res.json(complaints);
    }
    
    // GET complaints by department
    else if (method === 'GET' && path[0] === 'department') {
      const department = path[1];
      const snapshot = await db.collection('complaints')
        .where('ministryId', '==', department)
        .orderBy('upvotes', 'desc')
        .get();
      
      const complaints = [];
      snapshot.forEach(doc => complaints.push({ id: doc.id, ...doc.data() }));
      res.json(complaints);
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Complaints error:', error);
    res.status(500).json({ error: error.message });
  }
};