import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Divider, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import { Plus, Edit, Trash2, Eye, Image, Check, X, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Modern',
    isPremium: false,
    features: [''],
    thumbnail: '',
    previewImage: '',
    structure: {},
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchTemplates();
    }
  }, [user, navigate]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/templates');
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setCurrentTemplate(template);
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        isPremium: template.isPremium,
        features: template.features || [''],
        thumbnail: template.thumbnail,
        previewImage: template.previewImage,
        structure: template.structure || {},
      });
      setIsEditing(true);
    } else {
      setCurrentTemplate(null);
      setFormData({
        name: '',
        description: '',
        category: 'Modern',
        isPremium: false,
        features: [''],
        thumbnail: '',
        previewImage: '',
        structure: {},
      });
      setIsEditing(false);
    }
    setThumbnailFile(null);
    setPreviewFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: updatedFeatures.length ? updatedFeatures : [''],
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'thumbnail') {
        setThumbnailFile(file);
      } else {
        setPreviewFile(file);
      }
    }
  };

  const uploadImages = async () => {
    if (!thumbnailFile && !previewFile) return { success: true };
    
    try {
      setUploading(true);
      const formDataFiles = new FormData();
      
      if (thumbnailFile) {
        formDataFiles.append('thumbnail', thumbnailFile);
      }
      
      if (previewFile) {
        formDataFiles.append('previewImage', previewFile);
      }
      
      const response = await api.post('/api/templates/upload-image', formDataFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        thumbnail: response.data.thumbnail || formData.thumbnail,
        previewImage: response.data.previewImage || formData.previewImage,
      };
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
      return { success: false };
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First upload images if any
      const uploadResult = await uploadImages();
      if (!uploadResult.success) return;

      const templateData = {
        ...formData,
        thumbnail: uploadResult.thumbnail || formData.thumbnail,
        previewImage: uploadResult.previewImage || formData.previewImage,
        features: formData.features.filter(f => f.trim() !== ''),
      };

      if (isEditing) {
        // Update existing template
        await api.put(`/api/templates/${currentTemplate._id}`, templateData);
      } else {
        // Create new template
        await api.post('/api/templates', templateData);
      }

      setOpenDialog(false);
      await fetchTemplates();
      setError(null);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again.');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        await api.delete(`/api/templates/${id}`);
        await fetchTemplates();
        setError(null);
      } catch (err) {
        console.error('Error deleting template:', err);
        setError('Failed to delete the template. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">Template Manager</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Plus />}
          onClick={() => handleOpenDialog()}
        >
          Add New Template
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {templates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template._id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={template.thumbnail}
                alt={template.name}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="div">
                    {template.name}
                  </Typography>
                  {template.isPremium && (
                    <Chip label="Premium" color="secondary" size="small" />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {template.description}
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <Chip 
                    label={template.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(template)}>
                      <Edit size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Preview">
                    <IconButton>
                      <Eye size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteTemplate(template._id)}>
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Edit Template' : 'Add New Template'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Template Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                    required
                  >
                    <MenuItem value="Modern">Modern</MenuItem>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Creative">Creative</MenuItem>
                    <MenuItem value="Simple">Simple</MenuItem>
                    <MenuItem value="Academic">Academic</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" mr={2}>Premium Template:</Typography>
                  <FormControl>
                    <Select
                      name="isPremium"
                      value={formData.isPremium}
                      onChange={handleInputChange}
                      size="small"
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>Images</Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>Thumbnail</Typography>
                  {formData.thumbnail && (
                    <Box mb={1}>
                      <img 
                        src={formData.thumbnail} 
                        alt="Thumbnail" 
                        style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Image />}
                    fullWidth
                  >
                    {formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                    />
                  </Button>
                  {thumbnailFile && (
                    <Typography variant="caption">Selected: {thumbnailFile.name}</Typography>
                  )}
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>Preview Image</Typography>
                  {formData.previewImage && (
                    <Box mb={1}>
                      <img 
                        src={formData.previewImage} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Image />}
                    fullWidth
                  >
                    {formData.previewImage ? 'Change Preview' : 'Upload Preview'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'preview')}
                    />
                  </Button>
                  {previewFile && (
                    <Typography variant="caption">Selected: {previewFile.name}</Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Features</Typography>
                {formData.features.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <TextField
                      fullWidth
                      label={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      size="small"
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFeature(index)}
                      sx={{ ml: 1 }}
                      disabled={formData.features.length <= 1}
                    >
                      <X size={20} />
                    </IconButton>
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<Plus />}
                  onClick={handleAddFeature}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Feature
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={uploading}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={uploading || !formData.name || !formData.description}
              startIcon={uploading ? <CircularProgress size={20} /> : <Save />}
            >
              {uploading ? 'Uploading...' : isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default TemplateManager; 