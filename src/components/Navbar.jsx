import { NavLink } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import CoinBalance from './CoinBalance.jsx'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/matches', label: 'Matches', icon: MatchesIcon },
  { to: '/teams', label: 'Teams', icon: TeamsIcon },
  { to: '/favorites', label: 'Favorites', icon: StarIcon },
]

export default function Navbar() {
  const { favoriteIds } = useFavorites()

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner section">
          <NavLink to="/" className="navbar__brand" end>
            <span className="navbar__brand-mark">S</span>
            <span className="navbar__brand-name">SPORTZ</span>
          </NavLink>

          <nav className="navbar__links" aria-label="Primary">
            {LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="navbar__link">
                {label}
                {to === '/favorites' && favoriteIds.length > 0 && (
                  <span className="navbar__badge">{favoriteIds.length}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <CoinBalance />
        </div>
      </header>

      {/* Bottom tab bar for phones */}
      <nav className="tabbar" aria-label="Primary">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="tabbar__link">
            <span className="tabbar__icon">
              <Icon />
              {to === '/favorites' && favoriteIds.length > 0 && (
                <span className="tabbar__badge">{favoriteIds.length}</span>
              )}
            </span>
            <span className="tabbar__label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MatchesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17" strokeLinecap="round" />
      <path d="M8 3v3.2M16 3v3.2" strokeLinecap="round" />
    </svg>
  )
}

function TeamsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c0-3 2.9-5 6.5-5s6.5 2 6.5 5" strokeLinecap="round" />
      <path d="M16 4.2c1.7.4 3 2 3 3.8s-1.3 3.4-3 3.8" strokeLinecap="round" />
      <path d="M17 14.2c2.4.5 4 2.2 4 4.8" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M12 3.8 14.6 9.1 20.4 9.9 16.2 14 17.2 19.8 12 17 6.8 19.8 7.8 14 3.6 9.9 9.4 9.1 12 3.8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}
