import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const searchJobs = createAsyncThunk(
  'jobs/search',
  async ({ query, location }, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs/search', { query, location });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search jobs');
    }
  }
);

export const getJobRecommendations = createAsyncThunk(
  'jobs/recommendations',
  async ({ resumeContent }, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs/recommendations', { resumeContent });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get job recommendations');
    }
  }
);

// Initial state
const initialState = {
  searchResults: null,
  recommendations: null,
  loading: false,
  error: null
};

// Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobResults: (state) => {
      state.searchResults = null;
      state.error = null;
    },
    clearJobRecommendations: (state) => {
      state.recommendations = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get job recommendations
      .addCase(getJobRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(getJobRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearJobResults, clearJobRecommendations } = jobSlice.actions;

// Export reducer
export default jobSlice.reducer; 