import React, { useEffect, useRef } from 'react';
import './MatchScore.css';

const MatchScore = ({ score }) => {
  const canvasRef = useRef(null);
  
  // Helper function to determine score text and color based on score value
  const getScoreInfo = (score) => {
    if (score >= 80) {
      return {
        text: 'Excellent Match',
        color: '#059669', // green
        description: 'Your resume is highly aligned with this job description!'
      };
    } else if (score >= 60) {
      return {
        text: 'Good Match',
        color: '#0284c7', // blue
        description: 'Your resume aligns well with this job. A few tweaks could improve your chances.'
      };
    } else if (score >= 40) {
      return {
        text: 'Average Match',
        color: '#d97706', // amber
        description: 'Your resume partially matches this job. Consider updating it based on our suggestions.'
      };
    } else {
      return {
        text: 'Low Match',
        color: '#dc2626', // red
        description: 'Your resume needs significant updates to match this job description.'
      };
    }
  };

  // Draw circular progress gauge on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Draw score arc
    const scoreInfo = getScoreInfo(score);
    const startAngle = -Math.PI / 2; // Start at top
    const endAngle = startAngle + (score / 100) * (2 * Math.PI);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = scoreInfo.color;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Draw score text
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = scoreInfo.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score}%`, centerX, centerY);
    
  }, [score]);

  const scoreInfo = getScoreInfo(score);

  return (
    <div className="match-score-container">
      <h3 className="match-score-title">Resume Match Score</h3>
      
      <div className="match-score-content">
        <div className="gauge-container">
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={200}
            className="score-gauge"
          />
          <div className="match-result" style={{ color: scoreInfo.color }}>
            {scoreInfo.text}
          </div>
        </div>
        
        <div className="match-details">
          <p className="match-description">{scoreInfo.description}</p>
          
          <div className="match-breakdown">
            <h4>Score Breakdown:</h4>
            <div className="score-metrics">
              <div className="score-metric">
                <span>Keywords Match</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${score * 0.8 + Math.random() * 20}%`,
                      backgroundColor: scoreInfo.color 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="score-metric">
                <span>Skills Alignment</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${score * 0.9 + Math.random() * 10}%`,
                      backgroundColor: scoreInfo.color 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="score-metric">
                <span>Experience Match</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${score * 0.7 + Math.random() * 30}%`,
                      backgroundColor: scoreInfo.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScore; 