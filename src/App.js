import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Login from './components/auth/Login';
import Analyzer from './pages/Analyzer';
import { AssessmentProvider } from './context/AssessmentContext';

// Erweitertes Theme mit Custom-Farben und Styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed', // Modern Purple
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '1px 0 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const auth = localStorage.getItem('isAuthenticated');
      if (auth === 'true') {
          setIsAuthenticated(true);
      }
  }, []);

  if (!isAuthenticated) {
      return (
          <ThemeProvider theme={theme}>
              <Login onLogin={() => setIsAuthenticated(true)} />
          </ThemeProvider>
      );
  }

  return (
      <ThemeProvider theme={theme}>
          <AssessmentProvider>
              <Router>
                  <Layout>
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/assessment" element={<Assessment />} />
                          <Route path="/results" element={<Results />} />
                          <Route path="/analyzer" element={<Analyzer />} /> {/* Neue Route */}
                      </Routes>
                  </Layout>
              </Router>
          </AssessmentProvider>
      </ThemeProvider>
  );
}

export default App;