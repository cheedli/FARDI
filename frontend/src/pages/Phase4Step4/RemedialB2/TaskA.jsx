import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial B2 - Task A: Debate Simulation
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

const DEBATE_PROMPTS = [
  { id: 1, opponent: 'Is promotional advertising still effective today?', modelAnswer: 'Yes, promotional advertising remains highly effective because it directly drives sales and brand visibility, as video 1 clearly demonstrates through its emphasis on promotion as a core function.', keywords: ['effective', 'drives sales', 'brand visibility', 'video 1', 'promotion'] },
  { id: 2, opponent: "But isn't persuasive advertising manipulative?", modelAnswer: 'Not necessarily—when balanced with ethos, pathos, and logos as shown in video 1, persuasion builds genuine trust rather than manipulation.', keywords: ['ethos', 'pathos', 'logos', 'trust', 'video 1'] },
  { id: 3, opponent: 'What about targeted and personalized approaches?', modelAnswer: 'Targeted and personalized strategies increase relevance dramatically, but they must be ethical and respect privacy, which video 1 implicitly supports by stressing fairness.', keywords: ['targeted', 'personalized', 'ethical', 'privacy', 'video 1'] },
  { id: 4, opponent: 'How important is originality and creativity?', modelAnswer: 'Originality and creativity are essential for standing out in saturated media environments, exactly as video 1 argues when it highlights memorable and fresh ideas.', keywords: ['originality', 'creativity', 'standing out', 'memorable', 'video 1'] },
  { id: 5, opponent: 'And what about consistency and ethics?', modelAnswer: 'Consistency reinforces brand identity over time, while ethical advertising—avoiding exaggeration or deception—ensures long-term credibility, both of which video 1 positions as non-negotiable.', keywords: ['consistency', 'ethical', 'credibility', 'video 1', 'brand identity'] },
  { id: 6, opponent: 'How does dramatisation enhance advertising impact?', modelAnswer: 'Dramatisation creates emotional engagement through narrative structure, though it must feel authentic to avoid appearing contrived, as video 1 demonstrates.', keywords: ['dramatisation', 'emotional', 'narrative', 'authentic', 'video 1'] }
]

export default function RemedialB2TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState(Array(DEBATE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentPrompt = DEBATE_PROMPTS[currentIndex]

  const handleResponseChange = (value) => {
    const newResponses = [...responses]; newResponses[currentIndex] = value; setResponses(newResponses)
  }
  const handleNext = () => { if (currentIndex < DEBATE_PROMPTS.length - 1) setCurrentIndex(currentIndex + 1) }
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  const handleSubmit = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/phase4/step4/remedial/b2/evaluate-debate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ responses: responses.map((resp, idx) => ({ prompt: DEBATE_PROMPTS[idx].opponent, response: resp, modelAnswer: DEBATE_PROMPTS[idx].modelAnswer })) })
      })
      const data = await response.json()
      if (data.success) {
        setResults(data.results); const totalScore = data.results.filter(r => r.passed).length
        setScore(totalScore); sessionStorage.setItem('remedial_step4_b2_taskA_score', totalScore); await logTaskCompletion(totalScore)
      } else { fallback() }
    } catch { fallback() }
    setEvaluating(false); setSubmitted(true)
  }

  const fallback = () => {
    const fallbackResults = responses.map(resp => {
      const wordCount = resp.trim().split(/\s+/).length
      const passed = wordCount >= 15
      return { passed, feedback: passed ? 'Good response with sufficient detail.' : 'Response too short. Provide more nuanced argumentation.' }
    })
    setResults(fallbackResults)
    const totalScore = fallbackResults.filter(r => r.passed).length
    setScore(totalScore); sessionStorage.setItem('remedial_step4_b2_taskA_score', totalScore); logTaskCompletion(totalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'A', step: 4, score, max_score: 6, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/b2/taskB')
  window.__remedialSkip = handleContinue
  const allFilled = responses.every(r => r.trim().length > 0)
  const progress = ((currentIndex + 1) / DEBATE_PROMPTS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task A: Debate Simulation 💬</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Engage in a sophisticated debate with nuanced arguments and advanced vocabulary!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to advanced debate! You'll respond to 6 challenging questions about advertising. Use sophisticated vocabulary, reference video 1, and provide nuanced arguments with clear reasoning. Aim for at least 20-30 words per response!" />
          </Box>

          {!submitted ? (
            <Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, p: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 1 }}>Debate Round {currentIndex + 1} of {DEBATE_PROMPTS.length}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.yellow.border } }} />
              </Box>

              <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
                <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.shadow }}>Opponent says:</Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, fontStyle: 'italic', color: P.red.shadow }}>"{currentPrompt.opponent}"</Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Your Response:</Typography>
                <TextField fullWidth multiline rows={4} value={responses[currentIndex]} onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder="Write a sophisticated, nuanced response with advanced vocabulary and clear reference to video 1..."
                  helperText={`Word count: ${responses[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for 20-30 words)`} />

                <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.teal.shadow }}>💡 Tip: Include these concepts</Typography>
                  <Typography variant="body2" sx={{ color: P.teal.border }}>{currentPrompt.keywords.join(', ')}</Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, px: 3, py: 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.blue.shadow, opacity: currentIndex === 0 ? 0.4 : 1 }}>← Previous</Box>
                  {currentIndex < DEBATE_PROMPTS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!responses[currentIndex].trim()} sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, px: 3, py: 1, cursor: responses[currentIndex].trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', color: P.teal.shadow, opacity: responses[currentIndex].trim() ? 1 : 0.4, '&:hover': responses[currentIndex].trim() ? { transform: 'translate(-2px,-2px)' } : {} }}>Next Round →</Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={!allFilled || evaluating} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, px: 3, py: 1, cursor: !allFilled || evaluating ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: P.green.shadow, opacity: !allFilled || evaluating ? 0.5 : 1 }}>{evaluating ? 'Evaluating...' : 'Submit Debate 💬'}</Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.teal.shadow}`, p: 2 }}>
                <Typography variant="body2" sx={{ color: P.teal.shadow, mb: 1 }}>Jump to round:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {DEBATE_PROMPTS.map((_, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{ bgcolor: idx === currentIndex ? P.teal.border : P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', boxShadow: `2px 2px 0 ${P.teal.shadow}`, minWidth: 36, py: 0.5, cursor: 'pointer', fontWeight: 'bold', color: idx === currentIndex ? '#fff' : P.teal.shadow, fontSize: '0.85rem' }}>
                      {idx + 1} {responses[idx].trim() && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 6 ? P.green.bg : P.yellow.bg, border: `2px solid ${score === 6 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 6 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>{score === 6 ? '💬 Perfect Debate! 💬' : '🌟 Debate Complete! 🌟'}</Typography>
                <Typography variant="h6" sx={{ color: score === 6 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Debate Review:</Typography>
                <Stack spacing={2}>
                  {DEBATE_PROMPTS.map((prompt, index) => {
                    const result = results[index]
                    return (
                      <Box key={index} sx={{ bgcolor: result?.passed ? P.green.bg : P.yellow.bg, border: `2px solid ${result?.passed ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result?.passed ? P.green.shadow : P.yellow.shadow }}>Round {index + 1}: {prompt.opponent}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: result?.passed ? P.green.shadow : P.yellow.shadow }}>Your response: "{responses[index]}"</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: result?.passed ? P.green.shadow : P.yellow.shadow }}>{result?.feedback}</Typography>
                        {!result?.passed && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>Model answer: {prompt.modelAnswer}</Typography>}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task B →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
