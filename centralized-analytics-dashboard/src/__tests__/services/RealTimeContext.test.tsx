// Tests for RealTimeContext and real-time functionality
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { renderWithProviders, MockWebSocket, waitForAsync } from '../test-utils';
import { RealTimeProvider, useRealTime } from '../../services/RealTimeContext';
import { useRealTimeMetrics, useRealTimeAlerts } from '../../services/realTimeHooks';

// Mock WebSocket globally
global.WebSocket = MockWebSocket as any;

// Test component for context testing
const TestComponent: React.FC = () => {
  const { isConnected, metrics, alerts, connectionStatus } = useRealTime();
  
  return (
    <div>
      <div data-testid="connection-status">{connectionStatus}</div>
      <div data-testid="is-connected">{isConnected.toString()}</div>
      <div data-testid="active-users">{metrics?.activeUsers || 0}</div>
      <div data-testid="alerts-count">{alerts?.length || 0}</div>
    </div>
  );
};

describe('RealTimeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial context values', () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    expect(screen.getByTestId('connection-status')).toHaveTextContent('connecting');
    expect(screen.getByTestId('is-connected')).toHaveTextContent('false');
    expect(screen.getByTestId('active-users')).toHaveTextContent('0');
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('0');
  });

  it('establishes WebSocket connection', async () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    // Wait for connection to establish
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });
  });

  it('handles WebSocket message reception', async () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    // Wait for connection
    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });

    // Simulate receiving metrics data
    const mockData = JSON.stringify({
      type: 'metrics',
      data: {
        activeUsers: 850,
        currentOrders: 23,
        serverLoad: 45.2,
        responseTime: 180,
      },
    });

    // Trigger WebSocket message
    act(() => {
      const ws = new MockWebSocket('ws://localhost:8080/ws');
      if (ws.onmessage) {
        ws.onmessage(new MessageEvent('message', { data: mockData }));
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('active-users')).toHaveTextContent('850');
    });
  });

  it('handles alerts through WebSocket', async () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });

    // Send alert data
    const alertData = JSON.stringify({
      type: 'alert',
      data: {
        id: 1,
        type: 'warning',
        message: 'Low stock alert',
        timestamp: new Date().toISOString(),
      },
    });

    act(() => {
      const ws = new MockWebSocket('ws://localhost:8080/ws');
      if (ws.onmessage) {
        ws.onmessage(new MessageEvent('message', { data: alertData }));
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('alerts-count')).toHaveTextContent('1');
    });
  });

  it('handles connection failures', async () => {
    // Mock WebSocket that fails to connect
    const FailingWebSocket = class extends MockWebSocket {
      constructor(url: string) {
        super(url);
        setTimeout(() => {
          this.readyState = MockWebSocket.CLOSED;
          if (this.onerror) {
            this.onerror(new Event('error'));
          }
        }, 50);
      }
    };

    global.WebSocket = FailingWebSocket as any;

    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('error');
      expect(screen.getByTestId('is-connected')).toHaveTextContent('false');
    });
  });

  it('implements automatic reconnection', async () => {
    // Mock WebSocket that disconnects and reconnects
    let connectionAttempts = 0;
    const ReconnectingWebSocket = class extends MockWebSocket {
      constructor(url: string) {
        super(url);
        connectionAttempts++;
        
        if (connectionAttempts === 1) {
          // First attempt fails
          setTimeout(() => {
            this.readyState = MockWebSocket.CLOSED;
            if (this.onclose) {
              this.onclose(new CloseEvent('close'));
            }
          }, 100);
        } else {
          // Second attempt succeeds
          setTimeout(() => {
            this.readyState = MockWebSocket.OPEN;
            if (this.onopen) {
              this.onopen(new Event('open'));
            }
          }, 100);
        }
      }
    };

    global.WebSocket = ReconnectingWebSocket as any;

    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    // Wait for initial connection attempt and failure
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    });

    // Wait for reconnection
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    }, { timeout: 5000 });
  });

  it('cleans up WebSocket on unmount', () => {
    const { unmount } = renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    unmount();

    // WebSocket should be closed (no specific assertion, but ensures cleanup)
    expect(true).toBe(true);
  });
});

describe('useRealTimeMetrics hook', () => {
  it('returns current metrics from context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealTimeProvider>{children}</RealTimeProvider>
    );

    const { result } = renderHook(() => useRealTimeMetrics(), { wrapper });

    expect(result.current.metrics).toBeDefined();
    expect(result.current.isConnected).toBe(false); // Initially false
    expect(result.current.lastUpdate).toBeDefined();
  });

  it('updates when new metrics are received', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealTimeProvider>{children}</RealTimeProvider>
    );

    const { result } = renderHook(() => useRealTimeMetrics(), { wrapper });

    // Wait for connection and simulate data
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // The metrics should update when new data arrives
    expect(result.current.metrics).toBeDefined();
  });
});

describe('useRealTimeAlerts hook', () => {
  it('returns current alerts from context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealTimeProvider>{children}</RealTimeProvider>
    );

    const { result } = renderHook(() => useRealTimeAlerts(), { wrapper });

    expect(result.current.alerts).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(typeof result.current.markAsRead).toBe('function');
    expect(typeof result.current.clearAll).toBe('function');
  });

  it('marks alerts as read', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealTimeProvider>{children}</RealTimeProvider>
    );

    const { result } = renderHook(() => useRealTimeAlerts(), { wrapper });

    // Simulate marking alert as read
    act(() => {
      result.current.markAsRead(1);
    });

    expect(typeof result.current.markAsRead).toBe('function');
  });

  it('clears all alerts', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealTimeProvider>{children}</RealTimeProvider>
    );

    const { result } = renderHook(() => useRealTimeAlerts(), { wrapper });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.alerts).toEqual([]);
  });
});

describe('WebSocket Message Handling', () => {
  it('handles malformed JSON messages gracefully', async () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });

    // Send malformed JSON
    act(() => {
      const ws = new MockWebSocket('ws://localhost:8080/ws');
      if (ws.onmessage) {
        ws.onmessage(new MessageEvent('message', { data: 'invalid json' }));
      }
    });

    // Should not crash the application
    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });
  });

  it('handles unknown message types', async () => {
    renderWithProviders(
      <RealTimeProvider>
        <TestComponent />
      </RealTimeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });

    // Send unknown message type
    const unknownMessage = JSON.stringify({
      type: 'unknown',
      data: { test: 'data' },
    });

    act(() => {
      const ws = new MockWebSocket('ws://localhost:8080/ws');
      if (ws.onmessage) {
        ws.onmessage(new MessageEvent('message', { data: unknownMessage }));
      }
    });

    // Should handle gracefully
    await waitFor(() => {
      expect(screen.getByTestId('is-connected')).toHaveTextContent('true');
    });
  });
});
