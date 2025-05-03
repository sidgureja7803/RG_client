import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Dashboard = () => {
  const navigate = useNavigate();

  const resumes = [
    {
      id: 1,
      title: 'Software Engineer Resume',
      lastModified: '2024-02-15',
      template: 'Modern'
    },
    {
      id: 2,
      title: 'Product Manager Resume',
      lastModified: '2024-02-14',
      template: 'Professional'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Resumes
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/templates')}
        >
          Create New Resume
        </Button>
      </Box>

      {/* Feature Promotion */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 3, 
          background: 'linear-gradient(90deg, #e0f7fa, #e8f5e9)', 
          borderRadius: 3,
          border: '1px solid #b2dfdb'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <NewReleasesIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" color="primary.main">
                New Feature: AI Resume Analyzer
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Optimize your resume for specific job descriptions with our new AI-powered Resume Analyzer. 
              Get instant feedback on keyword matches, ATS compatibility, and personalized recommendations.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/resume-analyzer')}
            >
              Try Resume Analyzer
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: '200px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                p: 2
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" gutterBottom>
                  75%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average Match Score
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumes Grid */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Your Resumes
      </Typography>
      
      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item xs={12} sm={6} md={4} key={resume.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {resume.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last modified: {resume.lastModified}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Template: {resume.template}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/editor/${resume.id}`)}
                >
                  Edit Resume
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 