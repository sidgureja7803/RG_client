import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { loginWithGoogle, loginWithGithub } from '../features/auth/authSlice';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get('provider');
      const code = searchParams.get('code');
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth Error:', error);
        navigate('/login');
        return;
      }

      try {
        if (provider === 'google' && token) {
          await dispatch(loginWithGoogle(token));
        } else if (provider === 'github' && code) {
          await dispatch(loginWithGithub(code));
        }
        navigate('/dashboard');
      } catch (err) {
        console.error('Authentication Error:', err);
        navigate('/login');
      }
    };

    handleCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={48} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">
        Completing authentication...
      </Typography>
    </Box>
  );
};

export default OAuthCallback; 