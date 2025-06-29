import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Layout components - keep this eager loaded
import DashboardLayout from './layouts/DashboardLayout';

// Auth components - eager load ProtectedRoute as it's small and critical
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load all route components for better performance

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));

// Dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const OrderAnalytics = lazy(() => import('./pages/analytics/OrderAnalytics'));
const InventoryAnalytics = lazy(() => import('./pages/analytics/InventoryAnalytics'));
const ShippingAnalytics = lazy(() => import('./pages/analytics/ShippingAnalytics'));
const UserAnalytics = lazy(() => import('./pages/analytics/UserAnalytics'));

// Settings pages
const Settings = lazy(() => import('./pages/settings/Settings'));
const UserManagement = lazy(() => import('./pages/settings/UserManagement'));
const RoleManagement = lazy(() => import('./pages/settings/RoleManagement'));

// Reports pages
const Reports = lazy(() => import('./pages/reports/Reports'));
const GenerateReport = lazy(() => import('./pages/reports/GenerateReport'));

// Import auth provider and context
import { AuthProvider } from './contexts/AuthContext';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="analytics/orders" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <OrderAnalytics />
                    </Suspense>
                  } />
                  <Route path="analytics/inventory" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <InventoryAnalytics />
                    </Suspense>
                  } />
                  <Route path="analytics/shipping" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <ShippingAnalytics />
                    </Suspense>
                  } />
                  <Route path="analytics/users" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <UserAnalytics />
                    </Suspense>
                  } />
                  
                  {/* Reports */}
                  <Route path="reports" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Reports />
                    </Suspense>
                  } />
                  <Route path="reports/generate" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <GenerateReport />
                    </Suspense>
                  } />
                  
                  {/* Settings */}
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Settings />
                    </Suspense>
                  } />
                  <Route path="settings/users" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <UserManagement />
                    </Suspense>
                  } />
                  <Route path="settings/roles" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <RoleManagement />
                    </Suspense>
                  } />
                </Route>
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
