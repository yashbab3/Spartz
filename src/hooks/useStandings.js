import { useEffect, useState } from 'react'
import { fetchCompetitionStandings } from '../api/footballData.js'

const cache = new Map() // competitionCode -> { byTeamId: Map }
const inFlight = new Map()

function indexStandings(data) {
  const byTeamId = new Map()
  const table = data?.standings?.find((s) => s.type === 'TOTAL')?.table ?? []
  for (const row of table) {
    byTeamId.set(row.team.id, row)
  }
  return { byTeamId }
}

// Standings are used only to compute this app's own virtual-game
// multipliers (see utils/predictionOdds.js) — never displayed as "real
// odds". Cached per competition for the session since standings change
// slowly compared to live scores.
export function useStandings(competitionCode) {
  const [entry, setEntry] = useState(cache.get(competitionCode) ?? null)
  const [loading, setLoading] = useState(!cache.has(competitionCode))

  useEffect(() => {
    if (!competitionCode) return
    if (cache.has(competitionCode)) {
      setEntry(cache.get(competitionCode))
      setLoading(false)
      return
    }

    let cancelled = false
    if (!inFlight.has(competitionCode)) {
      inFlight.set(
        competitionCode,
        fetchCompetitionStandings(competitionCode)
          .then(indexStandings)
          .catch(() => ({ byTeamId: new Map() })),
      )
    }

    inFlight.get(competitionCode).then((result) => {
      cache.set(competitionCode, result)
      inFlight.delete(competitionCode)
      if (!cancelled) {
        setEntry(result)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [competitionCode])

  return { standingsByTeamId: entry?.byTeamId ?? new Map(), loading }
}
