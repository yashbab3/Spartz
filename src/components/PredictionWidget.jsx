import { usePredictions, STAKE } from '../context/PredictionsContext.jsx'
import './PredictionWidget.css'

const PICKS = [
  { id: 'home', label: (home) => home.shortName },
  { id: 'draw', label: () => 'Draw' },
  { id: 'away', label: (_home, away) => away.shortName },
]

export default function PredictionWidget({ match, home, away }) {
  const { getPrediction, placePrediction, cancelPrediction, balance } = usePredictions()
  const prediction = getPrediction(match.id)
  const locked = new Date(match.kickoff).getTime() <= Date.now()
  const canAfford = balance >= STAKE

  return (
    <div className="prediction-widget">
      <div className="prediction-widget__row" role="group" aria-label={`Predict the outcome of ${home.name} vs ${away.name}`}>
        {PICKS.map(({ id, label }) => {
          const isPicked = prediction?.pick === id
          const disabled = locked || (!prediction && !canAfford)
          return (
            <button
              key={id}
              type="button"
              className={`prediction-widget__btn${isPicked ? ' is-picked' : ''}`}
              disabled={disabled}
              aria-pressed={isPicked}
              onClick={() => placePrediction(match.id, id)}
            >
              {label(home, away)}
            </button>
          )
        })}
      </div>

      <div className="prediction-widget__status">
        {prediction ? (
          <>
            <span>
              {STAKE.toLocaleString()} coins on{' '}
              <strong>{prediction.pick === 'draw' ? 'a draw' : prediction.pick === 'home' ? home.name : away.name}</strong>
            </span>
            {!locked && (
              <button type="button" className="prediction-widget__clear" onClick={() => cancelPrediction(match.id)}>
                Clear pick
              </button>
            )}
          </>
        ) : locked ? (
          <span>Predictions closed at kickoff</span>
        ) : !canAfford ? (
          <span>Not enough coins to pick</span>
        ) : (
          <span>Pick a winner · {STAKE.toLocaleString()} coins</span>
        )}
      </div>
    </div>
  )
}
