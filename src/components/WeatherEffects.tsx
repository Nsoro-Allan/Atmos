import { useMemo } from 'react'
import type { WeatherCondition, TimeOfDay } from '../types/weather'

interface Props {
  condition: WeatherCondition
  tod: TimeOfDay
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function WeatherEffects({ condition, tod }: Props) {
  const isNightish = tod === 'night' || tod === 'dusk'
  const isGolden = tod === 'golden' || tod === 'dawn'

  const particles = useMemo(() => {
    if (condition === 'rain' || condition === 'drizzle') {
      const count = condition === 'rain' ? 55 : 30
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${random(0, 100)}%`,
        delay: random(0, 4),
        duration: random(0.55, 1.35),
        width: condition === 'rain' ? random(1, 2) : 1,
        height: condition === 'rain' ? random(12, 22) : random(8, 14),
        kind: 'rain' as const,
      }))
    }
    if (condition === 'snow') {
      return Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${random(0, 100)}%`,
        delay: random(0, 8),
        duration: random(6, 14),
        size: random(3, 8),
        kind: 'snow' as const,
      }))
    }
    if (condition === 'thunderstorm') {
      return Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${random(0, 100)}%`,
        delay: random(0, 3),
        duration: random(0.5, 1.2),
        width: random(1.5, 2.5),
        height: random(14, 26),
        kind: 'rain' as const,
      }))
    }
    return []
  }, [condition])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isGolden ? 0.45 : isNightish ? 0.25 : 0.3,
          background:
            condition === 'clear' && tod === 'midday'
              ? 'radial-gradient(ellipse at 50% 10%, rgba(251,191,36,0.35), transparent 55%)'
              : condition === 'clear' && (tod === 'golden' || tod === 'dawn')
              ? 'radial-gradient(ellipse at 70% 80%, rgba(249,115,22,0.4), transparent 50%)'
              : condition === 'thunderstorm'
              ? 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.3), transparent 55%)'
              : condition === 'snow'
              ? 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12), transparent 50%)'
              : 'radial-gradient(ellipse at 50% 15%, rgba(56,189,248,0.12), transparent 50%)',
        }}
      />

      {/* Sun rays — clear day */}
      {condition === 'clear' && (tod === 'morning' || tod === 'midday' || tod === 'afternoon') && (
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[150%] h-[150%] opacity-[0.18] animate-sun-rays">
          <div
            className="w-full h-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 8deg, rgba(251,191,36,0.5) 8deg 12deg, transparent 12deg 20deg, rgba(251,191,36,0.3) 20deg 24deg, transparent 24deg)',
            }}
          />
        </div>
      )}

      {/* Stars for night clear */}
      {condition === 'clear' && tod === 'night' && (
        <div className="absolute inset-0">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse-glow"
              style={{
                left: `${(i * 17 + 7) % 100}%`,
                top: `${(i * 23 + 3) % 70}%`,
                width: i % 5 === 0 ? 3 : 1.5,
                height: i % 5 === 0 ? 3 : 1.5,
                opacity: 0.3 + (i % 4) * 0.15,
                animationDelay: `${(i % 7) * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds */}
      {(condition === 'clouds' || condition === 'mist' || condition === 'fog') && (
        <>
          <div className="absolute top-[8%] left-[-10%] w-72 h-24 rounded-full bg-white/10 blur-2xl animate-cloud" />
          <div
            className="absolute top-[18%] right-[-5%] w-96 h-32 rounded-full bg-white/8 blur-3xl animate-cloud"
            style={{ animationDelay: '3s' }}
          />
          <div
            className="absolute top-[35%] left-[20%] w-64 h-20 rounded-full bg-white/6 blur-2xl animate-cloud"
            style={{ animationDelay: '6s' }}
          />
        </>
      )}

      {/* Rain */}
      {(condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') &&
        particles.map((p) =>
          p.kind === 'rain' ? (
            <div
              key={p.id}
              className="absolute top-0 animate-rain rounded-full bg-sky-200/55"
              style={{
                left: p.left,
                width: p.width,
                height: p.height,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ) : null
        )}

      {condition === 'thunderstorm' && (
        <div className="absolute inset-0 bg-white animate-lightning pointer-events-none" />
      )}

      {/* Snow */}
      {condition === 'snow' &&
        particles.map((p) =>
          p.kind === 'snow' ? (
            <div
              key={p.id}
              className="absolute top-0 animate-snow rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ) : null
        )}

      {(condition === 'mist' || condition === 'fog' || condition === 'haze') && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5" />
      )}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}
