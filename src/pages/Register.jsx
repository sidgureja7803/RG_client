import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  useTheme,
  InputAdornment,
  Link,
  Snackbar,
  Slide
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyEmail, resendOTP, loginWithGoogle, loginWithGithub } from '../redux/actions/authActions';
import { Visibility, VisibilityOff, Person, Email, Phone, VpnKey } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import firebaseAuthService from '../services/firebaseAuth.service';

// Steps for manual registration
const steps = ['Account Details', 'Personal Information', 'Verification'];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { error, loading } = useSelector((state) => state.auth);
  const theme = useTheme();
  
  // Get redirect path from location state or default to dashboard
  const redirectPath = location.state?.redirectTo || '/dashboard';

  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate(redirectPath);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate, redirectPath]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Generate username from first and last name
    if (e.target.name === 'firstName' || e.target.name === 'lastName') {
      const firstName = e.target.name === 'firstName' ? e.target.value : formData.firstName;
      const lastName = e.target.name === 'lastName' ? e.target.value : formData.lastName;
      
      if (firstName && lastName) {
        const generatedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, '');
        setFormData(prevData => ({
          ...prevData,
          username: generatedUsername
        }));
      }
    }
    
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 0:
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 1:
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.username) errors.username = 'Username is required';
        break;
      case 2:
        if (!formData.verificationCode) errors.verificationCode = 'Verification code is required';
        break;
      default:
        break;
    }
    return errors;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNext = async () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (activeStep === 0) {
        setActiveStep(1);
      } else if (activeStep === 1) {
        // Try Firebase registration first if email/password are provided
        if (formData.email && formData.password) {
          try {
            // Register user in Firebase
            await firebaseAuthService.registerWithEmailPassword(
              formData.email, 
              formData.password, 
              {
                firstName: formData.firstName,
                lastName: formData.lastName,
                profilePicture: null
              }
            );
            
            // If Firebase registration succeeds, show a success message
            setSnackbarMessage('Account created successfully! Please verify your email.');
            setSnackbarOpen(true);
            
            // Skip to verification step for Firebase users
            setActiveStep(2);
            return;
          } catch (firebaseErr) {
            console.error("Firebase registration error:", firebaseErr);
            // Fall back to backend registration if Firebase fails
          }
        }
        
        // Default to backend registration
        const result = await dispatch(register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })).unwrap();
        
        if (result.userId) {
          setUserId(result.userId);
          setActiveStep(2);
          // Start resend timer
          setResendDisabled(true);
          let timeLeft = 60;
          setResendTimer(timeLeft);
          const timer = setInterval(() => {
            timeLeft -= 1;
            setResendTimer(timeLeft);
            if (timeLeft === 0) {
              setResendDisabled(false);
              clearInterval(timer);
            }
          }, 1000);
        }
      } else if (activeStep === 2) {
        const result = await dispatch(verifyEmail({
          userId,
          otp: formData.verificationCode
        })).unwrap();
        
        if (result.token) {
          setSnackbarMessage('Account verified successfully! Redirecting to dashboard...');
          setSnackbarOpen(true);
          
          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
        }
      }
    } catch (err) {
      setFormErrors({ submit: err.message || 'An error occurred' });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setFormErrors({});
  };

  const handleResendCode = async () => {
    try {
      await dispatch(resendOTP({ userId })).unwrap();
      setResendDisabled(true);
      let timeLeft = 60;
      setResendTimer(timeLeft);
      const timer = setInterval(() => {
        timeLeft -= 1;
        setResendTimer(timeLeft);
        if (timeLeft === 0) {
          setResendDisabled(false);
          clearInterval(timer);
        }
      }, 1000);
      
      setSnackbarMessage('Verification code resent to your email');
      setSnackbarOpen(true);
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to resend code' });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await dispatch(loginWithGoogle()).unwrap();
      
      // If we have a result with token, navigate to dashboard
      if (result && result.token) {
        navigate(redirectPath);
      }
      // If not, the page will be redirected to OAuth flow
    } catch (err) {
      setFormErrors({ submit: err.message || 'Google signup failed' });
    }
  };

  const handleGithubSignup = async () => {
    try {
      const result = await dispatch(loginWithGithub()).unwrap();
      
      // If we have a result with token, navigate to dashboard
      if (result && result.token) {
        navigate(redirectPath);
      }
      // If not, the page will be redirected to OAuth flow
    } catch (err) {
      setFormErrors({ submit: err.message || 'GitHub signup failed' });
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
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
              error={!!formErrors.email}
              helperText={formErrors.email}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
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
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="primary" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                )
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
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                )
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
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username || "This will be your display name"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              Please check your email for the verification code.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              error={!!formErrors.verificationCode}
              helperText={formErrors.verificationCode}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendCode}
              disabled={resendDisabled}
              sx={{ 
                mt: 2,
                borderRadius: 2,
                color: theme.palette.primary.main
              }}
            >
              {resendDisabled
                ? `Resend code in ${resendTimer}s`
                : 'Resend verification code'}
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
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
            p: 4, 
            width: '100%',
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
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
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
            Create Account
          </Typography>
          
          {activeStep === 0 && (
            <>
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleSignup}
                  startIcon={<GoogleIcon />}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: '#DB4437', 
                    color: '#DB4437',
                    '&:hover': {
                      borderColor: '#DB4437',
                      backgroundColor: 'rgba(219, 68, 55, 0.04)'
                    }
                  }}
                >
                  Continue with Google
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGithubSignup}
                  startIcon={<GitHubIcon />}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#333',
                      backgroundColor: 'rgba(51, 51, 51, 0.04)'
                    }
                  }}
                >
                  Continue with GitHub
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                  Or register with email
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>
            </>
          )}

          {formErrors.submit && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: theme.palette.error.main
                }
              }}
              onClose={() => setFormErrors({ ...formErrors, submit: '' })}
            >
              {formErrors.submit}
            </Alert>
          )}

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.success.main,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main,
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" noValidate>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  px: 3
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Complete'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Box>
          
          {activeStep === 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
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
                  Sign In
                </Link>
              </Typography>
            </Box>
          )}
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

export default Register; 