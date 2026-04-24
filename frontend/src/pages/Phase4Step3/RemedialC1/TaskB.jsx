import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, LinearProgress, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import ExploreIcon from '@mui/icons-material/Explore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task B: Analysis Odyssey
 * Write 8 analytical sentences with nuanced understanding
 * LLM evaluates C1 nuance, video reference, and analytical depth
 * Score: +1 for each C1-level analysis (8 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
}
const DARK = {
  pageBg: '#1a1a2e',
  purple: { bg: '#2d1b4e', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#052e16', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#1e3a5f', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#042f2e', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#F97316', shadow: '#C2410C' },
  yellow: { bg: '#3d3000', border: '#EAB308', shadow: '#A16207' },
}

const cardSx = (color) => ({
  bgcolor: color.bg,
  border: `2px solid ${color.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${color.shadow}`,
  p: 3,
})

const QUESTIONS = [
  { id: 1, term: 'Promotional', question: 'Analyze the promotional approach in advertising.', guidedPrompt: 'Consider: How does promotional strategy drive sales? What are the risks? Reference Video 1.', example: 'Promotional drives sales but risks overexposure as video 1 warns.', expectedConcepts: ['sales', 'drives', 'overexposure', 'risks', 'video 1', 'warns'] },
  { id: 2, term: 'Persuasive', question: 'Analyze the nuance of persuasive techniques.', guidedPrompt: 'Consider: How do ethos, pathos, and logos work together? What balance is needed?', example: 'Persuasive balances ethos/pathos/logos for credibility.', expectedConcepts: ['ethos', 'pathos', 'logos', 'balances', 'credibility', 'nuance'] },
  { id: 3, term: 'Targeted', question: 'Analyze the ethics of targeted advertising.', guidedPrompt: 'Consider: How does targeting enhance relevance? What ethical concerns arise?', example: 'Targeted enhances relevance yet raises privacy concerns.', expectedConcepts: ['relevance', 'enhances', 'privacy', 'ethical', 'concerns'] },
  { id: 4, term: 'Original', question: 'Analyze how original ideas fuel creativity.', guidedPrompt: 'Consider: What role do original ideas play in creative breakthroughs?', example: 'Original ideas fuel creative breakthroughs.', expectedConcepts: ['original', 'fuel', 'creative', 'breakthroughs', 'innovation'] },
  { id: 5, term: 'Consistent', question: 'Analyze the importance of consistent branding.', guidedPrompt: 'Consider: How does consistency build trust over time?', example: 'Consistent message builds trust over time.', expectedConcepts: ['consistent', 'trust', 'builds', 'time', 'branding'] },
  { id: 6, term: 'Personalized', question: 'Analyze the personalized advertising approach.', guidedPrompt: 'Consider: How does personalization increase engagement? What data ethics are involved?', example: 'Personalized ads increase engagement but demand data ethics.', expectedConcepts: ['personalized', 'engagement', 'data', 'ethics', 'privacy'] },
  { id: 7, term: 'Ethical', question: 'Analyze the ethical framework in advertising.', guidedPrompt: 'Consider: How does ethical advertising create long-term loyalty?', example: 'Ethical advertising fosters long-term loyalty.', expectedConcepts: ['ethical', 'loyalty', 'long-term', 'fosters', 'trust'] },
  { id: 8, term: 'Dramatisation', question: 'Analyze the impact of dramatisation in advertising.', guidedPrompt: 'Consider: How do goal/obstacle narratives create emotional resonance? Reference Video 2.', example: 'Dramatisation creates emotional resonance through goal/obstacle narratives.', expectedConcepts: ['dramatisation', 'emotional', 'resonance', 'goal', 'obstacle', 'video 2'] }
]

export default function RemedialC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/c1/taskC') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))
  const handleNext = () => { if (currentQuestionIndex < QUESTIONS.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1) }
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1) }

  const evaluateAnswers = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/phase4/step3/remedial/c1/evaluate-analyses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ analyses: QUESTIONS.map(q => ({ term: q.term, question: q.question, answer: answers[q.id] || '', example: q.example, expectedConcepts: q.expectedConcepts })) })
      })
      const data = await response.json()
      if (data.success) {
        setResults(data.results)
        setSubmitted(true)
        sessionStorage.setItem('remedial_step3_c1_taskB_score', data.total_score)
        await logTaskCompletion(data.total_score)
      } else { alert('Failed to evaluate answers. Please try again.') }
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('An error occurred during evaluation. Please try again.')
    } finally { setEvaluating(false) }
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'B', step: 2, score, max_score: 8, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] && answers[q.id].trim().length >= 20)
  const getTotalScore = () => results ? results.filter(r => r.score === 1).length : 0

  if (submitted && results) {
    const total = getTotalScore()
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3, textAlign: 'center' }}>
              <ExploreIcon sx={{ fontSize: 60, color: P.purple.shadow, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {total === 8 ? '🗺️ Odyssey Complete! 🗺️' : '🌟 Analysis Complete! 🌟'}
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: P.green.shadow }}>{total} / 8</Typography>
              <Typography variant="h6" color="text.secondary">Points Earned</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {total === 8 && '🏆 Perfect! Your analyses demonstrate exceptional C1-level nuance and depth!'}
                {total >= 6 && total < 8 && '🌟 Excellent work! Your analyses show strong C1-level understanding.'}
                {total < 6 && '💪 Good effort! Review the feedback to enhance analytical depth and nuance.'}
              </Typography>
            </Box>
            {results.map((result, index) => (
              <Box key={index} sx={{ ...cardSx(result.score === 1 ? P.green : { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }), mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {result.score === 1 ? <CheckCircleIcon sx={{ color: P.green.shadow }} /> : <CancelIcon sx={{ color: '#B91C1C' }} />}
                  <Typography variant="subtitle1" fontWeight="bold">Q{index + 1}: {result.term}</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{answers[QUESTIONS[index].id]}"</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: result.score === 1 ? P.green.shadow : '#B91C1C', fontWeight: 600 }}>
                  AI Feedback: {result.feedback}
                </Typography>
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/c1/taskC')} sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                Continue to Task C →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>Phase 4 - Step 3: Remedial Activities</Typography>
            <Typography variant="h5" sx={{ color: P.purple.border, mb: 0.5 }}>Level C1 - Task B: Analysis Odyssey 🗺️</Typography>
            <Typography variant="body1" color="text.secondary">Embark on an analytical journey through advertising concepts. Nuance reveals new depths!</Typography>
          </Box>
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Analysis Odyssey! 🗺️ This is a C1-level challenge requiring nuanced analytical writing. For each concept, write ONE sophisticated sentence that demonstrates critical thinking, references the videos when applicable, and shows deep understanding of advertising principles. Quality over quantity—aim for analytical depth!" />
          </Box>

          {/* Progress indicator */}
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Object.keys(answers).filter(id => answers[id]?.trim().length >= 20).length} / {QUESTIONS.length} completed
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={(currentQuestionIndex + 1) / QUESTIONS.length * 100}
              sx={{ height: 8, borderRadius: '8px', bgcolor: 'rgba(168,85,247,0.15)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: '8px' } }} />
          </Box>

          {/* Current Question */}
          <Box sx={{ ...cardSx(P.teal), minHeight: 400, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ px: 2, py: 0.5, bgcolor: P.purple.border, color: 'white', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Q{currentQuestionIndex + 1}
              </Box>
              <ExploreIcon sx={{ color: P.purple.border }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>
              {QUESTIONS[currentQuestionIndex].term}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              {QUESTIONS[currentQuestionIndex].question}
            </Typography>
            <Box sx={{ p: 2, mb: 2, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px' }}>
              <Typography variant="body2" fontWeight={500}>
                💡 {QUESTIONS[currentQuestionIndex].guidedPrompt}
              </Typography>
            </Box>
            <TextField fullWidth multiline rows={4}
              value={answers[QUESTIONS[currentQuestionIndex].id] || ''}
              onChange={(e) => handleAnswerChange(QUESTIONS[currentQuestionIndex].id, e.target.value)}
              placeholder="Write your analytical sentence here... (One sophisticated sentence with nuance and depth)"
              variant="outlined" disabled={submitted}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', '& fieldset': { borderColor: P.purple.border, borderWidth: 2 }, '&:hover fieldset': { borderColor: P.purple.shadow }, '&.Mui-focused fieldset': { borderColor: P.purple.shadow } } }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {answers[QUESTIONS[currentQuestionIndex].id]?.length || 0} characters • Minimum 20 characters
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', bgcolor: 'transparent', color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '12px', opacity: currentQuestionIndex === 0 ? 0.4 : 1, '&:hover': { bgcolor: P.purple.bg } }}>
              ← Previous
            </Box>
            {currentQuestionIndex < QUESTIONS.length - 1 ? (
              <Box component="button" onClick={handleNext}
                sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.purple.border, color: '#fff', border: `2px solid ${P.purple.shadow}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `4px 4px 0 ${P.purple.shadow}` } }}>
                Next →
              </Box>
            ) : (
              <Box component="button" onClick={evaluateAnswers} disabled={!allAnswered || evaluating}
                sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !allAnswered || evaluating ? 'not-allowed' : 'pointer', bgcolor: !allAnswered || evaluating ? 'grey.400' : P.green.border, color: '#fff', border: `2px solid ${!allAnswered || evaluating ? '#999' : P.green.shadow}`, borderRadius: '12px', boxShadow: !allAnswered || evaluating ? 'none' : `3px 3px 0 ${P.green.shadow}`, '&:hover': { transform: !allAnswered || evaluating ? 'none' : 'translate(-1px,-1px)' } }}>
                {evaluating ? 'Evaluating...' : allAnswered ? 'Submit All 🗺️' : 'Complete All First'}
              </Box>
            )}
          </Box>

          {evaluating && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress sx={{ height: 8, borderRadius: '8px' }} />
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>
                AI is evaluating your analyses for C1-level nuance, video references, and analytical depth...
              </Typography>
            </Box>
          )}

          {/* Dot navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {QUESTIONS.map((q, idx) => (
              <Box key={idx} component="button" onClick={() => setCurrentQuestionIndex(idx)}
                sx={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${idx === currentQuestionIndex ? P.purple.shadow : P.purple.border}`, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', bgcolor: idx === currentQuestionIndex ? P.purple.border : answers[q.id]?.trim().length >= 20 ? P.green.border : 'transparent', color: idx === currentQuestionIndex || answers[q.id]?.trim().length >= 20 ? 'white' : P.purple.border }}>
                {idx + 1}
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
