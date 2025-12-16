import React, { useState, useCallback } from 'react';
import { fetchWeatherData } from '../lib/weatherService';
import { WeatherData, DailyForecast, CurrentWeather } from '../types/weather';

// UI components
const CurrentWeatherDisplay: React.FC<{ data: CurrentWeather }> = ({
  data,
}: {
  data: CurrentWeather;
}) => (
  <div className="current-weather-card">
    <img
      src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
      alt={data.weather[0].description}
      className="current-weather-icon"
    />
    <h2 className="current-weather-location">{data.name}</h2>
    <p className="current-weather-temp">{Math.round(data.main.temp)}°C</p>
    <p className="current-weather-description">
      {data.weather[0].description}
    </p>
    <p className="current-weather-meta">
      Feels like: {Math.round(data.main.feels_like)}°C | Humidity:{" "}
      {data.main.humidity}%
    </p>
  </div>
);

const ForecastDisplay: React.FC<{ forecast: DailyForecast[] }> = ({
  forecast,
}: {
  forecast: DailyForecast[];
}) => (
  <div className="forecast-grid">
    {forecast.map((day) => (
      <div key={day.date} className="forecast-day-card">
        <p className="forecast-day-name">
          {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
        </p>
        <img
          src={`http://openweathermap.org/img/wn/${day.icon}.png`}
          alt={day.description}
          className="forecast-day-icon"
        />
        <p className="forecast-day-temp-max">{Math.round(day.temp_max)}°</p>
        <p className="forecast-day-temp-min">{Math.round(day.temp_min)}°</p>
      </div>
    ))}
  </div>
);

export const WeatherApp: React.FC = () => {
  const [locationInput, setLocationInput] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This function encapsulates the core logic of calling the service
  const fetchWeather = useCallback(async (location: string, lat: number | null = null, lon: number | null = null) => {
      setLoading(true);
      setError(null);
      setWeatherData(null);
      
      try {
          const data = await fetchWeatherData(location, lat, lon);
          if (data) {
              setWeatherData(data);
          } else {
              // If service returns null, it means an API or validation error occurred
              setError("Could not retrieve weather data. Please check the location spelling.");
          }
      } catch (e: any) {
          // Catch unexpected errors during the process
          setError(`An unexpected error occurred: ${e.message}`);
      } finally {
          setLoading(false);
      }
  }, []);

  // Handles the form submission for a user-entered location
  const handleLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!locationInput.trim()) {
          setError("Location input cannot be empty.");
          return;
      }
      fetchWeather(locationInput);
  };

  // Handles the "Current Location" feature
  const handleGeolocation = () => {
    setLoading(true);
    setError(null);

    // Prompts the user for permission to access their location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // We pass null for the location text, forcing the service to use lat/lon
          fetchWeather('', latitude, longitude);
        },
        (geoError) => {
          // Critical: Proper error handling for denied permission or GPS issues.
          setError(`Geolocation failed: ${geoError.message}. Did you allow location access?`);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <h1 className="app-title">☀️ Weather Query App</h1>

      <form onSubmit={handleLocationSubmit} className="search-form">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter City, Zip Code, or Coordinates"
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="primary-button"
          disabled={loading}
        >
          Get Weather
        </button>
      </form>

      <button 
        onClick={handleGeolocation} 
        className="secondary-button"
        disabled={loading}
      >
        Use Current Location
      </button>

      {loading && <p className="status-message status-loading">Loading weather data...</p>}
      {error && <p className="status-message status-error">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <CurrentWeatherDisplay data={weatherData.current} />
          <h3 className="forecast-title">5-Day Forecast</h3>
          <ForecastDisplay forecast={weatherData.dailyForecast} />
        </div>
      )}
    </div>
  );
};
