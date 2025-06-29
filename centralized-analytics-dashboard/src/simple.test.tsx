// Simple test to verify Jest setup
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple test component
const TestComponent = () => <div>Hello Test</div>;

test('Jest setup is working', () => {
  render(<TestComponent />);
  expect(screen.getByText('Hello Test')).toBeInTheDocument();
});
