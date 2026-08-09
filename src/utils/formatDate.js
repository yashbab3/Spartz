// All kickoff times in this app are displayed in Kuwait local time
// (Asia/Kuwait, UTC+3), regardless of the viewer's device timezone.
const KUWAIT_TZ = 'Asia/Kuwait'

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  timeZone: KUWAIT_TZ,
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: KUWAIT_TZ,
})

export function formatMatchDay(isoString) {
  return dayFormatter.format(new Date(isoString))
}

export function formatKickoff(isoString) {
  return `${timeFormatter.format(new Date(isoString))} +03`
}
