import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Check if we have a successful response with token
      if (response.data && response.data.token) {
        // Store auth data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      // Handle verification required case
      if (response.data && response.data.userId && !response.data.token) {
        return {
          userId: response.data.userId,
          requiresVerification: true,
          message: response.data.message
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data || error;
    }
  }

  async verifyEmail(userId, otp) {
    try {
      const response = await api.post('/auth/verify-email', { userId, otp });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Verification error:", error);
      throw error.response?.data || error;
    }
  }

  async resendOTP(userId) {
    try {
      const response = await api.post('/auth/resend-otp', { userId });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error.response?.data || error;
    }
  }

  async loginWithGoogle(token) {
    const response = await api.post('/auth/google', { token });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async loginWithGithub(code) {
    const response = await api.post('/auth/github', { code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(email) {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error.response?.data || error;
    }
  }

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    if (response.data) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error.response?.data || error;
    }
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getStoredToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getStoredToken();
  }
}

export default new AuthService(); 