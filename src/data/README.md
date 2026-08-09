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

## Team logos

Every team has a `logoUrl` field, set to `null` by default. No real club
crests are bundled in this project — they're trademarked assets and this
repo doesn't have a license to redistribute them. `TeamLogo.jsx` checks this
field: if it's set, it renders that image in a fixed circular frame; if it's
`null`, it falls back to a generated badge (team-colored, initials-based) so
the layout never shifts as real logos are added.

To add real logos:

- Obtain artwork you're licensed to use — typically from a paid football
  data API that includes crest URLs (many do), or assets your organization
  has direct rights to.
- Set `logoUrl` per team to that image URL (or a local asset path under
  `public/`), e.g. `logoUrl: 'https://your-licensed-source/arsenal.png'`.
- Square/transparent PNGs or SVGs around 128–256px work best; `TeamLogo`
  scales and crops-to-contain automatically.

## Coins & predictions

`context/PredictionsContext.jsx` implements the virtual-coin prediction
game: every new browser (i.e. no `sportz:coin-balance` in `localStorage`
yet) starts with 10,000 coins (`STARTING_BALANCE`). Picking a match winner
holds a fixed stake (`STAKE`, 100 coins) from the balance; clearing a pick
before kickoff refunds it. Coins have no real-world monetary value, and
there's no deposit, withdrawal, or purchase flow — by design.

This preview has no live results feed, so it deliberately never fabricates
a match outcome or auto-settles a payout. If you connect a real fixtures API
with results later, you can extend `PredictionsContext` with a `settle`
step that credits/debits balances once a match's final result is known.
