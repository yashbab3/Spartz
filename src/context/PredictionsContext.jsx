import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// A purely virtual coin game: no deposits, withdrawals, purchases, or
// real-money value of any kind. Every new user (i.e. a browser with no saved
// SPORTZ data yet) starts with STARTING_BALANCE coins. Picking a winner for
// an upcoming match holds a fixed stake from the balance at that outcome's
// current multiplier (see utils/predictionOdds.js — an in-house estimate,
// not real bookmaker odds). Predictions are only ever settled against a
// match's real, API-reported final score — never a fabricated or guessed
// result.
// ---------------------------------------------------------------------------

export const STARTING_BALANCE = 10000
export const STAKE = 100
const HISTORY_LIMIT = 50

const BALANCE_KEY = 'sportz:coin-balance'
const PREDICTIONS_KEY = 'sportz:predictions'
const HISTORY_KEY = 'sportz:prediction-history'

const PredictionsContext = createContext(null)

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

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

export function PredictionsProvider({ children }) {
  const [balance, setBalance] = useState(readBalance)
  const [predictions, setPredictions] = useState(() => readJSON(PREDICTIONS_KEY, {}))
  const [history, setHistory] = useState(() => readJSON(HISTORY_KEY, []))

  useEffect(() => {
    try {
      window.localStorage.setItem(BALANCE_KEY, String(balance))
    } catch {
      /* best-effort persistence only */
    }
  }, [balance])

  useEffect(() => {
    try {
      window.localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions))
    } catch {
      /* best-effort persistence only */
    }
  }, [predictions])

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {
      /* best-effort persistence only */
    }
  }, [history])

  const value = useMemo(() => {
    const getPrediction = (matchId) => predictions[matchId] ?? null

    const placePrediction = (matchId, pick, multiplier) => {
      const existing = predictions[matchId]
      if (existing?.pick === pick) return true // no-op, already picked

      if (!existing) {
        if (balance < STAKE) return false
        setBalance((b) => b - STAKE)
      }
      // Switching an existing pick keeps the same stake already held, but
      // re-locks the multiplier current at the time of the switch.

      setPredictions((current) => ({
        ...current,
        [matchId]: { pick, stake: STAKE, multiplier, placedAt: new Date().toISOString() },
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

    // Settles a prediction against a match's real, API-reported outcome.
    // Safe to call repeatedly — a matchId is only ever settled once.
    const settlePrediction = (matchId, match, outcome) => {
      const existing = predictions[matchId]
      if (!existing) return

      const won = existing.pick === outcome
      if (won) {
        const payout = Math.round(existing.stake * existing.multiplier)
        setBalance((b) => b + payout)
      }

      setPredictions((current) => {
        const next = { ...current }
        delete next[matchId]
        return next
      })

      setHistory((current) => {
        const entry = {
          matchId,
          homeTeam: match.homeTeam?.shortName || match.homeTeam?.name,
          awayTeam: match.awayTeam?.shortName || match.awayTeam?.name,
          pick: existing.pick,
          outcome,
          won,
          stake: existing.stake,
          multiplier: existing.multiplier,
          payout: won ? Math.round(existing.stake * existing.multiplier) : 0,
          settledAt: new Date().toISOString(),
        }
        return [entry, ...current].slice(0, HISTORY_LIMIT)
      })
    }

    const activePredictions = Object.entries(predictions).map(([matchId, p]) => ({ matchId, ...p }))
    const totalStaked = activePredictions.reduce((sum, p) => sum + p.stake, 0)

    return {
      balance,
      getPrediction,
      placePrediction,
      cancelPrediction,
      settlePrediction,
      activePredictions,
      totalStaked,
      history,
    }
  }, [balance, predictions, history])

  return <PredictionsContext.Provider value={value}>{children}</PredictionsContext.Provider>
}

export function usePredictions() {
  const ctx = useContext(PredictionsContext)
  if (!ctx) {
    throw new Error('usePredictions must be used within a PredictionsProvider')
  }
  return ctx
}
