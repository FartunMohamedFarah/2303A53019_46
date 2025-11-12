import assert from 'assert';
import { kelvinToCelsius, kelvinToFahrenheit, buildCurrentWeatherUrl, buildForecastUrl, parseForecastToDailySummaries } from '../src/utils.mjs' assert { type: "js" };

// Tests for conversion functions
assert.strictEqual(kelvinToCelsius(273.15), 0.00, '273.15K => 0°C');
assert.strictEqual(kelvinToCelsius(300), 26.85, '300K => 26.85°C');

assert.strictEqual(kelvinToFahrenheit(255.372), 0.00, '255.372K => 0°F approx');
assert.strictEqual(kelvinToFahrenheit(273.15), 32.00, '273.15K => 32°F');

// Test URL builders (API key not empty)
const testKey = 'abc123';
const city = 'New York';
const curUrl = buildCurrentWeatherUrl(testKey, city);
const fUrl = buildForecastUrl(testKey, city);
assert(curUrl.includes('appid=abc123'), 'Current URL contains API key');
assert(fUrl.includes('appid=abc123'), 'Forecast URL contains API key');
assert(curUrl.includes('q=New%20York'), 'City is encoded');

// Test parseForecastToDailySummaries with small fake payload
const fake = {
  list: [
    { dt_txt: '2025-11-12 00:00:00', main: { temp: 280 }, weather: [{ description: 'clear sky' }] },
    { dt_txt: '2025-11-12 03:00:00', main: { temp: 282 }, weather: [{ description: 'clear sky' }] },
    { dt_txt: '2025-11-13 00:00:00', main: { temp: 275 }, weather: [{ description: 'rain' }] }
  ]
};
const summaries = parseForecastToDailySummaries(fake);
assert.strictEqual(summaries.length, 2, 'Two day summaries returned');
assert.strictEqual(summaries[0].description, 'clear sky');

console.log('All tests passed ✔️');