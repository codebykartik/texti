import { useState } from 'react';
import { 
  Box, Paper, Typography, Grid, Button, Card, CardContent, CardMedia, 
  Stepper, Step, StepLabel, StepContent, Link, Alert
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExtensionIcon from '@mui/icons-material/Extension';
import DashboardLayout from '../../components/common/DashboardLayout';

const ExtensionPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: 'Download the Extension',
      description: `Download the TextCraft AI extension to transform text directly on any webpage. 
        Click the download button below to get started.`,
      action: (
        <Button 
          variant="contained" 
          startIcon={<GetAppIcon />}
          onClick={handleNext}
          sx={{ mt: 2 }}
        >
          Download Extension
        </Button>
      )
    },
    {
      label: 'Install in your Browser',
      description: `After downloading, go to your browser's extensions page and enable developer mode.
        Drag and drop the downloaded file or use the "Load unpacked" option to install.`,
      action: (
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="text" 
            onClick={handleBack} 
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mt: 1, mr: 1 }}
          >
            Next
          </Button>
        </Box>
      )
    },
    {
      label: 'Start Transforming Text',
      description: `You're all set! Now you can select any text on any webpage, right-click, and use TextCraft AI
        to transform it instantly. Sign in with your account to access all your saved transformations.`,
      action: (
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="text" 
            onClick={handleBack} 
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
            color="success"
            startIcon={<CheckCircleIcon />}
          >
            Done
          </Button>
        </Box>
      )
    }
  ];

  return (
    <DashboardLayout title="Browser Extension">
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transform Text Anywhere with our Browser Extension
            </Typography>
            <Typography variant="body1" paragraph>
              The TextCraft AI browser extension lets you transform text directly on any webpage.
              Select text, right-click, and access all the powerful transformation tools wherever you browse.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Currently available for Chrome, Edge, and Firefox browsers.
            </Alert>
            
            <Box sx={{ maxWidth: 600 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      {step.action}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image="/extension-preview.jpg" // Add an extension preview image to your public folder
              alt="Extension Preview"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <ExtensionIcon sx={{ mr: 1 }} /> TextCraft AI Extension
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Transform any text directly on websites. Quick, powerful, and seamlessly integrated with your TextCraft AI account.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Features:</Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                <li>
                  <Typography variant="body2">
                    Right-click text transformation on any webpage
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Sync with your TextCraft AI account
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Access your saved transformations
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Works offline with limited functionality
                  </Typography>
                </li>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <img src="/chrome-logo.png" alt="Chrome" height="24" />
                <img src="/firefox-logo.png" alt="Firefox" height="24" />
                <img src="/edge-logo.png" alt="Edge" height="24" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default ExtensionPage;