import { useState, useEffect, useCallback } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Avatar, Button,
  Skeleton, CircularProgress, IconButton, Divider, Chip, Tooltip,
  LinearProgress, Tabs, Tab, Menu, MenuItem, ListItemIcon, ListItemText,
  useMediaQuery, useTheme
} from '@mui/material';
import DashboardLayout from '../../components/common/DashboardLayout';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import EmailIcon from '@mui/icons-material/Email';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RefreshIcon from '@mui/icons-material/Refresh';
import SchoolIcon from '@mui/icons-material/School';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Transform type icon mapping
const typeIcons = {
  'formal': <FormatColorTextIcon fontSize="small" />,
  'casual': <FormatColorTextIcon fontSize="small" />,
  'joke': <FormatQuoteIcon fontSize="small" />,
  'shakespearean': <SchoolIcon fontSize="small" />,
  'emoji': <FormatColorTextIcon fontSize="small" />,
  'grammar': <FormatColorTextIcon fontSize="small" />,
  'concise': <FormatColorTextIcon fontSize="small" />,
  'email_professional': <EmailOutlinedIcon fontSize="small" />,
  'email_followup': <EmailOutlinedIcon fontSize="small" />,
  'email_networking': <EmailOutlinedIcon fontSize="small" />,
  'email_application': <EmailOutlinedIcon fontSize="small" />,
  'email_outreach': <EmailOutlinedIcon fontSize="small" />,
  'insight_sentiment': <AnalyticsIcon fontSize="small" />,
  'insight_readability': <AnalyticsIcon fontSize="small" />,
  'insight_keywords': <AnalyticsIcon fontSize="small" />,
  'insight_language': <AnalyticsIcon fontSize="small" />,
  'insight_suggestion': <AnalyticsIcon fontSize="small" />
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    transformations: 0,
    saved: 0,
    recent: [], // Initialize with an empty array to avoid undefined
    byType: [],
    byDate: []
  });
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentDate = new Date('2025-04-25T11:15:51Z');
  const currentUser = 'VanshSharmaSDE';

  // Function to fetch dashboard stats
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Actual API call
      const response = await api.get('/transform/stats');
      
      if (response.data && response.data.success) {
        // Process transformation data by type for chart
        const byTypeData = prepareTypeData(response.data.data.byType || []);
        const byDateData = prepareDateData(response.data.data.byDate || []);
        
        setStats({
          transformations: response.data?.data?.total || 0,
          saved: response.data?.data?.saved || 0,
          byCategory: response.data?.data?.byCategory || {
            standard: 0,
            email: 0,
            insight: 0
          },
          byType: byTypeData,
          byDate: byDateData
        });
      } else {
        // Use mock data for demo or if API doesn't return expected format
        const mockData = generateMockStatsData();
        setStats(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data on error
      const mockData = generateMockStatsData();
      setStats(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch recent transformations
  const fetchRecentTransformations = useCallback(async () => {
    setRecentLoading(true);
    try {
      // Actual API call with limit parameter
      const response = await api.get('/transform/history?limit=5');
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setStats(prevStats => ({
          ...prevStats,
          recent: response.data.data.map(item => ({
            id: item._id,
            originalText: item.originalText,
            transformedText: item.transformedText,
            type: item.transformationType,
            saved: item.saved,
            audience: item.audience,
            createdAt: item.createdAt
          }))
        }));
      } else {
        // Use mock data
        setStats(prevStats => ({
          ...prevStats,
          recent: generateMockRecentData()
        }));
      }
    } catch (error) {
      console.error('Failed to fetch recent transformations:', error);
      // Use mock data on error
      setStats(prevStats => ({
        ...prevStats,
        recent: generateMockRecentData()
      }));
    } finally {
      setRecentLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    Promise.all([
      fetchDashboardData(),
      fetchRecentTransformations()
    ]).then(() => {
      setLoading(false);
      setRecentLoading(false);
    });
  }, [fetchDashboardData, fetchRecentTransformations]);

  // Prepare data for type chart
  const prepareTypeData = (typeData) => {
    // Format data for pie chart
    return typeData.map((item, index) => ({
      id: index,
      value: item.count,
      label: formatTypeLabel(item._id),
      color: getTypeColor(item._id)
    })).slice(0, 5); // Only take top 5 for chart clarity
  };

  // Prepare data for date chart (last 7 days)
  const prepareDateData = (dateData = []) => {
    // Create an array for the last 7 days
    const last7Days = [];
    const today = new Date('2025-04-25T11:15:51Z');
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Format as ISO date for matching
      const isoDate = date.toISOString().split('T')[0];
      
      // Find matching date in API data or use 0
      const dayData = dateData.find(item => item._id.split('T')[0] === isoDate);
      
      last7Days.push({
        date: formatDateShort(date),
        count: dayData ? dayData.count : 0
      });
    }
    
    return last7Days;
  };

  // Function to refresh all data
  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchRecentTransformations()
    ]);
    setRefreshing(false);
  };

  // Generate mock stats data for demo or fallback
  const generateMockStatsData = () => {
    // Create realistic distribution of transformation types
    const mockTypeData = [
      { id: 0, value: 18, label: 'Formal', color: theme.palette.primary.main },
      { id: 1, value: 12, label: 'Casual', color: theme.palette.secondary.main },
      { id: 2, value: 8, label: 'Humor', color: theme.palette.success.main },
      { id: 3, value: 7, label: 'Email', color: theme.palette.info.main },
      { id: 4, value: 5, label: 'Insights', color: theme.palette.warning.main }
    ];
    
    // Create realistic date chart data (trending upward for demo)
    const mockDateData = [
      { date: 'Apr 19', count: 3 },
      { date: 'Apr 20', count: 5 },
      { date: 'Apr 21', count: 4 },
      { date: 'Apr 22', count: 7 },
      { date: 'Apr 23', count: 9 },
      { date: 'Apr 24', count: 8 },
      { date: 'Apr 25', count: 6 }
    ];
    
    return {
      transformations: 42,
      saved: 15,
      byCategory: {
        standard: 30,
        email: 7,
        insight: 5
      },
      byType: mockTypeData,
      byDate: mockDateData,
      recent: generateMockRecentData()
    };
  };

  // Generate mock recent transformation data
  const generateMockRecentData = () => {
    return [
      { 
        id: '1', 
        originalText: 'Hey boss, I can\'t come to work lol.', 
        transformedText: 'Dear Sir/Madam, I regret to inform you I\'ll be absent from work today.', 
        type: 'formal', 
        saved: true,
        audience: 'general',
        createdAt: '2025-04-23T14:32:21Z' 
      },
      { 
        id: '2', 
        originalText: 'The meeting was super productive and we got a lot done.', 
        transformedText: 'The meeting yielded significant results and multiple action items were accomplished.', 
        type: 'formal', 
        saved: false,
        audience: 'general',
        createdAt: '2025-04-22T09:15:43Z' 
      },
      { 
        id: '3', 
        originalText: 'Due to the fact that we have a lot of work, I will be busy.', 
        transformedText: 'Because we have a lot of work, I will be busy.', 
        type: 'concise', 
        saved: false,
        audience: 'general',
        createdAt: '2025-04-21T16:08:12Z' 
      },
      {
        id: '4',
        originalText: 'Please review my application for the software developer position.',
        transformedText: 'Dear Hiring Manager,\n\nI hope this email finds you well. Please review my application for the software developer position. I believe my skills and experience make me an excellent candidate for this role.\n\nThank you for your consideration.\n\nBest regards,\nVansh Sharma',
        type: 'email_professional',
        saved: true,
        audience: 'expert',
        createdAt: '2025-04-20T11:24:33Z'
      },
      {
        id: '5',
        originalText: 'The new feature has significantly improved user engagement and satisfaction across all demographics.',
        transformedText: '{"sentiment":"Positive","score":0.82,"confidence":"High","emotions":[{"name":"Joy","score":0.7},{"name":"Trust","score":0.6},{"name":"Anticipation","score":0.4}],"analysis":"The text conveys strong positive sentiment, primarily expressing satisfaction and optimism about the new feature\'s impact."}',
        type: 'insight_sentiment',
        saved: false,
        audience: 'general',
        createdAt: '2025-04-19T10:15:21Z'
      }
    ];
  };

  // Helper function to get greeting based on time of day
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Format date for recent transformations
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format date for charts (short form)
  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format transformation type labels
  const formatTypeLabel = (type) => {
    if (!type) return 'Unknown';
    
    if (type.startsWith('email_')) {
      return type.replace('email_', '').replace(/\b\w/g, c => c.toUpperCase());
    } else if (type.startsWith('insight_')) {
      return type.replace('insight_', '').replace(/\b\w/g, c => c.toUpperCase());
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get color for transformation type
  const getTypeColor = (type) => {
    const colorMap = {
      'formal': theme.palette.primary.main,
      'casual': theme.palette.secondary.main,
      'joke': theme.palette.success.main,
      'shakespearean': theme.palette.info.main,
      'emoji': theme.palette.warning.main,
      'grammar': theme.palette.error.main,
      'concise': theme.palette.secondary.dark,
    };
    
    if (type.startsWith('email_')) {
      return theme.palette.info.main;
    }
    
    if (type.startsWith('insight_')) {
      return theme.palette.warning.main;
    }
    
    return colorMap[type] || theme.palette.grey[500];
  };

  // Get color for transformation type chip
  const getChipColor = (type) => {
    if (type.startsWith('email_')) return 'info';
    if (type.startsWith('insight_')) return 'warning';
    
    const colorMap = {
      'formal': 'primary',
      'casual': 'secondary',
      'joke': 'success',
      'shakespearean': 'info',
      'emoji': 'warning',
      'grammar': 'default',
      'concise': 'error',
    };
    
    return colorMap[type] || 'default';
  };

  // Handle tab change for activity/analytics
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open action menu for a transformation
  const handleOpenActionMenu = (event, item) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  // Close action menu
  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
    setSelectedItem(null);
  };

  // Copy transformation text
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard',
      severity: 'success'
    });
    handleCloseActionMenu();
  };

  // Toggle favorite status
  const handleToggleFavorite = async (item) => {
    try {
      await api.put(`/transform/${item.id}/save`, {
        saved: !item.saved
      });
      
      // Update UI
      setStats(prevStats => ({
        ...prevStats,
        recent: prevStats.recent.map(transformation => 
          transformation.id === item.id 
            ? { ...transformation, saved: !transformation.saved } 
            : transformation
        )
      }));
      
      setSnackbar({
        open: true,
        message: item.saved ? 'Removed from favorites' : 'Added to favorites',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update favorite status',
        severity: 'error'
      });
    }
    
    handleCloseActionMenu();
  };

  // Open in appropriate tool
  const handleOpenInTool = (item) => {
    handleCloseActionMenu();
    
    // Determine which tool to navigate to based on type
    let path = '/transform';
    
    if (item.type.startsWith('email_')) {
      path = '/email-polisher';
    } else if (item.type.startsWith('insight_')) {
      path = '/text-insights';
    }
    
    // Navigate with transformation data
    navigate(path, { 
      state: { 
        transformation: {
          id: item.id,
          type: item.type,
          originalText: item.originalText,
          transformedText: item.transformedText,
          audience: item.audience || 'general',
        } 
      }
    });
  };

  // Get icon for transformation type
  const getTypeIcon = (type) => {
    return typeIcons[type] || <FormatColorTextIcon fontSize="small" />;
  };

  // Get category count data for donut chart
  const getCategoryChartData = () => {
    const { byCategory = { standard: 0, email: 0, insight: 0 } } = stats;
    
    return [
      { id: 0, value: byCategory.standard || 0, label: 'Text', color: theme.palette.primary.main },
      { id: 1, value: byCategory.email || 0, label: 'Email', color: theme.palette.info.main },
      { id: 2, value: byCategory.insight || 0, label: 'Insights', color: theme.palette.warning.main }
    ];
  };

  return (
    <DashboardLayout title={`${getGreeting()}, ${user?.name?.split(' ')[0] || currentUser}!`}>
      {/* Top actions bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          startIcon={<RefreshIcon />}
          variant="outlined"
          disabled={refreshing}
          onClick={refreshData}
          size="small"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Stats'}
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats cards */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 2,
              height: '100%',
              boxShadow: 1,
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: 3 }
            }}
            elevation={1}
          >
            {loading ? (
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" height={40} />
                </Box>
              </Box>
            ) : (
              <>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <AutoFixHighIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Total Transformations
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.transformations}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 2,
              height: '100%',
              boxShadow: 1,
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: 3 }
            }}
            elevation={1}
          >
            {loading ? (
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" height={40} />
                </Box>
              </Box>
            ) : (
              <>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.light', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  <StarIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Saved Transformations
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.saved}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              height: '100%',
              boxShadow: 1,
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              cursor: 'pointer'
            }}
            elevation={1}
            onClick={() => navigate('/transform')}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                width: 56, 
                height: 56,
                mr: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <SpeedIcon fontSize="large" sx={{ color: 'primary.main' }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Quick Transform
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 1,
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.8)',
                  }
                }}
              >
                Start Now
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tool shortcuts - only visible on larger screens */}
        {!isMobile && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                      bgcolor: 'primary.lighter'
                    }
                  }}
                  onClick={() => navigate('/transform')}
                >
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <FormatColorTextIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Text Transformer
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Transform any text style
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                      bgcolor: 'info.lighter'
                    }
                  }}
                  onClick={() => navigate('/email-polisher')}
                >
                  <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Email Polisher
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Professional email writing
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                      bgcolor: 'warning.lighter'
                    }
                  }}
                  onClick={() => navigate('/text-insights')}
                >
                  <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                    <AnalyticsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Text Insights
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Analyze and improve content
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
        
        {/* Analytics charts */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              aria-label="dashboard tabs"
              sx={{ mb: 3 }}
            >
              <Tab 
                icon={<HistoryIcon />} 
                label={isMobile ? "" : "Recent Activity"} 
                id="tab-0" 
                iconPosition={isMobile ? "top" : "start"}
              />
              <Tab 
                icon={<TrendingUpIcon />} 
                label={isMobile ? "" : "Analytics"} 
                id="tab-1" 
                iconPosition={isMobile ? "top" : "start"}
              />
            </Tabs>
            
            {/* Recent Activity Tab */}
            {tabValue === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Transformations
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate('/history')}
                  >
                    View All
                  </Button>
                </Box>
                
                {recentLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                    </Box>
                  ))
                ) : stats.recent && stats.recent.length > 0 ? (
                  <Grid container spacing={2}>
                    {stats.recent.map((item) => (
                      <Grid item xs={12} key={item.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': { 
                              boxShadow: 2,
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={formatTypeLabel(item.type)} 
                                  color={getChipColor(item.type)} 
                                  size="small"
                                  icon={getTypeIcon(item.type)}
                                  sx={{ borderRadius: 1 }}
                                />
                                {item.saved && (
                                  <Tooltip title="Saved transformation">
                                    <FavoriteIcon 
                                      color="primary" 
                                      fontSize="small" 
                                      sx={{ width: 16, height: 16 }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                                  {formatDate(item.createdAt)}
                                </Typography>
                                <IconButton 
                                  size="small"
                                  onClick={(e) => handleOpenActionMenu(e, item)}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Divider sx={{ my: 1 }} />
                            
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                  Original Text:
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {item.originalText}
                                </Typography>
                              </Box>
                              <Divider orientation={isMedium ? "horizontal" : "vertical"} flexItem />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                  Transformed Text:
                                </Typography>
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {/* Handle JSON response for insights */}
                                  {item.type.startsWith('insight_') && item.transformedText.startsWith('{') 
                                    ? "Text analysis results (click to view details)"
                                    : item.transformedText}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box 
                    sx={{ 
                      py: 6, 
                      textAlign: 'center', 
                      bgcolor: 'background.default',
                      borderRadius: 2
                    }}
                  >
                    <Typography color="textSecondary" paragraph>
                      No recent transformations. Start transforming text to see your activity here!
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/transform')}
                    >
                      Transform Text Now
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Analytics Tab */}
            {tabValue === 1 && (
              <Box>
                <Grid container spacing={3}>
                  {/* Charts for analytics */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Transformations by Type
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                      </Box>
                    ) : stats.byType && stats.byType.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <PieChart
                          series={[
                            {
                              data: stats.byType,
                              innerRadius: 60,
                              paddingAngle: 2,
                              cornerRadius: 4,
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              arcLabel: (item) => `${item.label}: ${item.value}`,
                              arcLabelMinAngle: 30,
                            },
                          ]}
                          height={290}
                          slotProps={{
                            legend: {
                              direction: 'column',
                              position: { vertical: 'middle', horizontal: 'right' },
                              padding: 0,
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                          No transformation data available yet.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Transformations by Category
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ height: 300 }}>
                        <PieChart
                          series={[
                            {
                              data: getCategoryChartData(),
                              innerRadius: 60,
                              paddingAngle: 2,
                              cornerRadius: 4,
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              arcLabel: (item) => `${item.label}: ${item.value}`,
                              arcLabelMinAngle: 45,
                            },
                          ]}
                          height={290}
                          slotProps={{
                            legend: {
                              direction: 'column',
                              position: { vertical: 'middle', horizontal: 'right' },
                              padding: 0,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Past 7 Days Activity
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                      </Box>
                    ) : stats.byDate && stats.byDate.length > 0 ? (
                      <Box sx={{ height: isMobile ? 200 : 250 }}>
                        <BarChart
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: stats.byDate.map(day => day.date) 
                          }]}
                          series={[{
                            data: stats.byDate.map(day => day.count),
                            color: theme.palette.primary.main,
                            label: 'Transformations'
                          }]}
                          height={isMobile ? 200 : 250}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                          No activity data available for the past 7 days.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Action menu for transformation items */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => selectedItem && handleCopy(selectedItem.transformedText)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Text</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedItem && handleToggleFavorite(selectedItem)}>
          <ListItemIcon>
            {selectedItem?.saved ? <FavoriteBorderIcon fontSize="small" /> : <FavoriteIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{selectedItem?.saved ? 'Remove from Favorites' : 'Add to Favorites'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedItem && handleOpenInTool(selectedItem)}>
          <ListItemIcon>
            {selectedItem?.type.startsWith('email_') ? <EmailIcon fontSize="small" /> : 
             selectedItem?.type.startsWith('insight_') ? <AnalyticsIcon fontSize="small" /> :
             <FormatColorTextIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Open in Tool</ListItemText>
        </MenuItem>
      </Menu>
    </DashboardLayout>
  );
};

export default Dashboard;