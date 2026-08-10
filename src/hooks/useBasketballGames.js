import { useEffect, useRef, useState } from 'react'
import { fetchBasketballWindow } from '../api/basketballData.js'
import { basketballBucket } from '../utils/basketballStatus.js'

const LIVE_REFRESH_MS = 60_000
const IDLE_REFRESH_MS = 5 * 60_000

export function useBasketballGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const gamesRef = useRef([])
  const mountedRef = useRef(true)
  const timerRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true

    async function load() {
      try {
        const data = await fetchBasketballWindow()
        if (!mountedRef.current) return
        gamesRef.current = data
        setGames(data)
        setError(null)
      } catch (err) {
        if (!mountedRef.current) return
        setError(err.message || 'Basketball data is temporarily unavailable.')
      } finally {
        if (mountedRef.current) setLoading(false)
      }
      if (!mountedRef.current) return
      const hasLive = gamesRef.current.some((g) => basketballBucket(g.status?.short) === 'live')
      timerRef.current = setTimeout(load, hasLive ? LIVE_REFRESH_MS : IDLE_REFRESH_MS)
    }

    load()
    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
  }, [])

  return { games, loading, error }
}
