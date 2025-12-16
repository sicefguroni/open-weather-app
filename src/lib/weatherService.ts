import { WeatherData, ForecastItem, DailyForecast } from '../types/weather';

const PROXY_URL = 'http://localhost:3001/api/weather?';
/**
 * Helper function to process the 3-hour forecast list into a daily forecast.
 * This meets the "Add a 5-day forecast" requirement.
 * @param {ForecastItem[]} list - The raw forecast list from the API.
 * @returns {DailyForecast[]} - A consolidated array of 5 daily forecasts.
 */
const aggregateForecast = (list: ForecastItem[]): DailyForecast[] => {
  // OpenWeatherMap gives 40 records (3-hour intervals).
  // We filter these to get one representative forecast for each day.
  const dailyMap = new Map<string, DailyForecast>();

  list.forEach(item => {
    // Extract the date (YYYY-MM-DD)
    const dateKey = item.dt_txt.split(' ')[0];

    // If it's a new day, initialize it
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: dateKey,
        temp_max: -Infinity, // Start low to find the max
        temp_min: Infinity, // Start high to find the min
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    }

    const daily = dailyMap.get(dateKey)!;

    // Update max/min temperature for that day
    daily.temp_max = Math.max(daily.temp_max, item.main.temp);
    daily.temp_min = Math.min(daily.temp_min, item.main.temp);
  });

  // We convert the map values back to an array and slice it to 5 days (excluding today)
  return Array.from(dailyMap.values()).slice(1,6); // Take 5 days starting from tomorrow
};

/**
 * Fetches current weather and 5-day forecast data from OpenWeatherMap API.
 * @param {string} location - User entered text (city/zip) OR null if using geo-coordinates.
 * @param {number | null} lat - Latitude.
 * @param {number | null} lon - Longitude.
 * @returns {Promise<WeatherData | null>} The combined weather data or null if error.
 */
export const fetchWeatherData = async (
  location: string,
  lat: number | null,
  lon: number | null
): Promise<WeatherData | null> => {

  let params: string;
  if (location) {
    // Priority 1: Query by city name or zip code
    params = `location=${encodeURIComponent(location)}`;
  } else if (lat !== null && lon !== null) {
    // Priority 2: Query by geo coordinates (for "Use Current Location")
    params = `lat=${lat}&lon=${lon}`;
  } else {
    // Guardrail: Invalid input state
    console.error("Validation failed: Must provide location or coordinates.");
    return null;
  }

  try {
    const response = await fetch(PROXY_URL + params);

    if (!response.ok) {
      // Error handling for non-200 responses (e.g., 404 Location Not Found)
      const errorBody = await response.json();
      throw new Error(`Weather API Error: ${errorBody.message || response.statusText}`);
    }

    // The data returned is the combined current/forecast data from your backend
    const rawData = await response.json(); 
        
    // Processes the data here (aggregateForecast)
    const dailyForecast = aggregateForecast(rawData.forecast.list);

    return { 
        current: rawData.current,
        dailyForecast: dailyForecast,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

