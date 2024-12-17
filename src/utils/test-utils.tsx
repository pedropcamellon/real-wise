import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Add providers here as needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockProperty = (overrides = {}) => ({
  id: 'property-1',
  title: 'Test Property',
  price: 250000,
  location: 'Test Location',
  bedrooms: 3,
  bathrooms: 2,
  area: 1500,
  type: 'house',
  status: 'for-sale',
  images: ['test-image.jpg'],
  ...overrides
});

export const createMockSearchResponse = (count = 3) => ({
  results: Array(count).fill(null).map((_, index) => 
    createMockProperty({ id: `property-${index + 1}` })
  ),
  total: count,
  page: 1,
  totalPages: 1
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, userEvent };
