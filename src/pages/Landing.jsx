import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import TemplateIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <DocumentScannerIcon sx={{ fontSize: 40 }} />,
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed resume templates',
    },
    {
      icon: <TemplateIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Customization',
      description: 'Customize your resume with our intuitive editor',
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
      title: 'Collaboration',
      description: 'Share and collaborate on resumes with others',
    },
    {
      icon: <CloudDownloadIcon sx={{ fontSize: 40 }} />,
      title: 'Export Options',
      description: 'Download your resume in multiple formats',
    },
  ];

  return (
    <Box>
      {/* Header/Navigation */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          p: 2,
          display: 'flex',
          gap: 2
        }}
      >
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/register')}
        >
          Sign Up
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 15,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Create Professional Resumes
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Build stunning resumes in minutes with our easy-to-use resume generator.
            Choose from professional templates and customize them to match your style.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/templates')}
            >
              View Templates
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <FeatureCard>
                {feature.icon}
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{ mt: 2 }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing; 