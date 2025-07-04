import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { store } from './store';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WebSocketProvider } from './contexts/WebSocketContext';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Page imports
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import DomainOverview from './pages/domains/DomainOverview';
import SocialCommerce from './pages/domains/SocialCommerce';
import Warehousing from './pages/domains/Warehousing';
import CourierServices from './pages/domains/CourierServices';
import HaulageLogistics from './pages/domains/HaulageLogistics';
import SharedInfrastructure from './pages/domains/SharedInfrastructure';
import StakeholderManagement from './pages/stakeholders/StakeholderManagement';
import GlobalPerformance from './pages/analytics/GlobalPerformance';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <AuthProvider>
            <NotificationProvider>
              <WebSocketProvider>
                <Router>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Routes>
                      {/* Authentication Routes */}
                      <Route path="/auth/*" element={
                        <AuthLayout>
                          <Routes>
                            <Route path="login" element={<Login />} />
                            <Route path="*" element={<Navigate to="/auth/login" replace />} />
                          </Routes>
                        </AuthLayout>
                      } />

                      {/* Protected Application Routes */}
                      <Route path="/*" element={
                        <ProtectedRoute>
                          <MainLayout>
                            <Routes>
                              {/* Dashboard */}
                              <Route path="/" element={<Navigate to="/dashboard" replace />} />
                              <Route path="/dashboard" element={<Dashboard />} />

                              {/* Domain Management */}
                              <Route path="/domains" element={<DomainOverview />} />
                              <Route path="/domains/social-commerce" element={<SocialCommerce />} />
                              <Route path="/domains/warehousing" element={<Warehousing />} />
                              <Route path="/domains/courier-services" element={<CourierServices />} />
                              <Route path="/domains/haulage-logistics" element={<HaulageLogistics />} />
                              <Route path="/domains/shared-infrastructure" element={<SharedInfrastructure />} />

                              {/* Stakeholder Management */}
                              <Route path="/stakeholders" element={<StakeholderManagement />} />

                              {/* Analytics */}
                              <Route path="/analytics" element={<GlobalPerformance />} />

                              {/* Settings */}
                              <Route path="/settings" element={<Settings />} />

                              {/* Catch all */}
                              <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                          </MainLayout>
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Box>
                </Router>
              </WebSocketProvider>
            </NotificationProvider>
          </AuthProvider>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;