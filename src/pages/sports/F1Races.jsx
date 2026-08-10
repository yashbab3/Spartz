import { useMemo } from 'react'
import { useF1Season } from '../../hooks/useF1Season.js'
import F1RaceGroup from '../../components/F1RaceGroup.jsx'
import './FootballMatches.css'

export default function F1Races() {
  const { races, loading, error } = useF1Season()

  const groups = useMemo(() => {
    const byEvent = new Map()
    for (const session of races) {
      const name = session.competition?.name || session.race?.name || 'Grand Prix'
      const circuit = session.circuit?.name || session.competition?.location?.country
      if (!byEvent.has(name)) byEvent.set(name, { name, circuit, sessions: [] })
      byEvent.get(name).sessions.push(session)
    }
    return Array.from(byEvent.values()).sort((a, b) => {
      const aDate = Math.min(...a.sessions.map((s) => new Date(s.date).getTime()))
      const bDate = Math.min(...b.sessions.map((s) => new Date(s.date).getTime()))
      return aDate - bDate
    })
  }, [races])

  if (loading) {
    return (
      <div className="matches-page__grid" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 220 }} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-banner state-banner--error">
        <strong>Formula 1 data is temporarily unavailable</strong>
        <span>{error}</span>
      </div>
    )
  }

  if (groups.length === 0) {
    return <p className="matches-page__empty">No confirmed Formula 1 calendar data available right now.</p>
  }

  return (
    <div className="matches-page__group">
      <div className="f1-groups">
        {groups.map((group) => (
          <F1RaceGroup key={group.name} name={group.name} circuit={group.circuit} sessions={group.sessions} />
        ))}
      </div>
    </div>
  )
}
