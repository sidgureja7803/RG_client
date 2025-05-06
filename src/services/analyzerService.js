/**
 * Resume Analyzer Service
 * This service provides algorithms and utilities for comparing resumes against 
 * job descriptions and providing ATS optimization recommendations.
 */
import api from './api';
import { formatDate } from '../utils/dateUtils';

// Natural language processing utilities
const nlp = {
  /**
   * Extract keywords from text
   * @param {string} text - The text to extract keywords from
   * @returns {string[]} Array of keywords
   */
  extractKeywords: (text) => {
    if (!text) return [];
    
    // Convert to lowercase and remove special characters
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    
    // Split into words
    const words = cleanedText.split(/\s+/);
    
    // Filter out common stop words
    const stopWords = [
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
      'by', 'about', 'as', 'of', 'is', 'was', 'be', 'been', 'being', 'that', 'this',
      'these', 'those', 'it', 'its', 'we', 'they', 'them', 'their', 'our', 'your',
      'my', 'will', 'shall', 'would', 'should', 'can', 'could', 'may', 'might',
      'must', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing'
    ];
    
    return words.filter(word => 
      word.length > 2 && !stopWords.includes(word)
    );
  },
  
  /**
   * Categorize keywords into groups based on predefined dictionaries
   * @param {string[]} keywords - Array of keywords to categorize
   * @returns {Object} Categorized keywords
   */
  categorizeKeywords: (keywords) => {
    const categories = {
      'Technical Skills': [
        'javascript', 'python', 'java', 'cpp', 'ruby', 'php', 'swift', 'golang',
        'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
        'sql', 'mongodb', 'postgresql', 'mysql', 'firebase', 'elasticsearch',
        'git', 'github', 'rest', 'graphql', 'api', 'frontend', 'backend', 'fullstack',
        'devops', 'cicd', 'testing', 'automation', 'algorithms', 'data structures'
      ],
      'Soft Skills': [
        'communication', 'teamwork', 'collaboration', 'leadership', 'management',
        'problem solving', 'critical thinking', 'creativity', 'adaptability',
        'organization', 'time management', 'flexibility', 'interpersonal',
        'presentation', 'negotiation', 'conflict resolution', 'customer service',
        'mentoring', 'facilitation', 'delegation', 'strategic', 'planning'
      ],
      'Tools & Technologies': [
        'jira', 'trello', 'slack', 'asana', 'confluence', 'notion', 'microsoft',
        'photoshop', 'illustrator', 'figma', 'sketch', 'indesign', 'adobe',
        'tableau', 'power bi', 'excel', 'spss', 'r', 'sas', 'matlab', 'jupyter',
        'webpack', 'babel', 'npm', 'yarn', 'chrome', 'firefox', 'safari',
        'android', 'ios', 'mobile', 'responsive', 'wordpress', 'shopify'
      ],
      'Certifications': [
        'certified', 'certification', 'license', 'credential', 'certificate',
        'pmp', 'agile', 'scrum', 'comptia', 'cisco', 'mcsa', 'aws', 'google',
        'microsoft', 'oracle', 'cpa', 'cfa', 'series', 'six sigma', 'itil'
      ],
      'Industry Knowledge': [
        'finance', 'healthcare', 'education', 'manufacturing', 'retail', 'logistics',
        'ecommerce', 'saas', 'marketing', 'sales', 'legal', 'compliance', 'hr',
        'operations', 'business development', 'consulting', 'strategy', 'analytics'
      ]
    };

    return keywords.reduce((categorized, keyword) => {
      for (const [category, categoryKeywords] of Object.entries(categories)) {
        if (categoryKeywords.some(ck => keyword.includes(ck) || ck.includes(keyword))) {
          if (!categorized[category]) categorized[category] = [];
          if (!categorized[category].includes(keyword)) {
            categorized[category].push(keyword);
          }
          return categorized;
        }
      }
      
      if (!categorized['Other']) categorized['Other'] = [];
      if (!categorized['Other'].includes(keyword)) {
        categorized['Other'].push(keyword);
      }
      return categorized;
    }, {});
  },
  
  /**
   * Calculate text similarity score between two texts
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score between 0-100
   */
  calculateSimilarity: (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    const keywords1 = nlp.extractKeywords(text1);
    const keywords2 = nlp.extractKeywords(text2);
    
    // Count matching keywords
    const matchingKeywords = keywords1.filter(keyword => 
      keywords2.includes(keyword)
    );
    
    // Calculate Jaccard similarity
    const uniqueKeywords = [...new Set([...keywords1, ...keywords2])];
    return Math.round((matchingKeywords.length / uniqueKeywords.length) * 100);
  }
};

/**
 * Analyze resume against a job description
 * @param {Object} resumeData - Resume data 
 * @param {string} jobDescription - Job description text
 * @returns {Object} Analysis results
 */
export const analyzeResume = async (resumeData, jobDescription) => {
  try {
    if (!resumeData || !resumeData.id) {
      throw new Error('Resume data is required with a valid ID');
    }

    // Check if we're in development or testing mode with no backend
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return getMockAnalysisResult(resumeData, jobDescription);
    }

    // Make API call to get analysis
    const response = await api.post('/analyzer/analyze-with-job', {
      resumeId: resumeData.id,
      jobDescription
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

/**
 * Get analysis history for the user
 * @returns {Array} History of analyses
 */
export const getAnalysisHistory = async () => {
  try {
    // Check if we're in development or testing mode with no backend
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return getMockAnalysisHistory();
    }

    const response = await api.get('/analyzer/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw new Error('Failed to fetch analysis history. Please try again.');
  }
};

/**
 * Save an analysis result
 * @param {string} resumeId - Resume ID
 * @param {Object} analysisResult - Analysis result
 * @param {string} jobDescription - Job description
 * @returns {Object} Success message and ID
 */
export const saveAnalysisResult = async (resumeId, analysisResult, jobDescription) => {
  try {
    // Check if we're in development or testing mode with no backend
    if (process.env.REACT_APP_USE_MOCK_DATA || !api.defaults.baseURL) {
      return { message: 'Analysis saved successfully (mock)', analysisId: 'mock-id' };
    }

    const response = await api.post('/analyzer/save', {
      resumeId,
      analysisResult,
      jobDescription
    });
    
    return response.data;
  } catch (error) {
    console.error('Error saving analysis result:', error);
    throw new Error('Failed to save analysis result. Please try again.');
  }
};

// Mock data generation for development and testing
const getMockAnalysisResult = (resumeData, jobDescription) => {
  // For demo purposes, we'll simulate the analysis with a brief delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Extract combined text from resume sections
      const resumeText = Object.values(resumeData.sections || {})
        .map(section => section.content || '')
        .join(' ');
      
      // Extract keywords from job description
      const jobKeywords = nlp.extractKeywords(jobDescription);
      
      // Extract keywords from resume
      const resumeKeywords = nlp.extractKeywords(resumeText);
      
      // Find matching keywords
      const matchedKeywords = jobKeywords
        .filter(keyword => resumeKeywords.includes(keyword))
        .map(text => {
          // Determine importance based on frequency in job description
          const count = jobDescription.toLowerCase().split(text).length - 1;
          let importance = 'low';
          if (count >= 5) importance = 'high';
          else if (count >= 2) importance = 'medium';
          
          // Determine category
          const categorized = nlp.categorizeKeywords([text]);
          const category = Object.keys(categorized)[0] || 'Other';
          
          return { text, importance, category };
        });
      
      // Find missing keywords
      const missingKeywords = jobKeywords
        .filter(keyword => !resumeKeywords.includes(keyword))
        .map(text => {
          // Determine importance based on frequency in job description
          const count = jobDescription.toLowerCase().split(text).length - 1;
          let importance = 'low';
          if (count >= 5) importance = 'high';
          else if (count >= 2) importance = 'medium';
          
          // Determine category
          const categorized = nlp.categorizeKeywords([text]);
          const category = Object.keys(categorized)[0] || 'Other';
          
          return { text, importance, category };
        });
        
      // Calculate match score
      const keywordMatchPercent = matchedKeywords.length > 0
        ? Math.round((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) * 100)
        : 0;
      
      // Calculate section-specific scores
      const sectionScores = {};
      for (const [sectionName, section] of Object.entries(resumeData.sections || {})) {
        sectionScores[sectionName] = nlp.calculateSimilarity(section.content, jobDescription);
      }
      
      // Generate section recommendations
      const sectionRecommendations = {
        summary: "Consider tailoring your summary to highlight skills specifically mentioned in the job description. Keep it concise and impactful.",
        experience: "Focus on achievements rather than responsibilities. Quantify your impact with metrics where possible.",
        skills: "Ensure your skills section includes the key technical skills mentioned in the job description. Organize them by category for better readability.",
        education: "List your most recent education first. Include relevant coursework or projects if you're a recent graduate."
      };
      
      // Generate metrics
      const metrics = [
        {
          name: 'Keyword Match Rate',
          value: `${keywordMatchPercent}%`,
          description: 'Percentage of job keywords found in your resume'
        },
        {
          name: 'ATS Compatibility',
          value: `${calculateATSScore(resumeData, matchedKeywords.length)}%`,
          description: 'How well your resume will perform in Applicant Tracking Systems'
        },
        {
          name: 'Content Quality',
          value: '78%',
          description: 'Assessment of your resume\'s content effectiveness'
        },
        {
          name: 'Formatting Score',
          value: '85%',
          description: 'How well your resume is structured and formatted'
        }
      ];
      
      // Generate overall suggestions
      const overallSuggestions = [
        "Tailor your resume specifically to this job description by highlighting relevant experience and skills.",
        "Use industry-specific terminology and keywords found in the job listing.",
        "Ensure your achievements are quantified with numbers when possible (e.g., 'increased sales by 20%').",
        "Keep formatting consistent and easy to scan for an ATS system.",
        "Consider adding a brief professional summary that aligns with the job requirements."
      ];
      
      resolve({
        matchScore: keywordMatchPercent,
        atsScore: calculateATSScore(resumeData, matchedKeywords.length),
        matchedKeywords,
        missingKeywords,
        sectionRecommendations,
        overallSuggestions,
        metrics
      });
    }, 2000);
  });
};

const getMockAnalysisHistory = () => {
  return [
    {
      _id: 'history1',
      resumeId: '12345',
      resumeTitle: 'Software Engineer Resume',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      matchScore: 75,
      atsScore: 82
    },
    {
      _id: 'history2',
      resumeId: '12345',
      resumeTitle: 'Software Engineer Resume',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      matchScore: 68,
      atsScore: 75
    }
  ];
};

/**
 * Calculate ATS compatibility score
 * @param {Object} resumeData - Resume data
 * @param {number} matchedKeywordsCount - Number of matched keywords
 * @returns {number} ATS score between 0-100
 */
const calculateATSScore = (resumeData, matchedKeywordsCount) => {
  const baseScore = 65; // Start with a base score
  let bonusPoints = 0;
  
  // Bonus for having key sections
  const sections = Object.keys(resumeData.sections || {});
  const keySections = ['summary', 'experience', 'education', 'skills'];
  keySections.forEach(section => {
    if (sections.some(s => s.toLowerCase().includes(section))) {
      bonusPoints += 5;
    }
  });
  
  // Bonus for matched keywords
  if (matchedKeywordsCount > 20) bonusPoints += 15;
  else if (matchedKeywordsCount > 10) bonusPoints += 10;
  else if (matchedKeywordsCount > 5) bonusPoints += 5;
  
  // Calculate final score
  const finalScore = Math.min(baseScore + bonusPoints, 100);
  return finalScore;
};

export const analyzeResumeMatch = async (formData) => {
  try {
    // Add loading delay for better user experience
    const startTime = Date.now();
    
    const response = await api.post('/api/analyzer/match', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // Extend timeout to 60 seconds for AI processing
    });
    
    // Ensure minimum loading time of 1.5 seconds for better UX
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 1500) {
      await new Promise(resolve => setTimeout(resolve, 1500 - elapsedTime));
    }
    
    // Check if response contains expected data
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response from server');
    }
    
    // Fill in defaults for missing data
    const result = {
      matchScore: response.data.matchScore || 0,
      matchedSkills: response.data.matchedSkills || [],
      missingSkills: response.data.missingSkills || [],
      recommendations: response.data.recommendations || 'No specific recommendations available.',
      atsScore: response.data.atsScore || null,
      atsDetails: response.data.atsDetails || null
    };
    
    return result;
  } catch (error) {
    console.error('Resume analysis error:', error);
    
    // Provide more helpful error messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 413) {
        throw new Error('Resume file is too large. Please upload a smaller file (max 5MB).');
      } else if (error.response.status === 415) {
        throw new Error('Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file.');
      } else if (error.response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Our team has been notified and is working on a fix.');
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your internet connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis request timed out. The server might be busy, please try again later.');
    }
    
    // General error
    throw error.message ? error : new Error('Failed to analyze resume. Please try again later.');
  }
}; 