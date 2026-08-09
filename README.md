# SPORTZ

A football fixtures, teams, and favorites app. React + Vite, ready to deploy to
Vercel.

## Features (V1)

- **Home** — spotlight on the next fixture, upcoming fixtures preview, popular teams.
- **Matches** — upcoming fixtures grouped by day, filterable by competition, with
  team logos, competition, date/kickoff time, and status
  (Scheduled / Postponed / Time TBD — no live or final scores).
- **Teams** — browse and search all teams, filterable by league.
- **Favorites** — star teams to follow; see your favorite teams and their
  upcoming fixtures. Saved locally in the browser (`localStorage`), no account
  needed.
- **Predictions** — a purely virtual coin game. Every new browser starts with
  10,000 coins (no real-world value). Pick a winner on any match card in
  Matches/Favorites for a fixed 100-coin stake; clear a pick before kickoff
  for a full refund. No deposits, withdrawals, purchases, or real-money
  features anywhere.
- Team logos: real, properly licensed crests can be dropped in per team (see
  `src/data/README.md`); until then, a consistently sized generated badge is
  shown so the layout never shifts.
- Responsive: top nav on desktop, bottom tab bar on mobile.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # optional, serves the production build locally
```

## Deploying to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import it in [Vercel](https://vercel.com/new) — it auto-detects Vite
   (Build Command: `npm run build`, Output Directory: `dist`).
3. `vercel.json` already includes an SPA rewrite so client-side routes
   (`/matches`, `/teams`, `/favorites`) work on refresh/direct load.
4. No environment variables are required for V1. If you connect a live
   football API later, add its key in Vercel's Project Settings → Environment
   Variables (never commit it) — see `.env.example` and `src/data/README.md`.

## Project structure

```
src/
  components/   Reusable UI: Navbar, MatchCard, TeamCard, StatusChip, ...
  pages/        Route-level views: Home, Matches, Teams, Favorites, NotFound
  context/      FavoritesContext (localStorage-backed)
  data/         Sample teams.js / matches.js (swap for a real API later)
  utils/        Small formatting helpers
```

## Notes

- No gambling, betting, or real-money features are included, and none are
  planned for this app. The prediction game uses virtual coins only — there
  is no way to buy, deposit, withdraw, or cash out coins for money.
- Team crests default to a generated badge (each team's colors/initials) —
  no external logo images are bundled, so there's no dependency on
  copyrighted crest artwork. Real, properly licensed logos can be added per
  team via the `logoUrl` field; see `src/data/README.md`.
- Fixture data is realistic sample data for demonstration; it contains no
  live or final scores by design, and predictions are never auto-settled
  against a fabricated result.
