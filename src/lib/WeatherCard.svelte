<script lang="ts">
  import type { ForecastDay } from './weatherService';

  export let date: string;
  export let day: ForecastDay['day'];
  export let astro: ForecastDay['astro'];
  export let isToday: boolean = false;

  // Format date
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('zh-TW', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
</script>

<div class="weather-card {isToday ? 'today' : ''}">
  <div class="card-content">
    <div class="card-header">
      <h3 class="day-title">
        {isToday ? '今天 / Today' : formatDate(date)}
      </h3>
      <img
        src={day.condition.icon}
        alt={day.condition.text}
        width="64"
        height="64"
      />
    </div>

    <p class="condition-text">{day.condition.text}</p>

    <div class="temp-sun-info">
      <div class="temperatures">
        <span class="max-temp">{Math.round(day.maxtemp_c)}°</span>
        <span class="min-temp">{Math.round(day.mintemp_c)}°</span>
      </div>
      <div class="sun-times">
        <div class="sun-time">
          <svg xmlns="http://www.w3.org/2000/svg" class="sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {astro.sunrise}
        </div>
        <div class="sun-time">
          <svg xmlns="http://www.w3.org/2000/svg" class="sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          {astro.sunset}
        </div>
      </div>
    </div>

    <div class="rain-chance">
      <svg xmlns="http://www.w3.org/2000/svg" class="rain-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      <span>{day.daily_chance_of_rain}% 降雨機率 / Rain</span>
    </div>
  </div>
</div>

<style>
  .weather-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
  }

  .weather-card:hover {
    transform: scale(1.05);
  }

  .weather-card.today {
    border: 2px solid #3b82f6;
  }

  .card-content {
    padding: 1rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .day-title {
    font-weight: bold;
    font-size: 1.125rem;
  }

  .card-header img {
    width: 4rem;
    height: 4rem;
  }

  .condition-text {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.75rem;
  }

  .temp-sun-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .temperatures .max-temp {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .temperatures .min-temp {
    color: #6b7280;
    margin-left: 0.25rem;
  }

  .sun-times {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .sun-time {
    display: flex;
    align-items: center;
  }

  .sun-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
  }

  .rain-chance {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  .rain-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.25rem;
    color: #3b82f6;
  }

  @media (prefers-color-scheme: dark) {
    .weather-card {
      background-color: #1f2937;
    }

    .condition-text {
      color: #d1d5db;
    }

    .temperatures .min-temp {
      color: #9ca3af;
    }

    .sun-times {
      color: #9ca3af;
    }
  }
</style>
