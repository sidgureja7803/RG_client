import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getResumes, deleteResume } from '../services/resumeService';
import { formatDate } from '../utils/dateUtils';
import { FileText, Plus, Edit, Trash2, BarChart } from 'lucide-react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, Paper } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const data = await getResumes();
        setResumes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load your resumes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleCreateResume = () => {
    navigate('/templates');
  };

  const handleEditResume = (id) => {
    navigate(`/resume-editor/${id}`);
  };

  const handleAnalyzeResume = (id) => {
    navigate(`/analyzer/${id}`);
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        setResumes(resumes.filter(resume => resume._id !== id));
      } catch (err) {
        console.error('Error deleting resume:', err);
        alert('Failed to delete the resume. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page loading">
        <div className="spinner"></div>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName || 'User'}</h1>
        <p>Manage your resumes and track your applications</p>
      </div>

      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={handleCreateResume}>
          <Plus size={18} />
          Create New Resume
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      <div className="resume-section">
        <h2>Your Resumes</h2>
        
        {resumes.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No resumes yet</h3>
            <p>Create your first resume to get started on your job search journey</p>
            <button className="btn btn-primary" onClick={handleCreateResume}>
              Create Resume
            </button>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map(resume => (
              <div key={resume._id} className="resume-card">
                <div className="resume-icon">
                  <FileText size={24} />
                </div>
                <div className="resume-info">
                  <h3>{resume.title}</h3>
                  <p className="resume-date">Last updated: {formatDate(resume.updatedAt)}</p>
                </div>
                <div className="resume-actions">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEditResume(resume._id)}
                    title="Edit Resume"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="action-btn analyze-btn" 
                    onClick={() => handleAnalyzeResume(resume._id)}
                    title="Analyze Resume"
                  >
                    <BarChart size={18} />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDeleteResume(resume._id)}
                    title="Delete Resume"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-tips">
        <h3>Tips for Success</h3>
        <ul>
          <li>Tailor your resume for each job application</li>
          <li>Use the Resume Analyzer to optimize for ATS systems</li>
          <li>Include quantifiable achievements</li>
          <li>Update your resume regularly with new skills and experiences</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard; 