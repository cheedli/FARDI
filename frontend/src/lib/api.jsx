import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ApiContext = createContext(null)

export function ApiProvider({ children }) {
  const api = useApi()
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export function useApiContext() {
  return useContext(ApiContext)
}

export function useAuth() {
  const { user, loading } = useApiContext()
  return { user, loading }
}

function useApi() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/auth/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setUser(data.user || null) })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const client = useMemo(() => ({
    async login({ username_or_email, password, remember_me }) {
      const r = await fetch('/auth/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username_or_email, password, remember_me })
      })
      const data = await r.json()
      if (!r.ok || !data.success) throw new Error(data.error || 'Login failed')
      // refresh user
      setUser(data.user)
      return data
    },
    async signup({ username, email, password, first_name, last_name }) {
      const r = await fetch('/auth/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, first_name, last_name })
      })
      const data = await r.json()
      if (!r.ok || !data.success) throw new Error(data.error || 'Signup failed')
      setUser(data.user)
      return data
    },
    async logout() {
      await fetch('/auth/logout', { credentials: 'include' })
      setUser(null)
    },
    async getGameState(step = null) {
      const url = step !== null ? `/api/game/state?step=${step}` : '/api/game/state'
      const r = await fetch(url, { credentials: 'include' })
      if (!r.ok) throw new Error('Failed to fetch game state')
      return r.json()
    },
    async startGame() {
      // Initialize session on the server
      await fetch('/start-game', { method: 'GET', credentials: 'include' })
      return this.getGameState()
    },
    async submitResponse({ response, type }) {
      const r = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ response, question_type: type })
      })
      if (!r.ok) throw new Error('Failed to submit response')
      return r.json()
    },
    async getFeedback({ question, response, speaker, type }) {
      const r = await fetch('/api/get-ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question, response, speaker, type })
      })
      if (!r.ok) throw new Error('Failed to get AI feedback')
      return r.json()
    },
    async getPhase2Step(stepId) {
      const r = await fetch(`/api/phase2/get-step-progress?step_id=${encodeURIComponent(stepId)}`, {
        credentials: 'include'
      })
      if (!r.ok) throw new Error('Failed to fetch phase 2 progress')
      return r.json()
    }
  }), [])

  return { user, loading, client }
}
