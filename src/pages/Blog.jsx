import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '10 Resume Tips for 2024',
      excerpt: 'Learn the latest trends and best practices for creating a standout resume in 2024.',
      date: 'March 15, 2024',
      category: 'Resume Tips',
      image: 'https://via.placeholder.com/400x250'
    },
    {
      id: 2,
      title: 'How to Optimize Your Resume for ATS',
      excerpt: 'Master the art of getting your resume past Applicant Tracking Systems.',
      date: 'March 10, 2024',
      category: 'ATS Optimization',
      image: 'https://via.placeholder.com/400x250'
    },
    {
      id: 3,
      title: 'The Power of AI in Resume Writing',
      excerpt: 'Discover how artificial intelligence is revolutionizing the resume creation process.',
      date: 'March 5, 2024',
      category: 'Technology',
      image: 'https://via.placeholder.com/400x250'
    }
  ];

  return (
    <div className="blog-page">
      <Navigation />
      <div className="container">
        <section className="blog-section">
          <div className="section-header">
            <h1>Resume Writing Blog</h1>
            <p>Expert tips and insights for your job search success</p>
          </div>
          
          <div className="blog-grid">
            {blogPosts.map(post => (
              <div key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <div className="category-tag">{post.category}</div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-date">{post.date}</div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="blog-cta">
            <h3>Want to improve your resume?</h3>
            <p>Try our AI-powered resume builder today</p>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog; 