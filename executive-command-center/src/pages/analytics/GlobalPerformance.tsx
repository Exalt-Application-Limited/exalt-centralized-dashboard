import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const GlobalPerformance: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const performanceMetrics = {
    totalRevenue: 3915000,
    revenueGrowth: 18.5,
    totalUsers: 72580,
    userGrowth: 12.3,
    totalOrders: 25430,
    orderGrowth: 8.7,
    systemUptime: 99.92,
    avgResponseTime: 145, // ms
  };

  const domainPerformance = [
    {
      domain: 'Social Commerce',
      revenue: 2340000,
      growth: 12.5,
      users: 45230,
      uptime: 99.8,
      performance: 95.2,
      trend: 'up',
    },
    {
      domain: 'Warehousing',
      revenue: 890000,
      growth: 18.2,
      users: 8450,
      uptime: 99.9,
      performance: 97.1,
      trend: 'up',
    },
    {
      domain: 'Courier Services',
      revenue: 560000,
      growth: -2.1,
      users: 15670,
      uptime: 98.5,
      performance: 89.3,
      trend: 'down',
    },
    {
      domain: 'Haulage Logistics',
      revenue: 125000,
      growth: 45.3,
      users: 3240,
      uptime: 99.2,
      performance: 91.8,
      trend: 'up',
    },
  ];

  const regionalMetrics = [
    {
      region: 'Middle East & Africa',
      revenue: 1850000,
      growth: 22.3,
      users: 32400,
      marketShare: 47.3,
    },
    {
      region: 'Europe',
      revenue: 1245000,
      growth: 15.7,
      users: 28450,
      marketShare: 31.8,
    },
    {
      region: 'Asia Pacific',
      revenue: 820000,
      growth: 18.9,
      users: 11730,
      marketShare: 20.9,
    },
  ];

  const kpis = [
    {
      name: 'Customer Acquisition Cost',
      value: '$42.50',
      change: -8.3,
      target: '$40.00',
    },
    {
      name: 'Customer Lifetime Value',
      value: '$1,247',
      change: 15.2,
      target: '$1,200',
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: 12.8,
      target: '3.0%',
    },
    {
      name: 'Average Order Value',
      value: '$156.80',
      change: 5.4,
      target: '$150.00',
    },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUpIcon color="success" sx={{ fontSize: 16 }} />
    ) : (
      <TrendingDownIcon color="error" sx={{ fontSize: 16 }} />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'success.main' : 'error.main';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            📊 Global Performance Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive business intelligence and performance insights across all domains
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* High-Level KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                ${(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color={getTrendColor(performanceMetrics.revenueGrowth)}>
                  +{performanceMetrics.revenueGrowth}%
                </Typography>
                <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssessmentIcon color="secondary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4">
                {(performanceMetrics.totalUsers / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color={getTrendColor(performanceMetrics.userGrowth)}>
                  +{performanceMetrics.userGrowth}%
                </Typography>
                <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimelineIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h4">
                {(performanceMetrics.totalOrders / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color={getTrendColor(performanceMetrics.orderGrowth)}>
                  +{performanceMetrics.orderGrowth}%
                </Typography>
                <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PieChartIcon color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  System Uptime
                </Typography>
              </Box>
              <Typography variant="h4">
                {performanceMetrics.systemUptime}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={performanceMetrics.systemUptime}
                color="success"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Domain Performance" />
            <Tab label="Regional Analytics" />
            <Tab label="Key Metrics" />
            <Tab label="Advanced Analytics" />
          </Tabs>
        </Box>

        {/* Domain Performance Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Business Domain Performance
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Domain</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Growth</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Uptime</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domainPerformance.map((domain) => (
                  <TableRow key={domain.domain}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {domain.domain}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${(domain.revenue / 1000000).toFixed(1)}M
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          color={getTrendColor(domain.growth)}
                        >
                          {domain.growth >= 0 ? '+' : ''}{domain.growth}%
                        </Typography>
                        {getTrendIcon(domain.trend)}
                      </Box>
                    </TableCell>
                    <TableCell>{domain.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {domain.uptime}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={domain.uptime}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {domain.performance}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={domain.performance}
                          color="info"
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={domain.trend}
                        size="small"
                        color={domain.trend === 'up' ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Regional Analytics Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Regional Performance Breakdown
          </Typography>
          <Grid container spacing={3}>
            {regionalMetrics.map((region) => (
              <Grid item xs={12} md={4} key={region.region}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {region.region}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h5">
                          ${(region.revenue / 1000000).toFixed(1)}M
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Growth
                        </Typography>
                        <Typography variant="h5" color="success.main">
                          +{region.growth}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Users
                        </Typography>
                        <Typography variant="h6">
                          {(region.users / 1000).toFixed(0)}K
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Market Share
                        </Typography>
                        <Typography variant="h6">
                          {region.marketShare}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={region.marketShare}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Key Metrics Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Key Performance Indicators
          </Typography>
          <Grid container spacing={3}>
            {kpis.map((kpi) => (
              <Grid item xs={12} sm={6} md={3} key={kpi.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {kpi.name}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {kpi.value}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          color={getTrendColor(kpi.change)}
                        >
                          {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                        </Typography>
                        {kpi.change >= 0 ? (
                          <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
                        ) : (
                          <TrendingDownIcon color="error" sx={{ ml: 0.5, fontSize: 16 }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Target: {kpi.target}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Advanced Analytics Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Advanced Business Intelligence
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Forecasting
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BarChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        Advanced revenue forecasting models and predictive analytics
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Behavior Analysis
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PieChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        Customer segmentation and behavior pattern analysis
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Real-time Business Intelligence Dashboard
                  </Typography>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Comprehensive BI Dashboard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Real-time data visualization, trend analysis, and interactive business intelligence tools
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default GlobalPerformance;