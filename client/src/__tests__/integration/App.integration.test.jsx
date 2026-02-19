import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../../App';

// Mock the api module
vi.mock('../../utils/api', () => ({
    fetchHealthStatus: vi.fn(),
}));

import { fetchHealthStatus } from '../../utils/api';

const mockHealthData = {
    status: 'ok',
    message: 'Devops Backend is running',
    timestamp: '2024-06-15T12:00:00.000Z',
};

describe('App Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('1. should show loading spinner initially', () => {
        fetchHealthStatus.mockReturnValue(new Promise(() => { })); // never resolves
        render(<App />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('2. should display health data after successful fetch', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('status-card')).toBeInTheDocument();
        });

        expect(screen.getByTestId('status-value')).toHaveTextContent('OK');
        expect(screen.getByTestId('message-value')).toHaveTextContent('Devops Backend is running');
    });

    it('3. should hide loading spinner after data loads', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });
    });

    it('4. should show error message on fetch failure', async () => {
        fetchHealthStatus.mockRejectedValue(new Error('Network error'));
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });

        expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('5. should show retry button on error', async () => {
        fetchHealthStatus.mockRejectedValue(new Error('Server down'));
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('retry-button')).toBeInTheDocument();
        });
    });

    it('6. should retry fetching when retry button is clicked', async () => {
        fetchHealthStatus.mockRejectedValueOnce(new Error('Failed'));
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('retry-button')).toBeInTheDocument();
        });

        fetchHealthStatus.mockResolvedValueOnce(mockHealthData);
        fireEvent.click(screen.getByTestId('retry-button'));

        await waitFor(() => {
            expect(screen.getByTestId('status-card')).toBeInTheDocument();
        });

        expect(fetchHealthStatus).toHaveBeenCalledTimes(2);
    });

    it('7. should always render the page title', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);
        expect(screen.getByText('Devops')).toBeInTheDocument();
    });

    it('8. should always render the HMR hint', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);
        expect(screen.getByText(/Edit/)).toBeInTheDocument();
        expect(screen.getByText('src/App.jsx')).toBeInTheDocument();
    });

    it('9. should not show error and status card simultaneously', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('status-card')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('10. should display formatted timestamp in status card', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('timestamp-value')).toBeInTheDocument();
        });

        expect(screen.getByTestId('timestamp-value').textContent).toContain('Timestamp:');
    });

    it('11. should call fetchHealthStatus exactly once on mount', async () => {
        fetchHealthStatus.mockResolvedValue(mockHealthData);
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('status-card')).toBeInTheDocument();
        });

        expect(fetchHealthStatus).toHaveBeenCalledTimes(1);
    });

    it('12. should handle empty error message gracefully', async () => {
        fetchHealthStatus.mockRejectedValue(new Error(''));
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });
    });
});
