import { useState, useEffect, useCallback } from 'react'
import { fetchHealthStatus } from './utils/api'
import StatusCard from './components/StatusCard'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadHealth = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchHealthStatus()
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching health check:', err);
                setError(err.message || 'Failed to fetch health status');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadHealth();
    }, [loadHealth]);

    return (
        <div className="container">
            <h1>Devops</h1>
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={loadHealth} />}
            {!loading && !error && <StatusCard data={data} />}
            <p className="hint">
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
        </div>
    )
}

export default App
