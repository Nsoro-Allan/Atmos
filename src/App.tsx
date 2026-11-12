import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import WeatherMap from './components/WeatherMap'
import WeatherEffects from './components/WeatherEffects'
import {
  getCondition,
  getTimeOfDay,
  type WeatherData,
  type ForecastData,
  type LocationSuggestion,
  type WeatherCondition,
  type TimeOfDay,
} from './types/weather'
import { getTheme, LOADING_THEME } from './utils/weatherTheme'
import { cn } from './utils/cn'

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string | undefined

/** Open-Meteo geocoding — free, no API key, stable */
async function geocodeOpenMeteo(query: string): Promise<LocationSuggestion[]> {
  const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: {
      name: query,
      count: 7,
      language: 'en',
      format: 'json',
    },
    timeout: 8000,
  })
  if (!data?.results?.length) return []
  return data.results.map(
    (r: {
      name: string
      latitude: number
      longitude: number
      country_code?: string
      country?: string
      admin1?: string
    }) => ({
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      country: r.country_code || r.country || '',
      admin1: r.admin1,
      state: r.admin1,
    })
  )
}

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(true)
  const [error, setError] = useState('')
  /** tick every minute so time-of-day can advance */
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const condition: WeatherCondition = weather
    ? getCondition(weather.weather[0].main)
    : 'default'

  const tod: TimeOfDay = useMemo(() => {
    if (!weather) return 'night'
    return getTimeOfDay(weather.timezone, weather.sys.sunrise, weather.sys.sunset, now)
  }, [weather, now])

  const theme = weather ? getTheme(condition, tod) : LOADING_THEME

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    if (!API_KEY) {
      setError(
        'Missing OpenWeatherMap API key. Add VITE_OPENWEATHERMAP_API_KEY to your .env file (free at openweathermap.org). Search still works without it once key is set.'
      )
      setLoading(false)
      setGeoLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const [wRes, fRes] = await Promise.all([
        axios.get<WeatherData>('https://api.openweathermap.org/data/2.5/weather', {
          params: { lat, lon, units: 'metric', appid: API_KEY },
        }),
        axios.get<ForecastData>('https://api.openweathermap.org/data/2.5/forecast', {
          params: { lat, lon, units: 'metric', appid: API_KEY },
        }),
      ])
      setWeather(wRes.data)
      setForecast(fRes.data)
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.status === 401
          ? 'Invalid OpenWeatherMap API key. Check VITE_OPENWEATHERMAP_API_KEY in .env.'
          : 'Could not fetch weather. Try another location.'
      setError(msg)
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
      setGeoLoading(false)
    }
  }, [])

  const fetchByCity = useCallback(
    async (city: string) => {
      setLoading(true)
      setError('')
      try {
        const results = await geocodeOpenMeteo(city)
        if (!results.length) {
          setError('Location not found. Try a different name.')
          setLoading(false)
          return
        }
        await fetchWeather(results[0].lat, results[0].lon)
      } catch {
        setError('Search failed. Please try again.')
        setLoading(false)
      }
    },
    [fetchWeather]
  )

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) return []
    try {
      return await geocodeOpenMeteo(q)
    } catch {
      return []
    }
  }, [])

  // Geolocation on first load
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoLoading(false)
      setError('Geolocation not supported. Search for a city.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        setGeoLoading(false)
        setError('Unable to retrieve your location. Please search for a city.')
      },
      { timeout: 8000 }
    )
  }, [fetchWeather])

  const hourly = useMemo(() => {
    if (!forecast) return []
    return forecast.list.slice(0, 12)
  }, [forecast])

  const daily = useMemo(() => {
    if (!forecast) return []
    return forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5)
  }, [forecast])

  return (
    <div
      className="min-h-full relative transition-[background] duration-1000 ease-in-out"
      style={{ background: theme.background }}
    >
      {weather && <WeatherEffects condition={condition} tod={tod} />}

      <div className="relative z-10 min-h-full flex flex-col">
        <header className="sticky top-0 z-30 px-4 py-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
                <span className="text-2xl">⛅</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                  Atmos
                </h1>
                <p className="text-[11px] text-white/50 tracking-wider uppercase">
                  Weather
                </p>
              </div>
            </div>

            <SearchBar
              className="flex-1"
              onSubmitCity={fetchByCity}
              onSelectSuggestion={(s) => fetchWeather(s.lat, s.lon)}
              fetchSuggestions={fetchSuggestions}
            />

            {weather && (
              <button
                onClick={() => fetchWeather(weather.coord.lat, weather.coord.lon)}
                className="p-2.5 rounded-xl glass hover:bg-white/15 transition"
                title="Refresh"
              >
                <RefreshCw
                  className={cn('w-5 h-5 text-white/80', loading && 'animate-spin')}
                />
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 pb-10 md:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {(loading || geoLoading) && !weather && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 border-t-sky-400 animate-spin" />
                <p className="text-white/60">Loading weather…</p>
              </div>
            )}

            {error && !weather && (
              <div className="flex items-start gap-3 rounded-2xl bg-rose-500/15 border border-rose-400/30 px-5 py-4 text-rose-100 max-w-xl mx-auto">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm text-rose-100/80 mt-1">{error}</p>
                </div>
              </div>
            )}

            {weather && (
              <div className="space-y-6">
                <CurrentWeather
                  weather={weather}
                  tod={tod}
                  periodLabel={theme.label}
                />

                <div className="grid lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 space-y-6">
                    {hourly.length > 0 && <Forecast items={hourly} type="hourly" />}
                    {daily.length > 0 && <Forecast items={daily} type="daily" />}
                  </div>
                  <div className="lg:col-span-2">
                    <WeatherMap
                      lat={weather.coord.lat}
                      lon={weather.coord.lon}
                      name={weather.name}
                      dark={theme.mapTiles === 'dark'}
                    />
                    <p className="mt-3 text-center text-xs text-white/40 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {weather.coord.lat.toFixed(2)}, {weather.coord.lon.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="relative z-10 py-6 text-center text-white/30 text-xs">
          Weather via OpenWeatherMap · Places via Open-Meteo · Map tiles free (CARTO / OSM)
        </footer>
      </div>
    </div>
  )
}
