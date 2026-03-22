import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, LinearProgress, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task D: Spell Quest
 * Spelling and explanation challenge - spell 6 terms and explain them
 * Terms: hashtag—# for visibility, caption—Text description, emoji—Visual emotion,
 * tag—Mention people, call-to-action—Prompt action, viral—Rapid sharing
 * Inspired by British Council Sushi Spell
 * Score: 2 points per term (1 spell + 1 explain) = 12 total
 * Pass threshold: 9/12
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

const TERMS = [
  { id: 1, word: 'hashtag', hint: '# symbol for visibility', expectedExplanation: 'visibility categorize search discover' },
  { id: 2, word: 'caption', hint: 'Text description', expectedExplanation: 'text describe context story tell' },
  { id: 3, word: 'emoji', hint: 'Visual emotion', expectedExplanation: 'visual emotion icon feeling express' },
  { id: 4, word: 'tag', hint: 'Mention people', expectedExplanation: 'mention people user network amplify' },
  { id: 5, word: 'call-to-action', hint: 'Prompt action', expectedExplanation: 'prompt action click conversion engage' },
  { id: 6, word: 'viral', hint: 'Rapid sharing', expectedExplanation: 'rapid spread share millions popular' }
]

export default function RemedialB2TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_b2' })
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentSpelling, setCurrentSpelling] = useState('')
  const [currentExplanation, setCurrentExplanation] = useState('')
  const [gameFinished, setGameFinished] = useState(false)
  const [score, setScore] = useState(0)

  const currentTerm = TERMS[currentTermIndex]

  const handleSubmitTerm = () => {
    const spellingCorrect = currentSpelling.toLowerCase().trim() === currentTerm.word.toLowerCase()

    // Simple explanation check: does it contain at least 2 expected keywords?
    const explanationWords = currentExplanation.toLowerCase().split(/\s+/)
    const expectedWords = currentTerm.expectedExplanation.toLowerCase().split(/\s+/)
    const matchCount = expectedWords.filter(word => explanationWords.includes(word)).length
    const explanationCorrect = matchCount >= 2 && currentExplanation.trim().length >= 10

    const spellingScore = spellingCorrect ? 1 : 0
    const explanationScore = explanationCorrect ? 1 : 0

    const newAnswer = {
      termId: currentTerm.id,
      word: currentTerm.word,
      hint: currentTerm.hint,
      userSpelling: currentSpelling.trim(),
      userExplanation: currentExplanation.trim(),
      spellingScore,
      explanationScore,
      spellingCorrect,
      explanationCorrect
    }

    setUserAnswers([...userAnswers, newAnswer])
    setScore(score + spellingScore + explanationScore)

    // Move to next term or finish
    if (currentTermIndex < TERMS.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1)
      setCurrentSpelling('')
      setCurrentExplanation('')
    } else {
      finishGame(score + spellingScore + explanationScore)
    }
  }

  const finishGame = (finalScore) => {
    setGameFinished(true)
    sessionStorage.setItem('phase4_2_step3_b2_taskD', finalScore)

    // Log to backend
    fetch('/api/phase4/remedial/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase: '4.2',
        level: 'B2',
        task: 'D',
        step: 3,
        score: finalScore,
        max_score: 12,
        completed: true
      })
    }).catch(err => console.error('Log error:', err))
  }

  const handleContinue = () => {
    navigate('/phase4_2/step3/remedial/b2/results')
  }

  const canSubmit = currentSpelling.trim().length > 0 && currentExplanation.trim().length >= 10

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  if (gameFinished) {
    const passed = score >= 9

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

            {/* Header */}
            <Box sx={{ ...clayCard('orange'), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SpellcheckIcon sx={{ color: P.orange.border }} />
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
                  Phase 4.2 · Step 3 · Remedial B2
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>
                Task D: Spell Quest — Results
              </Typography>
            </Box>

            {/* Score Card */}
            <Box sx={{ ...clayCard(passed ? 'green' : 'yellow'), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: passed ? P.green.border : P.yellow.border, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: passed ? P.green.border : P.yellow.border }}>
                {passed ? 'Excellent Spelling!' : 'Keep Practicing!'}
              </Typography>
              <Box sx={{ ...clayCard('blue'), maxWidth: 240, mx: 'auto', my: 3, textAlign: 'center' }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.blue.border }}>
                  {score} / 12
                </Typography>
                <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555' }}>Points Earned</Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#777' }}>Pass threshold: 9/12</Typography>
              </Box>
              {passed && (
                <Box sx={{ ...clayCard('green'), mt: 2 }}>
                  <Typography fontWeight="bold" sx={{ color: P.green.border }}>
                    Great work! You've mastered both spelling and explaining social media terms!
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Review */}
            <Box sx={{ ...clayCard('blue'), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>
                Review
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {userAnswers.map((answer, index) => {
                  const totalCorrect = answer.spellingCorrect && answer.explanationCorrect
                  const partial = answer.spellingCorrect || answer.explanationCorrect
                  const rowColor = totalCorrect ? 'green' : partial ? 'yellow' : 'red'

                  return (
                    <Box key={index} sx={{ ...clayCard(rowColor) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>
                          Term {index + 1}: {answer.word}
                        </Typography>
                        {totalCorrect
                          ? <CheckCircleIcon sx={{ color: P.green.border }} />
                          : <CancelIcon sx={{ color: P[rowColor].border }} />}
                        <Box sx={{
                          bgcolor: P[rowColor].bg,
                          border: `2px solid ${P[rowColor].border}`,
                          borderRadius: '12px',
                          px: 1.5, py: 0.25,
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: P[rowColor].border,
                        }}>
                          {answer.spellingScore + answer.explanationScore}/2 pts
                        </Box>
                      </Box>

                      {/* Hint */}
                      <Box sx={{ ...clayCard('yellow'), mb: 2, p: 2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: P.yellow.border }}>
                          Hint: {answer.hint}
                        </Typography>
                      </Box>

                      {/* Spelling Result */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#ccc' : '#333', mb: 1 }}>
                          Spelling: {answer.spellingCorrect ? 'Correct (+1)' : 'Incorrect (+0)'}
                        </Typography>
                        <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 2 }}>
                          <Typography variant="body2" sx={{ color: isDark ? '#ddd' : '#2c3e50', fontWeight: 500 }}>
                            You spelled: <strong>{answer.userSpelling || '(no answer)'}</strong>
                          </Typography>
                          {!answer.spellingCorrect && (
                            <Typography variant="body2" sx={{ color: P.red.border, fontWeight: 500, mt: 1 }}>
                              Correct spelling: <strong>{answer.word}</strong>
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Explanation Result */}
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#ccc' : '#333', mb: 1 }}>
                          Explanation: {answer.explanationCorrect ? 'Good (+1)' : 'Needs improvement (+0)'}
                        </Typography>
                        <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '12px', p: 2 }}>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: isDark ? '#ddd' : '#2c3e50', fontWeight: 500 }}>
                            "{answer.userExplanation || '(no explanation provided)'}"
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/* Continue Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-block',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Results
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SpellcheckIcon sx={{ color: P.orange.border }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
                Phase 4.2 · Step 3 · Remedial B2
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>
              Task D: Spell Quest
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#555', mt: 0.5 }}>
              Spell words and explain them! Inspired by British Council Sushi Spell.
            </Typography>
          </Box>

          {/* Character Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Welcome to Spell Quest! For each term, you'll see a hint. Type the correct spelling, then write a brief explanation of what it means. Each term is worth 2 points: 1 for spelling + 1 for explanation. Total: 12 points!"
            />
          </Box>

          {/* Progress */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border }}>
                Term {currentTermIndex + 1} of {TERMS.length}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>
                Score: {score} / 12
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(currentTermIndex / TERMS.length) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: isDark ? '#333' : '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 5 }
              }}
            />
          </Box>

          {/* Hint Card */}
          <Box sx={{ ...clayCard('orange'), mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f' }}>
              Hint: {currentTerm.hint}
            </Typography>
          </Box>

          {/* Spelling Input */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mb: 2 }}>
              1. Spell the word:
            </Typography>
            <TextField
              fullWidth
              value={currentSpelling}
              onChange={(e) => setCurrentSpelling(e.target.value)}
              placeholder="Type the correct spelling..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#1a1a2e' : 'white',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: P.purple.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                  '& input': { color: isDark ? '#eee' : '#1a252f', fontWeight: 600, fontSize: '1.2rem' }
                }
              }}
            />
          </Box>

          {/* Explanation Input */}
          <Box sx={{ ...clayCard('green'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mb: 2 }}>
              2. Explain what it means:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={currentExplanation}
              onChange={(e) => setCurrentExplanation(e.target.value)}
              placeholder="Write a brief explanation of what this term means in social media context..."
              variant="outlined"
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#1a1a2e' : 'white',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.green.border, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: P.green.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.green.shadow },
                  '& textarea': { color: isDark ? '#eee' : '#1a252f', fontWeight: 500, fontSize: '1.05rem' }
                }
              }}
            />
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#555', fontWeight: 600 }}>
              Characters: {currentExplanation.length} / 10+ (minimum)
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component="button"
              onClick={handleSubmitTerm}
              disabled={!canSubmit}
              sx={{
                ...clayCard('orange'),
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.5,
                px: 6, py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: P.orange.border,
                display: 'inline-block',
                '&:hover': canSubmit ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                transition: 'all 0.15s ease',
              }}
            >
              {currentTermIndex < TERMS.length - 1 ? 'Submit & Next Term' : 'Submit & See Results'}
            </Box>
          </Box>

          {/* Inspiration Note */}
          <Box sx={{ ...clayCard('teal'), textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: P.teal.border, fontStyle: 'italic' }}>
              Inspired by British Council Sushi Spell game format
            </Typography>
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
