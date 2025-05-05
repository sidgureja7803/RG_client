import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
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
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Google OAuth Login
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (token, { rejectWithValue }) => {
    try {
      const data = await authService.loginWithGoogle(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Google login failed');
    }
  }
);

// GitHub OAuth Login
export const loginWithGithub = createAsyncThunk(
  'auth/loginWithGithub',
  async (code, { rejectWithValue }) => {
    try {
      const data = await authService.loginWithGithub(code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'GitHub login failed');
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
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
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