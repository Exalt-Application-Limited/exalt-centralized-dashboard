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
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as OrderIcon,
  Store as VendorIcon,
  People as CustomerIcon,
  AttachMoney as RevenueIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { apiService, SocialCommerceMetrics, OrderAnalytics, VendorPerformance } from '../../services/apiService';
import MetricCard from '../../components/dashboard/MetricCard';
import GlobalMetricsChart from '../../components/charts/GlobalMetricsChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`social-commerce-tabpanel-${index}`}
    aria-labelledby={`social-commerce-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SocialCommerce: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<SocialCommerceMetrics | null>(null);
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null);
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchSocialCommerceData();
  }, []);

  const fetchSocialCommerceData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [metricsData, analyticsData, vendorData] = await Promise.all([
        apiService.getSocialCommerceMetrics(),
        apiService.getOrderAnalytics({}),
        apiService.getVendorPerformance(),
      ]);

      setMetrics(metricsData);
      setOrderAnalytics(analyticsData);
      setVendorPerformance(vendorData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load social commerce data');
      console.error('Social commerce data fetch error:', err);
      
      // Generate mock data for demo
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    setMetrics({
      totalRevenue: 2456789,
      orderCount: 15847,
      vendorCount: 342,
      customerCount: 89432,
      conversionRate: 3.2,
      averageOrderValue: 155.25,
    });

    setOrderAnalytics({
      totalOrders: 15847,
      revenue: 2456789,
      averageOrderValue: 155.25,
      topProducts: [
        { id: '1', name: 'Wireless Earbuds Pro', sales: 1245, revenue: 187350 },
        { id: '2', name: 'Smart Fitness Watch', sales: 987, revenue: 296100 },
        { id: '3', name: 'Premium Coffee Beans', sales: 856, revenue: 25680 },
        { id: '4', name: 'Organic Skincare Set', sales: 743, revenue: 89160 },
        { id: '5', name: 'Gaming Mechanical Keyboard', sales: 678, revenue: 101700 },
      ],
      ordersByStatus: [
        { status: 'pending', count: 234 },
        { status: 'processing', count: 567 },
        { status: 'shipped', count: 1456 },
        { status: 'delivered', count: 13456 },
        { status: 'cancelled', count: 134 },
      ],
      revenueByRegion: [
        { region: 'North America', revenue: 985432, orders: 6234 },
        { region: 'Europe', revenue: 743210, orders: 4789 },
        { region: 'Asia Pacific', revenue: 567890, orders: 3456 },
        { region: 'Latin America', revenue: 123456, orders: 1234 },
        { region: 'Middle East & Africa', revenue: 76801, orders: 134 },
      ],
    });

    setVendorPerformance([
      { id: '1', name: 'TechFlow Electronics', revenue: 345678, orders: 2345, rating: 4.8, fulfillmentRate: 98.5 },
      { id: '2', name: 'GreenLife Organics', revenue: 234567, orders: 1876, rating: 4.9, fulfillmentRate: 99.2 },
      { id: '3', name: 'Urban Fashion Co.', revenue: 198765, orders: 1543, rating: 4.6, fulfillmentRate: 96.8 },
      { id: '4', name: 'Home & Garden Plus', revenue: 167890, orders: 1234, rating: 4.7, fulfillmentRate: 97.3 },
      { id: '5', name: 'Sports Gear Pro', revenue: 145632, orders: 1098, rating: 4.5, fulfillmentRate: 95.7 },
    ]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchSocialCommerceData();
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
            Social Commerce Domain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive marketplace analytics and vendor management
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
            title="Total Revenue"
            value={metrics?.totalRevenue || 0}
            format="currency"
            trend={15.3}
            loading={loading}
            icon={<RevenueIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={metrics?.orderCount || 0}
            format="number"
            trend={8.7}
            loading={loading}
            icon={<OrderIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Vendors"
            value={metrics?.vendorCount || 0}
            format="number"
            trend={5.2}
            loading={loading}
            icon={<VendorIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={metrics?.customerCount || 0}
            format="number"
            trend={12.1}
            loading={loading}
            icon={<CustomerIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="social commerce tabs">
            <Tab label="Overview" />
            <Tab label="Orders & Sales" />
            <Tab label="Vendor Management" />
            <Tab label="Customer Analytics" />
            <Tab label="Product Performance" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Performance Chart */}
            <Grid item xs={12} lg={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue & Order Trends
                  </Typography>
                  {loading ? (
                    <Skeleton variant="rectangular" height={300} />
                  ) : (
                    <GlobalMetricsChart />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Conversion Metrics
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Conversion Rate</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {metrics?.conversionRate || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={metrics?.conversionRate || 0} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Avg Order Value</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            ${metrics?.averageOrderValue || 0}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={75} 
                          color="secondary"
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
                        Order Status Distribution
                      </Typography>
                      {loading ? (
                        <Box>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                          ))}
                        </Box>
                      ) : (
                        <List dense>
                          {orderAnalytics?.ordersByStatus.map((status) => (
                            <ListItem key={status.status} sx={{ px: 0 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                      {status.status}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                      {status.count.toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Orders & Sales Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {/* Top Products */}
            <Grid item xs={12} lg={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Products
                  </Typography>
                  {loading ? (
                    <Box>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} height={60} sx={{ mb: 1 }} />
                      ))}
                    </Box>
                  ) : (
                    <List>
                      {orderAnalytics?.topProducts.map((product, index) => (
                        <ListItem key={product.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {product.sales.toLocaleString()} sales • ${product.revenue.toLocaleString()} revenue
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue by Region */}
            <Grid item xs={12} lg={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Region
                  </Typography>
                  {loading ? (
                    <Box>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} height={60} sx={{ mb: 1 }} />
                      ))}
                    </Box>
                  ) : (
                    <List>
                      {orderAnalytics?.revenueByRegion.map((region, index) => (
                        <ListItem key={region.region} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1">{region.region}</Typography>
                                <Chip
                                  label={`$${region.revenue.toLocaleString()}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption">
                                    {region.orders.toLocaleString()} orders
                                  </Typography>
                                  <Typography variant="caption">
                                    {((region.revenue / (orderAnalytics?.revenue || 1)) * 100).toFixed(1)}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={(region.revenue / (orderAnalytics?.revenue || 1)) * 100}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Vendor Management Tab */}
        <TabPanel value={activeTab} index={2}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Vendor Performance Dashboard
                </Typography>
                <Button variant="contained" startIcon={<ViewIcon />}>
                  View All Vendors
                </Button>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Vendor Name</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Orders</TableCell>
                        <TableCell align="right">Rating</TableCell>
                        <TableCell align="right">Fulfillment Rate</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendorPerformance.map((vendor) => (
                        <TableRow key={vendor.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {vendor.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {vendor.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500}>
                              ${vendor.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {vendor.orders.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${vendor.rating}/5`}
                              size="small"
                              color={vendor.rating >= 4.5 ? 'success' : vendor.rating >= 4.0 ? 'warning' : 'error'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {vendor.fulfillmentRate}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={vendor.fulfillmentRate}
                                color={vendor.fulfillmentRate >= 98 ? 'success' : vendor.fulfillmentRate >= 95 ? 'warning' : 'error'}
                                sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" color="primary">
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
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

        {/* Placeholder tabs */}
        <TabPanel value={activeTab} index={3}>
          <Alert severity="info">
            Customer Analytics dashboard coming soon. This will include customer behavior insights, 
            demographics, purchase patterns, and retention metrics.
          </Alert>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Alert severity="info">
            Product Performance analytics coming soon. This will include product lifecycle tracking, 
            inventory optimization, and market trend analysis.
          </Alert>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default SocialCommerce;