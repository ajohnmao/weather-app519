<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  // Event dispatcher for search events
  const dispatch = createEventDispatcher<{
    search: { query: string };
  }>();

  // Search input value
  let searchQuery = '';
  let showSuggestions = false;
  let inputElement: HTMLInputElement;

  // Recent searches (stored in localStorage)
  let recentSearches: string[] = [];

  // Common Traditional Chinese city names for suggestions
  const commonTWCities = [
    '臺北', // Taipei
    '高雄', // Kaohsiung
    '臺中', // Taichung
    '臺南', // Tainan
    '新北', // New Taipei
    '桃園', // Taoyuan
    '新竹', // Hsinchu
    '花蓮', // Hualien
    '宜蘭', // Yilan
    '嘉義', // Chiayi
    '基隆', // Keelung
    '苗栗', // Miaoli
    '南投', // Nantou
    '屏東', // Pingtung
    '雲林', // Yunlin
    '彰化', // Changhua
    '金門', // Kinmen
    '澎湖', // Penghu
    '臺東', // Taitung
  ];

  // Common international cities
  const commonIntlCities = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Sydney',
    'Singapore',
    'Hong Kong',
    'Beijing',
    'Shanghai',
    'Seoul'
  ];

  // Filtered suggestions based on input
  $: filteredSuggestions = [...commonTWCities, ...commonIntlCities].filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase()) &&
    searchQuery.length > 0 &&
    !recentSearches.includes(city)
  ).slice(0, 5);

  // Load recent searches from localStorage on component mount
  onMount(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        recentSearches = JSON.parse(savedSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  });

  // Handle search submission
  function handleSearch() {
    if (!searchQuery.trim()) return;

    // Dispatch search event
    dispatch('search', { query: searchQuery.trim() });

    // Add to recent searches (avoid duplicates)
    if (!recentSearches.includes(searchQuery)) {
      recentSearches = [searchQuery, ...recentSearches.slice(0, 4)];

      // Save to localStorage
      try {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
    }

    // Hide suggestions after search
    showSuggestions = false;
  }

  // Handle recent search click
  function selectRecentSearch(search: string) {
    searchQuery = search;
    handleSearch();
  }

  // Handle suggestion click
  function selectSuggestion(suggestion: string) {
    searchQuery = suggestion;
    handleSearch();
    inputElement.blur();
  }

  // Clear search input
  function clearSearch() {
    searchQuery = '';
    inputElement.focus();
  }

  // No longer needed as we use inline function in the template

  // Handle input blur
  function handleBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }
</script>

<div class="search-box">
  <div class="search-container">
    <form on:submit|preventDefault={handleSearch} class="search-form">
      <div class="input-wrapper">
        <input
          type="search"
          bind:value={searchQuery}
          bind:this={inputElement}
          placeholder="搜尋城市 / Search city..."
          class="search-input"
          lang="zh-TW"
          autocomplete="off"
          on:focus={() => showSuggestions = true}
          on:blur={handleBlur}
          aria-label="搜尋城市 / Search for a city"
        />
        {#if searchQuery}
          <button
            type="button"
            class="clear-button"
            on:click={clearSearch}
            aria-label="清除搜尋 / Clear search"
          >
            ✕
          </button>
        {/if}
      </div>
      <button
        type="submit"
        class="search-button"
        aria-label="搜尋 / Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>

    {#if showSuggestions && filteredSuggestions.length > 0}
      <div class="suggestions">
        <ul class="suggestions-list">
          {#each filteredSuggestions as suggestion}
            <li>
              <button
                class="suggestion-item"
                on:click={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if recentSearches.length > 0}
      <div class="recent-searches">
        <p class="recent-searches-title">最近搜尋 / Recent searches:</p>
        <div class="recent-searches-list">
          {#each recentSearches as search}
            <button
              on:click={() => selectRecentSearch(search)}
              class="recent-search-item"
            >
              {search}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .search-box {
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
    position: relative;
  }

  .search-form {
    display: flex;
  }

  .input-wrapper {
    position: relative;
    flex-grow: 1;
    display: flex;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-right: none;
    border-radius: 0.5rem 0 0 0.5rem;
    font-size: 1rem;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "PingFang TC", "Microsoft JhengHei", sans-serif;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  .clear-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #111827;
  }

  .search-button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-button:hover {
    background-color: #2563eb;
  }

  .search-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 10;
    max-height: 15rem;
    overflow-y: auto;
  }

  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .suggestion-item {
    width: 100%;
    text-align: left;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .suggestion-item:hover {
    background-color: #f3f4f6;
  }

  .recent-searches {
    margin-top: 0.5rem;
  }

  .recent-searches-title {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .recent-searches-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .recent-search-item {
    font-size: 0.75rem;
    background-color: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .recent-search-item:hover {
    background-color: #d1d5db;
  }

  @media (prefers-color-scheme: dark) {
    .search-input {
      background-color: #1f2937;
      border-color: #4b5563;
      color: white;
    }

    .clear-button {
      color: #9ca3af;
    }

    .clear-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .suggestions {
      background-color: #1f2937;
      border-color: #4b5563;
    }

    .suggestion-item {
      color: white;
    }

    .suggestion-item:hover {
      background-color: #374151;
    }

    .recent-searches-title {
      color: #9ca3af;
    }

    .recent-search-item {
      background-color: #374151;
      color: #e5e7eb;
    }

    .recent-search-item:hover {
      background-color: #4b5563;
    }
  }
</style>
