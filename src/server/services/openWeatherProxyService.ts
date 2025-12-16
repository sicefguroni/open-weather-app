// New service running on your Express server

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY; // Securely using the server key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Industry Standard Proxy: Fetches Current and 5-day Forecast securely from the backend.
 */
export const fetchWeatherProxy = async (location: string, lat: number | null, lon: number | null) => {
    // 1. Build the API URL params using the location/lat/lon logic from your old service
    let params = '';
    if (location) {
        params = `q=${encodeURIComponent(location)}`;
    } else if (lat && lon) {
        params = `lat=${lat}&lon=${lon}`;
    } else {
        throw new Error("Invalid location or coordinates provided.");
    }
    
    // 2. Fetch Current Data
    const currentUrl = `${BASE_URL}/weather?${params}&appid=${OPEN_WEATHER_KEY}&units=metric`;
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();
    
    // Check for failure before proceeding
    if (currentData.cod !== 200) {
        throw new Error(currentData.message || "Location not found.");
    }

    // 3. Fetch Forecast Data using the coordinates from the current data
    const forecastUrl = `${BASE_URL}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${OPEN_WEATHER_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // 4. Return the combined raw data (frontend will clean it up)
    return { current: currentData, forecast: forecastData };
};