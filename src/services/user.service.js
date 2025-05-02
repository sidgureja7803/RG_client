import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const userService = {
  async updateProfile(userData) {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async uploadProfilePicture(formData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/users/profile/picture`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchUsers(query) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default userService; 