<script lang="ts">
  import type { WeatherData } from './weatherService';

  export let weather: WeatherData;

  // Format date
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('zh-TW', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<div class="current-weather">
  <div class="current-weather-header">
    <div class="location-info">
      <div class="location-name">
        <h2>{weather.location.name}</h2>
        <span class="country">{weather.location.country}</span>
      </div>
      <p class="date-time">{formatDate(weather.location.localtime)}</p>
    </div>

    <div class="current-temp">
      <img
        src={weather.current.condition.icon}
        alt={weather.current.condition.text}
        width="64"
        height="64"
      />
      <div>
        <div class="temp">{Math.round(weather.current.temp_c)}°C</div>
        <p class="condition">{weather.current.condition.text}</p>
      </div>
    </div>
  </div>

  <div class="weather-details">
    <div class="weather-detail-item">
      <div class="detail-label">體感溫度 / Feels Like</div>
      <div class="detail-value">{Math.round(weather.current.feelslike_c)}°C</div>
    </div>

    <div class="weather-detail-item">
      <div class="detail-label">濕度 / Humidity</div>
      <div class="detail-value">{weather.current.humidity}%</div>
    </div>

    <div class="weather-detail-item">
      <div class="detail-label">風速 / Wind</div>
      <div class="detail-value">{weather.current.wind_kph} km/h</div>
    </div>

    <div class="weather-detail-item">
      <div class="detail-label">紫外線 / UV</div>
      <div class="detail-value">{weather.current.uv}</div>
    </div>
  </div>
</div>

<style>
  .current-weather {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .current-weather-header {
    display: flex;
    flex-direction: column;
  }

  .location-name {
    display: flex;
    align-items: center;
  }

  .location-name h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  .country {
    margin-left: 0.5rem;
    color: #6b7280;
  }

  .date-time {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .current-temp {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .current-temp img {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
  }

  .temp {
    font-size: 2.25rem;
    font-weight: bold;
  }

  .condition {
    color: #4b5563;
  }

  .weather-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .weather-detail-item {
    background-color: #f3f4f6;
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  .detail-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .detail-value {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  @media (min-width: 768px) {
    .current-weather-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .current-temp {
      margin-top: 0;
    }

    .weather-details {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (prefers-color-scheme: dark) {
    .current-weather {
      background-color: #1f2937;
    }

    .country, .date-time {
      color: #9ca3af;
    }

    .condition {
      color: #d1d5db;
    }

    .weather-detail-item {
      background-color: #374151;
    }

    .detail-label {
      color: #9ca3af;
    }
  }
</style>
