import { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
  ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip, Collapse,
  ListItemButton, Badge, useMediaQuery, useTheme, Chip
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExtensionIcon from '@mui/icons-material/Extension';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

const drawerWidth = 260;

const DashboardLayout = ({ children, title }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Set drawer closed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleToolsToggle = () => {
    setToolsOpen(!toolsOpen);
  };
  
  // Check if a menu item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Check if a tool submenu item is active
  const isToolActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { 
      text: 'Tools',
      icon: <TextFieldsIcon />,
      submenu: true,
      children: [
        { text: 'Text Transformer', icon: <TextFieldsIcon />, path: '/transform' },
        { text: 'Email Polisher', icon: <EmailIcon />, path: '/email-polisher' },
        { text: 'Text Insights', icon: <AnalyticsIcon />, path: '/text-insights' },
      ]
    },
    { text: 'History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Get Extension', icon: <ExtensionIcon />, path: '/extension', badge: 'New' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];
  
  // Current time
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const notifications = [
    { id: 1, message: "Your text transformation was saved successfully", time: "10 min ago" },
    { id: 2, message: "New feature: Email Polisher coming soon!", time: "2 hrs ago" },
    { id: 3, message: "Browser extension is now available", time: "1 day ago" },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="h4" noWrap component="div" sx={{ fontWeight: 600 }}>
              {`Welcome, ${user?.name || 'User'}`}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Typography variant="body2" color="textSecondary" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {currentTime}
          </Typography>
          
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={notifications.length} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            id="notifications-menu"
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            onClick={handleNotificationsClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                width: 320,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem sx={{ pb: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
            </MenuItem>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem key={notification.id} sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">View all notifications</Typography>
            </MenuItem>
          </Menu>
          
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} size="large" sx={{ ml: 1 }}>
              <Avatar 
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                alt={user?.name || 'User'}
                src={user?.avatar || ''}
              >
                {user?.name?.[0] || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                width: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem component={RouterLink} to="/profile">
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/settings">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
            },
          }),
          ...(!open && {
            width: theme.spacing(9),
            '& .MuiDrawer-paper': {
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
              width: theme.spacing(9),
              boxSizing: 'border-box',
            },
          }),
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Logo size="small" />
            </Box>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => 
              item.submenu ? (
                // Submenu item
                <Box key={item.text}>
                  <ListItemButton 
                    onClick={handleToolsToggle}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      ...(isActive('/transform') || isActive('/email-polisher') || isActive('/text-insights') ? {
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      } : {}),
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 36,
                        color: (isActive('/transform') || isActive('/email-polisher') || isActive('/text-insights')) ? 'primary.main' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: (isActive('/transform') || isActive('/email-polisher') || isActive('/text-insights')) ? 600 : 400,
                        }
                      }}
                    />
                    {toolsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  
                  <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.text}
                          component={RouterLink}
                          to={child.path}
                          sx={{
                            pl: 4,
                            py: 1.2,
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            ...(isToolActive(child.path) ? {
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                            } : {}),
                          }}
                        >
                          <ListItemIcon 
                            sx={{ 
                              minWidth: 36,
                              color: isToolActive(child.path) ? 'primary.main' : 'inherit',
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={child.text}
                            sx={{
                              '& .MuiTypography-root': {
                                fontWeight: isToolActive(child.path) ? 600 : 400,
                              }
                            }}
                          />
                          {child.badge && (
                            <Chip
                              label={child.badge}
                              color={child.badge === 'New' ? 'primary' : 'default'}
                              size="small"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem', 
                                fontWeight: 600, 
                                opacity: child.badge === 'Soon' ? 0.7 : 1 
                              }}
                            />
                          )}
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              ) : (
                // Regular menu item
                <ListItemButton
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    ...(isActive(item.path) ? {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                    } : {}),
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36,
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive(item.path) ? 600 : 400,
                      }
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      color="primary"
                      size="small"
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                    />
                  )}
                </ListItemButton>
              )
            )}
          </List>
          
          {/* User profile section */}
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 'auto'
            }}
          >
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {user.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflow: 'auto',
          height: '100vh',
        }}
      >
        <Toolbar />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Show icon based on current page */}
            {(isActive('/transform') || isActive('/transform')) && <TextFieldsIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/history') && <HistoryIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/settings') && <SettingsIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/') && <DashboardIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/email-polisher') && <EmailIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/text-insights') && <AnalyticsIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {isActive('/extension') && <ExtensionIcon sx={{ mr: 1.5, opacity: 0.8 }} />}
            {title}
          </Box>
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;