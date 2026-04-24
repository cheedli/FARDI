import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme, TextField } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 5 - Remedial C1 - Task D: Tense Odyssey
 * Correct 6 sentences with mixed errors (tense, grammar, structure)
 * Score: +1 for each correct sentence (6 total)
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

const MIXED_ERROR_SENTENCES = [
  {
    id: 1,
    faulty: 'Promotional advertising are to sell but it lack persuasive.',
    correctAnswer: 'Promotional advertising, which has been used to drive sales for decades, would be far more effective if it incorporated balanced persuasive techniques as video 1 suggests.',
    keyElements: ['has been used', 'would be', 'if it incorporated', 'as video 1 suggests']
  },
  {
    id: 2,
    faulty: 'The gatefold which provide space in posters are effective.',
    correctAnswer: 'The gatefold, which provides space in posters, would have been even more impactful had it been combined with targeted imagery.',
    keyElements: ['which provides', 'would have been', 'had it been combined']
  },
  {
    id: 3,
    faulty: 'Dramatisation in video 2 were used to engage but it feel contrived.',
    correctAnswer: 'Dramatisation in video 2 was employed to engage viewers emotionally, although it would have felt more authentic had the obstacles been portrayed more realistically.',
    keyElements: ['was employed', 'would have felt', 'had the obstacles been portrayed']
  },
  {
    id: 4,
    faulty: 'Persuasive appeals which is based on ethos pathos logos is powerful.',
    correctAnswer: 'Persuasive appeals, which are based on ethos, pathos, and logos, have proven powerful when balanced correctly, as video 1 illustrates.',
    keyElements: ['which are based', 'have proven', 'when balanced', 'as video 1 illustrates']
  },
  {
    id: 5,
    faulty: 'Targeted ads has become more precise but raise ethical issue.',
    correctAnswer: 'Targeted ads have become significantly more precise, yet they would raise fewer ethical issues if transparency were maintained.',
    keyElements: ['have become', 'would raise', 'if transparency were maintained']
  },
  {
    id: 6,
    faulty: 'Creative execution stand out but need consistent with brand.',
    correctAnswer: 'Creative execution stands out in oversaturated markets, but it would lose impact if it had not remained consistent with the brand identity.',
    keyElements: ['stands out', 'would lose', 'if it had not remained']
  }
]

export default function Phase4Step5RemedialC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const checkAnswerFallback = (id) => {
    const userAnswer = answers[id]?.toLowerCase().trim()
    const sentence = MIXED_ERROR_SENTENCES.find(s => s.id === id)
    const hasKeyElements = sentence.keyElements.every(element => userAnswer.includes(element.toLowerCase()))
    const hasProperLength = userAnswer.length >= 80
    const hasPunctuation = userAnswer.includes(',')
    const isNotFaulty = userAnswer !== sentence.faulty.toLowerCase()
    return hasKeyElements && hasProperLength && hasPunctuation && isNotFaulty
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    for (const sentence of MIXED_ERROR_SENTENCES) {
      const userAnswer = answers[sentence.id] || ''
      let isCorrect = false
      try {
        const response = await fetch('/api/phase4/step5/remedial/evaluate-tense', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ level: 'C1', faultySentence: sentence.faulty, userAnswer: userAnswer.trim(), expectedAnswer: sentence.correctAnswer, keyElements: sentence.keyElements, sentenceId: sentence.id })
        })
        const data = await response.json()
        isCorrect = data.correct
      } catch (error) {
        console.error('LLM evaluation error:', error)
        isCorrect = checkAnswerFallback(sentence.id)
      }
      if (isCorrect) correctCount++
      evaluationResults.push({ id: sentence.id, faulty: sentence.faulty, userAnswer, correctAnswer: sentence.correctAnswer, isCorrect, keyElements: sentence.keyElements })
    }

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_c1_taskD_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/step5/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'D', score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4/step/5/remedial/c1/taskE')
  window.__remedialSkip = handleContinue
  const allFilled = MIXED_ERROR_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 Step 5: Evaluate - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task D: Tense Odyssey ⏰</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Correct 6 sentences with mixed errors (tense, grammar, structure)!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="LILIA" message="Welcome to the Tense Odyssey! ⏰ You have 6 faulty sentences with mixed errors. Your mission: completely rewrite each sentence correcting tense, grammar, and structure while adding C1-level sophistication. Focus on complex conditionals, perfect tenses, and sophisticated structures!" />
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.shadow, mb: 1 }}>⏰ What to Fix (C1 Level):</Typography>
            <Stack spacing={0.75}>
              {[
                ['Tense Accuracy:', 'Use perfect tenses (has been used, have become, have proven), past perfect (had been, had it been)'],
                ['Conditionals:', 'Use complex conditionals (would be, would have been, would have felt, if it incorporated, had it been)'],
                ['Subject-Verb Agreement:', 'are→is, were→was, has→have, stand→stands'],
                ['Sophisticated Vocabulary:', 'employed, portrayed, illustrates, oversaturated, authentic'],
                ['Complex Syntax:', 'Use commas, dashes, subordinate clauses, relative clauses (which, although, yet)'],
                ['Video References:', 'Include "as video 1 suggests", "in video 2", etc.'],
              ].map(([l, d]) => (
                <Typography key={l} variant="body2" sx={{ color: P.teal.shadow }}><strong>{l}</strong> {d}</Typography>
              ))}
            </Stack>
          </Box>

          {!submitted ? (
            <Box>
              <Stack spacing={3} sx={{ mb: 3 }}>
                {MIXED_ERROR_SENTENCES.map((sentence, index) => (
                  <Box key={sentence.id} sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.purple.shadow}`, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: P.purple.border, mb: 0.5 }}>Sentence {index + 1}</Typography>
                    <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${P.red.shadow}`, p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.shadow, mb: 0.5 }}>❌ Faulty Sentence:</Typography>
                      <Typography variant="body1" sx={{ color: P.red.border, fontFamily: 'monospace' }}>{sentence.faulty}</Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Your C1-level correction"
                      value={answers[sentence.id] || ''}
                      onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                      placeholder="Completely rewrite the sentence with proper tenses, conditionals, and sophisticated structure..."
                      variant="outlined"
                      helperText="Fix tense, grammar, add sophistication (min 80 characters)"
                    />
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="center">
                <Box component="button" onClick={handleSubmit} disabled={!allFilled}
                  sx={{ bgcolor: allFilled ? P.green.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.green.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.green.shadow : P.yellow.shadow}`, px: 5, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.green.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6, '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } : {} }}>
                  {allFilled ? 'Submit Tense Odyssey ⏰' : 'Fill All Sentences First'}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                  {score === 6 ? '⏰ Perfect Tense Mastery! ⏰' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
                </Typography>
                <Typography variant="h6" sx={{ color: score >= 5 ? P.green.border : P.yellow.border, mt: 1 }}>You scored {score} out of 6 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Answer Review:</Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={result.id} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', boxShadow: `2px 2px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`, p: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>Sentence {index + 1}:</Typography>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5, fontStyle: 'italic' }}>Faulty: {result.faulty}</Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>Your answer: {result.userAnswer || '(no answer)'}</Typography>
                      {!result.isCorrect && (
                        <>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow, mt: 0.5 }}>✓ Expected correction: {result.correctAnswer}</Typography>
                          <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, display: 'block', mt: 0.5 }}>Key elements needed: {result.keyElements.join(', ')}</Typography>
                        </>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 5, py: 1.5, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task E →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
