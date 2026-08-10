import StatusPill from './StatusPill.jsx'
import { f1Bucket } from '../utils/f1Status.js'
import { formatMatchDay, formatKickoff } from '../utils/formatDate.js'
import './F1RaceGroup.css'

// One Grand Prix weekend: its name/circuit plus every session (practice,
// qualifying, race) that API-Formula-1 reports for it, in Kuwait time.
export default function F1RaceGroup({ name, circuit, sessions }) {
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <article className="f1-group">
      <header className="f1-group__header">
        <h3 className="f1-group__name">{name}</h3>
        {circuit && <span className="f1-group__circuit">{circuit}</span>}
      </header>

      <ul className="f1-group__sessions">
        {sorted.map((session) => {
          const bucket = f1Bucket(session.status)
          return (
            <li key={session.id} className="f1-session">
              <span className="f1-session__type">{session.type}</span>
              <span className="f1-session__time">
                {session.date ? `${formatMatchDay(session.date)} · ${formatKickoff(session.date)}` : 'Time TBD'}
              </span>
              <StatusPill
                bucket={bucket}
                label={bucket === 'finished' ? 'Finished' : bucket === 'live' ? 'Live' : 'Scheduled'}
              />
            </li>
          )
        })}
      </ul>
    </article>
  )
}
