// Utility functions exported for use in the browser and by Node tests.
// Keep this file small and pure so it's easy to test.

export function kelvinToCelsius(kelvin) {
  if (typeof kelvin !== 'number') throw new TypeError('kelvin must be a number');
  return +(kelvin - 273.15).toFixed(2);
}

export function kelvinToFahrenheit(kelvin) {
  if (typeof kelvin !== 'number') throw new TypeError('kelvin must be a number');
  return +(((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
}

export function buildCurrentWeatherUrl(apiKey, city) {
  if (!apiKey) throw new Error('API key required');
  return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}`;
}

export function buildForecastUrl(apiKey, city) {
  if (!apiKey) throw new Error('API key required');
  return `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}`;
}

// Parse OpenWeatherMap 5-day / 3-hour forecast to daily summaries.
// Returns an array of days with date, min/max temp (K) and weather description (most frequent).
export function parseForecastToDailySummaries(forecastData) {
  if (!forecastData || !Array.isArray(forecastData.list)) {
    throw new Error('Invalid forecast data');
  }
  const groups = {};
  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });

  const summaries = Object.keys(groups).map(date => {
    const items = groups[date];
    const temps = items.map(i => i.main.temp);
    // choose most common description
    const descriptions = {};
    items.forEach(i => {
      const desc = i.weather && i.weather[0] && i.weather[0].description ? i.weather[0].description : '';
      descriptions[desc] = (descriptions[desc] || 0) + 1;
    });
    const mostCommon = Object.keys(descriptions).reduce((a, b) => (descriptions[a] >= descriptions[b] ? a : b), Object.keys(descriptions)[0]);

    return {
      date,
      temp_min: Math.min(...temps),
      temp_max: Math.max(...temps),
      description: mostCommon,
    };
  });

  return summaries;
}