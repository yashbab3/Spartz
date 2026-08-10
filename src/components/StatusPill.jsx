import './StatusChip.css'

// Generic status pill shared by every sport's cards. `bucket` drives the
// color treatment (upcoming default / live pulsing / finished / disrupted);
// `label` is the exact text shown.
export default function StatusPill({ bucket, label }) {
  const modifier = bucket === 'upcoming' ? '' : ` status-chip--${bucket}`
  return (
    <span className={`status-chip${modifier}`}>
      <span className="status-chip__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
