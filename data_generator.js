const fs = require('fs');

// State-level mapping for Pincode prefixes
const pincodeToState = {
    "11": "DELHI", "12": "HARYANA", "13": "HARYANA", "14": "PUNJAB", "15": "PUNJAB", "16": "PUNJAB",
    "17": "HIMACHAL PRADESH", "18": "JAMMU AND KASHMIR", "19": "JAMMU AND KASHMIR",
    "20": "UTTAR PRADESH", "21": "UTTAR PRADESH", "22": "UTTAR PRADESH", "23": "UTTAR PRADESH", 
    "24": "UTTAR PRADESH", "25": "UTTAR PRADESH", "26": "UTTAR PRADESH", "27": "UTTAR PRADESH", "28": "UTTAR PRADESH",
    "30": "RAJASTHAN", "31": "RAJASTHAN", "32": "RAJASTHAN", "33": "RAJASTHAN", "34": "RAJASTHAN",
    "36": "GUJARAT", "37": "GUJARAT", "38": "GUJARAT", "39": "GUJARAT",
    "40": "MAHARASHTRA", "41": "MAHARASHTRA", "42": "MAHARASHTRA", "43": "MAHARASHTRA", "44": "MAHARASHTRA",
    "45": "MADHYA PRADESH", "46": "MADHYA PRADESH", "47": "MADHYA PRADESH", "48": "MADHYA PRADESH",
    "49": "CHHATTISGARH", "50": "TELANGANA", "51": "ANDHRA PRADESH", "52": "ANDHRA PRADESH", "53": "ANDHRA PRADESH",
    "56": "KARNATAKA", "57": "KARNATAKA", "58": "KARNATAKA", "59": "KARNATAKA",
    "60": "TAMIL NADU", "61": "TAMIL NADU", "62": "TAMIL NADU", "63": "TAMIL NADU", "64": "TAMIL NADU",
    "67": "KERALA", "68": "KERALA", "69": "KERALA", "70": "WEST BENGAL", "71": "WEST BENGAL", 
    "72": "WEST BENGAL", "73": "WEST BENGAL", "74": "WEST BENGAL",
    "75": "ODISHA", "76": "ODISHA", "77": "ODISHA", "78": "ASSAM", "79": "MANIPUR",
    "80": "BIHAR", "81": "BIHAR", "82": "JHARKHAND", "83": "JHARKHAND", "84": "BIHAR", "85": "BIHAR"
};

/**
 * ENVIRONMENTAL PROFILES (Task 5: Data Sources)
 * w: Waste Infrastructure (Swachh Survekshan based)
 * g: Green Base (Fallback for Overpass API)
 * n: Noise Ambient Baseline (CPCB averages)
 * h2o: Water Quality Index (CPCB State data)
 */
const environmentalProfiles = {
    "DELHI": { w: 58, g: 18, n: 82, h2o: 35, lat: 28.61, lng: 77.20 },
    "MAHARASHTRA": { w: 72, g: 38, n: 65, h2o: 68, lat: 19.07, lng: 72.87 },
    "KARNATAKA": { w: 68, g: 62, n: 55, h2o: 72, lat: 12.97, lng: 77.59 },
    "KERALA": { w: 85, g: 88, n: 30, h2o: 90, lat: 8.52, lng: 76.93 },
    "GUJARAT": { w: 92, g: 26, n: 50, h2o: 62, lat: 23.02, lng: 72.57 },
    "RAJASTHAN": { w: 45, g: 12, n: 45, h2o: 40, lat: 26.91, lng: 75.78 },
    "HIMACHAL PRADESH": { w: 75, g: 78, n: 25, h2o: 88, lat: 31.10, lng: 77.17 },
    "CHHATTISGARH": { w: 90, g: 65, n: 40, h2o: 55, lat: 21.25, lng: 81.62 },
    "TAMIL NADU": { w: 78, g: 42, n: 60, h2o: 65, lat: 13.08, lng: 80.27 },
    "WEST BENGAL": { w: 55, g: 48, n: 70, h2o: 50, lat: 22.57, lng: 88.36 },
    "INDIA": { w: 50, g: 30, n: 45, h2o: 50, lat: 20.59, lng: 78.96 }
};

const masterDB = {};
console.log("🚀 Generating National Database with Water Quality Benchmarks...");

// Iterating through significant Indian Pincode ranges
for (let i = 110001; i <= 855117; i++) {
    let pincodeStr = i.toString();
    let prefix = pincodeStr.substring(0, 2);
    
    let state = pincodeToState[prefix] || "INDIA";
    let profile = environmentalProfiles[state] || environmentalProfiles["INDIA"];

    // Adding unique local variations (noise) so neighbors aren't identical
    let gVar = (Math.random() * 10) - 5;
    let wVar = (Math.random() * 8) - 4;
    let nVar = (Math.random() * 12) - 6;
    let hVar = (Math.random() * 10) - 5;

    masterDB[pincodeStr] = {
        s: state,
        city: `${state} Area (${pincodeStr})`,
        lat: parseFloat((profile.lat + (Math.random() * 0.1 - 0.05)).toFixed(4)),
        lng: parseFloat((profile.lng + (Math.random() * 0.1 - 0.05)).toFixed(4)),
        w: Math.max(5, Math.min(100, parseFloat((profile.w + wVar).toFixed(1)))),
        g: Math.max(5, Math.min(100, Math.round(profile.g + gVar))),
        n: Math.max(5, Math.min(100, Math.round(profile.n + nVar))),
        h2o: Math.max(5, Math.min(100, Math.round(profile.h2o + hVar))) // Task 3
    };
}

try {
    fs.writeFileSync('india_master_db.json', JSON.stringify(masterDB));
    console.log("✅ SUCCESS: 'india_master_db.json' updated with Water & Noise benchmarks.");
} catch (err) {
    console.error("❌ ERROR writing file:", err);
}