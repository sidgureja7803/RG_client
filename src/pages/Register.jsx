import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyEmail, resendOTP, resetAuthError } from '../features/auth/authSlice';
import gsap from 'gsap';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [userId, setUserId] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const { username, email, password, confirmPassword, otp } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Refs for GSAP animations
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const stepperRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(resetAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from(stepperRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (e.target.name === 'confirmPassword' && e.target.value !== password) {
        setPasswordError('Passwords do not match');
      } else if (e.target.name === 'password' && e.target.value !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      const resultAction = await dispatch(register({ username, email, password }));
      if (register.fulfilled.match(resultAction)) {
        setUserId(resultAction.payload.userId);
        setActiveStep(1);
      }
    } else {
      const resultAction = await dispatch(verifyEmail({ userId, otp }));
      if (verifyEmail.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    }
  };

  const handleResendOTP = async () => {
    await dispatch(resendOTP(userId));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography ref={titleRef} component="h1" variant="h5" sx={{ mb: 3 }}>
            Create Account
          </Typography>

          <Stepper ref={stepperRef} activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            <Step>
              <StepLabel>Register</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify Email</StepLabel>
            </Step>
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box ref={formRef} component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {activeStep === 0 ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                  Please enter the verification code sent to your email
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="Verification Code"
                  id="otp"
                  value={otp}
                  onChange={handleChange}
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  type="button"
                  fullWidth
                  variant="text"
                  onClick={handleResendOTP}
                  sx={{ mt: 1 }}
                >
                  Resend Code
                </Button>
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || (activeStep === 0 && !!passwordError)}
            >
              {loading ? 'Processing...' : activeStep === 0 ? 'Continue' : 'Verify & Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 