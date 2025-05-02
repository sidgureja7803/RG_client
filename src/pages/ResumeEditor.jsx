import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Stage, Layer, Rect, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ListIcon from '@mui/icons-material/List';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import PreviewIcon from '@mui/icons-material/Preview';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import resumeService from '../services/resume.service';

const drawerWidth = 240;

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const isNew = id === 'new';

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      if (isNew) {
        setResume({
          title: 'Untitled Resume',
          sections: [
            { id: '1', type: 'contact', title: 'Contact Information', content: {} },
            { id: '2', type: 'education', title: 'Education', content: [] },
            { id: '3', type: 'experience', title: 'Work Experience', content: [] },
            { id: '4', type: 'skills', title: 'Skills', content: [] },
          ],
        });
        setResumeName('Untitled Resume');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await resumeService.getResumeById(id);
        setResume(data);
        setResumeName(data.name);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, isNew]);

  // Handle save resume
  const handleSaveResume = async () => {
    if (!resume) return;

    try {
      const updatedResume = {
        ...resume,
        name: resumeName,
      };

      if (id && id !== 'new') {
        await resumeService.updateResume(id, updatedResume);
        setSuccess('Resume saved successfully');
      } else {
        const newResume = await resumeService.createResume(updatedResume);
        setSuccess('Resume created successfully');
        navigate(`/resume/${newResume._id}`, { replace: true });
      }
      setSaveDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resume');
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    if (!stageRef.current || !resume) return;

    const pdf = new jsPDF(resume.pageSettings.orientation, 'px', resume.pageSettings.pageSize);
    
    // Convert stage to image
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    
    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add image to PDF
    pdf.addImage(dataURL, 'PNG', 0, 0, pageWidth, pageHeight);
    
    // Save PDF
    pdf.save(`${resume.name}.pdf`);
    setSuccess('Resume exported as PDF');
  };

  // Add a new section
  const addSection = (type) => {
    if (!resume) return;

    const newSection = {
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      content: {},
      style: {
        fontFamily: 'Arial',
        fontSize: 14,
        color: '#000000',
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
      },
    };

    setResume({
      ...resume,
      sections: [...resume.sections, newSection],
    });

    setSelectedSection(newSection);
  };

  // Handle section selection
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  // Handle section movement
  const handleSectionMove = (section, newPosition) => {
    if (!resume) return;

    const updatedSections = resume.sections.map((s) => {
      if (s === section) {
        return {
          ...s,
          position: newPosition,
        };
      }
      return s;
    });

    setResume({
      ...resume,
      sections: updatedSections,
    });
  };

  // Handle wheel event for zooming
  const handleWheel = (e) => {
    e.preventDefault();

    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);
    setStagePosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sections = Array.from(resume.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    setResume({ ...resume, sections });
  };

  const handleSectionChange = (sectionId, field, value) => {
    setResume({
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    });
  };

  const handleAddSection = () => {
    const newSection = {
      id: String(Date.now()),
      type: 'custom',
      title: 'New Section',
      content: [],
    };
    setResume({
      ...resume,
      sections: [...resume.sections, newSection],
    });
  };

  const handleDelete = async () => {
    try {
      await resumeService.deleteResume(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: drawerOpen ? `${drawerWidth}px` : 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {resumeName}
          </Typography>
          <Tooltip title="Save Resume">
            <IconButton color="inherit" onClick={() => setSaveDialogOpen(true)}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export as PDF">
            <IconButton color="inherit" onClick={handleExportPDF}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Preview">
            <IconButton color="inherit" onClick={() => navigate(`/resume/${id}/preview`)}>
              <PreviewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton color="inherit" onClick={() => navigate(`/resume/${id}/share`)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          {!isNew && (
            <Tooltip title="Delete">
              <IconButton color="inherit" onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => addSection('text')}>
              <ListItemIcon>
                <TextFieldsIcon />
              </ListItemIcon>
              <ListItemText primary="Add Text" />
            </ListItem>
            <ListItem button onClick={() => addSection('image')}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary="Add Image" />
            </ListItem>
            <ListItem button onClick={() => addSection('education')}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Add Education" />
            </ListItem>
            <ListItem button onClick={() => addSection('experience')}>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Add Experience" />
            </ListItem>
            <ListItem button onClick={() => addSection('skills')}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Add Skills" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        }}
      >
        <Toolbar />
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 88px)',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
          }}
        >
          <Stage
            ref={stageRef}
            width={resume?.canvasSize?.width || 800}
            height={resume?.canvasSize?.height || 1100}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePosition.x}
            y={stagePosition.y}
            onWheel={handleWheel}
            draggable
          >
            <Layer>
              {resume?.sections?.map((section, index) => (
                <React.Fragment key={index}>
                  {/* Render different section types */}
                  {section.type === 'text' && (
                    <KonvaText
                      x={section.position.x}
                      y={section.position.y}
                      text={section.content.text || ''}
                      fontSize={section.style.fontSize}
                      fontFamily={section.style.fontFamily}
                      fill={section.style.color}
                      draggable
                      onClick={() => handleSectionSelect(section)}
                      onDragEnd={(e) => handleSectionMove(section, { x: e.target.x(), y: e.target.y() })}
                    />
                  )}
                  {/* Add other section type renderers here */}
                </React.Fragment>
              ))}
            </Layer>
          </Stage>
        </Box>
      </Box>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your resume.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Resume Name"
            fullWidth
            variant="outlined"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveResume} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeEditor;