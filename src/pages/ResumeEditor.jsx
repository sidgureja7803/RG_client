import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import {
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import PreviewIcon from '@mui/icons-material/Preview';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ResumePreview from '../components/resume/ResumePreview';
import VersionHistory from '../components/resume/VersionHistory';
import { debounce } from 'lodash';
import { saveResume, getResume } from '../services/resume.service';
import { generatePDF } from '../utils/pdfGenerator';

const ResumeEditor = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('json');
  const [editorTheme, setEditorTheme] = useState('light');
  const [showVersions, setShowVersions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResume(id);
        setContent(data.content);
        setFormat(data.format);
      } catch (err) {
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (newContent) => {
      try {
        setSaving(true);
        await saveResume(id, {
          content: newContent,
          format
        });
        setSuccess('Changes saved successfully');
      } catch (err) {
        setError(err.message || 'Failed to save changes');
      } finally {
        setSaving(false);
      }
    }, 1000),
    [id, format]
  );

  // Handle editor changes
  const handleChange = useCallback((value) => {
    setContent(value);
    debouncedSave(value);
  }, [debouncedSave]);

  // Handle manual save
  const handleSave = async () => {
    try {
      setSaving(true);
      await saveResume(id, {
        content,
        format
      });
      setSuccess('Changes saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle PDF download
  const handleDownload = async () => {
    try {
      const pdf = await generatePDF(content, format);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message || 'Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: 'calc(100% - 64px)' }}>
        {/* Editor Panel */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">Editor</Typography>
                <Tooltip title="Save">
                  <IconButton onClick={handleSave} disabled={saving}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download PDF">
                  <IconButton onClick={handleDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Version History">
                  <IconButton onClick={() => setShowVersions(true)}>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Toggle Theme">
                  <IconButton onClick={() => setEditorTheme(prev => prev === 'light' ? 'dark' : 'light')}>
                    {editorTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <CodeMirror
                value={content}
                height="100%"
                theme={editorTheme === 'light' ? githubLight : vscodeDark}
                extensions={[format === 'json' ? json() : markdown()]}
                onChange={handleChange}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  autocompletion: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  highlightActiveLine: true
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Preview Panel */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%',
              overflow: 'auto'
            }}
          >
            <ResumePreview content={content} format={format} />
          </Paper>
        </Grid>
      </Grid>

      {/* Version History Dialog */}
      <VersionHistory
        open={showVersions}
        onClose={() => setShowVersions(false)}
        resumeId={id}
        onVersionSelect={(version) => {
          setContent(version.content);
          setShowVersions(false);
        }}
      />

      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeEditor; 