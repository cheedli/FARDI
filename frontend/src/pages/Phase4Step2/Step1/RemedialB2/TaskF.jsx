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
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task F: Grammar Role-Play
 * Role-play grammar exercise - Complete 6 lines with passive voice
 */

const ROLE_PLAY_LINES = [
  { id: 1, quest: 'Quest 1', character: 'Social Media Manager', avatar: '📱', before: 'The hashtag', answer: 'is used', infinitive: 'to use', after: 'for categorization.', concept: 'passive voice with hashtag usage' },
  { id: 2, quest: 'Quest 2', character: 'Content Creator', avatar: '✍️', before: 'The caption', answer: 'is written', infinitive: 'to write', after: 'to engage readers.', concept: 'passive voice with caption creation' },
  { id: 3, quest: 'Quest 3', character: 'Viral Marketing Specialist', avatar: '🚀', before: 'Viral content', answer: 'is shared', infinitive: 'to share', after: 'millions of times daily.', concept: 'passive voice (plural) with viral content' },
  { id: 4, quest: 'Quest 4', character: 'Engagement Analyst', avatar: '📊', before: 'User engagement', answer: 'is measured', infinitive: 'to measure', after: 'by likes and comments.', concept: 'passive voice with engagement metrics' },
  { id: 5, quest: 'Quest 5', character: 'Brand Ambassador', avatar: '🎯', before: 'A call-to-action', answer: 'is included', infinitive: 'to include', after: 'to drive conversions.', concept: 'passive voice with CTA strategy' },
  { id: 6, quest: 'Quest 6', character: 'Story Strategist', avatar: '📖', before: 'Stories', answer: 'are posted', infinitive: 'to post', after: 'for 24-hour visibility.', concept: 'passive voice (plural) with stories feature' }
]

const TIME_LIMIT = 300

export default function RemedialB2TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 6, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
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
    purple: { bg: '#F5F3FF', border: '#8B5CF6', shadow: '#6D28D9' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
    purple: { bg: '#2E1065', border: '#A78BFA', shadow: '#4C1D95' },
  }
  const P = isDark ? DARK : LIGHT

  const currentLine = ROLE_PLAY_LINES[currentLineIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (lineId, value) => setAnswers({ ...answers, [lineId]: value })

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = ROLE_PLAY_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()
      const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || userAnswer.includes(correctAnswer)
      return { lineId: line.id, quest: line.quest, character: line.character, avatar: line.avatar, userAnswer: answers[line.id] || '', correctAnswer: line.answer, isCorrect, fullLine: `${line.before} ${line.answer} ${line.after}` }
    })
    setResults(evaluatedResults)
    const correctCount = evaluatedResults.filter(r => r.isCorrect).length
    const finalScore = Math.round((correctCount / 6) * 10)
    setScore(finalScore)
    sessionStorage.setItem('remedial_phase4_2_step1_b2_taskF_score', finalScore)
    await logTaskCompletion(finalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', level: 'B2', task: 'F', step: 1, score: finalScore, max_score: 10, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => { const m = Math.floor(seconds / 60); return `${m}:${(seconds % 60).toString().padStart(2, '0')}` }
  const allAnswered = ROLE_PLAY_LINES.every(l => answers[l.id]?.trim())
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 - Step 1: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B2 - Task F: Grammar Role-Play</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>Role-play grammar exercise - Master passive voice through character dialogues!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS_MABROUKI" message="Welcome to Grammar Role-Play! You'll play different social media roles and complete their dialogues using the passive voice. Fill in 6 role-play lines with the correct passive form (is/are + past participle). Each correct line earns points towards your final score of 10! Ready?" />
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, textAlign: 'center' }}>
              <TheaterComedyIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>Grammar Role-Play</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>6 Quests • 6 Characters • 5 Minutes • Complete the Passive Voice!</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: '16px', p: 3, maxWidth: 500, mx: 'auto', mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold', mb: 1 }}>Grammar Focus: Passive Voice</Typography>
                <Typography variant="body2" sx={{ color: P.purple.shadow }}>
                  Structure: Subject + <strong>is/are + past participle</strong><br />
                  "is" for singular • "are" for plural<br />
                  Example: "The hashtag <u>is used</u> for discovery."
                </Typography>
              </Box>
              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>START QUEST!</Box>
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
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Level B2 - Task F: Grammar Role-Play - Results</Typography>
            </Box>
            <Box sx={{ bgcolor: perfectScore ? P.green.bg : P.yellow.bg, border: `2px solid ${perfectScore ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${perfectScore ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 70, color: perfectScore ? P.green.shadow : P.yellow.shadow, mb: 1 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{perfectScore ? 'Quest Mastered!' : 'Quest Complete!'}</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>{score} / 10</Typography>
                <Typography sx={{ color: perfectScore ? P.green.shadow : P.yellow.shadow }}>Points Earned</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>Role-Play Review</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={result.lineId} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>{result.avatar}</Typography>
                      <Box>
                        <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '12px', px: 1, display: 'inline-block', mr: 1 }}>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: P.purple.shadow }}>{result.quest}</Typography>
                        </Box>
                        {result.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, fontSize: 18, verticalAlign: 'middle' }} /> : <CancelIcon sx={{ color: P.red.shadow, fontSize: 18, verticalAlign: 'middle' }} />}
                        <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, ml: 0.5, fontWeight: 600 }}>{result.character}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 600 }}>Correct: "{result.fullLine}"</Typography>
                    </Box>
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '8px', p: 1.5 }}>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                        Your: "{ROLE_PLAY_LINES[index].before} <strong style={{ textDecoration: 'underline' }}>{result.userAnswer || '(no answer)'}</strong> {ROLE_PLAY_LINES[index].after}"
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', p: 1, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: P.blue.shadow }}>Remember: Use is/are + past participle for passive voice</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/b2/results')} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> View Final Results</Box>
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
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>{currentLine.quest} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5, height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(currentLineIndex + 1) / ROLE_PLAY_LINES.length * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.teal.shadow }}><strong>Instructions:</strong> Fill in the blank with the correct passive voice form (is/are + past participle). Navigate between quests using the buttons below.</Typography>
          </Box>

          {/* Current Role-Play Line */}
          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography sx={{ fontSize: '3rem' }}>{currentLine.avatar}</Typography>
              <Box>
                <Box sx={{ bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '20px', px: 2, py: 0.25, display: 'inline-block', mb: 0.5 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: P.orange.shadow }}>{currentLine.quest}</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>{currentLine.character} says:</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: `2px solid ${P.purple.border}`, borderRadius: '12px', p: 3, mb: 2 }}>
              <RecordVoiceOverIcon sx={{ fontSize: 32, color: P.purple.shadow, mb: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ color: P.purple.shadow, fontWeight: 500 }}>"{currentLine.before}</Typography>
                <TextField value={answers[currentLine.id] || ''} onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive} variant="outlined" size="small"
                  sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#2a1a5e' : '#F5F3FF', '& fieldset': { borderColor: P.purple.border, borderWidth: 2 }, '&.Mui-focused fieldset': { borderColor: P.purple.shadow }, '& input': { color: P.purple.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' } } }}
                />
                <Typography variant="h5" sx={{ color: P.purple.shadow, fontWeight: 500 }}>{currentLine.after}"</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '12px', p: 2 }}>
              <Typography variant="body2" sx={{ color: P.green.shadow }}><strong>Concept:</strong> {currentLine.concept}</Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={() => setCurrentLineIndex(i => i - 1)} disabled={currentLineIndex === 0} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 3, py: 1, fontWeight: 700, cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer', color: P.purple.shadow, opacity: currentLineIndex === 0 ? 0.5 : 1,
              '&:hover': currentLineIndex > 0 ? { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` } : {}
            }}>Previous Quest</Box>
            <Box component="button" onClick={() => setCurrentLineIndex(i => i + 1)} disabled={currentLineIndex === ROLE_PLAY_LINES.length - 1} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', px: 3, py: 1, fontWeight: 700, cursor: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 'not-allowed' : 'pointer', color: P.purple.shadow, opacity: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 0.5 : 1,
              '&:hover': currentLineIndex < ROLE_PLAY_LINES.length - 1 ? { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` } : {}
            }}>Next Quest</Box>
          </Box>

          {/* Progress Overview */}
          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow }}>Quest Progress:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ROLE_PLAY_LINES.map((line, index) => (
                <Box key={line.id} component="button" onClick={() => setCurrentLineIndex(index)} sx={{
                  bgcolor: answers[line.id]?.trim() ? (index === currentLineIndex ? P.green.bg : P.purple.bg) : (index === currentLineIndex ? P.orange.bg : (isDark ? '#1a1a2e' : '#e0e0e0')),
                  color: answers[line.id]?.trim() ? (index === currentLineIndex ? P.green.shadow : P.purple.shadow) : (index === currentLineIndex ? P.orange.shadow : '#666'),
                  border: `2px solid ${answers[line.id]?.trim() ? (index === currentLineIndex ? P.green.border : P.purple.border) : (index === currentLineIndex ? P.orange.border : '#ccc')}`,
                  borderRadius: '20px', px: 1.5, py: 0.25, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  '&:hover': { opacity: 0.8 }
                }}><span style={{ fontSize: '1rem' }}>{line.avatar}</span>Q{index + 1}</Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, color: P.teal.shadow }}>Answered: {answeredCount} / 6</Typography>
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: allAnswered ? P.purple.bg : (isDark ? '#1a1a2e' : '#e0e0e0'), border: `2px solid ${allAnswered ? P.purple.border : '#ccc'}`,
              borderRadius: '12px', boxShadow: allAnswered ? `3px 3px 0 ${P.purple.shadow}` : 'none',
              px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem', cursor: allAnswered ? 'pointer' : 'not-allowed', color: allAnswered ? P.purple.shadow : '#999',
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>{allAnswered ? 'Complete Quest!' : `Answer All Lines First (${answeredCount}/6)`}</Box>
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
