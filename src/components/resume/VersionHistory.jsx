import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { getVersions } from '../../services/resume.service';

const VersionHistory = ({ open, onClose, resumeId, onVersionSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVersions = async () => {
      try {
        setLoading(true);
        const data = await getVersions(resumeId);
        setVersions(data);
      } catch (err) {
        setError(err.message || 'Failed to load version history');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadVersions();
    }
  }, [open, resumeId]);

  const handleRestore = (version) => {
    onVersionSelect(version);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Version History
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : versions.length === 0 ? (
          <Typography align="center">No version history available</Typography>
        ) : (
          <List>
            {versions.map((version) => (
              <ListItem
                key={version.number}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={`Version ${version.number}`}
                  secondary={
                    <>
                      {format(new Date(version.createdAt), 'PPpp')}
                      <br />
                      By: {version.createdBy.username}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Restore this version">
                    <IconButton
                      edge="end"
                      onClick={() => handleRestore(version)}
                      color="primary"
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistory; 