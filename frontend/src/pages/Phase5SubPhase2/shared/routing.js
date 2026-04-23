import { phase5API } from '../../../lib/phase5_api.jsx'

const TASK_KEYS_BY_LEVEL = {
  A2: ['a', 'b', 'c'],
  B1: ['a', 'b', 'c'],
  B2: ['a', 'b', 'c', 'd'],
  C1: ['a', 'b', 'c', 'd'],
}

function getAverageLevel(avgScore) {
  if (avgScore <= 1.5) return 'A2'
  if (avgScore <= 2.5) return 'B1'
  if (avgScore <= 3.5) return 'B2'
  return 'C1'
}

export function getSubphase2RemedialStartUrl(step, level) {
  return `/phase5/subphase/2/step/${step}/remedial/${level.toLowerCase()}/task/a`
}

export function getSubphase2NextStepUrl(step) {
  return step === 5 ? '/phase5/complete' : `/phase5/subphase/2/step/${step + 1}`
}

export function getSubphase2MainRouting(step, scores, overallTotal = null) {
  const interaction1 = Number(scores.interaction1 || 0)
  const interaction2 = Number(scores.interaction2 || 0)
  const interaction3 = Number(scores.interaction3 || 0)
  const total = Number(scores.total ?? (interaction1 + interaction2 + interaction3))

  let remedialLevel = 'A2'
  let shouldProceed = false

  if (step === 1) {
    if (interaction2 <= 1) remedialLevel = 'A2'
    else if (interaction2 === 2) remedialLevel = 'B1'
    else if (interaction2 === 3) remedialLevel = 'B2'
    else remedialLevel = 'C1'
    shouldProceed = interaction2 >= 3
  } else if (step === 3) {
    remedialLevel = getAverageLevel((interaction1 + interaction2) / 2)
    shouldProceed = interaction2 >= 3
  } else {
    remedialLevel = getAverageLevel(total / 3)
    shouldProceed = step === 5 ? Number(overallTotal ?? total) >= 12 : interaction2 >= 3
  }

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
  const taskKeys = TASK_KEYS_BY_LEVEL[levelKey] || []
  return taskKeys.reduce((acc, taskKey) => {
    const storageKey = `phase5_subphase2_step${step}_remedial_${levelKey.toLowerCase()}_task${taskKey.toUpperCase()}_score`
    acc[`task_${taskKey}_score`] = parseInt(sessionStorage.getItem(storageKey) || '0', 10)
    return acc
  }, {})
}

export async function resolveSubphase2RemedialNextUrl(step, level) {
  const fallbackUrl = getSubphase2RemedialStartUrl(step, level)
  try {
    const result = await phase5API.calculateRemedialScore(step, level, getSubphase2RemedialTaskScores(step, level), 2)
    return result?.data?.next_url || fallbackUrl
  } catch (error) {
    console.error('Failed to resolve remedial next route:', error)
    return fallbackUrl
  }
}
