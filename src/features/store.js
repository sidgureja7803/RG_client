import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobReducer from './jobs/jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
});

export default store; 