import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
  Analytics as AnalyticsIcon,
  Work as WorkIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useSocket } from '../hooks/useSocket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatDate } from '../utils/dateUtils';

const AIResumeEditor = ({ section, content, onChange, resumeId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(content);
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatches, setJobMatches] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  const socket = useSocket();
  const user = useSelector(state => state.auth.user);
  const contentRef = useRef(null);
  const lastCursorPosition = useRef(0);

  useEffect(() => {
    if (socket && resumeId) {
      socket.emit('join-resume', resumeId);

      socket.on('user-joined', (user) => {
        setCollaborators(prev => [...prev, user]);
      });

      socket.on('user-left', (user) => {
        setCollaborators(prev => prev.filter(c => c.userId !== user.userId));
      });

      socket.on('content-updated', (update) => {
        if (update.section === section) {
          setActiveContent(update.content);
          onChange(update.content);
        }
      });

      socket.on('comment-added', (comment) => {
        setComments(prev => [...prev, comment]);
      });

      socket.on('cursor-moved', (data) => {
        updateCollaboratorCursor(data);
      });

      return () => {
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('content-updated');
        socket.off('comment-added');
        socket.off('cursor-moved');
      };
    }
  }, [socket, resumeId]);

  const updateCollaboratorCursor = (data) => {
    const cursor = document.createElement('div');
    cursor.className = 'collaborator-cursor';
    cursor.style.position = 'absolute';
    cursor.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    cursor.style.width = '2px';
    cursor.style.height = '20px';
    cursor.innerHTML = `<div style="position: absolute; top: -20px; left: 0; background: ${cursor.style.backgroundColor}; padding: 2px 6px; border-radius: 4px; color: white; font-size: 12px;">${data.username}</div>`;
    
    if (contentRef.current) {
      contentRef.current.appendChild(cursor);
      cursor.style.left = `${data.position.x}px`;
      cursor.style.top = `${data.position.y}px`;

      setTimeout(() => cursor.remove(), 2000);
    }
  };

  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setActiveContent(newContent);
    onChange(newContent);

    if (socket) {
      socket.emit('content-update', {
        resumeId,
        content: newContent,
        section,
      });
    }
  };

  const handleCursorMove = (event) => {
    if (socket && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      // Only emit if cursor has moved significantly
      const distance = Math.sqrt(
        Math.pow(position.x - lastCursorPosition.current.x, 2) +
        Math.pow(position.y - lastCursorPosition.current.y, 2)
      );

      if (distance > 10) {
        socket.emit('cursor-move', { resumeId, position });
        lastCursorPosition.current = position;
      }
    }
  };

  const analyzeWithJobDescription = async () => {
    try {
      setIsAnalyzing(true);
      const response = await axios.post('/api/resume/analyze', {
        content: activeContent,
        jobDescription,
      });

      setSuggestions(response.data.suggestions);
      setAtsScore(response.data.score.total);
      setJobMatches(response.data.relevantJobs);
    } catch (err) {
      setError('Failed to analyze resume with job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async (email) => {
    try {
      await axios.post('/api/resume/share', {
        resumeId,
        email,
        permission: 'edit', // or 'view' or 'comment'
      });
      setShowShareDialog(false);
    } catch (err) {
      setError('Failed to share resume');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      text: newComment,
      userId: user.id,
      username: user.name,
      timestamp: new Date(),
    };

    if (socket) {
      socket.emit('add-comment', { resumeId, comment });
    }

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const applySuggestion = (suggestion) => {
    let updatedContent = activeContent;
    
    // Apply the suggestion based on its type
    switch (suggestion.type) {
      case 'improvement':
        // Logic to apply improvement suggestions
        break;
      case 'keyword':
        // Logic to add keywords
        break;
      case 'structure':
        // Logic to improve structure
        break;
      default:
        break;
    }

    setActiveContent(updatedContent);
    onChange(updatedContent);

    if (socket) {
      socket.emit('content-update', {
        resumeId,
        content: updatedContent,
        section,
      });
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">
                {section}
                {isAnalyzing && (
                  <CircularProgress
                    size={20}
                    sx={{ ml: 2, verticalAlign: 'middle' }}
                  />
                )}
              </Typography>
              <Stack direction="row" spacing={1}>
                {collaborators.map((collaborator) => (
                  <Tooltip
                    key={collaborator.userId}
                    title={collaborator.username}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        fontSize: '0.875rem',
                      }}
                    >
                      {collaborator.username[0]}
                    </Avatar>
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box
              ref={contentRef}
              onMouseMove={handleCursorMove}
              sx={{ position: 'relative' }}
            >
              <TextField
                fullWidth
                multiline
                rows={6}
                value={activeContent}
                onChange={handleContentChange}
                variant="outlined"
                placeholder="Start typing your content..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="AI Suggestions">
                <IconButton
                  color="primary"
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    },
                  }}
                >
                  <AutoAwesomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Job Matches">
                <IconButton
                  color="primary"
                  onClick={() => setShowJobDialog(true)}
                >
                  <WorkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  color="primary"
                  onClick={() => setShowShareDialog(true)}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Comments">
                <IconButton
                  color="primary"
                  onClick={() => setShowComments(!showComments)}
                >
                  <Badge badgeContent={comments.length} color="secondary">
                    <CommentIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="ATS Score">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress
                    variant="determinate"
                    value={atsScore}
                    size={40}
                    thickness={4}
                    sx={{
                      color: atsScore > 70 ? 'success.main' : 'warning.main',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      ml: 2.5,
                      color: atsScore > 70 ? 'success.main' : 'warning.main',
                    }}
                  >
                    {atsScore}%
                  </Typography>
                </Box>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mt: 2 }}
          >
            {error}
          </Alert>
        )}

        <Collapse in={showComments}>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {comment.username[0]}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={comment.text}
                    secondary={`${comment.username} • ${formatDate(comment.timestamp, { includeTime: true })}`}
                  />
                </ListItem>
              ))}
            </List>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Send
              </Button>
            </Stack>
          </Paper>
        </Collapse>
      </Paper>

      {/* AI Suggestions Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">AI Suggestions</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here for targeted suggestions..."
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={analyzeWithJobDescription}
            disabled={isAnalyzing || !jobDescription.trim()}
            sx={{ mb: 2 }}
          >
            Analyze with Job Description
          </Button>

          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemIcon>
                  {suggestion.type === 'improvement' ? (
                    <LightbulbIcon color="primary" />
                  ) : suggestion.type === 'keyword' ? (
                    <AnalyticsIcon color="secondary" />
                  ) : (
                    <WarningIcon color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={suggestion.text}
                  secondary={suggestion.example}
                />
                <Tooltip title="Apply Suggestion">
                  <IconButton
                    size="small"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Job Matches Dialog */}
      <Dialog
        open={showJobDialog}
        onClose={() => setShowJobDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Matching Jobs
          <IconButton
            onClick={() => setShowJobDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {jobMatches.map((job, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={job.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {job.company} • {job.location}
                      </Typography>
                      <Typography variant="body2">
                        {job.description}
                      </Typography>
                    </>
                  }
                />
                <Button
                  variant="outlined"
                  size="small"
                  href={job.url}
                  target="_blank"
                >
                  Apply
                </Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      >
        <DialogTitle>Share Resume</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleShare(/* email */)}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIResumeEditor; 