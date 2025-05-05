import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResumeDropzone from '../components/ResumeAnalyzer/ResumeDropzone';

const ResumeAnalyzer = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resume Analyzer
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload your resume and job description to see how well they match and get personalized recommendations.
        </Typography>
        <ResumeDropzone />
      </Box>
    </Container>
  );
};

export default ResumeAnalyzer; 