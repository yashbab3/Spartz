import TeamBadge from './TeamBadge.jsx'
import './TeamLogo.css'

const SIZES = {
  sm: 32,
  md: 44,
  lg: 72,
}

// Single entry point for rendering a team's mark anywhere in the app
// (match cards, prediction widget, favorites, team pages). If a team has a
// `logoUrl` (a real, properly licensed crest asset you've added — see
// src/data/README.md), it renders that in a consistent circular frame. If
// not, it falls back to the generated badge so sizing and layout never
// shift once real logos are added team-by-team.
export default function TeamLogo({ team, size = 'md' }) {
  if (!team) return null
  const px = SIZES[size] ?? SIZES.md

  if (team.logoUrl) {
    return (
      <span className={`team-logo team-logo--${size}`} style={{ width: px, height: px }}>
        <img src={team.logoUrl} alt={`${team.name} logo`} width={px} height={px} loading="lazy" />
      </span>
    )
  }

  return <TeamBadge team={team} size={size} />
}
