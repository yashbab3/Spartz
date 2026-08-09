import { matchBucket, statusLabel } from '../utils/matchStatus.js'
import './StatusChip.css'

export default function StatusChip({ status }) {
  const bucket = matchBucket(status)
  const modifier = bucket === 'upcoming' ? '' : ` status-chip--${bucket}`
  return (
    <span className={`status-chip${modifier}`}>
      <span className="status-chip__dot" aria-hidden="true" />
      {statusLabel(status)}
    </span>
  )
}
