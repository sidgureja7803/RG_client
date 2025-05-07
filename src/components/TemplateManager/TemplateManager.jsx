import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import {
  getTemplates,
  uploadTemplate,
  deleteTemplate
} from '../../services/templateService';

const TemplateManager = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    file: null,
    preview: null
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/x-tex': ['.tex'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setNewTemplate(prev => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file)
      }));
    }
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      await uploadTemplate({
        name: newTemplate.name,
        description: newTemplate.description,
        file: newTemplate.file
      });
      setOpen(false);
      setNewTemplate({ name: '', description: '', file: null, preview: null });
      await loadTemplates();
    } catch (error) {
      console.error('Error uploading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Resume Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Template
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={template.previewUrl}
                  alt={template.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(template._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Template</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newTemplate.description}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
          <Box
            {...getRootProps()}
            sx={{
              mt: 2,
              p: 3,
              border: '2px dashed #ccc',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <input {...getInputProps()} />
            {newTemplate.preview ? (
              <img
                src={newTemplate.preview}
                alt="Template preview"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            ) : (
              <Typography>
                Drag and drop a template file here, or click to select one
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!newTemplate.file || !newTemplate.name}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateManager; 