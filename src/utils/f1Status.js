// Maps API-Formula-1's session status strings to this app's buckets.
export function f1Bucket(status) {
  const s = (status ?? '').toLowerCase()
  if (s.includes('finish') || s.includes('post-race') || s === 'ended') return 'finished'
  if (s.includes('cancel') || s.includes('postpon')) return 'disrupted'
  if (s.includes('progress') || s.includes('live') || s.includes('started')) return 'live'
  return 'upcoming'
}
