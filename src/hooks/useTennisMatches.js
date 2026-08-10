import { useEffect, useRef, useState } from 'react'
import { fetchTennisMatches } from '../api/tennisData.js'

const LIVE_REFRESH_MS = 45_000
const IDLE_REFRESH_MS = 5 * 60_000

export function useTennisMatches() {
  const [live, setLive] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)
  const timerRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true

    async function load() {
      const [liveResult, upcomingResult] = await Promise.allSettled([
        fetchTennisMatches('live'),
        fetchTennisMatches('scheduled'),
      ])
      if (!mountedRef.current) return

      const liveOk = liveResult.status === 'fulfilled'
      const upcomingOk = upcomingResult.status === 'fulfilled'

      if (liveOk) setLive(liveResult.value)
      if (upcomingOk) setUpcoming(upcomingResult.value)

      if (!liveOk && !upcomingOk) {
        setError(liveResult.reason?.message || 'Tennis data is temporarily unavailable.')
      } else {
        setError(null)
      }
      setLoading(false)

      const hasLive = liveOk && liveResult.value.length > 0
      timerRef.current = setTimeout(load, hasLive ? LIVE_REFRESH_MS : IDLE_REFRESH_MS)
    }

    load()
    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
  }, [])

  return { live, upcoming, loading, error }
}
