import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as needed
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 