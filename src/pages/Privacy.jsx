import React from 'react';
import Navigation from '../components/Navigation';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <Navigation />
      <div className="container">
        <section className="privacy-section">
          <div className="section-header">
            <h1>Privacy Policy</h1>
            <p>Last updated: March 20, 2024</p>
          </div>
          
          <div className="privacy-content">
            <div className="privacy-section">
              <h2>1. Introduction</h2>
              <p>
                At ResumeForge, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our service.
              </p>
            </div>
            
            <div className="privacy-section">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect:</p>
              <ul>
                <li>Name and contact information</li>
                <li>Professional and educational history</li>
                <li>Account credentials</li>
                <li>Payment information</li>
              </ul>
              
              <h3>2.2 Usage Information</h3>
              <p>We automatically collect:</p>
              <ul>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and preferences</li>
                <li>Cookie and tracking data</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Process payments and transactions</li>
                <li>Communicate with you about our services</li>
                <li>Analyze and optimize our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>4. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul>
                <li>Service providers and partners</li>
                <li>Legal authorities when required</li>
                <li>Other parties with your consent</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>
            
            <div className="privacy-section">
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>7. Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your experience. You can control
                cookie settings through your browser preferences.
              </p>
            </div>
            
            <div className="privacy-section">
              <h2>8. Children's Privacy</h2>
              <p>
                Our service is not intended for users under 13 years of age. We do not knowingly
                collect information from children.
              </p>
            </div>
            
            <div className="privacy-section">
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this policy periodically. We will notify you of any material changes
                via email or through our platform.
              </p>
            </div>
            
            <div className="privacy-section">
              <h2>10. Contact Us</h2>
              <p>
                For questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@resumeforge.com">privacy@resumeforge.com</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy; 