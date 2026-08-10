import { useEffect, useState } from 'react'
import { fetchF1Season } from '../api/f1Data.js'

// F1 calendars don't change minute-to-minute, so this just fetches the
// current season once per session (no polling) — cached in module scope
// like useTeams.
let cache = null
let cachePromise = null

export function useF1Season() {
  const year = new Date().getUTCFullYear()
  const [races, setRaces] = useState(cache ?? [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (cache) {
      setRaces(cache)
      setLoading(false)
      return
    }
    if (!cachePromise) cachePromise = fetchF1Season(year)

    cachePromise
      .then((data) => {
        cache = data
        if (!cancelled) {
          setRaces(data)
          setError(null)
        }
      })
      .catch((err) => {
        cachePromise = null
        if (!cancelled) setError(err.message || 'Formula 1 data is temporarily unavailable.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [year])

  return { races, loading, error }
}
