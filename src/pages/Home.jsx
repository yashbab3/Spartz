import { Link } from 'react-router-dom'
import { useFixtures } from '../hooks/useFixtures.js'
import { useTeams } from '../hooks/useTeams.js'
import { useSettlePredictions } from '../hooks/useSettlePredictions.js'
import MatchCard from '../components/MatchCard.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { matchBucket } from '../utils/matchStatus.js'
import { COMPETITIONS } from '../api/footballData.js'
import './Home.css'

function dateOffset(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function Home() {
  const { matches, loading, error } = useFixtures({ dateFrom: dateOffset(-1), dateTo: dateOffset(10) })
  useSettlePredictions(matches)
  const { teams } = useTeams()

  const live = matches.filter((m) => matchBucket(m.status) === 'live')
  const upcoming = matches
    .filter((m) => matchBucket(m.status) === 'upcoming')
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
  const spotlight = live[0] ?? upcoming[0]
  const nextFew = (live[0] ? upcoming : upcoming.slice(1)).slice(0, 4)
  const featuredTeams = teams.slice(0, 4)

  return (
    <div className="home">
      <section className="hero">
        <div className="section hero__inner">
          <div className="hero__intro">
            <span className="eyebrow">Matchday</span>
            <h1 className="hero__title">
              Every fixture.
              <br />
              Your favorites first.
            </h1>
            <p className="hero__copy">
              Follow live football fixtures across Europe&rsquo;s top leagues, browse club
              details, and build a list of the teams you follow.
            </p>
            <div className="hero__actions">
              <Link to="/matches" className="btn btn--gold">
                See all matches
              </Link>
              <Link to="/teams" className="btn btn--ghost">
                Browse teams
              </Link>
            </div>
          </div>

          {!loading && !error && spotlight && (
            <div className="hero__spotlight">
              <span className="hero__spotlight-label">{live[0] ? 'Live now' : 'Next fixture'}</span>
              <MatchCard match={spotlight} showPrediction={false} />
            </div>
          )}

          {loading && (
            <div className="hero__spotlight">
              <div className="skeleton" style={{ height: 200 }} />
            </div>
          )}
        </div>
      </section>

      <section className="section leagues-strip" aria-label="Leagues covered">
        {COMPETITIONS.map((league) => (
          <span key={league.code} className="leagues-strip__item">
            {league.name}
          </span>
        ))}
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Upcoming fixtures</h2>
          <Link to="/matches" className="see-all">
            See all →
          </Link>
        </div>

        {loading && (
          <div className="home__matches-grid" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 150 }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="state-banner state-banner--error">
            <strong>Fixture data is temporarily unavailable</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && nextFew.length === 0 && (
          <p className="empty-note">No confirmed upcoming fixtures right now.</p>
        )}

        {!loading && !error && nextFew.length > 0 && (
          <div className="home__matches-grid">
            {nextFew.map((match) => (
              <MatchCard key={match.id} match={match} variant="compact" showPrediction={false} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Popular teams</h2>
          <Link to="/teams" className="see-all">
            Browse all →
          </Link>
        </div>
        <div className="home__teams-grid">
          {featuredTeams.length === 0
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 220 }} />)
            : featuredTeams.map((team) => <TeamCard key={team.id} team={team} />)}
        </div>
      </section>
    </div>
  )
}
