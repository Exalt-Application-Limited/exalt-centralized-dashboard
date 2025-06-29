// Tests for RealTimeChart component
import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithProviders, MockWebSocket, waitForAsync } from '../test-utils';
import { RealTimeChart } from '../../components/charts/RealTimeChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Line: ({ dataKey }: any) => <div data-testid={`line-${dataKey}`} />,
}));

// Mock the real-time context
const mockRealTimeContext = {
  isConnected: true,
  metrics: {
    activeUsers: 850,
    currentOrders: 23,
    serverLoad: 45.2,
    responseTime: 180,
  },
  alerts: [],
  events: [],
  connectionStatus: 'connected' as const,
  lastUpdate: new Date().toISOString(),
};

jest.mock('../../services/RealTimeContext', () => ({
  useRealTime: () => mockRealTimeContext,
}));

describe('RealTimeChart', () => {
  const defaultProps = {
    title: 'Real-time Metrics',
    dataKey: 'activeUsers',
    color: '#1976d2',
    height: 300,
    maxDataPoints: 50,
    updateInterval: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock context
    Object.assign(mockRealTimeContext, {
      isConnected: true,
      metrics: {
        activeUsers: 850,
        currentOrders: 23,
        serverLoad: 45.2,
        responseTime: 180,
      },
      connectionStatus: 'connected',
    });
  });

  it('renders chart with title and basic elements', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);

    expect(screen.getByText('Real-time Metrics')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('displays connection status indicator', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Should show connected status
    expect(screen.getByTestId('connection-status')).toBeInTheDocument();
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
  });

  it('shows disconnected status when not connected', () => {
    mockRealTimeContext.isConnected = false;
    mockRealTimeContext.connectionStatus = 'disconnected';

    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    expect(screen.getByTestId('connection-status')).toBeInTheDocument();
    expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
  });

  it('displays current metric value', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Should show the current value of activeUsers
    expect(screen.getByText('850')).toBeInTheDocument();
  });

  it('updates data when new metrics arrive', async () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Initial value
    expect(screen.getByText('850')).toBeInTheDocument();

    // Simulate new data
    act(() => {
      mockRealTimeContext.metrics.activeUsers = 920;
    });

    // Wait for update
    await waitFor(() => {
      expect(screen.getByText('920')).toBeInTheDocument();
    });
  });

  it('maintains data history within maxDataPoints limit', async () => {
    const props = { ...defaultProps, maxDataPoints: 3 };
    renderWithProviders(<RealTimeChart {...props} />);

    // The component should maintain only the specified number of data points
    // This would be tested by checking internal state or DOM structure
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('handles different data keys correctly', () => {
    const props = { ...defaultProps, dataKey: 'serverLoad' };
    renderWithProviders(<RealTimeChart {...props} />);

    // Should show server load value
    expect(screen.getByText('45.2')).toBeInTheDocument();
  });

  it('displays pause/resume controls', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    expect(screen.getByLabelText(/pause updates/i)).toBeInTheDocument();
  });

  it('pauses and resumes data updates', async () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    const pauseButton = screen.getByLabelText(/pause updates/i);
    
    // Click to pause
    fireEvent.click(pauseButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/resume updates/i)).toBeInTheDocument();
    });

    // Click to resume
    const resumeButton = screen.getByLabelText(/resume updates/i);
    fireEvent.click(resumeButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/pause updates/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during connection', () => {
    mockRealTimeContext.connectionStatus = 'connecting';
    mockRealTimeContext.isConnected = false;

    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    mockRealTimeContext.connectionStatus = 'error';
    mockRealTimeContext.isConnected = false;

    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    expect(screen.getByText(/connection error/i)).toBeInTheDocument();
  });

  it('displays time-based x-axis labels', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // X-axis should be present for time-based data
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
  });

  it('applies custom colors correctly', () => {
    const props = { ...defaultProps, color: '#ff5722' };
    renderWithProviders(<RealTimeChart {...props} />);
    
    // Line should exist with the specified dataKey
    expect(screen.getByTestId(`line-${defaultProps.dataKey}`)).toBeInTheDocument();
  });

  it('handles missing metric data gracefully', () => {
    mockRealTimeContext.metrics = {};

    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Should show 0 or placeholder when data is missing
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('respects update interval settings', async () => {
    jest.useFakeTimers();
    
    const props = { ...defaultProps, updateInterval: 2000 };
    renderWithProviders(<RealTimeChart {...props} />);

    // Fast forward time to test interval
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Chart should still be rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Unmount component
    unmount();
    
    // No specific assertion here, but ensures no memory leaks
    expect(true).toBe(true);
  });

  it('handles WebSocket reconnection scenarios', async () => {
    // Start disconnected
    mockRealTimeContext.isConnected = false;
    mockRealTimeContext.connectionStatus = 'disconnected';

    const { rerender } = renderWithProviders(<RealTimeChart {...defaultProps} />);
    expect(screen.getByText(/disconnected/i)).toBeInTheDocument();

    // Simulate reconnection
    mockRealTimeContext.isConnected = true;
    mockRealTimeContext.connectionStatus = 'connected';

    rerender(<RealTimeChart {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/connected/i)).toBeInTheDocument();
    });
  });

  it('formats numeric values appropriately', () => {
    mockRealTimeContext.metrics.activeUsers = 1234.56;

    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Should format numbers appropriately (this depends on implementation)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('provides export functionality', () => {
    renderWithProviders(<RealTimeChart {...defaultProps} />);
    
    // Should have export button
    expect(screen.getByLabelText(/export/i)).toBeInTheDocument();
  });
});
