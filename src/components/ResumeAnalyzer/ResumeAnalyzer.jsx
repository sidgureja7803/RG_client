import React, { useState, useEffect } from 'react';
import JobDescriptionForm from './JobDescriptionForm';
import AnalysisDashboard from './AnalysisDashboard';
import KeywordMatch from './KeywordMatch';
import SectionRecommendations from './SectionRecommendations';
import MatchScore from './MatchScore';
import { analyzeResume } from '../../services/analyzerService';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJobDescriptionSubmit = async (description) => {
    setIsLoading(true);
    setError(null);
    setJobDescription(description);
    
    try {
      // Call the analyzer service with resume data and job description
      const result = await analyzeResume(resumeData, description);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resume-analyzer-container">
      <div className="analyzer-header">
        <h2>AI Resume Analyzer & ATS Optimization</h2>
        <p>Optimize your resume for specific job descriptions and increase your chances of getting interviews.</p>
      </div>

      <JobDescriptionForm onSubmit={handleJobDescriptionSubmit} />

      {isLoading && (
        <div className="analysis-loading">
          <div className="spinner"></div>
          <p>Analyzing your resume against the job description...</p>
        </div>
      )}

      {error && (
        <div className="analysis-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-results">
          <MatchScore score={analysisResult.matchScore} />
          
          <div className="analysis-details">
            <div className="analysis-left-panel">
              <KeywordMatch 
                matchedKeywords={analysisResult.matchedKeywords}
                missingKeywords={analysisResult.missingKeywords}
              />
            </div>
            <div className="analysis-right-panel">
              <AnalysisDashboard 
                metrics={analysisResult.metrics}
                overallSuggestions={analysisResult.overallSuggestions}
              />
              <SectionRecommendations 
                sectionRecommendations={analysisResult.sectionRecommendations}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer; 