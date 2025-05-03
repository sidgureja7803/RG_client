import React, { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'AI-Powered Assistant',
    description: 'Get intelligent suggestions and real-time improvements as you write.',
    icon: '🤖',
  },
  {
    title: 'ATS-Optimized Templates',
    description: 'Ensure your resume passes Applicant Tracking Systems every time.',
    icon: '✅',
  },
  {
    title: 'Real-Time Collaboration',
    description: 'Share and get feedback from mentors and peers instantly.',
    icon: '👥',
  },
  {
    title: 'Smart Analytics',
    description: 'Track your resume performance and get insights for improvement.',
    icon: '📊',
  },
];

const benefits = [
  'AI-powered content suggestions and improvements',
  'Real-time ATS compatibility checking',
  'Instant LinkedIn profile import',
  'Live collaboration with mentors',
  'Multiple language support',
  'Smart keyword optimization',
];

const Landing = () => {
  const theme = useTheme();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    // Hero section animation
    gsap.from(heroRef.current.children, {
      duration: 1,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Features section animation
    const featureItems = featuresRef.current.children;
    gsap.from(featureItems, {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Benefits section animation
    const benefitItems = benefitsRef.current.children;
    gsap.from(benefitItems, {
      scrollTrigger: {
        trigger: benefitsRef.current,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
      duration: 0.6,
      x: -50,
      opacity: 0,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navigation />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: '60%',
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'skewX(-15deg)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box ref={heroRef}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    lineHeight: '1.2',
                  }}
                >
                  Create Your Perfect
                  <br />
                  Resume in Minutes
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  Stand out from the crowd with our AI-powered resume builder.
                  Professional templates, instant formatting, and expert suggestions.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/templates"
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      borderWidth: 2,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    View Templates
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bottom: 20,
                    left: 20,
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateZ(0)',
                  }}
                >
                  <img
                    src="/resume-preview.png"
                    alt="Resume Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Why Choose Our Resume Builder?
        </Typography>
        <Grid container spacing={4} ref={featuresRef}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  background: 'transparent',
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                Everything You Need to Create a Winning Resume
              </Typography>
              <Box ref={benefitsRef}>
                {benefits.map((benefit, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <CheckCircleOutlineIcon color="primary" />
                    <Typography variant="h6">{benefit}</Typography>
                  </Stack>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    bottom: -20,
                    left: -20,
                    background: theme.palette.primary.main,
                    borderRadius: 4,
                    opacity: 0.1,
                  },
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  <img
                    src="/features-preview.png"
                    alt="Features Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Add new AI Demo Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                AI-Powered Resume Building
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Our advanced AI assistant helps you create the perfect resume by:
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Stack spacing={2}>
                  {[
                    'Suggesting impactful action verbs and achievements',
                    'Optimizing content for ATS systems',
                    'Tailoring your resume to specific job descriptions',
                    'Providing real-time writing improvements',
                    'Analyzing keyword optimization',
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateX(10px)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    right: -20,
                    bottom: -20,
                    left: 20,
                    background: theme.palette.primary.main,
                    borderRadius: 4,
                    opacity: 0.1,
                  },
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src="/ai-demo.png"
                      alt="AI Resume Assistant Demo"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 8,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'translate(-50%, -50%) scale(1)',
                          },
                          '50%': {
                            transform: 'translate(-50%, -50%) scale(1.05)',
                          },
                          '100%': {
                            transform: 'translate(-50%, -50%) scale(1)',
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'primary.main',
                          textAlign: 'center',
                          p: 2,
                        }}
                      >
                        AI Assistant Active
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Ready to Build Your Resume?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: 'text.secondary', fontWeight: 400 }}
          >
            Join thousands of job seekers who have created successful resumes
            using our platform.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              borderRadius: 3,
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              },
            }}
          >
            Create Your Resume Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
