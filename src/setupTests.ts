import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));
window.IntersectionObserver = mockIntersectionObserver;
