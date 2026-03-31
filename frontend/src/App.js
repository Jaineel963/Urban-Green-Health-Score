import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import WaterDetails from './pages/WaterDetails';

// Import Sub-pages
import AQIDetails from './pages/AQIDetails';
import GreenDetails from './pages/GreenDetails';

// 1. Updated MetricCard Component
const MetricCard = ({ label, value, color, path, icon, rawData }) => (
  <Link 
    to={path} 
    state={{ label, value, color, icon, rawData }} 
    style={styles.cardLink}
  >
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardIcon}>{icon}</span>
        <span style={styles.cardLabel}>{label}</span>
      </div>
      <div style={styles.cardValue}>{value}%</div>
      <div style={styles.progressBase}>
        <div 
          style={{ 
            ...styles.progressFill, 
            width: `${value}%`, 
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}44` 
          }} 
        />
      </div>
      <span style={{ ...styles.cardFooter, color: color }}>
        View {label} Analysis →
      </span>
    </div>
  </Link>
);

// 2. Main Dashboard Component
const Dashboard = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (pincode.length !== 6) return alert("Enter a 6-digit Pincode");
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/search/${pincode}`);
      setResult(res.data);
    } catch (err) {
      alert("Error: Check if backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Eco-Health <span style={{color: '#2ecc71'}}>Intelligence</span></h1>
        <div style={styles.searchBar}>
          <input 
            style={styles.input} 
            placeholder="Enter Pincode..." 
            value={pincode} 
            onChange={(e) => setPincode(e.target.value)} 
          />
          <button style={styles.searchBtn} onClick={handleSearch}>
            {loading ? 'Analyzing...' : 'Check Area'}
          </button>
        </div>
      </header>

      {result && (
        <main style={styles.main}>
          <div style={styles.scoreSection}>
            <div style={{...styles.mainScoreCircle, borderColor: result.total_score > 60 ? '#2ecc71' : '#f1c40f'}}>
              <span style={styles.scoreText}>{result.total_score}</span>
              <small style={{color: '#94a3b8', fontWeight: 'bold'}}>HEALTH INDEX</small>
            </div>
            <h2 style={styles.cityName}>{result.area_name}</h2>
            <p style={styles.badge}>● {result.category} Zone</p>
          </div>

          <div style={styles.grid}>
            <MetricCard 
            label="Air Quality" 
            value={result.breakdown.aqi} 
            color="#f59e0b" 
            icon="🌬️" 
            path="/details/aqi" 
            rawData={result} 
            />
            <MetricCard 
            label="Green Cover" 
            value={result.breakdown.green} 
            color="#10b981" 
            icon="🌿" 
            path="/details/green" 
            rawData={result} 
            />
            <MetricCard 
              label="Water Purity" 
              value={result.breakdown.water} // Mapping the new 'water' breakdown
              color="#0ea5e9" 
              icon="💧" 
              path="/details/water" 
              rawData={result} 
            />
            <MetricCard 
              label="Waste Mgmt" 
              value={result.breakdown.waste} 
              color="#6366f1" 
              icon="♻️" 
              path="/details/waste" 
              rawData={result} 
            />
            <MetricCard 
              label="Quietness" 
              value={result.breakdown.reports} 
              color="#3b82f6" 
              icon="🔊" 
              path="/details/noise" 
              rawData={result} 
            />
            </div>

          <div style={styles.mapWrapper}>
            <MapContainer center={[result.coordinates.lat, result.coordinates.lng]} zoom={14} style={{height: '100%', width: '100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Circle center={[result.coordinates.lat, result.coordinates.lng]} radius={1000} pathOptions={{ color: '#2ecc71' }} />
            </MapContainer>
          </div>
        </main>
      )}
    </div>
  );
};

// 3. Styles Object
const styles = {
  container: { minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'Inter, sans-serif' },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '2.8rem', fontWeight: '900', color: '#0f172a' },
  searchBar: { background: '#fff', padding: '8px', borderRadius: '16px', display: 'inline-flex', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' },
  input: { border: 'none', padding: '12px 20px', outline: 'none', width: '280px', fontSize: '16px' },
  searchBtn: { background: '#0f172a', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  main: { maxWidth: '1000px', margin: '0 auto' },
  scoreSection: { textAlign: 'center', marginBottom: '40px' },
  mainScoreCircle: { width: '150px', height: '150px', borderRadius: '50%', border: '8px solid', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', background: '#fff' },
  scoreText: { fontSize: '3.5rem', fontWeight: '900' },
  cityName: { fontSize: '1.8rem', margin: '0', fontWeight: '700' },
  badge: { display: 'inline-block', padding: '6px 16px', background: '#e2e8f0', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold', marginTop: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
  cardLink: { textDecoration: 'none' },
  card: { background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: '0.3s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  cardIcon: { fontSize: '24px' },
  cardLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  cardValue: { fontSize: '32px', fontWeight: '900', color: '#1e293b' },
  progressBase: { height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },
  cardFooter: { display: 'block', marginTop: '15px', fontSize: '11px', fontWeight: 'bold', textAlign: 'right' },
  mapWrapper: { height: '400px', borderRadius: '24px', overflow: 'hidden', border: '10px solid #fff', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }
};

// 4. Main App Component with Routing
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/aqi" element={<AQIDetails />} />
      <Route path="/details/green" element={<GreenDetails />} />
      <Route path="/details/water" element={<WaterDetails />} />
    </Routes>
  </Router>
);

export default App;