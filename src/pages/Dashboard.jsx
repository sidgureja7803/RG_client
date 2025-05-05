import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getResumes, deleteResume } from '../services/resumeService';
import { formatDate } from '../utils/dateUtils';
import { FileText, Plus, Edit, Trash2, BarChart } from 'lucide-react';
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
  IconButton
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
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
          Manage your resumes and track your applications
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box mb={4}>
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

      <Typography variant="h5" component="h2" gutterBottom>
        Your Resumes
      </Typography>

      {resumes.length === 0 ? (
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
      ) : (
        <Grid container spacing={3}>
          {resumes.map(resume => (
            <Grid item xs={12} sm={6} md={4} key={resume._id}>
              <Card>
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
      )}

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