import { render, screen } from '@testing-library/react';
import App from './App';
import StatusCard from './components/StatusCard';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
  it('renders the dashboard heading', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: '2025-01-01T00:00:00Z' }),
      })
    );

    render(<App />);
    expect(screen.getByText(/Dev-ops Dashboard/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
  });
});

describe('StatusCard', () => {
  it('renders loading spinner when data is null', () => {
    render(<StatusCard data={null} />);
    expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
  });

  it('renders status info when data is provided', () => {
    const mockData = { status: 'ok', message: 'Running', timestamp: '2025-01-01T00:00:00Z' };
    render(<StatusCard data={mockData} />);
    expect(screen.getByText(/API Status/i)).toBeInTheDocument();
    expect(screen.getByText(/ok/i)).toBeInTheDocument();
    expect(screen.getByText(/Running/i)).toBeInTheDocument();
  });
});
