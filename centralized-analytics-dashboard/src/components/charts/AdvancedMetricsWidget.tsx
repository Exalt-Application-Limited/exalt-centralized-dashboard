import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  useTheme,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  CompareArrows as CompareArrowsIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Brush,
} from 'recharts';

export interface MetricConfig {
  key: string;
  label: string;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
  color: string;
  target?: number;
  benchmark?: number;
  showTrend?: boolean;
  showSparkline?: boolean;
}

export interface ComparisonPeriod {
  label: string;
  value: string;
  days: number;
}

export interface AdvancedMetricsConfig {
  title: string;
  metrics: MetricConfig[];
  comparisonPeriods: ComparisonPeriod[];
  chartTypes: ('line' | 'area' | 'bar' | 'composed' | 'pie' | 'radial')[];
  showComparison: boolean;
  showTargets: boolean;
  showBenchmarks: boolean;
  allowPeriodChange: boolean;
  refreshInterval?: number;
}

export interface MetricDataPoint {
  timestamp: string | number;
  [key: string]: any;
}

export interface AdvancedMetricsWidgetProps {
  config: AdvancedMetricsConfig;
  data: MetricDataPoint[];
  previousPeriodData?: MetricDataPoint[];
  loading?: boolean;
  onPeriodChange?: (period: ComparisonPeriod) => void;
  onMetricClick?: (metric: MetricConfig, value: number) => void;
  height?: number;
  className?: string;
}

const AdvancedMetricsWidget: React.FC<AdvancedMetricsWidgetProps> = ({
  config,
  data,
  previousPeriodData,
  loading = false,
  onPeriodChange,
  onMetricClick,
  height = 400,
  className,
}) => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<ComparisonPeriod>(config.comparisonPeriods[0]);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'composed' | 'pie' | 'radial'>(config.chartTypes[0]);
  const [showComparison, setShowComparison] = useState(config.showComparison);
  const [showTargets, setShowTargets] = useState(config.showTargets);

  // Calculate current metrics
  const currentMetrics = useMemo(() => {
    if (!data || data.length === 0) return {};

    const latest = data[data.length - 1];
    const metrics: { [key: string]: any } = {};

    config.metrics.forEach(metricConfig => {
      const currentValue = latest[metricConfig.key];
      let previousValue = null;
      let trend: 'up' | 'down' | 'flat' = 'flat';
      let changePercent = 0;
      let changeAbsolute = 0;

      // Calculate trend from historical data
      if (data.length > 1) {
        const previous = data[data.length - 2];
        previousValue = previous[metricConfig.key];
        
        if (typeof currentValue === 'number' && typeof previousValue === 'number' && previousValue !== 0) {
          changeAbsolute = currentValue - previousValue;
          changePercent = (changeAbsolute / previousValue) * 100;
          trend = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'flat';
        }
      }

      // Calculate comparison with previous period
      let comparisonValue = null;
      let comparisonChange = 0;
      let comparisonChangePercent = 0;

      if (previousPeriodData && previousPeriodData.length > 0) {
        const previousPeriodLatest = previousPeriodData[previousPeriodData.length - 1];
        comparisonValue = previousPeriodLatest[metricConfig.key];
        
        if (typeof currentValue === 'number' && typeof comparisonValue === 'number' && comparisonValue !== 0) {
          comparisonChange = currentValue - comparisonValue;
          comparisonChangePercent = (comparisonChange / comparisonValue) * 100;
        }
      }

      // Check target achievement
      let targetAchievement = null;
      if (metricConfig.target && typeof currentValue === 'number') {
        targetAchievement = (currentValue / metricConfig.target) * 100;
      }

      // Check benchmark comparison
      let benchmarkComparison = null;
      if (metricConfig.benchmark && typeof currentValue === 'number') {
        benchmarkComparison = currentValue - metricConfig.benchmark;
      }

      metrics[metricConfig.key] = {
        current: currentValue,
        previous: previousValue,
        trend,
        changePercent,
        changeAbsolute,
        comparisonValue,
        comparisonChange,
        comparisonChangePercent,
        targetAchievement,
        benchmarkComparison,
        config: metricConfig,
      };
    });

    return metrics;
  }, [data, previousPeriodData, config.metrics]);

  // Format value based on metric configuration
  const formatValue = (value: number, metricConfig: MetricConfig): string => {
    if (typeof value !== 'number') return 'N/A';

    switch (metricConfig.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Handle period change
  const handlePeriodChange = (event: SelectChangeEvent) => {
    const period = config.comparisonPeriods.find(p => p.value === event.target.value);
    if (period) {
      setSelectedPeriod(period);
      onPeriodChange?.(period);
    }
  };

  // Render metric card
  const renderMetricCard = (metricConfig: MetricConfig) => {
    const metric = currentMetrics[metricConfig.key];
    if (!metric) return null;

    const { current, trend, changePercent, comparisonChangePercent, targetAchievement } = metric;

    return (
      <Card
        key={metricConfig.key}
        elevation={2}
        sx={{ 
          height: '100%', 
          cursor: onMetricClick ? 'pointer' : 'default',
          '&:hover': onMetricClick ? { elevation: 4 } : {},
        }}
        onClick={() => onMetricClick?.(metricConfig, current)}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {metricConfig.label}
            </Typography>
            {trend !== 'flat' && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {trend === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                  }}
                >
                  {Math.abs(changePercent).toFixed(1)}%
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 'bold', color: metricConfig.color, mb: 1 }}>
            {formatValue(current, metricConfig)}
          </Typography>

          {/* Comparison with previous period */}
          {showComparison && comparisonChangePercent !== 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CompareArrowsIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  color: comparisonChangePercent > 0 ? 'success.main' : 'error.main',
                }}
              >
                {comparisonChangePercent > 0 ? '+' : ''}{comparisonChangePercent.toFixed(1)}% vs {selectedPeriod.label}
              </Typography>
            </Box>
          )}

          {/* Target achievement */}
          {showTargets && targetAchievement !== null && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Target: {formatValue(metricConfig.target!, metricConfig)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 4,
                    bgcolor: 'grey.300',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(targetAchievement, 100)}%`,
                      bgcolor: targetAchievement >= 100 ? 'success.main' : 'warning.main',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ ml: 1, minWidth: 'fit-content' }}>
                  {targetAchievement.toFixed(0)}%
                </Typography>
              </Box>
            </Box>
          )}

          {/* Sparkline */}
          {metricConfig.showSparkline && data.length > 1 && (
            <Box sx={{ height: 40, mt: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.slice(-10)}>
                  <Line
                    type="monotone"
                    dataKey={metricConfig.key}
                    stroke={metricConfig.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render main chart
  const renderMainChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      );
    }

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {config.metrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  name={metric.label}
                />
              ))}
              <Brush dataKey="timestamp" height={30} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {config.metrics.map((metric) => (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.3}
                  name={metric.label}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {config.metrics.map((metric, index) => (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  fill={metric.color}
                  name={metric.label}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {config.metrics.map((metric, index) => {
                if (index === 0) {
                  return (
                    <Bar
                      key={metric.key}
                      dataKey={metric.key}
                      fill={metric.color}
                      name={metric.label}
                    />
                  );
                } else {
                  return (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      stroke={metric.color}
                      strokeWidth={2}
                      name={metric.label}
                    />
                  );
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const latestData = data[data.length - 1];
        const pieData = config.metrics.map(metric => ({
          name: metric.label,
          value: latestData[metric.key],
          fill: metric.color,
        }));

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={height * 0.3}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radial':
        const radialData = config.metrics.map((metric, index) => {
          const currentValue = currentMetrics[metric.key]?.current || 0;
          const target = metric.target || 100;
          return {
            name: metric.label,
            value: (currentValue / target) * 100,
            fill: metric.color,
          };
        });

        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                clockWise
                dataKey="value"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <RechartsTooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card elevation={3} className={className}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6">{config.title}</Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Period Selector */}
            {config.allowPeriodChange && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod.value}
                  label="Period"
                  onChange={handlePeriodChange}
                >
                  {config.comparisonPeriods.map((period) => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Chart Type Selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Chart</InputLabel>
              <Select
                value={chartType}
                label="Chart"
                onChange={(e) => setChartType(e.target.value as any)}
              >
                {config.chartTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Settings">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      <Divider />

      <CardContent>
        {/* Metric Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {config.metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.key}>
              {renderMetricCard(metric)}
            </Grid>
          ))}
        </Grid>

        {/* Controls */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                size="small"
              />
            }
            label="Show Comparison"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showTargets}
                onChange={(e) => setShowTargets(e.target.checked)}
                size="small"
              />
            }
            label="Show Targets"
          />
        </Box>

        {/* Main Chart */}
        <Paper elevation={1} sx={{ p: 2 }}>
          {renderMainChart()}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default AdvancedMetricsWidget;
