import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const notificationsService = {
  getUserNotifications: async (userId, limitCount = 50) => {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  markAsRead: async (notificationId) => {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true, readAt: new Date() });
  },
  
  markAllAsRead: async (userId) => {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(doc => updateDoc(doc.ref, { read: true, readAt: new Date() }));
    await Promise.all(promises);
  },
  
  deleteNotification: async (notificationId) => {
    await deleteDoc(doc(db, 'notifications', notificationId));
  },
  
  getUnreadCount: async (userId) => {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
};