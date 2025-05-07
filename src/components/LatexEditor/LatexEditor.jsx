import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Box, Paper, Grid, Typography, CircularProgress } from '@mui/material';
import { useSocket } from '../../hooks/useSocket';
import { useDebounce } from '../../hooks/useDebounce';
import { compileLatex } from '../../services/latexService';

const LatexEditor = ({ initialValue = '', documentId, onSave }) => {
  const [code, setCode] = useState(initialValue);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const debouncedCode = useDebounce(code, 1000);

  useEffect(() => {
    if (socket && documentId) {
      socket.emit('join-document', documentId);
      
      socket.on('document-change', (newCode) => {
        if (newCode !== code) {
          setCode(newCode);
        }
      });

      return () => {
        socket.off('document-change');
        socket.emit('leave-document', documentId);
      };
    }
  }, [socket, documentId, code]);

  useEffect(() => {
    const updatePreview = async () => {
      try {
        setLoading(true);
        const compiledPdf = await compileLatex(debouncedCode);
        setPreview(compiledPdf);
      } catch (error) {
        console.error('Error compiling LaTeX:', error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedCode) {
      updatePreview();
    }
  }, [debouncedCode]);

  const handleChange = (value) => {
    setCode(value);
    if (socket && documentId) {
      socket.emit('document-change', { documentId, code: value });
    }
    if (onSave) {
      onSave(value);
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            LaTeX Editor
          </Typography>
          <CodeMirror
            value={code}
            height="calc(100% - 60px)"
            theme={vscodeDark}
            onChange={handleChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              autocompletion: true,
              bracketMatching: true,
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview
          </Typography>
          <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <iframe
                src={preview}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="PDF Preview"
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LatexEditor; 