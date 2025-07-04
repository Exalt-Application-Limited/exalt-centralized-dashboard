import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Skeleton,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

import { apiService, DashboardMetrics, DomainHealth } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import DomainOverviewCard from '../../components/dashboard/DomainOverviewCard';
import MetricCard from '../../components/dashboard/MetricCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity';
import SystemHealthWidget from '../../components/dashboard/SystemHealthWidget';
import GlobalMetricsChart from '../../components/charts/GlobalMetricsChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [domainHealth, setDomainHealth] = useState<DomainHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [metricsData, healthData] = await Promise.all([
        apiService.getDashboardMetrics(),
        apiService.getDomainHealth(),
      ]);

      setMetrics(metricsData);
      setDomainHealth(healthData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const getOverallSystemStatus = (): 'healthy' | 'warning' | 'critical' => {
    if (!domainHealth.length) return 'healthy';
    
    const hasCritical = domainHealth.some(d => d.status === 'critical');
    const hasWarning = domainHealth.some(d => d.status === 'warning');
    
    if (hasCritical) return 'critical';
    if (hasWarning) return 'warning';
    return 'healthy';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'critical':
        return <ErrorIcon color="error" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Executive Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.firstName}. Here's your enterprise overview.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* System Status Alert */}
      {!loading && domainHealth.length > 0 && (
        <Alert 
          severity={getOverallSystemStatus() === 'healthy' ? 'success' : 
                   getOverallSystemStatus() === 'warning' ? 'warning' : 'error'}
          icon={getStatusIcon(getOverallSystemStatus())}
          sx={{ mb: 3 }}
        >
          System Status: {getOverallSystemStatus().toUpperCase()} - 
          {domainHealth.filter(d => d.status === 'healthy').length} of {domainHealth.length} domains operational
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Primary KPIs */}
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Revenue"
                value={metrics?.totalRevenue || 0}
                format="currency"
                trend={12.5}
                loading={loading}
                icon={<TrendingUpIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Orders"
                value={metrics?.totalOrders || 0}
                format="number"
                trend={8.2}
                loading={loading}
                icon={<TrendingUpIcon />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Users"
                value={metrics?.activeUsers || 0}
                format="number"
                trend={-2.1}
                loading={loading}
                icon={<TrendingDownIcon />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="System Health"
                value={metrics?.systemHealth || 0}
                format="percentage"
                trend={0.5}
                loading={loading}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>

            {/* Global Performance Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Global Performance Trends
                  </Typography>
                  {loading ? (
                    <Skeleton variant="rectangular" height={300} />
                  ) : (
                    <GlobalMetricsChart />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* System Health & Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* System Health Widget */}
            <Grid item xs={12}>
              <SystemHealthWidget loading={loading} />
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <QuickActions />
            </Grid>
          </Grid>
        </Grid>

        {/* Domain Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Business Domain Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time health monitoring across all domains
                </Typography>
              </Box>

              {loading ? (
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                      <Skeleton variant="rectangular" height={120} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {/* Social Commerce */}
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <DomainOverviewCard
                      title="Social Commerce"
                      status={metrics?.domains.socialCommerce.status || 'healthy'}
                      uptime={metrics?.domains.socialCommerce.uptime || 0}
                      performance={metrics?.domains.socialCommerce.performance || 0}
                      users={metrics?.domains.socialCommerce.users || 0}
                      revenue={metrics?.domains.socialCommerce.revenue}
                      color="socialCommerce"
                      href="/domains/social-commerce"
                    />
                  </Grid>

                  {/* Warehousing */}
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <DomainOverviewCard
                      title="Warehousing"
                      status={metrics?.domains.warehousing.status || 'healthy'}
                      uptime={metrics?.domains.warehousing.uptime || 0}
                      performance={metrics?.domains.warehousing.performance || 0}
                      users={metrics?.domains.warehousing.users || 0}
                      color="warehousing"
                      href="/domains/warehousing"
                    />
                  </Grid>

                  {/* Courier Services */}
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <DomainOverviewCard
                      title="Courier Services"
                      status={metrics?.domains.courier.status || 'healthy'}
                      uptime={metrics?.domains.courier.uptime || 0}
                      performance={metrics?.domains.courier.performance || 0}
                      users={metrics?.domains.courier.users || 0}
                      color="courier"
                      href="/domains/courier-services"
                    />
                  </Grid>

                  {/* Haulage Logistics */}
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <DomainOverviewCard
                      title="Haulage Logistics"
                      status={metrics?.domains.haulage.status || 'healthy'}
                      uptime={metrics?.domains.haulage.uptime || 0}
                      performance={metrics?.domains.haulage.performance || 0}
                      users={metrics?.domains.haulage.users || 0}
                      color="haulage"
                      href="/domains/haulage-logistics"
                    />
                  </Grid>

                  {/* Shared Infrastructure */}
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <DomainOverviewCard
                      title="Infrastructure"
                      status={metrics?.domains.infrastructure.status || 'healthy'}
                      uptime={metrics?.domains.infrastructure.uptime || 0}
                      performance={metrics?.domains.infrastructure.performance || 0}
                      users={metrics?.domains.infrastructure.users || 0}
                      color="infrastructure"
                      href="/domains/shared-infrastructure"
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={8}>
          <RecentActivity loading={loading} />
        </Grid>

        {/* Domain Health Details */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Health Details
              </Typography>
              {loading ? (
                <Box>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} height={40} sx={{ mb: 1 }} />
                  ))}
                </Box>
              ) : (
                <Box>
                  {domainHealth.map((domain) => (
                    <Box key={domain.domain} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {domain.domain}
                        </Typography>
                        <Chip
                          size="small"
                          label={domain.status}
                          color={getStatusColor(domain.status) as any}
                          icon={getStatusIcon(domain.status)}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={domain.services.filter(s => s.status === 'up').length / domain.services.length * 100}
                        color={getStatusColor(domain.status) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {domain.services.filter(s => s.status === 'up').length} of {domain.services.length} services operational
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;