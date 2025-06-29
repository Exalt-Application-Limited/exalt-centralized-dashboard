import { RealTimeDataPoint } from './RealTimeContext';

export interface SimulatorConfig {
  enabled: boolean;
  intervalMs: number;
  domains: string[];
  metrics: string[];
  volatility: number; // 0-1, how much values can change
  trendProbability: number; // 0-1, probability of trending up/down vs random
}

export class RealTimeDataSimulator {
  private config: SimulatorConfig;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, Set<(data: RealTimeDataPoint) => void>> = new Map();
  private lastValues: Map<string, number> = new Map();
  private trends: Map<string, 'up' | 'down' | 'stable'> = new Map();
  private isRunning = false;

  constructor(config: SimulatorConfig) {
    this.config = config;
    this.initializeBaseValues();
  }

  private initializeBaseValues() {
    // Initialize random base values for each metric
    this.config.metrics.forEach(metric => {
      this.lastValues.set(metric, Math.random() * 1000 + 100);
      this.trends.set(metric, 'stable');
    });
  }

  private generateMetricValue(metric: string): number {
    const lastValue = this.lastValues.get(metric) || 100;
    const trend = this.trends.get(metric) || 'stable';
    
    // Decide if trend should change
    if (Math.random() < 0.1) { // 10% chance to change trend
      const newTrend = Math.random() < 0.33 ? 'up' : Math.random() < 0.5 ? 'down' : 'stable';
      this.trends.set(metric, newTrend);
    }

    const currentTrend = this.trends.get(metric) || 'stable';
    
    // Generate value based on trend and volatility
    let change = 0;
    if (Math.random() < this.config.trendProbability) {
      // Trending change
      switch (currentTrend) {
        case 'up':
          change = Math.random() * this.config.volatility * 50;
          break;
        case 'down':
          change = -Math.random() * this.config.volatility * 50;
          break;
        case 'stable':
          change = (Math.random() - 0.5) * this.config.volatility * 10;
          break;
      }
    } else {
      // Random change
      change = (Math.random() - 0.5) * this.config.volatility * 100;
    }

    const newValue = Math.max(0, lastValue + change);
    this.lastValues.set(metric, newValue);
    
    return newValue;
  }

  private generateSalesData(): RealTimeDataPoint {
    return {
      timestamp: Date.now(),
      type: 'kpi',
      domain: 'social-commerce',
      data: {
        id: 'sales_revenue',
        name: 'Sales Revenue',
        value: this.generateMetricValue('sales_revenue'),
        unit: 'USD',
        target: 10000,
        status: 'good',
        trend: this.calculateTrend('sales_revenue'),
      },
      metadata: {
        source: 'simulator',
        priority: 'medium',
      },
    };
  }

  private generateInventoryData(): RealTimeDataPoint {
    return {
      timestamp: Date.now(),
      type: 'kpi',
      domain: 'warehousing',
      data: {
        id: 'inventory_level',
        name: 'Inventory Level',
        value: this.generateMetricValue('inventory_level'),
        unit: 'items',
        target: 5000,
        status: 'good',
        trend: this.calculateTrend('inventory_level'),
      },
      metadata: {
        source: 'simulator',
        priority: 'high',
      },
    };
  }

  private generateShippingData(): RealTimeDataPoint {
    return {
      timestamp: Date.now(),
      type: 'kpi',
      domain: 'courier-services',
      data: {
        id: 'delivery_time',
        name: 'Avg Delivery Time',
        value: this.generateMetricValue('delivery_time'),
        unit: 'hours',
        target: 24,
        status: 'warning',
        trend: this.calculateTrend('delivery_time'),
      },
      metadata: {
        source: 'simulator',
        priority: 'medium',
      },
    };
  }

  private generateUserActivity(): RealTimeDataPoint {
    return {
      timestamp: Date.now(),
      type: 'event',
      domain: 'social-commerce',
      data: {
        id: `user_action_${Date.now()}`,
        type: 'user_activity',
        action: this.randomChoice(['login', 'purchase', 'view_product', 'add_to_cart', 'logout']),
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        value: Math.floor(Math.random() * 500),
      },
      metadata: {
        source: 'simulator',
        priority: 'low',
      },
    };
  }

  private generateAlert(): RealTimeDataPoint {
    const alerts = [
      {
        title: 'Low Inventory Alert',
        message: 'Product XYZ is running low on stock',
        severity: 'warning',
        domain: 'warehousing',
      },
      {
        title: 'High Response Time',
        message: 'API response time exceeding threshold',
        severity: 'high',
        domain: 'social-commerce',
      },
      {
        title: 'Delivery Delay',
        message: 'Multiple deliveries are experiencing delays',
        severity: 'medium',
        domain: 'courier-services',
      },
    ];

    const alert = this.randomChoice(alerts);
    
    return {
      timestamp: Date.now(),
      type: 'alert',
      domain: alert.domain,
      data: {
        id: `alert_${Date.now()}`,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
      },
      metadata: {
        source: 'simulator',
        priority: alert.severity as any,
      },
    };
  }

  private generateHealthData(): RealTimeDataPoint {
    const domain = this.randomChoice(this.config.domains);
    const responseTime = 50 + Math.random() * 200;
    const errorRate = Math.random() * 5;
    const throughput = 100 + Math.random() * 900;
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    const issues: string[] = [];
    
    if (responseTime > 200) {
      status = 'warning';
      issues.push('High response time');
    }
    
    if (errorRate > 3) {
      status = 'error';
      issues.push('High error rate');
    }

    return {
      timestamp: Date.now(),
      type: 'health',
      domain,
      data: {
        status,
        metrics: {
          responseTime: Math.round(responseTime),
          errorRate: Math.round(errorRate * 100) / 100,
          throughput: Math.round(throughput),
        },
        issues: issues.length > 0 ? issues : undefined,
      },
      metadata: {
        source: 'simulator',
        priority: 'medium',
      },
    };
  }

  private calculateTrend(metric: string) {
    const currentValue = this.lastValues.get(metric) || 0;
    const trend = this.trends.get(metric) || 'stable';
    
    let changePercent = 0;
    if (trend === 'up') {
      changePercent = 1 + Math.random() * 5;
    } else if (trend === 'down') {
      changePercent = -(1 + Math.random() * 5);
    } else {
      changePercent = (Math.random() - 0.5) * 2;
    }

    return {
      direction: trend,
      changePercent,
      changeAbsolute: (currentValue * changePercent) / 100,
    };
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private notifySubscribers(channel: string, data: RealTimeDataPoint) {
    const callbacks = this.callbacks.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in simulator callback for channel ${channel}:`, error);
        }
      });
    }
  }

  public subscribe(channel: string, callback: (data: RealTimeDataPoint) => void): () => void {
    if (!this.callbacks.has(channel)) {
      this.callbacks.set(channel, new Set());
    }
    
    this.callbacks.get(channel)!.add(callback);
    
    return () => {
      const callbacks = this.callbacks.get(channel);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.callbacks.delete(channel);
        }
      }
    };
  }

  public start() {
    if (!this.config.enabled || this.isRunning) return;
    
    this.isRunning = true;
    console.log('[Simulator] Starting real-time data simulation');

    // Generate KPIs
    const kpiInterval = setInterval(() => {
      this.notifySubscribers('kpis', this.generateSalesData());
      this.notifySubscribers('kpis', this.generateInventoryData());
      this.notifySubscribers('kpis', this.generateShippingData());
    }, this.config.intervalMs);
    this.intervals.set('kpis', kpiInterval);

    // Generate events
    const eventInterval = setInterval(() => {
      this.notifySubscribers('events', this.generateUserActivity());
    }, this.config.intervalMs * 2);
    this.intervals.set('events', eventInterval);

    // Generate alerts (less frequent)
    const alertInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        this.notifySubscribers('alerts', this.generateAlert());
      }
    }, this.config.intervalMs * 5);
    this.intervals.set('alerts', alertInterval);

    // Generate health data
    const healthInterval = setInterval(() => {
      this.config.domains.forEach(() => {
        this.notifySubscribers('health', this.generateHealthData());
      });
    }, this.config.intervalMs * 3);
    this.intervals.set('health', healthInterval);

    // Generate metrics for charts
    const metricsInterval = setInterval(() => {
      this.config.metrics.forEach(metric => {
        const data: RealTimeDataPoint = {
          timestamp: Date.now(),
          type: 'data',
          domain: 'dashboard',
          data: {
            metric,
            value: this.generateMetricValue(metric),
          },
          metadata: {
            source: 'simulator',
            priority: 'low',
          },
        };
        this.notifySubscribers('metrics', data);
      });
    }, this.config.intervalMs);
    this.intervals.set('metrics', metricsInterval);
  }

  public stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    console.log('[Simulator] Stopping real-time data simulation');
    
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public updateConfig(newConfig: Partial<SimulatorConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Default simulator configuration
export const DEFAULT_SIMULATOR_CONFIG: SimulatorConfig = {
  enabled: process.env.NODE_ENV === 'development',
  intervalMs: 2000, // 2 seconds
  domains: ['social-commerce', 'warehousing', 'courier-services'],
  metrics: [
    'sales_revenue',
    'orders_count',
    'inventory_level',
    'delivery_time',
    'user_activity',
    'conversion_rate',
    'customer_satisfaction',
    'system_load',
  ],
  volatility: 0.1, // 10% volatility
  trendProbability: 0.7, // 70% chance of following trend vs random
};

// Singleton instance
let simulatorInstance: RealTimeDataSimulator | null = null;

export const getRealTimeSimulator = (config?: SimulatorConfig): RealTimeDataSimulator => {
  if (!simulatorInstance) {
    simulatorInstance = new RealTimeDataSimulator(config || DEFAULT_SIMULATOR_CONFIG);
  }
  return simulatorInstance;
};
