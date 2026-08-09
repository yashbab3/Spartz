// Frontend client for the live fixtures data. Talks only to this project's
// own /api/* serverless functions (see /api/*.js) — never calls
// football-data.org directly from the browser, and never sees the API key.
//
// No sample/fake data lives in this app: if a request fails, callers get an
// `error` back and should show that fixture data is unavailable rather than
// inventing anything.

export const COMPETITIONS = [
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'CL', name: 'UEFA Champions League' },
]

async function getJson(url) {
  const res = await fetch(url)
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`)
  }
  return body
}

export async function fetchCompetitionMatches(code, { dateFrom, dateTo } = {}) {
  const params = new URLSearchParams({ competition: code })
  if (dateFrom) params.set('dateFrom', dateFrom)
  if (dateTo) params.set('dateTo', dateTo)
  const data = await getJson(`/api/fixtures?${params.toString()}`)
  return (data?.matches ?? []).map((m) => ({
    ...m,
    competitionName: data?.competition?.name ?? m.competition?.name,
    competitionCode: code,
  }))
}

// Fetches matches for every tracked competition in parallel. Competitions
// that fail (e.g. not available on the current API plan, or genuinely have
// no matches scheduled in the window) are simply omitted rather than
// surfaced as a hard error — that's how "don't show a UEFA competition
// unless it actually has scheduled matches" is enforced.
export async function fetchAllMatches({ dateFrom, dateTo } = {}) {
  const results = await Promise.allSettled(
    COMPETITIONS.map((c) => fetchCompetitionMatches(c.code, { dateFrom, dateTo })),
  )

  const matches = []
  let anySucceeded = false
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      anySucceeded = true
      matches.push(...result.value)
    }
  })

  if (!anySucceeded) {
    throw new Error('Fixture data is temporarily unavailable.')
  }

  return matches
}

export async function fetchCompetitionTeams(code) {
  const params = new URLSearchParams({ competition: code })
  const data = await getJson(`/api/teams?${params.toString()}`)
  return (data?.teams ?? []).map((t) => ({ ...t, competitionCode: code, competitionName: data?.competition?.name }))
}

export async function fetchAllTeams() {
  const results = await Promise.allSettled(COMPETITIONS.map((c) => fetchCompetitionTeams(c.code)))
  const byId = new Map()
  let anySucceeded = false
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      anySucceeded = true
      for (const team of result.value) {
        if (!byId.has(team.id)) byId.set(team.id, team)
      }
    }
  })
  if (!anySucceeded) {
    throw new Error('Team data is temporarily unavailable.')
  }
  return Array.from(byId.values())
}

export async function fetchCompetitionStandings(code) {
  const params = new URLSearchParams({ competition: code })
  return getJson(`/api/standings?${params.toString()}`)
}
