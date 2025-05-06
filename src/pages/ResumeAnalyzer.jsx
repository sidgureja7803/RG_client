import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent } from '@mui/material';
import ResumeDropzone from '../components/ResumeAnalyzer/ResumeDropzone';
import { BarChart2, FileText, Award } from 'lucide-react';

const ResumeAnalyzer = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2, 
            background: 'linear-gradient(90deg, rgba(25,118,210,0.1) 0%, rgba(66,133,244,0.05) 100%)',
            border: '1px solid rgba(25,118,210,0.15)'
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Resume Analyzer
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Upload your resume and job description to see how well they match. Get personalized recommendations to improve your resume and increase your chances of landing an interview.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <BarChart2 size={120} style={{ opacity: 0.7, color: '#1976d2' }} />
            </Grid>
          </Grid>
        </Paper>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChart2 size={24} style={{ marginRight: 12, opacity: 0.7, color: '#1976d2' }} />
                  <Typography variant="h6" fontWeight="medium">
                    Match Analysis
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Compare your resume against specific job descriptions to identify gaps and opportunities for improvement.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileText size={24} style={{ marginRight: 12, opacity: 0.7, color: '#1976d2' }} />
                  <Typography variant="h6" fontWeight="medium">
                    ATS Optimization
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get insights into how well your resume performs with Applicant Tracking Systems used by employers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Award size={24} style={{ marginRight: 12, opacity: 0.7, color: '#1976d2' }} />
                  <Typography variant="h6" fontWeight="medium">
                    Tailored Recommendations
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Receive personalized suggestions to enhance your resume for specific job opportunities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <ResumeDropzone />
      </Box>
    </Container>
  );
};

export default ResumeAnalyzer; 