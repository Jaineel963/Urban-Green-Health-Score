import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const WaterDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div style={{padding: '50px'}}>Search a pincode first!</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/')} style={backBtn}>← Dashboard</button>
      <h1 style={{fontSize: '2.5rem'}}>Water Quality <span style={{color: state.color}}>Index (WQI)</span></h1>
      
      <div style={infoCard}>
        <div style={scoreCircle}>
            <h2 style={{margin: 0, fontSize: '3rem'}}>{state.value}%</h2>
            <p style={{fontSize: '12px', fontWeight: 'bold'}}>PURITY SCORE</p>
        </div>
        <div style={{flex: 1}}>
            <h3>State Benchmark Analysis</h3>
            <p>Based on <strong>CPCB NWMP</strong> data. This score reflects the average pH levels, Dissolved Oxygen (DO), and Biochemical Oxygen Demand (BOD) for the state of <strong>{state.rawData.area_name.split(' ')[0]}</strong>.</p>
        </div>
      </div>
    </div>
  );
};

const backBtn = { padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer' };
const infoCard = { display: 'flex', gap: '30px', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginTop: '30px', alignItems: 'center' };
const scoreCircle = { width: '140px', height: '140px', borderRadius: '50%', border: '5px solid #0ea5e9', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f0f9ff' };

export default WaterDetails;