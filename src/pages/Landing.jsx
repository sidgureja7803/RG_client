import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Power3, Power4 } from 'gsap';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Components for our design system
const Button = ({ children, primary, to, onClick, className = '' }) => {
  return (
    <RouterLink
      to={to}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-all duration-300 transform hover:scale-105 ${
        primary
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
          : 'border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600'
      } ${className}`}
    >
      {children}
    </RouterLink>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:translate-y-[-8px] border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const GradientText = ({ children, className = '' }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 ${className}`}>
      {children}
    </span>
  );
};

const Landing = () => {
  const threeJsContainerRef = useRef(null);
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const aiDemoRef = useRef(null);
  const typingTextRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ThreeJS setup and animation
  useEffect(() => {
    if (!threeJsContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(threeJsContainerRef.current.clientWidth, threeJsContainerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeJsContainerRef.current.appendChild(renderer.domElement);

    // Create an array of resume-like floating papers
    const papers = [];
    const paperGeometry = new THREE.PlaneGeometry(1, 1.4);
    
    // Create materials with different colors
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xe3f2fd, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0xbbdefb, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0x90caf9, side: THREE.DoubleSide }),
    ];

    // Create 20 floating papers
    for (let i = 0; i < 20; i++) {
      const paper = new THREE.Mesh(paperGeometry, materials[i % materials.length]);
      
      // Random position in a dome-like shape
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const r = 3 + Math.random() * 3;
      
      paper.position.x = r * Math.sin(phi) * Math.cos(theta);
      paper.position.y = r * Math.sin(phi) * Math.sin(theta) - 1;
      paper.position.z = r * Math.cos(phi) - 4;
      
      // Random rotation
      paper.rotation.x = Math.random() * Math.PI;
      paper.rotation.y = Math.random() * Math.PI;
      paper.rotation.z = Math.random() * Math.PI;
      
      // Add animation data
      paper.userData = {
        floatSpeed: 0.2 + Math.random() * 0.3,
        rotateSpeed: 0.01 + Math.random() * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
      };
      
      scene.add(paper);
      papers.push(paper);
    }

    // Position camera
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Animate each paper
      papers.forEach(paper => {
        const { floatSpeed, rotateSpeed, floatOffset } = paper.userData;
        
        // Gentle floating effect
        paper.position.y += Math.sin(time * floatSpeed + floatOffset) * 0.003;
        
        // Slow rotation
        paper.rotation.x += rotateSpeed * 0.2;
        paper.rotation.y += rotateSpeed * 0.15;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = threeJsContainerRef.current.clientWidth / threeJsContainerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeJsContainerRef.current.clientWidth, threeJsContainerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      threeJsContainerRef.current.removeChild(renderer.domElement);
      scene.clear();
      renderer.dispose();
    };
  }, [isLoaded]);

  // GSAP animations
  useEffect(() => {
    setIsLoaded(true);

    // Hero section animations
    const heroTl = gsap.timeline({ defaults: { ease: Power3.easeOut } });
    
    heroTl.from(headingRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2
    });
    
    heroTl.from(subheadingRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8
    }, "-=0.4");
    
    heroTl.from(ctaRef.current.children, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2
    }, "-=0.4");

    // Typing animation for the AI section
    const typingTexts = [
      "Suggesting impactful action verbs...",
      "Optimizing for ATS systems...",
      "Tailoring to job descriptions...",
      "Analyzing keyword optimization..."
    ];

    let currentIndex = 0;
    
    const typeText = () => {
      if (!typingTextRef.current) return;
      
      gsap.to(typingTextRef.current, {
        duration: 1.5,
        text: typingTexts[currentIndex],
        ease: "none",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(typingTextRef.current, {
              duration: 0.7,
              text: "",
              ease: "none",
              onComplete: () => {
                currentIndex = (currentIndex + 1) % typingTexts.length;
                typeText();
              }
            });
          }, 1500);
        }
      });
    };
    
    typeText();

    // Scroll animations
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: Power4.easeOut
      });
    }

    if (benefitsRef.current) {
      gsap.from(benefitsRef.current.children, {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: Power3.easeOut
      });
    }

    if (aiDemoRef.current) {
      gsap.from(aiDemoRef.current, {
        scrollTrigger: {
          trigger: aiDemoRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: Power3.easeOut
      });
    }

    // Clean up ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded]);

  const features = [
    {
      icon: "✏️",
      title: "AI Resume Tailoring",
      description: "Our AI analyzes job descriptions and tailors your resume to highlight relevant skills and experience."
    },
    {
      icon: "🔍",
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems with our smart keyword optimization."
    },
    {
      icon: "👥",
      title: "Real-Time Collaboration",
      description: "Share your resume with mentors and peers for instant feedback and suggestions."
    },
    {
      icon: "🎨",
      title: "Interactive Preview",
      description: "See changes in real-time with our interactive resume preview and customize every visual element."
    },
    {
      icon: "🧩",
      title: "Drag & Drop Editor",
      description: "Easily arrange sections with our intuitive drag and drop interface for perfect formatting."
    },
    {
      icon: "🔗",
      title: "Job Matching",
      description: "Get personalized job recommendations based on your skills and experience."
    }
  ];

  const benefits = [
    "Stand out with professionally designed templates",
    "Save time with AI-powered content suggestions",
    "Improve your chances with ATS optimization",
    "Get expert feedback through collaboration",
    "Match with relevant job opportunities",
    "Export in multiple formats or share a live link"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Resume</span>
            <span className="text-2xl font-bold text-gray-800">Craft</span>
            <span className="text-2xl font-bold text-blue-600">AI</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#ai-demo" className="text-gray-600 hover:text-blue-600 transition-colors">AI Demo</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <div className="flex space-x-3">
            <Button to="/login">Sign In</Button>
            <Button to="/register" primary>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div ref={heroRef} className="z-10">
            <h1 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              Craft Your <GradientText>Perfect Resume</GradientText> With AI Precision
            </h1>
            <p ref={subheadingRef} className="text-xl text-gray-700 mb-8 leading-relaxed">
              Create a standout resume that gets noticed. Our AI-powered platform analyzes job descriptions, optimizes for ATS systems, and provides real-time editing with expert collaboration.
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Button to="/register" primary className="text-lg py-4 px-8">
                Create Your Resume Free
              </Button>
              <Button to="/templates" className="text-lg py-4 px-8">
                Explore Templates
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px]" ref={threeJsContainerRef}>
            {/* Three.js container - 3D animated resumes will render here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-xl w-64 border border-gray-200 transform rotate-6 z-30">
                <div className="h-8 bg-blue-600 mb-3 rounded"></div>
                <div className="flex gap-2 mb-3">
                  <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="container mx-auto px-4 mt-12">
          <div className="bg-white rounded-xl shadow-lg py-6 px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25k+</div>
              <div className="text-gray-600 mt-1">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">89%</div>
              <div className="text-gray-600 mt-1">Interview Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15+</div>
              <div className="text-gray-600 mt-1">ATS-Approved Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9/5</div>
              <div className="text-gray-600 mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features to <GradientText>Land Your Dream Job</GradientText></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology with professional design to help you create the perfect resume tailored to your dream job.
            </p>
          </div>
          
          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How <GradientText>ResumeCraftAI</GradientText> Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes creating a professional resume simple and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and import your LinkedIn profile or enter your work history, education, and skills.",
                icon: "👤"
              },
              {
                step: "2",
                title: "Choose a Template",
                description: "Select from our library of ATS-optimized templates designed for your industry.",
                icon: "🎨"
              },
              {
                step: "3",
                title: "AI Optimization",
                description: "Paste job descriptions and let our AI tailor your resume to highlight relevant experience.",
                icon: "⚙️"
              },
              {
                step: "4",
                title: "Download & Apply",
                description: "Export your resume in multiple formats, share it online, or apply directly to jobs.",
                icon: "🚀"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line between steps */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 z-0" style={{ width: 'calc(100% - 3rem)' }}></div>
                )}
                
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative z-10">
                  <div className="flex justify-center items-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Professional Resume?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Join thousands of job seekers who have boosted their career opportunities with ResumeCraftAI.
          </p>
          <Button to="/register" className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Get Started Free
          </Button>
          <p className="mt-6 opacity-80 text-sm">No credit card required. Free plan available.</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ResumeCraftAI</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Resume Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Checker</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job Matching</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Examples</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cover Letter Tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl font-bold text-blue-400">Resume</span>
              <span className="text-2xl font-bold text-white">Craft</span>
              <span className="text-2xl font-bold text-blue-400">AI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.16c-.94.42-1.94.7-3 .82 1.07-.64 1.9-1.66 2.3-2.88-1.03.61-2.17 1.06-3.38 1.3C16.95 3.4 15.8 3 14.5 3c-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.12 1.03-3.73-.19-7.05-1.98-9.26-4.7-.39.67-.61 1.45-.61 2.28 0 1.56.8 2.95 2 3.77-.73-.03-1.43-.23-2.05-.57v.06c0 2.18 1.55 4 3.61 4.44-.38.1-.78.16-1.19.16-.29 0-.57-.03-.85-.08.57 1.8 2.24 3.1 4.21 3.14-1.55 1.2-3.5 1.93-5.61 1.93-.37 0-.73-.02-1.08-.07 2 1.28 4.38 2.03 6.94 2.03 8.31 0 12.86-6.9 12.86-12.86 0-.2 0-.4-.02-.6.88-.64 1.64-1.44 2.24-2.34z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.68 0H1.32C.6 0 0 .6 0 1.32v21.36C0 23.4.6 24 1.32 24h11.5v-9.28H9.7v-3.63h3.13V8.4c0-3.1 1.9-4.8 4.67-4.8 1.33 0 2.47.1 2.8.14v3.25h-1.92c-1.5 0-1.8.7-1.8 1.75v2.3h3.6l-.47 3.63h-3.13V24h6.1c.73 0 1.32-.6 1.32-1.32V1.32C24 .6 23.4 0 22.68 0z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} ResumeCraftAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

      {/* AI Demo Section */}
      <section id="ai-demo" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <GradientText>AI-Powered</GradientText> Resume Building
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Watch our AI assistant analyze job descriptions and transform your resume in real-time to match the requirements and stand out from the competition.
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 mb-8">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-4">
                    AI
                  </div>
                  <div ref={typingTextRef} className="text-gray-800 font-medium min-h-[28px]"></div>
                  <div className="animate-pulse ml-1">|</div>
                </div>
                
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} ref={(el) => {
                      if (benefitsRef.current && !benefitsRef.current[index]) {
                        benefitsRef.current[index] = el;
                      }
                    }} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div ref={aiDemoRef} className="relative">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gray-800 h-10 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-1/3 space-y-4">
                      <div className="bg-blue-100 p-2 rounded text-blue-800 text-sm font-medium">Job Description</div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                      
                      <div className="bg-green-100 p-2 rounded text-green-800 text-sm font-medium mt-4">Keywords Detected</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">React</span>
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">UI/UX</span>
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">Frontend</span>
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">Design</span>
                      </div>
                    </div>
                    
                    <div className="w-2/3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="text-center mb-4">
                        <div className="h-6 bg-blue-600 w-40 mx-auto rounded"></div>
                        <div className="h-4 bg-gray-200 w-56 mx-auto rounded mt-2"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="h-5 bg-gray-800 w-32 rounded mb-2"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="h-5 bg-gray-800 w-32 rounded mb-2"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="h-5 bg-gray-800 w-32 rounded mb-2"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                        AI
                      </div>
                      <div className="text-blue-800 font-medium">Suggestions</div>
                    </div>
                    <div className="text-sm text-blue-700 ml-11">
                      Highlighted skills match 85% of job requirements. Consider adding more details about your React experience.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated elements around the demo */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials in carousel format */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thousands of job seekers have used our platform to create resumes that get results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Software Developer",
                image: "/avatar1.jpg",
                text: "The AI suggestions were spot-on! I received interview calls from 4 out of 6 companies I applied to."
              },
              {
                name: "Sarah Williams",
                role: "Marketing Specialist",
                image: "/avatar2.jpg",
                text: "The real-time collaboration feature allowed my mentor to provide valuable feedback that improved my resume significantly."
              },
              {
                name: "Michael Chen",
                role: "Data Analyst",
                image: "/avatar3.jpg",
                text: "The ATS optimization feature ensured my resume was seen by recruiters. I landed my dream job within 3 weeks!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.text}"</p>
                <div className="mt-4 text-yellow-500">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent <GradientText>Pricing</GradientText></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core resume building features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for creating a basic resume",
                features: [
                  "1 resume template",
                  "Basic AI suggestions",
                  "PDF export",
                  "ATS compatibility check"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "$12",
                period: "/month",
                description: "Everything you need for job hunting",
                features: [
                  "All Free features",
                  "All premium templates",
                  "Advanced AI tailoring",
                  "Real-time collaboration",
                  "Multiple resume versions",
                  "LinkedIn integration"
                ],
                cta: "Go Pro",
                popular: true
              },
              {
                name: "Teams",
                price: "$29",
                period: "/month",
                description: "Perfect for career coaches & teams",
                features: [
                  "All Pro features",
                  "Team collaboration",
                  "Analytics dashboard",
                  "Priority support",
                  "Custom branding",
                  "API access"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 border-2 ${
                  plan.popular 
                    ? 'border-blue-500 bg-white shadow-xl scale-105' 
                    : 'border-gray-200 bg-white shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 px-2 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  to={plan.popular ? "/register" : plan.name === "Free" ? "/register" : "/contact"} 
                  primary={plan.popular} 
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
  