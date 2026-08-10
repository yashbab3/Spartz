import { useState } from 'react'
import FilterChips from '../components/FilterChips.jsx'
import FootballMatches from './sports/FootballMatches.jsx'
import BasketballMatches from './sports/BasketballMatches.jsx'
import TennisMatches from './sports/TennisMatches.jsx'
import F1Races from './sports/F1Races.jsx'
import './Matches.css'

const SPORTS = [
  { id: 'football', label: 'Football' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'f1', label: 'Formula 1' },
]

export default function Matches() {
  const [sport, setSport] = useState('football')

  return (
    <div className="section matches-page">
      <header className="matches-page__header">
        <span className="eyebrow" style={{ color: 'var(--color-pitch)' }}>
          Fixtures
        </span>
        <h1 className="matches-page__title">Matches</h1>
      </header>

      <FilterChips options={SPORTS} active={sport} onChange={setSport} />

      {sport === 'football' && <FootballMatches />}
      {sport === 'basketball' && <BasketballMatches />}
      {sport === 'tennis' && <TennisMatches />}
      {sport === 'f1' && <F1Races />}
    </div>
  )
}
