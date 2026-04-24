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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial C1 - Task F: Grammar Role-Quest
 */

const ROLE_PLAY_LINES = [
  { id: 1, quest: 'Quest 1', character: 'Social Media Manager', avatar: '📱', before: 'The hashtag campaign', answer: 'is promoted', infinitive: 'to promote', after: 'across all platforms.', concept: 'passive voice with social media promotion' },
  { id: 2, quest: 'Quest 2', character: 'Content Creator', avatar: '✍️', before: 'Engaging captions', answer: 'are used', infinitive: 'to use', after: 'to increase interaction.', concept: 'passive voice (plural) with caption strategy' },
  { id: 3, quest: 'Quest 3', character: 'Emoji Strategist', avatar: '😊', before: 'Emoji', answer: 'are chosen', infinitive: 'to choose', after: 'carefully for emotional impact.', concept: 'passive voice (plural) with emoji selection' },
  { id: 4, quest: 'Quest 4', character: 'Viral Marketing Expert', avatar: '🚀', before: 'Viral content', answer: 'is created', infinitive: 'to create', after: 'with trending topics.', concept: 'passive voice with viral content creation' },
  { id: 5, quest: 'Quest 5', character: 'Influencer Coordinator', avatar: '⭐', before: 'Strategic tags', answer: 'are added', infinitive: 'to add', after: 'to boost reach.', concept: 'passive voice (plural) with tagging strategy' },
  { id: 6, quest: 'Quest 6', character: 'Story Designer', avatar: '📖', before: 'Interactive stories', answer: 'are designed', infinitive: 'to design', after: 'to engage followers.', concept: 'passive voice (plural) with story design' }
]

const TIME_LIMIT = 300

export default function Phase4_2RemedialC1TaskF() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/1/remedial/c1/results') }, [])
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 6, context: 'remedial_c1' })
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
    purple: { bg: '#2E1065', border: '#A78BFA', shadow: '#5B21B6' },
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
  const handleNext = () => { if (currentLineIndex < ROLE_PLAY_LINES.length - 1) setCurrentLineIndex(currentLineIndex + 1) }
  const handlePrevious = () => { if (currentLineIndex > 0) setCurrentLineIndex(currentLineIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = ROLE_PLAY_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const correctAnswer = line.answer.toLowerCase()
      const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || userAnswer.includes(correctAnswer)
      return { lineId: line.id, quest: line.quest, character: line.character, avatar: line.avatar, userAnswer: answers[line.id] || '', correctAnswer: line.answer, isCorrect, fullLine: `${line.before} ${line.answer} ${line.after}` }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_remedial_c1_taskF_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'F', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = ROLE_PLAY_LINES.every(l => answers[l.id]?.trim())
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task F: Grammar Role-Quest</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow, mt: 1 }}>Advanced role-play grammar exercise - Master passive voice through social media dialogues!</Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Grammar Role-Quest! You'll play different social media roles and complete their dialogues using the passive voice. Fill in 6 role-play lines with the correct passive form (is/are + past participle). Each correct line = 1 point. Total: 6 points! Ready to start your quest?" />
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <TheaterComedyIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.purple.shadow }}>Grammar Role-Quest</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>6 Quests · 6 Characters · 5 Minutes · Complete the Passive Voice!</Typography>

              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${P.purple.border}`, borderRadius: '12px', p: 3, mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold', mb: 2 }}>Grammar Focus: Passive Voice</Typography>
                <Typography variant="body1" sx={{ color: P.purple.shadow }}>
                  <strong>Structure:</strong><br />
                  • Subject + is/are + past participle (+ by + agent)<br />
                  • Use "is" for singular subjects<br />
                  • Use "are" for plural subjects<br /><br />
                  <strong>Examples:</strong><br />
                  "The campaign <u>is created</u> by the marketing team."<br />
                  "Engaging captions <u>are used</u> to increase interaction."
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
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task F: Grammar Role-Quest - Results</Typography>
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: P.purple.shadow }}>
                {score === 6 ? 'Quest Mastered!' : 'Quest Complete!'}
              </Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>{score} / 6</Typography>
                <Typography variant="h6" sx={{ color: P.purple.shadow }}>Correct Lines</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              {results.map((result, index) => (
                <Box key={result.lineId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '20px', boxShadow: `4px 4px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3, mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '2rem' }}>{result.avatar}</Box>
                    <Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                        <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                          <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{result.quest}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `1px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                          {result.isCorrect ? <CheckCircleIcon sx={{ fontSize: 14, color: P.green.shadow }} /> : <CancelIcon sx={{ fontSize: 14, color: P.red.shadow }} />}
                          <Typography variant="caption" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 700 }}>{result.isCorrect ? '+1 Point' : '+0 Points'}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 600 }}>{result.character}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '10px', p: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>Correct: "{result.fullLine}"</Typography>
                    <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>Your answer: "{ROLE_PLAY_LINES[index].before} <strong>{result.userAnswer || '(no answer)'}</strong> {ROLE_PLAY_LINES[index].after}"</Typography>
                  </Box>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '10px', p: 2, mt: 1 }}>
                      <Typography variant="body2" sx={{ color: P.blue.shadow }}><strong>Remember:</strong> Use is/are + past participle for passive voice</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/1/remedial/c1/results')} sx={{
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

  // Game in progress
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow }}>{currentLine.quest} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(currentLineIndex + 1) / ROLE_PLAY_LINES.length * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Fill in the blank with the correct passive voice form (is/are + past participle). Navigate between quests using the arrows below.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem' }}>{currentLine.avatar}</Box>
              <Box>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)', border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5, display: 'inline-block', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{currentLine.quest}</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>{currentLine.character} says:</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.purple.border}`, borderRadius: '12px', p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>"{currentLine.before}</Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? 'rgba(139,92,246,0.1)' : '#F5F3FF',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                      '& input': { color: P.purple.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>{currentLine.after}"</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentLineIndex === 0} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: currentLineIndex === 0 ? 'none' : `3px 3px 0 ${P.purple.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '0.9rem', cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: currentLineIndex === 0 ? 0.4 : 1,
              '&:hover': currentLineIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>← Previous Quest</Box>
            <Box component="button" onClick={handleNext} disabled={currentLineIndex === ROLE_PLAY_LINES.length - 1} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 'none' : `3px 3px 0 ${P.purple.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '0.9rem', cursor: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 0.4 : 1,
              '&:hover': currentLineIndex < ROLE_PLAY_LINES.length - 1 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>Next Quest →</Box>
          </Box>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.yellow.shadow }}>Quest Progress:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {ROLE_PLAY_LINES.map((line, index) => {
                const isAnswered = !!answers[line.id]?.trim()
                const isCurrent = index === currentLineIndex
                const btnColor = isAnswered ? (isCurrent ? P.green : P.purple) : (isCurrent ? P.orange : P.yellow)
                return (
                  <Box key={line.id} component="button" onClick={() => setCurrentLineIndex(index)} sx={{
                    bgcolor: btnColor.bg, border: `2px solid ${btnColor.border}`, borderRadius: '10px', boxShadow: `2px 2px 0 ${btnColor.shadow}`,
                    px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: btnColor.shadow,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${btnColor.shadow}` }
                  }}>{line.avatar} Q{index + 1}</Box>
                )
              })}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: P.yellow.shadow }}>Answered: {answeredCount} / 6</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: allAnswered ? P.purple.bg : P.yellow.bg,
              border: `2px solid ${allAnswered ? P.purple.border : P.yellow.border}`,
              borderRadius: '12px', boxShadow: allAnswered ? `3px 3px 0 ${P.purple.shadow}` : 'none',
              px: 5, py: 2, fontWeight: 700, fontSize: '1.1rem', cursor: !allAnswered ? 'not-allowed' : 'pointer',
              color: allAnswered ? P.purple.shadow : P.yellow.shadow, opacity: !allAnswered ? 0.7 : 1,
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>{allAnswered ? 'Complete Quest!' : `Answer All Lines First (${answeredCount}/6)`}</Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, textAlign: 'center' }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: P.red.shadow }}>Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
