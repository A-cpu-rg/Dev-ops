import React, { useState, useEffect } from 'react';
import StatusCard from './components/StatusCard';
import './index.css';

function App() {
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch((err) => console.error('Error fetching health check:', err));
  }, []);

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <header className="app-header">
        <h1>Dev-ops Dashboard</h1>
        <p>Welcome to the project evaluation interface.</p>
      </header>

      <main className="app-content" style={{ gridTemplateColumns: '1fr' }}>
        <StatusCard data={statusData} />
      </main>

      <footer className="hint">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR.
        </p>
      </footer>
    </div>
  );
}

export default App;
