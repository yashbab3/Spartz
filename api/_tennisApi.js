// Shared helper for Live Tennis API (livetennisapi.com) proxy. Server-side
// only — key stays out of the browser.
const BASE_URL = 'https://api.livetennisapi.com/api/public/v1'

export async function callTennisApi(path, res) {
  const apiKey = process.env.TENNIS_API_KEY
  if (!apiKey) {
    res.status(503).json({
      error: 'Tennis data is temporarily unavailable: no TENNIS_API_KEY is configured on the server.',
    })
    return
  }

  let upstream
  try {
    upstream = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  } catch {
    res.status(502).json({ error: 'Tennis data is temporarily unavailable. Please try again shortly.' })
    return
  }

  if (upstream.status === 429) {
    res.status(429).json({ error: 'Tennis data is temporarily unavailable (rate limited).' })
    return
  }

  // Free-tier keys don't include finished-match history — surface that as
  // a clear "not available on this plan" rather than a generic failure.
  if (upstream.status === 402 || upstream.status === 403) {
    res.status(upstream.status).json({ error: 'This data requires a higher Live Tennis API plan.' })
    return
  }

  if (!upstream.ok) {
    res.status(upstream.status).json({ error: 'Tennis data is temporarily unavailable.' })
    return
  }

  const data = await upstream.json()
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
  res.status(200).json(data)
}
