import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Map, Icon } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { format } from 'date-fns'
import { Sun, Moon, Wind, Droplets, Eye, Gauge } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'

// Check if API key is available
if (!API_KEY) {
  console.error('OpenWeatherMap API key is missing. Please add VITE_OPENWEATHERMAP_API_KEY to your .env file.')
}

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  visibility: number
  dt: number
}

interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      icon: string
      description: string
    }>
  }>
}

function MapUpdater({ coords }: { coords: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (coords) {
      map.setView(coords, 10)
    }
  }, [coords, map])

  return null
}

interface LocationSuggestion {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const mapRef = useRef<Map | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCoords([latitude, longitude])
          fetchWeather(latitude, longitude)
          fetchForecast(latitude, longitude)
        },
        () => {
          setError('Unable to retrieve your location. Please search for a city.')
        }
      )
    } else {
      setError('Geolocation is not supported by your browser. Please search for a city.')
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchWeather = async (lat: number, lon: number) => {
    if (!API_KEY) {
      setError('API key is missing. Please check your configuration.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      setWeather(response.data)
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 401) {
        setError('Invalid API key. Please check your OpenWeatherMap API key.')
      } else if (error.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.')
      } else {
        setError('Unable to fetch weather data. Please try again.')
      }
    }
    setLoading(false)
  }

  const fetchForecast = async (lat: number, lon: number) => {
    if (!API_KEY) return

    try {
      const response = await axios.get(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      setForecast(response.data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      console.error('Unable to fetch forecast data:', error.response?.data?.message || error.message)
    }
  }

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || !API_KEY) {
      setSuggestions([])
      return
    }

    try {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query.trim()}&limit=5&appid=${API_KEY}`)
      setSuggestions(response.data)
      setShowSuggestions(true)
    } catch (err) {
      console.error('Unable to fetch suggestions:', err)
      setSuggestions([])
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCity(value)
    
    if (value.trim().length > 2) {
      fetchSuggestions(value)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
    setCity('')
    setSuggestions([])
    setShowSuggestions(false)
    setCoords([suggestion.lat, suggestion.lon])
    await fetchWeather(suggestion.lat, suggestion.lon)
    await fetchForecast(suggestion.lat, suggestion.lon)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) {
      setError('Please enter a city name.')
      return
    }

    if (!API_KEY) {
      setError('API key is missing. Please check your configuration.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city.trim()}&limit=1&appid=${API_KEY}`)
      if (geoResponse.data.length > 0) {
        const { lat, lon } = geoResponse.data[0]
        setCoords([lat, lon])
        await fetchWeather(lat, lon)
        await fetchForecast(lat, lon)
        setCity('') // Clear search input after successful search
      } else {
        setError('City not found. Please check the spelling and try again.')
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 401) {
        setError('Invalid API key. Please check your OpenWeatherMap API key.')
      } else {
        setError('An error occurred while searching. Please try again.')
      }
    }
    setLoading(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <img src="/favicon.png" className="w-12 h-12 md:w-16 md:h-16" alt="Weather App Icon" />
            <span>Advanced Weather App</span>
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative" ref={searchRef}>
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl border border-gray-700' 
                : 'bg-white border border-gray-200'
            } ${showSuggestions && suggestions.length > 0 ? 'rounded-b-none' : ''}`}>
              <svg 
                className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for a city..."
                className={`flex-grow bg-transparent focus:outline-none text-base ${
                  darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
                value={city}
                onChange={handleCityChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                aria-label="City name"
                autoComplete="off"
              />
              {city && (
                <button
                  type="button"
                  onClick={() => {
                    setCity('')
                    setSuggestions([])
                    setShowSuggestions(false)
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching
                  </span>
                ) : 'Search'}
              </button>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute z-10 w-full shadow-2xl max-h-80 overflow-y-auto rounded-b-2xl ${
                darkMode 
                  ? 'bg-gray-800 bg-opacity-95 backdrop-filter backdrop-blur-xl border-x border-b border-gray-700' 
                  : 'bg-white border-x border-b border-gray-200'
              }`}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-5 py-4 transition-all duration-200 border-b last:border-b-0 last:rounded-b-2xl flex items-center gap-3 group ${
                      darkMode 
                        ? 'border-gray-700 hover:bg-blue-600 hover:bg-opacity-20' 
                        : 'border-gray-100 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 group-hover:bg-blue-600' 
                        : 'bg-gray-100 group-hover:bg-blue-500'
                    }`}>
                      <svg 
                        className={`w-4 h-4 ${
                          darkMode 
                            ? 'text-gray-400 group-hover:text-white' 
                            : 'text-gray-600 group-hover:text-white'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {suggestion.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`md:col-span-2 rounded-lg p-6 ${darkMode ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg' : 'bg-white shadow-lg'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <p className="text-lg">{format(new Date(weather.dt * 1000), 'EEEE, h:mm a')}</p>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-6xl font-bold">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-xl capitalize">{weather.weather[0].description}</p>
                  <p className="text-lg">Feels like {Math.round(weather.main.feels_like)}°C</p>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="w-32 h-32"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Wind className="mr-2" />
                  <div>
                    <p className="text-sm">Wind</p>
                    <p className="font-semibold">{weather.wind.speed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="mr-2" />
                  <div>
                    <p className="text-sm">Humidity</p>
                    <p className="font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Eye className="mr-2" />
                  <div>
                    <p className="text-sm">Visibility</p>
                    <p className="font-semibold">{weather.visibility / 1000} km</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="mr-2" />
                  <div>
                    <p className="text-sm">Pressure</p>
                    <p className="font-semibold">{weather.main.pressure} mb</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg' : 'bg-white shadow-lg'}`}>
              {coords && (
                <MapContainer
                  center={coords}
                  zoom={10}
                  style={{ height: '100%', minHeight: '300px' }}
                  ref={mapRef}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={coords}>
                    <Popup>{weather.name}</Popup>
                  </Marker>
                  <MapUpdater coords={coords} />
                </MapContainer>
              )}
            </div>
          </div>
        )}

        {forecast && (
          <div className={`mt-8 rounded-lg p-6 ${darkMode ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg' : 'bg-white shadow-lg'}`}>
            <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {forecast.list.filter((_, index) => index % 8 === 0).map((day) => (
                <div key={day.dt} className="text-center">
                  <p className="font-semibold">{format(new Date(day.dt * 1000), 'EEE')}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                    className="w-12 h-12 mx-auto"
                  />
                  <p className="text-sm">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}