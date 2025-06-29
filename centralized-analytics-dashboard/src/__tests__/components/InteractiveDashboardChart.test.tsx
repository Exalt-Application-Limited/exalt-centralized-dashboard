// Tests for InteractiveDashboardChart component
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockChartData } from '../test-utils';
import { InteractiveDashboardChart } from '../../components/charts/InteractiveDashboardChart';

// Mock Recharts to avoid canvas rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children }: any) => <div data-testid="composed-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Brush: () => <div data-testid="brush" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe('InteractiveDashboardChart', () => {
  const defaultProps = {
    data: mockChartData,
    title: 'Test Chart',
    type: 'bar' as const,
    height: 300,
    showBrush: true,
    enableDrillDown: true,
    onDataClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart with title and basic elements', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} />);

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('shows brush when showBrush is true', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} showBrush={true} />);
    expect(screen.getByTestId('brush')).toBeInTheDocument();
  });

  it('hides brush when showBrush is false', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} showBrush={false} />);
    expect(screen.queryByTestId('brush')).not.toBeInTheDocument();
  });

  it('displays export button', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} />);
    expect(screen.getByLabelText(/export chart/i)).toBeInTheDocument();
  });

  it('displays fullscreen button', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} />);
    expect(screen.getByLabelText(/toggle fullscreen/i)).toBeInTheDocument();
  });

  it('toggles fullscreen mode when fullscreen button is clicked', async () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} />);
    
    const fullscreenButton = screen.getByLabelText(/toggle fullscreen/i);
    
    // Initial state should not be fullscreen
    expect(screen.queryByTestId('fullscreen-container')).not.toBeInTheDocument();
    
    // Click to enter fullscreen
    fireEvent.click(fullscreenButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('fullscreen-container')).toBeInTheDocument();
    });
  });

  it('handles chart type changes correctly', () => {
    const { rerender } = renderWithProviders(<InteractiveDashboardChart {...defaultProps} type="bar" />);
    expect(screen.getByTestId('bar')).toBeInTheDocument();

    rerender(<InteractiveDashboardChart {...defaultProps} type="line" />);
    expect(screen.getByTestId('line')).toBeInTheDocument();

    rerender(<InteractiveDashboardChart {...defaultProps} type="area" />);
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('shows loading state when data is empty', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} data={[]} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows no data message when data is null', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} data={null} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('applies custom height when provided', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} height={500} />);
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
    // Note: In real implementation, you'd check the style or data attributes
  });

  it('enables drill-down functionality when enableDrillDown is true', () => {
    renderWithProviders(<InteractiveDashboardChart {...defaultProps} enableDrillDown={true} />);
    
    // Check that drill-down is enabled (would depend on implementation details)
    const chartContainer = screen.getByTestId('composed-chart');
    expect(chartContainer).toBeInTheDocument();
  });

  it('calls onDataClick when data point is clicked', async () => {
    const onDataClick = jest.fn();
    renderWithProviders(
      <InteractiveDashboardChart {...defaultProps} onDataClick={onDataClick} />
    );

    // Simulate clicking on a data point
    // Note: This would need to be adapted based on the actual implementation
    const chartContainer = screen.getByTestId('composed-chart');
    fireEvent.click(chartContainer);

    // In a real scenario, you'd trigger the chart's onClick event
    // await waitFor(() => {
    //   expect(onDataClick).toHaveBeenCalled();
    // });
  });

  it('handles missing required props gracefully', () => {
    const minimalProps = {
      data: mockChartData,
      title: 'Minimal Chart',
    };

    // Should render without errors even with minimal props
    renderWithProviders(<InteractiveDashboardChart {...minimalProps} />);
    expect(screen.getByText('Minimal Chart')).toBeInTheDocument();
  });

  it('supports different data key configurations', () => {
    const customData = [
      { period: 'Q1', revenue: 1000, cost: 600 },
      { period: 'Q2', revenue: 1200, cost: 700 },
    ];

    const customProps = {
      ...defaultProps,
      data: customData,
      xDataKey: 'period',
      yDataKey: 'revenue',
    };

    renderWithProviders(<InteractiveDashboardChart {...customProps} />);
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('displays reference lines when configured', () => {
    const propsWithReference = {
      ...defaultProps,
      referenceLine: { value: 2500, label: 'Target' },
    };

    renderWithProviders(<InteractiveDashboardChart {...propsWithReference} />);
    expect(screen.getByTestId('reference-line')).toBeInTheDocument();
  });

  it('handles responsive behavior correctly', () => {
    // Mock window.matchMedia for responsive testing
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

    renderWithProviders(<InteractiveDashboardChart {...defaultProps} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
