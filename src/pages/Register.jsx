import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  InputAdornment
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyEmail } from '../redux/actions/authActions';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

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
        // Create username from first name and last name, lowercase and remove spaces
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
        if (!formData.password) errors.password = 'Password is required';
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

  const handleNext = async () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      try {
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
      } catch (err) {
        setFormErrors({ submit: err.message || 'Registration failed' });
      }
    } else if (activeStep === 2) {
      try {
        const result = await dispatch(verifyEmail({
          userId,
          otp: formData.verificationCode
        })).unwrap();
        
        if (result.token) {
          navigate(redirectPath);
        }
      } catch (err) {
        setFormErrors({ verificationCode: err.message || 'Verification failed' });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleGoogleSignup = () => {
    // Store the redirect path before redirecting to OAuth
    localStorage.setItem('redirectAfterAuth', redirectPath);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGithubSignup = () => {
    // Store the redirect path before redirecting to OAuth
    localStorage.setItem('redirectAfterAuth', redirectPath);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          
          {/* Social Login Options */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignup}
              startIcon={<GoogleIcon />}
              sx={{ 
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" sx={{ mt: 1 }}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Complete Registration'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography component="span" color="primary">
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
          
          {activeStep === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                *If you sign up with Google or GitHub, you'll be able to add your phone number and update your profile details later.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 