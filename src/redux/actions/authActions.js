import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import firebaseAuthService from '../../services/firebaseAuth.service';

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // For now, we'll skip Firebase registration due to configuration issues
      // and just use our backend API
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
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
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to resend verification code');
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Try to use Firebase authentication
      try {
        const firebaseUser = await firebaseAuthService.signInWithEmailPassword(email, password);
        
        // If Firebase login succeeds, authenticate with the backend
        if (firebaseUser) {
          const data = await authService.login(email, password);
          return data;
        }
      } catch (firebaseErr) {
        console.error("Firebase login error:", firebaseErr);
        // Fall back to backend authentication
      }
      
      // Use backend authentication
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      console.error("Login error in action:", error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
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
      // Try to sign out from Firebase first
      try {
        await firebaseAuthService.signOut();
      } catch (firebaseErr) {
        console.error("Firebase logout error:", firebaseErr);
      }
      
      // Then sign out from our backend
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
      const data = await authService.getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
); 