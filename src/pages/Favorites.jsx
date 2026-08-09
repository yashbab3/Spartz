import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { TEAMS } from '../data/teams.js'
import { MATCHES } from '../data/matches.js'
import TeamCard from '../components/TeamCard.jsx'
import MatchCard from '../components/MatchCard.jsx'
import './Favorites.css'

export default function Favorites() {
  const { favoriteIds } = useFavorites()

  const favoriteTeams = useMemo(
    () => TEAMS.filter((team) => favoriteIds.includes(team.id)),
    [favoriteIds],
  )

  const favoriteMatches = useMemo(
    () =>
      MATCHES.filter((m) => favoriteIds.includes(m.homeTeamId) || favoriteIds.includes(m.awayTeamId)).sort(
        (a, b) => new Date(a.kickoff) - new Date(b.kickoff),
      ),
    [favoriteIds],
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
          <h2>Their upcoming fixtures</h2>
        </div>
        {favoriteMatches.length === 0 ? (
          <p className="favorites-page__empty">
            None of your favorite teams have an upcoming fixture in this sample schedule
            yet.
          </p>
        ) : (
          <div className="favorites-page__matches-grid">
            {favoriteMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
