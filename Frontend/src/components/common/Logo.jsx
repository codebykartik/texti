import { Box, Typography } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const Logo = ({ size = 'medium', showText = true }) => {
  const getIconSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 40;
      default: return 32;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 'h6';
      case 'large': return 'h4';
      default: return 'h5';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AutoFixHighIcon
        sx={{
          fontSize: getIconSize(),
          mr: 1,
          color: 'primary.main',
          transform: 'rotate(-15deg)'
        }}
      />
      {showText && (
        <Typography
          variant={getFontSize()}
          component="h1"
          sx={{
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(45deg, #5569ff, #00bcd4)',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            display: 'inline'
          }}
        >
          TextCraft AI
        </Typography>
      )}
    </Box>
  );
};

export default Logo;