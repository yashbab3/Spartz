import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// A purely virtual coin game: no deposits, withdrawals, purchases, or
// real-money value of any kind. Every new user (i.e. a browser with no saved
// SPORTZ data yet) starts with STARTING_BALANCE coins. Picking a winner for
// a match holds a fixed stake from the balance; canceling a pick before
// kickoff refunds it in full. This preview has no live results feed, so it
// intentionally never fabricates a match outcome or auto-settles a payout —
// it only tracks what you picked and what's currently staked.
// ---------------------------------------------------------------------------

export const STARTING_BALANCE = 10000
export const STAKE = 100

const BALANCE_KEY = 'sportz:coin-balance'
const PREDICTIONS_KEY = 'sportz:predictions'

const PredictionsContext = createContext(null)

function readBalance() {
  if (typeof window === 'undefined') return STARTING_BALANCE
  try {
    const raw = window.localStorage.getItem(BALANCE_KEY)
    if (raw === null) return STARTING_BALANCE
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : STARTING_BALANCE
  } catch {
    return STARTING_BALANCE
  }
}

function readPredictions() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(PREDICTIONS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function PredictionsProvider({ children }) {
  const [balance, setBalance] = useState(readBalance)
  const [predictions, setPredictions] = useState(readPredictions)

  useEffect(() => {
    try {
      window.localStorage.setItem(BALANCE_KEY, String(balance))
    } catch {
      // Best-effort persistence only.
    }
  }, [balance])

  useEffect(() => {
    try {
      window.localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions))
    } catch {
      // Best-effort persistence only.
    }
  }, [predictions])

  const value = useMemo(() => {
    const getPrediction = (matchId) => predictions[matchId] ?? null

    const placePrediction = (matchId, pick) => {
      const existing = predictions[matchId]
      if (existing?.pick === pick) return true // no-op, already picked

      if (!existing) {
        if (balance < STAKE) return false
        setBalance((b) => b - STAKE)
      }
      // Switching an existing pick keeps the same stake already held.

      setPredictions((current) => ({
        ...current,
        [matchId]: { pick, stake: STAKE, placedAt: new Date().toISOString() },
      }))
      return true
    }

    const cancelPrediction = (matchId) => {
      const existing = predictions[matchId]
      if (!existing) return
      setBalance((b) => b + existing.stake)
      setPredictions((current) => {
        const next = { ...current }
        delete next[matchId]
        return next
      })
    }

    const activePredictions = Object.entries(predictions).map(([matchId, p]) => ({ matchId, ...p }))
    const totalStaked = activePredictions.reduce((sum, p) => sum + p.stake, 0)

    return { balance, getPrediction, placePrediction, cancelPrediction, activePredictions, totalStaked }
  }, [balance, predictions])

  return <PredictionsContext.Provider value={value}>{children}</PredictionsContext.Provider>
}

export function usePredictions() {
  const ctx = useContext(PredictionsContext)
  if (!ctx) {
    throw new Error('usePredictions must be used within a PredictionsProvider')
  }
  return ctx
}
