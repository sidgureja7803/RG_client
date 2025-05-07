import React, { useMemo } from 'react';
import { Box, Typography, Divider, List, ListItem, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';

const ResumePreview = ({ content, format: contentFormat }) => {
  const parsedContent = useMemo(() => {
    try {
      if (contentFormat === 'json') {
        return JSON.parse(content);
      }
      return content;
    } catch (error) {
      console.error('Failed to parse content:', error);
      return null;
    }
  }, [content, contentFormat]);

  if (!parsedContent) {
    return (
      <Box p={3}>
        <Typography color="error">
          Invalid content format. Please check your syntax.
        </Typography>
      </Box>
    );
  }

  if (contentFormat === 'markdown') {
    return (
      <Box p={3} className="markdown-preview">
        <ReactMarkdown>{DOMPurify.sanitize(content)}</ReactMarkdown>
      </Box>
    );
  }

  // JSON Format Preview
  const { basics, work, education, skills, projects, awards } = parsedContent;

  return (
    <Box p={3}>
      {/* Header/Basic Info */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          {basics?.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {basics?.label}
        </Typography>
        <Typography>
          {basics?.email} • {basics?.phone}
        </Typography>
        {basics?.website && (
          <Typography>
            <a href={basics.website} target="_blank" rel="noopener noreferrer">
              {basics.website}
            </a>
          </Typography>
        )}
        {basics?.summary && (
          <Typography variant="body1" mt={2}>
            {basics.summary}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Work Experience */}
      {work?.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Work Experience
          </Typography>
          {work.map((job, index) => (
            <Box key={index} mb={3}>
              <Typography variant="h6">{job.company}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {job.position}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDate(job.startDate)} - {formatDate(job.endDate)}
              </Typography>
              <Typography variant="body1" mt={1}>
                {job.summary}
              </Typography>
              {job.highlights && (
                <List>
                  {job.highlights.map((highlight, i) => (
                    <ListItem key={i}>{highlight}</ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Divider />

      {/* Education */}
      {education?.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Education
          </Typography>
          {education.map((edu, index) => (
            <Box key={index} mb={3}>
              <Typography variant="h6">{edu.institution}</Typography>
              <Typography variant="subtitle1">
                {edu.studyType} in {edu.area}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Typography>
              {edu.gpa && (
                <Typography variant="body2">GPA: {edu.gpa}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Divider />

      {/* Skills */}
      {skills?.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {skills.map((skill, index) => (
              <Paper
                key={index}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="body2">{skill.name}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Projects
          </Typography>
          {projects.map((project, index) => (
            <Box key={index} mb={3}>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body1">{project.description}</Typography>
              {project.keywords && (
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {project.keywords.map((keyword, i) => (
                    <Paper
                      key={i}
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: 'secondary.light',
                        color: 'secondary.contrastText',
                      }}
                    >
                      <Typography variant="body2">{keyword}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Awards */}
      {awards?.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Awards
          </Typography>
          {awards.map((award, index) => (
            <Box key={index} mb={2}>
              <Typography variant="h6">{award.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {award.date} - {award.awarder}
              </Typography>
              <Typography variant="body1">{award.summary}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  try {
    return format(new Date(dateString), 'MMM yyyy');
  } catch {
    return dateString;
  }
};

export default ResumePreview; 