import { callFootballData } from './_footballData.js'

// GET /api/fixtures?competition=PL&dateFrom=2026-08-09&dateTo=2026-08-23
export default async function handler(req, res) {
  const { competition, dateFrom, dateTo, status } = req.query

  if (!competition) {
    res.status(400).json({ error: 'Missing required "competition" query parameter.' })
    return
  }

  const params = new URLSearchParams()
  if (dateFrom) params.set('dateFrom', dateFrom)
  if (dateTo) params.set('dateTo', dateTo)
  if (status) params.set('status', status)

  const qs = params.toString()
  await callFootballData(`/competitions/${encodeURIComponent(competition)}/matches${qs ? `?${qs}` : ''}`, res)
}
