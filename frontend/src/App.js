import React, { useState } from 'react';
import axios from 'axios';

// 1. Enhanced Progress Bar with Animated Gradients
const ProgressBar = ({ label, value, color }) => (
  <div style={styles.progressContainer}>
    <div style={styles.progressLabel}>
      <span>{label}</span>
      <span style={{ color: color, fontWeight: 'bold' }}>{value}%</span>
    </div>
    <div style={styles.progressTrack}>
      <div 
        style={{ 
          ...styles.progressFill, 
          width: `${value}%`, 
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 10px ${color}44`
        }} 
      />
    </div>
  </div>
);

const App = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pincode || pincode.length !== 6) {
      setError("Please enter a valid 6-digit Pincode.");
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`http://localhost:5000/search/${pincode}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.status === 404 ? "Pincode not found." : "Server Error.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Theme Logic
  const getThemeColor = (cat) => {
    if (cat === 'Eco-Rich' || cat === 'Good') return '#27ae60';
    if (cat === 'Average' || cat === 'Fair') return '#f39c12';
    return '#e74c3c';
  };

  const themeColor = result ? getThemeColor(result.category) : '#2d6a4f';

  return (
    <div style={{...styles.page, background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`}}>
      
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Eco-Health <span style={{color: '#2d6a4f'}}>Intelligence</span></h1>
        <p style={styles.subTitle}>National Environmental Monitoring & Scoring System</p>
      </div>

      {/* Search Section */}
      <div style={styles.searchCard}>
        <div style={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search Pincode (e.g., 400001)" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearch} style={{...styles.button, backgroundColor: '#2d6a4f'}}>
            {loading ? 'ANALYZING...' : 'CHECK HEALTH'}
          </button>
        </div>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>

      {/* Result Card */}
      {result && (
        <div style={{...styles.resultCard, borderTop: `8px solid ${themeColor}`}}>
          <div style={styles.resultHeader}>
            <div style={circleStyle(themeColor)}>
              <span style={styles.scoreNumber}>{result.total_score}</span>
              <small style={styles.scoreLabel}>HEALTH INDEX</small>
            </div>
            <div style={styles.infoArea}>
              <h2 style={styles.areaName}>{result.area_name}</h2>
              <div style={{...styles.statusBadge, backgroundColor: `${themeColor}22`, color: themeColor}}>
                ● {result.category} Zone
              </div>
              <p style={styles.timestamp}>Real-time Satellite & Sensor Fusion Active</p>
            </div>
          </div>

          <div style={styles.grid}>
            <ProgressBar label="Green Cover" value={result.breakdown.green} color="#2ecc71" />
            <ProgressBar label="Waste Efficiency" value={result.breakdown.waste} color="#e67e22" />
            <ProgressBar label="Air Quality Index" value={result.breakdown.aqi} color="#f1c40f" />
            <ProgressBar label="Noise Score" value={result.breakdown.reports} color="#3498db" />
          </div>
        </div>
      )}    </div>
  );
};

// Styles and Animations
const circleStyle = (color) => ({
  width: '160px', height: '160px', borderRadius: '50%',
  border: `12px solid ${color}22`, borderTop: `12px solid ${color}`,
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  alignItems: 'center', marginRight: '40px', backgroundColor: '#fff',
  boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'all 0.5s ease'
});

const styles = {
  page: { padding: '60px 20px', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '3rem', margin: '0', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-1px' },
  subTitle: { color: '#555', fontSize: '1.1rem', marginTop: '10px' },
  searchCard: { 
    maxWidth: '700px', margin: '0 auto 30px', background: 'rgba(255,255,255,0.9)', 
    padding: '20px', borderRadius: '20px', backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
  },
  searchBox: { display: 'flex', gap: '15px' },
  input: { 
    flex: 1, padding: '15px 25px', borderRadius: '15px', border: '2px solid #eee', 
    fontSize: '18px', outline: 'none', transition: '0.3s' 
  },
  button: { 
    padding: '15px 35px', color: 'white', border: 'none', borderRadius: '15px', 
    cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' 
  },
  resultCard: { 
    maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '50px', 
    borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
    animation: 'slideUp 0.6s ease-out'
  },
  resultHeader: { display: 'flex', alignItems: 'center', marginBottom: '50px' },
  scoreNumber: { fontSize: '56px', fontWeight: '900', color: '#1a1a1a', margin: 0 },
  scoreLabel: { fontSize: '10px', fontWeight: '800', color: '#999', letterSpacing: '2px' },
  infoArea: { flex: 1 },
  areaName: { fontSize: '2.2rem', margin: '0 0 10px 0', color: '#2c3e50' },
  statusBadge: { display: 'inline-block', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px' },
  timestamp: { color: '#999', fontSize: '13px', marginTop: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  progressContainer: { marginBottom: '5px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', fontWeight: '600' },
  progressTrack: { height: '10px', width: '100%', backgroundColor: '#f0f0f0', borderRadius: '10px' },
  progressFill: { height: '100%', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.1, 0.5, 0.1, 1)' },
  errorText: { color: '#e74c3c', textAlign: 'center', fontWeight: 'bold', marginTop: '15px' }
};

// Global Animation Styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  input:focus { border-color: #2d6a4f !important; box-shadow: 0 0 0 4px rgba(45, 106, 79, 0.1); }
  button:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 20px rgba(45, 106, 79, 0.2); }
`;
document.head.appendChild(styleSheet);

export default App;