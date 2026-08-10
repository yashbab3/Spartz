// Frontend client for live Formula 1 data (API-Formula-1 via api-sports.io,
// proxied through /api/f1-races). No sample data — a failed request
// surfaces an error, never an invented race.

async function getJson(url) {
  const res = await fetch(url)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`)
  return body
}

export async function fetchF1Season(season) {
  const params = new URLSearchParams({ season })
  const data = await getJson(`/api/f1-races?${params.toString()}`)
  return data?.response ?? []
}
