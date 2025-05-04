import React from 'react';
import Navigation from '../components/Navigation';

const Terms = () => {
  return (
    <div className="terms-page">
      <Navigation />
      <div className="container">
        <section className="terms-section">
          <div className="section-header">
            <h1>Terms of Service</h1>
            <p>Last updated: March 20, 2024</p>
          </div>
          
          <div className="terms-content">
            <div className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using ResumeForge's services, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>2. Description of Service</h2>
              <p>
                ResumeForge provides an AI-powered resume creation and optimization platform. Our services include
                resume building, editing, and analysis tools, as well as access to templates and guides.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>3. User Accounts</h2>
              <p>
                To access certain features of our service, you must create an account. You are responsible for
                maintaining the confidentiality of your account information and for all activities under your account.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>4. User Content</h2>
              <p>
                You retain all rights to the content you create using our service. By using ResumeForge, you grant
                us a license to store and process your content to provide our services.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>5. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect,
                use, and protect your personal information.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>6. Prohibited Activities</h2>
              <p>
                Users may not:
              </p>
              <ul>
                <li>Use the service for any illegal purpose</li>
                <li>Upload malicious code or content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' access to the service</li>
              </ul>
            </div>
            
            <div className="terms-section">
              <h2>7. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our service immediately, without prior
                notice or liability, for any reason whatsoever.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material
                changes via email or through our platform.
              </p>
            </div>
            
            <div className="terms-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                <a href="mailto:legal@resumeforge.com">legal@resumeforge.com</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms; 