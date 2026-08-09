// Computes the virtual-game multipliers shown on the prediction widget.
//
// IMPORTANT: this is a simple in-house estimate derived from each team's
// current league standing (points + goal difference), NOT real bookmaker
// odds and not sourced from any odds/gambling data provider. It only
// affects how many virtual coins a correct pick pays out — there is no
// real money anywhere in this feature. Early in a season, before teams
// have meaningful league form, it falls back to a flat, undifferentiated
// multiplier for all three outcomes.

const FLAT = { home: 2.6, draw: 3.4, away: 2.6 }

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function round1(value) {
  return Math.round(value * 10) / 10
}

function strengthOf(entry) {
  if (!entry) return null
  return (entry.points ?? 0) * 2 + (entry.goalDifference ?? 0)
}

export function computeMultipliers(homeStanding, awayStanding) {
  const homePlayed = homeStanding?.playedGames ?? 0
  const awayPlayed = awayStanding?.playedGames ?? 0
  if (homePlayed === 0 && awayPlayed === 0) return FLAT

  const hStr = strengthOf(homeStanding)
  const aStr = strengthOf(awayStanding)
  if (hStr == null || aStr == null) return FLAT

  const diff = hStr - aStr
  const swing = clamp(diff * 0.045, -1.2, 1.2)

  const home = clamp(round1(2.6 - swing), 1.3, 4.8)
  const away = clamp(round1(2.6 + swing), 1.3, 4.8)
  const draw = clamp(round1(3.2 + Math.abs(swing) * 0.35), 2.8, 4.6)

  return { home, draw, away }
}
