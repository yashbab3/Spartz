// Shared helper for the serverless proxy functions in this folder. Never
// imported by the browser bundle — only runs on Vercel's Node runtime.
const BASE_URL = 'https://api.football-data.org/v4'

export async function callFootballData(path, res) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    res.status(503).json({
      error: 'Fixture data is temporarily unavailable: no FOOTBALL_DATA_API_KEY is configured on the server.',
    })
    return
  }

  let upstream
  try {
    upstream = await fetch(`${BASE_URL}${path}`, {
      headers: { 'X-Auth-Token': apiKey },
    })
  } catch {
    res.status(502).json({ error: 'Fixture data is temporarily unavailable. Please try again shortly.' })
    return
  }

  if (upstream.status === 429) {
    res.status(429).json({ error: 'Fixture data is temporarily unavailable (rate limited). Please try again shortly.' })
    return
  }

  if (!upstream.ok) {
    res.status(upstream.status).json({ error: 'Fixture data is temporarily unavailable.' })
    return
  }

  const data = await upstream.json()
  // Cache at the edge briefly so bursts of visitors don't each hit the
  // upstream API (which has a low free-tier rate limit).
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  res.status(200).json(data)
}
