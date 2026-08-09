// Maps football-data.org's raw match status codes to the three buckets the
// UI cares about: upcoming, live, or finished (plus postponed/cancelled as
// a distinct non-score state). Never infers a status from dates — always
// uses exactly what the API reported.

export function matchBucket(status) {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
      return 'live'
    case 'FINISHED':
      return 'finished'
    case 'POSTPONED':
    case 'SUSPENDED':
    case 'CANCELLED':
      return 'disrupted'
    case 'SCHEDULED':
    case 'TIMED':
    default:
      return 'upcoming'
  }
}

export function statusLabel(status) {
  switch (status) {
    case 'IN_PLAY':
      return 'Live'
    case 'PAUSED':
      return 'Half-time'
    case 'FINISHED':
      return 'Finished'
    case 'POSTPONED':
      return 'Postponed'
    case 'SUSPENDED':
      return 'Suspended'
    case 'CANCELLED':
      return 'Cancelled'
    case 'TIMED':
    case 'SCHEDULED':
      return 'Scheduled'
    default:
      return status ?? 'Scheduled'
  }
}

// Outcome from a finished match's full-time score, or null if not decided.
export function matchOutcome(match) {
  if (match.status !== 'FINISHED') return null
  const home = match.score?.fullTime?.home
  const away = match.score?.fullTime?.away
  if (home == null || away == null) return null
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}
