import { useState, useEffect, useCallback, useRef } from 'react';
import { useRealTime, RealTimeDataPoint } from './RealTimeContext';

// Hook for real-time metrics
export interface UseRealTimeMetricsOptions {
  channel: string;
  maxDataPoints?: number;
  aggregationWindow?: number; // milliseconds
  enableTrends?: boolean;
}

export interface MetricTrend {
  direction: 'up' | 'down' | 'stable';
  changePercent: number;
  changeAbsolute: number;
}

export interface RealTimeMetric {
  timestamp: number;
  value: number;
  metadata?: any;
  trend?: MetricTrend;
}

export const useRealTimeMetrics = (options: UseRealTimeMetricsOptions) => {
  const { subscribe } = useRealTime();
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [latestValue, setLatestValue] = useState<number | null>(null);
  const [trend, setTrend] = useState<MetricTrend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const aggregationBufferRef = useRef<RealTimeMetric[]>([]);
  const lastAggregationRef = useRef<number>(Date.now());

  const calculateTrend = useCallback((current: number, previous: number): MetricTrend => {
    if (previous === 0) {
      return { direction: 'stable', changePercent: 0, changeAbsolute: 0 };
    }

    const changeAbsolute = current - previous;
    const changePercent = (changeAbsolute / previous) * 100;
    const direction = Math.abs(changePercent) < 1 ? 'stable' : changePercent > 0 ? 'up' : 'down';

    return { direction, changePercent, changeAbsolute };
  }, []);

  const processAggregation = useCallback(() => {
    if (aggregationBufferRef.current.length === 0) return;

    // Calculate aggregated value (average)
    const sum = aggregationBufferRef.current.reduce((acc, metric) => acc + metric.value, 0);
    const avgValue = sum / aggregationBufferRef.current.length;
    const timestamp = lastAggregationRef.current;

    const newMetric: RealTimeMetric = {
      timestamp,
      value: avgValue,
      metadata: {
        aggregated: true,
        sampleCount: aggregationBufferRef.current.length,
        samples: aggregationBufferRef.current,
      },
    };

    setMetrics(prev => {
      const updated = [...prev, newMetric];
      
      // Limit data points
      if (options.maxDataPoints && updated.length > options.maxDataPoints) {
        return updated.slice(-options.maxDataPoints);
      }
      
      return updated;
    });

    setLatestValue(avgValue);

    // Calculate trend if enabled
    if (options.enableTrends && metrics.length > 0) {
      const previousValue = metrics[metrics.length - 1].value;
      const newTrend = calculateTrend(avgValue, previousValue);
      setTrend(newTrend);
    }

    // Clear buffer
    aggregationBufferRef.current = [];
    lastAggregationRef.current = Date.now();
  }, [metrics, options, calculateTrend]);

  const handleDataUpdate = useCallback((data: RealTimeDataPoint) => {
    try {
      setError(null);
      setIsLoading(false);

      const value = typeof data.data === 'number' ? data.data : data.data.value;
      if (typeof value !== 'number') {
        throw new Error('Invalid metric value received');
      }

      const metric: RealTimeMetric = {
        timestamp: data.timestamp,
        value,
        metadata: data.metadata,
      };

      if (options.aggregationWindow) {
        // Use aggregation
        aggregationBufferRef.current.push(metric);
        
        if (Date.now() - lastAggregationRef.current >= options.aggregationWindow) {
          processAggregation();
        }
      } else {
        // Direct update
        setMetrics(prev => {
          const updated = [...prev, metric];
          
          if (options.maxDataPoints && updated.length > options.maxDataPoints) {
            return updated.slice(-options.maxDataPoints);
          }
          
          return updated;
        });

        setLatestValue(value);

        // Calculate trend
        if (options.enableTrends && metrics.length > 0) {
          const previousValue = metrics[metrics.length - 1].value;
          const newTrend = calculateTrend(value, previousValue);
          setTrend(newTrend);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error processing metric');
    }
  }, [options, metrics, calculateTrend, processAggregation]);

  useEffect(() => {
    const unsubscribe = subscribe(options.channel, handleDataUpdate);
    return unsubscribe;
  }, [subscribe, options.channel, handleDataUpdate]);

  return {
    metrics,
    latestValue,
    trend,
    isLoading,
    error,
  };
};

// Hook for real-time alerts
export interface UseRealTimeAlertsOptions {
  channels: string[];
  severityFilter?: 'low' | 'medium' | 'high';
  maxAlerts?: number;
}

export interface RealTimeAlert {
  id: string;
  timestamp: number;
  channel: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  data?: any;
  acknowledged?: boolean;
}

export const useRealTimeAlerts = (options: UseRealTimeAlertsOptions) => {
  const { subscribe } = useRealTime();
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleAlertUpdate = useCallback((data: RealTimeDataPoint) => {
    if (data.type !== 'alert') return;

    const alert: RealTimeAlert = {
      id: data.data.id || `alert_${Date.now()}`,
      timestamp: data.timestamp,
      channel: data.domain,
      severity: data.metadata?.priority || 'medium',
      title: data.data.title,
      message: data.data.message,
      data: data.data,
      acknowledged: false,
    };

    // Apply severity filter
    if (options.severityFilter && alert.severity !== options.severityFilter) {
      return;
    }

    setAlerts(prev => {
      const updated = [alert, ...prev];
      
      if (options.maxAlerts && updated.length > options.maxAlerts) {
        return updated.slice(0, options.maxAlerts);
      }
      
      return updated;
    });

    setUnreadCount(prev => prev + 1);
  }, [options]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    const unsubscribeFunctions = options.channels.map(channel => 
      subscribe(channel, handleAlertUpdate)
    );
    
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, options.channels, handleAlertUpdate]);

  return {
    alerts,
    unreadCount,
    acknowledgeAlert,
    clearAlerts,
  };
};

// Hook for real-time events
export interface UseRealTimeEventsOptions {
  channel: string;
  eventTypes?: string[];
  maxEvents?: number;
}

export interface RealTimeEvent {
  id: string;
  timestamp: number;
  type: string;
  source: string;
  data: any;
  metadata?: any;
}

export const useRealTimeEvents = (options: UseRealTimeEventsOptions) => {
  const { subscribe } = useRealTime();
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<RealTimeEvent | null>(null);

  const handleEventUpdate = useCallback((data: RealTimeDataPoint) => {
    if (data.type !== 'event') return;

    // Filter by event type if specified
    if (options.eventTypes && !options.eventTypes.includes(data.data.type)) {
      return;
    }

    const event: RealTimeEvent = {
      id: data.data.id || `event_${Date.now()}`,
      timestamp: data.timestamp,
      type: data.data.type,
      source: data.domain,
      data: data.data,
      metadata: data.metadata,
    };

    setLatestEvent(event);
    setEvents(prev => {
      const updated = [event, ...prev];
      
      if (options.maxEvents && updated.length > options.maxEvents) {
        return updated.slice(0, options.maxEvents);
      }
      
      return updated;
    });
  }, [options]);

  useEffect(() => {
    const unsubscribe = subscribe(options.channel, handleEventUpdate);
    return unsubscribe;
  }, [subscribe, options.channel, handleEventUpdate]);

  return {
    events,
    latestEvent,
  };
};

// Hook for real-time KPIs
export interface UseRealTimeKPIsOptions {
  kpiIds: string[];
  refreshInterval?: number;
}

export interface RealTimeKPI {
  id: string;
  name: string;
  value: number;
  unit?: string;
  target?: number;
  trend: MetricTrend;
  lastUpdated: number;
  status: 'good' | 'warning' | 'critical';
}

export const useRealTimeKPIs = (options: UseRealTimeKPIsOptions) => {
  const { subscribe } = useRealTime();
  const [kpis, setKPIs] = useState<Map<string, RealTimeKPI>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleKPIUpdate = useCallback((data: RealTimeDataPoint) => {
    if (data.type !== 'kpi') return;

    try {
      const kpiData = data.data;
      
      if (!options.kpiIds.includes(kpiData.id)) {
        return;
      }

      const kpi: RealTimeKPI = {
        id: kpiData.id,
        name: kpiData.name,
        value: kpiData.value,
        unit: kpiData.unit,
        target: kpiData.target,
        trend: kpiData.trend || { direction: 'stable', changePercent: 0, changeAbsolute: 0 },
        lastUpdated: data.timestamp,
        status: kpiData.status || 'good',
      };

      setKPIs(prev => new Map(prev.set(kpi.id, kpi)));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing KPI update');
    }
  }, [options.kpiIds]);

  useEffect(() => {
    const unsubscribe = subscribe('kpis', handleKPIUpdate);
    return unsubscribe;
  }, [subscribe, handleKPIUpdate]);

  return {
    kpis: Array.from(kpis.values()),
    kpiMap: kpis,
    isLoading,
    error,
  };
};

// Hook for real-time domain status
export interface DomainStatus {
  domain: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastSeen: number;
  metrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  issues?: string[];
}

export const useRealTimeDomainStatus = () => {
  const { subscribe } = useRealTime();
  const [domainStatuses, setDomainStatuses] = useState<Map<string, DomainStatus>>(new Map());

  const handleStatusUpdate = useCallback((data: RealTimeDataPoint) => {
    if (data.type !== 'health') return;

    const status: DomainStatus = {
      domain: data.domain,
      status: data.data.status,
      lastSeen: data.timestamp,
      metrics: data.data.metrics,
      issues: data.data.issues,
    };

    setDomainStatuses(prev => new Map(prev.set(status.domain, status)));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe('health', handleStatusUpdate);
    return unsubscribe;
  }, [subscribe, handleStatusUpdate]);

  return {
    domainStatuses: Array.from(domainStatuses.values()),
    statusMap: domainStatuses,
  };
};
