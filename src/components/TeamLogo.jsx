import { useState } from 'react'
import TeamBadge from './TeamBadge.jsx'
import './TeamLogo.css'

const SIZES = { sm: 36, md: 56, lg: 96 }

// Renders a team's real, official crest — sourced live from football-data.org
// as part of the fixtures/teams API response (their `crest` field) — in a
// consistently sized circular frame. Falls back to a generated badge only if
// no crest URL is available or the image fails to load, so layout never
// shifts either way.
export default function TeamLogo({ crestUrl, name, shortName, size = 'md' }) {
  const [failed, setFailed] = useState(false)
  const px = SIZES[size] ?? SIZES.md
  if (!name) return null

  if (crestUrl && !failed) {
    return (
      <span className={`team-logo team-logo--${size}`} style={{ width: px, height: px }}>
        <img
          src={crestUrl}
          alt={`${name} crest`}
          width={px}
          height={px}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }

  return <TeamBadge name={name} shortName={shortName} size={size} />
}
