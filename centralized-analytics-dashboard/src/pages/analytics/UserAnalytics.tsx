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
  Avatar,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  FiberManualRecord as DotIcon,
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// Mock user analytics data
const userGrowthData = [
  { month: 'Jan', newUsers: 1250, activeUsers: 8450, churnedUsers: 180 },
  { month: 'Feb', newUsers: 1420, activeUsers: 9180, churnedUsers: 165 },
  { month: 'Mar', newUsers: 1680, activeUsers: 10240, churnedUsers: 145 },
  { month: 'Apr', newUsers: 1890, activeUsers: 11650, churnedUsers: 125 },
  { month: 'May', newUsers: 2150, activeUsers: 13200, churnedUsers: 110 },
  { month: 'Jun', newUsers: 2350, activeUsers: 14850, churnedUsers: 95 },
];

const userDemographics = [
  { ageGroup: '18-24', users: 2890, percentage: 22.5, avgSpend: 145.50 },
  { ageGroup: '25-34', users: 4250, percentage: 33.1, avgSpend: 289.75 },
  { ageGroup: '35-44', users: 3180, percentage: 24.8, avgSpend: 398.25 },
  { ageGroup: '45-54', users: 1650, percentage: 12.8, avgSpend: 324.80 },
  { ageGroup: '55+', users: 870, percentage: 6.8, avgSpend: 256.90 },
];

const geographicDistribution = [
  { region: 'North America', users: 5420, percentage: 42.1, growth: 8.5 },
  { region: 'Europe', users: 3890, percentage: 30.2, growth: 12.3 },
  { region: 'Asia Pacific', users: 2340, percentage: 18.2, growth: 15.7 },
  { region: 'Latin America', users: 780, percentage: 6.1, growth: 22.1 },
  { region: 'Africa', users: 440, percentage: 3.4, growth: 28.5 },
];

const userEngagement = [
  { metric: 'Daily Active Users', value: 8950, change: 12.3, target: 10000 },
  { metric: 'Weekly Active Users', value: 11240, change: 8.7, target: 12000 },
  { metric: 'Monthly Active Users', value: 14850, change: 15.2, target: 15000 },
  { metric: 'Session Duration', value: 18.5, change: -2.1, target: 20 },
  { metric: 'Pages per Session', value: 5.8, change: 5.4, target: 6 },
  { metric: 'Bounce Rate', value: 32.4, change: -8.2, target: 30 },
];

const topUsers = [
  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', totalOrders: 47, totalSpent: 2890.50, lastActive: '2 hours ago', tier: 'Platinum' },
  { id: 2, name: 'Michael Chen', avatar: 'MC', totalOrders: 38, totalSpent: 2245.75, lastActive: '5 hours ago', tier: 'Gold' },
  { id: 3, name: 'Emily Rodriguez', avatar: 'ER', totalOrders: 35, totalSpent: 2105.25, lastActive: '1 day ago', tier: 'Gold' },
  { id: 4, name: 'David Thompson', avatar: 'DT', totalOrders: 29, totalSpent: 1875.00, lastActive: '3 hours ago', tier: 'Silver' },
  { id: 5, name: 'Lisa Wang', avatar: 'LW', totalOrders: 26, totalSpent: 1654.80, lastActive: '6 hours ago', tier: 'Silver' },
];

const userBehaviorData = [
  { subject: 'Purchase Frequency', A: 120, B: 110, fullMark: 150 },
  { subject: 'Social Engagement', A: 98, B: 130, fullMark: 150 },
  { subject: 'Content Interaction', A: 86, B: 130, fullMark: 150 },
  { subject: 'Review Activity', A: 99, B: 100, fullMark: 150 },
  { subject: 'Referral Rate', A: 85, B: 90, fullMark: 150 },
  { subject: 'Loyalty Score', A: 95, B: 115, fullMark: 150 },
];

const recentActivity = [
  { user: 'Alice Cooper', action: 'Made a purchase', item: 'MacBook Pro 16"', time: '5 minutes ago', value: '$2,399.00' },
  { user: 'Bob Smith', action: 'Wrote a review', item: 'Nike Air Max', time: '12 minutes ago', value: '5 stars' },
  { user: 'Carol Wilson', action: 'Shared product', item: 'Samsung Galaxy S24', time: '18 minutes ago', value: '3 shares' },
  { user: 'David Brown', action: 'Added to wishlist', item: 'Kitchen Mixer', time: '25 minutes ago', value: 'Wishlist' },
  { user: 'Eva Martinez', action: 'Joined loyalty program', item: 'Gold Tier', time: '32 minutes ago', value: 'Tier upgrade' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
const TIER_COLORS = {
  Platinum: '#E5E4E2',
  Gold: '#FFD700',
  Silver: '#C0C0C0',
  Bronze: '#CD7F32',
};

const UserAnalytics: React.FC = () => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value);
  };

  const handleSegmentChange = (event: SelectChangeEvent) => {
    setSelectedSegment(event.target.value);
  };

  // Calculate summary stats
  const latestData = userGrowthData[userGrowthData.length - 1];
  const totalUsers = latestData.activeUsers;
  const newUsersGrowth = ((latestData.newUsers - userGrowthData[userGrowthData.length - 2].newUsers) / userGrowthData[userGrowthData.length - 2].newUsers * 100).toFixed(1);
  const churnRate = (latestData.churnedUsers / latestData.activeUsers * 100).toFixed(1);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'Made a purchase':
        return <ShoppingCartIcon sx={{ color: 'success.main' }} />;
      case 'Wrote a review':
        return <StarIcon sx={{ color: 'warning.main' }} />;
      case 'Shared product':
        return <ShareIcon sx={{ color: 'info.main' }} />;
      case 'Added to wishlist':
        return <ThumbUpIcon sx={{ color: 'secondary.main' }} />;
      case 'Joined loyalty program':
        return <PersonAddIcon sx={{ color: 'primary.main' }} />;
      default:
        return <VisibilityIcon />;
    }
  };

  const getTierColor = (tier: string) => {
    return TIER_COLORS[tier as keyof typeof TIER_COLORS] || '#gray';
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          User Analytics & Insights
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Time Period"
              onChange={handlePeriodChange}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Segment</InputLabel>
            <Select
              value={selectedSegment}
              label="Segment"
              onChange={handleSegmentChange}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="new">New Users</MenuItem>
              <MenuItem value="returning">Returning</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<FilterIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* User Growth Alert */}
      <Alert 
        severity="success" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            View Details
          </Button>
        }
      >
        <strong>Growth Milestone:</strong> Congratulations! You've reached 14,850+ monthly active users, a 15.2% increase from last month.
      </Alert>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {totalUsers.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +15.2% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonAddIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  New Users
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {latestData.newUsers.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +{newUsersGrowth}% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  User Satisfaction
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                4.7/5
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +0.3 improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Churn Rate
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {churnRate}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDownIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  -2.1% improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* User Growth Trend */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="User Growth & Retention"
              subheader="Monthly new users, active users, and churn analysis"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="newUsers" fill={theme.palette.primary.main} name="New Users" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke={theme.palette.success.main}
                    strokeWidth={3}
                    name="Active Users"
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="churnedUsers" 
                    stroke={theme.palette.error.main}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Churned Users"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Behavior Radar */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="User Behavior Analysis"
              subheader="Current vs. Previous Period"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={userBehaviorData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Current Period"
                    dataKey="A"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Previous Period"
                    dataKey="B"
                    stroke={theme.palette.secondary.main}
                    fill={theme.palette.secondary.main}
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Analysis Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Demographics */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="User Demographics"
              subheader="Age distribution and spending patterns"
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
                      <TableCell>Age Group</TableCell>
                      <TableCell align="right">Users</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                      <TableCell align="right">Avg Spend ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDemographics.map((demo) => (
                      <TableRow key={demo.ageGroup}>
                        <TableCell component="th" scope="row">
                          {demo.ageGroup}
                        </TableCell>
                        <TableCell align="right">{demo.users.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${demo.percentage}%`}
                            color={demo.percentage > 25 ? 'primary' : demo.percentage > 15 ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">${demo.avgSpend.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 400 }}>
            <CardHeader
              title="Geographic Distribution"
              subheader="User base by region with growth rates"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
              <List>
                {geographicDistribution.map((region, index) => (
                  <ListItem key={region.region} divider={index < geographicDistribution.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                        <LocationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={region.region}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {region.users.toLocaleString()} users ({region.percentage}%)
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="success.main">
                              +{region.growth}% growth
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" component="div">
                          {region.percentage}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          of total
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

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Top Users */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: 450 }}>
            <CardHeader
              title="Top Performing Users"
              subheader="Highest value customers and VIP users"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
              <List>
                {topUsers.map((user, index) => (
                  <ListItem key={user.id} divider={index < topUsers.length - 1}>
                    <ListItemAvatar>
                      <Badge 
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <DotIcon 
                            sx={{ 
                              color: getTierColor(user.tier),
                              fontSize: 16 
                            }} 
                          />
                        }
                      >
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                          {user.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{user.name}</Typography>
                          <Chip 
                            label={user.tier}
                            size="small"
                            sx={{ 
                              bgcolor: getTierColor(user.tier),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {user.totalOrders} orders • ${user.totalSpent.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last active: {user.lastActive}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" component="div">
                          ${user.totalSpent.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Spent
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: 450 }}>
            <CardHeader
              title="Recent User Activity"
              subheader="Latest user interactions and engagements"
              action={
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivity.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.background.default }}>
                        {getActivityIcon(activity.action)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{activity.user}</strong> {activity.action.toLowerCase()}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="primary.main">
                            {activity.item}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="success.main">
                          {activity.value}
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

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Export User Data</MenuItem>
        <MenuItem onClick={handleMenuClose}>Create User Segment</MenuItem>
        <MenuItem onClick={handleMenuClose}>Send Targeted Campaign</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Detailed Analysis</MenuItem>
        <MenuItem onClick={handleMenuClose}>Configure Alerts</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserAnalytics;
