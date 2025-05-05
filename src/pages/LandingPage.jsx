import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.css';
import { Link } from 'react-router-dom';

// Import icons
import { ArrowRight, Check, ChevronDown, FileText, Search, Award, Zap, BarChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after all resources are loaded
    window.addEventListener('load', () => setIsLoaded(true));
    
    // Ensure everything is loaded
    if (document.readyState === 'complete') {
      setIsLoaded(true);
    }

    // Clean up all GSAP animations and ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  useEffect(() => {
    // Wait for content to load before initiating animations
    if (!isLoaded) return;

    // Create a main timeline for better performance
    const mainTimeline = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        duration: 0.5,
      }
    });

    // Header animation - optimized
    mainTimeline.from(headerRef.current, {
      y: -20,
      opacity: 0,
    });

    // Hero section animations with safer selectors and better performance
    if (document.querySelector('.hero-title')) {
      mainTimeline.from('.hero-title', {
        opacity: 0,
        y: 20,
        duration: 0.6,
      }, '-=0.2');
    }

    mainTimeline.from('.hero-subtitle', {
      opacity: 0,
      y: 15,
    }, '-=0.3');

    mainTimeline.from('.hero-cta', {
      opacity: 0,
      y: 15,
    }, '-=0.3');

    mainTimeline.from('.hero-image', {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
    }, '-=0.4');

    // Optimize scroll animations with light-weight approach
    // Features section animations - lighten the load
    if (featuresRef.current) {
      gsap.set('.feature-card', { opacity: 0, y: 30 });
      
      ScrollTrigger.batch('.feature-card', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          overwrite: true
        }),
        once: true,
      });
    }

    // How it works animations - with better scrolltrigger config
    if (howItWorksRef.current) {
      gsap.set('.step', { opacity: 0, x: -20 });
      
      ScrollTrigger.batch('.step', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          overwrite: true
        }),
        once: true,
      });
    }

    // Testimonials animations - with simpler approach
    gsap.set('.testimonial', { opacity: 0, y: 30 });
    
    ScrollTrigger.batch('.testimonial', {
      start: 'top 85%',
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        overwrite: true
      }),
      once: true,
    });

    // Pricing card animations - with simple approach
    gsap.set('.pricing-card', { opacity: 0, y: 30 });
    
    ScrollTrigger.batch('.pricing-card', {
      start: 'top 85%',
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        overwrite: true
      }),
      once: true,
    });

    // CTA section animation - improved
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
      });
    }

    // Optimized scroll indicator animation
    gsap.to('.scroll-indicator', {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power1.inOut',
    });

  }, [isLoaded]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header ref={headerRef} className="header">
        <div className="logo">
          <span className="logo-text">ResumeAI</span>
          <span className="logo-dot"></span>
        </div>
        <nav className="nav">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-secondary">Log in</Link>
          <Link to="/register" className="btn btn-primary">Sign up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Resume Analysis & ATS Optimization
          </h1>
          <p className="hero-subtitle">
            Supercharge your job applications with our AI Resume Analyzer. Match your resume to job descriptions, optimize for ATS systems, and land more interviews.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large">
              Try For Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-large">
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">85%</span>
              <span className="stat-label">Higher Interview Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Resumes Optimized</span>
            </div>
            <div className="stat">
              <span className="stat-number">96%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/api/placeholder/800/600" alt="Resume Analysis Dashboard" loading="eager" />
        </div>
        <div className="scroll-indicator" onClick={() => scrollToSection('features')}>
          <p>Scroll to explore</p>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="features">
        <div className="section-header">
          <h2>Powerful AI Features</h2>
          <p>Our resume analyzer gives you the competitive edge in your job search</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Search size={32} />
            </div>
            <h3>Keyword Matching</h3>
            <p>Instantly identify matching keywords between your resume and the job description.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={32} />
            </div>
            <h3>Section Analysis</h3>
            <p>Get section-by-section recommendations to improve your resume's impact.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart size={32} />
            </div>
            <h3>Match Score</h3>
            <p>See your compatibility score and understand how well you match the job requirements.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>ATS Optimization</h3>
            <p>Ensure your resume passes through Applicant Tracking Systems with flying colors.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3>Industry Standards</h3>
            <p>Get suggestions based on industry best practices and standards.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Search size={32} />
            </div>
            <h3>Missing Skills Detection</h3>
            <p>Identify important skills and qualifications missing from your resume.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to optimize your resume for any job application</p>
        </div>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Your Resume</h3>
              <p>Upload your existing resume in any format - PDF, DOCX, or plain text.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Paste Job Description</h3>
              <p>Copy and paste the job description you're applying for into our analyzer.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Instant Analysis</h3>
              <p>Our AI analyzes compatibility, keywords, and provides improvement suggestions.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Optimize & Download</h3>
              <p>Make the suggested improvements and download your ATS-optimized resume.</p>
            </div>
          </div>
        </div>
        
        <div className="demo-container">
          <img src="/api/placeholder/900/500" alt="Resume Analysis Demo" className="demo-image" loading="lazy" />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>See how our users are landing their dream jobs</p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"Within two weeks of optimizing my resume with ResumeAI, I landed three interviews and ultimately received my dream job offer at a Fortune 500 company."</p>
            </div>
            <div className="testimonial-author">
              <img src="/api/placeholder/60/60" alt="User" className="author-image" loading="lazy" />
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Software Engineer</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"The keyword matching feature helped me understand exactly what recruiters were looking for. My interview rate jumped from 5% to over 30% after using ResumeAI!"</p>
            </div>
            <div className="testimonial-author">
              <img src="/api/placeholder/60/60" alt="User" className="author-image" loading="lazy" />
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>Marketing Director</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"As a career changer, I was struggling to highlight my transferable skills. The section-by-section analysis helped me restructure my resume and land interviews in a new industry."</p>
            </div>
            <div className="testimonial-author">
              <img src="/api/placeholder/60/60" alt="User" className="author-image" loading="lazy" />
              <div className="author-info">
                <h4>Priya Patel</h4>
                <p>Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Simple Pricing</h2>
          <p>Choose the plan that works for your job search needs</p>
        </div>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Free</h3>
              <p className="price">$0</p>
              <p>For casual job seekers</p>
            </div>
            <div className="pricing-features">
              <div className="feature">
                <Check size={20} />
                <p>3 resume analyses per month</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Basic keyword matching</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Match score calculation</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-full">Get Started</button>
          </div>
          
          <div className="pricing-card featured">
            <div className="popular-tag">Most Popular</div>
            <div className="pricing-header">
              <h3>Pro</h3>
              <p className="price">$12<span>/month</span></p>
              <p>For active job seekers</p>
            </div>
            <div className="pricing-features">
              <div className="feature">
                <Check size={20} />
                <p>Unlimited resume analyses</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Advanced keyword optimization</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Section-by-section recommendations</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>ATS compatibility check</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Industry-specific suggestions</p>
              </div>
            </div>
            <button className="btn btn-primary btn-full">Start 7-Day Trial</button>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Enterprise</h3>
              <p className="price">Custom</p>
              <p>For teams & organizations</p>
            </div>
            <div className="pricing-features">
              <div className="feature">
                <Check size={20} />
                <p>All Pro features</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Multi-user accounts</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>API access</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Custom integration</p>
              </div>
              <div className="feature">
                <Check size={20} />
                <p>Priority support</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-full">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="cta">
        <div className="cta-content">
          <h2>Ready to Land More Interviews?</h2>
          <p>Join thousands of job seekers who are optimizing their resumes and getting noticed by employers.</p>
          <button className="btn btn-primary btn-large">
            Get Started For Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-column">
            <div className="logo">
              <span className="logo-text">ResumeAI</span>
              <span className="logo-dot"></span>
            </div>
            <p>AI-powered resume optimization to help you land your dream job.</p>
            <div className="social-icons">
              {/* Social icons would go here */}
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
              <li><a href="#">Resume Templates</a></li>
              <li><a href="#">Career Resources</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;