import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, LinearProgress, TextField, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task D: Critique Kahoot
 * Critique game with 6 terms requiring nuanced analysis
 * Score: +1 for each nuanced critique = 6 points maximum
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#1a1a2e',
  purple: { bg: '#2d1b4e', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#052e16', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#1e3a5f', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#042f2e', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#450a0a', border: '#EF4444', shadow: '#B91C1C' },
}

const cardSx = (color) => ({
  bgcolor: color.bg,
  border: `2px solid ${color.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${color.shadow}`,
  p: 3,
})

const TERMS = [
  { id: 1, term: 'promotional', expectedCritique: 'Effective for sales but can feel pushy if overdone.', expectedConcepts: ['effective', 'sales', 'pushy', 'overdone', 'balance'], videoReference: 'Video 1' },
  { id: 2, term: 'persuasive', expectedCritique: 'Powerful with balanced appeals but manipulative without ethics.', expectedConcepts: ['powerful', 'balanced', 'appeals', 'manipulative', 'ethics', 'ethos', 'pathos', 'logos'], videoReference: 'Video 1' },
  { id: 3, term: 'targeted', expectedCritique: 'Increases relevance but risks exclusion.', expectedConcepts: ['relevance', 'increases', 'exclusion', 'risks', 'specific'], videoReference: 'Video 1' },
  { id: 4, term: 'original', expectedCritique: 'Sparks interest but hard to achieve consistently.', expectedConcepts: ['sparks', 'interest', 'hard', 'achieve', 'consistently', 'innovation'], videoReference: 'Video 1' },
  { id: 5, term: 'creative', expectedCritique: 'Makes ads memorable but needs alignment with brand.', expectedConcepts: ['memorable', 'alignment', 'brand', 'needs', 'creative'], videoReference: 'Video 1' },
  { id: 6, term: 'dramatisation', expectedCritique: 'Engages emotionally but requires authentic storytelling.', expectedConcepts: ['engages', 'emotionally', 'authentic', 'storytelling', 'goal', 'obstacle'], videoReference: 'Video 2' }
]

const TIME_PER_TERM = 45

export default function RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TERM)
  const [critique, setCritique] = useState('')
  const [critiques, setCritiques] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])

  const currentTerm = TERMS[currentTermIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || showFeedback) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitCritique(true) }
  }, [timeLeft, gameStarted, gameFinished, showFeedback])

  const handleSubmitCritique = (timeUp = false) => {
    if (!timeUp && critique.trim().length < 15) {
      alert('Please write a more detailed critique (at least 15 characters with nuance).')
      return
    }
    const newCritiques = [...critiques, { termId: currentTerm.id, term: currentTerm.term, critique, timestamp: Date.now() }]
    setCritiques(newCritiques)
    setShowFeedback(true)
    setTimeout(() => {
      if (currentTermIndex < TERMS.length - 1) {
        setCurrentTermIndex(currentTermIndex + 1)
        setCritique('')
        setShowFeedback(false)
        setTimeLeft(TIME_PER_TERM)
      } else { handleFinishGame(newCritiques) }
    }, 2000)
  }

  const handleFinishGame = async (finalCritiques) => {
    setEvaluating(true)
    setGameFinished(true)
    try {
      const critiquesData = finalCritiques.map(critiqueData => {
        const term = TERMS.find(t => t.id === critiqueData.termId)
        return { term: term.term, critique: critiqueData.critique, expectedConcepts: term.expectedConcepts, videoReference: term.videoReference }
      })
      const response = await fetch('/api/phase4/step3/remedial/c1/evaluate-critiques-batch', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ critiques: critiquesData })
      })
      const data = await response.json()
      if (data.success && data.results) {
        const evaluatedResults = finalCritiques.map((critiqueData, index) => {
          const term = TERMS.find(t => t.id === critiqueData.termId)
          return { termId: term.id, term: term.term, critique: critiqueData.critique, score: data.results[index]?.score || 0, feedback: data.results[index]?.feedback || 'Good effort!' }
        })
        setResults(evaluatedResults)
        const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
        sessionStorage.setItem('remedial_step3_c1_taskD_score', totalScore)
        await logTaskCompletion(totalScore)
      } else { throw new Error('Batch evaluation failed') }
    } catch (error) {
      console.error('Batch evaluation error:', error)
      const evaluatedResults = finalCritiques.map(critiqueData => {
        const term = TERMS.find(t => t.id === critiqueData.termId)
        if (!critiqueData.critique || critiqueData.critique.trim().length < 15) {
          return { termId: term.id, term: term.term, critique: critiqueData.critique || '(No critique provided)', score: 0, feedback: 'Time ran out before you could provide a critique.' }
        }
        const hasNuance = ['but', 'yet', 'however'].some(w => critiqueData.critique.toLowerCase().includes(w))
        const hasConcept = term.expectedConcepts.some(c => critiqueData.critique.toLowerCase().includes(c.toLowerCase()))
        return { termId: term.id, term: term.term, critique: critiqueData.critique, score: (hasNuance && hasConcept) ? 1 : 0, feedback: hasNuance && hasConcept ? 'Good critique with nuance!' : 'Add more nuance using "but", "yet", or "however".' }
      })
      setResults(evaluatedResults)
      const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
      sessionStorage.setItem('remedial_step3_c1_taskD_score', totalScore)
      await logTaskCompletion(totalScore)
    }
    setEvaluating(false)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'D', step: 2, score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const getTotalScore = () => results.reduce((sum, r) => sum + r.score, 0)

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" sx={{ color: P.purple.border }}>Level C1 - Task D: Critique Kahoot 🎯</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Critique Kahoot! 🎯 For each of the 6 advertising terms, write a NUANCED critique that shows both strengths AND weaknesses. Use 'but', 'yet', or 'however' to show critical thinking. Reference the videos when applicable. You have 45 seconds per critique. Score: 1 point per nuanced critique = 6 points total. Ready? Let's go! 🚀" />
            </Box>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center', py: 5 }}>
              <RateReviewIcon sx={{ fontSize: 100, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Critique Kahoot!</Typography>
              <Typography variant="h5" sx={{ color: P.purple.border, mb: 4 }}>6 Terms • 45 Seconds Each • Critical Analysis</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{ px: 10, py: 2.5, fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.purple.border, color: '#fff', border: `2px solid ${P.purple.shadow}`, borderRadius: '50px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` } }}>
                START CRITIQUE
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && !evaluating) {
    const totalScore = getTotalScore()
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 1 }} />
              <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {totalScore === 6 ? 'PERFECT CRITIQUE! 🎉' : 'CRITIQUE COMPLETE! 🎊'}
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h1" fontWeight="bold" sx={{ color: P.green.shadow, fontSize: '5rem' }}>{totalScore}</Typography>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">out of {TERMS.length}</Typography>
              <Typography variant="h6" color="text.secondary">{Math.round((totalScore / TERMS.length) * 100)}% nuanced critiques</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Critique Review</Typography>
              <Stack spacing={2}>
                {results.map((result, index) => (
                  <Box key={index} sx={{ p: 2, borderRadius: '14px', bgcolor: result.score === 1 ? P.green.bg : P.red.bg, border: `2px solid ${result.score === 1 ? P.green.border : P.red.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: P.purple.border, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{index + 1}</Box>
                      <Typography variant="h5" fontWeight="bold">{result.term}</Typography>
                      {result.score === 1 ? <CheckCircleIcon sx={{ color: P.green.shadow, ml: 'auto' }} /> : <CancelIcon sx={{ color: P.red.shadow, ml: 'auto' }} />}
                    </Box>
                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '10px', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"{result.critique}"</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: result.score === 1 ? P.green.shadow : '#C2410C', fontWeight: 600 }}>
                      AI Feedback: {result.feedback}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/c1/taskE')}
                sx={{ px: 6, py: 2, fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`, borderRadius: '50px', boxShadow: `4px 4px 0 ${P.green.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                Continue to Task E →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Evaluating screen
  if (evaluating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 3, height: 8, borderRadius: '8px' }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Evaluating Your Critiques...</Typography>
            <Typography variant="body1" color="text.secondary">AI is analyzing your critical thinking, nuance, and depth of analysis...</Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  // Game in progress - fullscreen purple Kahoot style
  const progress = ((currentTermIndex + 1) / TERMS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #46178f 0%, #8e44ad 100%)', p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Top bar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ px: 3, py: 1.5, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#7E22CE' }}>Term {currentTermIndex + 1} / {TERMS.length}</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Box sx={{ px: 3, py: 1.5, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon sx={{ color: '#EAB308' }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>{critiques.length} / {TERMS.length}</Typography>
            </Box>
            <Box sx={{ px: 3, py: 1.5, bgcolor: timeLeft <= 10 ? '#EF4444' : 'rgba(255,255,255,0.95)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon sx={{ color: timeLeft <= 10 ? 'white' : '#EF4444' }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: timeLeft <= 10 ? 'white' : '#2c3e50', minWidth: 40 }}>{timeLeft}s</Typography>
            </Box>
          </Stack>
        </Stack>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 12, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: '6px' } }} />

        {/* Term display */}
        <Box sx={{ p: 5, mb: 3, bgcolor: 'white', borderRadius: '20px', textAlign: 'center' }}>
          <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: '#7E22CE', color: 'white', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', mb: 2 }}>CRITIQUE THIS TERM</Box>
          <Typography variant="h2" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>{currentTerm.term}</Typography>
          <Typography variant="body1" sx={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Write a nuanced critique showing BOTH strengths AND weaknesses</Typography>
        </Box>

        {/* Critique input */}
        <Box sx={{ p: 4, bgcolor: 'white', borderRadius: '20px', mb: 3 }}>
          <Box sx={{ p: 2, mb: 3, bgcolor: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: '12px' }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#1D4ED8' }}>
              💡 TIP: Use "but", "yet", or "however" to show critical thinking by presenting both strengths and weaknesses.
            </Typography>
          </Box>
          <TextField fullWidth multiline rows={4} value={critique} onChange={(e) => setCritique(e.target.value)}
            placeholder="Write your nuanced critique here... (Show both pros and cons)"
            variant="outlined" disabled={showFeedback}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', '& fieldset': { borderColor: '#A855F7', borderWidth: 3 }, '&:hover fieldset': { borderColor: '#7E22CE' }, '&.Mui-focused fieldset': { borderColor: '#7E22CE' } } }}
          />
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>
            {critique.length} characters • Minimum 15 characters (aim for 40-100 for nuance)
          </Typography>
          <Box component="button" onClick={() => handleSubmitCritique()} disabled={critique.trim().length < 15 || showFeedback}
            sx={{ width: '100%', py: 2, fontSize: '1.3rem', fontWeight: 'bold', cursor: critique.trim().length < 15 || showFeedback ? 'not-allowed' : 'pointer', bgcolor: critique.trim().length >= 15 && !showFeedback ? '#22C55E' : '#9CA3AF', color: '#fff', border: `2px solid ${critique.trim().length >= 15 && !showFeedback ? '#15803D' : '#6B7280'}`, borderRadius: '50px', boxShadow: critique.trim().length >= 15 && !showFeedback ? '3px 3px 0 #15803D' : 'none', '&:hover': { transform: critique.trim().length >= 15 && !showFeedback ? 'translate(-1px,-1px)' : 'none' } }}>
            SUBMIT CRITIQUE
          </Box>
        </Box>

        {showFeedback && (
          <Box sx={{ p: 3, bgcolor: '#22C55E', color: 'white', borderRadius: '16px', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">✓ Critique Submitted!</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>Moving to next term...</Typography>
          </Box>
        )}

        {timeLeft <= 10 && !showFeedback && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#F97316', color: 'white', borderRadius: '12px', border: '2px solid #C2410C' }}>
            <Typography variant="h6" fontWeight="bold">⏰ Hurry! Only {timeLeft} seconds left!</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
