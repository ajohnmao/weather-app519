<script lang="ts">
  import type { WeatherData } from './weatherService';
  import WeatherCard from './WeatherCard.svelte';

  export let weather: WeatherData;

  // Get today's date in YYYY-MM-DD format for comparison
  const today = new Date().toISOString().split('T')[0];
</script>

<div class="forecast-section">
  <h2 class="forecast-title">10天預報 / 10-Day Forecast</h2>

  <div class="forecast-grid">
    {#each weather.forecast.forecastday as day}
      <WeatherCard
        date={day.date}
        day={day.day}
        astro={day.astro}
        isToday={day.date === today}
      />
    {/each}
  </div>
</div>

<style>
  .forecast-section {
    margin-bottom: 2rem;
  }

  .forecast-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .forecast-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .forecast-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .forecast-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>
