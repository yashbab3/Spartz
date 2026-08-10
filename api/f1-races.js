import { callApiSports } from './_apiSports.js'

// GET /api/f1-races?season=2026
export default async function handler(req, res) {
  const { season } = req.query
  if (!season) {
    res.status(400).json({ error: 'Missing required "season" query parameter.' })
    return
  }
  const params = new URLSearchParams({ season, timezone: 'Asia/Kuwait' })
  await callApiSports('v1.formula-1', `/races?${params.toString()}`, res)
}
