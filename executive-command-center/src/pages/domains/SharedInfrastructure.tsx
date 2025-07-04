import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  Dns as DnsIcon,
  MonitorHeart as MonitorIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { apiService, InfrastructureMetrics } from '../../services/apiService';
import MetricCard from '../../components/dashboard/MetricCard';
import GlobalMetricsChart from '../../components/charts/GlobalMetricsChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  version: string;
}

interface ResourceUsage {
  id: string;
  name: string;
  type: 'cpu' | 'memory' | 'storage' | 'network';
  current: number;
  limit: number;
  threshold: number;
}

interface SecurityMetric {
  id: string;
  category: string;
  status: 'secure' | 'warning' | 'vulnerable';
  score: number;
  lastAudit: string;
  description: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`infrastructure-tabpanel-${index}`}
    aria-labelledby={`infrastructure-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SharedInfrastructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<InfrastructureMetrics | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth[]>([]);
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchInfrastructureData();
  }, []);

  const fetchInfrastructureData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [metricsData] = await Promise.all([
        apiService.getInfrastructureMetrics(),
      ]);

      setMetrics(metricsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load infrastructure data');
      console.error('Infrastructure data fetch error:', err);
      
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    setMetrics({
      totalServices: 24,
      healthyServices: 22,
      cpuUsage: 67.5,
      memoryUsage: 78.2,
      storageUsage: 45.8,
      networkThroughput: 2.4,
      uptime: 99.97,
      activeConnections: 1543,
    });

    setServiceHealth([
      { id: '1', name: 'API Gateway', status: 'healthy', uptime: 99.99, responseTime: 45, lastChecked: new Date().toISOString(), version: 'v2.1.3' },
      { id: '2', name: 'Load Balancer', status: 'healthy', uptime: 99.95, responseTime: 23, lastChecked: new Date().toISOString(), version: 'v1.8.2' },
      { id: '3', name: 'Database Cluster', status: 'warning', uptime: 99.89, responseTime: 120, lastChecked: new Date().toISOString(), version: 'v5.7.1' },
      { id: '4', name: 'Cache Layer (Redis)', status: 'healthy', uptime: 99.98, responseTime: 8, lastChecked: new Date().toISOString(), version: 'v6.2.5' },
      { id: '5', name: 'Message Queue', status: 'healthy', uptime: 99.92, responseTime: 35, lastChecked: new Date().toISOString(), version: 'v2.8.1' },
      { id: '6', name: 'File Storage', status: 'warning', uptime: 99.85, responseTime: 85, lastChecked: new Date().toISOString(), version: 'v3.1.0' },
    ]);

    setResourceUsage([
      { id: '1', name: 'CPU Cluster', type: 'cpu', current: 67.5, limit: 100, threshold: 80 },
      { id: '2', name: 'Memory Pool', type: 'memory', current: 78.2, limit: 100, threshold: 85 },
      { id: '3', name: 'Storage Array', type: 'storage', current: 45.8, limit: 100, threshold: 90 },
      { id: '4', name: 'Network Bandwidth', type: 'network', current: 2.4, limit: 10, threshold: 8 },
    ]);

    setSecurityMetrics([
      { id: '1', category: 'SSL/TLS', status: 'secure', score: 95, lastAudit: '2024-07-01', description: 'All certificates valid and up to date' },
      { id: '2', category: 'Access Control', status: 'secure', score: 92, lastAudit: '2024-06-28', description: 'Role-based access properly configured' },
      { id: '3', category: 'Network Security', status: 'warning', score: 78, lastAudit: '2024-06-25', description: 'Some firewall rules need optimization' },
      { id: '4', category: 'Data Encryption', status: 'secure', score: 98, lastAudit: '2024-07-02', description: 'End-to-end encryption implemented' },
      { id: '5', category: 'Vulnerability Scan', status: 'warning', score: 82, lastAudit: '2024-06-30', description: 'Minor vulnerabilities detected' },
    ]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchInfrastructureData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
      case 'vulnerable':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
        return <SuccessIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'critical':
      case 'vulnerable':
        return <ErrorIcon fontSize="small" />;
      default:
        return <MonitorIcon fontSize="small" />;
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
            Shared Infrastructure Domain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time infrastructure monitoring and resource management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<TrendingUpIcon />}
            label="Operational"
            color="success"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="System Uptime"
            value={metrics?.uptime || 0}
            format="percentage"
            trend={0.2}
            loading={loading}
            icon={<PerformanceIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Services"
            value={metrics?.healthyServices || 0}
            total={metrics?.totalServices || 0}
            format="fraction"
            trend={2}
            loading={loading}
            icon={<CloudIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CPU Usage"
            value={metrics?.cpuUsage || 0}
            format="percentage"
            trend={-3.5}
            loading={loading}
            icon={<MonitorIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Memory Usage"
            value={metrics?.memoryUsage || 0}
            format="percentage"
            trend={1.8}
            loading={loading}
            icon={<StorageIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="infrastructure tabs">
            <Tab label="Overview" />
            <Tab label="Service Health" />
            <Tab label="Resource Usage" />
            <Tab label="Security Dashboard" />
            <Tab label="Network Monitoring" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Infrastructure Performance Chart */}
            <Grid item xs={12} lg={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Infrastructure Performance Trends
                  </Typography>
                  {loading ? (
                    <Skeleton variant="rectangular" height={300} />
                  ) : (
                    <GlobalMetricsChart />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* System Status */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        System Status
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Overall Health</Typography>
                          <Typography variant="body2" fontWeight={500} color="success.main">
                            Excellent
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={95} 
                          color="success"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Performance Score</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {metrics?.uptime || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={metrics?.uptime || 0} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Stats
                      </Typography>
                      {loading ? (
                        <Box>
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                          ))}
                        </Box>
                      ) : (
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Active Connections</Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {metrics?.activeConnections?.toLocaleString() || 0}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Network Throughput</Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {metrics?.networkThroughput || 0} GB/s
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Storage Usage</Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {metrics?.storageUsage || 0}%
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Service Health Tab */}
        <TabPanel value={activeTab} index={1}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Service Health Dashboard
                </Typography>
                <Button variant="contained" startIcon={<SettingsIcon />}>
                  Manage Services
                </Button>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service Name</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="right">Uptime</TableCell>
                        <TableCell align="right">Response Time</TableCell>
                        <TableCell align="center">Version</TableCell>
                        <TableCell align="center">Last Checked</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {serviceHealth.map((service) => (
                        <TableRow key={service.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                <CloudIcon />
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {service.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getStatusIcon(service.status)}
                              label={service.status}
                              size="small"
                              color={getStatusColor(service.status) as any}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500}>
                              {service.uptime}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {service.responseTime}ms
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={service.version}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary">
                              {new Date(service.lastChecked).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Resource Usage Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {loading ? (
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={400} />
              </Grid>
            ) : (
              resourceUsage.map((resource) => (
                <Grid item xs={12} md={6} key={resource.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {resource.name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Current Usage</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {resource.type === 'network' 
                              ? `${resource.current} / ${resource.limit} GB/s`
                              : `${resource.current}% / ${resource.limit}%`
                            }
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(resource.current / resource.limit) * 100}
                          color={
                            resource.current >= resource.threshold 
                              ? 'error' 
                              : resource.current >= resource.threshold * 0.8 
                                ? 'warning' 
                                : 'success'
                          }
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Threshold: {resource.threshold}{resource.type === 'network' ? ' GB/s' : '%'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        {/* Security Dashboard Tab */}
        <TabPanel value={activeTab} index={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Security Metrics Dashboard
                </Typography>
                <Button variant="contained" startIcon={<SecurityIcon />} color="error">
                  Security Audit
                </Button>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <Grid container spacing={2}>
                  {securityMetrics.map((metric) => (
                    <Grid item xs={12} md={6} lg={4} key={metric.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {metric.category}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(metric.status)}
                              label={metric.status}
                              size="small"
                              color={getStatusColor(metric.status) as any}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Security Score</Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {metric.score}/100
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={metric.score}
                              color={
                                metric.score >= 90 
                                  ? 'success' 
                                  : metric.score >= 70 
                                    ? 'warning' 
                                    : 'error'
                              }
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {metric.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last audit: {metric.lastAudit}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Network Monitoring Tab */}
        <TabPanel value={activeTab} index={4}>
          <Alert severity="info">
            Network Monitoring dashboard coming soon. This will include real-time network traffic analysis,
            bandwidth monitoring, connection tracking, and network security insights.
          </Alert>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default SharedInfrastructure;