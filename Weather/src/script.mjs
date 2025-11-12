import {
  kelvinToCelsius,
  buildCurrentWeatherUrl,
  buildForecastUrl,
  parseForecastToDailySummaries
} from './utils.mjs';

let API_KEY;
try {
  // Expect the user to copy config.example.mjs -> config.mjs and set API_KEY there
  // when running locally or deploying.
  // If config.mjs is missing, we show a friendly message.
  // eslint-disable-next-line import/no-unresolved
  // Note: browsers will fail the module import if the file doesn't exist; to avoid hard failure,
  // we wrap dynamic import in a try/catch path below.
} catch (e) {
  // noop
}

const fixedCity = 'London';
const fixedCityEl = document.getElementById('fixed-city');
fixedCityEl.textContent = fixedCity;

const currentContent = document.getElementById('current-content');
const forecastContent = document.getElementById('forecast-content');
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');

async function loadConfigKey() {
  try {
    const mod = await import('../config.mjs');
    if (mod && mod.API_KEY) API_KEY = mod.API_KEY;
  } catch (err) {
    // config.mjs not present — show message in the UI but allow offline testing of layout.
    console.warn('config.mjs not found; API key not loaded. Create config.mjs from config.example.mjs with your API key.');
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchCurrentWeather(city = fixedCity) {
  if (!API_KEY) throw new Error('API key missing. Copy config.example.mjs to config.mjs and set API_KEY.');
  const url = buildCurrentWeatherUrl(API_KEY, city);
  return fetchJson(url);
}

export async function fetch5DayForecast(city) {
  if (!API_KEY) throw new Error('API key missing. Copy config.example.mjs to config.mjs and set API_KEY.');
  const url = buildForecastUrl(API_KEY, city);
  return fetchJson(url);
}

function renderCurrentWeather(data, container = currentContent) {
  container.innerHTML = '';
  const name = data.name;
  const tempK = data.main.temp;
  const desc = data.weather[0].description;
  const html = `
    <div>
      <h3>${name}</h3>
      <p class="small">${desc}</p>
      <p><strong>${kelvinToCelsius(tempK)} °C</strong></p>
    </div>
  `;
  container.innerHTML = html;
}

function renderForecastSummaries(summaries, container = forecastContent) {
  container.innerHTML = '';
  summaries.forEach(s => {
    const cMin = kelvinToCelsius(s.temp_min);
    const cMax = kelvinToCelsius(s.temp_max);
    const el = document.createElement('div');
    el.className = 'forecast-card';
    el.innerHTML = `
      <div class="small">${s.date}</div>
      <div class="small">${s.description}</div>
      <div><strong>${cMin}°C — ${cMax}°C</strong></div>
    `;
    container.appendChild(el);
  });
}

async function showFixedCity() {
  // Try to fetch current weather; show friendly message if API key missing
  try {
    const data = await fetchCurrentWeather(fixedCity);
    renderCurrentWeather(data);
  } catch (err) {
    currentContent.innerHTML = `<p class="small">Unable to load current weather: ${err.message}</p><p class="small">Make sure config.mjs exists with API_KEY.</p>`;
  }
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  forecastContent.innerHTML = '<p class="small">Loading forecast…</p>';
  try {
    const data = await fetch5DayForecast(city);
    const summaries = parseForecastToDailySummaries(data);
    renderForecastSummaries(summaries);
  } catch (err) {
    forecastContent.innerHTML = `<p class="small">Error: ${err.message}</p>`;
  }
});

// Initialize: load config and then show fixed-city data if key available or show message
await loadConfigKey();
showFixedCity();