import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeAnalyzer from '../components/ResumeAnalyzer/ResumeAnalyzer';
import { getResumeById } from '../services/resumeService';
import { getAnalysisHistory } from '../services/analyzerService';
import { formatDate } from '../utils/dateUtils';
import './ResumeAnalyzerPage.css';

const ResumeAnalyzerPage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { resumeId } = useParams();
  
  // Fetch the user's current resume data and analysis history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (!resumeId) {
          setError('No resume selected. Please choose a resume to analyze.');
          setIsLoading(false);
          return;
        }
        
        // Fetch resume data
        const resume = await getResumeById(resumeId);
        setResumeData(resume);
        
        // Fetch analysis history for this resume
        try {
          const history = await getAnalysisHistory();
          const resumeHistory = history.filter(item => item.resumeId === resumeId);
          setAnalysisHistory(resumeHistory);
        } catch (historyError) {
          console.error('Error fetching analysis history:', historyError);
          // Don't set an error - analysis history is not critical
        }
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError('Failed to load your resume. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [resumeId]);
  
  const handleBackToResume = () => {
    navigate(`/resume-editor/${resumeId}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="resume-analyzer-page loading">
        <div className="spinner"></div>
        <p>Loading your resume data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="resume-analyzer-page error">
        <div className="error-message">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleBackToDashboard}>Back to Dashboard</button>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-analyzer-page">
      <div className="page-header">
        <h1>Resume Analyzer <span className="beta-tag">BETA</span></h1>
        <p>Optimize your resume for specific jobs and increase your interview chances</p>
        
        <div className="header-actions">
          <button className="back-button" onClick={handleBackToResume}>
            &larr; Back to Resume
          </button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="analyzer-intro">
          <div className="intro-card">
            <div className="intro-icon">🔍</div>
            <h3>Match Analysis</h3>
            <p>See how well your resume matches the job description</p>
          </div>
          
          <div className="intro-card">
            <div className="intro-icon">🎯</div>
            <h3>Keyword Optimization</h3>
            <p>Identify missing keywords to include in your resume</p>
          </div>
          
          <div className="intro-card">
            <div className="intro-icon">📊</div>
            <h3>ATS Score</h3>
            <p>Check how well your resume will perform in ATS systems</p>
          </div>
          
          <div className="intro-card">
            <div className="intro-icon">📝</div>
            <h3>Recommendations</h3>
            <p>Get actionable suggestions to improve your resume</p>
          </div>
        </div>
        
        {analysisHistory.length > 0 && (
          <div className="analysis-history">
            <h3>Previous Analyses</h3>
            <div className="history-list">
              {analysisHistory.map(item => (
                <div key={item._id} className="history-item">
                  <div className="history-date">
                    {formatDate(item.timestamp, { format: 'short' })}
                  </div>
                  <div className="history-scores">
                    <span className="match-score">Match: {item.matchScore}%</span>
                    <span className="ats-score">ATS: {item.atsScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <ResumeAnalyzer resumeData={resumeData} />
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage; 