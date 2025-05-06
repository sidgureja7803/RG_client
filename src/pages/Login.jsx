import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  InputAdornment,
  useTheme,
  Snackbar,
  Slide
} from '@mui/material';


import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { login, verifyEmail, loginWithGoogle, loginWithGithub } from '../redux/actions/authActions';
import { Link as RouterLink } from 'react-router-dom';
import firebaseAuthService from '../services/firebaseAuth.service';

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  // Get redirect path from location state or default to dashboard
  const redirectPath = location.state?.from?.pathname || location.state?.redirectTo || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formError, setFormError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetField, setShowResetField] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError(''); // Clear error when user types
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (isVerification) {
        const result = await dispatch(verifyEmail({ userId, otp: formData.verificationCode })).unwrap();
        if (result.token) {
          navigate(redirectPath);
        }
      } else {
        const result = await dispatch(login({
          email: formData.email,
          password: formData.password
        })).unwrap();
        
        if (result.userId && !result.token) {
          // Need verification
          setIsVerification(true);
          setUserId(result.userId);
        } else if (result.token) {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormError(err.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Redirect to backend Google OAuth route
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
    } catch (err) {
      console.error('Google login error:', err);
      setFormError('Google login failed. Please try again.');
    }
  };

  const handleGithubLogin = async () => {
    try {
      // Redirect to backend GitHub OAuth route
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/github`;
    } catch (err) {
      console.error('GitHub login error:', err);
      setFormError('GitHub login failed. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setFormError('Please enter your email address');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbarMessage('Password reset email sent. Please check your inbox.');
        setSnackbarOpen(true);
        setShowResetField(false);
      } else {
        setFormError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setFormError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isVerification ? 'Verify Email' : 'Welcome Back'}
            </Typography>
            
            {formError && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: theme.palette.error.main
                  }
                }}
                onClose={() => setFormError('')}
              >
                {formError}
              </Alert>
            )}

            {isVerification ? (
              <>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  Please enter the verification code sent to your email
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="verificationCode"
                  label="Verification Code"
                  type="text"
                  id="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  Sign in to continue building your professional resume
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                {showResetField ? (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="resetEmail"
                      label="Enter your email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        onClick={handleResetPassword}
                        variant="outlined"
                        size="small"
                      >
                        Send Reset Link
                      </Button>
                      <Button
                        onClick={() => setShowResetField(false)}
                        variant="text"
                        size="small"
                        color="inherit"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', textAlign: 'right', mt: 1 }}>
                    <Button
                      onClick={() => setShowResetField(true)}
                      variant="text"
                      size="small"
                      sx={{ 
                        fontSize: '0.85rem',
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          background: 'transparent'
                        }
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>
                )}
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                fontSize: '1rem',
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isVerification ? 'Verify' : 'Sign In'
              )}
            </Button>

            {!isVerification && (
              <>
                <Box sx={{ position: 'relative', width: '100%', mb: 3, mt: 1 }}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                      or continue with
                    </Typography>
                  </Divider>
                </Box>
                
                <Stack direction="row" spacing={2} sx={{ width: '100%', mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={<GoogleIcon />}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      borderColor: '#DB4437',
                      color: '#DB4437',
                      '&:hover': {
                        borderColor: '#DB4437',
                        backgroundColor: 'rgba(219, 68, 55, 0.05)'
                      }
                    }}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGithubLogin}
                    startIcon={<GitHubIcon />}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#333',
                      color: '#333',
                      '&:hover': {
                        borderColor: '#333',
                        backgroundColor: 'rgba(51, 51, 51, 0.05)'
                      }
                    }}
                  >
                    GitHub
                  </Button>
                </Stack>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body2"
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: theme.palette.secondary.main,
                        }
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Login; 