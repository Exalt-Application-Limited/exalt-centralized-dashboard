import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';

// Mock data
const monthlyOrdersData = [
  { name: 'Jan', value: 450 },
  { name: 'Feb', value: 560 },
  { name: 'Mar', value: 620 },
  { name: 'Apr', value: 510 },
  { name: 'May', value: 670 },
  { name: 'Jun', value: 790 },
  { name: 'Jul', value: 920 },
  { name: 'Aug', value: 780 },
  { name: 'Sep', value: 1020 },
  { name: 'Oct', value: 1150 },
  { name: 'Nov', value: 1280 },
  { name: 'Dec', value: 1450 }
];

const ordersByStatusData = [
  { name: 'Pending', value: 145 },
  { name: 'Processing', value: 378 },
  { name: 'Shipped', value: 612 },
  { name: 'Delivered', value: 2450 },
  { name: 'Cancelled', value: 164 },
  { name: 'Refunded', value: 98 }
];

const ordersByCategoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home & Garden', value: 15 },
  { name: 'Sports', value: 12 },
  { name: 'Beauty', value: 8 },
  { name: 'Other', value: 5 }
];

const ordersByChannelData = [
  { name: 'Website', value: 45 },
  { name: 'Mobile App', value: 35 },
  { name: 'Social Media', value: 15 },
  { name: 'Marketplace', value: 5 }
];

const topSellingProductsData = [
  { name: 'Wireless Headphones', value: 842 },
  { name: 'Smart Watch', value: 621 },
  { name: 'Bluetooth Speaker', value: 453 },
  { name: 'Fitness Tracker', value: 398 },
  { name: 'Wireless Charger', value: 352 }
];

const orderValueDistributionData = [
  { name: 'Under $50', value: 1245 },
  { name: '$50-$100', value: 2354 },
  { name: '$100-$200', value: 1876 },
  { name: '$200-$500', value: 987 },
  { name: '$500+', value: 342 }
];

const orderTimeDistributionData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  orders: Math.floor(Math.random() * 150) + 20
}));

const geographicDistributionData = [
  { region: 'North America', orders: 3450, revenue: 345000 },
  { region: 'Europe', orders: 2680, revenue: 268000 },
  { region: 'Asia', orders: 1980, revenue: 198000 },
  { region: 'Australia', orders: 890, revenue: 89000 },
  { region: 'South America', orders: 780, revenue: 78000 },
  { region: 'Africa', orders: 450, revenue: 45000 }
];

const repeatCustomerData = [
  { name: 'First-time', value: 65 },
  { name: 'Repeat', value: 35 }
];

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
      id={`order-analytics-tabpanel-${index}`}
      aria-labelledby={`order-analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderAnalytics: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('year');
  
  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#CACFD2'];
  
  // Status colors
  const STATUS_COLORS = {
    Pending: '#f9a825',     // Amber
    Processing: '#1976d2',  // Blue
    Shipped: '#7b1fa2',     // Purple
    Delivered: '#43a047',   // Green
    Cancelled: '#e53935',   // Red
    Refunded: '#8d6e63'     // Brown
  };
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };
  
  return (
    <Box>
      {/* Page Title & Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Order Analytics
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Orders
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              10,197
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2" color="success.main">
                +12.5% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Completed Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Completed Orders
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              8,273
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2" color="success.main">
                +8.7% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Cancellation Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Cancellation Rate
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              4.2%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingDownIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2" color="success.main">
                -1.3% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Average Order Value */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Average Order Value
              </Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              $127.45
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2" color="success.main">
                +3.2% from last period
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs for different analytics views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="order analytics tabs">
          <Tab label="Overview" id="order-analytics-tab-0" />
          <Tab label="Distribution" id="order-analytics-tab-1" />
          <Tab label="Customer Insights" id="order-analytics-tab-2" />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Orders Over Time */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Orders Over Time"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyOrdersData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value} orders`, 'Count']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Orders"
                      stroke={theme.palette.primary.main}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Orders by Status */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Orders by Status"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          // @ts-ignore
                          fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} orders`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Orders by Category */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Orders by Category"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ordersByCategoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                    <Legend />
                    <Bar dataKey="value" name="Orders %" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Top Selling Products */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Top Selling Products"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSellingProductsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value: number) => [`${value} units`, 'Units Sold']} />
                    <Legend />
                    <Bar dataKey="value" name="Units Sold" fill={theme.palette.secondary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Distribution Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Order Value Distribution */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Order Value Distribution"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderValueDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderValueDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} orders`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Order Time Distribution */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Order Time Distribution (24h)"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orderTimeDistributionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${hour}:00`}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} orders`, 'Count']}
                      labelFormatter={(hour) => `Time: ${hour}:00 - ${hour}:59`}
                    />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      name="Orders"
                      fill={theme.palette.info.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Geographic Distribution */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Geographic Distribution"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={geographicDistributionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      name="Orders"
                      fill={theme.palette.primary.main}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Orders by Channel */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Orders by Channel"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByChannelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Customer Insights Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* First-Time vs Repeat Customers */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="First-Time vs Repeat Customers"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repeatCustomerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={theme.palette.primary.main} />
                      <Cell fill={theme.palette.secondary.main} />
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Order Count vs Order Value */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardHeader
                title="Order Count vs Order Value"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="orders"
                      name="Orders"
                      unit=""
                    />
                    <YAxis
                      type="number"
                      dataKey="revenue"
                      name="Revenue"
                      unit="$"
                    />
                    <ZAxis range={[100, 500]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => [
                        name === 'Revenue' ? `$${value.toLocaleString()}` : value,
                        name
                      ]}
                    />
                    <Legend />
                    <Scatter
                      name="Regions"
                      data={geographicDistributionData}
                      fill={theme.palette.primary.main}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default OrderAnalytics;
