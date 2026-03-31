const calculateEcoHealth = (areaData) => {
    const currentHour = new Date().getHours();
    const isPeakTime = (currentHour >= 7 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 21);

    // 1. Parameters
    const rawAqi = parseFloat(areaData.AQI_Value || 75);
    const calibratedAqi = rawAqi * 0.65;
    const aqiMathScore = Math.max(0, 100 - (calibratedAqi / 2));
    
    const green = parseFloat(areaData.Green_Score || 25);
    const waste = parseFloat(areaData.Waste_Mgmt_Score || 50);
    const noise = parseFloat(areaData.Noise_Pollution_Score || 45);
    const water = parseFloat(areaData.Water_Quality_Score || 60); // NEW

    // 2. Updated Dynamic Weighting (Total 1.0)
    let w_green, w_aqi, w_waste, w_noise, w_water;
    if (isPeakTime) {
        [w_green, w_aqi, w_waste, w_noise, w_water] = [0.25, 0.40, 0.10, 0.10, 0.15];
    } else {
        [w_green, w_aqi, w_waste, w_noise, w_water] = [0.35, 0.25, 0.15, 0.10, 0.15];
    }

    const finalScore = (green * w_green) + (aqiMathScore * w_aqi) + (waste * w_waste) + (noise * w_noise) + (water * w_water);

    return {
        total_score: parseFloat(finalScore.toFixed(1)),
        category: finalScore > 75 ? "Eco-Rich" : finalScore > 55 ? "Good" : finalScore > 40 ? "Average" : "Poor",
        area_name: areaData.Ward_Name,
        pincode: areaData.Pincode,
        temporal_active: isPeakTime,
        breakdown: {
            green: Math.round(green),
            aqi: Math.round(calibratedAqi),
            waste: Math.round(waste),
            reports: Math.round(noise),
            water: Math.round(water) // NEW
        }
    };
};

module.exports = { calculateEcoHealth };