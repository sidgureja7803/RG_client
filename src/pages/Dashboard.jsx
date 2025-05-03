import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item xs={12} sm={6} md={4} key={resume.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {resume.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Template: {resume.template}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Modified: {resume.lastModified}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
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