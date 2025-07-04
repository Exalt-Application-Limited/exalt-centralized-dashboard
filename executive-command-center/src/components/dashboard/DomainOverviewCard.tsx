import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DomainOverviewCardProps {
  title: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  performance: number;
  users: number;
  revenue?: number;
  color: 'socialCommerce' | 'warehousing' | 'courier' | 'haulage' | 'infrastructure';
  href: string;
}

const DomainOverviewCard: React.FC<DomainOverviewCardProps> = ({
  title,
  status,
  uptime,
  performance,
  users,
  revenue,
  color,
  href,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'critical':
        return <ErrorIcon fontSize="small" />;
      default:
        return <CheckCircleIcon fontSize="small" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'success';
    }
  };

  const getDomainColor = () => {
    return theme.customColors[color];
  };

  const handleCardClick = () => {
    navigate(href);
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: getDomainColor(),
          borderRadius: '12px 12px 0 0',
        },
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
        <CardContent sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              {title}
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={status}
              size="small"
              color={getStatusColor() as any}
              variant="outlined"
            />
          </Box>

          {/* Metrics */}
          <Box sx={{ flex: 1 }}>
            {/* Uptime */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Uptime
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {uptime.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uptime}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${getDomainColor()}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getDomainColor(),
                  },
                }}
              />
            </Box>

            {/* Performance */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Performance
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {performance.toFixed(0)}ms
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, 100 - (performance / 10))}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${getDomainColor()}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getDomainColor(),
                  },
                }}
              />
            </Box>

            {/* Users */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {new Intl.NumberFormat('en-US').format(users)} users
              </Typography>
            </Box>

            {/* Revenue (if applicable) */}
            {revenue !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(revenue)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Status Summary */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Click to view detailed analytics
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DomainOverviewCard;