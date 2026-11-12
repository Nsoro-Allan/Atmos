import type { WeatherCondition, TimeOfDay } from '../types/weather'

export interface ThemeColors {
  /** CSS background (can be solid or multi-stop) applied as style */
  background: string
  accent: string
  particle: string
  isLightText: boolean
  mapTiles: 'light' | 'dark'
  label: string
}

const base: Record<
  WeatherCondition,
  Partial<Record<TimeOfDay, ThemeColors>> & { fallback: ThemeColors }
> = {
  clear: {
    night: {
      background:
        'radial-gradient(ellipse at 20% 0%, #1e1b4b 0%, #0f172a 45%, #020617 100%)',
      accent: 'text-yellow-200',
      particle: '#fde68a',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Clear night',
    },
    dawn: {
      background:
        'linear-gradient(160deg, #1e3a5f 0%, #7c3a6f 35%, #f97316 70%, #fbbf24 100%)',
      accent: 'text-orange-200',
      particle: '#fdba74',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Dawn',
    },
    morning: {
      background:
        'linear-gradient(160deg, #38bdf8 0%, #60a5fa 40%, #818cf8 100%)',
      accent: 'text-amber-200',
      particle: '#fbbf24',
      isLightText: true,
      mapTiles: 'light',
      label: 'Morning',
    },
    midday: {
      background:
        'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #7dd3fc 100%)',
      accent: 'text-yellow-300',
      particle: '#fef08a',
      isLightText: true,
      mapTiles: 'light',
      label: 'Midday',
    },
    afternoon: {
      background:
        'linear-gradient(160deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)',
      accent: 'text-amber-200',
      particle: '#fcd34d',
      isLightText: true,
      mapTiles: 'light',
      label: 'Afternoon',
    },
    golden: {
      background:
        'linear-gradient(160deg, #f59e0b 0%, #f97316 35%, #db2777 70%, #7c3aed 100%)',
      accent: 'text-yellow-100',
      particle: '#fde68a',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Golden hour',
    },
    dusk: {
      background:
        'linear-gradient(160deg, #4c1d95 0%, #9d174d 40%, #1e1b4b 100%)',
      accent: 'text-pink-200',
      particle: '#f9a8d4',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Dusk',
    },
    fallback: {
      background: 'linear-gradient(160deg, #0ea5e9, #6366f1)',
      accent: 'text-sky-200',
      particle: '#7dd3fc',
      isLightText: true,
      mapTiles: 'light',
      label: 'Clear',
    },
  },
  clouds: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #334155 0%, #0f172a 60%, #020617 100%)',
      accent: 'text-slate-300',
      particle: '#94a3b8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Cloudy night',
    },
    dawn: {
      background: 'linear-gradient(160deg, #475569 0%, #64748b 40%, #94a3b8 100%)',
      accent: 'text-slate-100',
      particle: '#cbd5e1',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Cloudy dawn',
    },
    morning: {
      background: 'linear-gradient(160deg, #64748b 0%, #94a3b8 50%, #cbd5e1 100%)',
      accent: 'text-white',
      particle: '#e2e8f0',
      isLightText: true,
      mapTiles: 'light',
      label: 'Cloudy morning',
    },
    midday: {
      background: 'linear-gradient(180deg, #64748b 0%, #94a3b8 60%, #64748b 100%)',
      accent: 'text-white',
      particle: '#f1f5f9',
      isLightText: true,
      mapTiles: 'light',
      label: 'Overcast',
    },
    afternoon: {
      background: 'linear-gradient(160deg, #475569 0%, #64748b 100%)',
      accent: 'text-slate-100',
      particle: '#cbd5e1',
      isLightText: true,
      mapTiles: 'light',
      label: 'Cloudy afternoon',
    },
    golden: {
      background: 'linear-gradient(160deg, #78716c 0%, #a8a29e 40%, #57534e 100%)',
      accent: 'text-orange-100',
      particle: '#fed7aa',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Cloudy evening',
    },
    dusk: {
      background: 'linear-gradient(160deg, #1e293b 0%, #334155 100%)',
      accent: 'text-slate-300',
      particle: '#94a3b8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Cloudy dusk',
    },
    fallback: {
      background: 'linear-gradient(160deg, #64748b, #475569)',
      accent: 'text-slate-200',
      particle: '#e2e8f0',
      isLightText: true,
      mapTiles: 'light',
      label: 'Cloudy',
    },
  },
  rain: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, #0f172a 50%, #020617 100%)',
      accent: 'text-sky-300',
      particle: '#38bdf8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rainy night',
    },
    dawn: {
      background: 'linear-gradient(160deg, #1e3a5f 0%, #334155 50%, #475569 100%)',
      accent: 'text-sky-200',
      particle: '#7dd3fc',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rainy dawn',
    },
    morning: {
      background: 'linear-gradient(160deg, #334155 0%, #1e40af 50%, #1e3a5f 100%)',
      accent: 'text-sky-200',
      particle: '#7dd3fc',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rainy morning',
    },
    midday: {
      background: 'linear-gradient(180deg, #475569 0%, #1e40af 60%, #1e3a8a 100%)',
      accent: 'text-sky-200',
      particle: '#bae6fd',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rain',
    },
    afternoon: {
      background: 'linear-gradient(160deg, #334155 0%, #1e3a8a 100%)',
      accent: 'text-sky-200',
      particle: '#7dd3fc',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rainy afternoon',
    },
    golden: {
      background: 'linear-gradient(160deg, #1e3a5f 0%, #4c1d95 50%, #1e1b4b 100%)',
      accent: 'text-violet-200',
      particle: '#c4b5fd',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Evening rain',
    },
    dusk: {
      background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)',
      accent: 'text-sky-300',
      particle: '#38bdf8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rainy dusk',
    },
    fallback: {
      background: 'linear-gradient(160deg, #1e3a5f, #0f172a)',
      accent: 'text-sky-300',
      particle: '#38bdf8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Rain',
    },
  },
  drizzle: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #164e63 0%, #0f172a 60%)',
      accent: 'text-cyan-300',
      particle: '#22d3ee',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Drizzle',
    },
    midday: {
      background: 'linear-gradient(180deg, #475569 0%, #0e7490 100%)',
      accent: 'text-cyan-200',
      particle: '#a5f3fc',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Drizzle',
    },
    fallback: {
      background: 'linear-gradient(160deg, #0e7490, #164e63)',
      accent: 'text-cyan-200',
      particle: '#67e8f9',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Drizzle',
    },
  },
  thunderstorm: {
    night: {
      background: 'radial-gradient(ellipse at 50% 20%, #4c1d95 0%, #1e1b4b 40%, #020617 100%)',
      accent: 'text-purple-300',
      particle: '#c084fc',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Thunderstorm',
    },
    midday: {
      background: 'linear-gradient(180deg, #4c1d95 0%, #1e1b4b 50%, #0f172a 100%)',
      accent: 'text-violet-200',
      particle: '#e9d5ff',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Thunderstorm',
    },
    fallback: {
      background: 'linear-gradient(160deg, #4c1d95, #0f172a)',
      accent: 'text-purple-300',
      particle: '#a855f7',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Thunderstorm',
    },
  },
  snow: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #334155 0%, #1e293b 50%, #0f172a 100%)',
      accent: 'text-blue-100',
      particle: '#e0f2fe',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Snowy night',
    },
    morning: {
      background: 'linear-gradient(160deg, #94a3b8 0%, #e2e8f0 50%, #cbd5e1 100%)',
      accent: 'text-slate-800',
      particle: '#ffffff',
      isLightText: false,
      mapTiles: 'light',
      label: 'Snow',
    },
    midday: {
      background: 'linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 40%, #94a3b8 100%)',
      accent: 'text-slate-800',
      particle: '#ffffff',
      isLightText: false,
      mapTiles: 'light',
      label: 'Snow',
    },
    fallback: {
      background: 'linear-gradient(160deg, #94a3b8, #64748b)',
      accent: 'text-white',
      particle: '#f8fafc',
      isLightText: true,
      mapTiles: 'light',
      label: 'Snow',
    },
  },
  mist: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #475569 0%, #1e293b 100%)',
      accent: 'text-slate-200',
      particle: '#cbd5e1',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Mist',
    },
    midday: {
      background: 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
      accent: 'text-white',
      particle: '#e2e8f0',
      isLightText: true,
      mapTiles: 'light',
      label: 'Mist',
    },
    fallback: {
      background: 'linear-gradient(160deg, #64748b, #475569)',
      accent: 'text-slate-100',
      particle: '#cbd5e1',
      isLightText: true,
      mapTiles: 'light',
      label: 'Mist',
    },
  },
  fog: {
    night: {
      background: 'radial-gradient(ellipse at 50% 0%, #57534e 0%, #1c1917 100%)',
      accent: 'text-stone-200',
      particle: '#d6d3d1',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Fog',
    },
    fallback: {
      background: 'linear-gradient(160deg, #78716c, #57534e)',
      accent: 'text-stone-100',
      particle: '#e7e5e4',
      isLightText: true,
      mapTiles: 'light',
      label: 'Fog',
    },
  },
  haze: {
    midday: {
      background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)',
      accent: 'text-amber-50',
      particle: '#fef3c7',
      isLightText: true,
      mapTiles: 'light',
      label: 'Haze',
    },
    fallback: {
      background: 'linear-gradient(160deg, #d97706, #92400e)',
      accent: 'text-amber-100',
      particle: '#fde68a',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Haze',
    },
  },
  dust: {
    fallback: {
      background: 'linear-gradient(160deg, #ca8a04, #78350f)',
      accent: 'text-yellow-100',
      particle: '#fcd34d',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Dust',
    },
  },
  default: {
    night: {
      background: 'radial-gradient(ellipse at 30% 0%, #1e1b4b 0%, #0f172a 100%)',
      accent: 'text-sky-300',
      particle: '#38bdf8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Night',
    },
    fallback: {
      background: 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0f172a 100%)',
      accent: 'text-sky-300',
      particle: '#38bdf8',
      isLightText: true,
      mapTiles: 'dark',
      label: 'Weather',
    },
  },
}

/** Soft neutral shell while loading — no bright flash */
export const LOADING_THEME: ThemeColors = {
  background: 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0f172a 55%, #020617 100%)',
  accent: 'text-sky-300',
  particle: '#38bdf8',
  isLightText: true,
  mapTiles: 'dark',
  label: '',
}

export function getTheme(
  condition: WeatherCondition,
  tod: TimeOfDay
): ThemeColors {
  const group = base[condition] || base.default
  return group[tod] || group.fallback
}
