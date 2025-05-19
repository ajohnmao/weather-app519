<script lang="ts">
  import { onMount } from 'svelte';
  import SearchBox from './lib/SearchBox.svelte';
  import CurrentWeather from './lib/CurrentWeather.svelte';
  import ForecastDisplay from './lib/ForecastDisplay.svelte';
  import { getWeatherData, type WeatherData } from './lib/weatherService';

  // State variables
  let weatherData: WeatherData | null = null;
  let isLoading = false;
  let error: string | null = null;
  let defaultLocation = 'taipei'; // Default location

  // Handle search event from SearchBox
  async function handleSearch(event: CustomEvent<{ query: string }>) {
    const { query } = event.detail;
    await fetchWeather(query);
  }

  // Fetch weather data
  async function fetchWeather(query: string) {
    isLoading = true;
    error = null;

    try {
      weatherData = await getWeatherData(query, 10);
    } catch (err) {
      console.error('Error fetching weather:', err);
      error = err instanceof Error ? err.message : 'Failed to fetch weather data';
      weatherData = null;
    } finally {
      isLoading = false;
    }
  }

  // On component mount, fetch default location
  onMount(async () => {
    // Try to get last searched location from localStorage
    try {
      const lastLocation = localStorage.getItem('lastLocation');
      if (lastLocation) {
        defaultLocation = lastLocation;
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }

    await fetchWeather(defaultLocation);
  });

  // Save last location to localStorage when weatherData changes
  $: if (weatherData) {
    try {
      localStorage.setItem('lastLocation', weatherData.location.name);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }
</script>

<main>
  <div class="container">
    <header>
      <h1>天氣預報 / Weather Forecast</h1>
      <p class="subtitle">
        查詢全球天氣 / Check weather worldwide
      </p>

      <SearchBox on:search={handleSearch} />
    </header>

    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
      </div>
    {:else if error}
      <div class="error-message">
        <strong>錯誤 / Error!</strong>
        <span> {error}</span>
      </div>
    {:else if weatherData}
      <CurrentWeather weather={weatherData} />
      <ForecastDisplay weather={weatherData} />
    {/if}

    <footer>
      <p>資料來源 / Data provided by <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">WeatherAPI.com</a></p>
    </footer>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  header {
    margin-bottom: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 0;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 0.25rem solid rgba(0, 0, 0, 0.1);
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-message {
    background-color: #fee2e2;
    border: 1px solid #ef4444;
    color: #b91c1c;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
  }

  footer {
    margin-top: 3rem;
    text-align: center;
    font-size: 0.875rem;
    color: #666;
  }

  footer a {
    color: #3b82f6;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  @media (prefers-color-scheme: dark) {
    .subtitle {
      color: #9ca3af;
    }

    .loading-spinner {
      border-color: rgba(255, 255, 255, 0.1);
      border-top-color: #3b82f6;
    }

    footer {
      color: #9ca3af;
    }
  }
</style>
