import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Alert,
  IconButton,
  useTheme,
  Fade,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRealTime } from '../../services/RealTimeContext';
import { InteractiveDashboardChart, AdvancedMetricsWidget } from '../../components/charts';
import SalesMetricsChart from '../../components/SalesMetricsChart';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isConnected, messageCount } = useRealTime();
  
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Sample dashboard data
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'Last 30 days',
    },
    {
      title: 'Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up' as const,
      description: 'Last 30 days',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.3%',
      trend: 'down' as const,
      description: 'Last 30 days',
    },
    {
      title: 'Avg Order Value',
      value: '$36.28',
      change: '+2.1%',
      trend: 'up' as const,
      description: 'Last 30 days',
    },
  ];

  // Sample chart data
  const salesData = [
    { date: '2024-01-01', revenue: 4200, orders: 120, customers: 95 },
    { date: '2024-01-02', revenue: 3800, orders: 108, customers: 87 },
    { date: '2024-01-03', revenue: 5100, orders: 142, customers: 118 },
    { date: '2024-01-04', revenue: 4600, orders: 134, customers: 105 },
    { date: '2024-01-05', revenue: 5400, orders: 156, customers: 128 },
    { date: '2024-01-06', revenue: 4900, orders: 145, customers: 112 },
    { date: '2024-01-07', revenue: 5800, orders: 168, customers: 142 },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  // Interactive chart configuration
  const chartConfig = {
    type: 'line' as const,
    title: 'Sales Performance Overview',
    xAxisKey: 'date',
    yAxisKeys: ['revenue', 'orders'],
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    enableBrush: true,
    enableZoom: true,
    enableDrillDown: true,
    enableAnimations: true,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 350,
  };

  // Metrics widget configuration
  const metricsConfig = {
    title: 'Performance Metrics',
    metrics: [
      {
        key: 'revenue',
        label: 'Revenue',
        unit: 'USD',
        format: 'currency' as const,
        color: theme.palette.primary.main,
        target: 5000,
        showTrend: true,
        showSparkline: true,
      },
      {
        key: 'orders',
        label: 'Orders',
        format: 'number' as const,
        color: theme.palette.secondary.main,
        target: 150,
        showTrend: true,
      },
    ],
    comparisonPeriods: [
      { label: 'Previous Week', value: 'week', days: 7 },
      { label: 'Previous Month', value: 'month', days: 30 },
    ],
    chartTypes: ['line', 'area', 'bar'] as const,
    showComparison: true,
    showTargets: true,
    showBenchmarks: false,
    allowPeriodChange: true,
  };

  const quickActions = [
    {
      title: 'Real-Time Dashboard',
      description: 'View live data updates and monitoring',
      icon: <TimelineIcon />,
      action: () => navigate('/dashboard/realtime'),
      color: 'primary',
    },
    {
      title: 'Inventory Analytics',
      description: 'Deep dive into stock and warehouse data',
      icon: <AssessmentIcon />,
      action: () => navigate('/analytics/inventory'),
      color: 'secondary',
    },
    {
      title: 'Order Analytics',
      description: 'Analyze sales trends and patterns',
      icon: <TrendingUpIcon />,
      action: () => navigate('/analytics/orders'),
      color: 'success',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to your centralized analytics dashboard
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`Last updated: ${lastRefresh.toLocaleTimeString()}`}
            variant="outlined"
          />
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Real-time Status Alert */}
      {isConnected && (
        <Fade in={true}>
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/dashboard/realtime')}
                endIcon={<LaunchIcon />}
              >
                View Live Dashboard
              </Button>
            }
          >
            Real-time data connection is active • {messageCount} messages received
          </Alert>
        </Fade>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {kpi.trend === 'up' ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 0.5,
                        color: kpi.trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {kpi.change}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {kpi.value}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  {kpi.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Interactive Chart */}
        <Grid item xs={12} lg={8}>
          <InteractiveDashboardChart
            data={salesData}
            config={chartConfig}
            onDataPointClick={(dataPoint, index) => {
              console.log('Data point clicked:', dataPoint, index);
            }}
            onRefresh={handleRefresh}
            loading={isLoading}
          />
        </Grid>

        {/* Legacy Sales Chart */}
        <Grid item xs={12} lg={4}>
          <SalesMetricsChart
            title="Sales Trends"
            endpoint="sales/daily"
            height={350}
          />
        </Grid>
      </Grid>

      {/* Advanced Metrics Widget */}
      <Box sx={{ mb: 3 }}>
        <AdvancedMetricsWidget
          config={metricsConfig}
          data={salesData}
          height={300}
        />
      </Box>

      {/* Quick Actions */}
      <Card elevation={2}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon color="primary" />
              <Typography variant="h6">Quick Actions</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, elevation 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      elevation: 4,
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: `${action.color}.light`,
                          color: `${action.color}.contrastText`,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <LaunchIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardHeader
          title="System Status"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  ✓ All Systems Operational
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Backend services running normally
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color={isConnected ? 'success.main' : 'error.main'}>
                  {isConnected ? '✓' : '⚠'} Real-time Connection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isConnected ? 'Live data streaming active' : 'Connection unavailable'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  ✓ Data Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All analytics modules loaded
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
