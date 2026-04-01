import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      let unread = 0;
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        items.push(data);
        if (!data.read) unread++;
      });
      setNotifications(items);
      setUnreadCount(unread);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userId]);
  
  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    const promises = unreadNotifications.map(n => markAsRead(n.id));
    await Promise.all(promises);
  };
  
  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};