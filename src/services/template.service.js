import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const templateService = {
  async getTemplates(category) {
    const token = localStorage.getItem('token');
    const url = category ? `${API_URL}/templates?category=${category}` : `${API_URL}/templates`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getTemplateById(id) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/templates/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async incrementUsageCount(id) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/templates/${id}/usage`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default templateService; 