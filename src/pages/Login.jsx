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
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { login, verifyEmail } from '../redux/actions/authActions';
import { Link as RouterLink } from 'react-router-dom';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError(''); // Clear error when user types
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
        const result = await dispatch(login(formData)).unwrap();
        if (result.userId && !result.token) {
          // Need verification
          setIsVerification(true);
          setUserId(result.userId);
        } else if (result.token) {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred during login');
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('redirectAfterAuth', redirectPath);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    localStorage.setItem('redirectAfterAuth', redirectPath);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
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
              sx={{ fontWeight: 700 }}
            >
              {isVerification ? 'Verify Email' : 'Welcome Back'}
            </Typography>
            
            {formError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
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
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
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
                <Stack direction="row" spacing={1} sx={{ width: '100%', mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={<GoogleIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGithubLogin}
                    startIcon={<GitHubIcon />}
                    sx={{ py: 1.5 }}
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
                      sx={{ fontWeight: 600 }}
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
    </Box>
  );
};

export default Login; 