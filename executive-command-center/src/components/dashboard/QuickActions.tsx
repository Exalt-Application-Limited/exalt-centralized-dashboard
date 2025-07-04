import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  NotificationsActive as NotificationsIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActionItems = [
    {
      label: 'Invite Stakeholder',
      icon: <PeopleIcon color="primary" />,
      action: () => navigate('/stakeholders?action=invite'),
      permission: 'MANAGE_STAKEHOLDERS',
    },
    {
      label: 'View Analytics',
      icon: <AnalyticsIcon color="primary" />,
      action: () => navigate('/analytics'),
      permission: 'VIEW_ANALYTICS',
    },
    {
      label: 'Domain Overview',
      icon: <DashboardIcon color="primary" />,
      action: () => navigate('/domains'),
      permission: 'VIEW_DOMAINS',
    },
    {
      label: 'System Settings',
      icon: <SettingsIcon color="primary" />,
      action: () => navigate('/settings'),
      permission: 'MANAGE_SYSTEM',
    },
    {
      label: 'Security Center',
      icon: <SecurityIcon color="primary" />,
      action: () => navigate('/security'),
      permission: 'MANAGE_SECURITY',
    },
    {
      label: 'Upload Reports',
      icon: <CloudUploadIcon color="primary" />,
      action: () => navigate('/reports/upload'),
      permission: 'UPLOAD_REPORTS',
    },
  ];

  const hasPermission = (permission: string): boolean => {
    // For demo purposes, we'll check user role
    if (!user) return false;
    
    switch (user.accessLevel) {
      case 'BOARD':
        return true; // Board has all permissions
      case 'C_LEVEL':
        return !['UPLOAD_REPORTS'].includes(permission);
      case 'SENIOR_VP':
        return ['VIEW_ANALYTICS', 'VIEW_DOMAINS', 'MANAGE_STAKEHOLDERS'].includes(permission);
      case 'DEPARTMENT_HEAD':
        return ['VIEW_ANALYTICS', 'VIEW_DOMAINS'].includes(permission);
      default:
        return ['VIEW_DOMAINS'].includes(permission);
    }
  };

  const availableActions = quickActionItems.filter(item => hasPermission(item.permission));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => navigate('/stakeholders?action=invite')}
            disabled={!hasPermission('MANAGE_STAKEHOLDERS')}
          >
            Invite New Stakeholder
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List dense>
          {availableActions.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={item.action}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Emergency Actions */}
        {hasPermission('MANAGE_SYSTEM') && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Emergency Actions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<NotificationsIcon />}
              onClick={() => navigate('/emergency')}
              fullWidth
            >
              Emergency Response
            </Button>
          </Box>
        )}

        {/* User Access Level Info */}
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Access Level: {user?.accessLevel?.replace('_', ' ')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;