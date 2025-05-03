import React from 'react';
import './AnalysisDashboard.css';

const AnalysisDashboard = ({ metrics, overallSuggestions }) => {
  return (
    <div className="analysis-dashboard">
      <h3 className="dashboard-title">Overall Analysis</h3>
      
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h4 className="metric-name">{metric.name}</h4>
              <div className="metric-value-container">
                <div className="metric-value">{metric.value}</div>
                {metric.change && (
                  <div className={`metric-change ${metric.change > 0 ? 'positive' : metric.change < 0 ? 'negative' : ''}`}>
                    {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : ''} {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
              <p className="metric-description">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="suggestions-container">
        <h4 className="suggestions-title">Overall Suggestions</h4>
        <div className="suggestion-list">
          {overallSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <div className={`suggestion-priority ${suggestion.priority}`}>
                {suggestion.priority === 'high' ? '!' : suggestion.priority === 'medium' ? '+' : 'i'}
              </div>
              <div className="suggestion-content">
                <h5 className="suggestion-title">{suggestion.title}</h5>
                <p className="suggestion-text">{suggestion.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard; 