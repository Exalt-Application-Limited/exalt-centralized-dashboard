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
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  Storage as StorageIcon,
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
      id={`warehousing-tabpanel-${index}`}
      aria-labelledby={`warehousing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Warehousing: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const warehouseMetrics = {
    totalWarehouses: 24,
    activeWarehouses: 23,
    totalCapacity: 500000, // sq ft
    usedCapacity: 387500,
    totalOrders: 15420,
    pendingOrders: 124,
    monthlyRevenue: 890000,
    growth: 18.2,
  };

  const warehouseFacilities = [
    {
      id: 'WH-001',
      name: 'Dubai Central Warehouse',
      location: 'Dubai, UAE',
      capacity: 50000,
      occupied: 42000,
      status: 'operational',
      type: 'Distribution',
      customers: 45,
    },
    {
      id: 'WH-002',
      name: 'Cape Town Storage Hub',
      location: 'Cape Town, South Africa',
      capacity: 35000,
      occupied: 28000,
      status: 'operational',
      type: 'Self-Storage',
      customers: 156,
    },
    {
      id: 'WH-003',
      name: 'Frankfurt Logistics Center',
      location: 'Frankfurt, Germany',
      capacity: 75000,
      occupied: 68000,
      status: 'operational',
      type: 'Distribution',
      customers: 23,
    },
    {
      id: 'WH-004',
      name: 'Singapore Multi-Purpose',
      location: 'Singapore',
      capacity: 40000,
      occupied: 31000,
      status: 'maintenance',
      type: 'Mixed',
      customers: 67,
    },
  ];

  const customerServices = [
    {
      service: 'Customer Storage Marketplace',
      status: 'active',
      customers: 1240,
      revenue: 156000,
      growth: 25.3,
    },
    {
      service: 'Moving & Logistics',
      status: 'active',
      customers: 456,
      revenue: 89000,
      growth: 12.8,
    },
    {
      service: 'Insurance Protection',
      status: 'active',
      customers: 890,
      revenue: 67000,
      growth: 18.5,
    },
    {
      service: 'Storage Pricing Engine',
      status: 'maintenance',
      customers: 0,
      revenue: 0,
      growth: 0,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            🏭 Warehousing Domain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive warehousing and storage solutions for B2B and B2C customers
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
        Warehousing Systems: OPERATIONAL - 29 of 30 services running normally
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarehouseIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Warehouses
                </Typography>
              </Box>
              <Typography variant="h4">
                {warehouseMetrics.activeWarehouses}/{warehouseMetrics.totalWarehouses}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(warehouseMetrics.activeWarehouses / warehouseMetrics.totalWarehouses) * 100}
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
                <StorageIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Capacity Utilization
                </Typography>
              </Box>
              <Typography variant="h4">
                {((warehouseMetrics.usedCapacity / warehouseMetrics.totalCapacity) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(warehouseMetrics.usedCapacity / 1000).toFixed(0)}K / {(warehouseMetrics.totalCapacity / 1000).toFixed(0)}K sq ft
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShippingIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Active Orders
                </Typography>
              </Box>
              <Typography variant="h4">
                {warehouseMetrics.pendingOrders.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {warehouseMetrics.totalOrders.toLocaleString()} total
              </Typography>
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
                ${(warehouseMetrics.monthlyRevenue / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main">
                  +{warehouseMetrics.growth}%
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
            <Tab label="Facility Overview" />
            <Tab label="Customer Services" />
            <Tab label="Operations" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Facility Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Warehouse Facilities
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Facility</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Occupancy</TableCell>
                  <TableCell>Customers</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouseFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {facility.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {facility.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{facility.location}</TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{(facility.capacity / 1000).toFixed(0)}K sq ft</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {((facility.occupied / facility.capacity) * 100).toFixed(1)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(facility.occupied / facility.capacity) * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{facility.customers}</TableCell>
                    <TableCell>
                      <Chip
                        label={facility.status}
                        size="small"
                        color={facility.status === 'operational' ? 'success' : 'warning'}
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
          <Typography variant="h6" gutterBottom>
            Customer Services Portfolio
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
                        label={service.status}
                        size="small"
                        color={service.status === 'active' ? 'success' : 'warning'}
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Customers
                        </Typography>
                        <Typography variant="h6">
                          {service.customers.toLocaleString()}
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
                        <Typography variant="h6" color={service.growth > 0 ? 'success.main' : 'text.primary'}>
                          {service.growth > 0 ? '+' : ''}{service.growth}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Implementation Status:</strong> 7 out of 8 customer marketplace services are fully operational. 
              Storage Pricing Engine is currently under maintenance for optimization.
            </Typography>
          </Alert>
        </TabPanel>

        {/* Operations Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Operational Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Operations
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Operations timeline and activities would be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Health
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Service health monitoring dashboard would be displayed here
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
            Business Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Advanced Analytics Dashboard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Revenue trends, customer insights, and performance metrics would be displayed here
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

export default Warehousing;