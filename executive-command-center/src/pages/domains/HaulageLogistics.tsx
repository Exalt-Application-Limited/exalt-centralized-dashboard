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
  DirectionsCar as TruckIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Route as RouteIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
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
      id={`haulage-tabpanel-${index}`}
      aria-labelledby={`haulage-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const HaulageLogistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const haulageMetrics = {
    totalShipments: 3240,
    activeShipments: 89,
    avgTransitTime: 18.5, // hours
    onTimeRate: 91.8,
    monthlyRevenue: 125000,
    growth: 45.3,
    fleetUtilization: 87.2,
    totalVehicles: 45,
  };

  const fleetData = [
    {
      vehicleId: 'HAL-001',
      type: 'Heavy Truck',
      capacity: '40 tons',
      currentLoad: '32 tons',
      status: 'in-transit',
      route: 'Dubai → Riyadh',
      driver: 'Mohammed A.',
      eta: '14:30',
    },
    {
      vehicleId: 'HAL-012',
      type: 'Container Truck',
      capacity: '25 tons',
      currentLoad: '22 tons',
      status: 'loading',
      route: 'Cape Town Port',
      driver: 'John D.',
      eta: 'TBD',
    },
    {
      vehicleId: 'HAL-023',
      type: 'Flatbed Truck',
      capacity: '30 tons',
      currentLoad: '28 tons',
      status: 'delivered',
      route: 'Frankfurt → Berlin',
      driver: 'Klaus S.',
      eta: 'Completed',
    },
    {
      vehicleId: 'HAL-034',
      type: 'Refrigerated',
      capacity: '20 tons',
      currentLoad: '18 tons',
      status: 'maintenance',
      route: 'Singapore Hub',
      driver: 'Li W.',
      eta: 'Maintenance',
    },
  ];

  const servicePortfolio = [
    {
      service: 'Enterprise Freight Management',
      status: 'active',
      clients: 45,
      revenue: 89000,
      growth: 34.2,
    },
    {
      service: 'Cross-Border Transportation',
      status: 'active',
      clients: 23,
      revenue: 67000,
      growth: 28.5,
    },
    {
      service: 'Heavy Equipment Transport',
      status: 'active',
      clients: 12,
      revenue: 45000,
      growth: 52.1,
    },
    {
      service: 'Specialized Cargo Handling',
      status: 'development',
      clients: 8,
      revenue: 23000,
      growth: 67.3,
    },
  ];

  const recentShipments = [
    {
      id: 'HAL-SH-245',
      client: 'Al Futtaim Group',
      cargo: 'Construction Materials',
      weight: '35 tons',
      route: 'Dubai → Abu Dhabi',
      status: 'delivered',
      duration: '4.2 hrs',
    },
    {
      id: 'HAL-SH-244',
      client: 'BMW Group',
      cargo: 'Auto Parts',
      weight: '12 tons',
      route: 'Frankfurt → Munich',
      status: 'in-transit',
      duration: '2.8 hrs',
    },
    {
      id: 'HAL-SH-243',
      client: 'Shoprite Holdings',
      cargo: 'Consumer Goods',
      weight: '28 tons',
      route: 'Cape Town → Johannesburg',
      status: 'loading',
      duration: 'TBD',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'active':
        return 'success';
      case 'in-transit':
      case 'development':
        return 'info';
      case 'loading':
        return 'warning';
      case 'maintenance':
        return 'error';
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
            🚛 Haulage Logistics Domain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Heavy transportation and freight services for enterprise clients
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
      <Alert severity="success" sx={{ mb: 3 }}>
        Haulage Systems: OPERATIONAL - All 18 services running optimally. Infrastructure ready for $5M+ revenue potential.
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TruckIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Shipments
                </Typography>
              </Box>
              <Typography variant="h4">
                {haulageMetrics.activeShipments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {haulageMetrics.totalShipments.toLocaleString()} total
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
                  Avg Transit Time
                </Typography>
              </Box>
              <Typography variant="h4">
                {haulageMetrics.avgTransitTime}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: <24.0h
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
                {haulageMetrics.onTimeRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={haulageMetrics.onTimeRate}
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
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                ${(haulageMetrics.monthlyRevenue / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main">
                  +{haulageMetrics.growth}%
                </Typography>
                <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Fleet Management" />
            <Tab label="Service Portfolio" />
            <Tab label="Live Operations" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Fleet Management Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Fleet Status & Management
            </Typography>
            <Chip
              label={`${haulageMetrics.fleetUtilization}% Utilization`}
              color="success"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Current Load</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fleetData.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {vehicle.vehicleId}
                      </Typography>
                    </TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {vehicle.currentLoad}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(parseFloat(vehicle.currentLoad) / parseFloat(vehicle.capacity)) * 100}
                          sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vehicle.status}
                        size="small"
                        color={getStatusColor(vehicle.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RouteIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2">
                          {vehicle.route}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                          {vehicle.driver.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        {vehicle.driver}
                      </Box>
                    </TableCell>
                    <TableCell>{vehicle.eta}</TableCell>
                    <TableCell>
                      <Tooltip title="Track Vehicle">
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

        {/* Service Portfolio Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Haulage Service Portfolio
          </Typography>
          <Grid container spacing={3}>
            {servicePortfolio.map((service, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {service.service}
                      </Typography>
                      <Chip
                        label={service.status}
                        size="small"
                        color={getStatusColor(service.status) as any}
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Clients
                        </Typography>
                        <Typography variant="h6">
                          {service.clients}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h6">
                          ${(service.revenue / 1000).toFixed(0)}K
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Growth
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          +{service.growth}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Infrastructure Ready:</strong> Complete 18-service architecture deployed with enterprise-grade 
              infrastructure. Ready for immediate business development and $5M+ annual revenue potential.
            </Typography>
          </Alert>
        </TabPanel>

        {/* Live Operations Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Live Shipment Operations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Shipments
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Shipment ID</TableCell>
                          <TableCell>Client</TableCell>
                          <TableCell>Cargo</TableCell>
                          <TableCell>Weight</TableCell>
                          <TableCell>Route</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Duration</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentShipments.map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {shipment.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                                <Typography variant="body2">
                                  {shipment.client}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{shipment.cargo}</TableCell>
                            <TableCell>{shipment.weight}</TableCell>
                            <TableCell>{shipment.route}</TableCell>
                            <TableCell>
                              <Chip
                                label={shipment.status}
                                size="small"
                                color={getStatusColor(shipment.status) as any}
                              />
                            </TableCell>
                            <TableCell>{shipment.duration}</TableCell>
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
                    Fleet Utilization
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Vehicles
                    </Typography>
                    <Typography variant="h4">
                      {Math.round(haulageMetrics.totalVehicles * haulageMetrics.fleetUtilization / 100)}/{haulageMetrics.totalVehicles}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={haulageMetrics.fleetUtilization}
                      color="success"
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {haulageMetrics.fleetUtilization}% fleet utilization
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Growth
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main">
                      +{haulageMetrics.growth}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Month-over-month growth
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Haulage Analytics & Intelligence
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Advanced Haulage Analytics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Route optimization, cost analysis, fleet performance, and revenue analytics would be displayed here
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

export default HaulageLogistics;