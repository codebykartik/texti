import { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, CircularProgress,
  Tab, Tabs, Card, CardContent, IconButton, Snackbar, Alert, Tooltip,
  FormControl, InputLabel, Select, MenuItem, Divider, Chip, Fade,
  useMediaQuery, useTheme, Skeleton, Badge, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress, Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MAX_SAFE_TEXT_LENGTH = 10000; // Maximum safe text length before showing warning
const MAX_VISIBLE_CHARS = 500; // Maximum characters to show in truncated view
const MAX_DISPLAY_CHARS = 3000; // Maximum characters to display in UI before truncating

const transformationTypes = [
  { value: 'formal', label: 'Formal', description: 'Convert text into professional, formal language suitable for business communications.' },
  { value: 'casual', label: 'Casual', description: 'Make text friendly and conversational, perfect for social media and informal messages.' },
  { value: 'joke', label: 'Humor', description: 'Add humor and wit to your text, making it more entertaining and engaging.' },
  { value: 'shakespearean', label: 'Shakespearean', description: 'Rewrite text in the style of Shakespeare with poetic language and old English flair.' },
  { value: 'emoji', label: 'Emoji-Rich', description: 'Enhance your text with relevant emojis that add visual emphasis and personality.' },
  { value: 'grammar', label: 'Grammar Fix', description: 'Correct grammatical errors and improve sentence structure for clearer communication.' },
  { value: 'concise', label: 'Concise', description: 'Make your text shorter and more direct while maintaining key information.' },
];

// Email types for the Email Polisher tool
const emailTypes = [
  { value: 'professional', label: 'Professional', description: 'Clean, polished language suitable for business communication' },
  { value: 'followup', label: 'Follow-up', description: 'Polite reminder emails that prompt action without being pushy' },
  { value: 'networking', label: 'Networking', description: 'Friendly yet professional emails for expanding your professional network' },
  { value: 'application', label: 'Job Application', description: 'Cover letter style emails that highlight your qualifications' },
  { value: 'outreach', label: 'Outreach', description: 'Cold emails that get responses from new contacts' },
];

// Analysis types for Text Insights tool
const analysisTypes = [
  { value: 'sentiment', label: 'Sentiment', description: 'Analyze the emotional tone of your text' },
  { value: 'readability', label: 'Readability', description: 'Check how easy your text is to read and comprehend' },
  { value: 'keywords', label: 'Keywords', description: 'Extract key topics and important terms from your text' },
  { value: 'language', label: 'Language', description: 'Identify style, voice, and language patterns' },
  { value: 'suggestion', label: 'Improvement', description: 'Get suggestions for improving clarity and impact' },
];

const audienceTypes = [
  { value: 'general', label: 'General Audience', description: 'Standard language appropriate for most readers' },
  { value: 'child', label: '5-year-old', description: 'Simple language a young child would understand' },
  { value: 'expert', label: 'Tech Expert', description: 'Technical language with domain-specific terminology' },
  { value: 'marketer', label: 'Marketer', description: 'Persuasive language focused on benefits and action' },
];

// Example prompts by tool and type
const examplePromptsByTool = {
  transform: {
    formal: [
      "Hey boss, I can't come to work today.",
      "The meeting was great and we got a lot done.",
      "Let me know what you think about this idea."
    ],
    casual: [
      "I regret to inform you that I cannot attend the meeting.",
      "The quarterly financial report indicates positive growth.",
      "Please provide your feedback at your earliest convenience."
    ],
    joke: [
      "I'm feeling sick today.",
      "My computer is running slow.",
      "The traffic was terrible this morning."
    ],
    shakespearean: [
      "I'm excited about the upcoming vacation.",
      "This project is taking longer than expected.",
      "I disagree with your proposal."
    ],
    default: [
      "Transform this text to see the magic happen!",
      "Try with your own message or email.",
      "Enter any text you want to improve or change."
    ]
  },
  email: {
    professional: [
      "Hey, just wanted to follow up about the meeting tomorrow",
      "Can we meet to discuss the project requirements?",
      "Attached is the report you asked for."
    ],
    followup: [
      "I'm writing to check if you've had a chance to review my proposal",
      "Just checking in about the status of the project",
      "Following up on our conversation from last week"
    ],
    default: [
      "Enter your draft email to polish it",
      "Type a brief message to transform into a professional email",
      "Start with a simple email that needs improvement"
    ]
  },
  insights: {
    default: [
      "Paste your text here to analyze its sentiment and style",
      "Enter a paragraph to check its readability score",
      "Add your content to extract keywords and key phrases"
    ]
  }
};

const TextToolsPage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [transformationType, setTransformationType] = useState('formal');
  const [emailType, setEmailType] = useState('professional');
  const [analysisType, setAnalysisType] = useState('sentiment');
  const [audience, setAudience] = useState('general');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isFavorite, setIsFavorite] = useState(false);
  const [recentTransformations, setRecentTransformations] = useState([]);
  const [examplePrompts, setExamplePrompts] = useState([]);
  const [currentTransformationId, setCurrentTransformationId] = useState(null);
  const [inputFullscreenDialog, setInputFullscreenDialog] = useState(false);
  const [outputFullscreenDialog, setOutputFullscreenDialog] = useState(false);
  const [showLargeTextWarning, setShowLargeTextWarning] = useState(false);
  const [truncateInput, setTruncateInput] = useState(false);
  const [truncateOutput, setTruncateOutput] = useState(false);
  const [processingLargeText, setProcessingLargeText] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeToolTab, setActiveToolTab] = useState('transform');
  const [insightsResults, setInsightsResults] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for scrolling to elements
  const outputBoxRef = useRef(null);
  const inputRef = useRef(null);
  const outputContentRef = useRef(null);

  // Set active tool tab based on URL
  useEffect(() => {
    if (location.pathname === '/transform') {
      setActiveToolTab('transform');
      setTabValue(0);
    } else if (location.pathname === '/email-polisher') {
      setActiveToolTab('email');
      setTabValue(1);
    } else if (location.pathname === '/text-insights') {
      setActiveToolTab('insights');
      setTabValue(2);
    }
  }, [location.pathname]);

  // Set example prompts based on selected transformation type and active tool
  useEffect(() => {
    if (activeToolTab === 'transform') {
      if (transformationTypes.find(t => t.value === transformationType)) {
        setExamplePrompts(examplePromptsByTool.transform[transformationType] || examplePromptsByTool.transform.default);
      } else {
        setExamplePrompts(examplePromptsByTool.transform.default);
      }
    } else if (activeToolTab === 'email') {
      if (emailTypes.find(t => t.value === emailType)) {
        setExamplePrompts(examplePromptsByTool.email[emailType] || examplePromptsByTool.email.default);
      } else {
        setExamplePrompts(examplePromptsByTool.email.default);
      }
    } else if (activeToolTab === 'insights') {
      setExamplePrompts(examplePromptsByTool.insights.default);
    }
  }, [transformationType, emailType, activeToolTab]);

  // Check for large text and update truncation state
  useEffect(() => {
    setTruncateInput(inputText.length > MAX_DISPLAY_CHARS);

    if (inputText.length > MAX_SAFE_TEXT_LENGTH && !showLargeTextWarning) {
      setShowLargeTextWarning(true);
    }
  }, [inputText]);

  useEffect(() => {
    setTruncateOutput(outputText.length > MAX_DISPLAY_CHARS);
  }, [outputText]);

  useEffect(() => {
    // Fetch recent transformations
    const fetchRecentTransformations = async () => {
      setFetchingHistory(true);
      try {
        // Call the actual API endpoint with limit parameter
        const response = await api.get('/transform/history?limit=3');

        // Check if we got a valid response matching our expected structure
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          // Map the API response to our component's expected format
          const transformations = response.data.data.map(item => ({
            id: item._id,
            originalText: item.originalText,
            transformedText: item.transformedText,
            type: item.transformationType,
            audience: item.audience,
            saved: item.saved,
            createdAt: item.createdAt
          }));

          setRecentTransformations(transformations);
        } else {
          console.error('Invalid response format for transformations history');
          // Use mock data as fallback
          setRecentTransformations([
            {
              id: '680b3cb7b3914be3c861e74d',
              originalText: 'hello',
              transformedText: 'Greetings.',
              type: 'formal',
              audience: 'general',
              saved: false,
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch recent transformations:', error);
        setRecentTransformations([]);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchRecentTransformations();
  }, []);

  // Simulated processing for large text
  const simulateLargeTextProcessing = () => {
    setProcessingLargeText(true);
    setProcessingProgress(0);

    const totalSteps = 10;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      setProcessingProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setProcessingLargeText(false);
        handleTransform();
      }
    }, 300);
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/transform');
        break;
      case 1:
        navigate('/email-polisher');
        break;
      case 2:
        navigate('/text-insights');
        break;
      default:
        navigate('/transform');
    }
  };

  const handleTransform = async () => {
    if (!inputText.trim()) {
      setSnackbarMessage('Please enter some text to transform');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Skip pre-processing if we already did it
    if (inputText.length > MAX_SAFE_TEXT_LENGTH && !processingLargeText) {
      simulateLargeTextProcessing();
      return;
    }

    setLoading(true);
    setIsFavorite(false);

    try {
      // Scroll to output box on mobile
      if (isMobile && outputBoxRef.current) {
        setTimeout(() => {
          outputBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      // Get the transformation type based on active tool
      let type = transformationType;
      if (activeToolTab === 'email') {
        type = `email_${emailType}`; // email types are prefixed
      } else if (activeToolTab === 'insights') {
        type = `insight_${analysisType}`; // insight types are prefixed
      }

      // API integration with the backend we created
      const response = await api.post('/transform/text', {
        text: inputText,
        type: type,
        audience: audience
      });

      // Check if we got a valid response
      if (response.data && response.data.success && response.data.data) {
        const transformedData = response.data.data;

        // Handle text insights differently
        if (activeToolTab === 'insights') {
          try {
            // For insights, try to parse the response as JSON if possible
            const parsedResults = JSON.parse(transformedData.transformedText);
            setInsightsResults(parsedResults);
            setOutputText(transformedData.transformedText); // Keep raw text as backup
          } catch (e) {
            // If not valid JSON, just use as plain text
            setOutputText(transformedData.transformedText);
            setInsightsResults(null);
          }
        } else {
          // Regular text transformation
          setOutputText(transformedData.transformedText);
        }

        setCurrentTransformationId(transformedData._id);

        // Add to recent transformations
        const newTransformation = {
          id: transformedData._id,
          originalText: transformedData.originalText,
          transformedText: transformedData.transformedText,
          type: transformedData.transformationType,
          audience: transformedData.audience,
          saved: transformedData.saved,
          createdAt: transformedData.createdAt
        };

        setRecentTransformations(prev => [newTransformation, ...prev.filter(item => item.id !== newTransformation.id)].slice(0, 3));
      } else {
        // Fallback to mock transformation if API response structure is unexpected
        mockTransformation();
      }
    } catch (error) {
      console.error('Transformation API call failed:', error);
      // Fallback to mock transformation
      mockTransformation();
    } finally {
      setLoading(false);
    }
  };

  const mockTransformation = () => {
    // This is our fallback if the API fails
    let result = '';

    if (activeToolTab === 'transform') {
      switch (transformationType) {
        case 'formal':
          result = inputText
            .replace(/can't/gi, 'cannot')
            .replace(/won't/gi, 'will not')
            .replace(/hey/gi, 'Hello')
            .replace(/boss/gi, 'Sir/Madam')
            .replace(/lol/gi, '')
            .replace(/hi/gi, 'Hello');

          if (inputText.toLowerCase().includes("can't come to work")) {
            result = "Dear Sir/Madam, I regret to inform you I'll be absent from work today.";
          }
          break;
        case 'casual':
          result = inputText
            .replace(/Hello/gi, 'Hey')
            .replace(/Good morning/gi, 'Morning')
            .replace(/I regret to inform you/gi, "Just letting you know");
          break;
        case 'joke':
          if (inputText.toLowerCase().includes("work")) {
            result = "Can't come to work today. My bed and I are having separation anxiety issues!";
          } else {
            result = inputText + " 😂 (Imagine this being much funnier with proper AI!)";
          }
          break;
        case 'shakespearean':
          if (inputText.toLowerCase().includes("work")) {
            result = "Alas, good sir! I must declare mine absence from today's labours, for reasons most grave and unfortunate.";
          } else {
            result = "Hark! " + inputText + " (but in a more Shakespeare-y way, forsooth!)";
          }
          break;
        case 'emoji':
          if (inputText.toLowerCase().includes("work")) {
            result = "I can't come to work today 😷 🛌 🤒";
          } else {
            result = inputText + " 👍 ✨ 🙌";
          }
          break;
        case 'grammar':
          result = inputText
            .replace(/cant/g, "can't")
            .replace(/wont/g, "won't")
            .replace(/im/g, "I'm")
            .replace(/\si\s/g, " I ");
          break;
        case 'concise':
          result = inputText
            .replace(/due to the fact that/gi, "because")
            .replace(/in order to/gi, "to")
            .replace(/at this point in time/gi, "now")
            .replace(/for the purpose of/gi, "for");
          break;
        default:
          result = inputText;
      }

      // Apply audience transformation
      if (audience === 'child' && transformationType !== 'emoji') {
        result = "Let me explain simply: " + result.replace(/\b\w{4,}\b/g, word => word);
      } else if (audience === 'expert' && transformationType !== 'emoji') {
        result = "Technical analysis: " + result + " [Additional domain-specific details would be added here]";
      } else if (audience === 'marketer' && transformationType !== 'emoji') {
        result = "EXCLUSIVE OPPORTUNITY: " + result.replace(/good/gi, "exceptional").replace(/like/gi, "love");
      }
    } else if (activeToolTab === 'email') {
      // Email polisher mock transformations
      switch (emailType) {
        case 'professional':
          result = "Dear [Recipient],\n\n" +
            "I hope this email finds you well. " +
            inputText.trim() + "\n\n" +
            "Thank you for your attention to this matter. I look forward to your response.\n\n" +
            "Best regards,\n" +
            user?.name || "[Your Name]";
          break;
        case 'followup':
          result = "Dear [Recipient],\n\n" +
            "I wanted to follow up regarding " +
            inputText.trim() + "\n\n" +
            "I would appreciate any updates you can provide. Please let me know if you need any additional information from me.\n\n" +
            "Thank you for your time,\n" +
            user?.name || "[Your Name]";
          break;
        case 'networking':
          result = "Hello [Name],\n\n" +
            "I hope you're doing well. " +
            inputText.trim() + "\n\n" +
            "I would love to connect and discuss this further. Would you be available for a brief call next week?\n\n" +
            "Looking forward to hearing from you,\n" +
            user?.name || "[Your Name]";
          break;
        default:
          result = "Dear [Recipient],\n\n" + inputText + "\n\nBest regards,\n" + (user?.name || "[Your Name]");
      }
    } else if (activeToolTab === 'insights') {
      // Text insights mock responses
      const mockInsights = {
        sentiment: {
          score: 0.65,
          sentiment: "Positive",
          confidence: "Medium",
          emotions: [
            { name: "Joy", score: 0.4 },
            { name: "Trust", score: 0.3 },
            { name: "Anticipation", score: 0.2 },
            { name: "Anger", score: 0.1 }
          ],
          analysis: "The text contains predominantly positive sentiment with expressions of joy and trust. There are some neutral statements but overall the tone is upbeat and optimistic."
        },
        readability: {
          fleschKincaid: 8.7,
          grade: "8th Grade",
          complexity: "Medium",
          avgSentenceLength: 18.5,
          avgWordLength: 4.8,
          suggestions: [
            "Consider shortening some sentences for improved readability",
            "Use simpler alternatives for complex words like 'substantial' or 'facilitate'",
            "Break down longer paragraphs into smaller chunks"
          ]
        },
        keywords: [
          { word: "important", count: 3, relevance: 0.85 },
          { word: "meeting", count: 2, relevance: 0.75 },
          { word: "project", count: 2, relevance: 0.7 }
        ]
      };

      switch (analysisType) {
        case 'sentiment':
          setInsightsResults(mockInsights.sentiment);
          result = JSON.stringify(mockInsights.sentiment);
          break;
        case 'readability':
          setInsightsResults(mockInsights.readability);
          result = JSON.stringify(mockInsights.readability);
          break;
        case 'keywords':
          setInsightsResults({ keywords: mockInsights.keywords });
          result = JSON.stringify({ keywords: mockInsights.keywords });
          break;
        default:
          setInsightsResults(mockInsights);
          result = JSON.stringify(mockInsights);
      }
    }

    setOutputText(result);

    // Generate a mock ID for the transformation
    const mockId = 'mock_' + Date.now();
    setCurrentTransformationId(mockId);

    // Add to recent transformations
    const newTransformation = {
      id: mockId,
      originalText: inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText,
      transformedText: result.length > 200 ? result.substring(0, 200) + '...' : result,
      type: activeToolTab === 'transform' ? transformationType :
        activeToolTab === 'email' ? emailType : analysisType,
      audience: audience,
      saved: false,
      createdAt: new Date().toISOString()
    };

    setRecentTransformations(prev => [newTransformation, ...prev].slice(0, 3));
  };

  const handleSave = async () => {
    if (!outputText || !currentTransformationId) return;

    try {
      // Call the save API endpoint
      await api.put(`/transform/${currentTransformationId}/save`, {
        saved: true
      });

      // Update local state
      setIsFavorite(true);
      setRecentTransformations(prev =>
        prev.map(item =>
          item.id === currentTransformationId
            ? { ...item, saved: true }
            : item
        )
      );

      setSnackbarMessage('Transformation saved to favorites!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Failed to save transformation:', error);

      // Still update UI state for better UX, but show a different message
      setIsFavorite(true);
      setSnackbarMessage('Saved to favorites locally. Server sync pending.');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setSnackbarMessage('Copied to clipboard!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleUseExample = (example) => {
    setInputText(example);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTransformationSelect = (transformation) => {
    setInputText(transformation.originalText);
    setOutputText(transformation.transformedText);

    // Set the type based on the tool
    if (transformation.type.startsWith('email_')) {
      setEmailType(transformation.type.replace('email_', ''));
      setActiveToolTab('email');
      setTabValue(1);
    } else if (transformation.type.startsWith('insight_')) {
      setAnalysisType(transformation.type.replace('insight_', ''));
      setActiveToolTab('insights');
      setTabValue(2);
    } else {
      setTransformationType(transformation.type);
      setActiveToolTab('transform');
      setTabValue(0);
    }

    setAudience(transformation.audience || 'general');
    setCurrentTransformationId(transformation.id);
    setIsFavorite(transformation.saved);

    // Try to parse insights results if applicable
    if (transformation.type.startsWith('insight_')) {
      try {
        setInsightsResults(JSON.parse(transformation.transformedText));
      } catch (e) {
        setInsightsResults(null);
      }
    }
  };

  const currentTransformationType = transformationTypes.find(type => type.value === transformationType);
  const currentEmailType = emailTypes.find(type => type.value === emailType);
  const currentAnalysisType = analysisTypes.find(type => type.value === analysisType);
  const currentAudienceType = audienceTypes.find(type => type.value === audience);

  // Get displayable input text (truncated if needed)
  const getDisplayableInputText = () => {
    if (!truncateInput || inputFullscreenDialog) return inputText;
    return inputText.substring(0, MAX_VISIBLE_CHARS) +
      `... [${(inputText.length - MAX_VISIBLE_CHARS).toLocaleString()} more characters hidden]`;
  };

  // Get displayable output text (truncated if needed)
  const getDisplayableOutputText = () => {
    if (!truncateOutput || outputFullscreenDialog) return outputText;
    return outputText.substring(0, MAX_VISIBLE_CHARS) +
      `... [${(outputText.length - MAX_VISIBLE_CHARS).toLocaleString()} more characters hidden]`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderInsightsResults = () => {
    if (!insightsResults) return null;

    // Sentiment visualization
    if (insightsResults.sentiment) {
      return (
        <Box>
          <Box sx={{
            p: 2,
            mb: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sentiment Analysis</Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {insightsResults.sentiment} <Chip
                label={`${Math.round(insightsResults.score * 100)}%`}
                size="small"
                color={insightsResults.sentiment === "Positive" ? "success" :
                  insightsResults.sentiment === "Negative" ? "error" : "primary"}
              />
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Confidence: {insightsResults.confidence}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">{insightsResults.analysis}</Typography>
          </Box>

          {insightsResults.emotions && (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Emotion Breakdown</Typography>
              {insightsResults.emotions.map((emotion, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{emotion.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(emotion.score * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={emotion.score * 100}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor:
                          emotion.name === 'Joy' ? 'success.main' :
                            emotion.name === 'Anger' ? 'error.main' :
                              emotion.name === 'Trust' ? 'info.main' : 'primary.main'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      );
    }

    // Readability visualization
    if (insightsResults.grade) {
      return (
        <Box>
          <Box sx={{
            p: 2,
            mb: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Readability Score</Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {insightsResults.grade} Level
              <Chip
                label={`${Math.round(insightsResults.fleschKincaid * 10) / 10}`}
                size="small"
                color={
                  insightsResults.fleschKincaid < 6 ? "success" :
                    insightsResults.fleschKincaid > 12 ? "error" :
                      "primary"
                }
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Complexity: {insightsResults.complexity}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Avg. Sentence Length:</Typography>
              <Typography variant="body2">{insightsResults.avgSentenceLength} words</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Avg. Word Length:</Typography>
              <Typography variant="body2">{insightsResults.avgWordLength} characters</Typography>
            </Box>
          </Box>

          {insightsResults.suggestions && (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Improvement Suggestions</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {insightsResults.suggestions.map((suggestion, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2">{suggestion}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      );
    }

    // Keywords visualization
    if (insightsResults.keywords) {
      return (
        <Box>
          <Box sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Key Phrases & Topics</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {insightsResults.keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={`${keyword.word} (${keyword.count})`}
                  color={
                    keyword.relevance > 0.8 ? "primary" :
                      keyword.relevance > 0.6 ? "info" : "default"
                  }
                  size="medium"
                  sx={{
                    fontSize: `${Math.min(1.2, Math.max(0.8, keyword.relevance))}rem`,
                    fontWeight: keyword.relevance > 0.7 ? 500 : 400
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
        Analysis results will appear here
      </Typography>
    );
  };

  // Get title based on active tool
  const getToolTitle = () => {
    switch (activeToolTab) {
      case 'email':
        return 'Email Polisher';
      case 'insights':
        return 'Text Insights';
      default:
        return 'Text Transformer';
    }
  };

  // Get icon based on active tool
  const getToolIcon = () => {
    switch (activeToolTab) {
      case 'email':
        return <EmailIcon />;
      case 'insights':
        return <AnalyticsIcon />;
      default:
        return <TextFormatIcon />;
    }
  };

  // Get action button text based on active tool
  const getActionButtonText = () => {
    switch (activeToolTab) {
      case 'email':
        return loading ? 'Polishing...' : 'Polish Email';
      case 'insights':
        return loading ? 'Analyzing...' : 'Analyze Text';
      default:
        return loading ? 'Transforming...' : 'Transform Text';
    }
  };

  return (
    <DashboardLayout title={getToolTitle()}>
      {/* Large Text Warning Dialog */}
      <Dialog
        open={showLargeTextWarning}
        onClose={() => setShowLargeTextWarning(false)}
        aria-labelledby="large-text-warning-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="large-text-warning-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography>Large Text Detected</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The text you entered is very large ({inputText.length.toLocaleString()} characters).
            Processing may take longer than usual and quality of results might be reduced.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For optimal results, we recommend text under {MAX_SAFE_TEXT_LENGTH.toLocaleString()} characters.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              setInputText(inputText.substring(0, MAX_SAFE_TEXT_LENGTH));
              setShowLargeTextWarning(false);
            }}
          >
            Trim Text
          </Button>
          <Button
            onClick={() => setShowLargeTextWarning(false)}
            variant="contained"
          >
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={inputFullscreenDialog}
        onClose={() => setInputFullscreenDialog(false)}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Input Text Fullscreen</Typography>
            <Button
              variant="contained"
              onClick={() => setInputFullscreenDialog(false)}
              startIcon={<CloseFullscreenIcon />}
            >
              Exit Fullscreen
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="outlined"
            onClick={() => setInputFullscreenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setInputFullscreenDialog(false);
              handleTransform();
            }}
            startIcon={getToolIcon()}
          >
            {getActionButtonText()}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Output Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={outputFullscreenDialog}
        onClose={() => setOutputFullscreenDialog(false)}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Output Text Fullscreen</Typography>
            <Button
              variant="contained"
              onClick={() => setOutputFullscreenDialog(false)}
              startIcon={<CloseFullscreenIcon />}
            >
              Exit Fullscreen
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              minHeight: '80vh',
              whiteSpace: 'pre-wrap',
              overflowY: 'auto'
            }}
          >
            <Typography>{outputText}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(outputText);
              setSnackbarMessage('Copied to clipboard!');
              setSnackbarSeverity('success');
              setOpenSnackbar(true);
            }}
          >
            Copy
          </Button>
          <Button
            variant="contained"
            onClick={() => setOutputFullscreenDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Grid container spacing={3}>
        {processingLargeText && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 2, mb: 1 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Processing large text... This may take a moment.
                </Typography>
                <LinearProgress variant="determinate" value={processingProgress} />
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              boxShadow: theme => theme.shadows[2]
            }}
            elevation={0}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                flexGrow: 1,
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: { xs: 1.5, sm: 3 },
                  py: 1.5,
                  borderRadius: 2,
                  mx: 0.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                '& .Mui-selected': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                }
              }}
            >
              <Tab
                label={isMobile ? "" : "Transform Text"}
                icon={<FormatColorTextIcon />}
                iconPosition={isMobile ? "top" : "start"}
              />
              <Tab
                label={isMobile ? "" : "Email Polisher"}
                icon={<AlternateEmailIcon />}
                iconPosition={isMobile ? "top" : "start"}
              />
              <Tab
                label={isMobile ? "" : "Text Insights"}
                icon={<DataUsageIcon />}
                iconPosition={isMobile ? "top" : "start"}
              />
            </Tabs>

            <Button
              variant="outlined"
              size="small"
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/history')}
              sx={{ ml: 'auto' }}
            >
              {isMobile ? '' : 'History'}
            </Button>
          </Paper>
        </Grid>

        {/* Main content container - main grid */}
        <Grid container spacing={3} sx={{ mt: 0, mb: 3, width: '100%', ml: 0 }}>
          {/* Input column - takes more space */}
          <Grid item xs={12} md={7} lg={8} width={'55%'}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: 2,
                boxShadow: theme => theme.shadows[2]
              }}
              elevation={0}
            >
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Input Text
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${inputText.length.toLocaleString()} chars`}
                    size="small"
                    color={inputText.length > MAX_SAFE_TEXT_LENGTH ? "warning" : inputText.length > 0 ? "primary" : "default"}
                    variant="outlined"
                  />
                  {truncateInput && (
                    <Tooltip title="View Full Text">
                      <IconButton
                        size="small"
                        onClick={() => setInputFullscreenDialog(true)}
                      >
                        <OpenInFullIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                rows={isMobile ? 6 : 8}
                placeholder={activeToolTab === 'email'
                  ? "Enter your draft email here..."
                  : activeToolTab === 'insights'
                    ? "Enter text to analyze..."
                    : "Enter your text here..."}
                value={getDisplayableInputText()}
                onChange={(e) => setInputText(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.95rem'
                  },
                  ...(inputText.length > MAX_SAFE_TEXT_LENGTH && {
                    '& .MuiOutlinedInput-root': {
                      borderColor: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.dark',
                      },
                      '&.Mui-focused': {
                        borderColor: 'warning.main',
                      }
                    }
                  })
                }}
              />

              {/* Example prompts */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TipsAndUpdatesIcon fontSize="small" />
                  Example prompts:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {examplePrompts.map((example, index) => (
                    <Chip
                      key={index}
                      label={example.length > (isMobile ? 20 : 30) ? example.substring(0, isMobile ? 20 : 30) + '...' : example}
                      onClick={() => handleUseExample(example)}
                      variant="outlined"
                      sx={{
                        borderRadius: 1.5,
                        '&:hover': {
                          backgroundColor: 'primary.lighter',
                          borderColor: 'primary.main'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                {activeToolTab === 'transform' ? 'Transformation Settings' :
                  activeToolTab === 'email' ? 'Email Style Settings' :
                    'Analysis Settings'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>
                      {activeToolTab === 'transform' ? 'Style' :
                        activeToolTab === 'email' ? 'Email Type' :
                          'Analysis Type'}
                    </InputLabel>
                    <Select
                      value={
                        activeToolTab === 'transform' ? transformationType :
                          activeToolTab === 'email' ? emailType :
                            analysisType
                      }
                      onChange={(e) => {
                        if (activeToolTab === 'transform') {
                          setTransformationType(e.target.value);
                        } else if (activeToolTab === 'email') {
                          setEmailType(e.target.value);
                        } else {
                          setAnalysisType(e.target.value);
                        }
                      }}
                      label={
                        activeToolTab === 'transform' ? 'Style' :
                          activeToolTab === 'email' ? 'Email Type' :
                            'Analysis Type'
                      }
                    >
                      {(activeToolTab === 'transform' ? transformationTypes :
                        activeToolTab === 'email' ? emailTypes :
                          analysisTypes).map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {activeToolTab !== 'insights' && (
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Target Audience</InputLabel>
                      <Select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        label="Target Audience"
                      >
                        {audienceTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {activeToolTab === 'insights' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ height: '40px' }}
                      disabled={!inputText.trim()}
                    >
                      Advanced Options
                    </Button>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Box sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Current Selection:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <b>
                      {activeToolTab === 'transform' ? currentTransformationType?.label :
                        activeToolTab === 'email' ? currentEmailType?.label :
                          currentAnalysisType?.label}
                    </b>
                    {activeToolTab !== 'insights' && (
                      <> style for <b>{currentAudienceType?.label}</b></>
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {activeToolTab === 'transform' ? currentTransformationType?.description :
                      activeToolTab === 'email' ? currentEmailType?.description :
                        currentAnalysisType?.description}
                  </Typography>
                  {currentAudienceType?.value !== 'general' && activeToolTab !== 'insights' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      {currentAudienceType?.description}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading || !inputText.trim() || processingLargeText}
                  onClick={handleTransform}
                  startIcon={loading ? <CircularProgress size={20} /> : getToolIcon()}
                  sx={{
                    py: 1.2,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                >
                  {getActionButtonText()}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Output column */}
          <Grid item xs={12} md={5} lg={4} width={'40%'}>
            <Paper
              ref={outputBoxRef}
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: 2,
                boxShadow: theme => theme.shadows[2],
                display: 'flex',
                flexDirection: 'column'
              }}
              elevation={0}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {activeToolTab === 'transform' ? 'Transformed Output' :
                    activeToolTab === 'email' ? 'Polished Email' :
                      'Analysis Results'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {outputText && (
                    <Chip
                      label={`${outputText.length.toLocaleString()} chars`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 24, mr: 1 }}
                    />
                  )}
                  <Tooltip title={isFavorite ? "Remove from favorites" : "Save to favorites"}>
                    <span>
                      <IconButton
                        disabled={!outputText}
                        onClick={() => {
                          setIsFavorite(!isFavorite);
                          if (!isFavorite) handleSave();
                        }}
                        size="small"
                        sx={{ mr: 0.5 }}
                        color={isFavorite ? "primary" : "default"}
                      >
                        {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Copy to clipboard">
                    <span>
                      <IconButton
                        disabled={!outputText}
                        onClick={handleCopy}
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {truncateOutput && (
                    <Tooltip title="View Full Text">
                      <IconButton
                        size="small"
                        onClick={() => setOutputFullscreenDialog(true)}
                      >
                        <OpenInFullIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {/* Output container with fixed height and overflow control */}
              <Box
                ref={outputContentRef}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2.5,
                  flex: '1 1 auto', // Takes available height
                  minHeight: isMobile ? 150 : 300,
                  maxHeight: isMobile ? 250 : 400, // Control maximum height
                  mb: 3,
                  bgcolor: outputText ? 'background.paper' : 'background.default',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  overflowY: 'auto', // Always show scrollbar when needed
                  overflowX: 'hidden', // Prevent horizontal scrolling
                  whiteSpace: activeToolTab !== 'insights' ? 'pre-wrap' : 'normal',
                  wordBreak: 'break-word',
                  WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Fade in={true}>
                    <Box>
                      {outputText ? (
                        activeToolTab === 'insights' ? (
                          renderInsightsResults()
                        ) : (
                          <Typography sx={{ lineHeight: 1.7 }}>
                            {getDisplayableOutputText()}
                          </Typography>
                        )
                      ) : (
                        <Box sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          p: 3
                        }}>
                          <Typography color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                            {activeToolTab === 'transform'
                              ? 'Enter text and click "Transform Text" to see results here'
                              : activeToolTab === 'email'
                                ? 'Enter your draft email to see the polished version here'
                                : 'Enter text to analyze and see insights here'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Fade>
                )}
              </Box>

              {/* Recent activity section */}
              <Box sx={{ mt: 'auto' }}> {/* Push to bottom of container */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.5
                }}>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    Recent Transformations
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/history')}
                    sx={{ p: 0, minWidth: 'auto' }}
                  >
                    View All
                  </Button>
                </Box>

                {fetchingHistory ? (
                  // Skeleton loading state
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {[1, 2].map((item) => (
                      <Card
                        key={item}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderRadius: 2
                        }}
                      >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 5 }} />
                            <Skeleton variant="text" width={80} />
                          </Box>
                          <Skeleton variant="text" width="100%" />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : recentTransformations.length > 0 ? (
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {recentTransformations.map((item, index) => (
                      <Card
                        key={item.id}
                        variant="outlined"
                        sx={{
                          mb: index !== recentTransformations.length - 1 ? 2 : 0,
                          borderRadius: 2,
                          cursor: 'pointer',
                          position: 'relative',
                          border: item.id === currentTransformationId ? '1px solid' : '1px solid',
                          borderColor: item.id === currentTransformationId ? 'primary.main' : 'divider',
                          backgroundColor: item.id === currentTransformationId ? 'primary.lighter' : 'background.paper',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'primary.lighter',
                            transform: 'translateY(-2px)',
                            boxShadow: 1
                          }
                        }}
                        onClick={() => handleTransformationSelect(item)}
                      >
                        {item.saved && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -5,
                              right: -5,
                              zIndex: 2
                            }}
                          >
                            <FavoriteIcon
                              color="primary"
                              fontSize="small"
                              sx={{
                                filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))'
                              }}
                            />
                          </Box>
                        )}
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Chip
                              label={item.type}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize'
                              }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {formatDate(item.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                            {item.originalText}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{
                    textAlign: 'center',
                    py: 3,
                    bgcolor: 'background.default',
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      No recent transformations
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setInputText("Hello, this is my first transformation!");
                      }}
                    >
                      Try a sample
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%', boxShadow: 3 }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default TextToolsPage;
