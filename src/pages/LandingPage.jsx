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
      smooth: true,
      mouseMultiplier: 1,
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Create a realistic resume document
    const pageGeometry = new THREE.BoxGeometry(5, 7, 0.2);
    const pageMaterial = new THREE.MeshPhysicalMaterial({ 
      color: '#ffffff',
      metalness: 0.1,
      roughness: 0.2,
      reflectivity: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    });
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    page.castShadow = true;
    page.receiveShadow = true;
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
    
    // Add resume content elements with more modern colors
    const colors = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'];
    
    // Create header element
    const headerGeometry = new THREE.BoxGeometry(4, 0.8, 0.1);
    const headerMaterial = new THREE.MeshPhongMaterial({ 
      color: colors[1],
      specular: 0x050505,
      shininess: 100
    });
    const header = new THREE.Mesh(headerGeometry, headerMaterial);
    header.position.y = 3;
    header.position.z = 0.15;
    page.add(header);
    
    // Create content lines for resume elements with varied colors
    const contentPositions = [
      { y: 2.0, width: 4, color: colors[0] },   // Name
      { y: 1.5, width: 3.8, color: colors[0] },  // Contact info
      { y: 0.8, width: 3.9, color: colors[2] },  // Experience header
      { y: 0.3, width: 3.5, color: colors[3] },  // Job title
      { y: -0.2, width: 3.8, color: colors[3] }, // Bullet point
      { y: -0.7, width: 3.2, color: colors[3] }, // Bullet point
      { y: -1.2, width: 3.6, color: colors[3] }, // Bullet point
      { y: -1.9, width: 3.9, color: colors[2] }, // Education header
      { y: -2.4, width: 3.7, color: colors[4] }  // Degree
    ];
    
    const lines = [];
    contentPositions.forEach((pos, index) => {
      const lineWidth = pos.width || 4;
      const lineGeom = new THREE.BoxGeometry(lineWidth, 0.12, 0.1);
      const lineMat = new THREE.MeshPhongMaterial({ 
        color: pos.color,
        specular: 0x111111,
        shininess: 30
      });
      const line = new THREE.Mesh(lineGeom, lineMat);
      line.position.y = pos.y;
      line.position.z = 0.15;
      line.userData = { originalY: pos.y };
      lines.push(line);
      page.add(line);
    });
    
    // Add floating particles around the resume
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 30;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      // x, y, z coordinates
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: '#4cc9f0',
      transparent: true,
      alpha: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add a spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0x4361ee, 1);
    spotLight.position.set(-10, 10, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Create a circular plane for the resume to cast shadow onto
    const planeGeometry = new THREE.CircleGeometry(8, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: '#f8f9fa',
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -4;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    // Add mouse move listener for interactive effect
    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update targets with easing
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      
      // Move the camera based on mouse position
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Rotate resume naturally
      const time = Date.now() * 0.001;
      page.rotation.x = Math.sin(time * 0.3) * 0.1;
      page.rotation.y = Math.sin(time * 0.2) * 0.1 + 0.2;
      page.position.y = Math.sin(time * 0.4) * 0.3;
      
      // Match wireframe to page
      wireframe.rotation.x = page.rotation.x;
      wireframe.rotation.y = page.rotation.y;
      wireframe.position.y = page.position.y;
      
      // Animate content lines
      lines.forEach((line, index) => {
        line.position.y = line.userData.originalY + Math.sin(time * 0.5 + index * 0.2) * 0.1;
      });
      
      // Rotate and move particles
      particlesMesh.rotation.x = time * 0.1;
      particlesMesh.rotation.y = time * 0.05;
      
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
      document.removeEventListener('mousemove', onDocumentMouseMove);
      
      // Clean up Three.js resources
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
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
    
    // Create initial timeline for hero section
    const heroTimeline = gsap.timeline({
      defaults: { ease: "power3.out" }
    });
    
    // Hero animations
    heroTimeline
      .from(".hero-text .word-inner", {
        y: "100%",
        opacity: 0,
        duration: 1,
        stagger: 0.04
      })
      .from(".hero-text p", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1
      }, "-=0.4")
      .from(".cta-buttons .btn", {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2
      }, "-=0.6")
      .from(".canvas-container", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.7)"
      }, "-=1.2")
      .from(".animated-shape", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=1.5");
    
    // Resume sample section
    gsap.from(".resume-sample", {
      scrollTrigger: {
        trigger: ".resume-sample-section",
        start: "top 70%",
        end: "top 30%",
        toggleActions: "play none none reverse"
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    // Resume items animation
    gsap.from(".resume-sample-item", {
      scrollTrigger: {
        trigger: ".resume-sample",
        start: "top 70%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power2.out"
    });
    
    // Resume tools animation
    gsap.from(".resume-tool", {
      scrollTrigger: {
        trigger: ".resume-tools",
        start: "top 80%",
      },
      x: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)"
    });
    
    // Animated shapes with movement
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
    
    // Features section animation
    const featuresTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 70%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });
    
    featuresTimeline
      .from(".section-header", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .from(".feature-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.4");
    
    // AI title typewriter effect with cursor
    gsap.to(".typewriter-text", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 60%"
      },
      duration: 2,
      text: {
        value: "AI Powered",
        delimiter: ""
      },
      ease: "none",
      onComplete: () => {
        // Add blinking cursor after typing is complete
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        document.querySelector('.typewriter-text').appendChild(cursor);
        
        gsap.to('.typing-cursor', {
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: 0.5
        });
      }
    });
    
    // CTA section animation with attention-grabbing effect
    const ctaTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%"
      }
    });
    
    ctaTimeline
      .from(".cta-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(".cta-content .btn", {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .to(".cta-content .btn", {
        boxShadow: "0 0 15px rgba(66, 133, 244, 0.8)",
        repeat: 3,
        yoyo: true,
        duration: 0.5
      }, "+=0.5");
    
    // Footer animation
    gsap.from(".footer-content > *", {
      scrollTrigger: {
        trigger: ".footer",
        start: "top 90%"
      },
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Scroll-triggered parallax background effect
    gsap.to(".landing-page", {
      backgroundPosition: `50% ${innerHeight / 2}px`,
      ease: "none",
      scrollTrigger: {
        trigger: ".landing-page",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
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
              <li><a href="#templates">Templates</a></li>
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
                <Link to="/templates/public" className="btn btn-outline btn-lg">View templates</Link>
              </div>
            </div>
            
            <div className="canvas-container">
              <canvas ref={canvasRef} className="three-canvas"></canvas>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resume Sample Section */}
      <section className="resume-sample-section" id="templates">
        <div className="container">
          <div className="section-header">
            <h2>Professional Resume Templates</h2>
            <p>Choose from our extensive collection of modern templates</p>
          </div>
          <div className="resume-sample-wrapper">
            <div className="resume-sample">
              <div className="resume-sample-inner">
                <div className="resume-sample-item resume-header">
                  <div className="resume-name">John Doe</div>
                  <div className="resume-contact">johndoe@example.com | (555) 123-4567 | linkedin.com/in/johndoe</div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-section-title">Professional Summary</div>
                  <div className="resume-summary">
                    Dedicated software engineer with 5+ years of experience developing scalable web applications.
                    Proficient in React, Node.js, and cloud architecture. Passionate about creating elegant solutions
                    to complex problems.
                  </div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-section-title">Work Experience</div>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-job">
                    <span className="company-name">TechCorp Inc.</span> | San Francisco, CA
                  </div>
                  <div className="resume-position">Senior Software Engineer | Jan 2020 - Present</div>
                  <ul className="resume-bullets">
                    <li>Led development of microservices architecture that improved system reliability by 45%</li>
                    <li>Implemented CI/CD pipeline that reduced deployment time by 65%</li>
                    <li>Mentored junior developers and conducted code reviews for team of 8 engineers</li>
                  </ul>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-job">
                    <span className="company-name">InnovateTech</span> | New York, NY
                  </div>
                  <div className="resume-position">Software Developer | Aug 2017 - Dec 2019</div>
                  <ul className="resume-bullets">
                    <li>Developed responsive web applications using React and Redux</li>
                    <li>Collaborated with UX team to implement intuitive user interfaces</li>
                  </ul>
                </div>
                
                <div className="resume-sample-item">
                  <div className="resume-section-title">Education</div>
                  <div className="education-item">
                    <div><strong>Bachelor of Science in Computer Science</strong></div>
                    <div>University of Technology | Graduated 2017</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="resume-tools">
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="tool-label">AI Content Writer</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="tool-label">ATS Optimized</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-file-export"></i>
                </div>
                <div className="tool-label">Multiple Export Formats</div>
              </div>
              
              <div className="resume-tool">
                <div className="tool-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="tool-label">Job Matching</div>
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
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Privacy Protection</h3>
              <p>
                Your data is secure and private. We never share your information
                with third parties without your explicit permission.
              </p>
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
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Resources</h3>
                <ul>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/guides">Resume Guides</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
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