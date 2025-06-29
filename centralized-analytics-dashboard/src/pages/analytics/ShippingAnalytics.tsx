import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  LocalShipping as ShippingIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MyLocation as LocationIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';

// Mock shipping data
const deliveryMetrics = [
  { period: 'Jan', onTime: 92, delayed: 6, failed: 2, avgTime: 24.5 },
  { period: 'Feb', onTime: 94, delayed: 4, failed: 2, avgTime: 23.8 },
  { period: 'Mar', onTime: 89, delayed: 8, failed: 3, avgTime: 26.2 },
  { period: 'Apr', onTime: 96, delayed: 3, failed: 1, avgTime: 22.1 },
  { period: 'May', onTime: 93, delayed: 5, failed: 2, avgTime: 23.7 },
  { period: 'Jun', onTime: 91, delayed: 7, failed: 2, avgTime: 25.1 },
];

const regionalPerformance = [
  { region: 'North America', deliveries: 4521, onTimeRate: 94.2, avgTime: 22.5, cost: 125000 },
  { region: 'Europe', deliveries: 3876, onTimeRate: 91.8, avgTime: 28.1, cost: 148000 },
  { region: 'Asia Pacific', deliveries: 2954, onTimeRate: 87.3, avgTime: 31.7, cost: 112000 },
  { region: 'Latin America', deliveries: 1823, onTimeRate: 85.9, avgTime: 35.2, cost: 89000 },
  { region: 'Africa', deliveries: 1205, onTimeRate: 82.1, avgTime: 42.3, cost: 67000 },
];

const courierPerformance = [
  { name: 'FastTrack Express', deliveries: 3245, onTime: 96.8, rating: 4.8, efficiency: 92 },
  { name: 'Global Logistics', deliveries: 2876, onTime: 93.2, rating: 4.6, efficiency: 88 },
  { name: 'Speed Delivery', deliveries: 2543, onTime: 89.7, rating: 4.4, efficiency: 85 },
  { name: 'Reliable Couriers', deliveries: 2109, onTime: 91.5, rating: 4.5, efficiency: 87 },
  { name: 'Express Network', deliveries: 1987, onTime: 87.3, rating: 4.2, efficiency: 83 },
];

const recentShipments = [
  { id: 'SH-12345', destination: 'New York, USA', courier: 'FastTrack Express', status: 'Delivered', estimatedTime: '22h', actualTime: '21h 30m', customer: 'John Smith' },
  { id: 'SH-12346', destination: 'London, UK', courier: 'Global Logistics', status: 'In Transit', estimatedTime: '36h', actualTime: '32h 15m', customer: 'Emily Johnson' },
  { id: 'SH-12347', destination: 'Tokyo, Japan', courier: 'Speed Delivery', status: 'Processing', estimatedTime: '48h', actualTime: '-', customer: 'Hiroshi Tanaka' },
  { id: 'SH-12348', destination: 'Sydney, Australia', courier: 'Reliable Couriers', status: 'Delayed', estimatedTime: '42h', actualTime: '48h 20m', customer: 'Sarah Wilson' },
  { id: 'SH-12349', destination: 'São Paulo, Brazil', courier: 'Express Network', status: 'Failed', estimatedTime: '55h', actualTime: '-', customer: 'Carlos Rodriguez' },
];

const deliveryTypes = [
  { name: 'Standard', value: 45, avgCost: 8.50, avgTime: 48 },
  { name: 'Express', value: 30, avgCost: 15.75, avgTime: 24 },
  { name: 'Same Day', value: 15, avgCost: 25.00, avgTime: 8 },
  { name: 'International', value: 10, avgCost: 35.50, avgTime: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  Delivered: '#4caf50',
  'In Transit': '#2196f3',
  Processing: '#ff9800',
  Delayed: '#f44336',
  Failed: '#9c27b0',
};

const ShippingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCourier, setSelectedCourier] = useState<string>('all');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRegionChange = (event: SelectChangeEvent) => {
    setSelectedRegion(event.target.value);
  };

  const handleCourierChange = (event: SelectChangeEvent) => {
    setSelectedCourier(event.target.value);
  };

  // Calculate summary stats
  const totalDeliveries = regionalPerformance.reduce((sum, region) => sum + region.deliveries, 0);
  const avgOnTimeRate = (regionalPerformance.reduce((sum, region) => sum + region.onTimeRate, 0) / regionalPerformance.length).toFixed(1);
  const avgDeliveryTime = (regionalPerformance.reduce((sum, region) => sum + region.avgTime, 0) / regionalPerformance.length).toFixed(1);
  const totalCost = regionalPerformance.reduce((sum, region) => sum + region.cost, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'In Transit':
        return <ShippingIcon sx={{ color: 'info.main' }} />;
      case 'Processing':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case 'Delayed':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      case 'Failed':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <ScheduleIcon />;
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Shipping & Delivery Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={selectedRegion}
              label="Region"
              onChange={handleRegionChange}
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="na">North America</MenuItem>
              <MenuItem value="eu">Europe</MenuItem>
              <MenuItem value="ap">Asia Pacific</MenuItem>
              <MenuItem value="la">Latin America</MenuItem>
              <MenuItem value="af">Africa</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Courier</InputLabel>
            <Select
              value={selectedCourier}
              label="Courier"
              onChange={handleCourierChange}
            >
              <MenuItem value="all">All Couriers</MenuItem>
              <MenuItem value="fasttrack">FastTrack Express</MenuItem>
              <MenuItem value="global">Global Logistics</MenuItem>
              <MenuItem value="speed">Speed Delivery</MenuItem>
              <MenuItem value="reliable">Reliable Couriers</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<FilterIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Performance Alert */}
      <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            View Details
          </Button>
        }
      >
        <strong>Performance Update:</strong> On-time delivery rate improved by 2.3% this month. 5 shipments are currently delayed.
      </Alert>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShippingIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Deliveries
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {totalDeliveries.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +8.2% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  On-Time Rate
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {avgOnTimeRate}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +2.3% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Avg Delivery Time
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {avgDeliveryTime}h
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDownIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  -1.5h improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Shipping Cost
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                ${(totalCost / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDownIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  -3.1% cost reduction
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Delivery Performance Trends */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="Delivery Performance Trends"
              subheader="Monthly on-time delivery rates and average delivery time"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deliveryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="onTime" fill={theme.palette.success.main} name="On Time %" />
                  <Bar yAxisId="left" dataKey="delayed" fill={theme.palette.warning.main} name="Delayed %" />
                  <Bar yAxisId="left" dataKey="failed" fill={theme.palette.error.main} name="Failed %" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    name="Avg Time (hours)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Types Distribution */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="Delivery Types"
              subheader="Distribution by service type"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deliveryTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Tables Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Regional Performance */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 450 }}>
            <CardHeader
              title="Regional Performance"
              subheader="Delivery metrics by geographic region"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">Deliveries</TableCell>
                      <TableCell align="right">On-Time Rate</TableCell>
                      <TableCell align="right">Avg Time (h)</TableCell>
                      <TableCell align="right">Cost ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regionalPerformance.map((region) => (
                      <TableRow key={region.region}>
                        <TableCell component="th" scope="row">
                          {region.region}
                        </TableCell>
                        <TableCell align="right">{region.deliveries.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Box sx={{ width: '60px', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={region.onTimeRate} 
                                color={region.onTimeRate > 90 ? 'success' : region.onTimeRate > 85 ? 'warning' : 'error'}
                              />
                            </Box>
                            <Typography variant="body2">{region.onTimeRate.toFixed(1)}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{region.avgTime.toFixed(1)}</TableCell>
                        <TableCell align="right">${region.cost.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Courier Performance */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 450 }}>
            <CardHeader
              title="Courier Performance"
              subheader="Performance metrics by courier service"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
              <List>
                {courierPerformance.map((courier, index) => (
                  <ListItem key={courier.name} divider={index < courierPerformance.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={courier.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {courier.deliveries.toLocaleString()} deliveries
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Chip 
                              label={`${courier.onTime.toFixed(1)}% On-Time`}
                              color={courier.onTime > 93 ? 'success' : courier.onTime > 88 ? 'warning' : 'error'}
                              size="small"
                            />
                            <Chip 
                              label={`${courier.rating.toFixed(1)}★ Rating`}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" component="div">
                          {courier.efficiency}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Efficiency
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Shipments */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Recent Shipments"
              subheader="Latest shipping activities and status updates"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shipment ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Courier</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Est. Time</TableCell>
                      <TableCell>Actual Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {shipment.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.destination}</TableCell>
                        <TableCell>{shipment.courier}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getStatusIcon(shipment.status)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {shipment.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{shipment.estimatedTime}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={
                              shipment.status === 'Delivered' && shipment.actualTime < shipment.estimatedTime 
                                ? 'success.main' 
                                : shipment.status === 'Delayed' 
                                ? 'error.main' 
                                : 'text.primary'
                            }
                          >
                            {shipment.actualTime || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Detailed Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Configure Alerts</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print Dashboard</MenuItem>
      </Menu>
    </Box>
  );
};

export default ShippingAnalytics;
