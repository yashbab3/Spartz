import { usePredictions, STAKE } from '../context/PredictionsContext.jsx'
import { useStandings } from '../hooks/useStandings.js'
import { computeMultipliers } from '../utils/predictionOdds.js'
import './PredictionWidget.css'

export default function PredictionWidget({ match, home, away }) {
  const { getPrediction, placePrediction, cancelPrediction, balance } = usePredictions()
  const { standingsByTeamId } = useStandings(match.competitionCode)
  const prediction = getPrediction(match.id)
  const canAfford = balance >= STAKE

  const multipliers = computeMultipliers(standingsByTeamId.get(home.id), standingsByTeamId.get(away.id))

  const picks = [
    { id: 'home', label: home.shortName || home.name, multiplier: multipliers.home },
    { id: 'draw', label: 'Draw', multiplier: multipliers.draw },
    { id: 'away', label: away.shortName || away.name, multiplier: multipliers.away },
  ]

  return (
    <div className="prediction-widget">
      <div
        className="prediction-widget__row"
        role="group"
        aria-label={`Predict the outcome of ${home.name} vs ${away.name}`}
      >
        {picks.map(({ id, label, multiplier }) => {
          const isPicked = prediction?.pick === id
          const disabled = !prediction && !canAfford
          return (
            <button
              key={id}
              type="button"
              className={`prediction-widget__btn${isPicked ? ' is-picked' : ''}`}
              disabled={disabled}
              aria-pressed={isPicked}
              onClick={() => placePrediction(match.id, id, multiplier)}
            >
              <span className="prediction-widget__btn-label">{label}</span>
              <span className="prediction-widget__btn-multiplier">{multiplier.toFixed(1)}x</span>
            </button>
          )
        })}
      </div>

      <div className="prediction-widget__status">
        {prediction ? (
          <>
            <span>
              {prediction.stake.toLocaleString()} coins on{' '}
              <strong>{prediction.pick === 'draw' ? 'a draw' : prediction.pick === 'home' ? home.name : away.name}</strong>{' '}
              at {prediction.multiplier.toFixed(1)}x
            </span>
            <button type="button" className="prediction-widget__clear" onClick={() => cancelPrediction(match.id)}>
              Clear pick
            </button>
          </>
        ) : !canAfford ? (
          <span>Not enough coins to pick</span>
        ) : (
          <span>Pick a winner · {STAKE.toLocaleString()} coins · multipliers are an in-app estimate</span>
        )}
      </div>
    </div>
  )
}
