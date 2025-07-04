import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  LinearProgress,
  IconButton,
  Collapse,
  Skeleton,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  NetworkCheck as NetworkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

import { apiService, SystemHealth, ResourceUsage } from '../../services/apiService';

interface SystemHealthWidgetProps {
  loading?: boolean;
}

const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ loading = false }) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    fetchSystemHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setHealthLoading(true);
      const health = await apiService.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    } finally {
      setHealthLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'critical':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return <CheckCircleIcon color="success" fontSize="small" />;
    }
  };

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

  const getResourceColor = (usage: number) => {
    if (usage >= 90) return 'error';
    if (usage >= 75) return 'warning';
    return 'success';
  };

  const ResourceUsageItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    usage: number;
    unit?: string;
  }> = ({ icon, label, usage, unit = '%' }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ ml: 1, mr: 'auto' }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {usage.toFixed(1)}{unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={usage}
        color={getResourceColor(usage) as any}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );

  if (loading || healthLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Health
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={6} sx={{ mt: 1, borderRadius: 3 }} />
          </Box>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="rectangular" height={6} sx={{ mt: 1, borderRadius: 3 }} />
            </Box>
          ))}
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
            System Health
          </Typography>
          <Chip
            icon={getStatusIcon(systemHealth?.overallStatus || 'healthy')}
            label={systemHealth?.overallStatus || 'Healthy'}
            color={getStatusColor(systemHealth?.overallStatus || 'healthy') as any}
            size="small"
          />
        </Box>

        {/* Resource Usage */}
        {systemHealth?.resourceUsage && (
          <Box>
            <ResourceUsageItem
              icon={<SpeedIcon fontSize="small" color="primary" />}
              label="CPU Usage"
              usage={systemHealth.resourceUsage.cpu}
            />
            
            <ResourceUsageItem
              icon={<MemoryIcon fontSize="small" color="primary" />}
              label="Memory Usage"
              usage={systemHealth.resourceUsage.memory}
            />
            
            <ResourceUsageItem
              icon={<StorageIcon fontSize="small" color="primary" />}
              label="Disk Usage"
              usage={systemHealth.resourceUsage.disk}
            />
            
            <ResourceUsageItem
              icon={<NetworkIcon fontSize="small" color="primary" />}
              label="Network Usage"
              usage={systemHealth.resourceUsage.network}
            />
          </Box>
        )}

        {/* Services Details */}
        {systemHealth?.services && systemHealth.services.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Service Status ({systemHealth.services.filter(s => s.status === 'up').length}/{systemHealth.services.length})
              </Typography>
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <LinearProgress
              variant="determinate"
              value={(systemHealth.services.filter(s => s.status === 'up').length / systemHealth.services.length) * 100}
              color="success"
              sx={{ height: 6, borderRadius: 3, mb: 1 }}
            />

            <Collapse in={expanded}>
              <List dense sx={{ mt: 1 }}>
                {systemHealth.services.map((service, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {service.status === 'up' ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : service.status === 'degraded' ? (
                        <WarningIcon color="warning" fontSize="small" />
                      ) : (
                        <ErrorIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {service.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {service.responseTime}ms • {service.uptime.toFixed(1)}% uptime
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}

        {/* Overall Health Summary */}
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemHealthWidget;