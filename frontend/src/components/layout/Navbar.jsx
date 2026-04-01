import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Forum', href: '/forum' },
    { name: 'Budget', href: '/budget' },
    { name: 'Map', href: '/map' },
  ];

  const getDashboardLink = () => {
    if (userRole === 'citizen') return '/citizen';
    if (userRole === 'official') return '/official';
    if (userRole === 'admin') return '/admin';
    return '/';
  };

  const getRoleBadge = () => {
    if (userRole === 'citizen') return 'bg-green-100 text-green-700';
    if (userRole === 'official') return 'bg-blue-100 text-blue-700';
    if (userRole === 'admin') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = () => {
    if (userRole === 'citizen') return '👤';
    if (userRole === 'official') return '🏛️';
    if (userRole === 'admin') return '👑';
    return '🔑';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">CivicLens</span>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Beta</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-gray-600 hover:text-primary-600 transition">
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="text-gray-600 hover:text-primary-600">
                  <BellIcon className="w-5 h-5" />
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=2563eb&color=fff`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700">{user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge()}`}>
                      {getRoleIcon()} {userRole}
                    </span>
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={getDashboardLink()}
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-gray-700`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-red-600`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-gray-600 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-primary-600 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
