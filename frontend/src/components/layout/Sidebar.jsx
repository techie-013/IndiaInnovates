import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiX, HiHome, HiChat, HiDocumentText, HiChartBar, HiUser, HiBell, HiCog } from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { userRole } = useAuth();

  const navItems = [
    { path: '/', icon: HiHome, label: 'Home', roles: ['citizen', 'official', 'admin'] },
    { path: '/forum', icon: HiChat, label: 'Forum', roles: ['citizen', 'official', 'admin'] },
    { path: '/citizen', icon: HiDocumentText, label: 'My Complaints', roles: ['citizen'] },
    { path: '/official', icon: HiChartBar, label: 'Dashboard', roles: ['official', 'admin'] },
    { path: '/admin', icon: HiCog, label: 'Admin Panel', roles: ['admin'] },
    { path: '/budget', icon: HiChartBar, label: 'Budget', roles: ['citizen', 'official', 'admin'] },
    { path: '/profile', icon: HiUser, label: 'Profile', roles: ['citizen', 'official', 'admin'] },
    { path: '/notifications', icon: HiBell, label: 'Notifications', roles: ['citizen', 'official', 'admin'] }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out z-50 w-64 bg-white shadow-lg`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-xl font-bold text-primary-600">CivicLens</Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;