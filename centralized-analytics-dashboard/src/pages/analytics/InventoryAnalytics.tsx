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
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  Collapse,
  Paper,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Warehouse as WarehouseIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

// Mock inventory data (same as before)
const inventoryOverview = [
  { warehouse: 'North Warehouse', totalItems: 1453, lowStock: 23, outOfStock: 5, value: 245000 },
  { warehouse: 'South Warehouse', totalItems: 2109, lowStock: 18, outOfStock: 2, value: 387000 },
  { warehouse: 'East Warehouse', totalItems: 987, lowStock: 31, outOfStock: 8, value: 156000 },
  { warehouse: 'West Warehouse', totalItems: 1876, lowStock: 15, outOfStock: 3, value: 298000 },
];

const stockTrends = [
  { month: 'Jan', inStock: 5200, lowStock: 280, outOfStock: 45 },
  { month: 'Feb', inStock: 5350, lowStock: 195, outOfStock: 32 },
  { month: 'Mar', inStock: 5180, lowStock: 220, outOfStock: 28 },
  { month: 'Apr', inStock: 5420, lowStock: 185, outOfStock: 22 },
  { month: 'May', inStock: 5680, lowStock: 165, outOfStock: 18 },
  { month: 'Jun', inStock: 5890, lowStock: 142, outOfStock: 15 },
];

const categoryDistribution = [
  { name: 'Electronics', value: 35, items: 1876, value_usd: 425000 },
  { name: 'Clothing', value: 28, items: 1504, value_usd: 189000 },
  { name: 'Home & Garden', value: 15, items: 805, value_usd: 98000 },
  { name: 'Sports & Outdoor', value: 12, items: 644, value_usd: 87000 },
  { name: 'Beauty & Health', value: 6, items: 322, value_usd: 45000 },
  { name: 'Books & Media', value: 4, items: 214, value_usd: 28000 },
];

const lowStockAlerts = [
  { id: 'PRD-123', name: 'iPhone 15 Pro', currentStock: 8, reorderPoint: 15, category: 'Electronics', urgency: 'critical' },
  { id: 'PRD-456', name: 'Adidas Sneakers', currentStock: 12, reorderPoint: 20, category: 'Sports', urgency: 'warning' },
  { id: 'PRD-789', name: 'Coffee Machine', currentStock: 5, reorderPoint: 10, category: 'Home & Garden', urgency: 'critical' },
  { id: 'PRD-101', name: 'Gaming Headset', currentStock: 18, reorderPoint: 25, category: 'Electronics', urgency: 'warning' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#CACFD2'];

const InventoryAnalytics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metrics']));
  const [activeTab, setActiveTab] = useState(0);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleWarehouseChange = (event: SelectChangeEvent) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Calculate total stats
  const totalItems = inventoryOverview.reduce((sum, warehouse) => sum + warehouse.totalItems, 0);
  const totalLowStock = inventoryOverview.reduce((sum, warehouse) => sum + warehouse.lowStock, 0);
  const totalOutOfStock = inventoryOverview.reduce((sum, warehouse) => sum + warehouse.outOfStock, 0);
  const totalValue = inventoryOverview.reduce((sum, warehouse) => sum + warehouse.value, 0);

  // Mobile-optimized KPI cards
  const kpiCards = [
    {
      title: 'Total Items',
      value: totalItems.toLocaleString(),
      change: '+2.5%',
      icon: <InventoryIcon />,
      color: 'primary.main',
    },
    {
      title: 'Low Stock',
      value: totalLowStock.toString(),
      change: '-1.2%',
      icon: <WarningIcon />,
      color: 'warning.main',
    },
    {
      title: 'Out of Stock',
      value: totalOutOfStock.toString(),
      change: '+0.8%',
      icon: <TrendingDownIcon />,
      color: 'error.main',
    },
    {
      title: 'Total Value',
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      change: '+5.2%',
      icon: <WarehouseIcon />,
      color: 'success.main',
    },
  ];

  const tabContent = [
    { label: 'Overview', value: 0 },
    { label: 'Charts', value: 1 },
    { label: 'Warehouses', value: 2 },
    { label: 'Alerts', value: 3 },
  ];

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Mobile-optimized Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
          Inventory Analytics
        </Typography>
        
        {/* Mobile-first Filter Controls */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2, 
          mb: 2 
        }}>
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 150 }}>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={selectedWarehouse}
              label="Warehouse"
              onChange={handleWarehouseChange}
            >
              <MenuItem value="all">All Warehouses</MenuItem>
              <MenuItem value="north">North Warehouse</MenuItem>
              <MenuItem value="south">South Warehouse</MenuItem>
              <MenuItem value="east">East Warehouse</MenuItem>
              <MenuItem value="west">West Warehouse</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
            </Select>
          </FormControl>
          
          {!isMobile && (
            <Button variant="contained" startIcon={<FilterIcon />}>
              Export Report
            </Button>
          )}
        </Box>

        {/* Mobile View Mode Toggle */}
        {isMobile && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              variant={viewMode === 'cards' ? 'contained' : 'outlined'}
              startIcon={<ViewModuleIcon />}
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              size="small"
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              startIcon={<ViewListIcon />}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={{ ml: 'auto' }}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>

      {/* Alerts - Always visible on mobile */}
      {(totalLowStock > 0 || totalOutOfStock > 0) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            !isMobile && (
              <Button color="inherit" size="small">
                View All Alerts
              </Button>
            )
          }
        >
          <strong>Inventory Alert:</strong> {totalLowStock} items are running low on stock, {totalOutOfStock} items are out of stock.
          {isMobile && (
            <Button color="inherit" size="small" sx={{ mt: 1, display: 'block' }}>
              View All Alerts
            </Button>
          )}
        </Alert>
      )}

      {/* Mobile Tab Navigation */}
      {isMobile ? (
        <>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {tabContent.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Stack spacing={2}>
              {/* KPI Cards - Mobile Stack */}
              {kpiCards.map((kpi, index) => (
                <Card key={index} elevation={2}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: kpi.color }}>
                        {kpi.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {kpi.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {kpi.value}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: kpi.change.startsWith('+') ? 'success.main' : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {kpi.change}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {activeTab === 1 && (
            <Stack spacing={3}>
              {/* Mobile Charts */}
              <Card elevation={2}>
                <CardHeader
                  title="Stock Trends"
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="inStock" 
                          stroke={theme.palette.success.main}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={2}>
                <CardHeader
                  title="Category Distribution"
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={false}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  {/* Mobile Legend */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {categoryDistribution.map((entry, index) => (
                      <Chip
                        key={entry.name}
                        label={`${entry.name} (${entry.value}%)`}
                        size="small"
                        sx={{
                          bgcolor: COLORS[index % COLORS.length],
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          )}

          {activeTab === 2 && (
            <Stack spacing={2}>
              {/* Mobile Warehouse Cards */}
              {inventoryOverview.map((warehouse) => (
                <Card key={warehouse.warehouse} elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {warehouse.warehouse}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Total Items</Typography>
                        <Typography variant="h6">{warehouse.totalItems.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Value</Typography>
                        <Typography variant="h6">${warehouse.value.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Low Stock</Typography>
                        <Chip 
                          label={warehouse.lowStock} 
                          color={warehouse.lowStock > 20 ? 'warning' : 'default'}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
                        <Chip 
                          label={warehouse.outOfStock} 
                          color={warehouse.outOfStock > 5 ? 'error' : 'default'}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {activeTab === 3 && (
            <Stack spacing={2}>
              {/* Mobile Alert Cards */}
              {lowStockAlerts.map((product) => (
                <Card key={product.id} elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                        {product.name}
                      </Typography>
                      <Chip 
                        label={product.urgency}
                        color={product.urgency === 'critical' ? 'error' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.id} • {product.category}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                        <Typography variant="h6">{product.currentStock}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Reorder Point</Typography>
                        <Typography variant="h6">{product.reorderPoint}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </>
      ) : (
        <>
          {/* Desktop/Tablet Layout */}
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {kpiCards.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: kpi.color, mr: 1 }}>
                        {kpi.icon}
                      </Box>
                      <Typography variant="h6" color="text.secondary">
                        {kpi.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {kpi.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: kpi.change.startsWith('+') ? 'success.main' : 'error.main'
                      }}
                    >
                      {kpi.change} from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Stock Trends */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: isTablet ? 350 : 400 }}>
                <CardHeader
                  title="Stock Level Trends"
                  subheader="Monthly inventory levels by status"
                  action={
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ height: 'calc(100% - 100px)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="inStock" 
                        stackId="1" 
                        stroke={theme.palette.success.main}
                        fill={theme.palette.success.light}
                        name="In Stock"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lowStock" 
                        stackId="1" 
                        stroke={theme.palette.warning.main}
                        fill={theme.palette.warning.light}
                        name="Low Stock"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="outOfStock" 
                        stackId="1" 
                        stroke={theme.palette.error.main}
                        fill={theme.palette.error.light}
                        name="Out of Stock"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Distribution */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: isTablet ? 350 : 400 }}>
                <CardHeader
                  title="Inventory by Category"
                  subheader="Product distribution"
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
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={isTablet ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
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
          <Grid container spacing={3}>
            {/* Warehouse Overview */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ height: 400 }}>
                <CardHeader
                  title="Warehouse Overview"
                  subheader="Inventory status by location"
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
                          <TableCell>Warehouse</TableCell>
                          <TableCell align="right">Total Items</TableCell>
                          <TableCell align="right">Low Stock</TableCell>
                          <TableCell align="right">Out of Stock</TableCell>
                          <TableCell align="right">Value ($)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inventoryOverview.map((warehouse) => (
                          <TableRow key={warehouse.warehouse}>
                            <TableCell component="th" scope="row">
                              {warehouse.warehouse}
                            </TableCell>
                            <TableCell align="right">{warehouse.totalItems.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={warehouse.lowStock} 
                                color={warehouse.lowStock > 20 ? 'warning' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={warehouse.outOfStock} 
                                color={warehouse.outOfStock > 5 ? 'error' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">${warehouse.value.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Low Stock Alerts */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ height: 400 }}>
                <CardHeader
                  title="Low Stock Alerts"
                  subheader="Items requiring attention"
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
                          <TableCell>Product</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Current</TableCell>
                          <TableCell align="right">Reorder Point</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lowStockAlerts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell component="th" scope="row">
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={product.category} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">{product.currentStock}</TableCell>
                            <TableCell align="right">{product.reorderPoint}</TableCell>
                            <TableCell>
                              <Chip 
                                label={product.urgency}
                                color={product.urgency === 'critical' ? 'error' : 'warning'}
                                size="small"
                              />
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
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
        <MenuItem onClick={handleMenuClose}>Configure Alerts</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print Report</MenuItem>
      </Menu>
    </Box>
  );
};

export default InventoryAnalytics;
