export interface WeatherData {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: { speed: number; deg: number }
  visibility: number
  clouds: { all: number }
  dt: number
  coord: { lat: number; lon: number }
  timezone: number
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: { speed: number }
  pop: number
  dt_txt: string
}

export interface ForecastData {
  list: ForecastItem[]
  city: { name: string; country: string; timezone: number }
}

export interface LocationSuggestion {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
  admin1?: string
}

export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'haze'
  | 'dust'
  | 'default'

/** Rich periods based on the location's local clock + sunrise/sunset */
export type TimeOfDay =
  | 'night'
  | 'dawn'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'golden'
  | 'dusk'

export function getCondition(main: string): WeatherCondition {
  const m = main.toLowerCase()
  if (m.includes('thunder')) return 'thunderstorm'
  if (m.includes('drizzle')) return 'drizzle'
  if (m.includes('rain')) return 'rain'
  if (m.includes('snow')) return 'snow'
  if (m.includes('clear')) return 'clear'
  if (m.includes('cloud')) return 'clouds'
  if (m.includes('mist') || m.includes('fog')) return m.includes('fog') ? 'fog' : 'mist'
  if (m.includes('haze') || m.includes('smoke')) return 'haze'
  if (m.includes('dust') || m.includes('sand')) return 'dust'
  return 'default'
}

/**
 * Compute local time-of-day for a place using its timezone offset (seconds)
 * and sunrise/sunset (UTC unix).
 */
export function getTimeOfDay(
  timezoneOffsetSec: number,
  sunriseUtc: number,
  sunsetUtc: number,
  nowMs: number = Date.now()
): TimeOfDay {
  const localMs = nowMs + timezoneOffsetSec * 1000
  const local = new Date(localMs)
  // Use UTC getters because we already shifted the timestamp
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60

  const sunriseLocal = new Date((sunriseUtc + timezoneOffsetSec) * 1000)
  const sunsetLocal = new Date((sunsetUtc + timezoneOffsetSec) * 1000)
  const sunriseH = sunriseLocal.getUTCHours() + sunriseLocal.getUTCMinutes() / 60
  const sunsetH = sunsetLocal.getUTCHours() + sunsetLocal.getUTCMinutes() / 60

  const dawnStart = sunriseH - 0.75
  const morningEnd = sunriseH + 2.5
  const middayStart = 11
  const middayEnd = 14
  const goldenStart = sunsetH - 1.25
  const duskEnd = sunsetH + 0.75

  if (hour >= dawnStart && hour < sunriseH) return 'dawn'
  if (hour >= sunriseH && hour < morningEnd) return 'morning'
  if (hour >= middayStart && hour < middayEnd) return 'midday'
  if (hour >= goldenStart && hour < sunsetH) return 'golden'
  if (hour >= sunsetH && hour < duskEnd) return 'dusk'
  if (hour >= morningEnd && hour < middayStart) return 'morning'
  if (hour >= middayEnd && hour < goldenStart) return 'afternoon'
  return 'night'
}

export function isDaytime(tod: TimeOfDay): boolean {
  return tod !== 'night' && tod !== 'dusk'
}
