import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from '../hooks/useNotification';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotification(user?.uid);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const lastNotification = notifications[0];
    if (lastNotification && !lastNotification.read && lastNotification.createdAt) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5"><div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"><span className="text-lg">🔔</span></div></div>
              <div className="ml-3 flex-1"><p className="text-sm font-medium text-gray-900">{lastNotification.title}</p><p className="mt-1 text-sm text-gray-500">{lastNotification.body}</p></div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button onClick={() => { markAsRead(lastNotification.id); toast.dismiss(t.id); }} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500">
              Mark Read
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, showNotifications, setShowNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};