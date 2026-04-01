import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import DashboardLinks from './pages/DashboardLinks';
import PublicForumPage from './pages/PublicForumPage';
import CitizenDashboard from './pages/CitizenDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/dashboards" element={<DashboardLinks />} />
          
          {/* All Dashboards */}
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/department-dashboard" element={<DepartmentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/forum" element={<PublicForumPage />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
