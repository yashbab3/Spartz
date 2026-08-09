import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { usePredictions } from '../context/PredictionsContext.jsx'
import { useTeams } from '../hooks/useTeams.js'
import { useFixtures } from '../hooks/useFixtures.js'
import { useSettlePredictions } from '../hooks/useSettlePredictions.js'
import TeamCard from '../components/TeamCard.jsx'
import MatchCard from '../components/MatchCard.jsx'
import './Favorites.css'

function dateOffset(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function Favorites() {
  const { favoriteIds } = useFavorites()
  const { history } = usePredictions()
  const { teams } = useTeams()
  const { matches } = useFixtures({ dateFrom: dateOffset(-3), dateTo: dateOffset(14) })
  useSettlePredictions(matches)

  const favoriteTeams = useMemo(() => teams.filter((team) => favoriteIds.includes(team.id)), [teams, favoriteIds])

  const favoriteMatches = useMemo(
    () =>
      matches
        .filter((m) => favoriteIds.includes(m.homeTeam?.id) || favoriteIds.includes(m.awayTeam?.id))
        .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)),
    [matches, favoriteIds],
  )

  if (favoriteIds.length === 0) {
    return (
      <div className="section favorites-page">
        <div className="favorites-empty">
          <span className="favorites-empty__star">☆</span>
          <h1>No favorite teams yet</h1>
          <p>
            Star a team on the Teams page to follow their fixtures here — favorites are
            saved on this device.
          </p>
          <Link to="/teams" className="btn btn--gold">
            Browse teams
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section favorites-page">
      <header className="favorites-page__header">
        <span className="eyebrow" style={{ color: 'var(--color-pitch)' }}>
          Your Club{favoriteTeams.length > 1 ? 's' : ''}
        </span>
        <h1 className="favorites-page__title">Favorites</h1>
      </header>

      <section>
        <div className="section-heading">
          <h2>Teams you follow</h2>
        </div>
        <div className="favorites-page__teams-grid">
          {favoriteTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Their fixtures</h2>
        </div>
        {favoriteMatches.length === 0 ? (
          <p className="favorites-page__empty">
            No confirmed fixtures for your favorite teams in the current schedule window.
          </p>
        ) : (
          <div className="favorites-page__matches-grid">
            {favoriteMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <div className="section-heading">
            <h2>Prediction history</h2>
          </div>
          <ul className="favorites-page__history">
            {history.map((entry) => (
              <li key={`${entry.matchId}-${entry.settledAt}`} className={`history-row${entry.won ? ' is-win' : ' is-loss'}`}>
                <span className="history-row__fixture">
                  {entry.homeTeam} vs {entry.awayTeam}
                </span>
                <span className="history-row__pick">
                  Picked {entry.pick === 'draw' ? 'draw' : entry.pick} @ {entry.multiplier.toFixed(1)}x
                </span>
                <span className="history-row__result">
                  {entry.won ? `+${entry.payout.toLocaleString()}` : `-${entry.stake.toLocaleString()}`} coins
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
