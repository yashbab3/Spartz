// Frontend client for live basketball data (API-Basketball via api-sports.io,
// proxied server-side through /api/basketball-games). No sample data — a
// failed request surfaces an error, never an invented game.

async function getJson(url) {
  const res = await fetch(url)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`)
  return body
}

export async function fetchBasketballGamesForDate(date) {
  const params = new URLSearchParams({ date })
  const data = await getJson(`/api/basketball-games?${params.toString()}`)
  return data?.response ?? []
}

function isoDate(offsetDays) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

// Basketball's API is queried one calendar day at a time, so this fetches a
// small window (yesterday through tomorrow) and merges it — enough to cover
// live/just-finished/upcoming without burning through the free daily quota.
export async function fetchBasketballWindow() {
  const dates = [isoDate(-1), isoDate(0), isoDate(1)]
  const results = await Promise.allSettled(dates.map(fetchBasketballGamesForDate))

  const games = []
  let anySucceeded = false
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      anySucceeded = true
      games.push(...result.value)
    }
  })

  if (!anySucceeded) throw new Error('Basketball data is temporarily unavailable.')
  return games
}
