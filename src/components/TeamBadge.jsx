// Fallback badge used only when a team has no official crest image from the
// API yet (e.g. a brief load gap). Colors are derived deterministically
// from the team name so the same team always gets the same badge — this is
// never meant to imitate a real crest, just to hold the layout.

const SIZES = { sm: 36, md: 56, lg: 96 }

const PALETTE = [
  ['#0F3D2E', '#1B6B45'],
  ['#8A1538', '#C8102E'],
  ['#0B2D5C', '#1B5FAE'],
  ['#7A4A00', '#E8A33D'],
  ['#3B0764', '#7C3AED'],
  ['#1A1A1A', '#4B5563'],
]

function paletteFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function initialsOf(name = '', shortName) {
  if (shortName) return shortName.slice(0, 3).toUpperCase()
  const words = name.split(' ').filter(Boolean)
  return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export default function TeamBadge({ name, shortName, size = 'md' }) {
  const px = SIZES[size] ?? SIZES.md
  if (!name) return null
  const [primary, secondary] = paletteFor(name)
  const gradientId = `badge-${name.replace(/\s+/g, '-')}-${size}`

  return (
    <svg width={px} height={px} viewBox="0 0 48 48" role="img" aria-label={`${name} badge`} className="team-badge">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <path
        d="M24 2 L44 9 V22 C44 34 36 43 24 46 C12 43 4 34 4 22 V9 Z"
        fill={`url(#${gradientId})`}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontWeight="600"
        fontSize="14"
        fill="#ffffff"
      >
        {initialsOf(name, shortName)}
      </text>
    </svg>
  )
}
