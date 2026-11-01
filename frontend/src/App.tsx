
import { useEffect, useState } from 'react';
import { fetchEarthquakes } from './services/earthquakeService';
import type { Earthquake } from './types/earthquake';
import EarthquakeMap from './components/EarthquakeMap';
import './App.css';

function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEarthquakes()
      .then(setEarthquakes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading earthquakes...</h2>;

  if (error) return <h2>Error: {error}</h2>;

  return (
    <main style={{
      background: '#0b1120',
      minHeight: '100vh',
      padding: '24px',
      color: '#f1f5f9',
    }}>
      <header style={{ marginBottom: '24px' }}>
        <h1>Peru Seismic Monitor</h1>
        <p style={{ color: '#94a3b8' }}>
          Earthquake monitoring and seismic activity analytics
        </p>
      </header>

      <EarthquakeMap earthquakes={earthquakes} />
    </main>
  );
}

export default App;
