// Test utilities for React Testing Library with Redux and Material-UI
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

// Import your store reducers
import store from '../store';

// Create a theme for testing
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Mock store for testing
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // Add your reducers here when they're created
      // For now, we'll use a simple identity reducer
      app: (state = {}, action) => state,
    },
    preloadedState: initialState,
  });
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  store?: any;
  route?: string;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // Set up the initial route
  window.history.pushState({}, 'Test page', route);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Mock data generators
export const mockKPIData = {
  totalRevenue: 1250000,
  totalOrders: 3450,
  avgOrderValue: 362.32,
  conversionRate: 3.2,
  activeUsers: 12850,
  inventoryTurnover: 8.5,
  previousRevenue: 1180000,
  previousOrders: 3200,
  previousAOV: 368.75,
  previousConversion: 2.9,
  previousUsers: 11200,
  previousTurnover: 7.8,
};

export const mockChartData = [
  { name: 'Jan', value: 4000, sales: 2400, orders: 240 },
  { name: 'Feb', value: 3000, sales: 1398, orders: 221 },
  { name: 'Mar', value: 2000, sales: 9800, orders: 229 },
  { name: 'Apr', value: 2780, sales: 3908, orders: 200 },
  { name: 'May', value: 1890, sales: 4800, orders: 218 },
  { name: 'Jun', value: 2390, sales: 3800, orders: 250 },
];

export const mockInventoryData = [
  { id: 1, name: 'Product A', stock: 150, reorderLevel: 50, status: 'In Stock' },
  { id: 2, name: 'Product B', stock: 25, reorderLevel: 30, status: 'Low Stock' },
  { id: 3, name: 'Product C', stock: 0, reorderLevel: 20, status: 'Out of Stock' },
];

// Mock WebSocket for real-time testing
export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    if (this.readyState === MockWebSocket.OPEN) {
      // Echo back for testing
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { data }));
        }
      }, 50);
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Helper to wait for async operations
export const waitForAsync = (ms: number = 0) => 
  new Promise((resolve) => setTimeout(resolve, ms));

// Custom matchers can be added here
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received != null;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
});
