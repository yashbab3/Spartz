import { useFavorites } from '../context/FavoritesContext.jsx'
import TeamLogo from './TeamLogo.jsx'
import './TeamCard.css'

export default function TeamCard({ team }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(team.id)

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

      <TeamLogo crestUrl={team.crest} name={team.name} shortName={team.tla || team.shortName} size="lg" />

      <div className="team-card__info">
        <h3 className="team-card__name">{team.shortName || team.name}</h3>
        <p className="team-card__league">{team.competitionName}</p>
        <dl className="team-card__meta">
          <div>
            <dt>Country</dt>
            <dd>{team.area?.name ?? '—'}</dd>
          </div>
          <div>
            <dt>Stadium</dt>
            <dd>{team.venue || '—'}</dd>
          </div>
          <div>
            <dt>Founded</dt>
            <dd>{team.founded ?? '—'}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
