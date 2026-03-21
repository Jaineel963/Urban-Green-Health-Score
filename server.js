const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuration & Data Loading
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });
let masterPincodeDB = {};

// Load the National Database into memory once at startup
// This allows for O(1) constant-time lookups (Instant speed)
try {
    if (fs.existsSync('./india_master_db.json')) {
        masterPincodeDB = JSON.parse(fs.readFileSync('./india_master_db.json', 'utf8'));
        console.log('✅ National Environmental Database Loaded (All-India).');
    } else {
        console.error('❌ CRITICAL ERROR: india_master_db.json not found! Run data_generator.js first.');
    }
} catch (err) {
    console.error('❌ Error parsing Master JSON:', err.message);
}

// 2. Search Route (All-India)
app.get('/search/:pincode', async (req, res) => {
    const pincode = req.params.pincode.trim();
    const AQI_TOKEN = "4bf818bd9df49d058b1f8f0dbd7540bea57918bf";

    try {
        // A. Instant Database Lookup
        const localInfo = masterPincodeDB[pincode];
        
        if (!localInfo) {
            return res.status(404).json({ error: "Pincode not found in National Database." });
        }

        // B. Get City Name (For Display & Fallbacks)
        // We still use Geocoder to get the real Name of the place, but not the Greenery
        const geo = await geocoder.geocode({ address: pincode, country: 'India' });
        const cityName = geo[0]?.city || geo[0]?.state || localInfo.s;
        const formattedAddress = geo[0]?.formattedAddress || `${cityName}, ${localInfo.s}`;

        // C. Fetch ONLY Live AQI (The only slow part, but necessary for real-time)
        const aqiRes = await axios.get(`https://api.waqi.info/feed/@${pincode}/?token=${AQI_TOKEN}`).catch(() => null);
        let liveAQI = aqiRes?.data?.status === "ok" ? aqiRes.data.data.aqi : null;

        // Fallback to City-level AQI if Pincode station is empty
        if (!liveAQI) {
            const fallback = await axios.get(`https://api.waqi.info/feed/${cityName}/?token=${AQI_TOKEN}`).catch(() => null);
            liveAQI = fallback?.data?.data?.aqi || 75; // 75 is a safe urban average
        }

        // D. Combine Data (Instant - pulled from local JSON)
        const combinedData = {
            Ward_Name: formattedAddress,
            Pincode: pincode,
            Green_Score: localInfo.g,      // <--- Pulled instantly from your 19k database
            AQI_Value: liveAQI, 
            Noise_Pollution_Score: 45,     // Baseline urban noise
            Waste_Mgmt_Score: localInfo.w  // <--- Pulled instantly from your 19k database
        };

        // E. Python ML Scoring Engine
        // We "spawn" the python script to run our Regression/Clustering math
        const pythonProcess = spawn('python', ['analysis_engine.py', JSON.stringify(combinedData)]);
        
        let pythonOutput = "";
        pythonProcess.stdout.on('data', (data) => { pythonOutput += data.toString(); });
        
        pythonProcess.on('close', (code) => {
            if (code !== 0) return res.status(500).json({ error: "ML Engine Error" });
            try {
                res.json(JSON.parse(pythonOutput));
            } catch (e) {
                res.status(500).json({ error: "Data Parsing Error" });
            }
        });

    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 All-India Eco-Health API live on port ${PORT}`));