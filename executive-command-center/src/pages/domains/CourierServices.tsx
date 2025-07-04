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
  LinearProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  DirectionsCar as CarIcon,
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
      id={`courier-tabpanel-${index}`}
      aria-labelledby={`courier-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CourierServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const courierMetrics = {
    totalDeliveries: 45670,
    activeDeliveries: 1240,
    avgDeliveryTime: 2.4, // hours
    onTimeRate: 89.3,
    monthlyRevenue: 560000,
    growth: -2.1,
    activeCouriers: 156,
    totalCouriers: 180,
  };

  const regionalData = [
    {
      region: 'Dubai Metro',
      deliveries: 12450,
      onTime: 92.1,
      avgTime: 1.8,
      couriers: 45,
      status: 'excellent',
    },
    {
      region: 'Cape Town Central',
      deliveries: 8230,
      onTime: 88.5,
      avgTime: 2.2,
      couriers: 32,
      status: 'good',
    },
    {
      region: 'Frankfurt City',
      deliveries: 15670,
      onTime: 91.2,
      avgTime: 2.1,
      couriers: 52,
      status: 'excellent',
    },
    {
      region: 'Singapore CBD',
      deliveries: 9320,
      onTime: 85.3,
      avgTime: 2.8,
      couriers: 27,
      status: 'warning',
    },
  ];

  const customerServices = [
    {
      service: 'Individual Customer Onboarding',
      status: 'planning',
      implementation: 0,
      priority: 'high',
    },
    {
      service: 'Corporate Customer Onboarding', 
      status: 'planning',
      implementation: 0,
      priority: 'high',
    },
    {
      service: 'Customer Web Portal',
      status: 'development',
      implementation: 75,
      priority: 'high',
    },
    {
      service: 'Enhanced Mobile App',
      status: 'planning',
      implementation: 0,
      priority: 'medium',
    },
    {
      service: 'Customer Support Communication',
      status: 'planning',
      implementation: 0,
      priority: 'high',
    },
    {
      service: 'Customer Billing Service',
      status: 'planning',
      implementation: 0,
      priority: 'medium',
    },
  ];

  const recentDeliveries = [
    {
      id: 'DEL-15420',
      from: 'Dubai Mall',
      to: 'Jumeirah Beach',
      courier: 'Ahmed K.',
      status: 'delivered',
      time: '1.2 hrs',
    },
    {
      id: 'DEL-15419',
      from: 'Frankfurt Airport',
      to: 'City Center',
      courier: 'Hans M.',
      status: 'in-transit',
      time: '0.8 hrs',
    },
    {
      id: 'DEL-15418',
      from: 'V&A Waterfront',
      to: 'Stellenbosch',
      courier: 'Sarah T.',
      status: 'delayed',
      time: '3.2 hrs',
    },
    {
      id: 'DEL-15417',
      from: 'Orchard Road',
      to: 'Marina Bay',
      courier: 'Wei L.',
      status: 'delivered',
      time: '0.9 hrs',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'excellent':
      case 'development':
        return 'success';
      case 'in-transit':
      case 'good':
      case 'planning':
        return 'info';
      case 'delayed':
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            🚚 Courier Services Domain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last-mile delivery and logistics services with real-time tracking
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* System Status Alert */}
      <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
        System Status: DEGRADED - Customer onboarding services missing. Performance impact on direct customer acquisition.
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Deliveries
                </Typography>
              </Box>
              <Typography variant="h4">
                {courierMetrics.activeDeliveries.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {courierMetrics.totalDeliveries.toLocaleString()} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SpeedIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Avg Delivery Time
                </Typography>
              </Box>
              <Typography variant="h4">
                {courierMetrics.avgDeliveryTime}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: <2.0h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  On-Time Rate
                </Typography>
              </Box>
              <Typography variant="h4">
                {courierMetrics.onTimeRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={courierMetrics.onTimeRate}
                color="success"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                ${(courierMetrics.monthlyRevenue / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="error.main">
                  {courierMetrics.growth}%
                </Typography>
                <TrendingDownIcon color="error" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Regional Performance" />
            <Tab label="Customer Services" />
            <Tab label="Live Operations" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Regional Performance Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Regional Delivery Performance
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Region</TableCell>
                  <TableCell>Daily Deliveries</TableCell>
                  <TableCell>On-Time Rate</TableCell>
                  <TableCell>Avg Time</TableCell>
                  <TableCell>Active Couriers</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {regionalData.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={500}>
                          {region.region}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{region.deliveries.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {region.onTime}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={region.onTime}
                          color={getStatusColor(region.status) as any}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{region.avgTime}h</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {region.couriers}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={region.status}
                        size="small"
                        color={getStatusColor(region.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <LaunchIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Customer Services Tab */}
        <TabPanel value={activeTab} index={1}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Critical Gap Identified:</strong> Customer onboarding services are missing for direct customer acquisition 
              via www.exaltcourier.com. Current services only support courier partner onboarding.
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            Customer Service Implementation Status
          </Typography>
          <Grid container spacing={3}>
            {customerServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {service.service}
                      </Typography>
                      <Chip
                        label={service.priority}
                        size="small"
                        color={service.priority === 'high' ? 'error' : 'warning'}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Implementation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.implementation}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={service.implementation}
                        color={getStatusColor(service.status) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Chip
                      label={service.status}
                      size="small"
                      color={getStatusColor(service.status) as any}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Business Impact:</strong> Missing customer onboarding services limit direct customer acquisition. 
              Implementation required for www.exaltcourier.com portal to serve individual and corporate customers.
            </Typography>
          </Alert>
        </TabPanel>

        {/* Live Operations Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Live Delivery Operations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Deliveries
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Delivery ID</TableCell>
                          <TableCell>Route</TableCell>
                          <TableCell>Courier</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {delivery.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {delivery.from} → {delivery.to}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                                  {delivery.courier.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                {delivery.courier}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={delivery.status}
                                size="small"
                                color={getStatusColor(delivery.status) as any}
                              />
                            </TableCell>
                            <TableCell>{delivery.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Courier Fleet Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Couriers
                    </Typography>
                    <Typography variant="h4">
                      {courierMetrics.activeCouriers}/{courierMetrics.totalCouriers}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(courierMetrics.activeCouriers / courierMetrics.totalCouriers) * 100}
                      color="success"
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {((courierMetrics.activeCouriers / courierMetrics.totalCouriers) * 100).toFixed(1)}% fleet utilization
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Delivery Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Advanced Delivery Analytics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Performance trends, route optimization, and courier analytics would be displayed here
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

export default CourierServices;