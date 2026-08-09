import { useMemo, useState } from 'react'
import { useTeams } from '../hooks/useTeams.js'
import TeamCard from '../components/TeamCard.jsx'
import FilterChips from '../components/FilterChips.jsx'
import './Teams.css'

export default function Teams() {
  const { teams, loading, error } = useTeams()
  const [league, setLeague] = useState('all')
  const [query, setQuery] = useState('')

  const leagueOptions = useMemo(() => {
    const seen = new Map()
    for (const t of teams) {
      if (!seen.has(t.competitionCode)) seen.set(t.competitionCode, t.competitionName)
    }
    return [{ id: 'all', label: 'All leagues' }, ...Array.from(seen, ([id, label]) => ({ id, label }))]
  }, [teams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teams.filter((team) => {
      const matchesLeague = league === 'all' || team.competitionCode === league
      const matchesQuery =
        q.length === 0 ||
        team.name.toLowerCase().includes(q) ||
        (team.area?.name ?? '').toLowerCase().includes(q)
      return matchesLeague && matchesQuery
    })
  }, [teams, league, query])

  return (
    <div className="section teams-page">
      <header className="teams-page__header">
        <span className="eyebrow" style={{ color: 'var(--color-pitch)' }}>
          Clubs
        </span>
        <h1 className="teams-page__title">Browse teams</h1>

        <label className="teams-page__search" htmlFor="team-search">
          <SearchIcon />
          <input
            id="team-search"
            type="search"
            placeholder="Search teams or countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </header>

      {loading && (
        <div className="teams-page__grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 220 }} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="state-banner state-banner--error">
          <strong>Team data is temporarily unavailable</strong>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <FilterChips options={leagueOptions} active={league} onChange={setLeague} />

          {filtered.length === 0 ? (
            <p className="teams-page__empty">No teams match your search.</p>
          ) : (
            <div className="teams-page__grid">
              {filtered.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.35-4.35" strokeLinecap="round" />
    </svg>
  )
}
