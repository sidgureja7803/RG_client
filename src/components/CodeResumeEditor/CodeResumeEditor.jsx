import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, Divider, TextField, CircularProgress, Menu, MenuItem, IconButton, Alert, Snackbar } from '@mui/material';
import { Save, Download, Share, Code, RefreshCw, Settings, Copy, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveResume, exportResumePDF } from '../../services/resumeService';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Sample templates
const templates = {
  simple: `# Your Name
## Job Title

contact@email.com | (123) 456-7890 | City, State | [LinkedIn](https://linkedin.com) | [GitHub](https://github.com)

## Summary
A brief summary of your professional background and career goals.

## Skills
- **Technical Skills:** List your technical skills here
- **Soft Skills:** List your soft skills here
- **Languages:** List languages you speak here
- **Tools:** List tools you use here

## Experience
### Company Name | Job Title | Start Date - End Date
- Achievement or responsibility 1
- Achievement or responsibility 2
- Achievement or responsibility 3

### Previous Company | Previous Title | Start Date - End Date
- Achievement or responsibility 1
- Achievement or responsibility 2

## Education
### University Name | Degree | Graduation Year
- GPA: X.XX
- Relevant coursework
- Achievements

## Projects
### Project Name | [Link](https://project.com)
- Description of the project
- Technologies used
- Your role and achievements

## Certifications
- Certification Name (Year)
- Another Certification (Year)
`,
  technical: `# Professional Resume
## Your Name - Software Engineer

yourname@email.com | (123) 456-7890 | City, State
[LinkedIn](https://linkedin.com/in/yourname) | [GitHub](https://github.com/yourusername) | [Portfolio](https://yourportfolio.com)

## Technical Skills
\`\`\`
Languages:       JavaScript, Python, Java, C++, SQL, HTML/CSS
Frameworks:      React, Node.js, Express, Django, Spring Boot
Tools:           Git, Docker, AWS, GCP, Kubernetes, Jenkins
Databases:       MongoDB, PostgreSQL, MySQL, Redis
Testing:         Jest, Mocha, Pytest, JUnit
\`\`\`

## Professional Experience
### Senior Software Engineer | TechCorp Inc. | Jan 2021 - Present
- Architected and implemented scalable microservices using Node.js, reducing system latency by 40%
- Led migration from monolith to microservices, improving deployment frequency from monthly to daily
- Mentored junior engineers on best practices and code reviews, improving team velocity by 25%
- Implemented CI/CD pipeline with Jenkins, reducing deployment time from hours to minutes

### Software Engineer | DataSystems LLC | Mar 2018 - Dec 2020
- Developed responsive web applications using React, serving 10,000+ daily active users
- Optimized database queries and implemented caching, improving application performance by 50%
- Collaborated with UX team to redesign critical workflows, increasing user retention by 22%
- Implemented automated testing with Jest, achieving 90% code coverage

## Projects
### E-commerce Platform | [GitHub](https://github.com/yourname/project)
Full-stack e-commerce application using MERN stack with features including user auth, product search, cart, and checkout.

### Data Visualization Dashboard | [Live Demo](https://demo.url)
Interactive dashboard built with D3.js and React that visualizes complex datasets in real-time.

## Education
### University of Technology | B.S. Computer Science | May 2018
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development
- Senior Project: Machine Learning Algorithm for Predictive Text Input

## Certifications
- AWS Certified Developer - Associate (2022)
- Google Cloud Professional Developer (2021)
- MongoDB Certified Developer (2020)
`,
  minimal: `# YOUR NAME
**Email:** email@example.com | **Phone:** (123) 456-7890 | **Location:** City, State

## PROFESSIONAL SUMMARY
Concise statement about your career goals and expertise.

## SKILLS
Technical skills, soft skills, tools, languages, etc.

## EXPERIENCE
**Job Title, Company Name** | MM/YYYY - Present
- Key achievement with measurable results
- Another notable responsibility

**Previous Title, Previous Company** | MM/YYYY - MM/YYYY
- Key achievement with measurable results
- Another notable responsibility

## EDUCATION
**Degree in Field of Study, Institution Name** | YYYY
`
};

const CodeResumeEditor = () => {
  const [markdown, setMarkdown] = useState(templates.simple);
  const [theme, setTheme] = useState('light');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [resumeId, setResumeId] = useState(null);
  const [dirty, setDirty] = useState(false);
  
  const user = useSelector(state => state.auth.user);

  // Auto-save draft timer
  useEffect(() => {
    let saveTimer;
    
    if (dirty) {
      saveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save after 30 seconds of inactivity
    }
    
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [markdown, dirty]);

  const handleAutoSave = async () => {
    try {
      if (!user) return;
      
      setSaving(true);
      const savedResume = await saveResume({
        id: resumeId,
        title: extractTitle(markdown) || 'Untitled Resume',
        content: markdown,
        format: 'markdown',
      });
      
      if (savedResume.id && !resumeId) {
        setResumeId(savedResume.id);
      }
      
      setDirty(false);
      showNotification('Draft saved automatically', 'success');
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCodeChange = (event) => {
    setMarkdown(event.target.value);
    setDirty(true);
  };

  const handleSave = async () => {
    if (!user) {
      showNotification('Please sign in to save your resume', 'error');
      return;
    }
    
    try {
      setSaving(true);
      const savedResume = await saveResume({
        id: resumeId,
        title: extractTitle(markdown) || 'Untitled Resume',
        content: markdown,
        format: 'markdown',
      });
      
      if (savedResume.id && !resumeId) {
        setResumeId(savedResume.id);
      }
      
      setDirty(false);
      showNotification('Resume saved successfully', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showNotification('Failed to save resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Attempt to use the backend service if available
      if (resumeId) {
        try {
          const pdfBlob = await exportResumePDF(resumeId);
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${extractTitle(markdown) || 'resume'}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showNotification('Resume exported successfully', 'success');
          return;
        } catch (e) {
          console.log('Backend export failed, falling back to client-side export');
        }
      }
      
      // Client-side fallback using html2canvas and jsPDF
      const element = document.getElementById('resume-preview');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${extractTitle(markdown) || 'resume'}.pdf`);
      
      showNotification('Resume exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export resume', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleTemplateMenuOpen = (event) => {
    setTemplateMenuAnchor(event.currentTarget);
  };

  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null);
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const applyTemplate = (templateKey) => {
    if (dirty && markdown !== templates[templateKey]) {
      if (window.confirm('You have unsaved changes. Are you sure you want to switch templates?')) {
        setMarkdown(templates[templateKey]);
        setDirty(true);
      }
    } else {
      setMarkdown(templates[templateKey]);
      setDirty(true);
    }
    handleTemplateMenuClose();
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    handleThemeMenuClose();
  };

  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const extractTitle = (text) => {
    // Extract the first heading as the title
    const match = text.match(/^#\s+(.+)$/m);
    return match ? match[1] : '';
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => {
        showNotification('Copied to clipboard', 'success');
      })
      .catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
      });
  };

  const handleClearEditor = () => {
    if (window.confirm('Are you sure you want to clear the editor? All content will be lost.')) {
      setMarkdown('');
      setDirty(true);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" fontWeight="medium">
          Code Resume Editor
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Code />}
            onClick={handleTemplateMenuOpen}
            size="small"
          >
            Templates
          </Button>
          <Menu
            anchorEl={templateMenuAnchor}
            open={Boolean(templateMenuAnchor)}
            onClose={handleTemplateMenuClose}
          >
            <MenuItem onClick={() => applyTemplate('simple')}>Simple</MenuItem>
            <MenuItem onClick={() => applyTemplate('technical')}>Technical</MenuItem>
            <MenuItem onClick={() => applyTemplate('minimal')}>Minimal</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={handleThemeMenuOpen}
            size="small"
          >
            Theme
          </Button>
          <Menu
            anchorEl={themeMenuAnchor}
            open={Boolean(themeMenuAnchor)}
            onClose={handleThemeMenuClose}
          >
            <MenuItem onClick={() => changeTheme('light')}>Light</MenuItem>
            <MenuItem onClick={() => changeTheme('dark')}>Dark</MenuItem>
          </Menu>

          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={saving || !dirty}
            size="small"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={exporting ? <CircularProgress size={18} color="inherit" /> : <Download />}
            onClick={handleExport}
            disabled={exporting}
            size="small"
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              height: 'calc(100vh - 160px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Markdown Editor
              </Typography>
              <Box>
                <IconButton size="small" onClick={handleCopyToClipboard} title="Copy to clipboard">
                  <Copy size={18} />
                </IconButton>
                <IconButton size="small" onClick={handleClearEditor} title="Clear editor">
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TextField
              multiline
              fullWidth
              variant="outlined"
              value={markdown}
              onChange={handleCodeChange}
              sx={{
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  height: '100%',
                },
                '& .MuiInputBase-input': {
                  height: '100%',
                }
              }}
              InputProps={{
                style: {
                  height: '100%',
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              height: 'calc(100vh - 160px)',
              overflowY: 'auto',
              bgcolor: theme === 'dark' ? '#1e1e1e' : 'white',
              color: theme === 'dark' ? 'white' : 'inherit'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ color: theme === 'dark' ? 'white' : 'inherit' }}>
                Resume Preview
              </Typography>
              <Box>
                <IconButton 
                  size="small" 
                  onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
                  sx={{ color: theme === 'dark' ? 'white' : 'inherit' }}
                  title="Toggle light/dark theme"
                >
                  <RefreshCw size={18} />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mb: 2, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <Box 
              id="resume-preview"
              className="markdown-preview"
              sx={{ 
                p: 3, 
                bgcolor: theme === 'dark' ? '#1e1e1e' : 'white',
                color: theme === 'dark' ? '#e0e0e0' : 'inherit',
                minHeight: 'calc(100% - 60px)',
                '& h1': {
                  color: theme === 'dark' ? '#58a6ff' : '#1976d2',
                  borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                  pb: 1
                },
                '& h2': {
                  color: theme === 'dark' ? '#58a6ff' : '#0d47a1',
                  borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                  pb: 0.5
                },
                '& h3, & h4, & h5, & h6': {
                  color: theme === 'dark' ? '#e6edf3' : '#424242',
                },
                '& a': {
                  color: theme === 'dark' ? '#58a6ff' : '#0277bd',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                },
                '& p': {
                  color: theme === 'dark' ? '#e0e0e0' : 'inherit',
                },
                '& ul, & ol': {
                  paddingLeft: 3,
                },
                '& li': {
                  margin: '4px 0',
                },
                '& hr': {
                  border: 'none',
                  height: '1px',
                  backgroundColor: theme === 'dark' ? '#333' : '#ddd',
                  margin: '16px 0',
                },
                '& blockquote': {
                  borderLeft: theme === 'dark' ? '3px solid #555' : '3px solid #ddd',
                  margin: 0,
                  paddingLeft: 2,
                  color: theme === 'dark' ? '#ccc' : '#666',
                },
                '& table': {
                  borderCollapse: 'collapse',
                  width: '100%',
                },
                '& th, & td': {
                  border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                  padding: '6px 12px',
                },
                '& th': {
                  backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
                },
                '& tr:nth-of-type(even)': {
                  backgroundColor: theme === 'dark' ? '#222' : '#fafafa',
                },
                '& code': {
                  fontFamily: 'monospace',
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '85%',
                },
                '& pre': {
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  padding: 2,
                  borderRadius: '4px',
                  overflowX: 'auto',
                },
              }}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={theme === 'dark' ? atomDark : prism}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeResumeEditor; 