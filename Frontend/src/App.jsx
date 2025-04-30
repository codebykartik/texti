import { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import TextToolsPage from './pages/tools/TextTransformer';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Seetings';
import ExtensionPage from './pages/tools/ExtensionPage';
import NotFound from './pages/error/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [initialLoad, setInitialLoad] = useState(true);

  // Simulate initial application load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoad) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }}>
          <Box
            component="img"
            src="/logo.png" // Add a logo image to your public folder
            alt="TextCraft AI Logo"
            sx={{ width: 120, height: 120, mb: 3 }}
          />
          <CircularProgress color="white" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/transform" element={
              <ProtectedRoute>
                <TextToolsPage />
              </ProtectedRoute>
            } />

            <Route path="/email-polisher" element={
              <ProtectedRoute>
                <TextToolsPage />
              </ProtectedRoute>
            } />

            <Route path="/text-insights" element={
              <ProtectedRoute>
                <TextToolsPage />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            <Route path="/extension" element={
              <ProtectedRoute>
                <ExtensionPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;