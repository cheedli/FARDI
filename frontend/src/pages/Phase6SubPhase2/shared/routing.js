import { phase6API } from '../../../lib/phase6_api.jsx'

const TASK_KEYS_BY_STEP_LEVEL = {
  1: { A2: ['a', 'b', 'c'], B1: ['a', 'b', 'c'], B2: ['a', 'b', 'c', 'd'], C1: ['a', 'b', 'c'] },
  2: { A2: ['a', 'b', 'c'], B1: ['a', 'b', 'c'], B2: ['a', 'b', 'c', 'd'], C1: ['a', 'b', 'c'] },
  3: { A2: ['a', 'b', 'c'], B1: ['a', 'b', 'c'], B2: ['a', 'b', 'c', 'd'], C1: ['a', 'b', 'c', 'd'] },
  4: { A2: ['a', 'b', 'c'], B1: ['a', 'b', 'c'], B2: ['a', 'b', 'c', 'd'], C1: ['a', 'b', 'c', 'd'] },
  5: { A2: ['a', 'b', 'c'], B1: ['a', 'b', 'c'], B2: ['a', 'b', 'c'], C1: ['a', 'b', 'c', 'd'] },
}

function getFallbackRemedialLevel(interaction2Score) {
  const score = Number(interaction2Score || 0)
  if (score <= 2) return 'A2'
  if (score === 3) return 'B1'
  if (score === 4) return 'B2'
  return 'C1'
}

function getTaskStorageScore(step, level, taskKey) {
  const levelKey = level.toLowerCase()
  const upperTaskKey = taskKey.toUpperCase()
  const candidates = [
    `phase6_sp2_step${step}_remedial_${levelKey}_task${taskKey}_score`,
    `phase6_sp2_step${step}_remedial_${levelKey}_task${upperTaskKey}_score`,
  ]

  for (const storageKey of candidates) {
    const raw = sessionStorage.getItem(storageKey)
    if (raw !== null) {
      return parseInt(raw || '0', 10)
    }
  }

  return 0
}

export function getSubphase2RemedialStartUrl(step, level) {
  return `/phase6/subphase/2/step/${step}/remedial/${level.toLowerCase()}/task/a`
}

export function getSubphase2NextStepUrl(step) {
  return step === 5 ? '/phase6/complete' : `/phase6/subphase/2/step/${step + 1}`
}

export function getSubphase2MainRouting(step, interaction2Score) {
  const remedialLevel = getFallbackRemedialLevel(interaction2Score)
  const shouldProceed = Number(interaction2Score || 0) >= 3

  return {
    remedialLevel,
    shouldProceed,
    nextUrl: shouldProceed
      ? getSubphase2NextStepUrl(step)
      : getSubphase2RemedialStartUrl(step, remedialLevel),
  }
}

export function getSubphase2RemedialTaskScores(step, level) {
  const levelKey = level.toUpperCase()
  const taskKeys = TASK_KEYS_BY_STEP_LEVEL[step]?.[levelKey] || []

  return taskKeys.reduce((acc, taskKey) => {
    acc[`task_${taskKey}_score`] = getTaskStorageScore(step, levelKey, taskKey)
    return acc
  }, {})
}

export async function resolveSubphase2RemedialNextUrl(step, level) {
  const fallbackUrl = getSubphase2RemedialStartUrl(step, level)

  try {
    const result = await phase6API.calculateRemedialScore(step, level, getSubphase2RemedialTaskScores(step, level), 2)
    return result?.data?.next_url || fallbackUrl
  } catch (error) {
    console.error('Failed to resolve Phase 6.2 remedial next route:', error)
    return fallbackUrl
  }
}
