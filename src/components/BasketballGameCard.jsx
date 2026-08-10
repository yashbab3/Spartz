import StatusPill from './StatusPill.jsx'
import TeamLogo from './TeamLogo.jsx'
import { basketballBucket } from '../utils/basketballStatus.js'
import { formatMatchDay, formatKickoff } from '../utils/formatDate.js'
import './MatchCard.css'

export default function BasketballGameCard({ game }) {
  const home = game.teams?.home
  const away = game.teams?.away
  if (!home || !away) return null

  const bucket = basketballBucket(game.status?.short)
  const showScore = bucket === 'live' || bucket === 'finished'
  const homeScore = game.scores?.home?.total
  const awayScore = game.scores?.away?.total
  const hasScore = homeScore != null && awayScore != null
  const label = game.status?.long || game.status?.short || 'Scheduled'

  return (
    <article className="match-card">
      <div className="match-card__tab">
        <span className="match-card__competition">{game.league?.name}</span>
      </div>

      <div className="match-card__body">
        <TeamSide team={home} align="right" />

        <div className="match-card__center">
          {showScore && hasScore ? (
            <span className="match-card__score">
              {homeScore} – {awayScore}
            </span>
          ) : (
            <>
              <span className="match-card__day">{formatMatchDay(game.date)}</span>
              <span className="match-card__clock">{formatKickoff(game.date)}</span>
            </>
          )}
          <span className="match-card__vs">{showScore && hasScore ? '' : 'VS'}</span>
        </div>

        <TeamSide team={away} align="left" />
      </div>

      <div className="match-card__footer">
        <span className="match-card__venue">{game.country?.name || formatMatchDay(game.date)}</span>
        <StatusPill bucket={bucket} label={bucket === 'upcoming' ? 'Scheduled' : label} />
      </div>
    </article>
  )
}

function TeamSide({ team, align }) {
  return (
    <div className={`match-card__side match-card__side--${align}`}>
      <TeamLogo crestUrl={team.logo} name={team.name} shortName={team.code} size="md" />
      <span className="match-card__team-name">{team.name}</span>
    </div>
  )
}
