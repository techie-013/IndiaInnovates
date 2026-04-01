import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'citizen', label: 'Citizen', icon: '👤', color: 'blue', dashboard: '/citizen' },
    { value: 'official', label: 'Department Official', icon: '🏛️', color: 'green', dashboard: '/official' },
    { value: 'admin', label: 'Administrator', icon: '👑', color: 'purple', dashboard: '/admin' }
  ];

  // Check if already logged in
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      if (userRole === 'citizen') navigate('/citizen');
      else if (userRole === 'official') navigate('/official');
      else if (userRole === 'admin') navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }
    setLoading(true);
    try {
      const { role, department } = await loginWithEmail(email, password, selectedRole);
      
      // Redirect based on role
      if (role === 'citizen') {
        navigate('/citizen');
      } else if (role === 'official') {
        navigate('/official');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error already handled in loginWithEmail
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">CivicLens</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`py-3 rounded-xl border-2 transition-all ${
                    selectedRole === role.value
                      ? `border-${role.color}-500 bg-${role.color}-50 text-${role.color}-700`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="text-xs font-medium">{role.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !selectedRole}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">Test Accounts:</p>
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-gray-600">👤 Citizen: citizen@civiclens.com / citizen123</p>
            <p className="text-gray-600">🏛️ Roads Official: roads@civiclens.com / official123</p>
            <p className="text-gray-600">👑 Admin: admin@civiclens.com / admin123</p>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
