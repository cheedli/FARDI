import { useRef, useCallback, useEffect } from 'react'

/**
 * useProgressSave - debounced auto-save hook for student responses.
 *
 * Saves every answer/move to the backend so:
 *  - Admins can review full response history
 *  - Students can resume exactly where they stopped
 *
 * Usage:
 *   const { saveResponse, markComplete } = useProgressSave({
 *     phase: 3, subphase: null, step: 1, interaction: 1, context: 'main'
 *   })
 *
 *   // Call on every answer:
 *   saveResponse({
 *     item_index: 0, item_id: 'q1', item_type: 'gap_fill',
 *     prompt: 'She ___ to the store', answer: 'went',
 *     is_correct: true, score: 1
 *   })
 *
 * context values:
 *   'main'          - regular interaction
 *   'remedial_a1'   - A1 remedial task
 *   'remedial_a2'   - A2 remedial task
 *   'remedial_b1'   - B1 remedial task
 *   'remedial_b2'   - B2 remedial task
 *   'remedial_c1'   - C1 remedial task
 */
export function useProgressSave({
  phase,
  subphase = null,
  step,
  interaction,
  context = 'main',
}) {
  // Stable session ID per phase, persisted in sessionStorage
  const sessionId = useRef(null)
  if (!sessionId.current) {
    const key = `progress_session_ph${phase}`
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
      sessionStorage.setItem(key, id)
    }
    sessionId.current = id
  }

  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  const DEBOUNCE_MS = 3000

  const flushToServer = useCallback(async (payload) => {
    try {
      await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
    } catch (e) {
      // Non-blocking — don't disrupt the student's experience
      console.warn('[useProgressSave] save failed:', e)
    }
  }, [])

  /**
   * Save a single response. Debounced — actual API call fires 3s after last call.
   * @param {Object} responseData
   * @param {number} responseData.item_index  - 0-based position within interaction
   * @param {string} responseData.item_id     - unique ID for this question
   * @param {string} responseData.item_type   - 'gap_fill'|'matching'|'spelling'|'text'|'drag_drop'|'dialogue'|'flashcard'|'multiple_choice'
   * @param {string} responseData.prompt      - question/prompt shown to student
   * @param {*}      responseData.answer      - student's answer (string or object)
   * @param {boolean|null} responseData.is_correct
   * @param {number|null}  responseData.score
   * @param {string|null}  responseData.ai_feedback
   */
  const buildPayload = useCallback((responseData) => ({
    phase,
    subphase,
    step,
    interaction,
    context,
    item_index: responseData.item_index ?? 0,
    session_id: sessionId.current,
    response: {
      item_id: responseData.item_id ?? null,
      item_type: responseData.item_type ?? 'unknown',
      prompt: responseData.prompt ?? null,
      answer: responseData.answer,
      is_correct: responseData.is_correct ?? null,
      score: responseData.score ?? null,
      ai_feedback: responseData.ai_feedback ?? null,
    },
  }), [phase, subphase, step, interaction, context])

  const saveResponse = useCallback((responseData) => {
    const payload = buildPayload(responseData)
    pendingRef.current = payload

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        flushToServer(pendingRef.current)
        pendingRef.current = null
      }
    }, DEBOUNCE_MS)
  }, [buildPayload, flushToServer])

  /**
   * Immediately flush a save, bypassing the debounce. Use before navigating away
   * so the progress pointer is written before the next page loads.
   */
  const saveNow = useCallback(async (responseData) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    pendingRef.current = null
    await flushToServer(buildPayload(responseData))
  }, [buildPayload, flushToServer])

  /**
   * Flush any pending save immediately and mark the phase complete.
   * Call this when the student finishes the last task in a phase.
   */
  const markComplete = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (pendingRef.current) {
      await flushToServer(pendingRef.current)
      pendingRef.current = null
    }
    try {
      await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase }),
      })
    } catch (e) {
      console.warn('[useProgressSave] markComplete failed:', e)
    }
  }, [phase, flushToServer])

  // Flush on page unload via sendBeacon (works even if tab is closing)
  useEffect(() => {
    const handleUnload = () => {
      if (pendingRef.current) {
        const blob = new Blob(
          [JSON.stringify(pendingRef.current)],
          { type: 'application/json' }
        )
        navigator.sendBeacon('/api/progress/save', blob)
        pendingRef.current = null
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { saveResponse, saveNow, markComplete }
}
