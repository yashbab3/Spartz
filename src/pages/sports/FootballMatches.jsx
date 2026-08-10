import { useMemo, useState } from 'react'
import { useFixtures } from '../../hooks/useFixtures.js'
import { useSettlePredictions } from '../../hooks/useSettlePredictions.js'
import MatchCard from '../../components/MatchCard.jsx'
import FilterChips from '../../components/FilterChips.jsx'
import { matchBucket } from '../../utils/matchStatus.js'
import { formatMatchDay } from '../../utils/formatDate.js'
import './FootballMatches.css'

function dateOffset(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Football's live-data fixtures view — behavior unchanged from before the
// multi-sport expansion, just relocated so it can sit alongside the other
// sports under the shared sport switcher in pages/Matches.jsx.
export default function FootballMatches() {
  const { matches, loading, error } = useFixtures({ dateFrom: dateOffset(-3), dateTo: dateOffset(14) })
  useSettlePredictions(matches)
  const [competition, setCompetition] = useState('all')

  const competitionOptions = useMemo(() => {
    const seen = new Map()
    for (const m of matches) {
      if (!seen.has(m.competitionCode)) seen.set(m.competitionCode, m.competitionName)
    }
    return [{ id: 'all', label: 'All competitions' }, ...Array.from(seen, ([id, label]) => ({ id, label }))]
  }, [matches])

  const filtered = useMemo(
    () => matches.filter((m) => competition === 'all' || m.competitionCode === competition),
    [matches, competition],
  )

  const live = filtered.filter((m) => matchBucket(m.status) === 'live')
  const upcoming = filtered
    .filter((m) => matchBucket(m.status) === 'upcoming')
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
  const finished = filtered
    .filter((m) => matchBucket(m.status) === 'finished')
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))

  const upcomingByDay = useMemo(() => {
    const groups = new Map()
    for (const match of upcoming) {
      const key = formatMatchDay(match.utcDate)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(match)
    }
    return Array.from(groups.entries())
  }, [upcoming])

  if (loading) {
    return (
      <div className="matches-page__grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 180 }} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-banner state-banner--error">
        <strong>Fixture data is temporarily unavailable</strong>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <>
      <FilterChips options={competitionOptions} active={competition} onChange={setCompetition} />

      {filtered.length === 0 && (
        <p className="matches-page__empty">No confirmed fixtures are available for this competition right now.</p>
      )}

      {live.length > 0 && <MatchGroup title="Live now" matches={live} />}

      {upcomingByDay.map(([day, dayMatches]) => (
        <div key={day} className="matches-page__group">
          <h2 className="matches-page__day">{day}</h2>
          <div className="matches-page__grid">
            {dayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}

      {finished.length > 0 && <MatchGroup title="Finished" matches={finished} />}
    </>
  )
}

function MatchGroup({ title, matches }) {
  return (
    <div className="matches-page__group">
      <h2 className="matches-page__day">{title}</h2>
      <div className="matches-page__grid">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
