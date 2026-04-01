import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiHome, HiChat, HiDocumentText, HiUser, HiBell } from 'react-icons/hi';

const MobileNav = () => {
  const location = useLocation();
  const { user, userRole } = useAuth();

  const getDashboardPath = () => {
    if (userRole === 'citizen') return '/citizen';
    if (userRole === 'official') return '/official';
    if (userRole === 'admin') return '/admin';
    return '/';
  };

  const navItems = [
    { path: '/', icon: HiHome, label: 'Home' },
    { path: '/forum', icon: HiChat, label: 'Forum' },
    { path: getDashboardPath(), icon: HiDocumentText, label: 'Dashboard' },
    { path: '/notifications', icon: HiBell, label: 'Alerts' },
    { path: '/profile', icon: HiUser, label: 'Profile' }
  ];

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-4 py-1 rounded-lg transition ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;