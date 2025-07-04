import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  LocalShipping as ShippingIcon,
  People as UserIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'order' | 'shipment' | 'user' | 'system' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  domain: string;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ loading = false }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    fetchRecentActivity();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchRecentActivity, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setActivityLoading(true);
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'order',
          title: 'High-value order received',
          description: 'Order #SC-2024-5678 worth $12,450 from Premium Vendor Corp',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          severity: 'success',
          domain: 'Social Commerce',
          metadata: { orderId: 'SC-2024-5678', value: 12450 }
        },
        {
          id: '2',
          type: 'system',
          title: 'System performance alert',
          description: 'API response times elevated in Warehousing domain',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          severity: 'warning',
          domain: 'Warehousing',
          metadata: { responseTime: 850 }
        },
        {
          id: '3',
          type: 'user',
          title: 'New stakeholder registered',
          description: 'Sarah Chen (Regional Director) completed onboarding',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          severity: 'info',
          domain: 'Infrastructure',
          metadata: { userId: 'user-789', role: 'Regional Director' }
        },
        {
          id: '4',
          type: 'shipment',
          title: 'Express delivery completed',
          description: 'Same-day delivery batch of 45 packages delivered successfully',
          timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
          severity: 'success',
          domain: 'Courier Services',
          metadata: { packageCount: 45, deliveryType: 'same-day' }
        },
        {
          id: '5',
          type: 'alert',
          title: 'Inventory threshold reached',
          description: 'Electronic accessories inventory below minimum threshold',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          severity: 'warning',
          domain: 'Warehousing',
          metadata: { category: 'Electronics', threshold: 'minimum' }
        },
        {
          id: '6',
          type: 'order',
          title: 'Bulk order processed',
          description: 'Corporate order from TechStart Inc. for 500 units processed',
          timestamp: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
          severity: 'success',
          domain: 'Social Commerce',
          metadata: { orderId: 'SC-2024-5679', quantity: 500 }
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <OrderIcon />;
      case 'shipment':
        return <ShippingIcon />;
      case 'user':
        return <UserIcon />;
      case 'system':
        return <TrendingUpIcon />;
      case 'alert':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getActivityColor = (severity?: string) => {
    switch (severity) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'info.main';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'success':
        return <SuccessIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  if (loading || activityLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {[1, 2, 3, 4, 5].map((i) => (
              <ListItem key={i}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="60%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recent Activity
          </Typography>
          <Button size="small" onClick={fetchRecentActivity}>
            Refresh
          </Button>
        </Box>

        {/* Activity List */}
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: `${getActivityColor(activity.severity)}20`,
                      color: getActivityColor(activity.severity),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.title}
                      </Typography>
                      <Chip
                        icon={getSeverityIcon(activity.severity)}
                        label={activity.domain}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        {/* View All Button */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="outlined" size="small">
            View All Activity
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;