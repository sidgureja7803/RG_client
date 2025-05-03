import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      name: 'Modern',
      description: 'Clean and contemporary design with a focus on visual hierarchy.',
      image: '/templates/modern.png',
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Traditional layout perfect for corporate and executive positions.',
      image: '/templates/professional.png',
    },
    {
      id: 3,
      name: 'Creative',
      description: 'Unique design for creative professionals and designers.',
      image: '/templates/creative.png',
    },
    {
      id: 4,
      name: 'Minimal',
      description: 'Simple and elegant design that lets your content shine.',
      image: '/templates/minimal.png',
    },
  ];

  const handleSelectTemplate = (templateId) => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Choose a Template
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select from our professionally designed templates to create your perfect resume.
      </Typography>

      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
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
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Templates; 