import api from './api';

/**
 * Get all resumes for the current user
 * @returns {Promise<Array>} List of user's resumes
 */
export const getResumes = async () => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return getMockResumes();
    }

    const response = await api.get('/resumes');
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw new Error('Failed to fetch your resumes. Please try again.');
  }
};

/**
 * Get a resume by ID
 * @param {string} id - Resume ID
 * @returns {Promise<Object>} Resume data
 */
export const getResumeById = async (id) => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return getMockResumeById(id);
    }

    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume with ID ${id}:`, error);
    throw new Error('Failed to fetch resume. Please try again.');
  }
};

/**
 * Create a new resume
 * @param {Object} resumeData - Resume data
 * @returns {Promise<Object>} Created resume
 */
export const createResume = async (resumeData) => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return createMockResume(resumeData);
    }

    const response = await api.post('/resumes', resumeData);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw new Error('Failed to create resume. Please try again.');
  }
};

/**
 * Update an existing resume
 * @param {string} id - Resume ID
 * @param {Object} resumeData - Updated resume data
 * @returns {Promise<Object>} Updated resume
 */
export const updateResume = async (id, resumeData) => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return updateMockResume(id, resumeData);
    }

    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume with ID ${id}:`, error);
    throw new Error('Failed to update resume. Please try again.');
  }
};

/**
 * Delete a resume
 * @param {string} id - Resume ID
 * @returns {Promise<Object>} Success message
 */
export const deleteResume = async (id) => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return deleteMockResume(id);
    }

    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting resume with ID ${id}:`, error);
    throw new Error('Failed to delete resume. Please try again.');
  }
};

/**
 * Generate PDF for a resume
 * @param {string} id - Resume ID
 * @returns {Promise<Blob>} PDF blob
 */
export const generateResumePDF = async (id) => {
  try {
    // Check if we're in development/testing with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return new Blob(['Mock PDF content'], { type: 'application/pdf' });
    }

    const response = await api.get(`/resumes/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error generating PDF for resume with ID ${id}:`, error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Mock data for development/testing
const getMockResumes = () => {
  return [
    {
      _id: '12345',
      title: 'Software Engineer Resume',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      sections: {
        summary: {
          content: 'Experienced software engineer with 5+ years of experience in full-stack development...'
        },
        experience: {
          content: 'Senior Software Engineer at TechCorp (2020-Present)...'
        }
      }
    },
    {
      _id: '67890',
      title: 'Data Scientist Resume',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      sections: {
        summary: {
          content: 'Data scientist with expertise in machine learning and statistical analysis...'
        },
        experience: {
          content: 'Data Scientist at AnalyticsCo (2019-Present)...'
        }
      }
    }
  ];
};

const getMockResumeById = (id) => {
  const mockResumes = {
    '12345': {
      id: '12345',
      title: 'Software Engineer Resume',
      sections: {
        summary: {
          content: 'Experienced software engineer with 5+ years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies.'
        },
        experience: {
          content: 'Senior Software Engineer at TechCorp (2020-Present)\n- Developed and maintained multiple React applications\n- Implemented CI/CD pipelines using GitHub Actions\n- Improved application performance by 40%\n\nSoftware Developer at WebSolutions (2018-2020)\n- Built RESTful APIs using Node.js and Express\n- Collaborated with cross-functional teams on agile projects\n- Implemented automated testing strategies'
        },
        education: {
          content: 'Bachelor of Science in Computer Science\nUniversity of Technology (2014-2018)'
        },
        skills: {
          content: 'Programming: JavaScript, TypeScript, HTML, CSS, Python\nFrameworks: React, Node.js, Express\nTools: Git, Docker, AWS, Jest, Webpack\nSoft Skills: Team collaboration, problem-solving, communication'
        },
        projects: {
          content: 'E-commerce Platform\n- Built using MERN stack\n- Implemented user authentication and payment processing\n\nData Visualization Dashboard\n- Created interactive charts using D3.js\n- Implemented real-time data updates using WebSockets'
        }
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    '67890': {
      id: '67890',
      title: 'Data Scientist Resume',
      sections: {
        summary: {
          content: 'Data scientist with 3+ years of experience in machine learning and statistical analysis. Expert in Python, R, and data visualization.'
        },
        experience: {
          content: 'Data Scientist at AnalyticsCo (2019-Present)\n- Developed predictive models that increased customer retention by 25%\n- Created data pipelines processing 500GB+ of data daily\n- Led a team of 3 junior data analysts\n\nData Analyst at DataCorp (2017-2019)\n- Performed statistical analysis on customer behavior\n- Created interactive dashboards using Tableau'
        },
        education: {
          content: 'Master of Science in Data Science\nTech University (2015-2017)\n\nBachelor of Science in Statistics\nState University (2011-2015)'
        },
        skills: {
          content: 'Programming: Python, R, SQL\nMachine Learning: TensorFlow, scikit-learn, PyTorch\nData Visualization: Tableau, PowerBI, Matplotlib\nBig Data: Hadoop, Spark, Kafka'
        }
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  };

  return mockResumes[id] || null;
};

const createMockResume = (resumeData) => {
  const newId = Math.random().toString(36).substr(2, 9);
  const newResume = {
    id: newId,
    ...resumeData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return newResume;
};

const updateMockResume = (id, resumeData) => {
  return {
    id,
    ...resumeData,
    updatedAt: new Date()
  };
};

const deleteMockResume = (id) => {
  return { message: `Resume with ID ${id} deleted successfully (mock)` };
}; 