import { callApiSports } from './_apiSports.js'

// GET /api/basketball-games?date=2026-08-15
export default async function handler(req, res) {
  const { date } = req.query
  if (!date) {
    res.status(400).json({ error: 'Missing required "date" query parameter.' })
    return
  }
  const params = new URLSearchParams({ date, timezone: 'Asia/Kuwait' })
  await callApiSports('v1.basketball', `/games?${params.toString()}`, res)
}
