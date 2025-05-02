import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('/api/resumes');
        setResumes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch resumes');
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleCreateResume = () => {
    navigate('/resume/new');
  };

  const handleEditResume = (id) => {
    navigate(`/resume/${id}`);
  };

  const handleDeleteResume = async (id) => {
    try {
      await axios.delete(`/api/resumes/${id}`);
      setResumes(resumes.filter(resume => resume._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleShareResume = async (id) => {
    // Implement share functionality
    console.log('Share resume:', id);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.username}!
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateResume}
        >
          Create New Resume
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item xs={12} sm={6} md={4} key={resume._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" noWrap>
                  {resume.title || 'Untitled Resume'}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Last modified: {new Date(resume.updatedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Template: {resume.template || 'Default'}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditResume(resume._id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton 
                    size="small"
                    onClick={() => handleShareResume(resume._id)}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteResume(resume._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {resumes.length === 0 && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 4,
                bgcolor: 'background.paper',
                borderRadius: 1
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                You haven't created any resumes yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateResume}
                sx={{ mt: 2 }}
              >
                Create Your First Resume
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard; 