// Renders a small generated crest from a team's colors + initials instead of
// pulling a real (trademarked) club logo image. Keeps the whole app free of
// external logo assets while still feeling like a real fixtures product.

const SIZES = {
  sm: 32,
  md: 44,
  lg: 72,
}

export default function TeamBadge({ team, size = 'md' }) {
  const px = SIZES[size] ?? SIZES.md
  if (!team) return null

  const { primary, secondary } = team.colors
  const gradientId = `badge-${team.id}-${size}`

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${team.name} badge`}
      className="team-badge"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <path
        d="M24 2 L44 9 V22 C44 34 36 43 24 46 C12 43 4 34 4 22 V9 Z"
        fill={`url(#${gradientId})`}
        stroke="rgba(20, 33, 24, 0.18)"
        strokeWidth="1"
      />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontWeight="600"
        fontSize="15"
        fill="#ffffff"
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.25)', strokeWidth: '0.5px' }}
      >
        {team.shortName}
      </text>
    </svg>
  )
}
