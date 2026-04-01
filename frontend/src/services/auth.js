import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export const authService = {
  getProfile: async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updateProfile: async (userId, data) => {
    await updateDoc(doc(db, 'users', userId), { ...data, updatedAt: new Date() });
  },
  
  createProfile: async (userId, data) => {
    await setDoc(doc(db, 'users', userId), { ...data, createdAt: new Date(), stats: { complaintsFiled: 0, complaintsResolved: 0, forumPosts: 0 } });
  }
};