import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import CodeResumeEditor from '../components/CodeResumeEditor/CodeResumeEditor';

const CodeResumePage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)',
            border: '1px solid rgba(25,118,210,0.1)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="medium">
            Markdown Resume Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your resume using markdown and see changes in real-time. Use the built-in templates or start from scratch.
            When you're done, export your resume as a PDF or save it for later editing.
          </Typography>
        </Paper>
        
        <CodeResumeEditor />
      </Box>
    </Container>
  );
};

export default CodeResumePage; 