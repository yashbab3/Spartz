import { matchBucket, statusLabel } from '../utils/matchStatus.js'
import StatusPill from './StatusPill.jsx'

// Football-specific status chip — unchanged behavior, now implemented on
// top of the shared StatusPill used by the other sports.
export default function StatusChip({ status }) {
  return <StatusPill bucket={matchBucket(status)} label={statusLabel(status)} />
}
