import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const AIResumeEditor = ({ section, content, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(content);

  // Simulated AI analysis (replace with actual AI integration)
  const analyzeContent = async (text) => {
    setIsAnalyzing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example suggestions based on content
    const newSuggestions = [
      {
        type: 'improvement',
        text: 'Consider using more action verbs at the beginning of your bullet points',
        example: 'Led, Developed, Implemented',
      },
      {
        type: 'keyword',
        text: 'Add industry-specific keywords to improve ATS score',
        example: 'Project Management, Agile, Scrum',
      },
      {
        type: 'structure',
        text: 'Use numbers to quantify achievements',
        example: 'Increased efficiency by 25%',
      },
    ];

    setSuggestions(newSuggestions);
    setAtsScore(Math.min(Math.floor(text.length / 10), 100));
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeContent) {
        analyzeContent(activeContent);
      }
    }, 1000);

    return () => clearTimeout(debounce);
  }, [activeContent]);

  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setActiveContent(newContent);
    onChange(newContent);
  };

  const applySuggestion = (suggestion) => {
    // Implementation would depend on how you want to apply suggestions
    console.log('Applying suggestion:', suggestion);
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
            <Typography variant="h6" gutterBottom>
              {section}
              {isAnalyzing && (
                <CircularProgress
                  size={20}
                  sx={{ ml: 2, verticalAlign: 'middle' }}
                />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
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
      </Paper>

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
    </Box>
  );
};

export default AIResumeEditor; 