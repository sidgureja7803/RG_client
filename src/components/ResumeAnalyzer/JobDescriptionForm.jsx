import React, { useState } from 'react';
import './JobDescriptionForm.css';

const JobDescriptionForm = ({ onSubmit }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (jobDescription.trim().length < 50) newErrors.jobDescription = 'Job description is too short';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Process and submit the job description data
    const jobData = {
      jobTitle,
      company,
      description: jobDescription
    };
    
    onSubmit(jobData);
  };

  return (
    <div className="job-description-form">
      <h3>Paste Job Description</h3>
      <p className="form-subtitle">
        Enter a job description to analyze how well your resume matches the requirements.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title*</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className={errors.jobTitle ? 'error' : ''}
            />
            {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Company (Optional)</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description*</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className={errors.jobDescription ? 'error' : ''}
          />
          {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
        </div>
        
        <div className="form-tips">
          <h4>Tips for best results:</h4>
          <ul>
            <li>Include the complete job description</li>
            <li>Make sure all requirements and responsibilities are included</li>
            <li>Paste the text without formatting</li>
          </ul>
        </div>
        
        <button type="submit" className="analyze-button">
          Analyze My Resume
        </button>
      </form>
    </div>
  );
};

export default JobDescriptionForm; 