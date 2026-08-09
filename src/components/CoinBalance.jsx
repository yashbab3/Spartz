import { usePredictions } from '../context/PredictionsContext.jsx'
import './CoinBalance.css'

export default function CoinBalance() {
  const { balance } = usePredictions()

  return (
    <span className="coin-balance" title="Virtual coins — no real-world monetary value">
      <CoinIcon />
      {balance.toLocaleString()}
    </span>
  )
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(15,61,46,0.35)" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-pitch-deep)">
        ¢
      </text>
    </svg>
  )
}
