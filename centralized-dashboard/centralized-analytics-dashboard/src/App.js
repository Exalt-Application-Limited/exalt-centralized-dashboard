import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';

import { RealTimeProvider, DEFAULT_WEBSOCKET_CONFIG } from './services/RealTimeContext.tsx';
import AppLayout from './layouts/AppLayout.tsx';
import Dashboard from './pages/dashboard/Dashboard';
import RealTimeDashboard from './pages/dashboard/RealTimeDashboard';
import InventoryAnalytics from './pages/analytics/InventoryAnalytics';
import OrderAnalytics from './pages/analytics/OrderAnalytics';
import ShippingAnalytics from './pages/analytics/ShippingAnalytics';
import UserAnalytics from './pages/analytics/UserAnalytics';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <RealTimeProvider config={DEFAULT_WEBSOCKET_CONFIG}>
          <Router>
            <AppLayout>
              <Routes>
                {/* Dashboard Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/realtime" element={<RealTimeDashboard />} />
                
                {/* Analytics Routes */}
                <Route path="/analytics/inventory" element={<InventoryAnalytics />} />
                <Route path="/analytics/orders" element={<OrderAnalytics />} />
                <Route path="/analytics/shipping" element={<ShippingAnalytics />} />
                <Route path="/analytics/users" element={<UserAnalytics />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </Router>
        </RealTimeProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;