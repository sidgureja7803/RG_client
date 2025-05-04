// LandingPage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';
import './LandingPage.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const canvasRef = useRef(null);
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Handle link clicks for smooth scrolling
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      
      e.preventDefault();
      const targetId = target.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -100,
          duration: 1.5
        });
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // Three.js setup - Resume visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
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
    
    // Create a realistic resume document
    const pageGeometry = new THREE.BoxGeometry(5, 7, 0.2);
    const pageMaterial = new THREE.MeshStandardMaterial({ 
      color: '#ffffff',
      metalness: 0.1,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    scene.add(page);
    
    // Add wireframe overlay
    const wireframeGeometry = new THREE.BoxGeometry(5.1, 7.1, 0.3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: '#4361ee',
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);
    
    // Add resume content elements
    const lineGeometry = new THREE.BoxGeometry(4, 0.1, 0.1);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: '#f72585' });
    
    // Create header element
    const headerGeometry = new THREE.BoxGeometry(4, 0.8, 0.1);
    const headerMaterial = new THREE.MeshBasicMaterial({ color: '#7209b7' });
    const header = new THREE.Mesh(headerGeometry, headerMaterial);
    header.position.y = 3;
    header.position.z = 0.15;
    page.add(header);
    
    // Create content lines for resume elements
    const contentPositions = [
      { y: 2.0, width: 4 },   // Name
      { y: 1.5, width: 3.8 },  // Contact info
      { y: 0.8, width: 3.9 },  // Experience header
      { y: 0.3, width: 3.5 },  // Job title
      { y: -0.2, width: 3.8 }, // Bullet point
      { y: -0.7, width: 3.2 }, // Bullet point
      { y: -1.2, width: 3.6 }, // Bullet point
      { y: -1.9, width: 3.9 }, // Education header
      { y: -2.4, width: 3.7 }  // Degree
    ];
    
    contentPositions.forEach((pos) => {
      const lineWidth = pos.width || 4;
      const lineGeom = new THREE.BoxGeometry(lineWidth, 0.12, 0.1);
      const line = new THREE.Mesh(lineGeom, lineMaterial);
      line.position.y = pos.y;
      line.position.z = 0.15;
      page.add(line);
    });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // More natural resume animation
      const time = Date.now() * 0.001;
      page.rotation.x = Math.sin(time * 0.5) * 0.1;
      page.rotation.y = Math.sin(time * 0.3) * 0.15 + 0.2;
      
      wireframe.rotation.x = page.rotation.x;
      wireframe.rotation.y = page.rotation.y;
      
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
      pageGeometry.dispose();
      pageMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      headerGeometry.dispose();
      headerMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  // GSAP animations
  useEffect(() => {
    // Split text animation helper function
    const splitTextIntoSpans = (selector) => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        const text = element.innerText;
        const words = text.split(' ');
        
        let html = '';
        words.forEach(word => {
          html += `<span class="word"><span class="word-inner">${word}</span></span> `;
        });
        
        element.innerHTML = html;
      });
    };
    
    // Apply to headings
    splitTextIntoSpans('.hero-text h1, .section-header h2');
    
    // Create stagger effect for hero heading
    gsap.from(".hero-text .word-inner", {
      y: "100%",
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.04
    });
    
    // Hero section animations
    gsap.from(".hero-text p", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      delay: 0.6,
      ease: "power3.out"
    });
    
    gsap.from(".cta-buttons", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.9,
      ease: "power3.out"
    });
    
    // Canvas animation
    gsap.from(".canvas-container", {
      x: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.4,
      ease: "power3.out"
    });
    
    // Animated shapes
    gsap.to(".animated-shape-1", {
      y: -30,
      x: 20,
      rotation: 10,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".animated-shape-2", {
      y: 30,
      x: -20,
      rotation: -10,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".animated-shape-3", {
      y: -20,
      x: 10,
      rotation: 5,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Features section animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
    
    // AI title typewriter effect
    gsap.to(".typewriter-text", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 60%"
      },
      duration: 3,
      text: {
        value: "AI Powered",
        delimiter: ""
      },
      ease: "none"
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
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    // Animated resume sections
    const resumeItems = document.querySelectorAll('.resume-sample-item');
    resumeItems.forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <main ref={mainRef} className="landing-page">
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
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        {/* Animated background shapes */}
        <div className="animated-shape animated-shape-1"></div>
        <div className="animated-shape animated-shape-2"></div>
        <div className="animated-shape animated-shape-3"></div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Get dream jobs with our</h1>
              <div className="ai-title">
                <span className="typewriter-text">AI Powered</span> 
                <span className="title-suffix">resume builder</span>
              </div>
              <p>
                Build a professional and outstanding resume with our free builder and templates.
                Create, customize, and optimize your resume for ATS systems in minutes.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">Create my resume</Link>
                <Link to="/templates" className="btn btn-outline btn-lg">View templates</Link>
              </div>
            </div>
            
            <div className="canvas-container">
              <canvas ref={canvasRef} className="three-canvas"></canvas>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resume Sample Section */}
      <section className="resume-sample-section">
        <div className="container">
          <div className="resume-sample-wrapper">
            <div className="resume-sample">
              <div className="resume-sample-inner">
                <div className="resume-sample-item resume-header">
                  <div className="resume-name">Your Resume</div>
                  <div className="resume-contact">email@example.com | +1 123-456-7890</div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-section-title">Work Experience</div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-job">
                    <span className="company-name">Company A</span> | New York, NY
                  </div>
                  <div className="resume-position">Business Development Manager | Jan 2022 - Present</div>
                  <ul className="resume-bullets">
                    <li>Managed sales cycle from prospect to closing independently</li>
                    <li>Discussed progress with management and developed solutions to improve closing rate by 30%</li>
                    <li>Created sales reports for team leadership with Python and internal data visualization tools</li>
                  </ul>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-job">
                    <span className="company-name">Company B</span> | Brooklyn, NY
                  </div>
                  <div className="resume-position">Administrative Assistant | Aug 2018 - Jul 2020</div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-section-title">Certifications and Licenses</div>
                  <div className="certifications">First Aid Certification, CPR Certification</div>
                </div>
              </div>
            </div>
            
            <div className="resume-tools">
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="tool-label">AI writer</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="tool-label">Easy to match</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="tool-label">Helpful resources</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="tool-label">Build-in jobs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section" id="features" ref={featuresRef}>
        <div className="animated-shape animated-shape-3"></div>
        <div className="container">
          <div className="section-header">
            <h2>Create resumes that get noticed</h2>
            <p>Simple, easy, fast, free</p>
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
      
      {/* Every Detail Section */}
      <section className="detail-section">
        <div className="container">
          <div className="detail-content">
            <div className="detail-text">
              <h2>Every detail on your resume, built to perfection</h2>
              <p>
                Our resume templates are based on what employers actually look for in a candidate. 
                How do we know? We've talked with thousands of employers to get the answers.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">Create my resume</Link>
            </div>
            <div className="detail-resume">
              <img 
                src="https://i.imgur.com/jCtKpLM.png" 
                alt="Detailed Resume Example" 
                className="resume-image"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Cover Letter Section */}
      <section className="coverletter-section">
        <div className="container">
          <div className="section-header">
            <h2>Instantly generate cover letters with AI</h2>
            <Link to="/register" className="create-link">Create cover letter →</Link>
          </div>
          
          <div className="coverletter-example">
            <img 
              src="https://i.imgur.com/KYVnGbU.png" 
              alt="Cover Letter Example" 
              className="coverletter-image"
            />
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
        <div className="animated-shape animated-shape-2"></div>
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
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Now</Link>
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
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;