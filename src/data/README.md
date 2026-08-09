# Data layer

`teams.js` and `matches.js` export static sample data shaped like a typical
football API response. To connect a real provider (e.g. football-data.org,
API-Football) later:

1. Create `src/api/client.js` that reads a base URL / key from
   `import.meta.env.VITE_FOOTBALL_API_KEY` (see `.env.example` — never commit
   real keys).
2. Replace the imports of `TEAMS` / `MATCHES` in `pages/Teams.jsx` and
   `pages/Matches.jsx` with a `useEffect` + `fetch` (or React Query) call
   into that client, keeping the same field names (`id`, `name`, `kickoff`,
   `status`, etc.) so the UI components don't need to change.
3. Keep `getTeamById`, `getLeagueById`, and `getMatchesForTeam` as the shape
   components rely on — reimplement them against live data if needed.
