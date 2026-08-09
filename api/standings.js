import { callFootballData } from './_footballData.js'

// GET /api/standings?competition=PL
export default async function handler(req, res) {
  const { competition } = req.query
  if (!competition) {
    res.status(400).json({ error: 'Missing required "competition" query parameter.' })
    return
  }
  await callFootballData(`/competitions/${encodeURIComponent(competition)}/standings`, res)
}
