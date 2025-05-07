import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const compileLatex = async (latexCode) => {
  try {
    const response = await axios.post(`${API_URL}/latex/compile`, {
      code: latexCode
    }, {
      responseType: 'blob'
    });
    
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error compiling LaTeX:', error);
    throw error;
  }
};

export const saveLatexDocument = async (documentId, latexCode) => {
  try {
    const response = await axios.post(`${API_URL}/latex/save`, {
      documentId,
      code: latexCode
    });
    
    return response.data;
  } catch (error) {
    console.error('Error saving LaTeX document:', error);
    throw error;
  }
};

export const loadLatexDocument = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/latex/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading LaTeX document:', error);
    throw error;
  }
}; 