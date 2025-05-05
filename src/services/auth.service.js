import api from './api';

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async loginWithGoogle(token) {
    const response = await api.post('/auth/google', { token });
    return response.data;
  }

  async loginWithGithub(code) {
    const response = await api.post('/auth/github', { code });
    return response.data;
  }

  async verifyEmail(userId, otp) {
    const response = await api.post('/auth/verify-email', { userId, otp });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default new AuthService(); 