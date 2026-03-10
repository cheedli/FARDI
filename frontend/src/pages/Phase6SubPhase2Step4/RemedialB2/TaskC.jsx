import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LinkIcon from '@mui/icons-material/Link'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const PAIRS = [
  { id: 1, term: 'positive', definition: 'Praise good parts' },
  { id: 2, term: 'strength', definition: 'What is good' },
  { id: 3, term: 'weakness', definition: 'What needs work' },
  { id: 4, term: 'suggestion', definition: 'Idea to improve' },
  { id: 5, term: 'improve', definition: 'Make better' },
  { id: 6, term: 'feedback', definition: 'Comments' },
  { id: 7, term: 'polite', definition: 'Be nice' },
  { id: 8, term: 'specific', definition: 'Give clear examples' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Phase6SP2Step4RemB2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 4, interaction: 3, context: 'remedial_b2' })
  const [shuffledDefs] = useState(() => shuffle(PAIRS))
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDef, setSelectedDef] = useState(null)
  const [matched, setMatched] = useState({})
  const [wrongPair, setWrongPair] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const matchedTermIds = new Set(Object.keys(matched).map(Number))
  const matchedDefIds = new Set(Object.values(matched).map(Number))

  const handleTermClick = (pair) => {
    if (submitted || matchedTermIds.has(pair.id)) return
    setSelectedTerm(pair)
    setWrongPair(null)
    if (selectedDef) attemptMatch(pair, selectedDef)
  }

  const handleDefClick = (pair) => {
    if (submitted || matchedDefIds.has(pair.id)) return
    setSelectedDef(pair)
    setWrongPair(null)
    if (selectedTerm) attemptMatch(selectedTerm, pair)
  }

  const attemptMatch = (term, def) => {
    if (term.id === def.id) {
      setMatched(prev => ({ ...prev, [term.id]: def.id }))
      setSelectedTerm(null)
      setSelectedDef(null)
    } else {
      setWrongPair({ termId: term.id, defId: def.id })
      setTimeout(() => {
        setSelectedTerm(null)
        setSelectedDef(null)
        setWrongPair(null)
      }, 800)
    }
  }

  const allMatched = matchedTermIds.size === PAIRS.length

  const handleSubmit = async () => {
    const correct = matchedTermIds.size
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step4_remedial_b2_taskc_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B2', 'C', correct, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const getTermColor = (pair) => {
    if (matchedTermIds.has(pair.id)) return { bg: '#27ae60', color: 'white', border: '#27ae60' }
    if (selectedTerm?.id === pair.id) return { bg: '#8e44ad', color: 'white', border: '#8e44ad' }
    if (wrongPair?.termId === pair.id) return { bg: '#e74c3c', color: 'white', border: '#e74c3c' }
    return { bg: 'white', color: '#4a4a4a', border: '#d3aee6' }
  }

  const getDefColor = (pair) => {
    if (matchedDefIds.has(pair.id)) return { bg: '#27ae60', color: 'white', border: '#27ae60' }
    if (selectedDef?.id === pair.id) return { bg: '#8e44ad', color: 'white', border: '#8e44ad' }
    if (wrongPair?.defId === pair.id) return { bg: '#e74c3c', color: 'white', border: '#e74c3c' }
    return { bg: 'white', color: '#4a4a4a', border: '#d3aee6' }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 4: Remedial B2 — Task C</Typography>
        <Typography variant="body1">Matching Game: Feedback Terms to Functions</Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Click a term on the left, then click its matching function on the right to create a pair.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Terms column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#6c3483', mb: 0.5, textAlign: 'center' }}>
            Terms
          </Typography>
          {PAIRS.map((pair) => {
            const style = getTermColor(pair)
            const isMatched = matchedTermIds.has(pair.id)
            return (
              <Paper
                key={pair.id}
                elevation={isMatched ? 0 : 2}
                onClick={() => handleTermClick(pair)}
                sx={{
                  p: 1.5, borderRadius: 2,
                  cursor: isMatched || submitted ? 'default' : 'pointer',
                  backgroundColor: style.bg, color: style.color,
                  border: `2px solid ${style.border}`,
                  textAlign: 'center', fontWeight: 'bold',
                  transition: 'all 0.2s', userSelect: 'none',
                  opacity: isMatched ? 0.85 : 1,
                  '&:hover': isMatched || submitted ? {} : { transform: 'scale(1.02)', boxShadow: 3 },
                }}
              >
                <Typography variant="body1" fontWeight="bold">{pair.term}</Typography>
              </Paper>
            )
          })}
        </Box>

        {/* Center connector — hidden on mobile */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
          {PAIRS.map((pair) => (
            <Box key={pair.id} sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
              {matchedTermIds.has(pair.id) && (
                <LinkIcon sx={{ color: '#27ae60', fontSize: 20 }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Definitions column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#6c3483', mb: 0.5, textAlign: 'center' }}>
            Functions
          </Typography>
          {shuffledDefs.map((pair) => {
            const style = getDefColor(pair)
            const isMatched = matchedDefIds.has(pair.id)
            return (
              <Paper
                key={pair.id}
                elevation={isMatched ? 0 : 2}
                onClick={() => handleDefClick(pair)}
                sx={{
                  p: 1.5, borderRadius: 2,
                  cursor: isMatched || submitted ? 'default' : 'pointer',
                  backgroundColor: style.bg, color: style.color,
                  border: `2px solid ${style.border}`,
                  textAlign: 'center',
                  transition: 'all 0.2s', userSelect: 'none',
                  opacity: isMatched ? 0.85 : 1,
                  '&:hover': isMatched || submitted ? {} : { transform: 'scale(1.02)', boxShadow: 3 },
                }}
              >
                <Typography variant="body1">{pair.definition}</Typography>
              </Paper>
            )
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Chip
          label={`${matchedTermIds.size} / 8 matched`}
          sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold', fontSize: '0.95rem', px: 1 }}
        />
      </Box>

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!allMatched}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          {allMatched ? 'Submit Matches' : `Match all 8 pairs to continue`}
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f8f0', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mb: 1 }} />
          <Typography variant="h5" color="success.dark" gutterBottom>Score: {score}/8</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {score === 8 ? 'Perfect! All 8 terms matched correctly.' : `You matched ${score} out of 8 terms correctly.`}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4/remedial/b2/task/d')}
            size="large"
            sx={{ background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Continue to Task D
          </Button>
        </Paper>
      )}
    </Box>
  )
}
