```markdown
# Weather Dashboard — Course Project

This is a minimal Weather Dashboard that demonstrates:
- Fetching current weather and a 5-day forecast from OpenWeatherMap.
- Separating pure utility functions (easy to test) from UI code.
- A tiny Node-based test runner for core JS functions.
- An optional GitHub Actions workflow can run tests and deploy to GitHub Pages.

Quick start
1. Get an API key from OpenWeatherMap: https://openweathermap.org/api
2. Copy `config.example.mjs` -> `config.mjs` and put your key there:
   - export const API_KEY = 'your_real_key_here';
3. Install dependencies:
   - npm install
4. Run locally:
   - npm run start
   - Visit http://localhost:5000

Project structure
- index.html — simple UI
- styles.css — styling
- src/utils.mjs — pure functions (conversions, URL builders, forecast parser)
- src/script.mjs — UI and API interaction
- tests/run-tests.mjs — basic Node tests for utils
- config.example.mjs — example config with API key placeholder

Tests
- Run: npm test
- The tests validate temperature conversions, URL builders, and the forecast parser using a small fake payload.

Deployment
- You can deploy to GitHub Pages. I can provide a GitHub Actions workflow that runs tests and deploys on push to main.
- If you want the deployed site to call the API without committing your key, store the API key as a repository secret (OPENWEATHER_API_KEY) and use an Action to write config.mjs at deploy time (I can add that to the workflow).

Notes & security
- Do not commit your API key. Keep `config.mjs` in `.gitignore`.
- For production, consider a server-side proxy or protected backend to avoid exposing API keys in client code.

If you want, I can:
- Add the GitHub Actions workflow that runs tests and deploys to Pages (with optional secret injection).
- Convert tests to a Jest setup and show how to mock fetch.
```