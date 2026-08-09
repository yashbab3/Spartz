import { Link } from 'react-router-dom'
import { MATCHES } from '../data/matches.js'
import { LEAGUES, TEAMS } from '../data/teams.js'
import MatchCard from '../components/MatchCard.jsx'
import TeamCard from '../components/TeamCard.jsx'
import './Home.css'

const upcoming = [...MATCHES].sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
const spotlight = upcoming[0]
const nextFew = upcoming.slice(1, 5)
const featuredTeams = TEAMS.slice(0, 4)

export default function Home() {
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
              Follow upcoming football matches across Europe&rsquo;s top five leagues,
              browse club details, and build a list of the teams you follow.
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

          {spotlight && (
            <div className="hero__spotlight">
              <span className="hero__spotlight-label">Next fixture</span>
              <MatchCard match={spotlight} />
            </div>
          )}
        </div>
      </section>

      <section className="section leagues-strip" aria-label="Leagues covered">
        {LEAGUES.map((league) => (
          <span key={league.id} className="leagues-strip__item">
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
        <div className="home__matches-grid">
          {nextFew.map((match) => (
            <MatchCard key={match.id} match={match} variant="compact" />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Popular teams</h2>
          <Link to="/teams" className="see-all">
            Browse all →
          </Link>
        </div>
        <div className="home__teams-grid">
          {featuredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>
    </div>
  )
}
