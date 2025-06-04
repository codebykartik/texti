import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Button, Container, Typography, AppBar, Toolbar, IconButton, Link,
    Grid, Card, CardContent, CardMedia, TextField, Stack, Paper, Avatar,
    useMediaQuery, Divider, Menu, MenuItem, Fade, Chip, Tabs, Tab, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ChatIcon from '@mui/icons-material/Chat';
import LanguageIcon from '@mui/icons-material/Language';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TuneIcon from '@mui/icons-material/Tune';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Logo from '../../components/common/Logo';

// Language selector component for internationalization
const LanguageSelector = () => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];
  
  const [currentLang, setCurrentLang] = useState(() => 
    localStorage.getItem('language') || navigator.language?.split(/[-_]/)[0] || 'en'
  );
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('language', langCode);
    handleClose();
  };
  
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <Box>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<TranslateIcon fontSize="small" />}
        sx={{
          color: 'text.secondary',
          fontSize: '0.875rem',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'primary.main',
          }
        }}
        aria-label="Select language"
      >
        {currentLanguage.flag} {currentLanguage.name}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 2,
          sx: { 
            mt: 1.5, 
            minWidth: 180, 
            borderRadius: 2,
            overflow: 'visible',
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
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageSelect(lang.code)}
            selected={currentLang === lang.code}
            sx={{ 
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.lighter',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                {lang.flag}
              </Box>
            </ListItemIcon>
            <ListItemText primary={lang.name} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

// Feature section images - preloaded and optimized
const featureImages = {
    styleTransformer: "/assets/images/features/style-transformer.png",
    emailPolisher: "/assets/images/features/email-polisher.png",
    audienceRewriter: "/assets/images/features/audience-rewriter.png",
    smartAnalysis: "/assets/images/features/smart-analysis.png",
    moreFeatures: "/assets/images/features/more-features.png",
};

// How it works images
const howItWorksImages = {
    step1: "/assets/images/how-it-works/step-1.png",
    step2: "/assets/images/how-it-works/step-2.png",
    step3: "/assets/images/how-it-works/step-3.png",
    demo: "/assets/images/how-it-works/demo.png",
};

// Testimonial images
const testimonialImages = {
    sarah: "/assets/images/testimonials/sarah-j.jpg",
    michael: "/assets/images/testimonials/michael-t.jpg",
    rebecca: "/assets/images/testimonials/rebecca-l.jpg",
    company1: "/assets/images/testimonials/company-1.png",
    company2: "/assets/images/testimonials/company-2.png",
};

// Other images
const miscImages = {
    heroApp: "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    heroBg: "/assets/images/hero-bg.jpg",
    brandLogos: [
        "/assets/images/brands/brand-1.png",
        "/assets/images/brands/brand-2.png",
        "/assets/images/brands/brand-3.png",
        "/assets/images/brands/brand-4.png",
        "/assets/images/brands/brand-5.png"
    ],
    patternBg: "/assets/images/pattern-bg.png",
    social: {
        facebook: "/assets/images/social/facebook.svg",
        twitter: "/assets/images/social/twitter.svg",
        linkedin: "/assets/images/social/linkedin.svg",
        instagram: "/assets/images/social/instagram.svg"
    }
};

// Preload critical images for better performance
const preloadImages = () => {
    const criticalImages = [
        miscImages.heroApp,
        miscImages.heroBg,
        featureImages.styleTransformer,
        testimonialImages.sarah,
        testimonialImages.michael,
        testimonialImages.rebecca
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [email, setEmail] = useState('');
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [featureTab, setFeatureTab] = useState(0);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    
    // Auto slider for testimonials
    const testimonialIntervalRef = useRef(null);
    
    useEffect(() => {
        // Start testimonial auto slider
        testimonialIntervalRef.current = setInterval(() => {
            setTestimonialIndex(prevIndex => 
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000);
        
        // Preload critical images on component mount
        preloadImages();
        
        // Clean up interval on unmount
        return () => {
            if (testimonialIntervalRef.current) {
                clearInterval(testimonialIntervalRef.current);
            }
        };
    }, []);

    const handleOpenMobileMenu = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleCloseMobileMenu = () => {
        setMobileMenuAnchor(null);
    };

    const handleFeatureTabChange = (event, newValue) => {
        setFeatureTab(newValue);
    };

    const navItems = [
        { text: 'Features', href: '#features' },
        { text: 'How It Works', href: '#how-it-works' },
        { text: 'Pricing', href: '#pricing' },
        { text: 'Contact', href: '#contact' },
    ];

    const features = [
        {
            icon: <AutoFixHighIcon fontSize="large" />,
            title: 'Style Transformer',
            description: 'Convert any sentence into formal, casual, humorous, Shakespearean, or emoji-rich text instantly.',
            image: featureImages.styleTransformer,
            details: [
                'Formal business communication',
                'Casual social media posts',
                'Creative writing styles',
                'Historical language patterns'
            ]
        },
        {
            icon: <ChatIcon fontSize="large" />,
            title: 'Email Polisher',
            description: 'Analyze draft emails for tone, professionalism, and clarity before sending.',
            image: featureImages.emailPolisher,
            details: [
                'Tone analysis and suggestions',
                'Grammar and spelling check',
                'Cultural sensitivity review',
                'Professional formatting'
            ]
        },
        {
            icon: <LanguageIcon fontSize="large" />,
            title: 'Audience Rewriter',
            description: 'Rewrite text for specific audiences - from 5-year-olds to tech experts.',
            image: featureImages.audienceRewriter,
            details: [
                'Age-appropriate language',
                'Technical vs. layman explanations',
                'Industry-specific terminology',
                'Cultural context adaptation'
            ]
        },
        {
            icon: <SpeedIcon fontSize="large" />,
            title: 'Smart Analysis',
            description: 'Get instant feedback on sentiment, keywords, and readability of your text.',
            image: featureImages.smartAnalysis,
            details: [
                'Sentiment and emotion detection',
                'Keyword extraction and scoring',
                'Readability metrics',
                'Content quality assessment'
            ]
        },
    ];

    const extraFeatures = [
        {
            icon: <EmojiEmotionsIcon fontSize="large" />,
            title: 'Sentiment Enhancer',
            description: 'Adjust the emotional tone of your text to convey exactly the right feeling.'
        },
        {
            icon: <TuneIcon fontSize="large" />,
            title: 'Length Optimizer',
            description: 'Expand concise text or summarize lengthy content to the perfect length.'
        },
        {
            icon: <SchoolIcon fontSize="large" />,
            title: 'Learning Assistant',
            description: 'Turn complex concepts into easily understandable explanations for studying.'
        },
        {
            icon: <TranslateIcon fontSize="large" />,
            title: 'Global Localizer',
            description: 'Adapt your text for different cultural contexts while preserving meaning.'
        }
    ];

    const featureCategories = [
        { label: 'Writing Styles', features: ['Academic', 'Business', 'Creative', 'Technical', 'Casual', 'Formal', 'Persuasive'] },
        { label: 'Tones', features: ['Friendly', 'Professional', 'Empathetic', 'Authoritative', 'Humorous', 'Serious', 'Inspirational'] },
        { label: 'Audiences', features: ['General', 'Technical', 'Children', 'Executives', 'Customers', 'Investors', 'Employees'] },
        { label: 'Use Cases', features: ['Emails', 'Reports', 'Social Media', 'Blog Posts', 'Marketing', 'Documentation', 'Messaging'] }
    ];

    const howItWorksTabs = [
        {
            title: 'Input Your Text',
            description: 'Type or paste your text into the editor. From casual messages to formal emails, it all works with our advanced NLP model.',
            image: howItWorksImages.step1,
            features: [
                'Supports text of any length',
                'Handles multiple languages',
                'Preserves formatting when needed',
                'Instant AI processing'
            ]
        },
        {
            title: 'Select Transformation',
            description: 'Choose from multiple transformation styles and fine-tune the output with advanced customization options.',
            image: howItWorksImages.step2,
            features: [
                'Over 20 transformation styles',
                'Adjustable intensity settings',
                'Save custom presets',
                'Combine multiple transformations'
            ]
        },
        {
            title: 'Get Results Instantly',
            description: 'Our AI immediately transforms your text according to your selection. Copy, save, share or further edit.',
            image: howItWorksImages.step3,
            features: [
                'Compare before/after views',
                'One-click copy to clipboard',
                'Export to various formats',
                'Share directly to platforms'
            ]
        }
    ];

    const testimonials = [
        {
            name: 'Sarah J.',
            role: 'Marketing Director at TechVision',
            company: 'TechVision',
            companyLogo: testimonialImages.company1,
            comment: 'TextCraft AI transformed our marketing copy instantly. What used to take hours of editing now takes seconds! Our engagement metrics improved by 37% after we started using the platform for our social media and email campaigns.',
            rating: 5,
            avatar: testimonialImages.sarah,
            platform: 'TrustPilot'
        },
        {
            name: 'Michael T.',
            role: 'Software Engineer at CloudWave',
            company: 'CloudWave',
            companyLogo: testimonialImages.company2,
            comment: 'I use the Chrome extension daily for writing better emails and documentation. The technical-to-layman translation feature is a game changer when communicating with non-technical stakeholders about complex features.',
            rating: 5,
            avatar: testimonialImages.michael,
            platform: 'G2Crowd'
        },
        {
            name: 'Rebecca L.',
            role: 'Content Creator & Influencer',
            company: 'Self-employed',
            comment: 'The different writing styles have helped me create more engaging content for different platforms. I can write once and adapt it for LinkedIn, Instagram, and TikTok audiences with just a few clicks. My engagement rates have doubled!',
            rating: 5,
            avatar: testimonialImages.rebecca,
            platform: 'Product Hunt'
        },
    ];

    const pricingPlans = [
        {
            title: 'Free',
            price: '$0',
            period: 'forever',
            features: [
                '50 transformations/month',
                'Basic text styles',
                'Chrome extension',
                'No credit card required'
            ],
            buttonText: 'Sign Up Free',
            buttonVariant: 'outlined'
        },
        {
            title: 'Pro',
            price: '$9.99',
            period: 'per month',
            features: [
                'Unlimited transformations',
                'All text styles',
                'Email analysis',
                'Advanced audience targeting',
                'Saved transformation history'
            ],
            buttonText: 'Go Pro',
            buttonVariant: 'contained',
            highlighted: true
        },
        {
            title: 'Team',
            price: '$29.99',
            period: 'per month',
            features: [
                'Everything in Pro',
                '5 team members',
                'Shared workspace',
                'Team analytics',
                'Priority support'
            ],
            buttonText: 'Contact Sales',
            buttonVariant: 'outlined'
        }
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert(`Thanks for subscribing with: ${email}`);
        setEmail('');
    };

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Header/Navigation */}
            <AppBar
                posi tion="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Container>
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Logo />

                        {/* Desktop Navigation */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.text}
                                    href={item.href}
                                    sx={{
                                        mx: 2,
                                        color: 'text.primary',
                                        textDecoration: 'none',
                                        position: 'relative',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: 'primary.main',
                                            '&::after': {
                                                width: '100%',
                                            }
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -4,
                                            left: 0,
                                            width: 0,
                                            height: 2,
                                            bgcolor: 'primary.main',
                                            transition: 'width 0.3s ease'
                                        }
                                    }}
                                >
                                    {item.text}
                                </Link>
                            ))}

                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                sx={{
                                    ml: 2,
                                    borderRadius: 2,
                                    px: 2.5
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/signup"
                                variant="contained"
                                sx={{
                                    ml: 2,
                                    borderRadius: 2,
                                    px: 2.5,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none',
                                        bgcolor: alpha(theme.palette.primary.main, 0.9)
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        {/* Language Selector (Desktop) */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
                            <LanguageSelector />
                        </Box>

                        {/* Mobile Navigation */}
                        <IconButton
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            color="inherit"
                            onClick={handleOpenMobileMenu}
                            aria-label="Open menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={mobileMenuAnchor}
                            open={Boolean(mobileMenuAnchor)}
                            onClose={handleCloseMobileMenu}
                            TransitionComponent={Fade}
                            PaperProps={{
                                elevation: 2,
                                sx: {
                                    mt: 2,
                                    minWidth: 200,
                                    borderRadius: 2
                                }
                            }}
                        >
                            {navItems.map((item) => (
                                <MenuItem
                                    key={item.text}
                                    component="a"
                                    href={item.href}
                                    onClick={handleCloseMobileMenu}
                                    sx={{ py: 1.5 }}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                            <Divider />
                            <MenuItem
                                component={RouterLink}
                                to="/login"
                                onClick={handleCloseMobileMenu}
                                sx={{ py: 1.5 }}
                            >
                                Login
                            </MenuItem>
                            <MenuItem
                                component={RouterLink}
                                to="/signup"
                                onClick={handleCloseMobileMenu}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    color: 'primary.main'
                                }}
                            >
                                Sign Up
                            </MenuItem>
                            
                            {/* Language Selector (Mobile) */}
                            <Divider />
                            <Box sx={{ px: 2, py: 1 }}>
                                <LanguageSelector />
                            </Box>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha('#f7f9fc', 0.9)} 0%, ${alpha('#e8f4ff', 0.9)} 100%), url(${miscImages.heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 8, sm: 10, md: 14 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', zIndex: 2 }}>
                                <Chip
                                    label="AI-Powered Text Processing"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 600,
                                        borderRadius: 1.5,
                                        px: 1
                                    }}
                                />
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 3,
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        backgroundImage: 'linear-gradient(45deg, #5569ff, #00bcd4)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        WebkitBackgroundClip: 'text',
                                        letterSpacing: '-0.5px',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Transform Your Text With AI Magic
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 4,
                                        color: 'text.secondary',
                                        fontWeight: 400,
                                        maxWidth: '90%',
                                        lineHeight: 1.5
                                    }}
                                >
                                    Your Swiss Army knife for text processing. Rewrite, format, and enhance your text in seconds.
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    mb: 4
                                }}>
                                    <Button
                                        component={RouterLink}
                                        to="/signup"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            px: 4,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}30`,
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': {
                                                boxShadow: (theme) => `0 10px 20px ${theme.palette.primary.main}40`,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        component="a"
                                        href="#how-it-works"
                                        variant="outlined"
                                        size="large"
                                        startIcon={<KeyboardArrowDownIcon />}
                                        sx={{
                                            py: 1.5,
                                            px: 4,
                                            fontSize: '1rem',
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2
                                            }
                                        }}
                                    >
                                        See How It Works
                                    </Button>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                color: 'warning.main'
                                            }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} fontSize="small" />
                                            ))}
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            4.9/5 Rating
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                '& .avatar': {
                                                    width: 26,
                                                    height: 26,
                                                    border: '2px solid white',
                                                    ml: -1,
                                                    '&:first-of-type': {
                                                        ml: 0
                                                    }
                                                }
                                            }}
                                        >
                                            <Avatar className="avatar" src={testimonialImages.sarah} alt="User Sarah" />
                                            <Avatar className="avatar" src={testimonialImages.michael} alt="User Michael" />
                                            <Avatar className="avatar" src={testimonialImages.rebecca} alt="User Rebecca" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            30K+ Users
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -15,
                                        left: -15,
                                        right: 15,
                                        bottom: 15,
                                        borderRadius: 3,
                                        background: 'linear-gradient(45deg, #5569ff20, #00bcd420)',
                                        zIndex: 0
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={miscImages.heroApp}
                                    alt="TextCraft AI in action"
                                    loading="eager"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 600,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        position: 'relative',
                                        zIndex: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transform: { xs: 'none', md: 'rotate(2deg)' }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Brands/Companies Section */}
            <Box sx={{ py: 5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Container>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            fontWeight: 500
                        }}
                    >
                        TRUSTED BY TEAMS AT
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 4,
                            opacity: 0.7,
                            '& img': {
                                height: 30,
                                filter: 'grayscale(100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    filter: 'grayscale(0%)',
                                    opacity: 1
                                }
                            }
                        }}
                    >
                        {miscImages.brandLogos.map((logo, index) => (
                            <Box key={index} component="img" src={logo} alt={`Company ${index + 1} logo`} />
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Example Transformation */}
            <Container sx={{ mt: 10, mb: 10 }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        mb: 2,
                        fontWeight: 700,
                        fontSize: { xs: '1.8rem', md: '2.2rem' }
                    }}
                >
                    See 
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{
                        mb: 6,
                        maxWidth: 750,
                        mx: 'auto'
                    }}
                >
                    Transform your everyday communications with a single click. Our AI understands context
                    and delivers tailored results for every scenario.
                </Typography>

                <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: '100%',
                                borderRadius: 3,
                                bgcolor: '#f8f9fb',
                                border: '1px dashed',
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Before: <span style={{ fontStyle: 'italic' }}>Casual Message</span>
                                </Typography>
                                <Chip
                                    label="Original"
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    "Hey boss, I can't come to work lol. Got sick from that restaurant we went to yesterday."
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: { xs: 'rotate(90deg)', md: 'rotate(0)' },
                            my: { xs: 2, md: 0 }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: 2,
                                    mb: 1
                                }}
                            >
                                <ArrowForwardIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    transform: { xs: 'rotate(-90deg)', md: 'rotate(0)' }
                                }}
                            >
                                TRANSFORM
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                height: '100%',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
                                border: '1px solid',
                                borderColor: 'primary.light',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    After: <span style={{ fontStyle: 'italic' }}>Formal Transformation</span>
                                </Typography>
                                <Chip
                                    label="AI Enhanced"
                                    color="primary"
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    "Dear Sir/Madam, I regret to inform you that I am unable to attend work today due to a food-related illness from our recent company lunch."
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Additional Example */}
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1
                        }}
                    >
                        View More Examples
                    </Button>
                </Box>
            </Container>

            {/* Features Section */}
            <Box
                id="features"
                sx={{
                    py: 10,
                    bgcolor: 'background.default',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: `url(${miscImages.patternBg}) repeat`,
                        opacity: 0.05,
                        zIndex: 0
                    }
                }}
            >
                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', md: '2.2rem' }
                        }}
                    >
                        Powerful Features
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            mb: 6,
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 750,
                            mx: 'auto'
                        }}
                    >
                        Transform your text in ways you never thought possible with our advanced AI algorithms
                    </Typography>

                    {/* Core Features Section with Interactive Tabs */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs
                                    value={featureTab}
                                    onChange={handleFeatureTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="feature tabs"
                                >
                                    {features.map((feature, idx) => (
                                        <Tab
                                            key={idx}
                                            label={feature.title}
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                minWidth: 'auto',
                                                px: 2
                                            }}
                                            id={`feature-tab-${idx}`}
                                            aria-controls={`feature-tabpanel-${idx}`}
                                        />
                                    ))}
                                </Tabs>
                            </Box>

                            {features.map((feature, idx) => (
                                <Box
                                    key={idx}
                                    role="tabpanel"
                                    hidden={featureTab !== idx}
                                    id={`feature-tabpanel-${idx}`}
                                    aria-labelledby={`feature-tab-${idx}`}
                                    sx={{ height: '100%' }}
                                >
                                    {featureTab === idx && (
                                        <Box sx={{ px: 1, height: '100%' }}>
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                                                {feature.description}
                                            </Typography>
                                            <Box sx={{ mb: 4 }}>
                                                {feature.details.map((detail, i) => (
                                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                        <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5 }} />
                                                        <Typography variant="body1">{detail}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<ArrowForwardIcon />}
                                                component={RouterLink}
                                                to="/signup"
                                                sx={{
                                                    borderRadius: 2,
                                                    px: 3,
                                                    py: 1,
                                                    fontWeight: 600,
                                                    boxShadow: 'none',
                                                }}
                                            >
                                                Try {feature.title}
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: '100%',
                                    minHeight: { xs: 300, md: 400 },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: 3
                                }}
                            >
                                <Box
                                    component="img"
                                    src={features[featureTab]?.image}
                                    alt={features[featureTab]?.title}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'all 0.5s ease-in-out',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Feature Categories */}
                    <Box sx={{ mt: 10 }}>
                        <Typography variant="h5" align="center" sx={{ mb: 5, fontWeight: 600 }}>
                            All the Tools You Need for Perfect Text
                        </Typography>

                        <Grid container spacing={3}>
                            {featureCategories.map((category, idx) => (
                                <Grid item xs={12} sm={6} md={3} key={idx}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 3,
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {category.label}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                            {category.features.map((item, i) => (
                                                <Chip
                                                    key={i}
                                                    label={item}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Additional Features Display */}
                    <Box sx={{ mt: 10 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src={featureImages.moreFeatures}
                                    alt="Advanced Features"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        mb: { xs: 3, md: 0 }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                    More Powerful Features
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                    TextCraft AI goes beyond basic text transformation with powerful AI-driven tools
                                    that help you communicate effectively in any situation.
                                </Typography>

                                <Grid container spacing={3}>
                                    {extraFeatures.map((feature, idx) => (
                                        <Grid item xs={12} sm={6} key={idx}>
                                            <Box sx={{ display: 'flex', mb: 3 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.lighter',
                                                        color: 'primary.main',
                                                        mr: 2
                                                    }}
                                                >
                                                    {feature.icon}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {feature.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {feature.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 600
                                    }}
                                >
                                    Explore All Features
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* How It Works */}
            <Box id="how-it-works" sx={{ py: 10 }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', md: '2.2rem' }
                        }}
                    >
                        How It Works
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            mb: 8,
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 750,
                            mx: 'auto'
                        }}
                    >
                        Transform your text in three simple steps with our intuitive interface
                    </Typography>

                    {/* Process Steps */}
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '10%',
                                right: '10%',
                                height: '4px',
                                bgcolor: 'background.default',
                                zIndex: 0,
                                display: { xs: 'none', md: 'block' }
                            }}
                        />

                        <Grid container spacing={6} sx={{ mb: 10 }}>
                            {howItWorksTabs.map((step, idx) => (
                                <Grid item xs={12} md={4} key={idx}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            zIndex: 1,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 70,
                                                height: 70,
                                                mb: 3,
                                                mx: 'auto',
                                                fontSize: '1.75rem',
                                                fontWeight: 700,
                                                boxShadow: 2,
                                                zIndex: 5
                                            }}
                                            aria-label={`Step ${idx + 1}`}
                                        >
                                            {idx + 1}
                                        </Avatar>

                                        <Paper
                                            elevation={3}
                                            sx={{
                                                overflow: 'hidden',
                                                borderRadius: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: 5
                                                },
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={step.image}
                                                alt={`Step ${idx + 1}: ${step.title}`}
                                                sx={{
                                                    width: '100%',
                                                    height: 200,
                                                    objectFit: 'cover'
                                                }}
                                            />

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                    {step.description}
                                                </Typography>

                                                <Divider sx={{ my: 2 }} />

                                                <Box sx={{ textAlign: 'left' }}>
                                                    {step.features.map((feature, i) => (
                                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 18 }} />
                                                            <Typography variant="body2">{feature}</Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Demo Video Section */}
                    <Box
                        sx={{
                            mt: 5,
                            p: 5,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #5569ff10 0%, #00bcd410 100%)',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ position: 'relative' }}>
                                    <Box
                                        component="img"
                                        src={howItWorksImages.demo}
                                        alt="Product Demo Video"
                                        sx={{
                                            width: '100%',
                                            borderRadius: 3,
                                            boxShadow: 2
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 70,
                                            height: 70,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: 3,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translate(-50%, -50%) scale(1.1)',
                                                bgcolor: 'primary.dark'
                                            }
                                        }}
                                    >
                                        <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                    Watch TextCraft AI in Action
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                    See how our users are transforming their writing process with TextCraft AI.
                                    This quick demo shows you all the features and capabilities you can access
                                    with just a few clicks.
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1.2,
                                            fontWeight: 600
                                        }}
                                    >
                                        Watch Demo
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1.2,
                                            fontWeight: 600
                                        }}
                                    >
                                        Schedule a Live Demo
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Button
                            component={RouterLink}
                            to="/getting-started"
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none',
                                    bgcolor: alpha(theme.palette.primary.main, 0.9)
                                }
                            }}
                        >
                            See Detailed Guide
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Testimonials Section - Improved UI for better presentation */}
            <Box
                sx={{
                    py: { xs: 8, md: 10 },
                    background: `linear-gradient(135deg, ${alpha('#f7f9fc', 0.97)} 0%, ${alpha('#e8f4ff', 0.97)} 100%)`,
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${miscImages.patternBg})`,
                        opacity: 0.035,
                        zIndex: 0
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', md: '2.2rem' },
                            position: 'relative',
                            display: 'inline-block',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            mb: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '30%',
                                width: '40%',
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: 'primary.main'
                            }
                        }}
                    >
                        What Our Users Say
                    </Typography>

                    <Typography
                        variant="body1"
                        align="center"
                        color="text.secondary"
                        sx={{
                            mb: 8,
                            maxWidth: 750,
                            mx: 'auto',
                            mt: 3
                        }}
                    >
                        Join thousands of satisfied users who have transformed their writing process
                    </Typography>

                    {/* Featured Testimonial - Card Style */}
                    <Box sx={{ position: 'relative', mb: 8 }}>
                        <Paper
                            elevation={4}
                            sx={{
                                borderRadius: { xs: 3, md: 4 },
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                zIndex: 1,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Grid container>
                                {/* Left column with testimonial content */}
                                <Grid item xs={12} md={8} sx={{ p: { xs: 3, md: 5 }, order: { xs: 2, md: 1 } }}>
                                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={testimonials[testimonialIndex].avatar}
                                                alt={testimonials[testimonialIndex].name}
                                                sx={{ 
                                                    width: 56, 
                                                    height: 56, 
                                                    mr: 2,
                                                    border: '3px solid white',
                                                    boxShadow: 1
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                                    {testimonials[testimonialIndex].name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {testimonials[testimonialIndex].role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        {testimonials[testimonialIndex].companyLogo && (
                                            <Box
                                                component="img"
                                                src={testimonials[testimonialIndex].companyLogo}
                                                alt={testimonials[testimonialIndex].company}
                                                sx={{ 
                                                    height: 40,
                                                    display: { xs: 'none', sm: 'block' }
                                                }}
                                            />
                                        )}
                                    </Box>
                                    
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            pl: 4,
                                            pr: 2, 
                                            py: 1,
                                            '&::before': {
                                                content: '"""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                fontSize: '4rem',
                                                lineHeight: 1,
                                                color: 'primary.lighter',
                                                fontFamily: 'Georgia, serif',
                                                height: 40
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            paragraph
                                            sx={{
                                                fontSize: { xs: '1rem', md: '1.25rem' },
                                                fontStyle: 'italic',
                                                lineHeight: 1.6,
                                                color: 'text.primary',
                                                mb: 3
                                            }}
                                        >
                                            {testimonials[testimonialIndex].comment}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                                                <StarIcon 
                                                    key={i} 
                                                    sx={{ 
                                                        fontSize: 20, 
                                                        color: 'warning.main' 
                                                    }} 
                                                />
                                            ))}
                                            <Typography 
                                                variant="body2" 
                                                sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}
                                            >
                                                on {testimonials[testimonialIndex].platform}
                                            </Typography>
                                        </Box>
                                        
                                        {/* Testimonial navigation dots */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {testimonials.map((_, idx) => (
                                                <Box
                                                    key={idx}
                                                    onClick={() => setTestimonialIndex(idx)}
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        bgcolor: testimonialIndex === idx ? 'primary.main' : 'grey.300',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.2)',
                                                            bgcolor: testimonialIndex === idx ? 'primary.main' : 'grey.400'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                
                                {/* Right column with accent color and image */}
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={4} 
                                    sx={{ 
                                        position: 'relative',
                                        bgcolor: 'primary.main',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        order: { xs: 1, md: 2 },
                                        minHeight: { xs: 200, md: 'auto' },
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: { xs: 3, md: 4 },
                                            color: 'white',
                                            position: 'relative',
                                            zIndex: 2,
                                            textAlign: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        <FormatQuoteIcon
                                            sx={{
                                                fontSize: 40,
                                                opacity: 0.4,
                                                mb: 2
                                            }}
                                        />
                                        
                                        <Typography
                                            variant="h5"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Success Stories
                                        </Typography>
                                        
                                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                                            Join over 30,000 users who are transforming their text every day.
                                        </Typography>
                                        
                                        <Box sx={{ mt: 'auto' }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography 
                                                    variant="h2" 
                                                    sx={{ 
                                                        fontWeight: 800,
                                                        fontSize: { xs: '3rem', md: '4rem' }
                                                    }}
                                                >
                                                    4.9
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        color: 'white'
                                                    }}
                                                >
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon key={i} sx={{ fontSize: { xs: 16, md: 20 } }} />
                                                    ))}
                                                </Box>
                                                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                                                    from 1,200+ reviews
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    
                                    {/* Decorative shapes */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            right: -20,
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            zIndex: 1
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -30,
                                            left: -30,
                                            width: 150,
                                            height: 150,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            zIndex: 1
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>

                    {/* Testimonials Grid - Improved visuals */}
                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: 2,
                                        transition: 'all 0.3s ease',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 4
                                        },
                                        pb: 2
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 3
                                            }}
                                        >
                                            <FormatQuoteIcon
                                                sx={{
                                                    fontSize: 36,
                                                    color: 'primary.lighter'
                                                }}
                                            />

                                            <Chip
                                                label={testimonial.platform}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </Box>

                                        <Typography
                                            variant="body1"
                                            paragraph
                                            sx={{
                                                mb: 4,
                                                fontStyle: 'italic',
                                                lineHeight: 1.7,
                                                minHeight: 140,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 5,
                                                WebkitBoxOrient: 'vertical',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            "{testimonial.comment}"
                                        </Typography>
                                        
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    src={testimonial.avatar}
                                                    alt={`${testimonial.name}'s profile picture`}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        mr: 2,
                                                        border: '2px solid white',
                                                        boxShadow: 1
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {testimonial.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {testimonial.role}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: 'warning.main'
                                                }}
                                            >
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <StarIcon key={i} sx={{ fontSize: 16 }} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Enhanced Call to Action - More distinct and engaging */}
                    <Box
                        sx={{
                            mt: 8,
                            position: 'relative',
                            zIndex: 1,
                            borderRadius: 5,
                            overflow: 'hidden',
                            boxShadow: 4
                        }}
                    >
                        <Paper
                            sx={{
                                p: { xs: 4, md: 5 },
                                borderRadius: 5,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
                                backdropFilter: 'blur(10px)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundImage: `url(${miscImages.patternBg})`,
                                    backgroundSize: 'cover',
                                    opacity: 0.05,
                                    zIndex: -1
                                }
                            }}
                            elevation={0}
                        >
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                                <Grid item xs={12} md={7}>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            textAlign: { xs: 'center', md: 'left' },
                                            mb: { xs: 2, md: 1 },
                                            backgroundImage: 'linear-gradient(45deg, #5569ff, #00bcd4)',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                            WebkitBackgroundClip: 'text',
                                        }}
                                    >
                                        Ready to Transform Your Writing?
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 400,
                                            textAlign: { xs: 'center', md: 'left' },
                                            maxWidth: { xs: '100%', md: '80%' }
                                        }}
                                    >
                                        Join thousands of satisfied users and start transforming your text today.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                                    <Button
                                        component={RouterLink}
                                        to="/signup"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            px: 4,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}30`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: (theme) => `0 10px 20px ${theme.palette.primary.main}40`,
                                                transform: 'translateY(-2px)'
                                            },
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Start Free Trial
                                    </Button>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            display: 'block', 
                                            mt: 1,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        No credit card required • Cancel anytime
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Pricing Section - Enhanced with better visual hierarchy */}
            <Box id="pricing" sx={{ py: 10 }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', md: '2.2rem' },
                            position: 'relative',
                            display: 'inline-block',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '30%',
                                width: '40%',
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: 'primary.main'
                            }
                        }}
                    >
                        Simple, Transparent Pricing
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            mb: 8,
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 750,
                            mx: 'auto',
                            mt: 3
                        }}
                    >
                        Choose the plan that works for your needs with no hidden fees
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: plan.highlighted ? 4 : 1,
                                        border: plan.highlighted ? '2px solid' : '1px solid',
                                        borderColor: plan.highlighted ? 'primary.main' : 'divider',
                                        position: 'relative',
                                        overflow: 'visible',
                                        transition: 'all 0.3s ease',
                                        transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                                        zIndex: plan.highlighted ? 2 : 1,
                                        '&:hover': {
                                            transform: plan.highlighted ? 'scale(1.07)' : 'scale(1.02)',
                                            boxShadow: plan.highlighted ? 5 : 2
                                        }
                                    }}
                                >
                                    {plan.highlighted && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -15,
                                                left: 0,
                                                right: 0,
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    py: 0.6,
                                                    px: 2.5,
                                                    borderRadius: 5,
                                                    display: 'inline-block',
                                                    fontWeight: 600,
                                                    boxShadow: 1
                                                }}
                                            >
                                                Most Popular
                                            </Typography>
                                        </Box>
                                    )}
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography
                                            variant="h5"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: plan.highlighted ? 'primary.main' : 'text.primary'
                                            }}
                                        >
                                            {plan.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: plan.highlighted ? 'primary.main' : 'text.primary'
                                                }}
                                            >
                                                {plan.price}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                                                /{plan.period}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 3 }} />
                                        <Box sx={{ mb: 4, minHeight: 200 }}>
                                            {plan.features.map((feature, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 2
                                                    }}
                                                >
                                                    <CheckCircleIcon
                                                        sx={{
                                                            color: plan.highlighted ? 'primary.main' : 'success.main',
                                                            mr: 1.5,
                                                            fontSize: 20
                                                        }}
                                                    />
                                                    <Typography variant="body1">{feature}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant={plan.buttonVariant}
                                            size="large"
                                            component={RouterLink}
                                            to="/signup"
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                boxShadow: plan.highlighted ? 2 : 0,
                                                '&:hover': {
                                                    boxShadow: plan.highlighted ? 3 : 0
                                                }
                                            }}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* FAQ Section - Enhanced with better organization */}
                    <Box
                        sx={{
                            mt: 8,
                            p: 4,
                            borderRadius: 3,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: 1
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 4, 
                                textAlign: 'center',
                                position: 'relative',
                                display: 'inline-block',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                {
                                    question: "Can I cancel my subscription anytime?",
                                    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                                },
                                {
                                    question: "Is there a limit to how much text I can transform?",
                                    answer: "Free users can transform up to 50 texts per month. Pro and Team subscribers enjoy unlimited transformations."
                                },
                                {
                                    question: "Do you offer discounts for students or non-profits?",
                                    answer: "Yes! We offer special pricing for students, educators, and non-profit organizations. Contact our support team for details."
                                },
                                {
                                    question: "Is my data secure and private?",
                                    answer: "Your privacy is our priority. We don't store your transformed text longer than necessary, and we never use your content to train our AI models."
                                }
                            ].map((faq, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: 3, 
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            height: '100%',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: 1,
                                                borderColor: 'primary.main' 
                                            }
                                        }}
                                    >
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                mb: 1.5,
                                                color: 'primary.main'
                                            }}
                                        >
                                            {faq.question}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {faq.answer}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                component={RouterLink}
                                to="/faq"
                                variant="text"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ fontWeight: 500 }}
                            >
                                View all FAQs
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Newsletter Signup - Visually improved */}
            <Box
                sx={{
                    py: 10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${miscImages.patternBg})`,
                        opacity: 0.1,
                        zIndex: 0
                    }
                }}
            >
                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                Stay Updated with TextCraft AI
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 500 }}>
                                Subscribe to our newsletter for tips, tricks, and updates on new features.
                                Be the first to know when we release exciting updates!
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={6} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: 'white', opacity: 0.9 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Exclusive tips & tricks
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: 'white', opacity: 0.9 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Feature previews
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: 'white', opacity: 0.9 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            No spam policy
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: 'white', opacity: 0.9 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Unsubscribe anytime
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={4}
                                sx={{
                                    py: 3,
                                    px: 3,
                                    borderRadius: 3,
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 2,
                                        color: 'text.primary',
                                        fontWeight: 600
                                    }}
                                >
                                    Join our newsletter
                                </Typography>
                                
                                <Box
                                    component="form"
                                    onSubmit={handleSubscribe}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: { xs: 2, sm: 0 }
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="email"
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderTopRightRadius: { xs: 4, sm: 0 },
                                                borderBottomRightRadius: { xs: 4, sm: 0 },
                                            }
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            py: 1.8,
                                            px: { xs: 2, sm: 4 },
                                            borderTopLeftRadius: { xs: 4, sm: 0 },
                                            borderBottomLeftRadius: { xs: 4, sm: 0 },
                                            whiteSpace: 'nowrap',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
                                        Subscribe Now
                                    </Button>
                                </Box>
                                
                                <Typography
                                    variant="caption"
                                    align="center"
                                    sx={{
                                        mt: 2,
                                        display: 'block',
                                        color: 'text.secondary'
                                    }}
                                >
                                    We respect your privacy. Unsubscribe at any time.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer - Improved visual design and consistency */}
            <Box id="footer" sx={{ pt: 10, pb: 6, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Logo />
                            <Typography variant="body2" sx={{ mt: 3, mb: 3, color: 'text.secondary', maxWidth: 300 }}>
                                TextCraft AI is your Swiss Army knife for text processing, powered by AI. Transform your writing instantly.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                                    <IconButton
                                        key={social}
                                        sx={{
                                            color: 'text.secondary',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                color: 'primary.main',
                                                bgcolor: 'primary.lighter'
                                            }
                                        }}
                                        size="small"
                                    >
                                        <Box
                                            component="img"
                                            src={miscImages.social[social]}
                                            alt={social}
                                            sx={{ width: 20, height: 20 }}
                                        />
                                    </IconButton>
                                ))}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                                Last updated: 2025-04-25 15:39:00
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                © 2025 TextCraft AI. All rights reserved.
                            </Typography>
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                                Product
                            </Typography>
                            <Stack spacing={2}>
                                <Link component={RouterLink} to="/features" color="text.secondary" underline="hover">
                                    Features
                                </Link>
                                <Link component={RouterLink} to="/pricing" color="text.secondary" underline="hover">
                                    Pricing
                                </Link>
                                <Link component={RouterLink} to="/getting-started" color="text.secondary" underline="hover">
                                    Getting Started
                                </Link>
                                <Link component={RouterLink} to="/integrations" color="text.secondary" underline="hover">
                                    Integrations
                                </Link>
                            </Stack>
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                                Company
                            </Typography>
                            <Stack spacing={2}>
                                <Link component={RouterLink} to="/about" color="text.secondary" underline="hover">
                                    About Us
                                </Link>
                                <Link component={RouterLink} to="/contact" color="text.secondary" underline="hover">
                                    Contact
                                </Link>
                                <Link component={RouterLink} to="/jobs" color="text.secondary" underline="hover">
                                    Careers
                                </Link>
                                <Link component={RouterLink} to="/blog" color="text.secondary" underline="hover">
                                    Blog
                                </Link>
                            </Stack>
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                                Resources
                            </Typography>
                            <Stack spacing={2}>
                                <Link component={RouterLink} to="/blog" color="text.secondary" underline="hover">
                                    Blog
                                </Link>
                                <Link component={RouterLink} to="/support" color="text.secondary" underline="hover">
                                    Support Center
                                </Link>
                                <Link component={RouterLink} to="/docs" color="text.secondary" underline="hover">
                                    Documentation
                                </Link>
                                <Link component={RouterLink} to="/api" color="text.secondary" underline="hover">
                                    API Docs
                                </Link>
                            </Stack>
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                                Legal
                            </Typography>
                            <Stack spacing={2}>
                                <Link component={RouterLink} to="/privacy" color="text.secondary" underline="hover">
                                    Privacy Policy
                                </Link>
                                <Link component={RouterLink} to="/terms" color="text.secondary" underline="hover">
                                    Terms of Service
                                </Link>
                                <Link component={RouterLink} to="/cookies" color="text.secondary" underline="hover">
                                    Cookie Policy
                                </Link>
                                <Link component={RouterLink} to="/gdpr" color="text.secondary" underline="hover">
                                    GDPR Compliance
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mt: 6, mb: 4 }} />

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: 2 
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Made with ❤️ by TextCraft AI Team • Logged in as {'' || "VanshSharmaSDEcontinue"}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                                Status
                            </Link>
                            <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>
                                Sitemap
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;