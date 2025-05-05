import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Templates from '../pages/Templates';
import ResumeEditor from '../pages/ResumeEditor';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Blog from '../pages/Blog';
import ResumeGuides from '../pages/ResumeGuides';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import NotFound from '../pages/NotFound';
import OAuthCallback from '../pages/OAuthCallback';
import ResumeAnalyzerPage from '../pages/ResumeAnalyzerPage';
import ResumeAnalyzer from '../pages/ResumeAnalyzer';
import TemplateManager from '../pages/admin/TemplateManager';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/guides" element={<ResumeGuides />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/resume-editor/:resumeId" element={<ResumeEditor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analyzer/:resumeId" element={<ResumeAnalyzerPage />} />
        <Route path="/analyzer" element={<ResumeAnalyzer />} />
        
        {/* Admin Routes */}
        <Route path="/admin/templates" element={<TemplateManager />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 