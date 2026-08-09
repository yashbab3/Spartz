import { MATCH_STATUS } from '../data/matches.js'
import './StatusChip.css'

const LABELS = {
  [MATCH_STATUS.SCHEDULED]: 'Scheduled',
  [MATCH_STATUS.POSTPONED]: 'Postponed',
  [MATCH_STATUS.TIME_TBD]: 'Time TBD',
}

export default function StatusChip({ status }) {
  const label = LABELS[status] ?? 'Scheduled'
  return (
    <span className={`status-chip status-chip--${status}`}>
      <span className="status-chip__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
