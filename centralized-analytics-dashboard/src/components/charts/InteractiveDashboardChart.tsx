import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Fullscreen as FullscreenIcon,
  GetApp as DownloadIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  ReferenceArea,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export interface ChartDataPoint {
  [key: string]: any;
  timestamp?: string | number;
  date?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'composed' | 'scatter' | 'pie' | 'radar';
  title: string;
  dataKey?: string;
  xAxisKey: string;
  yAxisKeys: string[];
  colors: string[];
  enableBrush?: boolean;
  enableZoom?: boolean;
  enableDrillDown?: boolean;
  enableAnimations?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  refreshInterval?: number; // in milliseconds, for real-time updates
}

export interface InteractiveDashboardChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  onDataPointClick?: (dataPoint: ChartDataPoint, index: number) => void;
  onDrillDown?: (dataPoint: ChartDataPoint, metric: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#CACFD2'
];

const InteractiveDashboardChart: React.FC<InteractiveDashboardChartProps> = ({
  data,
  config,
  onDataPointClick,
  onDrillDown,
  onRefresh,
  loading = false,
  error,
  className,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<ChartConfig>(config);
  const [zoomArea, setZoomArea] = useState<{left?: number; right?: number} | null>(null);
  const [selectedDataPoint, setSelectedDataPoint] = useState<ChartDataPoint | null>(null);
  const [highlightedSeries, setHighlightedSeries] = useState<string | null>(null);

  // Auto-refresh functionality
  useEffect(() => {
    if (localConfig.refreshInterval && onRefresh) {
      const interval = setInterval(onRefresh, localConfig.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [localConfig.refreshInterval, onRefresh]);

  // Memoized processed data for performance
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item, index) => ({
      ...item,
      index,
      // Add trend indicators for numeric values
      ...localConfig.yAxisKeys.reduce((acc, key) => {
        const currentValue = item[key];
        const previousValue = index > 0 ? data[index - 1][key] : currentValue;
        if (typeof currentValue === 'number' && typeof previousValue === 'number') {
          acc[`${key}_trend`] = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable';
          acc[`${key}_change`] = currentValue - previousValue;
          acc[`${key}_changePercent`] = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
        }
        return acc;
      }, {} as any),
    }));
  }, [data, localConfig.yAxisKeys]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleConfigChange = (newConfig: Partial<ChartConfig>) => {
    setLocalConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleDataPointClick = useCallback((data: any, index: number) => {
    const dataPoint = processedData[index];
    setSelectedDataPoint(dataPoint);
    onDataPointClick?.(dataPoint, index);
  }, [processedData, onDataPointClick]);

  const handleDrillDown = (dataPoint: ChartDataPoint, metric: string) => {
    onDrillDown?.(dataPoint, metric);
  };

  const exportChart = () => {
    // Implementation for chart export
    const csvContent = [
      [localConfig.xAxisKey, ...localConfig.yAxisKeys].join(','),
      ...processedData.map(item => 
        [item[localConfig.xAxisKey], ...localConfig.yAxisKeys.map(key => item[key])].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${localConfig.title.replace(/\s+/g, '_')}_chart_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card elevation={8} sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            {localConfig.xAxisKey}: {label}
          </Typography>
          <Divider sx={{ my: 1 }} />
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: '50%',
                  mr: 1,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {entry.name}: {entry.value}
              </Typography>
              {entry.payload[`${entry.dataKey}_trend`] && (
                <Box sx={{ ml: 1 }}>
                  {entry.payload[`${entry.dataKey}_trend`] === 'up' ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : entry.payload[`${entry.dataKey}_trend`] === 'down' ? (
                    <TrendingDownIcon color="error" fontSize="small" />
                  ) : null}
                </Box>
              )}
            </Box>
          ))}
        </Card>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: localConfig.height || 400 }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }

    if (!processedData || processedData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: localConfig.height || 400 }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      );
    }

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      onClick: handleDataPointClick,
    };

    const chartContent = (
      <>
        {localConfig.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
        <XAxis 
          dataKey={localConfig.xAxisKey}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        {localConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
        {localConfig.showLegend && (
          <Legend 
            onClick={(e) => setHighlightedSeries(highlightedSeries === e.dataKey ? null : e.dataKey)}
            wrapperStyle={{ cursor: 'pointer' }}
          />
        )}
        
        {/* Render chart elements based on type */}
        {localConfig.yAxisKeys.map((key, index) => {
          const color = localConfig.colors[index] || CHART_COLORS[index % CHART_COLORS.length];
          const isHighlighted = !highlightedSeries || highlightedSeries === key;
          const opacity = isHighlighted ? 1 : 0.3;

          switch (localConfig.type) {
            case 'line':
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={opacity}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                  animationDuration={localConfig.enableAnimations ? 1500 : 0}
                />
              );
            case 'bar':
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  fillOpacity={opacity}
                  animationDuration={localConfig.enableAnimations ? 1500 : 0}
                />
              );
            case 'area':
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={opacity * 0.6}
                  strokeOpacity={opacity}
                  animationDuration={localConfig.enableAnimations ? 1500 : 0}
                />
              );
            default:
              return null;
          }
        })}

        {/* Brush for zooming */}
        {localConfig.enableBrush && (
          <Brush
            dataKey={localConfig.xAxisKey}
            height={30}
            stroke="#8884d8"
          />
        )}

        {/* Reference lines for selected data point */}
        {selectedDataPoint && (
          <>
            <ReferenceLine
              x={selectedDataPoint[localConfig.xAxisKey]}
              stroke="red"
              strokeDasharray="5 5"
            />
            {localConfig.yAxisKeys.map((key) => (
              <ReferenceLine
                key={key}
                y={selectedDataPoint[key]}
                stroke="red"
                strokeDasharray="5 5"
              />
            ))}
          </>
        )}
      </>
    );

    const ChartComponent = {
      line: LineChart,
      bar: BarChart,
      area: AreaChart,
      composed: ComposedChart,
      scatter: ScatterChart,
    }[localConfig.type] || LineChart;

    return (
      <ResponsiveContainer width="100%" height={localConfig.height || 400}>
        <ChartComponent {...commonProps}>
          {chartContent}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card elevation={3} className={className}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h6">{localConfig.title}</Typography>
            {localConfig.refreshInterval && (
              <Chip
                label={`Auto-refresh: ${localConfig.refreshInterval / 1000}s`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <Tooltip title="Refresh Data">
                <IconButton onClick={onRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Chart Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton onClick={() => setFullscreenOpen(true)}>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {renderChart()}
        
        {/* Selected Data Point Details */}
        {selectedDataPoint && (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Data Point
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {localConfig.xAxisKey}: {selectedDataPoint[localConfig.xAxisKey]}
                </Typography>
              </Grid>
              {localConfig.yAxisKeys.map((key) => (
                <Grid item xs={6} key={key}>
                  <Typography variant="body2">
                    {key}: {selectedDataPoint[key]}
                    {localConfig.enableDrillDown && (
                      <Button
                        size="small"
                        onClick={() => handleDrillDown(selectedDataPoint, key)}
                        sx={{ ml: 1 }}
                      >
                        Drill Down
                      </Button>
                    )}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { exportChart(); handleMenuClose(); }}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
        <MenuItem onClick={() => { setSettingsOpen(true); handleMenuClose(); }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Chart Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <FilterIcon sx={{ mr: 1 }} />
          Apply Filters
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chart Configuration</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={localConfig.type}
                  label="Chart Type"
                  onChange={(e) => handleConfigChange({ type: e.target.value as any })}
                >
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="area">Area Chart</MenuItem>
                  <MenuItem value="composed">Composed Chart</MenuItem>
                  <MenuItem value="scatter">Scatter Plot</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chart Height"
                type="number"
                value={localConfig.height || 400}
                onChange={(e) => handleConfigChange({ height: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.showGrid}
                    onChange={(e) => handleConfigChange({ showGrid: e.target.checked })}
                  />
                }
                label="Show Grid"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.showLegend}
                    onChange={(e) => handleConfigChange({ showLegend: e.target.checked })}
                  />
                }
                label="Show Legend"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.enableAnimations}
                    onChange={(e) => handleConfigChange({ enableAnimations: e.target.checked })}
                  />
                }
                label="Enable Animations"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.enableBrush}
                    onChange={(e) => handleConfigChange({ enableBrush: e.target.checked })}
                  />
                }
                label="Enable Brush/Zoom"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fullscreen Dialog */}
      <Dialog
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: '95vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{localConfig.title}</Typography>
            <IconButton onClick={() => setFullscreenOpen(false)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 'calc(90vh - 120px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent {...{
                data: processedData,
                margin: { top: 20, right: 30, left: 20, bottom: 20 },
                onClick: handleDataPointClick,
              }}>
                {/* Same chart content as above but in fullscreen */}
                {localConfig.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
                <XAxis dataKey={localConfig.xAxisKey} />
                <YAxis />
                {localConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
                {localConfig.showLegend && <Legend />}
                {localConfig.yAxisKeys.map((key, index) => {
                  const color = localConfig.colors[index] || CHART_COLORS[index % CHART_COLORS.length];
                  switch (localConfig.type) {
                    case 'line':
                      return <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} />;
                    case 'bar':
                      return <Bar key={key} dataKey={key} fill={color} />;
                    case 'area':
                      return <Area key={key} type="monotone" dataKey={key} stroke={color} fill={color} fillOpacity={0.6} />;
                    default:
                      return null;
                  }
                })}
              </ChartComponent>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InteractiveDashboardChart;
