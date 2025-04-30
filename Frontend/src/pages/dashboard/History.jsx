import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Chip, TablePagination, TextField,
  InputAdornment, MenuItem, FormControl, InputLabel, Select, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, Skeleton, Tooltip, LinearProgress, Collapse,
  Card, CardContent, Grid, Menu, ListItemIcon, ListItemText
} from '@mui/material';
import DashboardLayout from '../../components/common/DashboardLayout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RestoreIcon from '@mui/icons-material/Restore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Define transformation type colors
const TYPE_COLORS = {
  formal: 'primary',
  casual: 'secondary',
  joke: 'success',
  shakespearean: 'info',
  emoji: 'warning',
  grammar: 'default',
  concise: 'error',
  'email_professional': 'primary',
  'email_followup': 'secondary',
  'email_networking': 'info',
  'email_application': 'success',
  'email_outreach': 'warning',
  'insight_sentiment': 'primary',
  'insight_readability': 'secondary',
  'insight_keywords': 'info',
  'insight_language': 'success',
  'insight_suggestion': 'warning'
};

// Type options for filter dropdown
const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { label: 'Text Transformations', group: true },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'joke', label: 'Humor' },
  { value: 'shakespearean', label: 'Shakespearean' },
  { value: 'emoji', label: 'Emoji-Rich' },
  { value: 'grammar', label: 'Grammar Fix' },
  { value: 'concise', label: 'Concise' },
  { label: 'Email Types', group: true },
  { value: 'email_professional', label: 'Professional Email' },
  { value: 'email_followup', label: 'Follow-up Email' },
  { value: 'email_networking', label: 'Networking Email' },
  { value: 'email_application', label: 'Job Application' },
  { value: 'email_outreach', label: 'Outreach Email' },
  { label: 'Text Insights', group: true },
  { value: 'insight_sentiment', label: 'Sentiment Analysis' },
  { value: 'insight_readability', label: 'Readability Check' },
  { value: 'insight_keywords', label: 'Keyword Analysis' },
  { value: 'insight_language', label: 'Language Analysis' },
  { value: 'insight_suggestion', label: 'Improvement Suggestions' }
];

// Category filter options
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'transform', label: 'Text Transformations' },
  { value: 'email', label: 'Email Polisher' },
  { value: 'insight', label: 'Text Insights' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'a-z', label: 'A to Z (Original Text)' },
  { value: 'z-a', label: 'Z to A (Original Text)' },
  { value: 'type', label: 'By Type' }
];

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSaved, setFilterSaved] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  
  const navigate = useNavigate();

  // Fetch history data with debounced search
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters for API request
      let queryParams = `?page=${page + 1}&limit=${rowsPerPage}`;
      
      // Add filter parameters
      if (filterType !== 'all') {
        queryParams += `&type=${filterType}`;
      }
      
      if (filterCategory !== 'all') {
        queryParams += `&category=${filterCategory}`;
      }
      
      if (filterSaved) {
        queryParams += '&saved=true';
      }
      
      if (searchTerm) {
        queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      // Call the API
      const response = await api.get(`/transform/history${queryParams}`);
      
      if (response.data && response.data.success) {
        setHistory(response.data.data);
        setTotalCount(response.data.total);
        
        // Reset to page 0 if no results and we're on a different page
        if (response.data.data.length === 0 && page > 0) {
          setPage(0);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load transformation history',
          severity: 'error'
        });
        
        // Fallback to empty state
        setHistory([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setSnackbar({
        open: true,
        message: 'Server error when loading history',
        severity: 'error'
      });
      setHistory([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, filterType, filterCategory, filterSaved]);

  // Effect to fetch data when any filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300); // Debounce API calls
    
    return () => clearTimeout(timer);
  }, [fetchHistory]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard',
      severity: 'success'
    });
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/transform/${deleteDialog.id}`);
      
      // Update UI without refetching
      setHistory(prevHistory => prevHistory.filter(item => item._id !== deleteDialog.id));
      setTotalCount(prevTotal => prevTotal - 1);
      
      setSnackbar({
        open: true,
        message: 'Item deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete item',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleSaveToggle = async (item) => {
    try {
      await api.put(`/transform/${item._id}/save`, {
        saved: !item.saved
      });
      
      // Update UI without refetching
      setHistory(prevHistory => 
        prevHistory.map(historyItem => 
          historyItem._id === item._id 
            ? { ...historyItem, saved: !historyItem.saved } 
            : historyItem
        )
      );
      
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
  };

  const handleOpenActionMenu = (event, item) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleViewDetails = (item) => {
    setDetailItem(item);
    setDetailDialogOpen(true);
    handleCloseActionMenu();
  };

  const handleOpenInTool = (item) => {
    handleCloseActionMenu();
    
    // Determine which tool to navigate to based on the transformation type
    let path = '/transform';
    
    if (item.transformationType.startsWith('email_')) {
      path = '/email-polisher';
    } else if (item.transformationType.startsWith('insight_')) {
      path = '/text-insights';
    }
    
    // Navigate to the appropriate tool with the item data
    navigate(path, { 
      state: { 
        transformation: {
          id: item._id,
          type: item.transformationType,
          originalText: item.originalText,
          transformedText: item.transformedText,
          audience: item.audience,
        } 
      }
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getChipColor = (type) => {
    return TYPE_COLORS[type] || 'default';
  };

  const formatTypeLabel = (type) => {
    if (type.startsWith('email_')) {
      return type.replace('email_', '').replace(/\b\w/g, l => l.toUpperCase());
    } else if (type.startsWith('insight_')) {
      return type.replace('insight_', '').replace(/\b\w/g, l => l.toUpperCase());
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getCategoryLabel = (type) => {
    if (type.startsWith('email_')) {
      return 'Email';
    } else if (type.startsWith('insight_')) {
      return 'Insight';
    } else {
      return 'Transform';
    }
  };

  // Apply client-side sorting (server would ideally handle this)
  const sortHistory = (history) => {
    const sortedHistory = [...history];
    
    switch (sortOrder) {
      case 'oldest':
        sortedHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        sortedHistory.sort((a, b) => a.originalText.localeCompare(b.originalText));
        break;
      case 'z-a':
        sortedHistory.sort((a, b) => b.originalText.localeCompare(a.originalText));
        break;
      case 'type':
        sortedHistory.sort((a, b) => a.transformationType.localeCompare(b.transformationType));
        break;
      default: // newest
        sortedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return sortedHistory;
  };

  // Export transformations as CSV
  const exportCSV = () => {
    // Create CSV header
    let csv = 'Original Text,Transformed Text,Type,Date\n';
    
    // Add rows
    history.forEach(item => {
      // Escape commas and quotes
      const originalText = `"${item.originalText.replace(/"/g, '""')}"`;
      const transformedText = `"${item.transformedText.replace(/"/g, '""')}"`;
      const type = formatTypeLabel(item.transformationType);
      const date = formatDate(item.createdAt);
      
      csv += `${originalText},${transformedText},${type},${date}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transformations-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get formatted type for display
  const getSortedHistory = sortHistory(history);

  return (
    <DashboardLayout title="Transformation History">
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3 }} elevation={1}>
        {/* Search and filter controls */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          mb: 3,
          alignItems: 'flex-start' 
        }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            placeholder="Search by text content..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reset to first page on search
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', md: 'auto' }
          }}>
            <FormControl variant="outlined" size="medium" sx={{ minWidth: 140 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort By"
              >
                {SORT_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setExpandedFilters(!expandedFilters)}
              sx={{ minWidth: 120 }}
            >
              {expandedFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>
        </Box>
        
        {/* Expanded filters */}
        <Collapse in={expandedFilters}>
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(0); // Reset to first page on filter change
                }}
                label="Filter by Type"
              >
                {TYPE_OPTIONS.map((option) => 
                  option.group ? (
                    <Typography 
                      key={option.label} 
                      variant="caption" 
                      sx={{ 
                        pl: 2, 
                        pt: 1, 
                        pb: 0.5, 
                        display: 'block',
                        color: 'text.secondary',
                        fontWeight: 'bold' 
                      }}
                    >
                      {option.label}
                    </Typography>
                  ) : (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPage(0); // Reset to first page on filter change
                }}
                label="Category"
              >
                {CATEGORY_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant={filterSaved ? "contained" : "outlined"}
              startIcon={filterSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => {
                setFilterSaved(!filterSaved);
                setPage(0); // Reset to first page
              }}
              color={filterSaved ? "primary" : "inherit"}
              sx={{ minWidth: 150 }}
            >
              {filterSaved ? "Favorites Only" : "Show All"}
            </Button>
            
            <Button 
              variant="text" 
              onClick={() => {
                setFilterType('all');
                setFilterCategory('all');
                setFilterSaved(false);
                setSearchTerm('');
                setSortOrder('newest');
                setPage(0);
              }}
              sx={{ ml: { sm: 'auto' } }}
            >
              Reset Filters
            </Button>
          </Box>
        </Collapse>
        
        {/* Loading progress */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell width="28%">Original Text</TableCell>
                <TableCell width="28%">Transformed Text</TableCell>
                <TableCell width="15%">Type</TableCell>
                <TableCell width="15%">Date</TableCell>
                <TableCell width="14%" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={90} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              ) : getSortedHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      No transformation history found.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterSaved ? 
                        "Try adjusting your search or filters." : 
                        "Transform some text to see your history here."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getSortedHistory.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell 
                      sx={{ 
                        maxWidth: 250, 
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        }
                      }}
                      onClick={() => handleViewDetails(item)}
                    >
                      <Tooltip title="Click to view details">
                        <Typography noWrap component="span" title={item.originalText}>
                          {item.originalText}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography noWrap title={item.transformedText}>
                        {item.transformedText}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip 
                          label={formatTypeLabel(item.transformationType)} 
                          color={getChipColor(item.transformationType)} 
                          size="small"
                          sx={{ maxWidth: 150 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getCategoryLabel(item.transformationType)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{formatDate(item.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={item.saved ? "Remove from favorites" : "Save to favorites"}>
                        <IconButton
                          size="small"
                          color={item.saved ? "primary" : "default"}
                          onClick={() => handleSaveToggle(item)}
                        >
                          {item.saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy transformed text">
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopy(item.transformedText)}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenActionMenu(e, item)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
        {/* Action menu for table rows */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleCloseActionMenu}
        >
          <MenuItem onClick={() => selectedItem && handleViewDetails(selectedItem)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => selectedItem && handleOpenInTool(selectedItem)}>
            <ListItemIcon>
              <RestoreIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reopen in Tool</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedItem) {
              handleDeleteConfirmation(selectedItem._id);
              handleCloseActionMenu();
            }
          }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
        
        {/* Export button at the bottom */}
        {history.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={exportCSV}
            >
              Export to CSV
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Details dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {detailItem && (
          <>
            <DialogTitle>
              Transformation Details
              <IconButton
                aria-label="close"
                onClick={() => setDetailDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <DeleteIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Original Text
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'background.default', 
                        p: 2, 
                        borderRadius: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        <Typography>{detailItem.originalText}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Transformed Text
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'background.default', 
                        p: 2, 
                        borderRadius: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        <Typography>{detailItem.transformedText}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Card variant="outlined" sx={{ flex: '1 1 160px', minWidth: 160 }}>
                      <CardContent>
                        <Typography variant="overline" display="block">Type</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={formatTypeLabel(detailItem.transformationType)} 
                            color={getChipColor(detailItem.transformationType)} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined" sx={{ flex: '1 1 160px', minWidth: 160 }}>
                      <CardContent>
                        <Typography variant="overline" display="block">Category</Typography>
                        <Typography variant="body1">
                          {getCategoryLabel(detailItem.transformationType)}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined" sx={{ flex: '1 1 220px', minWidth: 220 }}>
                      <CardContent>
                        <Typography variant="overline" display="block">Date Created</Typography>
                        <Typography variant="body1">
                          {formatDate(detailItem.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined" sx={{ flex: '1 1 160px', minWidth: 160 }}>
                      <CardContent>
                        <Typography variant="overline" display="block">Audience</Typography>
                        <Typography variant="body1">
                          {detailItem.audience.charAt(0).toUpperCase() + detailItem.audience.slice(1)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopy(detailItem.transformedText)}
              >
                Copy Result
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  setDetailDialogOpen(false);
                  handleOpenInTool(detailItem);
                }}
              >
                Open in Tool
              </Button>
              <Button 
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Transformation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this transformation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default History;