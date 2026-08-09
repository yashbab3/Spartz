import { useEffect } from 'react'
import { usePredictions } from '../context/PredictionsContext.jsx'
import { matchOutcome } from '../utils/matchStatus.js'

// Whenever a fresh batch of matches includes a FINISHED result for a match
// the user has an open (unsettled) prediction on, settle it against that
// real score. Settlement only happens opportunistically, while the app has
// that match's finished result loaded — there's no background job.
export function useSettlePredictions(matches) {
  const { activePredictions, settlePrediction } = usePredictions()

  useEffect(() => {
    if (!matches?.length || !activePredictions.length) return
    const openIds = new Set(activePredictions.map((p) => p.matchId))

    for (const match of matches) {
      const id = String(match.id)
      if (!openIds.has(id)) continue
      const outcome = matchOutcome(match)
      if (outcome) {
        settlePrediction(id, match, outcome)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches])
}
