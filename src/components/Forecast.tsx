import { format } from 'date-fns'
import type { ForecastItem } from '../types/weather'
import { cn } from '../utils/cn'

interface Props {
  items: ForecastItem[]
  type: 'hourly' | 'daily'
}

export default function Forecast({ items, type }: Props) {
  return (
    <div className="rounded-3xl glass-strong p-5 md:p-6 animate-[fadeUp_0.5s_ease]">
      <h2 className="text-lg font-semibold text-white mb-4">
        {type === 'hourly' ? 'Hourly Forecast' : '5-Day Forecast'}
      </h2>

      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 -mx-1 px-1',
          type === 'daily' && 'sm:grid sm:grid-cols-5 sm:overflow-visible'
        )}
      >
        {items.map((item) => {
          const date = new Date(item.dt * 1000)
          const label = type === 'hourly' ? format(date, 'HH:mm') : format(date, 'EEE')
          const sub = type === 'daily' ? format(date, 'd MMM') : undefined

          return (
            <div
              key={item.dt}
              className={cn(
                'flex flex-col items-center gap-2 rounded-2xl glass px-4 py-4 min-w-[88px] shrink-0 transition-transform duration-200 hover:scale-105 hover:-translate-y-1',
                type === 'daily' && 'sm:min-w-0'
              )}
            >
              <span className="text-sm font-medium text-white/80">{label}</span>
              {sub && <span className="text-xs text-white/45 -mt-1">{sub}</span>}
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                className="w-12 h-12 drop-shadow-md"
              />
              <span className="text-lg font-bold text-white">
                {Math.round(item.main.temp)}°
              </span>
              {type === 'hourly' && item.pop > 0 && (
                <span className="text-xs text-sky-300">
                  {Math.round(item.pop * 100)}%
                </span>
              )}
              {type === 'daily' && (
                <span className="text-xs text-white/50 capitalize text-center leading-tight">
                  {item.weather[0].description}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
