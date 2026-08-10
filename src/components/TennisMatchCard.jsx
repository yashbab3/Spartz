import StatusPill from './StatusPill.jsx'
import { formatMatchDay, formatKickoff } from '../utils/formatDate.js'
import './TennisMatchCard.css'

// Defensive field access throughout: this app's key covers the free tier
// of Live Tennis API, and exact response field names should be verified
// against docs.livetennisapi.com — we never invent a score or player name
// that isn't actually present in the response.
export default function TennisMatchCard({ match, live }) {
  const p1 = match.player1?.name || match.home?.name || match.players?.[0]?.name
  const p2 = match.player2?.name || match.away?.name || match.players?.[1]?.name
  if (!p1 || !p2) return null

  const tournament = match.tournament?.name || match.event?.name || 'Tournament'
  const round = match.round
  const kickoff = match.start_time || match.scheduled_at || match.date

  return (
    <article className="tennis-card">
      <div className="tennis-card__header">
        <span className="tennis-card__tournament">{tournament}</span>
        {round && <span className="tennis-card__round">{round}</span>}
      </div>

      <div className="tennis-card__players">
        <span className="tennis-card__player">{p1}</span>
        <span className="tennis-card__vs">vs</span>
        <span className="tennis-card__player">{p2}</span>
      </div>

      {live && match.score && (
        <div className="tennis-card__score">
          {Array.isArray(match.score.sets) && (
            <span>Sets {match.score.sets.join(' – ')}</span>
          )}
          {Array.isArray(match.score.games) && match.score.games.length > 0 && (
            <span>
              Games {match.score.games[match.score.games.length - 1]?.join('–')}
            </span>
          )}
        </div>
      )}

      <div className="tennis-card__footer">
        <span className="tennis-card__time">
          {kickoff ? `${formatMatchDay(kickoff)} · ${formatKickoff(kickoff)}` : 'Time TBD'}
        </span>
        <StatusPill bucket={live ? 'live' : 'upcoming'} label={live ? 'Live' : 'Scheduled'} />
      </div>
    </article>
  )
}
