import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeResumeMatch } from '../../services/analyzerService';

const ResumeDropzone = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please provide both a resume and job description');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const analysisResult = await analyzeResumeMatch(formData);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderMatchScore = () => {
    if (!result) return null;

    return (
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Overall Match Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={result.matchScore} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {result.matchScore}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Key Skills Match
            </Typography>
            <Grid container spacing={1}>
              {result.matchedSkills.map((skill, index) => (
                <Grid item key={index}>
                  <Box
                    sx={{
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <CheckCircle size={16} />
                    <Typography variant="body2">{skill}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Missing Skills
            </Typography>
            <Grid container spacing={1}>
              {result.missingSkills.map((skill, index) => (
                <Grid item key={index}>
                  <Box
                    sx={{
                      bgcolor: 'error.light',
                      color: 'error.contrastText',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <AlertCircle size={16} />
                    <Typography variant="body2">{skill}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {result.recommendations}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <Upload size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            {resumeFile ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {resumeFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click or drag to replace
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Drop your resume here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select file
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Supported formats: PDF, DOC, DOCX, TXT
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !resumeFile || !jobDescription.trim()}
          startIcon={isAnalyzing ? <CircularProgress size={20} /> : <FileText />}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </Box>

      {renderMatchScore()}
    </Box>
  );
};

export default ResumeDropzone; 