import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Task B: Critique Game
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const CRITIQUE_TERMS = [
  { id: 1, term: 'Promotional', modelCritique: 'While undeniably effective for immediate sales impact, over-reliance on promotional messaging risks alienating audiences who perceive it as overly commercial.', keywords: ['effective', 'sales impact', 'over-reliance', 'alienating', 'commercial'] },
  { id: 2, term: 'Persuasive', modelCritique: 'The use of ethos, pathos, and logos is powerful, but unbalanced pathos can border on emotional manipulation if not tempered with credibility.', keywords: ['ethos', 'pathos', 'logos', 'manipulation', 'credibility'] },
  { id: 3, term: 'Targeted/Personalized', modelCritique: 'These strategies significantly increase relevance, yet they raise serious ethical questions concerning data privacy and consumer autonomy.', keywords: ['relevance', 'ethical questions', 'privacy', 'autonomy'] },
  { id: 4, term: 'Original/Creative', modelCritique: 'Originality and creativity are vital for differentiation, but excessive novelty can confuse audiences if not aligned with brand identity.', keywords: ['differentiation', 'novelty', 'confuse', 'brand identity'] },
  { id: 5, term: 'Consistent', modelCritique: 'Consistency strengthens brand recall and trust, although rigid adherence may stifle adaptability in rapidly changing cultural contexts.', keywords: ['brand recall', 'trust', 'rigid', 'adaptability'] },
  { id: 6, term: 'Dramatisation', modelCritique: 'The narrative structure is emotionally compelling, yet over-dramatisation risks appearing contrived if the obstacles feel inauthentic.', keywords: ['narrative', 'compelling', 'contrived', 'inauthentic'] }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(CRITIQUE_TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentTerm = CRITIQUE_TERMS[currentIndex]
  const handleCritiqueChange = (value) => { const n = [...critiques]; n[currentIndex] = value; setCritiques(n) }
  const handleNext = () => { if (currentIndex < CRITIQUE_TERMS.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/phase4/step4/remedial/b2/evaluate-critiques', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ critiques: critiques.map((c, idx) => ({ term: CRITIQUE_TERMS[idx].term, critique: c, modelCritique: CRITIQUE_TERMS[idx].modelCritique })) })
      })
      const data = await response.json()
      if (data.success) {
        setResults(data.results); const totalScore = data.results.filter(r => r.passed).length
        setScore(totalScore); sessionStorage.setItem('remedial_step4_b2_taskB_score', totalScore); await logTaskCompletion(totalScore)
      } else { fallback() }
    } catch { fallback() }
    setEvaluating(false); setSubmitted(true)
  }

  const fallback = () => {
    const fallbackResults = critiques.map(c => {
      const wordCount = c.trim().split(/\s+/).length
      const hasBalanced = ['but','yet','although','however'].some(w => c.toLowerCase().includes(w))
      const passed = wordCount >= 15 && hasBalanced
      return { passed, feedback: passed ? 'Good balanced critique.' : 'Needs more balance and detail.' }
    })
    setResults(fallbackResults)
    const totalScore = fallbackResults.filter(r => r.passed).length
    setScore(totalScore); sessionStorage.setItem('remedial_step4_b2_taskB_score', totalScore); logTaskCompletion(totalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'B', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b2/taskC')
  window.__remedialSkip = handleContinue
  const allFilled = critiques.every(c => c.trim().length > 0)
  const progress = ((currentIndex + 1) / CRITIQUE_TERMS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task B: Critique Game 🎯</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Write balanced, nuanced critiques of advertising terms.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Time to think critically! For each advertising term, write a balanced critique that shows BOTH strengths and weaknesses. Use advanced vocabulary and demonstrate nuanced reasoning. Remember: good critiques acknowledge positives before highlighting concerns!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Term {currentIndex + 1} of {CRITIQUE_TERMS.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.purple.border, borderRadius: '12px', p: 3, mb: 3, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff' }}>{currentTerm.term}</Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Write your balanced critique:</Typography>
                <TextField fullWidth multiline rows={4} value={critiques[currentIndex]} onChange={(e) => handleCritiqueChange(e.target.value)}
                  placeholder="Write a balanced critique showing both strengths and weaknesses using advanced vocabulary..."
                  helperText={`Word count: ${critiques[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for 20-30 words)`} />

                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.shadow }}>💡 Include in your critique:</Typography>
                  <Typography variant="body2" sx={{ color: P.teal.border }}>{currentTerm.keywords.join(', ')}</Typography>
                  <Typography variant="caption" sx={{ color: P.teal.shadow, display: 'block', mt: 0.5 }}>Use connecting words: "but", "yet", "although", "however"</Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < CRITIQUE_TERMS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!critiques[currentIndex].trim()} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: critiques[currentIndex].trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: critiques[currentIndex].trim() ? 1 : 0.4 }}>Next Term →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allFilled || evaluating} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: !allFilled || evaluating ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.green.shadow, opacity: !allFilled || evaluating ? 0.5 : 1 }}>{evaluating ? 'Evaluating...' : 'Submit Critiques 🎯'}</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to term:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {CRITIQUE_TERMS.map((t, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, px: 1, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.8rem' }}>
                      {t.term.slice(0, 4)}... {critiques[idx].trim() && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '🎯 Perfect Critiques! 🎯' : '🌟 Critiques Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Critique Review:</Typography>
                <Stack spacing={2}>
                  {CRITIQUE_TERMS.map((term, index) => {
                    const result = results[index]
                    return (
                      <Box key={index} sx={{ bgcolor: result?.passed ? P.green.bg : P.yellow.bg, border: `2px solid ${result?.passed ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result?.passed ? P.green.shadow : P.yellow.shadow }}>{term.term}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: result?.passed ? P.green.shadow : P.yellow.shadow }}>Your critique: "{critiques[index]}"</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: result?.passed ? P.green.shadow : P.yellow.shadow }}>{result?.feedback}</Typography>
                        {!result?.passed && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>Model critique: {term.modelCritique}</Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task C →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
