import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create a new resume
export const createResume = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/resumes`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create resume');
  }
};

// Get a resume by ID
export const getResume = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/resumes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resume');
  }
};

// Update a resume
export const saveResume = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/api/resumes/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save resume');
  }
};

// Get version history
export const getVersions = async (resumeId) => {
  try {
    const response = await axios.get(`${API_URL}/api/resumes/${resumeId}/versions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch version history');
  }
};

// Generate PDF
export const generatePDF = async (resumeId) => {
  try {
    const response = await axios.get(`${API_URL}/api/resumes/${resumeId}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate PDF');
  }
};

// Get all resumes for the current user
export const getUserResumes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/resumes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resumes');
  }
};

// Delete a resume
export const deleteResume = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/resumes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete resume');
  }
};

// Share a resume with another user
export const shareResume = async (resumeId, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/resumes/${resumeId}/share`,
      { userId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to share resume');
  }
}; 