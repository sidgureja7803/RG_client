import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeAnalyzer from '../components/ResumeAnalyzer/ResumeAnalyzer';
import './ResumeAnalyzerPage.css';

const ResumeAnalyzerPage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Fetch the user's current resume data
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from an API
        // For demo purposes, we'll use mock data after a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock resume data for demonstration
        const mockResumeData = {
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
          }
        };
        
        setResumeData(mockResumeData);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError('Failed to load your resume. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeData();
  }, []);
  
  const handleBackToResume = () => {
    // In a real application, this would navigate to the resume editor
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
          <button onClick={() => window.location.reload()}>Try Again</button>
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
        
        <ResumeAnalyzer resumeData={resumeData} />
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage; 