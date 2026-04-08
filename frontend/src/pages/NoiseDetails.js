import React from 'react';
import { useLocation } from 'react-router-dom';

const NoiseDetails = () => {
  const { state } = useLocation();
  if (!state) return <div style={{padding: '50px'}}>Search required.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Acoustic Health: {state.value}%</h1>
      <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', borderLeft: `8px solid ${state.color}` }}>
        <h3>Ambient Noise Levels</h3>
        <p>Calculated using <strong>CPCB National Noise Monitoring</strong> baselines. Higher scores indicate "Quiet Zones" (residential/educational). Lower scores indicate commercial/industrial zones or high-traffic areas.</p>
      </div>
    </div>
  );
};
export default NoiseDetails;