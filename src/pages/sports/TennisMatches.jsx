import { useTennisMatches } from '../../hooks/useTennisMatches.js'
import TennisMatchCard from '../../components/TennisMatchCard.jsx'
import './FootballMatches.css'

export default function TennisMatches() {
  const { live, upcoming, loading, error } = useTennisMatches()

  if (loading) {
    return (
      <div className="matches-page__grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 130 }} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-banner state-banner--error">
        <strong>Tennis data is temporarily unavailable</strong>
        <span>{error}</span>
      </div>
    )
  }

  if (live.length === 0 && upcoming.length === 0) {
    return <p className="matches-page__empty">No confirmed tennis matches live or scheduled right now.</p>
  }

  return (
    <>
      {live.length > 0 && (
        <div className="matches-page__group">
          <h2 className="matches-page__day">Live now</h2>
          <div className="matches-page__grid">
            {live.map((match) => (
              <TennisMatchCard key={match.id} match={match} live />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="matches-page__group">
          <h2 className="matches-page__day">Upcoming</h2>
          <div className="matches-page__grid">
            {upcoming.map((match) => (
              <TennisMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      <p className="matches-page__empty" style={{ marginTop: 24 }}>
        Finished match results require a higher Live Tennis API plan than this app's free-tier key —
        they're intentionally left out rather than shown incorrectly.
      </p>
    </>
  )
}
