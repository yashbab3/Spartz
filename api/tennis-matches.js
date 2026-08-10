import { callTennisApi } from './_tennisApi.js'

// GET /api/tennis-matches?status=live | scheduled
export default async function handler(req, res) {
  const { status } = req.query
  if (!status) {
    res.status(400).json({ error: 'Missing required "status" query parameter.' })
    return
  }
  const params = new URLSearchParams({ status })
  await callTennisApi(`/matches?${params.toString()}`, res)
}
