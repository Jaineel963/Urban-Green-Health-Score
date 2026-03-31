require('dotenv').config({ path: './token.env' });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const { calculateEcoHealth } = require('./utils/scoringEngine');

const app = express();
app.use(cors());
app.use(express.json());

const AQI_TOKEN = process.env.AQI_TOKEN;
let masterPincodeDB = {};


try {
    const dbPath = path.join(__dirname, 'india_master_db.json');
    if (fs.existsSync(dbPath)) {
        masterPincodeDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        console.log('✅ National Database Loaded.');
    } else {
        console.log('❌ ERROR: india_master_db.json missing in root!');
    }
} catch (err) {
    console.error('❌ DB Parse Error:', err.message);
}

app.get('/search/:pincode', async (req, res) => {
    const pincode = req.params.pincode.trim();
    const localInfo = masterPincodeDB[pincode];

    if (!localInfo) return res.status(404).json({ error: "Pincode not found" });

    try {
        let liveAQI = 75;
        try {
            const aqiRes = await axios.get(`https://api.waqi.info/feed/geo:${localInfo.lat};${localInfo.lng}/?token=${process.env.AQI_TOKEN}`, { timeout: 3000 });
            if (aqiRes.data?.data?.aqi) liveAQI = aqiRes.data.data.aqi;
        } catch (e) { console.log("⚠️ AQI Timeout"); }


        let liveGreenScore = localInfo.g; 
        try {
            
            const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:3];way["leisure"="park"](around:800,${localInfo.lat},${localInfo.lng});out count;`;
            const greenRes = await axios.get(overpassUrl, { timeout: 5000 });
            const count = parseInt(greenRes?.data?.elements[0]?.tags?.total) || 0;
            
            liveGreenScore = Math.min(100, (count * 15) + 20); 
        } catch (e) { console.log("⚠️ Greenery API Timeout - Using DB Fallback"); }

        const combinedData = {
            Ward_Name: localInfo.city,
            Pincode: pincode,
            Lat: localInfo.lat,
            Lng: localInfo.lng,
            Green_Score: liveGreenScore, 
            AQI_Value: liveAQI, 
            Noise_Pollution_Score: localInfo.n, 
            Waste_Mgmt_Score: localInfo.w,
            Water_Quality_Score: localInfo.h2o
        };

        const finalResult = calculateEcoHealth(combinedData);
        finalResult.coordinates = { lat: localInfo.lat, lng: localInfo.lng };
        
        res.json(finalResult);

    } catch (error) {
        console.error("Critical Route Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use((err, req, res, next) => {
    console.error("!!! SERVER CRASH !!!", err.stack);
    res.status(500).json({ 
        error: "Internal Server Error", 
        details: err.message 
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 API active on http://localhost:${PORT}`));