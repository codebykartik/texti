import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useAuth } from '../../contexts/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          404: Page Not Found
        </Typography>
        
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to={isAuthenticated ? '/' : '/'} 
            size="large"
          >
            Go to {isAuthenticated ? 'Home' : 'Home'}
          </Button>
          
          <Button 
            variant="outlined"
            component={RouterLink}
            to="/contact"
            size="large"
          >
            Contact Support
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;