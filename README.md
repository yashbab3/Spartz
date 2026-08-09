# SPORTZ

A football fixtures, teams, and favorites app. React + Vite, ready to deploy to
Vercel.

## Features (V1)

- **Home** — spotlight on the next fixture, upcoming fixtures preview, popular teams.
- **Matches** — upcoming fixtures grouped by day, filterable by competition, with
  team names, generated badges, competition, date/kickoff time, and status
  (Scheduled / Postponed / Time TBD — no live or final scores).
- **Teams** — browse and search all teams, filterable by league.
- **Favorites** — star teams to follow; see your favorite teams and their
  upcoming fixtures. Saved locally in the browser (`localStorage`), no account
  needed.
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
  planned for this app.
- Team crests are generated from each team's colors/initials — no external
  logo images are used, so there's no dependency on copyrighted crest
  artwork.
- Fixture data is realistic sample data for demonstration; it contains no
  live or final scores by design.
