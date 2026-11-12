import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
  Cloud,
} from 'lucide-react'
import { format } from 'date-fns'
import type { WeatherData, TimeOfDay } from '../types/weather'

interface Props {
  weather: WeatherData
  tod: TimeOfDay
  periodLabel: string
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl glass px-4 py-3 transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-0.5">
      <div className="p-2 rounded-lg bg-white/10">
        <Icon className="w-5 h-5 text-sky-300" />
      </div>
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

function localFormat(unixUtc: number, offsetSec: number, fmt: string) {
  // Shift into "local" then format with UTC getters via date-fns on the shifted date
  const d = new Date((unixUtc + offsetSec) * 1000)
  return format(d, fmt)
}

export default function CurrentWeather({ weather, periodLabel }: Props) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
  const tz = weather.timezone
  const sunrise = localFormat(weather.sys.sunrise, tz, 'HH:mm')
  const sunset = localFormat(weather.sys.sunset, tz, 'HH:mm')
  const localDate = localFormat(Math.floor(Date.now() / 1000), tz, 'EEEE, d MMMM')
  const localClock = localFormat(Math.floor(Date.now() / 1000), tz, 'HH:mm')

  return (
    <div className="space-y-6 animate-[fadeUp_0.5s_ease]">
      <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-white/60 text-sm font-medium">
              <span className="tracking-wide uppercase">{localDate}</span>
              <span className="text-white/30">·</span>
              <span className="tabular-nums">{localClock}</span>
              {periodLabel && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-xs normal-case tracking-normal">
                    {periodLabel}
                  </span>
                </>
              )}
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-white tracking-tight">
              {weather.name}
              <span className="text-white/50 font-normal text-xl ml-2">
                {weather.sys.country}
              </span>
            </h1>
            <p className="mt-2 text-lg capitalize text-white/80">
              {weather.weather[0].description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={iconUrl}
              alt={weather.weather[0].description}
              className="w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl animate-float"
            />
            <div className="text-right">
              <p className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                {Math.round(weather.main.temp)}°
              </p>
              <p className="text-white/60 mt-1">
                Feels like {Math.round(weather.main.feels_like)}°
              </p>
              <p className="text-sm text-white/50 mt-1">
                H: {Math.round(weather.main.temp_max)}° · L:{' '}
                {Math.round(weather.main.temp_min)}°
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Detail icon={Wind} label="Wind" value={`${weather.wind.speed.toFixed(1)} m/s`} />
        <Detail icon={Droplets} label="Humidity" value={`${weather.main.humidity}%`} />
        <Detail icon={Eye} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
        <Detail icon={Gauge} label="Pressure" value={`${weather.main.pressure} hPa`} />
        <Detail icon={Cloud} label="Clouds" value={`${weather.clouds.all}%`} />
        <Detail icon={Thermometer} label="Feels like" value={`${Math.round(weather.main.feels_like)}°`} />
        <Detail icon={Sunrise} label="Sunrise" value={sunrise} />
        <Detail icon={Sunset} label="Sunset" value={sunset} />
      </div>
    </div>
  )
}
