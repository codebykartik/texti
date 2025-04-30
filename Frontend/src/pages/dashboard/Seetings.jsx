import { useState } from 'react';
import {
  Box, Paper, Typography, Divider, Switch, FormControlLabel,
  TextField, Button, Grid, Avatar, IconButton, List, ListItem,
  ListItemIcon, ListItemText, ListItemSecondaryAction, Alert
} from '@mui/material';
import DashboardLayout from '../../components/common/DashboardLayout';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  
  // Preference states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultTransformation, setDefaultTransformation] = useState('formal');
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    
    try {
      // In a real app, this would call your API
      // await api.put('/user/profile', { name, email });
      
      // Simulate API call
      setTimeout(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      // In a real app, this would call your API
      // await api.put('/user/password', { currentPassword, newPassword });
      
      // Simulate API call
      setTimeout(() => {
        setSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSaved(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('Failed to change password. Please check your current password.');
    }
  };
  
  const handlePreferenceChange = async (setting, value) => {
    try {
      // In a real app, this would call your API
      // await api.put('/user/preferences', { [setting]: value });
      
      // For now just update local state
      if (setting === 'emailNotifications') {
        setEmailNotifications(value);
      } else if (setting === 'darkMode') {
        setDarkMode(value);
      }
    } catch (err) {
      console.error('Failed to update preference:', err);
    }
  };
  
  const handleAccountDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call your API and then log the user out
      alert('Account deletion would be implemented here');
    }
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout title="Account Settings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                alt={user?.name || 'User'}
                src={user?.avatar || ''}
              >
                {user?.name?.[0] || 'U'}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
              />
              <label htmlFor="icon-button-file">
                <IconButton 
                  color="primary" 
                  aria-label="upload picture" 
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>
            
            {saved && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Your changes have been saved!
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleUpdateProfile}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                margin="normal"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={newPassword !== confirmPassword && confirmPassword !== ''}
                helperText={
                  newPassword !== confirmPassword && confirmPassword !== '' 
                    ? 'Passwords do not match' 
                    : ''
                }
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Update Password
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive updates about your account and new features"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode" 
                  secondary="Switch between light and dark themes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={darkMode}
                    onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Default Transformation" 
                  secondary="Set your preferred transformation type"
                />
                <ListItemSecondaryAction>
                  <Button variant="text" size="small">
                    Change
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Delete Account" 
                  secondary="Permanently delete your account and all data"
                />
                <ListItemSecondaryAction>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={handleAccountDelete}
                  >
                    Delete
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <LogoutIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  secondary="Sign out of your account"
                />
                <ListItemSecondaryAction>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Settings;