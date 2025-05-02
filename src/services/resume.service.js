import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const resumeService = {
  async getResumes() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/resumes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getResumeById(id) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createResume(resumeData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/resumes`, resumeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateResume(id, resumeData) {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/resumes/${id}`, resumeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteResume(id) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default resumeService; 