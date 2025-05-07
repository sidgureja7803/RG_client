import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getTemplates = async () => {
  try {
    const response = await axios.get(`${API_URL}/templates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const uploadTemplate = async (templateData) => {
  try {
    const formData = new FormData();
    formData.append('name', templateData.name);
    formData.append('description', templateData.description);
    formData.append('file', templateData.file);

    const response = await axios.post(`${API_URL}/templates/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading template:', error);
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${API_URL}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

export const getTemplateContent = async (templateId) => {
  try {
    const response = await axios.get(`${API_URL}/templates/${templateId}/content`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template content:', error);
    throw error;
  }
}; 