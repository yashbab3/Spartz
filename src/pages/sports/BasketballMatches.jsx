import { useMemo } from 'react'
import { useBasketballGames } from '../../hooks/useBasketballGames.js'
import BasketballGameCard from '../../components/BasketballGameCard.jsx'
import { basketballBucket } from '../../utils/basketballStatus.js'
import './FootballMatches.css'

export default function BasketballMatches() {
  const { games, loading, error } = useBasketballGames()

  const live = useMemo(() => games.filter((g) => basketballBucket(g.status?.short) === 'live'), [games])
  const upcoming = useMemo(
    () =>
      games
        .filter((g) => basketballBucket(g.status?.short) === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [games],
  )
  const finished = useMemo(
    () =>
      games
        .filter((g) => basketballBucket(g.status?.short) === 'finished')
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [games],
  )

  if (loading) {
    return (
      <div className="matches-page__grid" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 180 }} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-banner state-banner--error">
        <strong>Basketball data is temporarily unavailable</strong>
        <span>{error}</span>
      </div>
    )
  }

  if (games.length === 0) {
    return <p className="matches-page__empty">No confirmed basketball games in the next couple of days.</p>
  }

  return (
    <>
      {live.length > 0 && <Group title="Live now" games={live} />}
      {upcoming.length > 0 && <Group title="Upcoming" games={upcoming} />}
      {finished.length > 0 && <Group title="Finished" games={finished} />}
    </>
  )
}

function Group({ title, games }) {
  return (
    <div className="matches-page__group">
      <h2 className="matches-page__day">{title}</h2>
      <div className="matches-page__grid">
        {games.map((game) => (
          <BasketballGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
