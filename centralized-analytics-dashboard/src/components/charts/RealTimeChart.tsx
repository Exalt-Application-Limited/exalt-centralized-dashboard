import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Badge,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  SignalWifi4Bar as ConnectedIcon,
  SignalWifiOff as DisconnectedIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from 'recharts';

export interface RealTimeDataPoint {
  timestamp: number;
  [key: string]: any;
}

export interface RealTimeConfig {
  maxDataPoints: number;
  updateInterval: number; // in milliseconds
  autoScroll: boolean;
  showTrends: boolean;
  showAlerts: boolean;
  alertThresholds: { [key: string]: { min?: number; max?: number } };
  metrics: {
    key: string;
    label: string;
    color: string;
    unit?: string;
    type: 'line' | 'area';
  }[];
}

export interface RealTimeChartProps {
  title: string;
  config: RealTimeConfig;
  dataSource?: () => Promise<Partial<RealTimeDataPoint>>;
  websocketUrl?: string;
  onAlert?: (metric: string, value: number, threshold: { min?: number; max?: number }) => void;
  height?: number;
  className?: string;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  title,
  config,
  dataSource,
  websocketUrl,
  onAlert,
  height = 400,
  className,
}) => {
  const theme = useTheme();
  const [data, setData] = useState<RealTimeDataPoint[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{ metric: string; value: number; type: 'high' | 'low'; timestamp: number }[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [latestValues, setLatestValues] = useState<{ [key: string]: number }>({});

  const websocketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!websocketUrl) return;

    setConnectionStatus('connecting');
    setError(null);

    try {
      websocketRef.current = new WebSocket(websocketUrl);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          addDataPoint(newData);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Error parsing incoming data');
        }
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setError('WebSocket connection error');
      };
    } catch (err) {
      setError('Failed to initialize WebSocket connection');
      setConnectionStatus('disconnected');
    }
  }, [websocketUrl]);

  // Add new data point
  const addDataPoint = useCallback((newDataPoint: Partial<RealTimeDataPoint>) => {
    if (!isPlaying) return;

    const timestamp = newDataPoint.timestamp || Date.now();
    const completeDataPoint: RealTimeDataPoint = {
      timestamp,
      ...newDataPoint,
    };

    setData(prevData => {
      const newData = [...prevData, completeDataPoint];
      // Keep only the last maxDataPoints
      if (newData.length > config.maxDataPoints) {
        return newData.slice(-config.maxDataPoints);
      }
      return newData;
    });

    // Update latest values
    const newLatestValues: { [key: string]: number } = {};
    config.metrics.forEach(metric => {
      if (typeof completeDataPoint[metric.key] === 'number') {
        newLatestValues[metric.key] = completeDataPoint[metric.key];
      }
    });
    setLatestValues(prev => ({ ...prev, ...newLatestValues }));

    // Check for alerts
    if (config.showAlerts) {
      config.metrics.forEach(metric => {
        const value = completeDataPoint[metric.key];
        const threshold = config.alertThresholds[metric.key];
        
        if (typeof value === 'number' && threshold) {
          if (threshold.max !== undefined && value > threshold.max) {
            const alert = { metric: metric.key, value, type: 'high' as const, timestamp };
            setAlerts(prev => [...prev.slice(-9), alert]); // Keep last 10 alerts
            onAlert?.(metric.key, value, threshold);
          } else if (threshold.min !== undefined && value < threshold.min) {
            const alert = { metric: metric.key, value, type: 'low' as const, timestamp };
            setAlerts(prev => [...prev.slice(-9), alert]);
            onAlert?.(metric.key, value, threshold);
          }
        }
      });
    }
  }, [isPlaying, config, onAlert]);

  // Simulate real-time data using dataSource
  useEffect(() => {
    if (!dataSource || websocketUrl) return;

    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        try {
          const newData = await dataSource();
          addDataPoint(newData);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching data from source');
        }
      }, config.updateInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dataSource, isPlaying, config.updateInterval, addDataPoint, websocketUrl]);

  // Initialize WebSocket on mount
  useEffect(() => {
    if (websocketUrl) {
      initializeWebSocket();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initializeWebSocket]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const clearData = () => {
    setData([]);
    setAlerts([]);
    setLatestValues({});
  };

  const reconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    setTimeout(() => {
      initializeWebSocket();
    }, 1000);
  };

  // Calculate trends
  const calculateTrend = (metricKey: string): 'up' | 'down' | 'stable' => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-10); // Last 10 data points
    const firstValue = recent[0][metricKey];
    const lastValue = recent[recent.length - 1][metricKey];
    
    if (typeof firstValue === 'number' && typeof lastValue === 'number') {
      const change = ((lastValue - firstValue) / firstValue) * 100;
      if (Math.abs(change) < 1) return 'stable';
      return change > 0 ? 'up' : 'down';
    }
    return 'stable';
  };

  const formatValue = (value: number, unit?: string): string => {
    const formattedValue = value.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
    return unit ? `${formattedValue} ${unit}` : formattedValue;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const timestamp = new Date(label).toLocaleTimeString();
      return (
        <Card elevation={8} sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Time: {timestamp}
          </Typography>
          {payload.map((entry: any, index: number) => {
            const metric = config.metrics.find(m => m.key === entry.dataKey);
            return (
              <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                {metric?.label || entry.dataKey}: {formatValue(entry.value, metric?.unit)}
              </Typography>
            );
          })}
        </Card>
      );
    }
    return null;
  };

  return (
    <Card elevation={3} className={className}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{title}</Typography>
            <Badge
              color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'error'}
              variant="dot"
            >
              {websocketUrl ? (
                connectionStatus === 'connected' ? (
                  <ConnectedIcon color="success" />
                ) : (
                  <DisconnectedIcon color="error" />
                )
              ) : (
                <SpeedIcon color="primary" />
              )}
            </Badge>
            <Chip
              label={`${data.length}/${config.maxDataPoints} points`}
              size="small"
              variant="outlined"
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPlaying}
                  onChange={togglePlayPause}
                  color="primary"
                />
              }
              label={isPlaying ? "Live" : "Paused"}
            />
            {websocketUrl && !isConnected && (
              <Tooltip title="Reconnect">
                <IconButton onClick={reconnect} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            <Button size="small" onClick={clearData} variant="outlined">
              Clear
            </Button>
          </Box>
        }
      />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Alerts Display */}
      {alerts.length > 0 && config.showAlerts && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" fontSize="small" />
            Recent Alerts
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {alerts.slice(-3).map((alert, index) => (
              <Chip
                key={index}
                label={`${alert.metric}: ${alert.value}`}
                color={alert.type === 'high' ? 'error' : 'warning'}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Current Metrics Display */}
      {Object.keys(latestValues).length > 0 && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="subtitle2" gutterBottom>Current Values</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {config.metrics.map(metric => {
              const value = latestValues[metric.key];
              const trend = calculateTrend(metric.key);
              if (value === undefined) return null;

              return (
                <Box key={metric.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: metric.color }}>
                    {formatValue(value, metric.unit)}
                  </Typography>
                  {config.showTrends && trend !== 'stable' && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {trend === 'up' ? (
                        <TrendingUpIcon color="success" fontSize="small" />
                      ) : (
                        <TrendingDownIcon color="error" fontSize="small" />
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <CardContent sx={{ p: 0 }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />

            {/* Render metrics */}
            {config.metrics.map((metric, index) => {
              if (metric.type === 'area') {
                return (
                  <Area
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    stroke={metric.color}
                    fill={metric.color}
                    fillOpacity={0.3}
                    name={metric.label}
                    connectNulls={false}
                    animationDuration={300}
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
                    connectNulls={false}
                    dot={false}
                    animationDuration={300}
                  />
                );
              }
            })}

            {/* Alert threshold lines */}
            {config.showAlerts && Object.entries(config.alertThresholds).map(([metricKey, threshold]) => (
              <React.Fragment key={metricKey}>
                {threshold.max !== undefined && (
                  <ReferenceLine
                    y={threshold.max}
                    stroke={theme.palette.error.main}
                    strokeDasharray="5 5"
                    label={{ value: `${metricKey} Max`, position: 'topLeft' }}
                  />
                )}
                {threshold.min !== undefined && (
                  <ReferenceLine
                    y={threshold.min}
                    stroke={theme.palette.warning.main}
                    strokeDasharray="5 5"
                    label={{ value: `${metricKey} Min`, position: 'bottomLeft' }}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Brush for zooming */}
            {config.autoScroll && data.length > 50 && (
              <Brush
                dataKey="timestamp"
                height={30}
                stroke={theme.palette.primary.main}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RealTimeChart;
