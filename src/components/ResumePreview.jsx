import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Button,
} from '@mui/material';
import {
  Style as StyleIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    preview: '/templates/modern-preview.png',
  },
  {
    id: 'professional',
    name: 'Professional',
    preview: '/templates/professional-preview.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    preview: '/templates/creative-preview.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: '/templates/minimal-preview.png',
  },
];

const ResumePreview = ({ resumeData, template, onTemplateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#1976d2');
  
  const handleTemplateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleTemplateClose = () => {
    setAnchorEl(null);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleTemplateSelect = (templateId) => {
    onTemplateChange(templateId);
    handleTemplateClose();
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    handleColorClose();
  };

  const colors = [
    '#1976d2',
    '#2e7d32',
    '#d32f2f',
    '#7b1fa2',
    '#000000',
  ];

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 2,
            p: 0.5,
          }}
        >
          <Tooltip title="Change Template">
            <IconButton size="small" onClick={handleTemplateClick}>
              <StyleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Color">
            <IconButton size="small" onClick={handleColorClick}>
              <PaletteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton size="small">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleTemplateClose}
          TransitionComponent={Fade}
        >
          {templates.map((t) => (
            <MenuItem
              key={t.id}
              onClick={() => handleTemplateSelect(t.id)}
              selected={template === t.id}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={t.preview}
                  alt={t.name}
                  sx={{
                    width: 60,
                    height: 80,
                    mr: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <Typography>{t.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={colorAnchorEl}
          open={Boolean(colorAnchorEl)}
          onClose={handleColorClose}
          TransitionComponent={Fade}
        >
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Accent Color
            </Typography>
            <Stack direction="row" spacing={1}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor:
                      selectedColor === color
                        ? 'primary.main'
                        : 'transparent',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Menu>

        <Box
          sx={{
            mt: 8,
            height: 'calc(100% - 64px)',
            overflow: 'auto',
            bgcolor: 'white',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            borderRadius: 1,
          }}
        >
          {/* Resume Content Preview */}
          <Box
            sx={{
              width: '210mm',
              minHeight: '297mm',
              mx: 'auto',
              p: 4,
              bgcolor: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            {/* This is where you would render the actual resume content based on the template */}
            <Typography variant="h4" gutterBottom color={selectedColor}>
              {resumeData.personalInfo?.name || 'Your Name'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {resumeData.personalInfo?.title || 'Professional Title'}
            </Typography>
            
            {/* Contact Information */}
            <Box sx={{ my: 2 }}>
              <Typography variant="body2">
                {resumeData.personalInfo?.email || 'email@example.com'}
              </Typography>
              <Typography variant="body2">
                {resumeData.personalInfo?.phone || '+1 234 567 890'}
              </Typography>
              <Typography variant="body2">
                {resumeData.personalInfo?.location || 'City, Country'}
              </Typography>
            </Box>

            {/* Experience Section */}
            <Box sx={{ my: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: selectedColor, borderBottom: `2px solid ${selectedColor}` }}
              >
                Experience
              </Typography>
              {resumeData.experience?.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {exp.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} • {exp.duration}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </Box>
              ))}
            </Box>

            {/* Education Section */}
            <Box sx={{ my: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: selectedColor, borderBottom: `2px solid ${selectedColor}` }}
              >
                Education
              </Typography>
              {resumeData.education?.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.institution} • {edu.duration}
                  </Typography>
                  <Typography variant="body2">{edu.description}</Typography>
                </Box>
              ))}
            </Box>

            {/* Skills Section */}
            <Box sx={{ my: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: selectedColor, borderBottom: `2px solid ${selectedColor}` }}
              >
                Skills
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {resumeData.skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      bgcolor: `${selectedColor}10`,
                      color: selectedColor,
                      '&:hover': {
                        bgcolor: `${selectedColor}20`,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResumePreview; 