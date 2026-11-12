# Atmos · Interactive Weather

A polished weather experience with **time-of-day moods**, weather particle effects, and free place search.

## Highlights

- **Auto day / night / dawn / golden hour / dusk** from the *location’s* local time + sunrise/sunset (no manual toggle)
- Dynamic backgrounds that match condition **and** period of day
- Rain, snow, lightning, stars, sun rays, floating clouds
- **Open-Meteo** geocoding for search (free, no key, stable)
- OpenWeatherMap for live weather + forecast (free tier key required)
- Map uses **free** CARTO / OpenStreetMap tiles — **no map API key**
- Hourly + 5-day forecast, glass UI, soft transitions

## Setup

```bash
npm install
```

Create `.env`:

```
VITE_OPENWEATHERMAP_API_KEY=your_key_here
```

Free key: https://openweathermap.org/api

```bash
npm run dev
```

## Notes

- First paint uses a neutral dark background (no bright gradient flash).
- Search is powered by Open-Meteo Geocoding API — no key, good worldwide coverage.
- Theme updates as the local clock moves (checked every minute).
