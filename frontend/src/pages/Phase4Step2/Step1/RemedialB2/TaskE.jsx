import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task E: Conditional Challenge
 */

const SENTENCES = [
  { id: 1, level: 'Level 1', before: 'If you use a hashtag, your post', answer: 'would reach', infinitive: 'to reach', after: 'more people.', concept: 'hashtags increase discovery and reach' },
  { id: 2, level: 'Level 2', before: 'A good caption', answer: 'would engage', infinitive: 'to engage', after: 'readers if it tells a story.', concept: 'captions drive engagement through storytelling' },
  { id: 3, level: 'Level 3', before: 'If content goes viral, it', answer: 'would spread', infinitive: 'to spread', after: 'rapidly across platforms.', concept: 'viral content spreads quickly' },
  { id: 4, level: 'Level 4', before: 'Emojis', answer: 'would add', infinitive: 'to add', after: 'emotion if used properly.', concept: 'emojis enhance emotional expression' },
  { id: 5, level: 'Level 5', before: 'If you tag someone, they', answer: 'would see', infinitive: 'to see', after: 'your post in their notifications.', concept: 'tagging increases visibility' },
  { id: 6, level: 'Level 6', before: 'A call-to-action', answer: 'would drive', infinitive: 'to drive', after: 'conversions if clear and compelling.', concept: 'CTAs motivate user action' }
]

const TIME_LIMIT = 300

export default function RemedialB2TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 5, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const currentSentence = SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value })

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || userAnswer.includes(correctAnswer)
      return { sentenceId: sentence.id, level: sentence.level, userAnswer: answers[sentence.id] || '', correctAnswer: sentence.answer, isCorrect, fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}` }
    })
    setResults(evaluatedResults)
    const correctCount = evaluatedResults.filter(r => r.isCorrect).length
    const finalScore = Math.round((correctCount / 6) * 10)
    setScore(finalScore)
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskE_score', finalScore)
    await logTaskCompletion(finalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'E', step: 1, score: finalScore, max_score: 10, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => { const m = Math.floor(seconds / 60); return `${m}:${(seconds % 60).toString().padStart(2, '0')}` }
  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B2 - Task E: Conditional Challenge</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>Grammar exercise - Master conditionals with social media terms!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS_MABROUKI" message="Welcome to the Conditional Challenge! Complete 6 conditional sentences using social media terms. Use the correct conditional form (would + verb) to describe 'what if' scenarios. Each correct sentence = points towards your final score of 10! Ready?" />
            </Box>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 4, textAlign: 'center' }}>
              <EditNoteIcon sx={{ fontSize: 80, color: P.blue.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Conditional Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.blue.shadow, mb: 3 }}>6 Levels • 5 Minutes • Complete the Conditionals!</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: '16px', p: 3, maxWidth: 500, mx: 'auto', mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.blue.shadow, fontWeight: 'bold', mb: 1 }}>Grammar Focus: Second Conditional</Typography>
                <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                  Structure: If + subject + verb (past), subject + <strong>would + verb</strong><br />
                  Example: "If the post had a hashtag, it <u>would reach</u> more people."
                </Typography>
              </Box>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>START CHALLENGE!</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 10
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Level B2 - Task E: Conditional Challenge - Results</Typography>
            </Box>
            <Box sx={{ bgcolor: perfectScore ? P.green.bg : P.yellow.bg, border: `2px solid ${perfectScore ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 70, color: perfectScore ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{perfectScore ? 'Perfect Grammar!' : 'Challenge Complete!'}</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{score} / 10</Typography>
                <Typography sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>Points Earned</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Sentence Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={result.sentenceId} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', px: 1 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: P.blue.shadow }}>{result.level}</Typography>
                      </Box>
                      {result.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, fontSize: 20 }} /> : <CancelIcon sx={{ color: P.red.shadow, fontSize: 20 }} />}
                    </Box>
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 600 }}>Correct: {result.fullSentence}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5 }}>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                        Your answer: {SENTENCES[index].before} <strong style={{ textDecoration: 'underline' }}>{result.userAnswer || '(no answer)'}</strong> {SENTENCES[index].after}
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', p: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: P.blue.shadow }}>Remember: Use "would" + base verb for the second conditional</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/b2/taskF')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task F</Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Timer Header */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.shadow }}>{currentSentence.level} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.blue.shadow }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.blue.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5, height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(currentSentenceIndex + 1) / SENTENCES.length * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}><strong>Instructions:</strong> Fill in the blank with the correct conditional form (would + verb). Navigate between levels using the buttons below.</Typography>
          </Box>

          {/* Current Sentence */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '20px', display: 'inline-block', px: 2, py: 0.5, mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: P.blue.shadow }}>{currentSentence.level}</Typography>
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: `2px solid ${P.orange.border}`, borderRadius: '12px', p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ color: P.orange.shadow, fontWeight: 500 }}>{currentSentence.before}</Typography>
                <TextField value={answers[currentSentence.id] || ''} onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive} variant="outlined" size="small"
                  sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#2a1a0a' : '#FEFCE8', '& fieldset': { borderColor: P.orange.border, borderWidth: 2 }, '&.Mui-focused fieldset': { borderColor: P.orange.shadow }, '& input': { color: P.orange.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' } } }}
                />
                <Typography variant="h5" sx={{ color: P.orange.shadow, fontWeight: 500 }}>{currentSentence.after}</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2 }}>
              <Typography variant="body2" sx={{ color: P.green.shadow }}><strong>Concept:</strong> {currentSentence.concept}</Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={() => setCurrentSentenceIndex(i => i - 1)} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', px: 3, py: 1, fontWeight: 700, cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer', color: P.blue.shadow, opacity: currentSentenceIndex === 0 ? 0.5 : 1,
              '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.blue.shadow}` } : {}
            }}>Previous Level</Box>
            <Box component="button" onClick={() => setCurrentSentenceIndex(i => i + 1)} disabled={currentSentenceIndex === SENTENCES.length - 1} sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', px: 3, py: 1, fontWeight: 700, cursor: currentSentenceIndex === SENTENCES.length - 1 ? 'not-allowed' : 'pointer', color: P.blue.shadow, opacity: currentSentenceIndex === SENTENCES.length - 1 ? 0.5 : 1,
              '&:hover': currentSentenceIndex < SENTENCES.length - 1 ? { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.blue.shadow}` } : {}
            }}>Next Level</Box>
          </Box>

          {/* Progress Overview */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow }}>Your Progress:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {SENTENCES.map((sentence, index) => (
                <Box key={sentence.id} component="button" onClick={() => setCurrentSentenceIndex(index)} sx={{
                  bgcolor: answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.bg : P.blue.bg) : (index === currentSentenceIndex ? P.orange.bg : (isDark ? '#1a1a2e' : '#e0e0e0')),
                  color: answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.shadow : P.blue.shadow) : (index === currentSentenceIndex ? P.orange.shadow : '#666'),
                  border: `2px solid ${answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.border : P.blue.border) : (index === currentSentenceIndex ? P.orange.border : '#ccc')}`,
                  borderRadius: '20px', px: 1.5, py: 0.25, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                  '&:hover': { opacity: 0.8 }
                }}>L{index + 1}</Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, color: P.teal.shadow }}>Answered: {answeredCount} / 6</Typography>
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: allAnswered ? P.blue.bg : (isDark ? '#1a1a2e' : '#e0e0e0'), border: `2px solid ${allAnswered ? P.blue.border : '#ccc'}`,
              borderRadius: '12px', boxShadow: allAnswered ? `3px 3px 0 ${P.blue.shadow}` : 'none',
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem', cursor: allAnswered ? 'pointer' : 'not-allowed', color: allAnswered ? P.blue.shadow : '#999',
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
            }}>{allAnswered ? 'Submit All Answers!' : `Answer All Sentences First (${answeredCount}/6)`}</Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mt: 3 }}>
              <Typography sx={{ color: P.red.shadow, fontWeight: 700 }}><strong>Hurry!</strong> Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
