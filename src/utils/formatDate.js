const dayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

export function formatMatchDay(isoString) {
  return dayFormatter.format(new Date(isoString))
}

export function formatKickoff(isoString) {
  return timeFormatter.format(new Date(isoString))
}
