import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEye, FaComments, FaRocket, FaShieldAlt, FaChartLine, FaUsers, 
  FaBuilding, FaUserShield, FaCheckCircle, FaArrowRight, FaGlobe,
  FaMobile, FaCloud, FaLock, FaGithub, FaTwitter, FaLinkedin,
  FaUser, FaTachometerAlt, FaClipboardList
} from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  const dashboards = [
    { name: 'Citizen Dashboard', icon: FaUser, path: '/dashboard', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', description: 'Report issues, track complaints' },
    { name: 'Department Dashboard', icon: FaBuilding, path: '/department-dashboard', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', description: 'Manage and resolve complaints' },
    { name: 'Admin Dashboard', icon: FaUserShield, path: '/admin-dashboard', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', description: 'Full platform management' },
    { name: 'Public Forum', icon: FaComments, path: '/forum', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', description: 'Live community discussions' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <FaEye className="text-3xl text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CivicEye
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/forum')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Public Forum
              </button>
              <button
                onClick={() => navigate('/get-started')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
              <FaRocket className="text-blue-600" />
              <span>Making Governance Transparent</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Report Issues. <br />
              Track Progress. <br />
              Drive Change.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens holding officials accountable. 
              Your voice matters — report civic issues and track resolutions in real-time.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
              >
                Citizen Dashboard <FaArrowRight />
              </button>
              <button
                onClick={() => navigate('/department-dashboard')}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition shadow-lg flex items-center gap-2"
              >
                Department Dashboard <FaArrowRight />
              </button>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-lg flex items-center gap-2"
              >
                Admin Dashboard <FaArrowRight />
              </button>
              <button
                onClick={() => navigate('/forum')}
                className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-full font-semibold hover:bg-orange-50 transition flex items-center gap-2"
              >
                Public Forum <FaComments />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access Dashboards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboards.map((dashboard, idx) => {
              const Icon = dashboard.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(dashboard.path)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden text-left"
                >
                  <div className={`h-2 bg-gradient-to-r ${dashboard.color}`}></div>
                  <div className="p-6">
                    <div className={`w-14 h-14 ${dashboard.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <Icon className={`text-2xl ${dashboard.color.replace('from-', 'text-').split(' ')[0]}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{dashboard.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{dashboard.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:gap-3 transition-all">
                      Access Dashboard <FaArrowRight className="text-xs" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl font-bold text-blue-600">10,000+</div><div className="text-gray-600 mt-2">Issues Resolved</div></div>
            <div><div className="text-3xl font-bold text-blue-600">50+</div><div className="text-gray-600 mt-2">Cities Covered</div></div>
            <div><div className="text-3xl font-bold text-blue-600">95%</div><div className="text-gray-600 mt-2">Satisfaction Rate</div></div>
            <div><div className="text-3xl font-bold text-blue-600">24/7</div><div className="text-gray-600 mt-2">Real-time Updates</div></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div><div className="flex items-center gap-2 mb-4"><FaEye className="text-2xl text-blue-400" /><span className="text-xl font-bold">CivicEye</span></div><p className="text-gray-400 text-sm">Making governance transparent and accountable.</p></div>
            <div><h4 className="font-semibold mb-4">Quick Links</h4><ul className="space-y-2 text-gray-400 text-sm"><li><button onClick={() => navigate('/dashboard')} className="hover:text-white">Citizen Dashboard</button></li><li><button onClick={() => navigate('/department-dashboard')} className="hover:text-white">Department Dashboard</button></li><li><button onClick={() => navigate('/admin-dashboard')} className="hover:text-white">Admin Dashboard</button></li><li><button onClick={() => navigate('/forum')} className="hover:text-white">Public Forum</button></li></ul></div>
            <div><h4 className="font-semibold mb-4">Legal</h4><ul className="space-y-2 text-gray-400 text-sm"><li><button className="hover:text-white">Privacy Policy</button></li><li><button className="hover:text-white">Terms of Service</button></li></ul></div>
            <div><h4 className="font-semibold mb-4">Follow Us</h4><div className="flex gap-4"><FaTwitter className="text-xl cursor-pointer hover:text-blue-400" /><FaLinkedin className="text-xl cursor-pointer hover:text-blue-400" /><FaGithub className="text-xl cursor-pointer hover:text-gray-400" /></div></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">© 2026 CivicEye. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
