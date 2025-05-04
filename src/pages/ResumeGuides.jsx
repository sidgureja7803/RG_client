import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ResumeGuides = () => {
  const guides = [
    {
      id: 1,
      title: 'Resume Sections Guide',
      description: 'Learn how to structure each section of your resume for maximum impact.',
      icon: 'fas fa-layer-group',
      topics: ['Header & Contact Info', 'Professional Summary', 'Work Experience', 'Education', 'Skills']
    },
    {
      id: 2,
      title: 'Writing Effective Bullet Points',
      description: 'Master the art of writing compelling achievement-based bullet points.',
      icon: 'fas fa-list',
      topics: ['Action Verbs', 'Quantifiable Results', 'Skills Integration', 'Format & Length']
    },
    {
      id: 3,
      title: 'ATS Optimization Guide',
      description: 'Ensure your resume gets past Applicant Tracking Systems.',
      icon: 'fas fa-robot',
      topics: ['Keyword Optimization', 'Format Requirements', 'Common Mistakes', 'Testing Tools']
    },
    {
      id: 4,
      title: 'Industry-Specific Tips',
      description: 'Tailored advice for different career fields and industries.',
      icon: 'fas fa-briefcase',
      topics: ['Tech', 'Finance', 'Healthcare', 'Marketing', 'Engineering']
    }
  ];

  return (
    <div className="guides-page">
      <Navigation />
      <div className="container">
        <section className="guides-section">
          <div className="section-header">
            <h1>Resume Writing Guides</h1>
            <p>Comprehensive resources to help you create the perfect resume</p>
          </div>
          
          <div className="guides-grid">
            {guides.map(guide => (
              <div key={guide.id} className="guide-card">
                <div className="guide-icon">
                  <i className={guide.icon}></i>
                </div>
                
                <div className="guide-content">
                  <h2>{guide.title}</h2>
                  <p>{guide.description}</p>
                  
                  <div className="topics-list">
                    <h3>Topics Covered:</h3>
                    <ul>
                      {guide.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={`/guides/${guide.id}`} className="btn btn-outline">
                    Read Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="guides-cta">
            <div className="cta-content">
              <h2>Ready to put these tips into practice?</h2>
              <p>Use our AI-powered resume builder to create your perfect resume</p>
              <Link to="/register" className="btn btn-primary">
                Start Building
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeGuides; 