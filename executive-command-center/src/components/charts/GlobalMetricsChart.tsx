import React, { useState, useEffect } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

import { apiService, GlobalPerformance, TimeSeries } from '../../services/apiService';

interface ChartDataPoint {
  timestamp: string;
  date: string;
  revenue: number;
  orders: number;
  users: number;
  performance: number;
}

const GlobalMetricsChart: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const performance = await apiService.getGlobalPerformance(timeRange);
      
      // Transform and merge the data
      const transformedData = performance.revenue.map((revenuePoint, index) => {
        const timestamp = revenuePoint.timestamp;
        const date = format(parseISO(timestamp), 'MMM dd');
        
        return {
          timestamp,
          date,
          revenue: revenuePoint.value,
          orders: performance.orders[index]?.value || 0,
          users: performance.users[index]?.value || 0,
          performance: performance.performance[index]?.value || 0,
        };
      });

      setData(transformedData);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      // Generate mock data for demo
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const isHourly = timeRange === '24h';
    
    const mockData: ChartDataPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = isHourly 
        ? new Date(Date.now() - (i * 60 * 60 * 1000))
        : subDays(new Date(), i);
      
      const timestamp = date.toISOString();
      const dateLabel = isHourly 
        ? format(date, 'HH:mm')
        : format(date, 'MMM dd');

      // Generate realistic mock data with some trends
      const baseRevenue = 50000 + Math.random() * 20000;
      const baseOrders = 150 + Math.random() * 100;
      const baseUsers = 1200 + Math.random() * 500;
      const basePerformance = 95 + Math.random() * 5;

      mockData.push({
        timestamp,
        date: dateLabel,
        revenue: Math.round(baseRevenue),
        orders: Math.round(baseOrders),
        users: Math.round(baseUsers),
        performance: Math.round(basePerformance * 100) / 100,
      });
    }

    setData(mockData);
  };

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string | null,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'area' | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'revenue':
        return [
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value),
          'Revenue'
        ];
      case 'orders':
        return [new Intl.NumberFormat('en-US').format(value), 'Orders'];
      case 'users':
        return [new Intl.NumberFormat('en-US').format(value), 'Active Users'];
      case 'performance':
        return [`${value}%`, 'Performance'];
      default:
        return [value, name];
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {formatTooltipValue(entry.value, entry.dataKey)[1]}: {formatTooltipValue(entry.value, entry.dataKey)[0]}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return <Skeleton variant="rectangular" height={300} />;
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
        >
          <ToggleButton value="24h">24H</ToggleButton>
          <ToggleButton value="7d">7D</ToggleButton>
          <ToggleButton value="30d">30D</ToggleButton>
          <ToggleButton value="90d">90D</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="line">Line</ToggleButton>
          <ToggleButton value="area">Area</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {chartType === 'area' ? (
            <>
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke={theme.customColors.socialCommerce}
                fill={theme.customColors.socialCommerce}
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke={theme.customColors.courier}
                fill={theme.customColors.courier}
                fillOpacity={0.6}
                name="Orders"
              />
            </>
          ) : (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke={theme.customColors.socialCommerce}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke={theme.customColors.courier}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Orders"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="users"
                stroke={theme.customColors.warehousing}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Active Users"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="performance"
                stroke={theme.customColors.infrastructure}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Performance %"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color={theme.customColors.socialCommerce}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(data.reduce((sum, item) => sum + item.revenue, 0))}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Revenue
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color={theme.customColors.courier}>
            {new Intl.NumberFormat('en-US').format(data.reduce((sum, item) => sum + item.orders, 0))}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Orders
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color={theme.customColors.warehousing}>
            {Math.round(data.reduce((sum, item) => sum + item.users, 0) / data.length).toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg Users
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color={theme.customColors.infrastructure}>
            {(data.reduce((sum, item) => sum + item.performance, 0) / data.length).toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg Performance
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalMetricsChart;