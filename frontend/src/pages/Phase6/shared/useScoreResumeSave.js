import { useEffect, useRef } from 'react'

import { useProgressSave } from '../../../hooks/useProgressSave.js'

export function usePhase6ScoreResume({ subphase, step, scores, routing }) {
  const { saveResponse } = useProgressSave({
    phase: 6,
    subphase,
    step,
    interaction: null,
    context: 'score',
  })
  const lastSignatureRef = useRef(null)

  useEffect(() => {
    const answer = { scores, routing }
    const signature = JSON.stringify(answer)

    if (lastSignatureRef.current === signature) return
    lastSignatureRef.current = signature

    saveResponse({
      item_index: 0,
      item_id: 'score-summary',
      item_type: 'score_summary',
      prompt: `Phase 6 subphase ${subphase} step ${step} score summary`,
      answer,
      is_correct: routing?.shouldProceed ?? null,
      score: Number(routing?.totalScore ?? scores?.total ?? 0),
      ai_feedback: routing?.nextUrl || null,
    })
  }, [routing, saveResponse, scores, step, subphase])
}
