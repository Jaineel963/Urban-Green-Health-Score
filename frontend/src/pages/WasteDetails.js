import React from 'react';
import { useLocation } from 'react-router-dom';

const WasteDetails = () => {
  const { state } = useLocation();
  if (!state) return <div style={{padding: '50px'}}>Search required.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Waste Infrastructure: {state.value}%</h1>
      <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', borderLeft: `8px solid ${state.color}` }}>
        <h3>Processing Capacity</h3>
        <p>Based on the <strong>Swachh Survekshan</strong> municipal report for this zone. This score considers segregation at source, landfill remediation, and plastic waste processing efficiency.</p>
      </div>
    </div>
  );
};
export default WasteDetails;