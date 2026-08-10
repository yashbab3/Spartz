// Frontend client for live tennis data (Live Tennis API, proxied through
// /api/tennis-matches). No sample data — a failed request surfaces an
// error, never an invented match.
//
// Note: the free-tier key this app expects only covers live and scheduled
// matches — completed-match history is a paid-tier feature upstream. The
// Tennis page reflects that with a clear message rather than pretending
// results exist.

async function getJson(url) {
  const res = await fetch(url)
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return body
}

export async function fetchTennisMatches(status) {
  const params = new URLSearchParams({ status })
  const data = await getJson(`/api/tennis-matches?${params.toString()}`)
  return data?.data ?? data?.matches ?? []
}
