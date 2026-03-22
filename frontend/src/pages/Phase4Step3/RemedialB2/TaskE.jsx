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
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

/**
 * Phase 4 Step 3 - Remedial B2 - Task E: Conditional Challenge
 * Score: 6 pts
 */

const SENTENCES = [
  { id: 1, level: 'Level 1', before: 'If an ad is promotional, it', answer: 'would sell', infinitive: 'to sell', after: 'more products.', concept: 'promotional advertising increases sales' },
  { id: 2, level: 'Level 2', before: 'Persuasive advertising', answer: 'would convince', infinitive: 'to convince', after: 'people if it uses pathos.', concept: 'persuasive techniques with emotional appeals' },
  { id: 3, level: 'Level 3', before: 'If targeted advertising', answer: 'would reach', infinitive: 'to reach', after: 'the right group.', concept: 'targeting specific audiences' },
  { id: 4, level: 'Level 4', before: 'Original advertising', answer: 'would stand', infinitive: 'to stand', after: 'out if it is creative.', concept: 'creativity makes ads memorable' },
  { id: 5, level: 'Level 5', before: 'If dramatisation is used, it', answer: 'would engage', infinitive: 'to engage', after: 'viewers with stories.', concept: 'storytelling engages audiences' },
  { id: 6, level: 'Level 6', before: 'Ethical advertising', answer: 'would build', infinitive: 'to build', after: 'trust with customers.', concept: 'honesty creates trust' }
]

const TIME_LIMIT = 300

export default function RemedialB2TaskE() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 5, context: 'remedial_b2' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = SENTENCES[currentSentenceIndex]

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
    const evaluatedResults = SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || userAnswer.includes(correctAnswer)
      return { sentenceId: sentence.id, level: sentence.level, userAnswer: answers[sentence.id] || '', correctAnswer: sentence.answer, isCorrect, fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}` }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('remedial_step3_b2_taskE_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'B2', task: 'E', step: 2, score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom>Level B2 - Task E: Conditional Challenge 🎯</Typography>
              <Typography variant="body1">Grammar exercise - Master conditionals with advertising terms!</Typography>
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to the Conditional Challenge! 🎯 Complete 6 conditional sentences using advertising terms from the videos. Use the correct conditional form (would + verb). Each correct sentence = 1 point. Total: 6 points! Ready for the challenge? 🚀" />
            </Box>
            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>📚 Grammar Focus: Second Conditional</Typography>
              <Typography variant="body1">
                <strong>Structure:</strong><br />
                • If + subject + verb (past), subject + would + verb (base)<br />
                • Subject + would + verb (base) + if + subject + verb (past)<br /><br />
                <strong>Example:</strong> "If the ad <u>was</u> creative, it <u>would attract</u> more viewers."
              </Typography>
            </Box>
            <Box sx={{ ...cardSx('teal'), textAlign: 'center', p: 5 }}>
              <EditNoteIcon sx={{ fontSize: 80, mb: 2, color: P.teal.border }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">Conditional Challenge</Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>6 Levels • 5 Minutes • Complete the Conditionals!</Typography>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 8, py: 2,
                  fontSize: '1.4rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                START CHALLENGE! 🎮
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
              <Typography variant="h5">Level B2 - Task E: Conditional Challenge - Results 🏆</Typography>
            </Box>
            <Box sx={{ ...cardSx(score === 6 ? 'green' : 'teal'), mb: 3, textAlign: 'center', p: 5 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: score === 6 ? P.green.border : P.teal.border }} />
              <Typography variant="h3" gutterBottom fontWeight="bold">{score === 6 ? 'Perfect Grammar! 🎉' : 'Challenge Complete! 🎊'}</Typography>
              <Box sx={{ ...cardSx('yellow'), maxWidth: 300, mx: 'auto', my: 3 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.teal.border }}>{score} / 6</Typography>
                <Typography variant="h6" color="text.secondary">Correct Sentences</Typography>
              </Box>
              {score === 6 && <Box sx={{ ...cardSx('green'), mt: 2 }}><Typography variant="body1" fontWeight={500}>Amazing! You mastered all conditional sentences! Grammar expert! 🌟</Typography></Box>}
            </Box>

            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">Sentence Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result, index) => (
                  <Box key={result.sentenceId} sx={{
                    bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                    border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                    borderRadius: '16px', p: 3, boxShadow: `3px 3px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ bgcolor: P.teal.border, borderRadius: '10px', px: 1.5, py: 0.25 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>{result.level}</Typography>
                      </Box>
                      {result.isCorrect
                        ? <Box sx={{ bgcolor: P.green.border, borderRadius: '10px', px: 1.5, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 14, color: 'white' }} /><Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>+1 Point</Typography></Box>
                        : <Box sx={{ bgcolor: P.red.border, borderRadius: '10px', px: 1.5, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}><CancelIcon sx={{ fontSize: 14, color: 'white' }} /><Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>+0 Points</Typography></Box>
                      }
                    </Stack>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Correct Sentence:</Typography>
                    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '12px', p: 2, mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border }}>{result.fullSentence}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Your Answer:</Typography>
                    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '12px', p: 2, mb: result.isCorrect ? 0 : 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.border : P.red.border }}>
                        {SENTENCES[index].before} <span style={{ textDecoration: 'underline', padding: '2px 8px' }}>{result.userAnswer || '(no answer)'}</span> {SENTENCES[index].after}
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2 }}>
                        <Typography variant="body2" fontWeight={500}>Remember: Use "would" + base verb for the second conditional</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/b2/taskF')}
                sx={{
                  ...cardSx('green'), cursor: 'pointer', px: 6, py: 2,
                  fontSize: '1.2rem', fontWeight: 'bold', color: P.green.border, transition: 'all 0.2s',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ ...cardSx('teal'), mb: 2, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">{currentSentence.level} / 6</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.teal.border }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.border : 'inherit', fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={(currentSentenceIndex + 1) / SENTENCES.length * 100}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: P.teal.border, borderRadius: 4 } }} />
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3, p: 2 }}>
            <Typography variant="body1" fontWeight={600}>Instructions: Fill in the blank with the correct conditional form (would + verb). Navigate between levels using the arrows below.</Typography>
          </Box>

          {/* Sentence card */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Box sx={{ bgcolor: P.teal.border, borderRadius: '12px', px: 2, py: 0.5, display: 'inline-block', mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>{currentSentence.level}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3, p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '16px', border: `2px solid ${P.teal.border}` }}>
              <Typography variant="h5" fontWeight={500}>{currentSentence.before}</Typography>
              <TextField
                value={answers[currentSentence.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentSentence.id]: e.target.value })}
                placeholder={currentSentence.infinitive}
                variant="outlined"
                sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '12px', '& fieldset': { borderColor: P.teal.border, borderWidth: 2 }, '& input': { fontWeight: 700, fontSize: '1.2rem', textAlign: 'center' } } }}
              />
              <Typography variant="h5" fontWeight={500}>{currentSentence.after}</Typography>
            </Box>
            <Box sx={{ ...cardSx('green'), p: 2 }}>
              <Typography variant="body1" fontWeight={500}><strong>Concept:</strong> {currentSentence.concept}</Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            <Box component="button" onClick={() => setCurrentSentenceIndex(currentSentenceIndex - 1)} disabled={currentSentenceIndex === 0}
              sx={{ ...cardSx('blue'), cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentSentenceIndex === 0 ? 0.4 : 1, px: 3, py: 1.5, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s', '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {} }}>
              ← Previous Level
            </Box>
            <Box component="button" onClick={() => setCurrentSentenceIndex(currentSentenceIndex + 1)} disabled={currentSentenceIndex === SENTENCES.length - 1}
              sx={{ ...cardSx('blue'), cursor: currentSentenceIndex === SENTENCES.length - 1 ? 'not-allowed' : 'pointer', opacity: currentSentenceIndex === SENTENCES.length - 1 ? 0.4 : 1, px: 3, py: 1.5, fontWeight: 'bold', color: P.blue.border, transition: 'all 0.2s', '&:hover': currentSentenceIndex < SENTENCES.length - 1 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {} }}>
              Next Level →
            </Box>
          </Stack>

          {/* Progress dots */}
          <Box sx={{ ...cardSx('yellow'), mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Your Progress:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {SENTENCES.map((sentence, index) => (
                <Box key={sentence.id} component="button" onClick={() => setCurrentSentenceIndex(index)}
                  sx={{
                    bgcolor: answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.border : P.teal.border) : (index === currentSentenceIndex ? P.orange.border : 'rgba(0,0,0,0.15)'),
                    color: 'white', fontWeight: 'bold', borderRadius: '12px', px: 1.5, py: 0.5, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  L{index + 1}
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">Answered: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6</Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered}
              sx={{
                ...cardSx(allAnswered ? 'teal' : 'blue'), cursor: !allAnswered ? 'not-allowed' : 'pointer', opacity: !allAnswered ? 0.5 : 1,
                px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold', color: allAnswered ? P.teal.border : P.blue.border, transition: 'all 0.2s',
                '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } : {}
              }}
            >
              {allAnswered ? 'Submit All Answers! 🎯' : `Answer All Sentences First (${Object.keys(answers).filter(k => answers[k]?.trim()).length}/6)`}
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
