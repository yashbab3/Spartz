import { getTeamById } from '../data/teams.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import TeamBadge from './TeamBadge.jsx'
import StatusChip from './StatusChip.jsx'
import { formatMatchDay, formatKickoff } from '../utils/formatDate.js'
import './MatchCard.css'

export default function MatchCard({ match, variant = 'default' }) {
  const home = getTeamById(match.homeTeamId)
  const away = getTeamById(match.awayTeamId)
  const { isFavorite } = useFavorites()
  const featuresFavorite = isFavorite(home?.id) || isFavorite(away?.id)

  if (!home || !away) return null

  return (
    <article className={`match-card match-card--${variant}`}>
      <div className="match-card__tab">
        <span className="match-card__competition">{match.competition}</span>
        {featuresFavorite && <span className="match-card__fav-mark" title="Involves a favorite team">★</span>}
      </div>

      <div className="match-card__body">
        <TeamSide team={home} align="right" isFavorite={isFavorite(home.id)} />

        <div className="match-card__center">
          <span className="match-card__day">{formatMatchDay(match.kickoff)}</span>
          <span className="match-card__clock">{formatKickoff(match.kickoff)}</span>
          <span className="match-card__vs">VS</span>
        </div>

        <TeamSide team={away} align="left" isFavorite={isFavorite(away.id)} />
      </div>

      <div className="match-card__footer">
        <span className="match-card__venue">{match.venue}</span>
        <StatusChip status={match.status} />
      </div>
    </article>
  )
}

function TeamSide({ team, align, isFavorite }) {
  return (
    <div className={`match-card__side match-card__side--${align}`}>
      <TeamBadge team={team} size="md" />
      <span className={`match-card__team-name${isFavorite ? ' is-favorite' : ''}`}>{team.name}</span>
    </div>
  )
}
