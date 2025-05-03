import React, { useState } from 'react';
import './SectionRecommendations.css';

const SectionRecommendations = ({ sectionRecommendations }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (sectionId) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };
  
  // Helper function to render the section icon based on status
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return (
          <div className="status-icon excellent">
            <span>✓</span>
          </div>
        );
      case 'good':
        return (
          <div className="status-icon good">
            <span>✓</span>
          </div>
        );
      case 'improve':
        return (
          <div className="status-icon improve">
            <span>!</span>
          </div>
        );
      case 'missing':
        return (
          <div className="status-icon missing">
            <span>+</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Helper function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'improve':
        return 'Needs Improvement';
      case 'missing':
        return 'Missing';
      default:
        return '';
    }
  };

  return (
    <div className="section-recommendations">
      <h3 className="recommendations-title">Section Recommendations</h3>
      
      <div className="sections-list">
        {sectionRecommendations.map((section) => (
          <div 
            key={section.id} 
            className={`section-item ${expandedSection === section.id ? 'expanded' : ''}`}
          >
            <div 
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              {renderStatusIcon(section.status)}
              
              <div className="section-title-container">
                <h4 className="section-title">{section.title}</h4>
                <div className={`section-status ${section.status}`}>
                  {getStatusText(section.status)}
                </div>
              </div>
              
              <button className="expand-button">
                {expandedSection === section.id ? '−' : '+'}
              </button>
            </div>
            
            {expandedSection === section.id && (
              <div className="section-content">
                <p className="section-feedback">{section.feedback}</p>
                
                {section.suggestions && section.suggestions.length > 0 && (
                  <div className="section-suggestions">
                    <h5>Suggestions:</h5>
                    <ul>
                      {section.suggestions.map((suggestion, index) => (
                        <li key={index}>
                          <div className="suggestion-bullet"></div>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {section.examples && section.examples.length > 0 && (
                  <div className="section-examples">
                    <h5>Examples:</h5>
                    <div className="examples-list">
                      {section.examples.map((example, index) => (
                        <div key={index} className="example-item">
                          <div className="example-header">
                            <span className="example-label">Example {index + 1}</span>
                            <span className="example-context">{example.context}</span>
                          </div>
                          <div className="example-content">
                            {example.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {section.beforeAfter && (
                  <div className="before-after">
                    <h5>Before vs After:</h5>
                    <div className="before-after-container">
                      <div className="before-container">
                        <div className="before-label">Current</div>
                        <div className="before-content">{section.beforeAfter.before}</div>
                      </div>
                      <div className="arrow">→</div>
                      <div className="after-container">
                        <div className="after-label">Suggested</div>
                        <div className="after-content">{section.beforeAfter.after}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionRecommendations; 