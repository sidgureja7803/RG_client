import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { getCurrentUser } from './features/auth/authSlice';

// Import pages (we'll create these next)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Import components
import PrivateRoute from './components/PrivateRoute';

// Use MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App = () => {
  useEffect(() => {
    // Check if user is authenticated
    store.dispatch(getCurrentUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/resume/new" element={<PrivateRoute element={<ResumeEditor />} />} />
            <Route path="/resume/:id" element={<PrivateRoute element={<ResumeEditor />} />} />
            <Route path="/templates" element={<PrivateRoute element={<Templates />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

            {/* Not found */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
