import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SushiSpellGame from '../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 2 Interaction 3: Sushi Spell Game
 * Students play Sushi Spell to practice spelling advertising vocabulary,
 * then explain the connection between the game, a word, and the videos
 */

const VOCABULARY_WORDS = [
  'persuasive', 'targeted', 'creative', 'dramatisation',
  'goal', 'obstacles', 'friction'
]

export default function Phase4Step3Interaction3() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'main' })
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Game completed:', result)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please explain how to use Sushi Spell with one of the vocabulary words.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/evaluate-game-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: 'How would you use Sushi Spell to practice one vocabulary word from the videos?',
          answer: answer.trim(),
          vocabularyWords: VOCABULARY_WORDS,
          expectedElements: ['game', 'word', 'video', 'spelling', 'practice'],
          level: 'B1'
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'B1',
          feedback: data.feedback || 'Good explanation!'
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase4_step3_interaction3_score', data.score || 1)
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const answerLower = answer.toLowerCase()

      // Check if mentions a vocabulary word
      const mentionsWord = VOCABULARY_WORDS.some(word => answerLower.includes(word))
      const mentionsGame = answerLower.includes('sushi') || answerLower.includes('spell') || answerLower.includes('game')
      const mentionsVideo = answerLower.includes('video') || answerLower.includes('first') || answerLower.includes('second')
      const mentionsPractice = answerLower.includes('practice') || answerLower.includes('learn') || answerLower.includes('spell')

      let score = 1 // A1 baseline
      let level = 'A1'

      const wordCount = answer.split(/\s+/).length

      if (mentionsWord && mentionsGame && mentionsVideo && wordCount >= 15) {
        score = 5 // C1
        level = 'C1'
      } else if (mentionsWord && mentionsGame && (mentionsVideo || mentionsPractice) && wordCount >= 12) {
        score = 4 // B2
        level = 'B2'
      } else if (mentionsWord && (mentionsGame || mentionsPractice) && wordCount >= 8) {
        score = 3 // B1
        level = 'B1'
      } else if (mentionsWord && wordCount >= 5) {
        score = 2 // A2
        level = 'A2'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: score >= 3
          ? 'Good explanation! You connected the game, word, and videos well.'
          : 'Good start! Try to explain how the game helps with a specific word from the videos.'
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step3_interaction3_score', score)
      console.log(`[Phase 4 Step 3 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    const score1 = parseInt(sessionStorage.getItem('phase4_step3_interaction1_score') || '1')
    const score2 = parseInt(sessionStorage.getItem('phase4_step3_interaction2_score') || '1')
    const score3 = parseInt(sessionStorage.getItem('phase4_step3_interaction3_score') || '1')
    const totalScore = score1 + score2 + score3

    sessionStorage.setItem('phase4_step3_total_score', totalScore)

    console.log(`[Phase 4 Step 3] Calculating score - I1=${score1}, I2=${score2}, I3=${score3}, Total=${totalScore}`)

    try {
      const response = await fetch('/api/phase4/step/3/calculate-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          interaction1_score: score1,
          interaction2_score: score2,
          interaction3_score: score3
        })
      })

      const data = await response.json()

      if (data.success) {
        const nextUrl = data.data?.total?.next_url
        const remedialLevel = data.data?.total?.remedial_level

        if (nextUrl) {
          const clientUrl = nextUrl.replace(/^\/app/, '')
          console.log(`[Phase 4 Step 3] Backend assigned remedial: ${remedialLevel}`)
          console.log(`[Phase 4 Step 3] Routing to: ${clientUrl}`)
          navigate(clientUrl)
          return
        }
      } else {
        console.error('Error calculating score:', data.error)
      }
    } catch (error) {
      console.error('Error calling calculate-score endpoint:', error)
    }

    let remedialPath = ''
    if (totalScore < 4) {
      remedialPath = '/phase4/step/2/remedial/a1/taskA'
    } else if (totalScore < 7) {
      remedialPath = '/phase4/step/2/remedial/a2/taskA'
    } else if (totalScore < 10) {
      remedialPath = '/phase4/step/2/remedial/b1/taskA'
    } else if (totalScore < 13) {
      remedialPath = '/phase4/step/2/remedial/b2/taskA'
    } else {
      remedialPath = '/phase4/step/2/remedial/c1/taskA'
    }

    console.log(`[Phase 4 Step 3 - FALLBACK] Routing to: ${remedialPath}`)
    navigate(remedialPath)
  }

  useEffect(() => {
    window.__remedialSkip = () => navigate('/phase4/step/2/remedial/a1/taskA')
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 2: Explain - Interaction 3
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Use Sushi Spell game to practice advertising vocabulary
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ryan"
              message="Use a game to explain more terms from the videos."
            />
          </Box>

          {/* Vocabulary Words */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Vocabulary Words to Practice:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {VOCABULARY_WORDS.map((word, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                  display: 'inline-block'
                }}>{word}</Box>
              ))}
            </Stack>
          </Box>

          {/* Sushi Spell Game */}
          <Box sx={{ mb: 4 }}>
            <SushiSpellGame onComplete={handleGameComplete} />
          </Box>

          {/* Question Section - Only show after game is completed */}
          {gameResult && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Question: How would you use Sushi Spell to practice one vocabulary word from the videos?
              </Typography>

              {gameResult.foundWords.length > 0 && (
                <Box sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', p: 2, mb: 2,
                }}>
                  <Typography variant="body2" sx={{ color: P.green.shadow }}>
                    <strong>You spelled these words:</strong> {gameResult.foundWords.join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: P.green.shadow, mt: 1 }}>
                    Pick one of these words and explain how practicing it in Sushi Spell helps you remember it from the videos!
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Example: Use Sushi Spell to practice spelling 'targeted' because it's timed and the first video mentioned specific audiences..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: P.orange.border },
                    '&:hover fieldset': { borderColor: P.orange.shadow },
                    '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                  }
                }}
              />

              {!submitted && (
                <Box component="button" onClick={handleSubmit} disabled={loading || !answer.trim()} sx={{
                  width: '100%',
                  bgcolor: (loading || !answer.trim()) ? 'grey.200' : P.blue.bg,
                  border: `2px solid ${(loading || !answer.trim()) ? '#ccc' : P.blue.border}`,
                  borderRadius: '12px',
                  boxShadow: (loading || !answer.trim()) ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: (loading || !answer.trim()) ? 'not-allowed' : 'pointer',
                  color: (loading || !answer.trim()) ? 'grey.500' : P.blue.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': (loading || !answer.trim()) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                  '&:active': (loading || !answer.trim()) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                }}>
                  {loading ? <CircularProgress size={20} /> : 'Submit Answer'}
                </Box>
              )}
            </Box>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.red.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.red.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.red.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{
                  fontSize: 40,
                  color: evaluation.success ? P.green.shadow : P.red.shadow,
                  mr: 2
                }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                    {evaluation.success ? 'Answer Submitted!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, opacity: 0.8 }}>
                    Level: {evaluation.level} | Score: {evaluation.score}/5
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, mb: 2 }}>
                {evaluation.feedback}
              </Typography>

              {submitted && (() => {
                const score1 = parseInt(sessionStorage.getItem('phase4_step3_interaction1_score') || '0')
                const score2 = parseInt(sessionStorage.getItem('phase4_step3_interaction2_score') || '0')
                const score3 = parseInt(sessionStorage.getItem('phase4_step3_interaction3_score') || '0')
                const totalScore = score1 + score2 + score3

                let assignedLevel = ''
                if (totalScore < 4) assignedLevel = 'A1'
                else if (totalScore < 7) assignedLevel = 'A2'
                else if (totalScore < 10) assignedLevel = 'B1'
                else if (totalScore < 13) assignedLevel = 'B2'
                else assignedLevel = 'C1'

                return (
                  <>
                    <Box sx={{
                      bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                      borderRadius: '12px', p: 2, mb: 2,
                    }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                        Overall Performance Summary
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                          <strong>Interaction 1 (Persuasive):</strong> {score1}/5 points
                        </Typography>
                        <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                          <strong>Interaction 2 (Dramatisation):</strong> {score2}/5 points
                        </Typography>
                        <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                          <strong>Interaction 3 (Game Connection):</strong> {score3}/5 points
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, color: P.blue.shadow }}>
                          <strong>Total Score: {totalScore}/15</strong>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, color: P.blue.shadow }}>
                          <strong>Assigned Level: {assignedLevel}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow, opacity: 0.8 }}>
                          {`You will now proceed to ${assignedLevel}-level activities.`}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box component="button" onClick={handleContinue} sx={{
                      width: '100%',
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                      px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer', color: P.green.shadow,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                      '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                    }}>
                      <PlayArrowIcon fontSize="small" />
                      {`Continue to ${assignedLevel} Activities`}
                    </Box>
                  </>
                )
              })()}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
