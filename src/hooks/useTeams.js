import { useEffect, useRef, useState } from 'react'
import { fetchAllTeams } from '../api/footballData.js'

// Simple in-memory cache so navigating between pages within a session
// doesn't refetch the full team list every time (team rosters change
// rarely, unlike live scores).
let cache = null
let cachePromise = null

export function useTeams() {
  const [teams, setTeams] = useState(cache ?? [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    if (cache) {
      setTeams(cache)
      setLoading(false)
      return () => {
        mountedRef.current = false
      }
    }

    if (!cachePromise) {
      cachePromise = fetchAllTeams()
    }

    cachePromise
      .then((data) => {
        cache = data
        if (mountedRef.current) {
          setTeams(data)
          setError(null)
        }
      })
      .catch((err) => {
        cachePromise = null
        if (mountedRef.current) setError(err.message || 'Team data is temporarily unavailable.')
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false)
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { teams, loading, error }
}
