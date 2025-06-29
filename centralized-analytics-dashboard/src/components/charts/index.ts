// Interactive Chart Library - Main exports
export { default as InteractiveDashboardChart } from './InteractiveDashboardChart';
export type { 
  ChartDataPoint, 
  ChartConfig, 
  InteractiveDashboardChartProps 
} from './InteractiveDashboardChart';

export { default as RealTimeChart } from './RealTimeChart';
export type { 
  RealTimeDataPoint, 
  RealTimeConfig, 
  RealTimeChartProps 
} from './RealTimeChart';

export { default as DrillDownAnalytics } from './DrillDownAnalytics';
export type { 
  DrillDownLevel, 
  DrillDownConfig, 
  DrillDownPath, 
  DrillDownAnalyticsProps 
} from './DrillDownAnalytics';

export { default as AdvancedMetricsWidget } from './AdvancedMetricsWidget';
export type { 
  MetricConfig, 
  ComparisonPeriod, 
  AdvancedMetricsConfig, 
  MetricDataPoint, 
  AdvancedMetricsWidgetProps 
} from './AdvancedMetricsWidget';

// Re-export commonly used types for convenience
export type ChartType = 'line' | 'bar' | 'area' | 'composed' | 'scatter' | 'pie' | 'radar';
export type TrendDirection = 'up' | 'down' | 'stable';

// Chart color palettes
export const CHART_COLORS = {
  primary: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'],
  success: ['#00C49F', '#00A83F', '#008C2F', '#00701F', '#00540F'],
  warning: ['#FFBB28', '#FF9F00', '#FF8300', '#FF6700', '#FF4B00'],
  error: ['#FF8042', '#FF6B2B', '#FF5614', '#FF4100', '#CC3400'],
  info: ['#0088FE', '#0070E7', '#0058D0', '#0040B9', '#0028A2'],
  neutral: ['#CACFD2', '#B0B6BA', '#969CA2', '#7C828A', '#626872'],
};

// Common chart configurations
export const COMMON_CONFIGS = {
  // Standard line chart config
  lineChart: {
    type: 'line' as const,
    enableBrush: true,
    enableZoom: true,
    enableAnimations: true,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 400,
  },
  
  // Real-time chart config
  realTimeChart: {
    maxDataPoints: 100,
    updateInterval: 1000,
    autoScroll: true,
    showTrends: true,
    showAlerts: true,
  },
  
  // Metrics widget config
  metricsWidget: {
    comparisonPeriods: [
      { label: 'Previous Day', value: 'day', days: 1 },
      { label: 'Previous Week', value: 'week', days: 7 },
      { label: 'Previous Month', value: 'month', days: 30 },
      { label: 'Previous Quarter', value: 'quarter', days: 90 },
    ],
    chartTypes: ['line', 'area', 'bar', 'composed'] as const,
    showComparison: true,
    showTargets: true,
    showBenchmarks: false,
    allowPeriodChange: true,
  },
};

// Utility functions
export const formatters = {
  currency: (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value),
  
  percentage: (value: number) => `${value.toFixed(1)}%`,
  
  number: (value: number) => value.toLocaleString(),
  
  compactNumber: (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  },
};

// Chart theme provider
export const getChartTheme = (muiTheme: any) => ({
  background: muiTheme.palette.background.paper,
  text: muiTheme.palette.text.primary,
  grid: muiTheme.palette.divider,
  axis: muiTheme.palette.text.secondary,
  tooltip: {
    background: muiTheme.palette.background.paper,
    border: muiTheme.palette.divider,
    shadow: muiTheme.shadows[8],
  },
});
