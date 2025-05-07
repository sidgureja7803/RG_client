import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const analyzeResume = async (resumeContent, jobDescription) => {
  try {
    const response = await axios.post(`${API_URL}/ats/analyze`, {
      resumeContent,
      jobDescription
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};

export const saveAnalysis = async (analysisData) => {
  try {
    const response = await axios.post(`${API_URL}/ats/save-analysis`, analysisData);
    return response.data;
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
};

export const getAnalysisHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/ats/analysis-history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }
}; 