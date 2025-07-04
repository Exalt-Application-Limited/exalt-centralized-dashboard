import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Alert,
  Skeleton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Launch as LaunchIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Warehouse as WarehouseIcon,
  DirectionsCar as CarIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

interface DomainMetrics {
  domain: string;
  displayName: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  performance: number;
  users: number;
  revenue?: number;
  growth: number;
  services: number;
  activeServices: number;
  description: string;
  icon: React.ReactElement;
  color: string;
  route: string;
}

const DomainOverview: React.FC = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<DomainMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomainData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockDomains: DomainMetrics[] = [
          {
            domain: 'social-commerce',
            displayName: 'Social Commerce',
            status: 'healthy',
            uptime: 99.8,
            performance: 95.2,
            users: 45230,
            revenue: 2340000,
            growth: 12.5,
            services: 27,
            activeServices: 27,
            description: 'Complete social marketplace ecosystem with vendor management and customer engagement',
            icon: <StoreIcon />,
            color: '#2196F3',
            route: '/domains/social-commerce',
          },
          {
            domain: 'warehousing',
            displayName: 'Warehousing',
            status: 'healthy',
            uptime: 99.9,
            performance: 97.1,
            users: 8450,
            revenue: 890000,
            growth: 18.2,
            services: 30,
            activeServices: 29,
            description: 'Comprehensive warehousing and storage solutions for B2B and B2C customers',
            icon: <WarehouseIcon />,
            color: '#FF9800',
            route: '/domains/warehousing',
          },
          {
            domain: 'courier-services',
            displayName: 'Courier Services',
            status: 'warning',
            uptime: 98.5,
            performance: 89.3,
            users: 15670,
            revenue: 560000,
            growth: -2.1,
            services: 32,
            activeServices: 30,
            description: 'Last-mile delivery and logistics services with real-time tracking',
            icon: <ShippingIcon />,
            color: '#4CAF50',
            route: '/domains/courier-services',
          },
          {
            domain: 'haulage-logistics',
            displayName: 'Haulage Logistics',
            status: 'healthy',
            uptime: 99.2,
            performance: 91.8,
            users: 3240,
            revenue: 125000,
            growth: 45.3,
            services: 18,
            activeServices: 18,
            description: 'Heavy transportation and freight services for enterprise clients',
            icon: <CarIcon />,
            color: '#9C27B0',
            route: '/domains/haulage-logistics',
          },
          {
            domain: 'shared-infrastructure',
            displayName: 'Shared Infrastructure',
            status: 'healthy',
            uptime: 99.95,
            performance: 98.7,
            users: 0,
            growth: 5.2,
            services: 23,
            activeServices: 23,
            description: 'Core infrastructure services supporting all business domains',
            icon: <CloudIcon />,
            color: '#607D8B',
            route: '/domains/shared-infrastructure',
          },
        ];

        setDomains(mockDomains);
      } catch (err) {
        setError('Failed to load domain data');
      } finally {
        setLoading(false);
      }
    };

    fetchDomainData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDomainClick = (route: string) => {
    navigate(route);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Domain Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive view of all business domains and their operational status
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Domains
              </Typography>
              <Typography variant="h4">
                {loading ? <Skeleton width={40} /> : domains.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Services
              </Typography>
              <Typography variant="h4">
                {loading ? <Skeleton width={40} /> : domains.reduce((sum, d) => sum + d.activeServices, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {loading ? <Skeleton width={60} /> : domains.reduce((sum, d) => sum + d.users, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : `$${(domains.reduce((sum, d) => sum + (d.revenue || 0), 0) / 1000000).toFixed(1)}M`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Domain Cards */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={32} width="60%" />
                  <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          domains.map((domain) => (
            <Grid item xs={12} md={6} lg={4} key={domain.domain}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleDomainClick(domain.route)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: domain.color, 
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {domain.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="h2">
                          {domain.displayName}
                        </Typography>
                        <Chip
                          label={domain.status}
                          size="small"
                          color={getStatusColor(domain.status) as any}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {domain.description}
                  </Typography>

                  {/* Metrics */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Uptime
                      </Typography>
                      <Typography variant="h6">
                        {domain.uptime}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Performance
                      </Typography>
                      <Typography variant="h6">
                        {domain.performance}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                      <Typography variant="h6">
                        {domain.users.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Growth
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="h6" 
                          color={domain.growth >= 0 ? 'success.main' : 'error.main'}
                        >
                          {domain.growth >= 0 ? '+' : ''}{domain.growth}%
                        </Typography>
                        {domain.growth >= 0 ? (
                          <TrendingUpIcon color="success" sx={{ ml: 0.5, fontSize: 16 }} />
                        ) : (
                          <TrendingDownIcon color="error" sx={{ ml: 0.5, fontSize: 16 }} />
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Services Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Services
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {domain.activeServices}/{domain.services}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(domain.activeServices / domain.services) * 100}
                      color={getStatusColor(domain.status) as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Revenue (if applicable) */}
                  {domain.revenue && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Revenue
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${(domain.revenue / 1000000).toFixed(1)}M
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    startIcon={<LaunchIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDomainClick(domain.route);
                    }}
                  >
                    View Details
                  </Button>
                  <Box>
                    <Tooltip title="Analytics">
                      <IconButton size="small">
                        <AssessmentIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small">
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default DomainOverview;