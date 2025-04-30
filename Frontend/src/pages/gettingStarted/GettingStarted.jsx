import { Box, Container, Typography, Paper, Stepper, Step, StepLabel, StepContent, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GettingStarted = () => {
  const steps = [
    {
      label: 'Create your account',
      description: `First, sign up for a free account on TextCraft AI. You only need an email address to get started.
                  The registration process takes less than 30 seconds.`,
      image: '/images/step1.png' // Placeholder - you'll need to add your own images
    },
    {
      label: 'Enter your text',
      description: `Once logged in, go to the Text Transformer tool and enter the text you want to transform.
                  This can be anything from an email draft to a casual message.`,
      image: '/images/step2.png'
    },
    {
      label: 'Choose a transformation style',
      description: `Select from multiple transformation styles like formal, casual, joke, Shakespearean, or emoji-rich.
                  Each style will transform your text in different ways to match your needs.`,
      image: '/images/step3.png'
    },
    {
      label: 'Get your transformed text',
      description: `Click the "Transform" button and watch as our AI instantly transforms your text.
                  You can then copy it, save it to your history, or try another transformation style.`,
      image: '/images/step4.png'
    },
    {
      label: 'Install the Chrome extension (optional)',
      description: `For even faster transformations, install our Chrome extension to transform text anywhere on the web.
                  Right-click on any text field to access TextCraft AI transformations.`,
      image: '/images/step5.png'
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button 
        component={RouterLink} 
        to="/" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4 }}
      >
        Back to Home
      </Button>
      
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Getting Started with TextCraft AI
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
        Follow these simple steps to start transforming your text with AI
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Stepper orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label} active={true}>
              <StepLabel 
                StepIconProps={{ 
                  icon: <CheckCircleIcon color="primary" />,
                }}
              >
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" paragraph>
                    {step.description}
                  </Typography>
                  
                  <Box 
                    component="img"
                    src={step.image}
                    alt={`Step ${index + 1}: ${step.label}`}
                    sx={{
                      width: '100%',
                      maxWidth: 600,
                      height: 'auto',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      my: 2
                    }}
                  />
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Paper sx={{ p: 4, borderRadius: 2, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Ready to Transform Your Text?
        </Typography>
        
        <Typography variant="body1" paragraph>
          With TextCraft AI, you can transform any text in seconds. Perfect for emails, social media posts, academic writing, and more.
        </Typography>
        
        <Button 
          component={RouterLink} 
          to="/signup" 
          variant="contained" 
          size="large"
          sx={{ mt: 2, py: 1.2, px: 4 }}
        >
          Sign Up Free
        </Button>
      </Paper>
      
      <Paper sx={{ p: 4, borderRadius: 2, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Is TextCraft AI free to use?
          </Typography>
          <Typography variant="body1" paragraph>
            Yes, TextCraft AI offers a free plan that includes 50 transformations per month. For unlimited transformations and additional features, we offer affordable Pro and Team plans.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            How accurate are the transformations?
          </Typography>
          <Typography variant="body1" paragraph>
            TextCraft AI uses advanced language models to ensure high-quality transformations. However, as with any AI tool, we recommend reviewing the output, especially for important communications.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Can I use TextCraft AI for any language?
          </Typography>
          <Typography variant="body1" paragraph>
            Currently, TextCraft AI primarily supports English text transformations. We're working on adding support for additional languages in the future.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Is my data secure?
          </Typography>
          <Typography variant="body1" paragraph>
            Yes, we take data security seriously. Your text is processed securely, and we do not store your transformations unless you explicitly save them to your history.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default GettingStarted;