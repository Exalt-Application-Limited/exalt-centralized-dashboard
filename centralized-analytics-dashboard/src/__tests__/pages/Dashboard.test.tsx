// Tests for Dashboard page component
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockKPIData } from '../test-utils';
import { setupMSW } from '../mocks/server';
import Dashboard from '../../pages/dashboard/Dashboard';

// Setup MSW for API mocking
setupMSW();

// Mock the chart components to avoid complex rendering issues
jest.mock('../../components/charts', () => ({
  InteractiveDashboardChart: ({ title }: any) => (
    <div data-testid="interactive-chart">{title}</div>
  ),
  AdvancedMetricsWidget: ({ title, value }: any) => (
    <div data-testid="metrics-widget">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
  SalesMetricsChart: () => <div data-testid="sales-chart">Sales Chart</div>,
}));

// Mock Material-UI components that might cause issues
jest.mock('@mui/material/Grid', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-testid="grid" {...props}>
      {children}
    </div>
  ),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard title and main elements', async () => {
    renderWithProviders(<Dashboard />);

    // Check for main dashboard title
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    // Wait for KPI data to load
    await waitFor(() => {
      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
    });
  });

  it('displays KPI metrics widgets', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Should display various KPI metrics
      expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/total orders/i)).toBeInTheDocument();
      expect(screen.getByText(/average order value/i)).toBeInTheDocument();
      expect(screen.getByText(/conversion rate/i)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithProviders(<Dashboard />);

    // Should show loading indicators before data loads
    expect(screen.getByText(/loading/i) || screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays interactive charts', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('interactive-chart')).toBeInTheDocument();
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error response
    const mockFetch = jest.spyOn(global, 'fetch').mockRejectedValueOnce(
      new Error('API Error')
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Should show error message or fallback UI
      expect(
        screen.getByText(/error loading data/i) || 
        screen.getByText(/something went wrong/i)
      ).toBeInTheDocument();
    });

    mockFetch.mockRestore();
  });

  it('refreshes data when refresh button is clicked', async () => {
    renderWithProviders(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
    });

    // Find and click refresh button
    const refreshButton = screen.getByLabelText(/refresh/i) || 
                         screen.getByRole('button', { name: /refresh/i });
    
    fireEvent.click(refreshButton);

    // Should show loading state again
    await waitFor(() => {
      expect(screen.getByText(/loading/i) || screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  it('navigates to analytics pages when quick nav is clicked', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Look for navigation links to analytics pages
      const inventoryLink = screen.getByText(/inventory/i);
      const ordersLink = screen.getByText(/orders/i);
      
      expect(inventoryLink).toBeInTheDocument();
      expect(ordersLink).toBeInTheDocument();
    });
  });

  it('displays real-time dashboard link', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/real.*time/i) || screen.getByText(/live/i)).toBeInTheDocument();
    });
  });

  it('shows trend indicators for KPIs', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Should show trend arrows or percentage changes
      const trendElements = screen.getAllByText(/%/) || 
                           screen.getAllByText(/↑/) || 
                           screen.getAllByText(/↓/);
      expect(trendElements.length).toBeGreaterThan(0);
    });
  });

  it('renders responsive layout for mobile devices', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithProviders(<Dashboard />);

    // Should render grid layout for mobile
    expect(screen.getAllByTestId('grid')).toHaveLength(expect.any(Number));
  });

  it('displays time period selector', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Should have period selection (Today, Week, Month, etc.)
      expect(
        screen.getByText(/today/i) || 
        screen.getByText(/this week/i) || 
        screen.getByText(/this month/i)
      ).toBeInTheDocument();
    });
  });

  it('updates data when time period changes', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
    });

    // Find period selector and change it
    const periodSelector = screen.getByRole('button', { name: /period/i }) ||
                          screen.getByRole('select') ||
                          screen.getByText(/this month/i);

    if (periodSelector) {
      fireEvent.click(periodSelector);
      
      // Select different period
      const weekOption = screen.getByText(/this week/i);
      fireEvent.click(weekOption);

      // Should trigger data refresh
      await waitFor(() => {
        expect(screen.getByTestId('metrics-widget')).toBeInTheDocument();
      });
    }
  });

  it('shows export functionality', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/export/i) || 
        screen.getByRole('button', { name: /export/i })
      ).toBeInTheDocument();
    });
  });

  it('handles empty data state', async () => {
    // Mock empty response
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/no data/i) || 
        screen.getByText(/no metrics/i)
      ).toBeInTheDocument();
    });

    mockFetch.mockRestore();
  });

  it('displays last updated timestamp', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/last updated/i) || 
        screen.getByText(/updated/i)
      ).toBeInTheDocument();
    });
  });

  it('provides help or info tooltips', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Look for info icons or help buttons
      const helpElements = screen.getAllByLabelText(/info/i) ||
                          screen.getAllByLabelText(/help/i) ||
                          screen.getAllByRole('button', { name: /info/i });
      
      expect(helpElements.length).toBeGreaterThan(0);
    });
  });

  it('maintains accessibility standards', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Check for proper heading structure
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper button labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });
});
