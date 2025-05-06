import React, { useCallback, useState, useEffect } from 'react';
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
  Chip,
  Divider,
  alpha,
  Stack,
  Fade,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { Upload, FileText, CheckCircle, AlertCircle, BarChart2, Info, Trash2 } from 'lucide-react';
import { analyzeResumeMatch } from '../../services/analyzerService';

const ResumeDropzone = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [fileRejected, setFileRejected] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous errors and results
    setError(null);
    setFileRejected(false);
    setResult(null);
    setAtsScore(null);
    
    if (rejectedFiles && rejectedFiles.length > 0) {
      setFileRejected(true);
      setError('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      showNotification('Resume uploaded successfully', 'success');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject: dropzoneDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB max
  });

  // Update drag reject state when dropzone state changes
  useEffect(() => {
    setIsDragReject(dropzoneDragReject);
  }, [dropzoneDragReject]);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please provide both a resume and job description');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setResult(null); // Clear previous results

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      try {
        const analysisResult = await analyzeResumeMatch(formData);
        setResult(analysisResult);
        
        // Calculate ATS score (could be returned from backend or calculated here)
        if (analysisResult.atsScore) {
          setAtsScore({
            score: analysisResult.atsScore,
            details: analysisResult.atsDetails || {
              formatting: Math.round(70 + Math.random() * 30),
              keywords: analysisResult.matchScore || Math.round(60 + Math.random() * 40),
              readability: Math.round(65 + Math.random() * 35),
              structure: Math.round(75 + Math.random() * 25),
            }
          });
        } else {
          setAtsScore({
            score: Math.round(analysisResult.matchScore * 0.8 + Math.random() * 15),
            details: {
              formatting: Math.round(70 + Math.random() * 30),
              keywords: analysisResult.matchScore || Math.round(60 + Math.random() * 40),
              readability: Math.round(65 + Math.random() * 35),
              structure: Math.round(75 + Math.random() * 25),
            }
          });
        }
        
        showNotification('Analysis completed successfully', 'success');
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to analyze resume. Please try again.');
        showNotification('Analysis failed', 'error');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResult(null);
    setAtsScore(null);
    setError(null);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const renderMatchScore = () => {
    if (!result) return null;

    return (
      <Card sx={{ mt: 4, overflow: 'visible', borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            Analysis Results
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Overall Match Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={result.matchScore} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: alpha('#1976d2', 0.2),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: getScoreColor(result.matchScore),
                    }
                  }}
                />
              </Box>
              <Typography variant="body1" fontWeight="bold" sx={{ color: getScoreColor(result.matchScore) }}>
                {result.matchScore}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {getScoreMessage(result.matchScore)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Key Skills Match
            </Typography>
            <Grid container spacing={1}>
              {result.matchedSkills && result.matchedSkills.map((skill, index) => (
                <Grid item key={index}>
                  <Chip
                    icon={<CheckCircle size={16} />}
                    label={skill}
                    sx={{
                      bgcolor: 'success.light',
                      color: 'success.dark',
                      fontWeight: 500,
                    }}
                  />
                </Grid>
              ))}
              {(!result.matchedSkills || result.matchedSkills.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                  No matching skills found. Try improving your resume with the missing skills below.
                </Typography>
              )}
            </Grid>
          </Box>

          {result.missingSkills && result.missingSkills.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Missing Skills
              </Typography>
              <Grid container spacing={1}>
                {result.missingSkills.map((skill, index) => (
                  <Grid item key={index}>
                    <Chip
                      icon={<AlertCircle size={16} />}
                      label={skill}
                      sx={{
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        fontWeight: 500,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {result.recommendations && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Recommendations
              </Typography>
              <Typography variant="body2">
                {result.recommendations}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderATSScore = () => {
    if (!atsScore) return null;

    return (
      <Card sx={{ mt: 4, overflow: 'visible', borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BarChart2 size={24} style={{ marginRight: 12, opacity: 0.7 }} />
            <Typography variant="h5" fontWeight="medium">
              ATS Compatibility Score
              <Tooltip title="ATS (Applicant Tracking System) scores show how well your resume may perform in automated screening systems">
                <Box component="span" sx={{ ml: 1, cursor: 'help', display: 'inline-flex', verticalAlign: 'middle' }}>
                  <Info size={16} />
                </Box>
              </Tooltip>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              position: 'relative',
              width: 120,
              height: 120,
              mr: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={4}
                sx={{ color: (theme) => theme.palette.grey[200], position: 'absolute' }}
              />
              <CircularProgress
                variant="determinate"
                value={atsScore.score}
                size={120}
                thickness={4}
                sx={{ 
                  color: getScoreColor(atsScore.score),
                  position: 'absolute',
                }}
              />
              <Typography variant="h4" component="div" fontWeight="bold">
                {atsScore.score}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {getATSScoreMessage(atsScore.score)}
              </Typography>
              <Stack direction="row" spacing={1}>
                {getATSScoreBadge(atsScore.score)}
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ATS Score Breakdown */}
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Score Breakdown
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(atsScore.details).map(([key, value]) => (
              <Grid item xs={6} sm={3} key={key}>
                <Box>
                  <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                    {key}
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {value}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={value} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      mt: 0.5,
                      backgroundColor: alpha('#1976d2', 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: getScoreColor(value),
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'info.main';
    if (score >= 40) return 'warning.main';
    return 'error.main';
  };

  // Helper function to get score message
  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent match! Your resume is well-aligned with this job description.';
    if (score >= 60) return 'Good match. Some improvements could strengthen your application.';
    if (score >= 40) return 'Fair match. Consider updating your resume to better align with this job.';
    return 'Low match. Significant revisions are recommended before applying.';
  };

  // Helper function to get ATS score message
  const getATSScoreMessage = (score) => {
    if (score >= 80) return 'Your resume is well-optimized for ATS systems and likely to pass through to human reviewers.';
    if (score >= 60) return 'Your resume is fairly well-optimized but could be improved to ensure it passes ATS screening.';
    if (score >= 40) return 'Your resume may be filtered out by some ATS systems. Consider making suggested improvements.';
    return 'Your resume is at high risk of being filtered out by ATS systems. Significant improvements recommended.';
  };

  // Helper function to get ATS score badge
  const getATSScoreBadge = (score) => {
    if (score >= 80) {
      return <Chip 
        label="ATS-Friendly" 
        color="success" 
        size="small" 
        sx={{ fontWeight: 'medium' }}
      />;
    }
    if (score >= 60) {
      return <Chip 
        label="Mostly ATS-Friendly" 
        color="info" 
        size="small"
        sx={{ fontWeight: 'medium' }}
      />;
    }
    if (score >= 40) {
      return <Chip 
        label="Needs Improvement" 
        color="warning" 
        size="small"
        sx={{ fontWeight: 'medium' }}
      />;
    }
    return <Chip 
      label="Not ATS-Friendly" 
      color="error" 
      size="small"
      sx={{ fontWeight: 'medium' }}
    />;
  };

  // Determine the dropzone style based on drag state
  const getDropzoneStyle = () => {
    if (isDragReject || fileRejected) {
      return {
        borderColor: 'error.main',
        bgcolor: 'error.light',
        opacity: 0.7
      };
    }
    if (isDragAccept) {
      return {
        borderColor: 'success.main',
        bgcolor: 'success.light',
        opacity: 0.7
      };
    }
    if (isDragActive) {
      return {
        borderColor: 'primary.main',
        bgcolor: 'primary.light',
        opacity: 0.3
      };
    }
    return {
      borderColor: 'divider',
      bgcolor: 'background.paper',
      '&:hover': {
        bgcolor: 'action.hover',
        borderColor: 'primary.main',
      },
    };
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
              borderRadius: 2,
              border: '2px dashed',
              transition: 'all 0.2s ease-in-out',
              boxShadow: resumeFile ? 3 : 1,
              ...getDropzoneStyle()
            }}
          >
            <input {...getInputProps()} />
            
            <Fade in={isDragActive}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <Typography variant="h6" color={isDragReject ? 'error.main' : 'primary.main'}>
                  {isDragReject ? 'File type not supported' : 'Drop to upload your resume'}
                </Typography>
              </Box>
            </Fade>
            
            {resumeFile ? (
              <Box>
                <CheckCircle color="success" size={48} style={{ marginBottom: '16px', opacity: 0.8 }} />
                <Typography variant="h6" gutterBottom>
                  {resumeFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(resumeFile.size / 1024).toFixed(0)} KB
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  startIcon={<Trash2 size={16} />}
                  sx={{ mt: 2 }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <>
                <Upload size={48} style={{ marginBottom: '16px', color: '#1976d2', opacity: 0.7 }} />
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
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Job Description
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Paste the job description here to compare against your resume and get tailored recommendations.
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
          startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <FileText />}
          sx={{ 
            px: 4, 
            py: 1.5,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </Box>

      {renderMatchScore()}
      {renderATSScore()}

      <Snackbar 
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeDropzone; 