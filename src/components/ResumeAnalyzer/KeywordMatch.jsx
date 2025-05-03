import React, { useState } from 'react';
import './KeywordMatch.css';

const KeywordMatch = ({ matchedKeywords, missingKeywords }) => {
  const [activeTab, setActiveTab] = useState('matched');

  // Group keywords by category (skills, tools, etc)
  const groupKeywordsByCategory = (keywords) => {
    const categories = {
      'Technical Skills': [],
      'Soft Skills': [],
      'Tools & Technologies': [],
      'Certifications': [],
      'Industry Knowledge': [],
      'Other': []
    };

    keywords.forEach(keyword => {
      const { text, category, importance } = keyword;
      if (categories[category]) {
        categories[category].push({ text, importance });
      } else {
        categories['Other'].push({ text, importance });
      }
    });

    // Filter out empty categories
    return Object.entries(categories)
      .filter(([_, items]) => items.length > 0)
      .reduce((acc, [category, items]) => {
        acc[category] = items;
        return acc;
      }, {});
  };

  const matchedByCategory = groupKeywordsByCategory(matchedKeywords);
  const missingByCategory = groupKeywordsByCategory(missingKeywords);

  // Helper function to get the importance level class
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'high':
        return 'importance-high';
      case 'medium':
        return 'importance-medium';
      case 'low':
        return 'importance-low';
      default:
        return '';
    }
  };
  
  // Helper function to get the importance text
  const getImportanceText = (importance) => {
    switch (importance) {
      case 'high':
        return 'Critical';
      case 'medium':
        return 'Important';
      case 'low':
        return 'Nice to have';
      default:
        return '';
    }
  };

  return (
    <div className="keyword-match-container">
      <h3 className="keyword-match-title">Keyword Matching</h3>
      
      <div className="keyword-tabs">
        <button 
          className={`tab-button ${activeTab === 'matched' ? 'active' : ''}`}
          onClick={() => setActiveTab('matched')}
        >
          <span className="tab-icon matched-icon">✓</span>
          Matched Keywords ({matchedKeywords.length})
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'missing' ? 'active' : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          <span className="tab-icon missing-icon">+</span>
          Missing Keywords ({missingKeywords.length})
        </button>
      </div>
      
      <div className="keyword-content">
        {activeTab === 'matched' ? (
          <div className="matched-keywords">
            {Object.keys(matchedByCategory).length === 0 ? (
              <p className="no-keywords">No matched keywords found. Your resume may need significant updates.</p>
            ) : (
              Object.entries(matchedByCategory).map(([category, keywords]) => (
                <div key={category} className="keyword-category">
                  <h4 className="category-title">{category}</h4>
                  <div className="keyword-list">
                    {keywords.map((keyword, index) => (
                      <div 
                        key={index} 
                        className={`keyword-badge matched ${getImportanceClass(keyword.importance)}`}
                        title={getImportanceText(keyword.importance)}
                      >
                        {keyword.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="missing-keywords">
            {Object.keys(missingByCategory).length === 0 ? (
              <p className="no-keywords">Excellent! Your resume includes all important keywords from the job description.</p>
            ) : (
              <>
                <p className="missing-description">
                  Consider adding these keywords to your resume to improve your match score.
                </p>
                
                {Object.entries(missingByCategory).map(([category, keywords]) => (
                  <div key={category} className="keyword-category">
                    <h4 className="category-title">{category}</h4>
                    <div className="keyword-list">
                      {keywords.map((keyword, index) => (
                        <div 
                          key={index} 
                          className={`keyword-badge missing ${getImportanceClass(keyword.importance)}`}
                          title={getImportanceText(keyword.importance)}
                        >
                          {keyword.text}
                          <span className="importance-indicator"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="importance-legend">
                  <div className="legend-item">
                    <span className="legend-indicator high"></span>
                    <span>Critical</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator medium"></span>
                    <span>Important</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator low"></span>
                    <span>Nice to have</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordMatch; 