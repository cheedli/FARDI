import { useEffect, useRef } from 'react'

import { useProgressSave } from '../../../hooks/useProgressSave.js'

export function usePhase5ScoreResume({ subphase, step, scores, routing, overall = null }) {
  const { saveResponse } = useProgressSave({
    phase: 5,
    subphase,
    step,
    interaction: null,
    context: 'score',
  })
  const lastSignatureRef = useRef(null)

  useEffect(() => {
    const answer = { scores, routing, overall }
    const signature = JSON.stringify(answer)

    if (lastSignatureRef.current === signature) return
    lastSignatureRef.current = signature

    saveResponse({
      item_index: 0,
      item_id: 'score-summary',
      item_type: 'score_summary',
      prompt: `Phase 5 subphase ${subphase} step ${step} score summary`,
      answer,
      is_correct: routing?.shouldProceed ?? null,
      score: Number(routing?.totalScore ?? overall?.total_score ?? scores?.total ?? 0),
      ai_feedback: routing?.nextUrl || null,
    })
  }, [overall, routing, saveResponse, scores, step, subphase])
}
