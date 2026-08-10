// Shared helper for API-Sports family proxies (Basketball, Formula-1).
// Same account/key works across their sports APIs. Server-side only.

export async function callApiSports(host, path, res) {
  const apiKey = process.env.APISPORTS_KEY
  if (!apiKey) {
    res.status(503).json({
      error: 'Data is temporarily unavailable: no APISPORTS_KEY is configured on the server.',
    })
    return
  }

  let upstream
  try {
    upstream = await fetch(`https://${host}.api-sports.io${path}`, {
      headers: { 'x-apisports-key': apiKey },
    })
  } catch {
    res.status(502).json({ error: 'Data is temporarily unavailable. Please try again shortly.' })
    return
  }

  if (upstream.status === 429) {
    res.status(429).json({ error: 'Data is temporarily unavailable (rate limited). Please try again shortly.' })
    return
  }

  if (!upstream.ok) {
    res.status(upstream.status).json({ error: 'Data is temporarily unavailable.' })
    return
  }

  const data = await upstream.json()
  res.setHeader('Cache-Control', 's-maxage=90, stale-while-revalidate=300')
  res.status(200).json(data)
}
