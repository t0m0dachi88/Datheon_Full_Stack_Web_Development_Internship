# Atmos — Live Weather Telemetry Dashboard

A responsive, framework-free weather dashboard powered by the OpenWeatherMap Geocoding, Current Weather, and 5-day / 3-hour Forecast APIs.

## Features
- Worldwide city search with disambiguation for multiple matches
- Current temperature, condition, feels-like, daily high/low, humidity, wind, pressure, visibility, sunrise and sunset
- City-local dates and forecast aggregation from 3-hour observations
- Weather-dependent atmospheric visual themes and icons
- Celsius/Fahrenheit toggle, recent search history, loading and error states
- AbortController cancellation of superseded searches
- Mobile-first responsive design and reduced-motion support

## Run locally
1. Obtain an API key at https://home.openweathermap.org/api_keys (activation may take time).
2. From this folder run `python -m http.server 8000` or use VS Code Live Server.
3. Open `http://localhost:8000` in your browser.
4. Click the gear icon and paste your API key. The key is held **only in the memory of the current browser tab**, never in localStorage.
5. Search a city, select a matching location if prompted, and view live conditions.

## API key and deployment security
A browser-only website **cannot protect a secret API key**: requests made directly from the browser expose the key in browser developer tools. This implementation avoids committing or persisting the key but **is intended for local/personal use only**. Before public deployment, build a small server-side proxy or serverless function that reads `OPENWEATHER_API_KEY` from server environment variables, enforces rate limiting, and exposes only approved weather endpoints to the frontend. `.env.example` documents the future server configuration; plain static JavaScript cannot consume a secure `.env` file.

## Architecture
- `index.html`: semantic layout and settings dialog
- `css/style.css`: responsive visual system
- `js/api.js`: OpenWeatherMap requests and HTTP error handling
- `js/forecast.js`: city-local 3-hour to daily aggregation
- `js/utils.js`: units, dates, weather icons and escaping
- `js/storage.js`: recent city persistence
- `js/ui.js`: DOM rendering and state messages
- `js/app.js`: event handlers, app state and request cancellation

## Forecast accuracy and limitations
The free 5-day/3-hour endpoint supplies a rolling window, so after excluding the current partial local day, **five complete future calendar days may not be available**. In that case the dashboard displays only the actual days returned, never invented data. Minimum and maximum temperatures are the minimum/maximum of returned forecast intervals, and averages are arithmetic means of available interval temperatures. These are forecasts, not observations. Some weather metrics are missing or approximate depending on the provider. The current condition card uses provider's observation time and local timezone offset.

## Testing
Source files were checked for presence and structure. Live API integration requires your own valid API key and internet connection. Browser layout and end-to-end interactions must be validated locally before production use. Suggested tests: valid/invalid city, ambiguous city, invalid key, rate limit, offline state, multiple quick searches, Celsius/Fahrenheit conversion, refresh persistence, 360/768/1440px layout, keyboard navigation.

## Screenshots
Add verified screenshots after running the application locally.
