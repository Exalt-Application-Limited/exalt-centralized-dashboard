import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Area
} from 'recharts';
import { Card, CardContent, Typography, Box, CircularProgress, Grid, FormControl,
  InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const chartTypes = {
  LINE: 'line',
  BAR: 'bar',
  COMPOSED: 'composed'
};

const SalesMetricsChart = ({ title, endpoint, defaultDateRange = 30, height = 400 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() - defaultDateRange * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [region, setRegion] = useState('all');
  const [productCategory, setProductCategory] = useState('all');
  const [chartType, setChartType] = useState(chartTypes.LINE);

  const fetchSalesMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      let url = `/api/analytics/v1/${endpoint}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      
      if (region !== 'all') {
        url += `&region=${region}`;
      }
      
      if (productCategory !== 'all') {
        url += `&productCategory=${productCategory}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data && response.data.timeSeriesData) {
        setData(response.data.timeSeriesData);
      } else {
        setError('Invalid data format received from the server');
      }
    } catch (err) {
      console.error('Error fetching sales metrics:', err);
      setError(`Failed to fetch data: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesMetrics();
  }, []); // Only fetch on initial render

  const handleFilterApply = () => {
    fetchSalesMetrics();
  };

  const renderChart = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={height}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={height}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (data.length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={height}>
          <Typography>No data available for the selected filters</Typography>
        </Box>
      );
    }

    const metrics = Object.keys(data[0]).filter(key => key !== 'date');

    switch (chartType) {
      case chartTypes.BAR:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Bar 
                  key={metric} 
                  dataKey={metric} 
                  fill={getColor(index)} 
                  name={formatMetricName(metric)} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case chartTypes.COMPOSED:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => {
                if (index === 0) {
                  return (
                    <Area 
                      key={metric} 
                      type="monotone" 
                      dataKey={metric} 
                      fill={`${getColor(index)}40`} 
                      stroke={getColor(index)} 
                      name={formatMetricName(metric)} 
                    />
                  );
                } else if (index === 1) {
                  return (
                    <Bar 
                      key={metric} 
                      dataKey={metric} 
                      fill={getColor(index)} 
                      name={formatMetricName(metric)} 
                    />
                  );
                } else {
                  return (
                    <Line 
                      key={metric} 
                      type="monotone" 
                      dataKey={metric} 
                      stroke={getColor(index)} 
                      name={formatMetricName(metric)} 
                    />
                  );
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case chartTypes.LINE:
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Line 
                  key={metric} 
                  type="monotone" 
                  dataKey={metric} 
                  stroke={getColor(index)} 
                  name={formatMetricName(metric)} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  // Helper function to format metric names for display
  const formatMetricName = (metricKey) => {
    return metricKey
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .replace(/_/g, ' '); // Replace underscores with spaces
  };

  // Helper function to get color for chart elements
  const getColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
    return colors[index % colors.length];
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Select
                value={region}
                label="Region"
                onChange={(e) => setRegion(e.target.value)}
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="north_america">North America</MenuItem>
                <MenuItem value="europe">Europe</MenuItem>
                <MenuItem value="asia">Asia</MenuItem>
                <MenuItem value="south_america">South America</MenuItem>
                <MenuItem value="africa">Africa</MenuItem>
                <MenuItem value="oceania">Oceania</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={productCategory}
                label="Category"
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="home">Home & Kitchen</MenuItem>
                <MenuItem value="beauty">Beauty & Personal Care</MenuItem>
                <MenuItem value="sports">Sports & Outdoors</MenuItem>
                <MenuItem value="toys">Toys & Games</MenuItem>
                <MenuItem value="books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value={chartTypes.LINE}>Line Chart</MenuItem>
                <MenuItem value={chartTypes.BAR}>Bar Chart</MenuItem>
                <MenuItem value={chartTypes.COMPOSED}>Composed Chart</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleFilterApply}
              disabled={loading}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
        
        {renderChart()}
        
        {data.length > 0 && !loading && !error && (
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Showing data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesMetricsChart; 