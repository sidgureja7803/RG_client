/**
 * Resume Analyzer Service
 * This service provides algorithms and utilities for comparing resumes against 
 * job descriptions and providing ATS optimization recommendations.
 */

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
 * @param {Object} jobData - Job description data
 * @returns {Object} Analysis results
 */
export const analyzeResume = async (resumeData, jobData) => {
  // In a real implementation, this might make an API call to a backend service
  
  try {
    // For demo purposes, we'll simulate the analysis with a brief delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract combined text from resume sections
    const resumeText = Object.values(resumeData.sections || {})
      .map(section => section.content || '')
      .join(' ');
    
    // Get job description text
    const jobText = jobData.description || '';
    
    // Extract keywords from job description
    const jobKeywords = nlp.extractKeywords(jobText);
    
    // Extract keywords from resume
    const resumeKeywords = nlp.extractKeywords(resumeText);
    
    // Find matching keywords
    const matchedKeywords = jobKeywords
      .filter(keyword => resumeKeywords.includes(keyword))
      .map(text => {
        // Determine importance based on frequency in job description
        const count = jobText.toLowerCase().split(text).length - 1;
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
        const count = jobText.toLowerCase().split(text).length - 1;
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
      sectionScores[sectionName] = nlp.calculateSimilarity(section.content, jobText);
    }
    
    // Generate section recommendations
    const sectionRecommendations = generateSectionRecommendations(resumeData, jobData, sectionScores);
    
    // Generate metrics
    const metrics = [
      {
        name: 'Keyword Match Rate',
        value: `${keywordMatchPercent}%`,
        description: 'Percentage of job keywords found in your resume',
        icon: '🔍'
      },
      {
        name: 'ATS Compatibility',
        value: `${calculateATSScore(resumeData, matchedKeywords.length)}%`,
        description: 'How well your resume will perform in ATS systems',
        icon: '🤖'
      },
      {
        name: 'Missing Keywords',
        value: missingKeywords.length,
        description: 'Number of important keywords not found in your resume',
        icon: '❗'
      },
      {
        name: 'Strongest Section',
        value: findStrongestSection(sectionScores),
        description: 'Your resume section with the highest relevance',
        icon: '🏆'
      }
    ];
    
    // Generate overall suggestions
    const overallSuggestions = generateOverallSuggestions(
      resumeData, 
      jobData,
      matchedKeywords,
      missingKeywords
    );
    
    return {
      matchScore: keywordMatchPercent,
      matchedKeywords,
      missingKeywords,
      metrics,
      sectionRecommendations,
      overallSuggestions
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
};

/**
 * Calculate ATS compatibility score
 * @param {Object} resumeData - Resume data
 * @param {number} matchedKeywordsCount - Number of matched keywords
 * @returns {number} ATS score between 0-100
 */
const calculateATSScore = (resumeData, matchedKeywordsCount) => {
  // In a real implementation, this would be more sophisticated
  // For now, we'll use a simple formula
  
  const hasProperFormatting = true; // Assume proper formatting
  const hasProperSections = Object.keys(resumeData.sections || {}).length >= 4;
  const hasContactInfo = true; // Assume contact info is present
  
  let score = 50; // Base score
  
  // Add points for matched keywords
  score += Math.min(matchedKeywordsCount * 2, 30);
  
  // Add points for proper formatting
  if (hasProperFormatting) score += 10;
  
  // Add points for proper sections
  if (hasProperSections) score += 5;
  
  // Add points for contact info
  if (hasContactInfo) score += 5;
  
  return Math.min(score, 100);
};

/**
 * Find the strongest section in a resume based on scores
 * @param {Object} sectionScores - Scores for each section
 * @returns {string} Name of strongest section
 */
const findStrongestSection = (sectionScores) => {
  if (Object.keys(sectionScores).length === 0) return 'None';
  
  let highestScore = 0;
  let strongestSection = '';
  
  for (const [sectionName, score] of Object.entries(sectionScores)) {
    if (score > highestScore) {
      highestScore = score;
      strongestSection = sectionName;
    }
  }
  
  // Format the section name for better readability
  return strongestSection
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Generate overall suggestions for resume improvement
 * @param {Object} resumeData - Resume data
 * @param {Object} jobData - Job description data
 * @param {Array} matchedKeywords - Matched keywords
 * @param {Array} missingKeywords - Missing keywords
 * @returns {Array} Suggestions for resume improvement
 */
const generateOverallSuggestions = (resumeData, jobData, matchedKeywords, missingKeywords) => {
  const suggestions = [];
  
  // Suggest adding high-importance missing keywords
  const highImportanceKeywords = missingKeywords.filter(k => k.importance === 'high');
  if (highImportanceKeywords.length > 0) {
    suggestions.push({
      title: 'Add Critical Keywords',
      text: `Add these ${highImportanceKeywords.length} critical keywords to your resume: ${highImportanceKeywords.map(k => k.text).join(', ')}`,
      priority: 'high'
    });
  }
  
  // Suggest quantifying achievements
  suggestions.push({
    title: 'Quantify Your Achievements',
    text: 'Add metrics and numbers to your achievements to make them more impactful (e.g., "Increased sales by 23%" instead of "Increased sales").',
    priority: 'medium'
  });
  
  // Suggest tailoring for ATS
  suggestions.push({
    title: 'Format for ATS Compatibility',
    text: 'Ensure your resume uses a clean, ATS-friendly format with standard section headings and avoid using tables, images, or unusual formatting.',
    priority: 'medium'
  });
  
  // Suggest adding industry-specific keywords
  const industryKeywords = missingKeywords.filter(k => k.category === 'Industry Knowledge');
  if (industryKeywords.length > 0) {
    suggestions.push({
      title: 'Add Industry-Specific Terms',
      text: `Include industry terminology like: ${industryKeywords.slice(0, 3).map(k => k.text).join(', ')}`,
      priority: 'low'
    });
  }
  
  return suggestions;
};

/**
 * Generate section-specific recommendations
 * @param {Object} resumeData - Resume data
 * @param {Object} jobData - Job description data
 * @param {Object} sectionScores - Scores for each section
 * @returns {Array} Section recommendations
 */
const generateSectionRecommendations = (resumeData, jobData, sectionScores) => {
  const recommendations = [];
  
  // Experience section
  if (resumeData.sections?.experience) {
    const score = sectionScores.experience || 0;
    let status = 'improve';
    if (score >= 80) status = 'excellent';
    else if (score >= 60) status = 'good';
    
    recommendations.push({
      id: 'experience',
      title: 'Professional Experience',
      status,
      feedback: getExperienceFeedback(score),
      suggestions: [
        'Use action verbs at the beginning of each bullet point',
        'Include quantifiable achievements with metrics',
        'Align your experience descriptions with job requirements'
      ],
      beforeAfter: {
        before: 'Managed a team and improved performance',
        after: 'Led a cross-functional team of 8 engineers, improving sprint velocity by 35% through agile methodology implementation'
      }
    });
  } else {
    recommendations.push({
      id: 'experience',
      title: 'Professional Experience',
      status: 'missing',
      feedback: 'Your resume is missing a dedicated Professional Experience section, which is critical for most job applications.',
      suggestions: [
        'Add a Professional Experience section with your work history',
        'List positions in reverse chronological order',
        'Include company name, your title, and dates of employment',
        'Add 3-5 bullet points describing your responsibilities and achievements'
      ]
    });
  }
  
  // Skills section
  if (resumeData.sections?.skills) {
    const score = sectionScores.skills || 0;
    let status = 'improve';
    if (score >= 80) status = 'excellent';
    else if (score >= 60) status = 'good';
    
    recommendations.push({
      id: 'skills',
      title: 'Skills',
      status,
      feedback: getSkillsFeedback(score, jobData),
      suggestions: [
        'Group skills by category (Technical, Soft Skills, Tools, etc.)',
        'Prioritize skills mentioned in the job description',
        'Remove outdated or irrelevant skills'
      ],
      examples: [
        {
          context: 'Technical Skills Organization',
          content: 'Technical: React, Node.js, TypeScript, GraphQL\nTools: Git, Docker, AWS, Jira\nSoft Skills: Team Leadership, Agile Methodology, Communication'
        }
      ]
    });
  }
  
  // Education section
  if (resumeData.sections?.education) {
    recommendations.push({
      id: 'education',
      title: 'Education',
      status: 'good',
      feedback: 'Your education section is well-structured, but consider adding relevant coursework or achievements if they align with the job requirements.',
      suggestions: [
        'Include relevant coursework if you\'re a recent graduate',
        'Add academic achievements if they relate to the job'
      ]
    });
  }
  
  // Summary section
  if (resumeData.sections?.summary) {
    const score = sectionScores.summary || 0;
    let status = 'improve';
    if (score >= 70) status = 'excellent';
    else if (score >= 50) status = 'good';
    
    recommendations.push({
      id: 'summary',
      title: 'Professional Summary',
      status,
      feedback: 'Your professional summary should be tailored to the specific job and highlight your most relevant qualifications.',
      suggestions: [
        'Keep it concise (3-4 sentences maximum)',
        'Include your years of experience, key skills, and notable achievements',
        'Tailor it to match the job description'
      ],
      beforeAfter: {
        before: 'Experienced software developer with a passion for coding and problem-solving.',
        after: 'Results-oriented Software Engineer with 5+ years of experience in full-stack development using React and Node.js. Proven track record of delivering scalable solutions that improved user engagement by 40% and reduced load times by 60%.'
      }
    });
  }
  
  return recommendations;
};

/**
 * Get feedback for experience section based on score
 * @param {number} score - Section score
 * @returns {string} Feedback text
 */
const getExperienceFeedback = (score) => {
  if (score >= 80) {
    return 'Your experience section is well-aligned with the job requirements. The use of strong action verbs and specific achievements is effective.';
  } else if (score >= 60) {
    return 'Your experience section is good but could be more tailored to this specific role. Try to incorporate more keywords from the job description.';
  } else {
    return 'Your experience section needs significant improvements to match this job description. Focus on highlighting relevant responsibilities and achievements that align with the role.';
  }
};

/**
 * Get feedback for skills section based on score
 * @param {number} score - Section score
 * @param {Object} jobData - Job description data
 * @returns {string} Feedback text
 */
const getSkillsFeedback = (score, jobData) => {
  if (score >= 80) {
    return 'Your skills section is well-aligned with the job requirements. The organization and relevance of skills is excellent.';
  } else if (score >= 60) {
    return 'Your skills section contains many relevant skills, but could be better organized and prioritized based on the job description.';
  } else {
    return 'Your skills section needs to be better aligned with the job requirements. Consider adding more of the technical and soft skills mentioned in the job description.';
  }
}; 