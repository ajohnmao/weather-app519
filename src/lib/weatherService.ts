// Weather API types
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    uv: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    daily_chance_of_rain: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: {
    time: string;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    chance_of_rain: number;
  }[];
}

// Cache interface
interface CacheItem {
  data: WeatherData;
  timestamp: number;
}

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Weather API key and base URL
const API_KEY = '31bfab9b5c68470087f65112251505';
const API_BASE_URL = 'http://api.weatherapi.com/v1';

// Cache storage
const cache: Record<string, CacheItem> = {};

/**
 * Get weather data for a location
 * @param query Location query (city name, lat/lon, etc.)
 * @param days Number of forecast days (default: 10)
 * @returns Promise with weather data
 */
export async function getWeatherData(query: string, days: number = 10): Promise<WeatherData> {
  // Check cache first
  const cacheKey = `${query}_${days}`;
  const cachedData = cache[cacheKey];

  // If we have valid cached data, return it
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log('Using cached weather data for', query);
    return cachedData.data;
  }

  // Otherwise fetch from API
  console.log('Fetching fresh weather data for', query);
  try {
    const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=${days}&aqi=no&alerts=no`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data: WeatherData = await response.json();

    // Cache the result
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Clear the weather data cache
 */
export function clearWeatherCache(): void {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}
