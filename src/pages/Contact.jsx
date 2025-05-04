import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <Navigation />
      <div className="container">
        <section className="contact-section">
          <div className="section-header">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-card">
                <i className="fas fa-envelope"></i>
                <h3>Email</h3>
                <p>support@resumeforge.com</p>
              </div>
              
              <div className="info-card">
                <i className="fas fa-clock"></i>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9AM - 6PM EST</p>
              </div>
              
              <div className="info-card">
                <i className="fas fa-comments"></i>
                <h3>Live Chat</h3>
                <p>Available during business hours</p>
              </div>
            </div>
            
            <div className="contact-form">
              <h2>Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact; 