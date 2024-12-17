import React from 'react';
import { render, screen, waitFor, userEvent } from '../../utils/test-utils';
import { PropertySearch } from './PropertySearch';
import { createMockSearchResponse } from '../../utils/test-utils';

describe('PropertySearch', () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  it('renders the search form', () => {
    render(<PropertySearch />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays loading state during search', async () => {
    render(<PropertySearch />);
    
    const searchInput = screen.getByPlaceholderText(/search location/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'New York');
    await userEvent.click(searchButton);

    expect(screen.getByTestId('search-loading')).toBeInTheDocument();
  });

  it('displays search results when API call succeeds', async () => {
    const mockResults = createMockSearchResponse(2);
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });

    render(<PropertySearch />);
    
    const searchInput = screen.getByPlaceholderText(/search location/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'New York');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('property-list')).toBeInTheDocument();
      expect(screen.getAllByTestId('property-card')).toHaveLength(2);
    });
  });

  it('displays error message when API call fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));

    render(<PropertySearch />);
    
    const searchInput = screen.getByPlaceholderText(/search location/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'New York');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  it('updates URL with search parameters', async () => {
    render(<PropertySearch />);
    
    const searchInput = screen.getByPlaceholderText(/search location/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'New York');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(window.location.search).toContain('location=New+York');
    });
  });
});
