import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { FileText, Code, BarChart, Upload, Zap, Check } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <FileText size={36} />,
      title: 'Standard Resume Builder',
      description: 'Create professional resumes using our drag-and-drop editor with customizable templates.',
      path: '/create/standard',
      color: '#1976d2'
    },
    {
      icon: <Code size={36} />,
      title: 'Code Resume Builder',
      description: 'Write your resume in markdown and see changes in real-time with our code editor.',
      path: '/code-resume',
      color: '#9c27b0',
      highlight: true
    },
    {
      icon: <BarChart size={36} />,
      title: 'Resume Analyzer',
      description: 'Compare your resume against job descriptions to see how well you match and get suggestions.',
      path: '/analyzer',
      color: '#2e7d32'
    },
    {
      icon: <Upload size={36} />,
      title: 'Upload & Improve',
      description: 'Upload your existing resume to analyze, edit, and improve it with our tools.',
      path: '/upload',
      color: '#ed6c02'
    }
  ];

  const benefits = [
    {
      title: 'ATS-Friendly Templates',
      description: 'Our resumes are designed to pass through Applicant Tracking Systems with high scores.'
    },
    {
      title: 'Real-time Job Matching',
      description: 'See how well your resume matches specific job descriptions and get personalized recommendations.'
    },
    {
      title: 'Customizable Designs',
      description: 'Choose from multiple professional templates and customize colors, fonts, and layouts.'
    },
    {
      title: 'Export & Share Options',
      description: 'Download your resume as PDF or share a link directly with recruiters and hiring managers.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          py: 10,
          background: 'linear-gradient(45deg, rgba(26,115,232,0.1) 0%, rgba(66,133,244,0.05) 100%)',
          borderRadius: 0,
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Create & Analyze <br />
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Winning Resumes
                </Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Build professional resumes, match them to job descriptions, and get real-time feedback to land your dream job.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={Link} 
                  to="/code-resume"
                  startIcon={<Code />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: 2
                  }}
                >
                  Try Code Editor
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={Link} 
                  to="/analyzer"
                  startIcon={<BarChart />}
                  sx={{ 
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Analyze Resume
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/resume-builder-illustration.png" 
                alt="Resume Builder"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Build Your Perfect Resume
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Choose from multiple tools to create, customize, and optimize your resume
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={feature.highlight ? 3 : 1} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  },
                  ...(feature.highlight && {
                    border: '1px solid',
                    borderColor: 'primary.light',
                    position: 'relative',
                    '&::before': {
                      content: '"NEW"',
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }
                  })
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" align="center" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant={feature.highlight ? "contained" : "outlined"} 
                    component={Link} 
                    to={feature.path}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2
                    }}
                    color={feature.highlight ? "primary" : "primary"}
                  >
                    Try {feature.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
              Why Choose Our Platform
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Get the competitive edge in your job search with these powerful features
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    <Check size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, rgba(33,150,243,0.1) 0%, rgba(156,39,176,0.05) 100%)',
            border: '1px solid rgba(25,118,210,0.1)',
          }}
        >
          <Zap size={48} style={{ marginBottom: 16, opacity: 0.7, color: '#1976d2' }} />
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Ready to upgrade your job search?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Start building professional resumes that match job descriptions and get through ATS systems with high scores.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/register"
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Get Started for Free
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/code-resume"
              sx={{ 
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Try Without Signing Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 