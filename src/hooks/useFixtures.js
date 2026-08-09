import { useEffect, useRef, useState } from 'react'
import { fetchAllMatches } from '../api/footballData.js'
import { matchBucket } from '../utils/matchStatus.js'

const LIVE_REFRESH_MS = 60_000
const IDLE_REFRESH_MS = 5 * 60_000

// Fetches fixtures across all tracked competitions and keeps them fresh:
// polls every 60s while any match is live, otherwise every 5 minutes.
// Competitions with zero scheduled matches simply won't appear in the
// returned list — nothing is padded or invented.
export function useFixtures({ dateFrom, dateTo } = {}) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const matchesRef = useRef([])
  const mountedRef = useRef(true)
  const timerRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true

    async function load() {
      try {
        const data = await fetchAllMatches({ dateFrom, dateTo })
        if (!mountedRef.current) return
        matchesRef.current = data
        setMatches(data)
        setError(null)
      } catch (err) {
        if (!mountedRef.current) return
        setError(err.message || 'Fixture data is temporarily unavailable.')
      } finally {
        if (mountedRef.current) setLoading(false)
      }
      if (!mountedRef.current) return
      const hasLive = matchesRef.current.some((m) => matchBucket(m.status) === 'live')
      timerRef.current = setTimeout(load, hasLive ? LIVE_REFRESH_MS : IDLE_REFRESH_MS)
    }

    load()

    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo])

  return { matches, loading, error }
}
