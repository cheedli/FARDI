import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task F: Grammar Role-Quest
 * Passive voice exercise - 6 role-play lines
 * Score: 6 pts
 */

const ROLE_PLAY_LINES = [
  { id: 1, quest: 'Quest 1', character: 'Marketing Director', avatar: '👔', before: 'The ad', answer: 'is promoted', infinitive: 'to promote', after: 'as promotional.', concept: 'passive voice with "promotional" advertising' },
  { id: 2, quest: 'Quest 2', character: 'Creative Manager', avatar: '🎨', before: 'Persuasive advertising', answer: 'is used', infinitive: 'to use', after: 'to convince customers.', concept: 'passive voice with persuasive techniques' },
  { id: 3, quest: 'Quest 3', character: 'Media Planner', avatar: '📊', before: 'The targeted group', answer: 'is chosen', infinitive: 'to choose', after: 'carefully for the campaign.', concept: 'passive voice with targeting strategy' },
  { id: 4, quest: 'Quest 4', character: 'Brand Strategist', avatar: '💡', before: 'An original idea', answer: 'is created', infinitive: 'to create', after: 'for maximum impact.', concept: 'passive voice with original content' },
  { id: 5, quest: 'Quest 5', character: 'Art Director', avatar: '🖼️', before: 'Creative ads', answer: 'are made', infinitive: 'to make', after: 'memorable and engaging.', concept: 'passive voice (plural) with creative advertising' },
  { id: 6, quest: 'Quest 6', character: 'Storyteller', avatar: '📖', before: 'Dramatisation', answer: 'is employed', infinitive: 'to employ', after: 'to tell compelling stories.', concept: 'passive voice with dramatisation technique' }
]

const TIME_LIMIT = 300

export default function RemedialB2TaskF() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 6, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = ROLE_PLAY_LINES[currentLineIndex]

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

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
    sessionStorage.setItem('remedial_step3_b2_taskF_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'F', step: 2, score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allAnswered = ROLE_PLAY_LINES.every(l => answers[l.id]?.trim())
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B2 - Task F: Grammar Role-Quest 🎭</Typography>
              <Typography variant="body1">Role-play grammar exercise - Master passive voice through character dialogues!</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Grammar Role-Quest! 🎭 You'll play different advertising roles and complete their dialogues using the passive voice. Fill in 6 role-play lines with the correct passive form (is/are + past participle). Each correct line = 1 point. Total: 6 points! Ready to start your quest? 🚀" />
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>📚 Grammar Focus: Passive Voice</Typography>
              <Typography variant="body1">
                <strong>Structure:</strong><br />
                • Subject + is/are + past participle (+ by + agent)<br />
                • Use "is" for singular, "are" for plural<br /><br />
                <strong>Examples:</strong><br />
                "The ad <u>is created</u> by the creative team."<br />
                "Creative ads <u>are made</u> memorable."
              </Typography>
            </Box>
            <Box sx={{ ...cardSx('purple'), textAlign: 'center', p: 5 }}>
              <TheaterComedyIcon sx={{ fontSize: 80, mb: 2, color: P.purple.border }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">Grammar Role-Quest</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>6 Quests • 6 Characters • 5 Minutes • Complete the Passive Voice!</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 8, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                START QUEST! 🎮
              </Box>
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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5">Level B2 - Task F: Grammar Role-Quest - Results 🏆</Typography>
            </Box>
            <Box sx={{ ...cardSx(score === 6 ? 'green' : 'purple'), mb: 3, textAlign: 'center', p: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: score === 6 ? P.green.border : P.purple.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">{score === 6 ? 'Quest Mastered! 🎉' : 'Quest Complete! 🎊'}</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.border }}>{score} / 6</Typography>
                <Typography variant="h6" color="text.secondary">Correct Lines</Typography>
              </Box>
              {score === 6 && <Box sx={{ ...cardSx('green'), mt: 2 }}><Typography variant="body1" fontWeight={500}>Amazing! You mastered all passive voice lines! Grammar champion! 🌟</Typography></Box>}
            </Box>

            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">Role-Play Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={result.lineId} sx={{
                    bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                    border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                    borderRadius: '16px', p: 3, boxShadow: `3px 3px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: P.purple.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        {result.avatar}
                      </Box>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ bgcolor: P.purple.border, borderRadius: '10px', px: 1.5, py: 0.25 }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>{result.quest}</Typography>
                          </Box>
                          {result.isCorrect
                            ? <Box sx={{ bgcolor: P.green.border, borderRadius: '10px', px: 1.5, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 14, color: 'white' }} /><Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>+1 Point</Typography></Box>
                            : <Box sx={{ bgcolor: P.red.border, borderRadius: '10px', px: 1.5, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}><CancelIcon sx={{ fontSize: 14, color: 'white' }} /><Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>+0 Points</Typography></Box>
                          }
                        </Stack>
                        <Typography variant="subtitle2" sx={{ mt: 0.5 }}>{result.character}</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Correct Line:</Typography>
                    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '12px', p: 2, mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>"{result.fullLine}"</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Your Answer:</Typography>
                    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '12px', p: 2, mb: result.isCorrect ? 0 : 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.border : P.red.border }}>
                        "{ROLE_PLAY_LINES[index].before} <span style={{ textDecoration: 'underline', padding: '2px 8px' }}>{result.userAnswer || '(no answer)'}</span> {ROLE_PLAY_LINES[index].after}"
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight={500}>Remember: Use is/are + past participle for passive voice</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/results')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.2rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                View Final Results →
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

          <Box sx={{ ...cardSx('purple'), mb: 2, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">{currentLine.quest} / 6</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.purple.border }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.border : 'inherit', fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={(currentLineIndex + 1) / ROLE_PLAY_LINES.length * 100}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: 4 } }} />
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3, p: 2 }}>
            <Typography variant="body1" fontWeight={600}>Instructions: Fill in the blank with the correct passive voice form (is/are + past participle). Navigate between quests below.</Typography>
          </Box>

          {/* Role-play card */}
          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: P.purple.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {currentLine.avatar}
              </Box>
              <Box>
                <Box sx={{ bgcolor: P.purple.border, borderRadius: '10px', px: 2, py: 0.25, display: 'inline-block', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>{currentLine.quest}</Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">{currentLine.character} says:</Typography>
              </Box>
            </Stack>

            <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '16px', border: `2px solid ${P.purple.border}`, mb: 3 }}>
              <RecordVoiceOverIcon sx={{ fontSize: 32, color: P.purple.border, mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" fontWeight={500}>"{currentLine.before}</Typography>
                <TextField
                  value={answers[currentLine.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentLine.id]: e.target.value })}
                  placeholder={currentLine.infinitive}
                  variant="outlined"
                  sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: P.purple.bg, '& fieldset': { borderColor: P.purple.border, borderWidth: 2 }, '& input': { fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' } } }}
                />
                <Typography variant="h5" fontWeight={500}>{currentLine.after}"</Typography>
              </Box>
            </Box>

            <Box sx={{ ...cardSx('green'), p: 2 }}>
              <Typography variant="body1" fontWeight={500}><strong>Concept:</strong> {currentLine.concept}</Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            <Box component="button" onClick={() => setCurrentLineIndex(currentLineIndex - 1)} disabled={currentLineIndex === 0}
              sx={{ ...cardSx('blue'), cursor: currentLineIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentLineIndex === 0 ? 0.4 : 1, px: 3, py: 1.5, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s', '&:hover': currentLineIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {} }}>
              ← Previous Quest
            </Box>
            <Box component="button" onClick={() => setCurrentLineIndex(currentLineIndex + 1)} disabled={currentLineIndex === ROLE_PLAY_LINES.length - 1}
              sx={{ ...cardSx('blue'), cursor: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 'not-allowed' : 'pointer', opacity: currentLineIndex === ROLE_PLAY_LINES.length - 1 ? 0.4 : 1, px: 3, py: 1.5, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s', '&:hover': currentLineIndex < ROLE_PLAY_LINES.length - 1 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {} }}>
              Next Quest →
            </Box>
          </Stack>

          {/* Progress */}
          <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Quest Progress:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {ROLE_PLAY_LINES.map((line, index) => (
                <Box key={line.id} component="button" onClick={() => setCurrentLineIndex(index)}
                  sx={{
                    bgcolor: answers[line.id]?.trim() ? (index === currentLineIndex ? P.green.border : P.purple.border) : (index === currentLineIndex ? P.orange.border : 'rgba(0,0,0,0.15)'),
                    color: 'white', fontWeight: 'bold', borderRadius: '12px', px: 1.5, py: 0.5, cursor: 'pointer', border: 'none', fontSize: '0.85rem', transition: 'all 0.2s',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  {line.avatar} Q{index + 1}
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">Answered: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6</Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered}
              sx={{
                ...cardSx(allAnswered ? 'purple' : 'blue'), cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.5 : 1,
                px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold', color: allAnswered ? P.purple.border : P.blue.border, transition: 'all 0.2s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` } : {}
              }}
            >
              {allAnswered ? 'Complete Quest! 🎭' : `Answer All Lines First (${Object.keys(answers).filter(k => answers[k]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ ...cardSx('red'), mt: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.red.border }}>⏰ Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
