import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates');
        setTemplates(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch templates');
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleUseTemplate = async (templateId) => {
    try {
      // Create a new resume with the selected template
      const response = await axios.post('/api/resumes', {
        templateId,
      });
      
      // Navigate to the resume editor with the new resume
      navigate(`/resume/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create resume from template');
    }
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
      <Typography variant="h4" component="h1" gutterBottom>
        Resume Templates
      </Typography>
      <Typography color="textSecondary" paragraph>
        Choose from our professionally designed templates to create your perfect resume
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid item key={template._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={template.preview}
                alt={template.name}
                sx={{ objectFit: 'contain', bgcolor: 'background.paper' }}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {template.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {template.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Used {template.usageCount} times
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleUseTemplate(template._id)}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {templates.length === 0 && !error && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No templates available at the moment
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Templates; 