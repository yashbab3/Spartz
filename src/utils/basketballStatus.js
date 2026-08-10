// Maps API-Basketball's status.short codes to this app's three buckets.
// Reference: NS (not started), Q1-Q4/OT/HT/BT (in progress), FT/AOT
// (finished), POST/CANC/SUSP (disrupted).
export function basketballBucket(shortStatus) {
  switch (shortStatus) {
    case 'FT':
    case 'AOT':
      return 'finished'
    case 'POST':
    case 'CANC':
    case 'SUSP':
      return 'disrupted'
    case 'NS':
      return 'upcoming'
    default:
      // Q1, Q2, Q3, Q4, OT, HT, BT and any other in-progress code
      return 'live'
  }
}
