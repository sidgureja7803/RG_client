// LandingPage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './LandingPage.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Three.js setup
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth > 768 ? 500 : window.innerWidth - 40, 400);
    
    // Create document object
    const geometry = new THREE.BoxGeometry(5, 7, 0.2);
    const material = new THREE.MeshBasicMaterial({ 
      color: '#4361ee',
      transparent: true,
      opacity: 0.8,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate document
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.008;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth > 768 ? 500 : window.innerWidth - 40, 400);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  
  // GSAP animations
  useEffect(() => {
    // Hero section animations
    gsap.from(".hero-text h1", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
    
    gsap.from(".hero-text p", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out"
    });
    
    gsap.from(".cta-buttons", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power3.out"
    });
    
    // Canvas animation
    gsap.from(".canvas-container", {
      x: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.2,
      ease: "power3.out"
    });
    
    // Features animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
    
    // Benefits animation
    gsap.from(".benefit-item", {
      scrollTrigger: {
        trigger: ".benefits-section",
        start: "top 80%"
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });
    
    // Testimonials animation
    gsap.from(".testimonial-card", {
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top 80%"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
    
    // CTA section animation
    gsap.from(".cta-section", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="logo">
              <i className="fas fa-file-alt"></i>
              ResumeForge
            </Link>
            
            <div className="mobile-menu-icon" onClick={toggleMenu}>
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            
            <div className={`auth-buttons ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Create Professional Resumes in Minutes</h1>
              <p>
                Stand out from the crowd with our AI-powered resume builder. 
                Customize templates, receive real-time feedback, and optimize 
                your resume for ATS systems.
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
                <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
              </div>
            </div>
            
            <div className="canvas-container">
              <canvas ref={canvasRef} className="three-canvas"></canvas>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section" id="features" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to create the perfect resume</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>ATS Optimization</h3>
              <p>
                Get real-time analysis of how your resume performs with Applicant 
                Tracking Systems. Receive keyword suggestions tailored to your industry.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>Customizable Templates</h3>
              <p>
                Choose from dozens of professionally designed templates. 
                Customize fonts, colors, spacing, and layout to match your personal style.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>AI Content Assistant</h3>
              <p>
                Writer's block? Our AI assistant helps you craft compelling 
                bullet points and descriptions based on your experience.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Expert Feedback</h3>
              <p>
                Receive section-by-section recommendations to improve your resume 
                content, formatting, and overall impact.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tasks"></i>
              </div>
              <h3>Job Description Matcher</h3>
              <p>
                Paste a job description and see how well your resume matches. 
                Get suggestions on what to add or emphasize.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-export"></i>
              </div>
              <h3>Multiple Export Formats</h3>
              <p>
                Export your resume as PDF, DOCX, or plain text. Share directly 
                to LinkedIn or via email with potential employers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="benefits-section" id="benefits">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose ResumeForge?</h2>
            <p>The smarter way to build your professional resume</p>
          </div>
          
          <div className="benefits-container">
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>Increase interview callbacks by up to 250%</p>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>Save hours of resume writing and formatting time</p>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>Pass through ATS systems with optimized keywords</p>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>Create unlimited versions tailored to different jobs</p>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>No design skills required - everything is template-based</p>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-check-circle"></i>
              <p>Expert-crafted content suggestions for every industry</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>See what our users have accomplished</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "I applied to 15 jobs with my old resume and got zero calls. 
                  After using ResumeForge, I got 4 interviews from my next 5 applications!"
                </p>
                <div className="testimonial-author">
                  <h4>Jessica T.</h4>
                  <p>Marketing Professional</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The ATS optimization tool showed me exactly why my resume wasn't 
                  getting through. Fixed the issues and landed my dream job!"
                </p>
                <div className="testimonial-author">
                  <h4>Marcus W.</h4>
                  <p>Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "As a recent graduate, I had no idea how to write a professional resume. 
                  The AI assistant helped me highlight skills I didn't even know I had."
                </p>
                <div className="testimonial-author">
                  <h4>Aisha K.</h4>
                  <p>Recent Graduate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our platform</p>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is ResumeForge really free?</h3>
              <p>
                Yes! Our basic service is completely free. You can create, edit, 
                and download your resume without paying anything.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>How does the ATS optimization work?</h3>
              <p>
                Our system analyzes your resume against common ATS algorithms, 
                checking for proper formatting, keyword density, and readability.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Can I create multiple resumes?</h3>
              <p>
                Absolutely! You can create unlimited resumes and tailor each one 
                for different job applications or industries.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Is my data secure?</h3>
              <p>
                We take data security seriously. Your information is encrypted and 
                never shared with third parties without your explicit permission.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Land Your Dream Job?</h2>
            <p>Create your professional resume in minutes - completely free.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Now</Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <i className="fas fa-file-alt"></i>
              <p>ResumeForge</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Resources</h3>
                <ul>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/guides">Resume Guides</Link></li>
                  <li><Link to="/templates">Templates</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/cookies">Cookies</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-social">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-facebook"></i></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;