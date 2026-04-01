import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export const complaintsService = {
  getAll: async (filters = {}) => {
    let q = collection(db, 'complaints');
    if (filters.status) q = query(q, where('status', '==', filters.status));
    if (filters.department) q = query(q, where('ministryId', '==', filters.department));
    q = query(q, orderBy('upvotes', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getById: async (id) => {
    const docRef = doc(db, 'complaints', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  create: async (data) => {
    const docRef = await addDoc(collection(db, 'complaints'), { ...data, createdAt: new Date(), upvotes: 0, upvotedBy: [] });
    return { id: docRef.id, ...data };
  },
  
  updateStatus: async (id, status, note) => {
    await updateDoc(doc(db, 'complaints', id), { status, ...(status === 'resolved' && { resolvedAt: new Date(), resolutionNote: note }), updatedAt: new Date() });
  },
  
  upvote: async (id, userId) => {
    const docRef = doc(db, 'complaints', id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const hasUpvoted = data.upvotedBy?.includes(userId);
    await updateDoc(docRef, { upvotes: hasUpvoted ? data.upvotes - 1 : data.upvotes + 1, upvotedBy: hasUpvoted ? data.upvotedBy.filter(uid => uid !== userId) : [...(data.upvotedBy || []), userId] });
    return !hasUpvoted;
  },
  
  getUserComplaints: async (userId) => {
    const q = query(collection(db, 'complaints'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};