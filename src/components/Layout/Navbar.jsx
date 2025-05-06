import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Menu, MenuItem, Divider, 
  ListItemIcon, useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu as MenuIcon, User, LogOut, FileText, Settings, Plus, Code, BarChart, Upload, Home, ChevronDown } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createMenuAnchor, setCreateMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCreateMenuOpen = (event) => {
    setCreateMenuAnchor(event.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileClose();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Home',
      path: '/',
      icon: <Home size={20} />
    },
    {
      text: 'Dashboard',
      path: '/dashboard',
      icon: <FileText size={20} />,
      authRequired: true
    },
    {
      text: 'Resume Analyzer',
      path: '/analyzer',
      icon: <BarChart size={20} />
    },
    {
      text: 'Code Editor',
      path: '/code-resume',
      icon: <Code size={20} />
    },
    {
      text: 'Upload Resume',
      path: '/upload',
      icon: <Upload size={20} />
    }
  ];

  const createOptions = [
    {
      text: 'Standard Resume',
      path: '/create/standard',
      icon: <FileText size={18} />
    },
    {
      text: 'Code Resume',
      path: '/code-resume',
      icon: <Code size={18} />
    },
    {
      text: 'Use Template',
      path: '/templates',
      icon: <FileText size={18} />
    }
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: { width: 280 }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Menu</Typography>
        <List>
          {menuItems.map((item) => (
            (!item.authRequired || (item.authRequired && isAuthenticated)) && (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleMobileMenuToggle}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          ))}
          
          {isAuthenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <ListItem
                button
                component={Link}
                to="/profile"
                onClick={handleMobileMenuToggle}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <User size={20} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogOut size={20} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <ListItem
                button
                component={Link}
                to="/login"
                onClick={handleMobileMenuToggle}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/register"
                onClick={handleMobileMenuToggle}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Resume Generator
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
              {menuItems.map((item) => (
                (!item.authRequired || (item.authRequired && isAuthenticated)) && (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      mr: 1,
                      borderRadius: 1,
                      px: 1.5,
                      textTransform: 'none',
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && !isMobile && (
              <Button
                color="primary"
                startIcon={<Plus size={20} />}
                endIcon={<ChevronDown size={16} />}
                onClick={handleCreateMenuOpen}
                sx={{ 
                  mr: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Create
              </Button>
            )}

            {!isAuthenticated ? (
              !isMobile ? (
                <Box>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    sx={{ mr: 1, textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                  >
                    Register
                  </Button>
                </Box>
              ) : (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                >
                  <MenuIcon />
                </IconButton>
              )
            ) : (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="profile"
                  onClick={handleProfileClick}
                  sx={{ ml: { xs: 0, md: 2 } }}
                >
                  <Avatar
                    alt={user?.name || 'User'}
                    src={user?.profileImage}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
                {isMobile && (
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuToggle}
                    sx={{ ml: 1 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, width: 220, borderRadius: 2 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} to="/dashboard" onClick={handleProfileClose}>
          <ListItemIcon>
            <FileText size={18} />
          </ListItemIcon>
          My Resumes
        </MenuItem>
        <MenuItem component={Link} to="/profile" onClick={handleProfileClose}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/settings" onClick={handleProfileClose}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Create Menu */}
      <Menu
        anchorEl={createMenuAnchor}
        open={Boolean(createMenuAnchor)}
        onClose={handleCreateMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, width: 200, borderRadius: 2 }
        }}
      >
        {createOptions.map((option) => (
          <MenuItem
            key={option.text}
            component={Link}
            to={option.path}
            onClick={handleCreateMenuClose}
          >
            <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            {option.text}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      {renderMobileMenu()}
    </>
  );
};

export default Navbar; 