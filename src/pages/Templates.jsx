import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';

const Templates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Modern',
      description: 'Clean and contemporary design with a focus on visual hierarchy.',
      image: '/templates/modern.png',
      features: [
        'Minimalist layout',
        'Professional typography',
        'Skills progress bars',
        'Timeline experience section'
      ]
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Traditional layout perfect for corporate and executive positions.',
      image: '/templates/professional.png',
      features: [
        'Classic two-column design',
        'Detailed contact section',
        'Achievement highlights',
        'Education focus'
      ]
    },
    {
      id: 3,
      name: 'Creative',
      description: 'Unique design for creative professionals and designers.',
      image: '/templates/creative.png',
      features: [
        'Portfolio section',
        'Custom skill visualization',
        'Project highlights',
        'Personal branding elements'
      ]
    },
    {
      id: 4,
      name: 'Minimal',
      description: 'Simple and elegant design that lets your content shine.',
      image: '/templates/minimal.png',
      features: [
        'Clean layout',
        'Easy to read',
        'ATS-friendly',
        'Customizable sections'
      ]
    },
  ];

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleSelectTemplate = (templateId) => {
    if (isAuthenticated) {
      navigate(`/editor?template=${templateId}`);
    } else {
      setError('Please sign in to use this template');
      setTimeout(() => {
        navigate('/register', { state: { redirectTo: `/editor?template=${templateId}` } });
      }, 2000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Choose Your Template
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select from our professionally designed templates to create your perfect resume.
        Each template is optimized for ATS and crafted to highlight your strengths.
      </Typography>

      {!isAuthenticated && (
        <Box sx={{ mb: 4, p: 3, bgcolor: theme.palette.primary.light, borderRadius: 2 }}>
          <Typography variant="h6" color="white" gutterBottom>
            Get Started for Free
          </Typography>
          <Typography variant="body1" color="white" paragraph>
            Create an account to use these templates and unlock premium features!
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/register')}
            sx={{ mt: 1 }}
          >
            Sign Up Now
          </Button>
        </Box>
      )}

      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => handleTemplateClick(template)}
            >
              <CardMedia
                component="img"
                height="240"
                image={template.image}
                alt={template.name}
                sx={{
                  objectFit: 'cover',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        {selectedTemplate && (
          <>
            <DialogTitle>{selectedTemplate.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <img
                  src={selectedTemplate.image}
                  alt={selectedTemplate.name}
                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {selectedTemplate.features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="body2" color="text.secondary">
                      • {feature}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="body1" paragraph>
                {selectedTemplate.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreview}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => handleSelectTemplate(selectedTemplate.id)}
                color="primary"
              >
                Use This Template
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="info" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Templates; 