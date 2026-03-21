const fs = require('fs');

// 1. Comprehensive Mapping: First 2 digits of Pincode -> State Name
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

// 2. Diversified Environmental Baselines
// We've adjusted these to create high contrast for your demo.
const environmentalProfiles = {
    "DELHI": { w: 55.6, g: 18, n: 82 },        // High urban density, low green
    "MAHARASHTRA": { w: 42.2, g: 38, n: 65 },  // Baseline Mumbai
    "KARNATAKA": { w: 41.9, g: 62, n: 55 },    // Higher green cover (Bangalore)
    "KERALA": { w: 65.0, g: 88, n: 30 },       // Eco-Rich Profile
    "GUJARAT": { w: 100.0, g: 26, n: 50 },     // Max Waste efficiency
    "RAJASTHAN": { w: 36.7, g: 12, n: 45 },    // Arid / Low vegetation
    "HIMACHAL PRADESH": { w: 63.1, g: 78, n: 25 }, // High altitude green
    "CHHATTISGARH": { w: 100.0, g: 65, n: 40 },
    "TAMIL NADU": { w: 68.9, g: 42, n: 60 },
    "WEST BENGAL": { w: 54.6, g: 48, n: 70 }
};

const masterDB = {};
console.log("🚀 Generating National Database with High Contrast Logic...");

for (let i = 110001; i <= 855117; i++) {
    let pincodeStr = i.toString();
    let prefix = pincodeStr.substring(0, 2);
    
    let state = pincodeToState[prefix] || "INDIA (GENERAL)";
    let profile = environmentalProfiles[state] || { w: 50, g: 30, n: 45 };

    // Increased Noise Factor (+/- 12) to make local areas feel different
    // This prevents the "everything looks the same" issue
    let gNoise = (Math.random() * 24) - 12;
    let wNoise = (Math.random() * 14) - 7;
    let nNoise = (Math.random() * 20) - 10;

    masterDB[pincodeStr] = {
        s: state,
        w: Math.max(5, Math.min(100, parseFloat((profile.w + wNoise).toFixed(1)))),
        g: Math.max(5, Math.min(100, Math.round(profile.g + gNoise))),
        n: Math.max(5, Math.min(100, Math.round(profile.n + nNoise)))
    };
}

try {
    fs.writeFileSync('india_master_db.json', JSON.stringify(masterDB));
    console.log("✅ SUCCESS: Diversified 'india_master_db.json' created.");
} catch (err) {
    console.error("❌ ERROR:", err);
}