import { getLeagueById } from '../data/teams.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import TeamLogo from './TeamLogo.jsx'
import './TeamCard.css'

export default function TeamCard({ team }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(team.id)
  const league = getLeagueById(team.leagueId)

  return (
    <article className={`team-card${favorite ? ' is-favorite' : ''}`}>
      <button
        type="button"
        className="team-card__fav-toggle"
        onClick={() => toggleFavorite(team.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${team.name} from favorites` : `Add ${team.name} to favorites`}
      >
        {favorite ? '★' : '☆'}
      </button>

      <TeamLogo team={team} size="lg" />

      <div className="team-card__info">
        <h3 className="team-card__name">{team.name}</h3>
        <p className="team-card__league">{league?.name}</p>
        <dl className="team-card__meta">
          <div>
            <dt>City</dt>
            <dd>{team.city}</dd>
          </div>
          <div>
            <dt>Stadium</dt>
            <dd>{team.stadium}</dd>
          </div>
          <div>
            <dt>Founded</dt>
            <dd>{team.founded}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
