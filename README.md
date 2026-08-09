# SPORTZ

A live football fixtures, teams, and virtual-coin prediction app. React +
Vite frontend with small Vercel serverless functions that proxy a real
fixtures API (football-data.org) server-side.

## Features

- **Home** — live-match banner when something's in play, next fixture
  spotlight, upcoming fixtures preview, popular teams.
- **Matches** — real fixtures grouped into **Live**, **Upcoming** (by day),
  and **Finished**, filterable by competition. Competition filters are
  generated from whatever actually has scheduled matches — a UEFA
  competition simply won't appear if it has none right now.
- **Teams** — browse/search real club rosters per competition, with each
  club's official crest (from the API), country, venue, and founding year.
- **Favorites** — star teams to follow; see their real upcoming/live/finished
  fixtures and your prediction history. Saved locally in the browser.
- **Predictions** — a purely virtual coin game. Every new browser starts
  with 10,000 coins (no real-world value, no deposits/withdrawals/purchases).
  Each outcome shows a multiplier (favored side lower, underdog higher) —
  this is an **in-app estimate computed from live standings, not real
  bookmaker odds**. Predictions settle automatically against each match's
  real, API-reported final score; nothing is ever guessed or fabricated.
- **Dark mode** by default, fully responsive (top nav on desktop, bottom tab
  bar on mobile).
- **Kuwait local time (UTC+3)** — every kickoff time is displayed in
  `Asia/Kuwait`, regardless of the viewer's device timezone.

There is **no fake/sample data** anywhere in this app. If the fixtures API
is unreachable or misconfigured, the UI shows a clear "temporarily
unavailable" message instead of falling back to invented matches.

## Architecture

```
src/
  api/footballData.js   Frontend client — calls this project's own /api/*
  hooks/                useFixtures (polls live), useTeams, useStandings
  components/           MatchCard, TeamCard, TeamLogo, PredictionWidget, ...
  context/               FavoritesContext, PredictionsContext (localStorage)
  pages/                 Home, Matches, Teams, Favorites
  utils/                 matchStatus.js, formatDate.js (Kuwait TZ), predictionOdds.js
api/
  _footballData.js       Shared proxy helper — reads FOOTBALL_DATA_API_KEY
  fixtures.js            GET /api/fixtures?competition=PL&dateFrom=...&dateTo=...
  teams.js               GET /api/teams?competition=PL
  standings.js           GET /api/standings?competition=PL
```

The `/api/*` files are Vercel serverless functions. They hold the
football-data.org API key server-side (`process.env.FOOTBALL_DATA_API_KEY`)
and proxy requests to it — the browser never sees the key and never calls
football-data.org directly (which also avoids CORS issues with their API).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in FOOTBALL_DATA_API_KEY
npm run dev                  # frontend only — see note below
```

`npm run dev` runs the Vite dev server, but **`/api/*` routes only work
under the Vercel runtime**, not plain Vite. For full local development with
working API routes, use the Vercel CLI instead:

```bash
npm install -g vercel
vercel dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push this project to your GitHub repo (see below).
2. Import it at [vercel.com/new](https://vercel.com/new) — it auto-detects
   Vite for the frontend and the `/api` folder for the serverless functions.
3. In **Project Settings → Environment Variables**, add:
   - `FOOTBALL_DATA_API_KEY` — your key from football-data.org. **Do not**
     prefix it with `VITE_` — it must stay server-side only.
4. Redeploy. `vercel.json` already excludes `/api/*` from the SPA rewrite,
   so both the app routes and the API routes work correctly.

## Pushing to your existing GitHub repo

I can't push to GitHub directly from this environment. From the unzipped
project folder:

```bash
git init                                   # only if this folder isn't already a git repo
git remote add origin <your-Spartz-repo-URL>   # skip if the remote already exists
git checkout main                          # or: git checkout -b main
git add -A
git commit -m "Live fixtures, real logos, dark mode, virtual prediction multipliers"
git push origin main
```

If the folder already has git history from before, just copy these changed
files over your existing checkout, then `git add -A && git commit && git
push` as usual — don't re-run `git init`.

## Notes

- No gambling, betting, or real-money features — the prediction game uses
  virtual coins only, with a fixed 10,000-coin starting balance and no way
  to buy, deposit, withdraw, or cash out for real money.
- Team crests come from football-data.org's API response for each team
  (their `crest` field) — a licensed data source — not from images bundled
  in this repo. A generated fallback badge is shown only if a crest is
  missing or fails to load.
- Prediction multipliers are this app's own simple estimate from live
  standings, clearly labeled as such in the UI — not sourced from any
  odds/gambling data provider.
