import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { analyzeResume } from '../../services/atsService';

const ATSScoreChecker = ({ resumeContent }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeContent || !jobDescription) {
      setError('Please provide both resume content and job description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await analyzeResume(resumeContent, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          ATS Score Checker
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={loading || !resumeContent || !jobDescription}
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Resume'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {analysis && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">ATS Score:</Typography>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  ml: 2
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={analysis.score}
                  color={analysis.score > 70 ? 'success' : analysis.score > 50 ? 'warning' : 'error'}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(analysis.score)}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Missing Keywords:
            </Typography>
            <List dense>
              {analysis.missingKeywords.map((keyword, index) => (
                <ListItem key={index}>
                  <ListItemText primary={keyword} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Recommendations:
            </Typography>
            <List dense>
              {analysis.recommendations.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ATSScoreChecker; 