import { useMemo, useState } from 'react'
import { LEAGUES, TEAMS } from '../data/teams.js'
import TeamCard from '../components/TeamCard.jsx'
import FilterChips from '../components/FilterChips.jsx'
import './Teams.css'

const FILTER_OPTIONS = [{ id: 'all', label: 'All leagues' }, ...LEAGUES.map((l) => ({ id: l.id, label: l.name }))]

export default function Teams() {
  const [league, setLeague] = useState('all')
  const [query, setQuery] = useState('')

  const teams = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TEAMS.filter((team) => {
      const matchesLeague = league === 'all' || team.leagueId === league
      const matchesQuery = q.length === 0 || team.name.toLowerCase().includes(q) || team.city.toLowerCase().includes(q)
      return matchesLeague && matchesQuery
    })
  }, [league, query])

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
            placeholder="Search teams or cities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </header>

      <FilterChips options={FILTER_OPTIONS} active={league} onChange={setLeague} />

      {teams.length === 0 ? (
        <p className="teams-page__empty">No teams match your search.</p>
      ) : (
        <div className="teams-page__grid">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
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
