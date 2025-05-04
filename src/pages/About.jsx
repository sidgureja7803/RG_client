import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const About = () => {
  return (
    <div className="about-page">
      <Navigation />
      <div className="container">
        <section className="about-section">
          <div className="section-header">
            <h1>About ResumeForge</h1>
            <p>Building the future of resume creation</p>
          </div>
          
          <div className="about-content">
            <div className="mission-statement">
              <h2>Our Mission</h2>
              <p>
                At ResumeForge, we're dedicated to empowering job seekers with cutting-edge AI technology
                to create professional, ATS-optimized resumes that stand out in today's competitive job market.
              </p>
            </div>
            
            <div className="values-grid">
              <div className="value-card">
                <i className="fas fa-rocket"></i>
                <h3>Innovation</h3>
                <p>Constantly pushing the boundaries of what's possible in resume creation</p>
              </div>
              
              <div className="value-card">
                <i className="fas fa-users"></i>
                <h3>User-Focused</h3>
                <p>Every feature is designed with our users' success in mind</p>
              </div>
              
              <div className="value-card">
                <i className="fas fa-shield-alt"></i>
                <h3>Trust & Security</h3>
                <p>Your data privacy and security are our top priorities</p>
              </div>
              
              <div className="value-card">
                <i className="fas fa-chart-line"></i>
                <h3>Results-Driven</h3>
                <p>Committed to helping you achieve your career goals</p>
              </div>
            </div>
            
            <div className="team-section">
              <h2>Our Team</h2>
              <p>
                We're a diverse team of developers, designers, and career experts passionate about
                creating the best resume building experience.
              </p>
              
              <div className="cta-section">
                <h3>Ready to build your professional resume?</h3>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 