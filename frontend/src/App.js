import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Sub-pages
import AQIDetails from './pages/AQIDetails';
import GreenDetails from './pages/GreenDetails';
import WaterDetails from './pages/WaterDetails';
import WasteDetails from './pages/WasteDetails';
import NoiseDetails from './pages/NoiseDetails';

// Import Leaflet Marker Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- 1. MetricCard Component ---
const MetricCard = ({ label, value, color, path, icon, rawData }) => (
  <Link to={path} state={{ label, value, color, icon, rawData }} target="_blank" rel="noopener noreferrer" style={styles.cardLink}>
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardIcon}>{icon}</span>
        <span style={styles.cardLabel}>{label}</span>
      </div>
      <div style={styles.cardValue}>{value}%</div>
      <div style={styles.progressBase}>
        <div style={{ ...styles.progressFill, width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}44` }} />
      </div>
      <span style={{ ...styles.cardFooter, color: color }}>View {label} Analysis ↗</span>
    </div>
  </Link>
);

// --- 2. Helper component to move the map ---
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 14);
  }, [coords, map]);
  return null;
};

// --- 3. Main Dashboard Component ---
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
            placeholder="Search Pincode (e.g., 400001)..." 
            value={pincode} 
            onChange={(e) => setPincode(e.target.value)} 
          />
          <button style={styles.searchBtn} onClick={handleSearch}>
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </header>

      {!result ? (
        <div style={styles.welcomeSection}>
          <div style={styles.heroText}>
            <h2 style={{fontSize: '2.2rem', color: '#1e293b'}}>Multi-Parametric <span style={{color: '#10b981'}}>Environmental Audit</span></h2>
            <p style={{color: '#64748b', fontSize: '1.1rem'}}>Consolidated ecological data engine using WAQI, Overpass, and CPCB baseline data.</p>
          </div>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}><span>💨</span><h4>Atmospheric</h4><p>Particulate matter and live AQI index tracking.</p></div>
            <div style={styles.featureCard}><span>🛰️</span><h4>Biomass</h4><p>Vegetation density and permeable surface analysis.</p></div>
            <div style={styles.featureCard}><span>🔬</span><h4>Urban Infra</h4><p>Municipal waste and acoustic pollution benchmarks.</p></div>
          </div>
        </div>
      ) : (
        <main style={styles.main}>
          <div style={styles.scoreSection}>
            {/* Advanced Visual Gauge */}
            <div style={{...styles.visualGauge, borderColor: result.total_score > 60 ? '#10b981' : '#f59e0b'}}>
              <div style={styles.gaugeInner}>
                <span style={styles.scoreText}>{result.total_score}</span>
                <div style={styles.unitLabel}>HEALTH INDEX</div>
              </div>
              <div style={styles.decoRing1} />
              <div style={styles.decoRing2} />
              
              <div style={styles.tagLocal}>SYSTEM STATUS: ACTIVE</div>
              <div style={styles.tagNational}>PIN: {result.pincode}</div>
            </div>

            <div style={styles.locationHeader}>
                <h2 style={styles.cityName}>{result.area_name}</h2>
                <div style={{...styles.categoryTag, color: result.total_score > 60 ? '#10b981' : '#f59e0b'}}>
                    ● {result.category.toUpperCase()} INFRASTRUCTURE DATASET
                </div>
            </div>
          </div>

          <div style={styles.grid}>
            <MetricCard label="Air Quality" value={result.breakdown.aqi} color="#f59e0b" icon="🌬️" path="/details/aqi" rawData={result} />
            <MetricCard label="Green Cover" value={result.breakdown.green} color="#10b981" icon="🌿" path="/details/green" rawData={result} />
            <MetricCard label="Water Purity" value={result.breakdown.water} color="#0ea5e9" icon="💧" path="/details/water" rawData={result} />
            <MetricCard label="Waste Mgmt" value={result.breakdown.waste} color="#6366f1" icon="♻️" path="/details/waste" rawData={result} />
            <MetricCard label="Quietness" value={result.breakdown.reports} color="#3b82f6" icon="🔊" path="/details/noise" rawData={result} />
          </div>

          <div style={styles.mapWrapper}>
            <MapContainer center={[result.coordinates.lat, result.coordinates.lng]} zoom={14} style={{height: '100%', width: '100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RecenterMap coords={result.coordinates} />
              <Marker position={[result.coordinates.lat, result.coordinates.lng]}><Popup>{result.area_name}</Popup></Marker>
              <Circle center={[result.coordinates.lat, result.coordinates.lng]} radius={1000} pathOptions={{ color: '#2ecc71', fillColor: '#2ecc71', fillOpacity: 0.1 }} />
            </MapContainer>
          </div>
        </main>
      )}
    </div>
  );
};

// --- Technical UI Styles ---
const styles = {
  container: { minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'Inter, sans-serif' },
  header: { textAlign: 'center', marginBottom: '60px' },
  title: { fontSize: '2.8rem', fontWeight: '900', color: '#0f172a', marginBottom: '30px' },
  searchBar: { background: '#fff', padding: '8px', borderRadius: '16px', display: 'inline-flex', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' },
  input: { border: 'none', padding: '12px 20px', outline: 'none', width: '280px', fontSize: '16px' },
  searchBtn: { background: '#0f172a', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  
  welcomeSection: { marginTop: '40px', textAlign: 'center' },
  heroText: { maxWidth: '700px', margin: '0 auto 50px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' },
  featureCard: { background: '#fff', padding: '30px', borderRadius: '32px', border: '1px solid #f1f5f9' },
  
  main: { maxWidth: '1000px', margin: '0 auto' },
  
  // Advanced Visual Gauge (No context card)
  scoreSection: { textAlign: 'center', marginBottom: '60px' },
  visualGauge: { width: '220px', height: '220px', borderRadius: '50%', border: '2px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px', position: 'relative', background: 'radial-gradient(circle, #ffffff 0%, #f8fafc 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' },
  gaugeInner: { textAlign: 'center', zIndex: 2 },
  scoreText: { fontSize: '4.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px', lineHeight: '1' },
  unitLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginTop: '5px', letterSpacing: '2px' },
  decoRing1: { position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px dashed #cbd5e1', opacity: 0.5 },
  decoRing2: { position: 'absolute', width: '190px', height: '190px', borderRadius: '50%', border: '1px solid #f1f5f9' },
  tagLocal: { position: 'absolute', top: '10px', right: '-60px', background: '#0f172a', color: '#fff', fontSize: '9px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' },
  tagNational: { position: 'absolute', bottom: '10px', left: '-60px', background: '#f1f5f9', color: '#64748b', fontSize: '9px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: 'bold' },

  locationHeader: { marginBottom: '50px' },
  cityName: { fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' },
  categoryTag: { fontSize: '11px', fontWeight: '900', letterSpacing: '2px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '50px' },
  cardLink: { textDecoration: 'none' },
  card: { background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: '0.3s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  cardIcon: { fontSize: '24px' },
  cardLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  cardValue: { fontSize: '32px', fontWeight: '900', color: '#1e293b' },
  progressBase: { height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease' },
  cardFooter: { display: 'block', marginTop: '15px', fontSize: '11px', fontWeight: 'bold', textAlign: 'right' },
  mapWrapper: { height: '450px', borderRadius: '32px', overflow: 'hidden', border: '10px solid #fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/aqi" element={<AQIDetails />} />
      <Route path="/details/green" element={<GreenDetails />} />
      <Route path="/details/water" element={<WaterDetails />} />
      <Route path="/details/waste" element={<WasteDetails />} />
      <Route path="/details/noise" element={<NoiseDetails />} />
    </Routes>
  </Router>
);

export default App;