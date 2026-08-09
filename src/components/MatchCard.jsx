import { useFavorites } from '../context/FavoritesContext.jsx'
import TeamLogo from './TeamLogo.jsx'
import StatusChip from './StatusChip.jsx'
import PredictionWidget from './PredictionWidget.jsx'
import { formatMatchDay, formatKickoff } from '../utils/formatDate.js'
import { matchBucket } from '../utils/matchStatus.js'
import './MatchCard.css'

export default function MatchCard({ match, variant = 'default', showPrediction = true }) {
  const { isFavorite } = useFavorites()
  const home = match.homeTeam
  const away = match.awayTeam
  if (!home || !away) return null

  const featuresFavorite = isFavorite(home.id) || isFavorite(away.id)
  const bucket = matchBucket(match.status)
  const showScore = bucket === 'live' || bucket === 'finished'
  const homeScore = match.score?.fullTime?.home
  const awayScore = match.score?.fullTime?.away
  const hasScore = homeScore != null && awayScore != null

  return (
    <article className={`match-card match-card--${variant}`}>
      <div className="match-card__tab">
        <span className="match-card__competition">{match.competitionName}</span>
        {featuresFavorite && <span className="match-card__fav-mark" title="Involves a favorite team">★</span>}
      </div>

      <div className="match-card__body">
        <TeamSide team={home} align="right" isFavorite={isFavorite(home.id)} />

        <div className="match-card__center">
          {showScore && hasScore ? (
            <span className="match-card__score">
              {homeScore} – {awayScore}
            </span>
          ) : (
            <>
              <span className="match-card__day">{formatMatchDay(match.utcDate)}</span>
              <span className="match-card__clock">{formatKickoff(match.utcDate)}</span>
            </>
          )}
          <span className="match-card__vs">{showScore && hasScore ? '' : 'VS'}</span>
        </div>

        <TeamSide team={away} align="left" isFavorite={isFavorite(away.id)} />
      </div>

      <div className="match-card__footer">
        <span className="match-card__venue">{match.venue || formatMatchDay(match.utcDate)}</span>
        <StatusChip status={match.status} />
      </div>

      {showPrediction && bucket === 'upcoming' && <PredictionWidget match={match} home={home} away={away} />}
    </article>
  )
}

function TeamSide({ team, align, isFavorite }) {
  return (
    <div className={`match-card__side match-card__side--${align}`}>
      <TeamLogo crestUrl={team.crest} name={team.name} shortName={team.tla || team.shortName} size="md" />
      <span className={`match-card__team-name${isFavorite ? ' is-favorite' : ''}`}>
        {team.shortName || team.name}
      </span>
    </div>
  )
}
