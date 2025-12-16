// Define the structure for the weather condition
export interface WeatherCondition {
  id: number;
  main: string; // e.g., "Rain"
  description: string; // e.g., "light rain"
  icon: string; // The icon code needed to fetch the image
}

// Define the structure for a single day/time slot in the forecast
export interface ForecastItem {
  dt: number; // Time of data calculation, unix timestamp
  main: {
    temp: number; // Temperature (in Celsius/Fahrenheit)
    feels_like: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number; 
  };
  dt_txt: string; // Date and in text format
}

// Define the structure for the aggregated forecast data
export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

// Define the structure for the current weather data
export interface CurrentWeather {
  name: string; // City name
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  dt: number; // Current time
}

// The final structure our service will return
export interface WeatherData {
  current: CurrentWeather;
  dailyForecast: DailyForecast[];
}