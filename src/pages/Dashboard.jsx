import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getResumes, deleteResume } from '../services/resumeService';
import { formatDate } from '../utils/dateUtils';
import { FileText, Plus, Edit, Trash2, BarChart, User, Settings, FileType, Upload, HelpCircle, Star } from 'lucide-react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
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

    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

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
        setError('Failed to delete the resume. Please try again.');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const quickAccessItems = [
    { 
      title: 'Create Resume', 
      icon: <Plus size={24} />, 
      description: 'Create a new resume from scratch',
      link: '/templates',
      color: '#4f46e5'
    },
    { 
      title: 'AI Resume Analysis', 
      icon: <BarChart size={24} />, 
      description: 'Match your resume to job descriptions',
      link: '/analyzer',
      color: '#16a34a'
    },
    { 
      title: 'Profile Settings', 
      icon: <User size={24} />, 
      description: 'Manage your account settings',
      link: '/profile',
      color: '#ea580c'
    },
    { 
      title: 'Help Center', 
      icon: <HelpCircle size={24} />, 
      description: 'Get tips and assistance',
      link: '/guides',
      color: '#0ea5e9'
    }
  ];

  // Add admin panel only for admin users
  if (user?.role === 'admin') {
    quickAccessItems.push({
      title: 'Admin Panel', 
      icon: <Settings size={24} />, 
      description: 'Manage site settings and users',
      link: '/admin',
      color: '#6b21a8'
    });
    
    quickAccessItems.push({
      title: 'Manage Templates', 
      icon: <FileType size={24} />, 
      description: 'Create and edit resume templates',
      link: '/admin/templates',
      color: '#c026d3'
    });
  }

  const renderResumesTab = () => {
    if (resumes.length === 0) {
      return (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'background.default'
          }}
        >
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No resumes yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first resume to get started on your job search journey
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateResume}
          >
            Create Resume
          </Button>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {resumes.map(resume => (
          <Grid item xs={12} sm={6} md={4} key={resume._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <FileText size={24} style={{ marginRight: '12px' }} />
                  <Typography variant="h6" component="h3" noWrap>
                    {resume.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last updated: {formatDate(resume.updatedAt)}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton
                    onClick={() => handleEditResume(resume._id)}
                    title="Edit Resume"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleAnalyzeResume(resume._id)}
                    title="Analyze Resume"
                    color="primary"
                  >
                    <BarChart />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteResume(resume._id)}
                    title="Delete Resume"
                    color="error"
                  >
                    <Trash2 />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderProfileTab = () => {
    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={user?.avatar || ''} 
              alt={`${user?.firstName} ${user?.lastName}`}
              sx={{ width: 80, height: 80, mr: 3 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
              {user?.role === 'admin' && (
                <Chip 
                  label="Admin" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/profile"
            startIcon={<Edit />}
          >
            Edit Profile
          </Button>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          {quickAccessItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  borderTop: `4px solid ${item.color}`,
                  '&:hover': {
                    boxShadow: 3,
                  }
                }}
                onClick={() => navigate(item.link)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box 
                      sx={{ 
                        color: 'white', 
                        p: 1, 
                        borderRadius: 1,
                        backgroundColor: item.color,
                        mr: 2
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6">
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your resumes and career resources
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        centered
      >
        <Tab label="My Resumes" />
        <Tab label="Profile & Settings" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Box mb={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus />}
              onClick={handleCreateResume}
              size="large"
            >
              Create New Resume
            </Button>
          </Box>
          {renderResumesTab()}
        </>
      )}

      {activeTab === 1 && renderProfileTab()}

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tips for Success
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              • Tailor your resume for each job application
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              • Use the Resume Analyzer to optimize for ATS systems
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              • Include quantifiable achievements
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              • Update your resume regularly
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard; 