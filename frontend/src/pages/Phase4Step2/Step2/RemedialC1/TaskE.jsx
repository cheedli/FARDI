import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert, Chip, LinearProgress, Avatar, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import ExploreIcon from '@mui/icons-material/Explore'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial C1 - Task E: Grammar Exercise (Mixed Tenses/Conditionals)
 * Rewrite 6 sentences with correct mixed tenses and conditionals
 */

const TENSE_SENTENCES = [
  { id: 1, odyssey: 'Odyssey 1', character: 'Hashtag Strategist', avatar: '#️⃣', before: 'Hashtag use viral', infinitive: 'to increase', answer: 'would have increased', after: 'if targeted.', tenseType: 'Third Conditional', concept: 'Third conditional: would have + past participle for hypothetical past situations' },
  { id: 2, odyssey: 'Odyssey 2', character: 'Caption Writer', avatar: '📝', before: 'Caption is short', infinitive: 'to prove', answer: 'has proven', after: 'effective.', tenseType: 'Present Perfect', concept: 'Present perfect: has/have + past participle for results continuing to present' },
  { id: 3, odyssey: 'Odyssey 3', character: 'Emoji Expert', avatar: '😊', before: 'Emoji add emotion', infinitive: 'to use', answer: 'if used', after: 'wisely.', tenseType: 'Conditional', concept: 'Conditional: if + past participle for hypothetical conditions' },
  { id: 4, odyssey: 'Odyssey 4', character: 'CTA Specialist', avatar: '👆', before: 'CTA drive action', infinitive: 'to improve', answer: 'would improve', after: 'if clear.', tenseType: 'Second Conditional', concept: 'Second conditional: would + verb for hypothetical present/future situations' },
  { id: 5, odyssey: 'Odyssey 5', character: 'Tagging Manager', avatar: '🏷️', before: 'Tagging reach more', infinitive: 'to be', answer: 'had been', after: 'strategic.', tenseType: 'Past Perfect', concept: 'Past perfect: had + past participle for completed action before another past action' },
  { id: 6, odyssey: 'Odyssey 6', character: 'Viral Content Creator', avatar: '🚀', before: 'Viral happen', infinitive: 'to occur', answer: 'might occur', after: 'with good content.', tenseType: 'Modal Verb', concept: 'Modal verbs: might/may/could express possibility' }
]

const TIME_LIMIT = 300

export default function Phase4_2Step2RemedialC1TaskE() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 2, interaction: 5, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = TENSE_SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => { setAnswers({ ...answers, [sentenceId]: value }) }
  const handleNext = () => { if (currentSentenceIndex < TENSE_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = TENSE_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && (
        userAnswer === correctAnswer ||
        userAnswer === correctAnswer.replace(' ', '') ||
        correctAnswer.includes(userAnswer) ||
        userAnswer.includes(correctAnswer)
      )
      return {
        sentenceId: sentence.id, odyssey: sentence.odyssey, character: sentence.character,
        avatar: sentence.avatar, userAnswer: answers[sentence.id] || '',
        correctAnswer: sentence.answer, tenseType: sentence.tenseType, isCorrect,
        fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}`, concept: sentence.concept
      }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    const finalScore = Math.round((totalScore / 6) * 10)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskE_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskE_max', '10')
    await logTaskCompletion(finalScore, 10)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'E', score: finalScore, max_score: maxScore, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleStartGame = () => { setGameStarted(true) }
  const handleContinue = () => { navigate('/phase4_2/step/2/remedial/c1/taskF') }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                Phase 4.2 - Step 2: Remedial Activities
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
                Level C1 - Task E: Grammar Odyssey
              </Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>
                Rewrite sentences using correct mixed tenses and conditional structures!
              </Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage
                speaker="Emna"
                message="Welcome to the Grammar Odyssey! Embark on a journey through mixed tenses and conditionals. Complete 6 sentences by filling in the correct verb form. Each correct tense = 1 point. Total: 6 points! Ready to navigate through time?"
              />
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, textAlign: 'center' }}>
              <ExploreIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Grammar Odyssey
              </Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>
                6 Odysseys • Mixed Tenses & Conditionals • 5 Minutes
              </Typography>

              <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${P.purple.border}`, borderRadius: '14px', p: 3, maxWidth: 700, mx: 'auto', mb: 4, textAlign: 'left' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 2 }}>
                  Grammar Focus
                </Typography>
                <Typography variant="body1" sx={{ color: isDark ? '#ccc' : '#34495e' }}>
                  <strong>Structures You'll Use:</strong><br />
                  • <strong>Third Conditional:</strong> would have + past participle<br />
                  • <strong>Present Perfect:</strong> has/have + past participle<br />
                  • <strong>First Conditional:</strong> if + present simple<br />
                  • <strong>Second Conditional:</strong> would + verb<br />
                  • <strong>Past Perfect:</strong> had + past participle<br />
                  • <strong>Modal Verbs:</strong> might, may, could
                </Typography>
              </Box>

              <Box component="button" onClick={handleStartGame} sx={{
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.green.shadow}`,
                px: 8, py: 2,
                fontWeight: 700, fontSize: '1.5rem',
                cursor: 'pointer', color: P.green.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)' }
              }}>
                START ODYSSEY!
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const finalScore = Math.round((score / 6) * 10)
    const perfectScore = score === 6

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                Phase 4.2 - Step 2: Remedial Activities
              </Typography>
              <Typography variant="h5" sx={{ color: P.purple.shadow }}>
                Level C1 - Task E: Grammar Exercise - Results
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: perfectScore ? P.green.bg : P.purple.bg,
              border: `3px solid ${perfectScore ? P.green.border : P.purple.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.purple.shadow}`,
              p: 4, mb: 3, textAlign: 'center'
            }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: perfectScore ? P.green.shadow : P.purple.shadow, mb: 2 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.purple.shadow }}>
                {perfectScore ? 'Odyssey Mastered!' : 'Odyssey Complete!'}
              </Typography>
              <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${perfectScore ? P.green.border : P.purple.border}`, borderRadius: '16px', p: 3, maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.purple.shadow }}>
                  {finalScore} / 10
                </Typography>
                <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666' }}>Points Earned</Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#888' : '#888', display: 'block', mt: 1 }}>
                  Raw score: {score} / 6 sentences
                </Typography>
              </Box>
              {perfectScore && (
                <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                  <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>
                    Amazing! You mastered all mixed tenses and conditionals! Grammar champion!
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Detailed Results */}
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Grammar Review
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result) => (
                  <Box key={result.sentenceId} sx={{
                    bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                    border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                    borderRadius: '14px', p: 2.5,
                    borderLeft: `4px solid ${result.isCorrect ? P.green.border : P.red.border}`
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}` }}>
                        {result.avatar}
                      </Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.25 }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: P.purple.shadow }}>{result.odyssey}</Typography>
                          </Box>
                          <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', px: 1.5, py: 0.25 }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.shadow }}>{result.tenseType}</Typography>
                          </Box>
                          <Box sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '8px', px: 1.5, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {result.isCorrect ? <CheckCircleIcon sx={{ fontSize: 14, color: P.green.shadow }} /> : <CancelIcon sx={{ fontSize: 14, color: P.red.shadow }} />}
                            <Typography variant="caption" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.isCorrect ? '+1 Point' : '+0 Points'}</Typography>
                          </Box>
                        </Stack>
                        <Typography variant="subtitle1" sx={{ color: isDark ? '#ccc' : '#34495e', fontWeight: 600, mt: 0.5 }}>{result.character}</Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight={600} sx={{ color: isDark ? '#ccc' : '#1a252f', mb: 1 }}>Correct Sentence:</Typography>
                      <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '10px', p: 2 }}>
                        <Typography variant="h6" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>"{result.fullSentence}"</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body1" fontWeight={600} sx={{ color: isDark ? '#ccc' : '#1a252f', mb: 1 }}>Your Answer:</Typography>
                      <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', borderRadius: '10px', p: 2 }}>
                        <Typography variant="h6" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 'bold' }}>
                          "{TENSE_SENTENCES[result.sentenceId - 1].before}{' '}
                          <span style={{ textDecoration: 'underline' }}>{result.userAnswer || '(no answer)'}</span>{' '}
                          {TENSE_SENTENCES[result.sentenceId - 1].after}"
                        </Typography>
                      </Box>
                    </Box>

                    {!result.isCorrect && (
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '10px', p: 1.5, mt: 2 }}>
                        <Typography variant="body2" sx={{ color: P.blue.shadow, fontWeight: 500 }}>
                          <strong>Remember:</strong> {result.concept}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg,
                border: `2px solid ${P.green.border}`,
                borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 1.5,
                fontWeight: 700, fontSize: '1.2rem',
                cursor: 'pointer', color: P.green.shadow,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
              }}>
                Continue to Task F →
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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header with Timer */}
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {currentSentence.odyssey} / 6
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(currentSentenceIndex + 1) / TENSE_SENTENCES.length * 100}
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '14px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow, fontWeight: 600 }}>
              <strong>Instructions:</strong> Fill in the blank with the correct verb tense based on the context. Navigate between odysseys using the arrows below.
            </Typography>
          </Box>

          {/* Current Sentence */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 4, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, fontSize: '2.5rem', bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}` }}>
                {currentSentence.avatar}
              </Avatar>
              <Box>
                <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5, mb: 1, display: 'inline-block' }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.purple.shadow }}>{currentSentence.odyssey}</Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#eee' : '#2c3e50' }}>{currentSentence.character}</Typography>
              </Box>
            </Stack>

            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${P.purple.border}`, borderRadius: '14px', p: 4 }}>
              <RecordVoiceOverIcon sx={{ fontSize: 40, color: P.purple.shadow, mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ color: isDark ? '#eee' : '#2c3e50', fontWeight: 500 }}>
                  "{currentSentence.before}
                </Typography>
                <TextField
                  value={answers[currentSentence.id] || ''}
                  onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 250,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? '#1a1a2e' : '#f3e5f5',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 3 },
                      '&:hover fieldset': { borderColor: P.purple.shadow },
                      '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                      '& input': { color: isDark ? '#eee' : '#1a252f', fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' },
                      '& input::placeholder': { color: '#95a5a6', opacity: 0.8, fontWeight: 500 }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: isDark ? '#eee' : '#2c3e50', fontWeight: 500 }}>
                  {currentSentence.after}"
                </Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', p: 2, mt: 3 }}>
              <Typography variant="body1" sx={{ color: P.green.shadow, fontWeight: 500 }}>
                <strong>Concept:</strong> {currentSentence.concept}
              </Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: currentSentenceIndex === 0 ? P.blue.bg : P.purple.bg,
              border: `2px solid ${currentSentenceIndex === 0 ? P.blue.border : P.purple.border}`,
              borderRadius: '12px',
              px: 3, py: 1,
              fontWeight: 700, fontSize: '1rem',
              cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              color: currentSentenceIndex === 0 ? P.blue.shadow : P.purple.shadow,
              opacity: currentSentenceIndex === 0 ? 0.5 : 1,
              transition: 'transform 0.15s',
              '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-2px,-2px)' } : {},
            }}>
              ← Previous Odyssey
            </Box>
            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1} sx={{
              bgcolor: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? P.blue.bg : P.purple.bg,
              border: `2px solid ${currentSentenceIndex === TENSE_SENTENCES.length - 1 ? P.blue.border : P.purple.border}`,
              borderRadius: '12px',
              px: 3, py: 1,
              fontWeight: 700, fontSize: '1rem',
              cursor: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'not-allowed' : 'pointer',
              color: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? P.blue.shadow : P.purple.shadow,
              opacity: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 0.5 : 1,
              transition: 'transform 0.15s',
              '&:hover': currentSentenceIndex < TENSE_SENTENCES.length - 1 ? { transform: 'translate(-2px,-2px)' } : {},
            }}>
              Next Odyssey →
            </Box>
          </Stack>

          {/* Progress Overview */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '16px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Odyssey Progress:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {TENSE_SENTENCES.map((sentence, index) => (
                <Box
                  key={sentence.id}
                  onClick={() => setCurrentSentenceIndex(index)}
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    bgcolor: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.bg : P.purple.bg
                      : index === currentSentenceIndex ? P.orange.bg : P.blue.bg,
                    border: `2px solid ${answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.border : P.purple.border
                      : index === currentSentenceIndex ? P.orange.border : P.blue.border}`,
                    borderRadius: '10px', px: 1.5, py: 0.5,
                    cursor: 'pointer', mb: 1,
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '1.2rem' }}>{sentence.avatar}</Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{
                    color: answers[sentence.id]?.trim()
                      ? index === currentSentenceIndex ? P.green.shadow : P.purple.shadow
                      : index === currentSentenceIndex ? P.orange.shadow : P.blue.shadow
                  }}>O{index + 1}</Typography>
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 2, color: isDark ? '#aaa' : '#7f8c8d' }}>
              Answered: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6
            </Typography>
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: allAnswered ? P.purple.bg : P.blue.bg,
              border: `2px solid ${allAnswered ? P.purple.border : P.blue.border}`,
              borderRadius: '12px',
              boxShadow: `3px 3px 0 ${allAnswered ? P.purple.shadow : P.blue.shadow}`,
              px: 8, py: 1.5,
              fontWeight: 700, fontSize: '1.3rem',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              color: allAnswered ? P.purple.shadow : P.blue.shadow,
              transition: 'transform 0.15s, box-shadow 0.15s',
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {},
            }}>
              {allAnswered ? 'Complete Odyssey!' : `Answer All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mt: 3 }}>
              <Typography fontWeight="bold" sx={{ color: P.red.shadow }}>
                Hurry! Only {timeLeft} seconds left!
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
