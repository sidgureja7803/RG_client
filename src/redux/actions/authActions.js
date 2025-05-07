import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import firebaseAuthService from '../../services/firebaseAuth.service';

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(userId, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);

// Resend OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await authService.resendOTP(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resend verification code');
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      
      // If login requires verification, return that info
      if (response.requiresVerification) {
        return {
          userId: response.userId,
          requiresVerification: true,
          message: response.message
        };
      }
      
      // Return the successful login data
      return {
        user: response.user,
        token: response.token
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Google OAuth Login
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // Use Firebase authentication for Google login
      const firebaseUser = await firebaseAuthService.signInWithGoogle();
      
      // If we have a Firebase user, use their token to authenticate with our backend
      if (firebaseUser) {
        // Return the Firebase user data - no need for token since we're handling authentication in our app
        return {
          user: {
            ...firebaseUser,
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            profilePicture: firebaseUser.photoURL
          },
          token: 'firebase-authenticated' // Placeholder token since we're not using Firebase tokens for backend
        };
      }
      
      // Fallback to direct OAuth flow if Firebase auth fails
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      localStorage.setItem('redirectAfterAuth', window.location.pathname);
      window.location.href = `${baseUrl}/auth/google`;
      return {};
    } catch (error) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

// GitHub OAuth Login
export const loginWithGithub = createAsyncThunk(
  'auth/loginWithGithub',
  async (_, { rejectWithValue }) => {
    try {
      // Use Firebase authentication for GitHub login
      const firebaseUser = await firebaseAuthService.signInWithGithub();
      
      // If we have a Firebase user, use their token to authenticate with our backend
      if (firebaseUser) {
        // Return the Firebase user data - no need for token since we're handling authentication in our app
        return {
          user: {
            ...firebaseUser,
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            profilePicture: firebaseUser.photoURL
          },
          token: 'firebase-authenticated' // Placeholder token since we're not using Firebase tokens for backend
        };
      }
      
      // Fallback to direct OAuth flow if Firebase auth fails
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      localStorage.setItem('redirectAfterAuth', window.location.pathname);
      window.location.href = `${baseUrl}/auth/github`;
      return {};
    } catch (error) {
      return rejectWithValue(error.message || 'GitHub login failed');
    }
  }
);

// Logout User
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
); 