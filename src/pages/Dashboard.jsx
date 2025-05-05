import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getResumes, deleteResume } from '../services/resumeService';
import { formatDate } from '../utils/dateUtils';
import { logout } from '../redux/actions/authActions';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart, 
  User, 
  Settings, 
  FileType, 
  Upload, 
  HelpCircle, 
  Star, 
  LogOut, 
  Code, 
  FileUp
} from 'lucide-react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createOptionsOpen, setCreateOptionsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const data = await getResumes();
        setResumes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load your resumes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateFromTemplate = () => {
    handleCreateMenuClose();
    navigate('/templates');
  };

  const handleCreateFromCode = () => {
    handleCreateMenuClose();
    navigate('/resume-editor/code');
  };

  const handleOpenCreateOptions = () => {
    setCreateOptionsOpen(true);
    handleCreateMenuClose();
  };

  const handleCloseCreateOptions = () => {
    setCreateOptionsOpen(false);
  };

  const handleEditResume = (id) => {
    navigate(`/resume-editor/${id}`);
  };

  const handleAnalyzeResume = (id) => {
    navigate(`/analyzer/${id}`);
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        setResumes(resumes.filter(resume => resume._id !== id));
      } catch (err) {
        console.error('Error deleting resume:', err);
        setError('Failed to delete the resume. Please try again.');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      // Here you would normally process the file for analysis
      // For demo purposes, we'll navigate to the analyzer page
      navigate('/analyzer/upload');
    }
  }, [navigate]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const quickAccessItems = [
    { 
      title: 'Create Resume', 
      icon: <Plus size={24} />, 
      description: 'Create a new resume from scratch',
      action: handleCreateMenuOpen,
      color: '#4f46e5'
    },
    { 
      title: 'Match to Job', 
      icon: <BarChart size={24} />, 
      description: 'Match your resume to job descriptions',
      link: '/analyzer',
      color: '#16a34a'
    },
    { 
      title: 'Upload Resume', 
      icon: <Upload size={24} />, 
      description: 'Upload existing resume for editing',
      link: '/upload',
      color: '#9333ea'
    },
    { 
      title: 'Profile Settings', 
      icon: <User size={24} />, 
      description: 'Manage your account settings',
      link: '/profile',
      color: '#ea580c'
    }
  ];

  // Add admin panel only for admin users
  if (user?.role === 'admin') {
    quickAccessItems.push({
      title: 'Admin Panel', 
      icon: <Settings size={24} />, 
      description: 'Manage site settings and users',
      link: '/admin',
      color: '#6b21a8'
    });
    
    quickAccessItems.push({
      title: 'Manage Templates', 
      icon: <FileType size={24} />, 
      description: 'Create and edit resume templates',
      link: '/admin/templates',
      color: '#c026d3'
    });
  }

  const renderResumesTab = () => {
    if (resumes.length === 0) {
      return (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'background.default',
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No resumes yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first resume to get started on your job search journey
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateMenuOpen}
            startIcon={<Plus />}
            size="large"
            sx={{ mt: 2 }}
          >
            Create Resume
          </Button>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {resumes.map(resume => (
          <Grid item xs={12} sm={6} md={4} key={resume._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <Box 
                sx={{ 
                  height: 8, 
                  bgcolor: theme.palette.primary.main,
                  width: '100%'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Badge 
                    color="success" 
                    badgeContent="ATS✓" 
                    invisible={!resume.atsScoreAvailable}
                    sx={{ mr: 1 }}
                  >
                    <Avatar 
                      variant="rounded"
                      sx={{ 
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        width: 40,
                        height: 40,
                        mr: 1
                      }}
                    >
                      <FileText size={20} />
                    </Avatar>
                  </Badge>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    noWrap
                    sx={{ 
                      fontWeight: 600, 
                      flex: 1,
                    }}
                  >
                    {resume.title}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1 
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <Edit size={14} style={{ marginRight: 4 }} />
                    Last updated: {formatDate(resume.updatedAt)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  sx={{ pt: 1 }}
                >
                  <Tooltip title="Edit Resume">
                    <Button
                      onClick={() => handleEditResume(resume._id)}
                      startIcon={<Edit size={18} />}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Analyze Resume">
                    <Button
                      onClick={() => handleAnalyzeResume(resume._id)}
                      startIcon={<BarChart size={18} />}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Analyze
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Delete Resume">
                    <IconButton
                      onClick={() => handleDeleteResume(resume._id)}
                      color="error"
                      size="small"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderProfileTab = () => {
    return (
      <Box>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            boxShadow: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={user?.avatar || user?.profilePicture || ''} 
              alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
              sx={{ 
                width: 90, 
                height: 90, 
                mr: 3,
                border: `3px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {user?.firstName || ''} {user?.lastName || ''}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email || ''}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                {user?.role === 'admin' && (
                  <Chip 
                    label="Admin" 
                    color="primary" 
                    size="small" 
                  />
                )}
                <Chip 
                  label={user?.isEmailVerified ? "Verified" : "Not Verified"} 
                  color={user?.isEmailVerified ? "success" : "warning"} 
                  size="small" 
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/profile"
              startIcon={<Edit />}
            >
              Edit Profile
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleLogout}
              startIcon={<LogOut />}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          {quickAccessItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${item.color}`,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  }
                }}
                onClick={item.action || (() => navigate(item.link))}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box 
                      sx={{ 
                        color: 'white', 
                        p: 1, 
                        borderRadius: 1,
                        backgroundColor: item.color,
                        mr: 2
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Resume Analyzer - Drag & Drop
        </Typography>
        <Paper 
          {...getRootProps()} 
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 2,
            textAlign: 'center',
            border: isDragActive 
              ? `2px dashed ${theme.palette.primary.main}` 
              : `2px dashed ${theme.palette.divider}`,
            backgroundColor: isDragActive 
              ? theme.palette.primary.light + '22' 
              : theme.palette.background.default,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.light + '11'
            }
          }}
        >
          <input {...getInputProps()} />
          <Upload 
            size={40} 
            style={{ 
              marginBottom: '16px', 
              opacity: 0.7,
              color: theme.palette.primary.main 
            }} 
          />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Drop your PDF or Word document here to analyze against job descriptions
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 1 }}
          >
            Browse Files
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
            Supports PDF, DOC, DOCX files up to 5MB
          </Typography>
        </Paper>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            ResumeForge
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                <LogOut size={20} />
              </IconButton>
            ) : (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleLogout}
                startIcon={<LogOut size={18} />}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Welcome, {user?.firstName || 'User'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your resumes and career resources
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 120
            }
          }}
          variant={isMobile ? "fullWidth" : "standard"}
          centered
        >
          <Tab label="My Resumes" />
          <Tab label="Profile & Tools" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box mb={4} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Plus />}
                onClick={handleCreateMenuOpen}
                size="large"
                sx={{ 
                  py: 1.2,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 3
                }}
              >
                Create New Resume
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCreateMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleCreateFromTemplate}>
                  <FileType size={18} style={{ marginRight: 10 }} />
                  From Template
                </MenuItem>
                <MenuItem onClick={handleCreateFromCode}>
                  <Code size={18} style={{ marginRight: 10 }} />
                  Code Editor (LaTeX)
                </MenuItem>
                <MenuItem onClick={handleOpenCreateOptions}>
                  <Upload size={18} style={{ marginRight: 10 }} />
                  Upload Existing
                </MenuItem>
              </Menu>
            </Box>
            {renderResumesTab()}
          </>
        )}

        {activeTab === 1 && renderProfileTab()}

        <Paper 
          sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ fontWeight: 600 }}
          >
            Tips for Success
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <Box 
                  sx={{ 
                    color: theme.palette.info.main,
                    mr: 1.5,
                    mt: 0.3
                  }}
                >
                  <Star size={16} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tailor your resume for each job application
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <Box 
                  sx={{ 
                    color: theme.palette.info.main,
                    mr: 1.5,
                    mt: 0.3
                  }}
                >
                  <Star size={16} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Use the Resume Analyzer to optimize for ATS systems
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <Box 
                  sx={{ 
                    color: theme.palette.info.main,
                    mr: 1.5,
                    mt: 0.3
                  }}
                >
                  <Star size={16} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Include quantifiable achievements
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <Box 
                  sx={{ 
                    color: theme.palette.info.main,
                    mr: 1.5,
                    mt: 0.3
                  }}
                >
                  <Star size={16} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Update your resume regularly
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      <Dialog open={createOptionsOpen} onClose={handleCloseCreateOptions}>
        <DialogTitle>Create a New Resume</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Choose your preferred method
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card 
                  onClick={handleCreateFromTemplate}
                  sx={{ 
                    cursor: 'pointer',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { bgcolor: theme.palette.action.hover }
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <FileType />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Start with a Template
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from professional templates
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card 
                  onClick={handleCreateFromCode}
                  sx={{ 
                    cursor: 'pointer',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { bgcolor: theme.palette.action.hover }
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                    <Code />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Code Editor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use LaTeX to create a custom resume
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card 
                  {...getRootProps()}
                  sx={{ 
                    cursor: 'pointer',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    border: isDragActive ? `1px dashed ${theme.palette.primary.main}` : 'none',
                    '&:hover': { bgcolor: theme.palette.action.hover }
                  }}
                >
                  <input {...getInputProps()} />
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <Upload />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Upload Existing Resume
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Import and edit your current resume
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateOptions}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard; 