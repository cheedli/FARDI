export async function requestPhase42StepScore(step, payload) {
  const response = await fetch(`/api/phase4/4_2/step/${step}/calculate-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Failed to calculate Phase 4.2 Step ${step} score`)
  }

  return data.data
}

export async function requestPhase42FinalScore(step, level, payload) {
  const response = await fetch(`/api/phase4/4_2/step/${step}/remedial/${level}/final-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Failed to calculate Phase 4.2 Step ${step} remedial ${level} score`)
  }

  return data.data
}

export async function requestPhase42TaskBScore(step, level, payload) {
  const response = await fetch(`/api/phase4/4_2/step/${step}/remedial/${level}/task-b/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Failed to evaluate Phase 4.2 Step ${step} remedial ${level} Task B`)
  }

  return data
}
