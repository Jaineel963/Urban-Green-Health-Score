import React from 'react';
import { useNavigate } from 'react-router-dom';

const GreenDetails = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '40px', fontFamily: 'Inter, sans-serif' }}>
            <button onClick={() => navigate('/')} style={btnStyle}>← Back to Dashboard</button>
            <h1>Green Cover Analysis</h1>
            <p>Using Live OpenStreetMap (Overpass API) data to calculate vegetation density within 1.5km.</p>
            <ul style={{ lineHeight: '2' }}>
                <li>Source: OpenStreetMap Contributors</li>
                <li>Method: Radial Buffer Analysis (1500m)</li>
                <li>Features: Parks, Grasslands, Forests</li>
            </ul>
        </div>
    );
};

const btnStyle = { padding: '10px 20px', cursor: 'pointer', marginBottom: '20px', borderRadius: '8px', border: 'none', backgroundColor: '#2ecc71', color: 'white' };

export default GreenDetails;