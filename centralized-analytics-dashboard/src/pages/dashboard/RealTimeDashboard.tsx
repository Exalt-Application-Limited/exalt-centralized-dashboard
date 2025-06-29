import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Badge,
  IconButton,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Paper,
  useTheme,
  Tooltip,
  Fab,
  Collapse,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SignalWifi4Bar as ConnectedIcon,
  SignalWifiOff as DisconnectedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

import { useRealTime } from '../../services/RealTimeContext';
import {
  useRealTimeMetrics,
  useRealTimeAlerts,
  useRealTimeEvents,
  useRealTimeKPIs,
  useRealTimeDomainStatus,
} from '../../services/realTimeHooks';
import { getRealTimeSimulator } from '../../services/RealTimeSimulator';
import { RealTimeChart } from '../../components/charts';
import { AdvancedMetricsWidget } from '../../components/charts';

const RealTimeDashboard: React.FC = () => {
  const theme = useTheme();
  const {
    isConnected,
    connectionStatus,
    messageCount,
    errorCount,
    lastError,
    reconnect,
  } = useRealTime();

  // State
  const [isSimulatorEnabled, setIsSimulatorEnabled] = useState(true);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['kpis', 'metrics']));

  // Real-time data hooks
  const salesMetrics = useRealTimeMetrics({
    channel: 'metrics',
    maxDataPoints: 50,
    enableTrends: true,
  });

  const { alerts, unreadCount, acknowledgeAlert, clearAlerts } = useRealTimeAlerts({
    channels: ['alerts'],
    maxAlerts: 10,
  });

  const { events, latestEvent } = useRealTimeEvents({
    channel: 'events',
    maxEvents: 20,
  });

  const { kpis, isLoading: kpisLoading } = useRealTimeKPIs({
    kpiIds: ['sales_revenue', 'inventory_level', 'delivery_time'],
  });

  const { domainStatuses } = useRealTimeDomainStatus();

  // Initialize simulator
  useEffect(() => {
    const simulator = getRealTimeSimulator();
    
    if (isSimulatorEnabled && !simulator.isActive()) {
      // Subscribe simulator to our real-time context
      simulator.subscribe('kpis', (data) => {
        // The simulator will generate data that our hooks will pick up
      });
      simulator.subscribe('alerts', (data) => {});
      simulator.subscribe('events', (data) => {});
      simulator.subscribe('health', (data) => {});
      simulator.subscribe('metrics', (data) => {});
      
      simulator.start();
    } else if (!isSimulatorEnabled && simulator.isActive()) {
      simulator.stop();
    }

    return () => {
      if (simulator.isActive()) {
        simulator.stop();
      }
    };
  }, [isSimulatorEnabled]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const connectionStatusColor = useMemo(() => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  }, [connectionStatus]);

  // Sample real-time chart configurations
  const realTimeChartConfigs = [
    {
      title: 'Sales Revenue (Real-time)',
      metrics: [
        {
          key: 'sales_revenue',
          label: 'Revenue',
          color: theme.palette.primary.main,
          unit: 'USD',
          type: 'line' as const,
        },
      ],
      config: {
        maxDataPoints: 30,
        updateInterval: 2000,
        autoScroll: true,
        showTrends: true,
        showAlerts: false,
        alertThresholds: {},
      },
    },
    {
      title: 'System Performance',
      metrics: [
        {
          key: 'system_load',
          label: 'System Load',
          color: theme.palette.secondary.main,
          unit: '%',
          type: 'area' as const,
        },
      ],
      config: {
        maxDataPoints: 50,
        updateInterval: 1000,
        autoScroll: true,
        showTrends: true,
        showAlerts: true,
        alertThresholds: {
          system_load: { max: 80 },
        },
      },
    },
  ];

  // Sample metrics widget configuration
  const metricsWidgetConfig = {
    title: 'Key Performance Indicators',
    metrics: [
      {
        key: 'sales_revenue',
        label: 'Revenue',
        unit: 'USD',
        format: 'currency' as const,
        color: theme.palette.primary.main,
        target: 10000,
        showTrend: true,
        showSparkline: true,
      },
      {
        key: 'orders_count',
        label: 'Orders',
        format: 'number' as const,
        color: theme.palette.secondary.main,
        target: 100,
        showTrend: true,
      },
      {
        key: 'conversion_rate',
        label: 'Conversion Rate',
        unit: '%',
        format: 'percentage' as const,
        color: theme.palette.success.main,
        target: 15,
        showTrend: true,
      },
      {
        key: 'customer_satisfaction',
        label: 'Satisfaction',
        unit: '/5',
        format: 'number' as const,
        color: theme.palette.warning.main,
        target: 4.5,
        showTrend: true,
      },
    ],
    comparisonPeriods: [
      { label: 'Previous Hour', value: 'hour', days: 1/24 },
      { label: 'Previous Day', value: 'day', days: 1 },
      { label: 'Previous Week', value: 'week', days: 7 },
    ],
    chartTypes: ['line', 'area', 'bar'] as const,
    showComparison: true,
    showTargets: true,
    showBenchmarks: false,
    allowPeriodChange: true,
  };

  // Mock data for metrics widget (in real app this would come from real-time hooks)
  const mockMetricsData = useMemo(() => {
    const data = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      data.push({
        timestamp: now - (i * 60000), // 1 minute intervals
        sales_revenue: 8000 + Math.random() * 4000,
        orders_count: 80 + Math.random() * 40,
        conversion_rate: 12 + Math.random() * 6,
        customer_satisfaction: 4.0 + Math.random() * 1,
      });
    }
    return data;
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Real-Time Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Connection Status */}
          <Chip
            icon={isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
            label={`${connectionStatus.toUpperCase()}`}
            color={connectionStatusColor as any}
            variant={isConnected ? 'filled' : 'outlined'}
          />
          
          {/* Message Counter */}
          <Chip
            label={`${messageCount} messages`}
            variant="outlined"
          />
          
          {/* Alerts Badge */}
          <Badge badgeContent={unreadCount} color="error">
            <IconButton onClick={() => setAlertsOpen(true)}>
              <NotificationsIcon />
            </IconButton>
          </Badge>
          
          {/* Simulator Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={isSimulatorEnabled}
                onChange={(e) => setIsSimulatorEnabled(e.target.checked)}
              />
            }
            label="Simulator"
          />
          
          {/* Settings */}
          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
          
          {/* Reconnect */}
          <IconButton onClick={reconnect} disabled={isConnected}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Error Alert */}
      {lastError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Connection Error: {lastError}
        </Alert>
      )}

      {/* KPIs Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              <Typography variant="h6">Real-Time KPIs</Typography>
              <Chip label={`${kpis.length} metrics`} size="small" variant="outlined" />
            </Box>
          }
          action={
            <IconButton onClick={() => toggleSection('kpis')}>
              {expandedSections.has('kpis') ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={expandedSections.has('kpis')}>
          <CardContent>
            {kpisLoading ? (
              <Typography>Loading KPIs...</Typography>
            ) : (
              <Grid container spacing={3}>
                {kpis.map((kpi) => (
                  <Grid item xs={12} sm={6} md={4} key={kpi.id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {kpi.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {kpi.status === 'good' && <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                          {kpi.status === 'warning' && <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />}
                          {kpi.status === 'critical' && <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                        </Box>
                      </Box>
                      
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {kpi.value.toLocaleString()}{kpi.unit && ` ${kpi.unit}`}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        sx={{
                          color: kpi.trend.direction === 'up' ? 'success.main' : 
                                kpi.trend.direction === 'down' ? 'error.main' : 'text.secondary',
                        }}
                      >
                        {kpi.trend.direction === 'up' ? '↗' : kpi.trend.direction === 'down' ? '↘' : '→'} 
                        {Math.abs(kpi.trend.changePercent).toFixed(1)}%
                      </Typography>
                      
                      {kpi.target && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Target: {kpi.target.toLocaleString()}{kpi.unit && ` ${kpi.unit}`}
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: 4,
                              bgcolor: 'grey.300',
                              borderRadius: 2,
                              mt: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                                height: '100%',
                                bgcolor: kpi.value >= kpi.target ? 'success.main' : 'warning.main',
                                borderRadius: 2,
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Collapse>
      </Card>

      {/* Metrics Widget */}
      <Box sx={{ mb: 3 }}>
        <AdvancedMetricsWidget
          config={metricsWidgetConfig}
          data={mockMetricsData}
          height={300}
        />
      </Box>

      {/* Real-Time Charts */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" />
              <Typography variant="h6">Real-Time Charts</Typography>
            </Box>
          }
          action={
            <IconButton onClick={() => toggleSection('charts')}>
              {expandedSections.has('charts') ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={expandedSections.has('charts')}>
          <CardContent>
            <Grid container spacing={3}>
              {realTimeChartConfigs.map((chartConfig, index) => (
                <Grid item xs={12} lg={6} key={index}>
                  <RealTimeChart
                    title={chartConfig.title}
                    config={chartConfig.config}
                    height={300}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* Domain Status */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="primary" />
              <Typography variant="h6">Domain Health Status</Typography>
              <Chip label={`${domainStatuses.length} domains`} size="small" variant="outlined" />
            </Box>
          }
          action={
            <IconButton onClick={() => toggleSection('health')}>
              {expandedSections.has('health') ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={expandedSections.has('health')}>
          <CardContent>
            <Grid container spacing={2}>
              {domainStatuses.map((domain) => (
                <Grid item xs={12} md={4} key={domain.domain}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {domain.domain}
                      </Typography>
                      <Chip
                        label={domain.status.toUpperCase()}
                        color={
                          domain.status === 'healthy' ? 'success' :
                          domain.status === 'warning' ? 'warning' :
                          domain.status === 'error' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Response</Typography>
                        <Typography variant="body2">{domain.metrics.responseTime}ms</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Errors</Typography>
                        <Typography variant="body2">{domain.metrics.errorRate}%</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Throughput</Typography>
                        <Typography variant="body2">{domain.metrics.throughput}/s</Typography>
                      </Grid>
                    </Grid>
                    
                    {domain.issues && domain.issues.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {domain.issues.map((issue, index) => (
                          <Chip
                            key={index}
                            label={issue}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Last seen: {new Date(domain.lastSeen).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* Recent Events */}
      <Card elevation={2}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" />
              <Typography variant="h6">Recent Events</Typography>
              {latestEvent && (
                <Chip
                  label="NEW"
                  color="primary"
                  size="small"
                />
              )}
            </Box>
          }
          action={
            <IconButton onClick={() => toggleSection('events')}>
              {expandedSections.has('events') ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={expandedSections.has('events')}>
          <CardContent>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {events.map((event) => (
                <Box key={event.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2">{event.type}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Source: {event.source}
                  </Typography>
                  <Typography variant="body2">
                    {JSON.stringify(event.data, null, 2)}
                  </Typography>
                </Box>
              ))}
              {events.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No events yet
                </Typography>
              )}
            </Box>
          </CardContent>
        </Collapse>
      </Card>

      {/* Alerts Dialog */}
      <Dialog open={alertsOpen} onClose={() => setAlertsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Real-Time Alerts</Typography>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
                sx={{ mb: 2 }}
                action={
                  !alert.acknowledged && (
                    <Button size="small" onClick={() => acknowledgeAlert(alert.id)}>
                      Acknowledge
                    </Button>
                  )
                }
              >
                <Typography variant="subtitle2">{alert.title}</Typography>
                <Typography variant="body2">{alert.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(alert.timestamp).toLocaleString()} • {alert.channel}
                </Typography>
              </Alert>
            ))}
            {alerts.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No alerts
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearAlerts} disabled={alerts.length === 0}>
            Clear All
          </Button>
          <Button onClick={() => setAlertsOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Real-Time Dashboard Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isSimulatorEnabled}
                  onChange={(e) => setIsSimulatorEnabled(e.target.checked)}
                />
              }
              label="Enable Data Simulator"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Generates mock real-time data for development and testing
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Connection Status</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Chip
                icon={isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
                label={connectionStatus.toUpperCase()}
                color={connectionStatusColor as any}
              />
              <Typography variant="body2">
                Messages: {messageCount} | Errors: {errorCount}
              </Typography>
            </Box>
            
            {lastError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {lastError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Access */}
      <Fab
        color="primary"
        aria-label="toggle simulator"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsSimulatorEnabled(!isSimulatorEnabled)}
      >
        {isSimulatorEnabled ? <PauseIcon /> : <PlayIcon />}
      </Fab>
    </Box>
  );
};

export default RealTimeDashboard;
