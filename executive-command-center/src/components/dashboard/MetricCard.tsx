import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  trend?: number;
  loading?: boolean;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  format,
  trend,
  loading = false,
  icon,
  color = 'primary',
  subtitle,
}) => {
  const theme = useTheme();

  const formatValue = (val: number, fmt: string): string => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val.toString();
    }
  };

  const getTrendIcon = (trendValue?: number) => {
    if (!trendValue) return <TrendingFlatIcon fontSize="small" />;
    if (trendValue > 0) return <TrendingUpIcon fontSize="small" />;
    if (trendValue < 0) return <TrendingDownIcon fontSize="small" />;
    return <TrendingFlatIcon fontSize="small" />;
  };

  const getTrendColor = (trendValue?: number) => {
    if (!trendValue) return 'text.secondary';
    if (trendValue > 0) return 'success.main';
    if (trendValue < 0) return 'error.main';
    return 'text.secondary';
  };

  const getCardColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="text" width={80} height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: getCardColor(),
          borderRadius: '12px 12px 0 0',
        },
      }}
    >
      <CardContent sx={{ pt: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: `${getCardColor()}15`,
                color: getCardColor(),
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          component="div"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          {formatValue(value, format)}
        </Typography>

        {/* Trend and Subtitle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {trend !== undefined && (
            <Chip
              icon={getTrendIcon(trend)}
              label={`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: getTrendColor(trend),
                color: getTrendColor(trend),
                '& .MuiChip-icon': {
                  color: getTrendColor(trend),
                },
              }}
            />
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;