import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import type { LocationSuggestion } from '../types/weather'
import { cn } from '../utils/cn'

interface Props {
  onSubmitCity: (query: string) => void
  onSelectSuggestion: (s: LocationSuggestion) => void
  fetchSuggestions: (query: string) => Promise<LocationSuggestion[]>
  className?: string
}

export default function SearchBar({
  onSubmitCity,
  onSelectSuggestion,
  fetchSuggestions,
  className,
}: Props) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const reqId = useRef(0)

  const runSearch = useCallback(
    async (q: string) => {
      abortRef.current?.abort()
      if (q.trim().length < 2) {
        setSuggestions([])
        setLoading(false)
        return
      }
      const id = ++reqId.current
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      try {
        const list = await fetchSuggestions(q.trim())
        if (id === reqId.current && !ac.signal.aborted) {
          setSuggestions(list)
        }
      } catch {
        if (id === reqId.current) setSuggestions([])
      } finally {
        if (id === reqId.current) setLoading(false)
      }
    },
    [fetchSuggestions]
  )

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 350)
    return () => clearTimeout(t)
  }, [query, runSearch])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setFocused(false)
    setSuggestions([])
    onSubmitCity(q)
  }

  const pick = (s: LocationSuggestion) => {
    setQuery([s.name, s.state || s.admin1, s.country].filter(Boolean).join(', '))
    setFocused(false)
    setSuggestions([])
    onSelectSuggestion(s)
  }

  const showList = focused && (suggestions.length > 0 || loading)

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300',
            'glass-strong shadow-lg shadow-black/10',
            focused && 'ring-2 ring-sky-400/40'
          )}
        >
          <Search className="w-5 h-5 text-white/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search city or place..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <Loader2 className="w-5 h-5 text-sky-300 animate-spin shrink-0" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSuggestions([])
                inputRef.current?.focus()
              }}
              className="p-1 rounded-full hover:bg-white/10 transition shrink-0"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}
          <button
            type="submit"
            className="ml-1 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition shadow-md shadow-sky-500/30 shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {showList && (
        <ul className="absolute z-50 mt-2 w-full rounded-2xl glass-strong shadow-xl overflow-hidden border border-white/10 max-h-72 overflow-y-auto">
          {loading && suggestions.length === 0 && (
            <li className="px-4 py-3 text-sm text-white/50">Searching…</li>
          )}
          {suggestions.map((s, i) => (
            <li key={`${s.lat}-${s.lon}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition text-white/90"
              >
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">
                  {s.name}
                  {(s.state || s.admin1) && (
                    <span className="text-white/50">, {s.state || s.admin1}</span>
                  )}
                  <span className="text-white/40"> · {s.country}</span>
                </span>
              </button>
            </li>
          ))}
          {!loading && suggestions.length === 0 && query.length >= 2 && (
            <li className="px-4 py-3 text-sm text-white/50">No places found</li>
          )}
        </ul>
      )}
    </div>
  )
}
