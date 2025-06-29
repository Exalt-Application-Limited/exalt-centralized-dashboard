import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  useTheme,
  Tooltip,
  Fade,
  Collapse,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ZoomIn as ZoomInIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  TreeMap,
  Sankey,
} from 'recharts';

export interface DrillDownLevel {
  id: string;
  name: string;
  type: 'category' | 'time' | 'geography' | 'custom';
  data: any[];
  metadata?: {
    description?: string;
    totalRecords?: number;
    dateRange?: { start: string; end: string };
    aggregationType?: string;
  };
}

export interface DrillDownConfig {
  levels: DrillDownLevel[];
  primaryMetric: string;
  secondaryMetrics?: string[];
  allowTableView?: boolean;
  allowExport?: boolean;
  maxDepth?: number;
  chartTypes: ('bar' | 'line' | 'pie' | 'treemap')[];
  colors: string[];
}

export interface DrillDownPath {
  levelId: string;
  itemKey: string;
  itemValue: any;
  itemLabel: string;
}

export interface DrillDownAnalyticsProps {
  title: string;
  config: DrillDownConfig;
  data: any[];
  onDrillDown: (path: DrillDownPath[], level: DrillDownLevel) => Promise<any[]>;
  onExport?: (data: any[], path: DrillDownPath[]) => void;
  height?: number;
  className?: string;
}

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];

const DrillDownAnalytics: React.FC<DrillDownAnalyticsProps> = ({
  title,
  config,
  data: initialData,
  onDrillDown,
  onExport,
  height = 400,
  className,
}) => {
  const theme = useTheme();
  const [currentData, setCurrentData] = useState(initialData);
  const [currentPath, setCurrentPath] = useState<DrillDownPath[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'treemap'>(config.chartTypes[0] || 'bar');
  const [showTable, setShowTable] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Get current level configuration
  const currentLevelConfig = config.levels[currentLevel];

  // Processed data for charts
  const processedData = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      index,
      color: config.colors[index % config.colors.length] || CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [currentData, config.colors]);

  // Handle drill down
  const handleDrillDown = useCallback(async (dataItem: any, itemKey: string) => {
    if (currentLevel >= (config.maxDepth || config.levels.length - 1)) {
      return; // Max depth reached
    }

    setLoading(true);
    try {
      const newPathItem: DrillDownPath = {
        levelId: currentLevelConfig.id,
        itemKey,
        itemValue: dataItem[itemKey],
        itemLabel: dataItem[itemKey]?.toString() || 'Unknown',
      };

      const newPath = [...currentPath, newPathItem];
      const nextLevel = config.levels[currentLevel + 1];
      
      if (nextLevel) {
        const newData = await onDrillDown(newPath, nextLevel);
        setCurrentData(newData);
        setCurrentPath(newPath);
        setCurrentLevel(currentLevel + 1);
      }
    } catch (error) {
      console.error('Error during drill down:', error);
    } finally {
      setLoading(false);
    }
  }, [currentLevel, currentPath, currentLevelConfig, config, onDrillDown]);

  // Handle drill up (go back)
  const handleDrillUp = useCallback(async (targetLevel: number) => {
    if (targetLevel < 0) return;

    setLoading(true);
    try {
      const targetPath = currentPath.slice(0, targetLevel);
      const targetLevelConfig = config.levels[targetLevel];
      
      if (targetLevel === 0) {
        // Return to root
        setCurrentData(initialData);
        setCurrentPath([]);
        setCurrentLevel(0);
      } else {
        // Drill down to specific level
        const newData = await onDrillDown(targetPath, targetLevelConfig);
        setCurrentData(newData);
        setCurrentPath(targetPath);
        setCurrentLevel(targetLevel);
      }
    } catch (error) {
      console.error('Error during drill up:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPath, config.levels, initialData, onDrillDown]);

  // Handle chart click
  const handleChartClick = (data: any, index: number) => {
    const dataItem = processedData[index];
    if (!dataItem) return;

    // Determine the key to drill down on based on chart type and level
    const drillDownKey = getDrillDownKey(dataItem);
    if (drillDownKey) {
      handleDrillDown(dataItem, drillDownKey);
    }
  };

  // Get drill down key based on current level
  const getDrillDownKey = (dataItem: any): string | null => {
    // This would be configured based on your data structure
    // For now, using a simple heuristic
    const possibleKeys = ['category', 'subcategory', 'product', 'region', 'date', 'id'];
    for (const key of possibleKeys) {
      if (dataItem[key] !== undefined) {
        return key;
      }
    }
    return Object.keys(dataItem)[0]; // Fallback to first key
  };

  // Show item details
  const showItemDetails = (item: any) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  // Export current data
  const handleExport = () => {
    onExport?.(currentData, currentPath);
  };

  // Toggle table row expansion
  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Render chart based on current type
  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography>Loading data...</Typography>
        </Box>
      );
    }

    if (!processedData || processedData.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      );
    }

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getDrillDownKey(processedData[0]) || 'name'} />
              <YAxis />
              <RechartsTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card elevation={8} sx={{ p: 2 }}>
                        <Typography variant="subtitle2">{label}</Typography>
                        {payload.map((entry: any, index: number) => (
                          <Typography key={index} variant="body2">
                            {entry.name}: {entry.value?.toLocaleString()}
                          </Typography>
                        ))}
                        <Button size="small" onClick={() => handleChartClick(payload[0].payload, payload[0].payload.index)}>
                          Drill Down
                        </Button>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey={config.primaryMetric}
                fill={theme.palette.primary.main}
                cursor="pointer"
              />
              {config.secondaryMetrics?.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={config.colors[index + 1] || CHART_COLORS[(index + 1) % CHART_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getDrillDownKey(processedData[0]) || 'name'} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={config.primaryMetric}
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4, cursor: 'pointer' }}
                activeDot={{ r: 6 }}
              />
              {config.secondaryMetrics?.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={config.colors[index + 1] || CHART_COLORS[(index + 1) % CHART_COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={Math.min(height * 0.3, 120)}
                fill="#8884d8"
                dataKey={config.primaryMetric}
                onClick={handleChartClick}
                cursor="pointer"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value: any) => [value?.toLocaleString(), config.primaryMetric]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <TreeMap
              data={processedData}
              dataKey={config.primaryMetric}
              aspectRatio={4/3}
              stroke="#fff"
              fill={theme.palette.primary.main}
              content={({ root, depth, x, y, width, height, index, name, value }) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                      fill: config.colors[index % config.colors.length] || CHART_COLORS[index % CHART_COLORS.length],
                      stroke: '#fff',
                      strokeWidth: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleChartClick(root, index)}
                  />
                  {width > 60 && height > 30 && (
                    <>
                      <text x={x + 4} y={y + 18} fill="#fff" fontSize="12" fontWeight="bold">
                        {name}
                      </text>
                      <text x={x + 4} y={y + 32} fill="#fff" fontSize="10">
                        {value?.toLocaleString()}
                      </text>
                    </>
                  )}
                </g>
              )}
            />
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
          <Box>
            <Typography variant="h6">{title}</Typography>
            
            {/* Breadcrumb Navigation */}
            <Breadcrumbs aria-label="drill-down-navigation" sx={{ mt: 1 }}>
              <Link
                color="inherit"
                href="#"
                onClick={(e) => { e.preventDefault(); handleDrillUp(0); }}
                sx={{ cursor: 'pointer' }}
              >
                All Data
              </Link>
              {currentPath.map((pathItem, index) => (
                <Link
                  key={pathItem.levelId}
                  color={index === currentPath.length - 1 ? 'text.primary' : 'inherit'}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleDrillUp(index + 1); }}
                  sx={{ cursor: 'pointer' }}
                >
                  {pathItem.itemLabel}
                </Link>
              ))}
            </Breadcrumbs>

            {/* Current Level Info */}
            {currentLevelConfig && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={`Level: ${currentLevelConfig.name}`}
                  size="small"
                  variant="outlined"
                />
                {currentLevelConfig.metadata?.totalRecords && (
                  <Chip
                    label={`${currentLevelConfig.metadata.totalRecords} records`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Chart Type Toggles */}
            {config.chartTypes.map((type) => (
              <Tooltip key={type} title={`Switch to ${type} chart`}>
                <IconButton
                  onClick={() => setChartType(type)}
                  color={chartType === type ? 'primary' : 'default'}
                  size="small"
                >
                  {type === 'bar' && <BarChartIcon />}
                  {type === 'line' && <TimelineIcon />}
                  {type === 'pie' && <PieChartIcon />}
                  {type === 'treemap' && <TableChartIcon />}
                </IconButton>
              </Tooltip>
            ))}

            {/* Table View Toggle */}
            {config.allowTableView && (
              <Tooltip title="Toggle table view">
                <IconButton
                  onClick={() => setShowTable(!showTable)}
                  color={showTable ? 'primary' : 'default'}
                  size="small"
                >
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Export Button */}
            {config.allowExport && onExport && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleExport}
                startIcon={<FilterIcon />}
              >
                Export
              </Button>
            )}

            {/* Back Button */}
            {currentPath.length > 0 && (
              <Tooltip title="Go back">
                <IconButton
                  onClick={() => handleDrillUp(currentLevel - 1)}
                  size="small"
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
      />

      <Divider />

      <CardContent sx={{ p: 0 }}>
        {/* Chart View */}
        <Collapse in={!showTable}>
          <Box sx={{ p: 2 }}>
            {renderChart()}
          </Box>
        </Collapse>

        {/* Table View */}
        <Collapse in={showTable}>
          <TableContainer component={Paper} sx={{ maxHeight: height }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">{config.primaryMetric}</TableCell>
                  {config.secondaryMetrics?.map((metric) => (
                    <TableCell key={metric} align="right">{metric}</TableCell>
                  ))}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedData.map((row, index) => {
                  const rowId = row.id || row.name || index.toString();
                  const drillDownKey = getDrillDownKey(row);
                  return (
                    <React.Fragment key={rowId}>
                      <TableRow hover>
                        <TableCell component="th" scope="row">
                          {row[drillDownKey || 'name']}
                        </TableCell>
                        <TableCell align="right">
                          {row[config.primaryMetric]?.toLocaleString()}
                        </TableCell>
                        {config.secondaryMetrics?.map((metric) => (
                          <TableCell key={metric} align="right">
                            {row[metric]?.toLocaleString()}
                          </TableCell>
                        ))}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {currentLevel < (config.maxDepth || config.levels.length - 1) && (
                              <IconButton
                                size="small"
                                onClick={() => drillDownKey && handleDrillDown(row, drillDownKey)}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => showItemDetails(row)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </CardContent>

      {/* Item Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(selectedItem).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <Typography variant="body2" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DrillDownAnalytics;
