import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, LinearProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial B2 - Task B: Analysis Odyssey
 * Correct 8 faulty sentences one by one for coherence/vocabulary
 * Score: +1 per correctly corrected sentence (8 total)
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

const SENTENCE_CORRECTIONS = [
  { id: 1, faulty: 'Poster with billboard is good but it not have slogan good.', correct: 'A poster with a billboard-style design is effective, but it often lacks a strong slogan.' },
  { id: 2, faulty: 'Video feature is viral but animation are bad sometime.', correct: 'The video feature goes viral easily, although the animation is sometimes poorly executed.' },
  { id: 3, faulty: 'Slogan use words catchy but it not clear always.', correct: 'The slogan uses catchy words, but it is not always clear to the audience.' },
  { id: 4, faulty: 'Layout in poster organize thing but color is too much bright.', correct: 'The layout in the poster organizes information well, even though the colors can be overly bright.' },
  { id: 5, faulty: 'Dramatisation in video make emotional but it too long and boring.', correct: 'Dramatisation in the video creates emotional impact, but it can become too long and feel boring.' },
  { id: 6, faulty: 'Jingle is song nice but not fit with video sometime.', correct: "The jingle is a pleasant tune, but it does not always fit the video's mood." },
  { id: 7, faulty: 'Clip show culture but it jump too fast and confuse.', correct: 'The clips show cultural elements, but they jump too fast and can confuse viewers.' },
  { id: 8, faulty: 'Overall promotion is ok but need improve for attract more people.', correct: 'Overall, the promotion is acceptable, but it needs improvement to attract more people.' },
]

export default function Phase4Step5RemedialB2TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b2' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_CORRECTIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()
    setFeedback({ type: 'info', message: 'Evaluating your correction...' })

    try {
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'B2', faultySentence, userAnswer: userAnswerTrimmed, sentenceIndex: currentSentence })
      })
      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0
      if (data.correct) {
        setScore(score + pointsEarned)
        setFeedback({ type: 'success', message: `Excellent B2-level correction! Odyssey continues! +${pointsEarned} point` })
      } else {
        setFeedback({ type: 'error', message: data.feedback || 'Not quite B2 level. Focus on: articles (a/the), subject-verb agreement, advanced vocabulary, and connectors.' })
      }
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          setCurrentSentence(currentSentence + 1); setUserAnswer(''); setFeedback(null)
        } else {
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b2_taskB_score', finalScore)
          logTaskCompletion(finalScore); setGameCompleted(true); setFeedback(null)
        }
      }, 2000)
    } catch (error) {
      console.error('Evaluation error:', error)
      const userLower = userAnswerTrimmed.toLowerCase()
      const hasArticles = /\b(a|an|the)\b/.test(userLower)
      const hasAdvancedVocab = /(effective|pleasant|acceptable|poorly executed|organizes|creates)/i.test(userAnswerTrimmed)
      const hasProperLength = userAnswerTrimmed.split(/\s+/).length >= 8
      const hasFixes = userLower !== faultySentence.toLowerCase()
      const pointsEarned = (hasArticles && hasAdvancedVocab && hasProperLength && hasFixes) ? 1 : 0
      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({ type: 'success', message: `Good B2-level improvement! Odyssey continues! +${pointsEarned} point` })
      } else {
        setFeedback({ type: 'error', message: 'Remember to add articles (a/the), use advanced vocabulary (effective, pleasant), fix grammar, and create coherent sentences.' })
      }
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          setCurrentSentence(currentSentence + 1); setUserAnswer(''); setFeedback(null)
        } else {
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_b2_taskB_score', finalScore)
          logTaskCompletion(finalScore); setGameCompleted(true); setFeedback(null)
        }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: finalScore })
    try { await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'B', score: finalScore, max_score: 8, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/b2/taskC')
  const progress = ((currentSentence + 1) / SENTENCE_CORRECTIONS.length) * 100
  const canSubmit = userAnswer.trim().split(/\s+/).length >= 5

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level B2 - Task B: Analysis Odyssey 📝</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Journey through corrections! Rewrite faulty sentences with B2-level accuracy.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Welcome to the Analysis Odyssey! 📝 You have 8 faulty sentences to correct, one at a time. Your mission: completely rewrite each sentence with proper grammar, articles, advanced vocabulary, and coherent structure. Each correct B2-level sentence earns you 1 point!" />
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.shadow, mb: 1 }}>📝 What to Fix:</Typography>
            <Stack spacing={0.75}>
              {[
                ['Grammar:', 'Subject-verb agreement (are→is, have→has), verb forms (organize→organizes)'],
                ['Articles:', 'Add a/the (poster→a poster, video→the video)'],
                ['Spelling:', 'sometime→sometimes, thing→information'],
                ['Vocabulary:', 'Upgrade (good→effective, bad→poorly executed, ok→acceptable, nice→pleasant)'],
                ['Connectors:', 'Use although, even though, but properly'],
                ['Coherence:', 'Create logical flow between ideas'],
              ].map(([label, desc]) => (
                <Typography key={label} variant="body2" sx={{ color: P.teal.shadow }}><strong>{label}</strong> {desc}</Typography>
              ))}
            </Stack>
          </Box>

          {!gameCompleted ? (
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }} />

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.purple.shadow}`, px: 2, py: 0.75 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.shadow }}>Sentence {currentSentence + 1} / {SENTENCE_CORRECTIONS.length}</Typography>
                </Box>
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.green.shadow}`, px: 2, py: 0.75 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>Score: {score} / {SENTENCE_CORRECTIONS.length}</Typography>
                </Box>
              </Stack>

              <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.red.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.shadow, mb: 1 }}>❌ Faulty Sentence (DO NOT copy — rewrite it!):</Typography>
                <Typography variant="h6" sx={{ color: P.red.border, fontFamily: 'monospace' }}>{SENTENCE_CORRECTIONS[currentSentence].faulty}</Typography>
              </Box>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.green.shadow, mb: 1 }}>✏️ Your B2-level correction (fix grammar, add articles, upgrade vocabulary):</Typography>
              <TextField fullWidth multiline rows={2} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} disabled={feedback !== null} placeholder="Rewrite the sentence with B2-level improvements..." variant="outlined" autoFocus sx={{ mb: 2 }} />

              {feedback && (
                <Box sx={{
                  bgcolor: feedback.type === 'success' ? P.green.bg : feedback.type === 'info' ? P.blue.bg : P.red.bg,
                  border: `2px solid ${feedback.type === 'success' ? P.green.border : feedback.type === 'info' ? P.blue.border : P.red.border}`,
                  borderRadius: '12px',
                  boxShadow: `3px 3px 0 ${feedback.type === 'success' ? P.green.shadow : feedback.type === 'info' ? P.blue.shadow : P.red.shadow}`,
                  p: 2, mb: 2
                }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: feedback.type === 'success' ? P.green.shadow : feedback.type === 'info' ? P.blue.shadow : P.red.shadow }}>
                    {feedback.message}
                  </Typography>
                </Box>
              )}

              {!feedback && (
                <Box component="button" onClick={handleCheckSentence} disabled={!canSubmit}
                  sx={{ display: 'block', width: '100%', bgcolor: canSubmit ? P.green.bg : P.yellow.bg, border: `2px solid ${canSubmit ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${canSubmit ? P.green.shadow : P.yellow.shadow}`, p: 2, cursor: canSubmit ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: canSubmit ? P.green.shadow : P.yellow.shadow, opacity: canSubmit ? 1 : 0.6, '&:hover': canSubmit ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {canSubmit ? 'Check Sentence ✓' : 'Write at least 5 words'}
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: P.green.shadow }}>📝 Analysis Odyssey Complete!</Typography>
                <Typography variant="h5" sx={{ color: P.green.border, mt: 1 }}>Score: {score} / 8</Typography>
                <Typography variant="body1" sx={{ color: P.green.shadow, mt: 1 }}>
                  {score === 8 ? 'Perfect B2-level writing! All sentences corrected excellently!' : score >= 6 ? 'Great job! Strong B2-level improvements!' : 'Good effort! Keep practicing B2 writing skills!'}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                  Continue to Task C →
                </Box>
              </Stack>
            </>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
