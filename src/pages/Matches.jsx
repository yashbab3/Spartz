import { useMemo, useState } from 'react'
import { MATCHES } from '../data/matches.js'
import MatchCard from '../components/MatchCard.jsx'
import FilterChips from '../components/FilterChips.jsx'
import { formatMatchDay } from '../utils/formatDate.js'
import './Matches.css'

const COMPETITIONS = ['all', ...new Set(MATCHES.map((m) => m.competition))]
const FILTER_OPTIONS = COMPETITIONS.map((c) => ({ id: c, label: c === 'all' ? 'All competitions' : c }))

export default function Matches() {
  const [competition, setCompetition] = useState('all')

  const grouped = useMemo(() => {
    const filtered = MATCHES.filter((m) => competition === 'all' || m.competition === competition).sort(
      (a, b) => new Date(a.kickoff) - new Date(b.kickoff),
    )

    const groups = new Map()
    for (const match of filtered) {
      const key = formatMatchDay(match.kickoff)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(match)
    }
    return Array.from(groups.entries())
  }, [competition])

  return (
    <div className="section matches-page">
      <header className="matches-page__header">
        <span className="eyebrow" style={{ color: 'var(--color-pitch)' }}>
          Fixtures
        </span>
        <h1 className="matches-page__title">Upcoming matches</h1>
      </header>

      <FilterChips options={FILTER_OPTIONS} active={competition} onChange={setCompetition} />

      {grouped.length === 0 && (
        <p className="matches-page__empty">No fixtures found for this competition yet.</p>
      )}

      {grouped.map(([day, matches]) => (
        <div key={day} className="matches-page__group">
          <h2 className="matches-page__day">{day}</h2>
          <div className="matches-page__grid">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
