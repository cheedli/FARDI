import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Chip, LinearProgress, Avatar, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GavelIcon from '@mui/icons-material/Gavel'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Remedial C1 - Task G: Debate Duel Advanced
 * Debate grammar game - 6 debate lines using subjunctives/modals
 */

const DEBATE_LINES = [
  { id: 1, debater: 'Strategy Advocate', avatar: '📊', before: 'It is essential that Instagram', infinitive: 'to be', after: 'consistent.', answer: 'be', grammarType: 'Subjunctive', concept: 'Subjunctive mood after "it is essential that" - use base form' },
  { id: 2, debater: 'Hashtag Defender', avatar: '#️⃣', before: 'Trending hashtags', infinitive: 'to boost', after: 'engagement.', answer: 'might boost', grammarType: 'Modal', concept: 'Modal "might" for possibility' },
  { id: 3, debater: 'Caption Guardian', avatar: '✍️', before: 'Captions', infinitive: 'to include', after: 'strong CTAs.', answer: 'should include', grammarType: 'Modal', concept: 'Modal "should" for recommendation/obligation' },
  { id: 4, debater: 'Engagement Champion', avatar: '💬', before: 'Quality content', infinitive: 'to prioritize', after: 'in every post.', answer: 'be prioritized', grammarType: 'Subjunctive', concept: 'Subjunctive mood with passive voice - use base form "be"' },
  { id: 5, debater: 'Analytics Voice', avatar: '📈', before: 'Weekly tracking', infinitive: 'to reveal', after: 'performance gaps.', answer: 'reveal', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' },
  { id: 6, debater: 'Timing Keeper', avatar: '⏰', before: 'Optimal posting times', infinitive: 'to remain', after: 'priority for reach.', answer: 'remain', grammarType: 'Subjunctive', concept: 'Subjunctive mood - use base form' }
]

const TIME_LIMIT = 300

export default function Phase4_2Step2RemedialC1TaskG() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 7, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentLine = DEBATE_LINES[currentLineIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (lineId, value) => { setAnswers({ ...answers, [lineId]: value }) }
  const handleNext = () => { if (currentLineIndex < DEBATE_LINES.length - 1) setCurrentLineIndex(currentLineIndex + 1) }
  const handlePrevious = () => { if (currentLineIndex > 0) setCurrentLineIndex(currentLineIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = DEBATE_LINES.map(line => {
      const userAnswer = (answers[line.id] || '').trim().toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === line.answer.toLowerCase()
      return { lineId: line.id, debater: line.debater, before: line.before, after: line.after, userAnswer: answers[line.id] || '(No answer provided)', correctAnswer: line.answer, isCorrect, grammarType: line.grammarType, concept: line.concept }
    })
    setResults(evaluatedResults)
    const rawScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(rawScore)
    const finalScore = Math.round((rawScore / 6) * 10)
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskG_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskG_max', '10')
    await logTaskCompletion(finalScore, rawScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore, rawScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskG', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'C1', task: 'G', score: finalScore, max_score: 10, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>
                Phase 4.2 Step 2 - Remedial Practice
              </Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow }}>
                Level C1 - Task G: Debate Duel Advanced
              </Typography>
            </Box>

            {/* Instructor */}
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage
                character="EMNA"
                message="Welcome to the Debate Duel! Master advanced grammar by using subjunctives and modals in 6 powerful debate statements about Instagram strategy."
              />
            </Box>

            {/* Start card */}
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <GavelIcon sx={{ fontSize: 60, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: P.purple.shadow }}>
                ⚖️ Debate Duel Advanced
              </Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>
                Subjunctives & Modals — 5 Minutes
              </Typography>

              <Box sx={{ bgcolor: isDark ? '#2a1a4a' : '#f3e8ff', border: `1px solid ${P.purple.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: P.purple.shadow, mb: 1 }}>📋 Debate Rules</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>✏️ Complete 6 Debate Lines:</strong> Use correct subjunctives and modals</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>📚 Grammar Focus:</strong> Subjunctive mood and modal verbs (might, should, must)</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>⏱️ Time Limit:</strong> 5 minutes total</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#2c3e50' }}><strong>🏆 Scoring:</strong> +1 for each correct form (6 points = 10/10)</Typography>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: P.yellow.shadow, mb: 1 }}>💡 Grammar Tips:</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>• <strong>Subjunctive:</strong> Use base form after "it is essential that" (e.g., "he be", not "he is")</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>• <strong>Modals:</strong> might/should/must + base verb (e.g., "might boost", "should include")</Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '14px',
                boxShadow: `4px 4px 0 ${P.purple.shadow}`, px: 6, py: 2,
                fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', color: P.purple.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` },
              }}>
                <GavelIcon /> Start Debate Duel
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && submitted) {
    const finalScore = Math.round((score / 6) * 10)
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 60, color: P.purple.shadow, mb: 1 }} />
              <Typography variant="h4" fontWeight={800} sx={{ color: P.purple.shadow }}>
                Debate Complete!
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{
              bgcolor: score >= 5 ? P.green.bg : score >= 3 ? P.yellow.bg : P.red.bg,
              border: `2px solid ${score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow}`,
              p: 3, mb: 3, textAlign: 'center'
            }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow }}>
                Score: {finalScore}/10
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#666' }}>({score}/6 correct)</Typography>
            </Box>

            {/* Results review */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {results.map((result) => (
                <Box key={result.lineId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '16px',
                  boxShadow: `3px 3px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ bgcolor: result.isCorrect ? P.green.shadow : P.red.shadow, width: 36, height: 36 }}>
                      {result.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? '#eee' : '#2c3e50' }}>
                      {result.debater}
                    </Typography>
                    <Box sx={{ bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ color: P.purple.shadow }}>{result.grammarType}</Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ color: isDark ? '#ddd' : '#2c3e50', mb: 1 }}>
                    {result.before} <strong style={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.userAnswer}</strong> {result.after}
                  </Typography>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `1px solid ${P.green.border}`, borderRadius: '10px', p: 2, mt: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: P.green.shadow, mb: 0.5 }}>Correct: {result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>💡 {result.concept}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/2/remedial/c1/results')} sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px',
                boxShadow: `3px 3px 0 ${P.purple.shadow}`, px: 5, py: 1.5,
                fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: P.purple.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` },
              }}>
                <ArrowForwardIcon /> Continue to Results
              </Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game screen — gradient preserved
  const progress = ((currentLineIndex + 1) / DEBATE_LINES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)', padding: 3 }}>
      <Paper elevation={24} sx={{ maxWidth: 900, margin: '0 auto', padding: 4, background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)', borderRadius: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>⚖️ Debate Duel Advanced</Typography>
            <Chip icon={<TimerIcon />} label={formatTime(timeLeft)} color={timeLeft < 60 ? 'error' : 'primary'} sx={{ fontSize: '1.1rem', fontWeight: 700, px: 2 }} />
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 2, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #8e44ad 0%, #3498db 100%)', borderRadius: 2 } }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>Debate Line {currentLineIndex + 1} of {DEBATE_LINES.length}</Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>{Math.round(progress)}% Complete</Typography>
          </Box>
        </Box>

        {/* Current Line */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#8e44ad', width: 60, height: 60, fontSize: '2rem' }}>{currentLine.avatar}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{currentLine.debater}</Typography>
              <Chip label={currentLine.grammarType} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }} />
            </Box>
          </Box>
          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>Complete the debate statement:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>"{currentLine.before}</Typography>
              <TextField
                value={answers[currentLine.id] || ''}
                onChange={(e) => handleAnswerChange(currentLine.id, e.target.value)}
                placeholder={currentLine.infinitive}
                variant="outlined"
                sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { backgroundColor: '#f3e5f5', '& fieldset': { borderColor: '#8e44ad', borderWidth: 3 }, '&:hover fieldset': { borderColor: '#6c3483' }, '&.Mui-focused fieldset': { borderColor: '#6c3483' }, '& input': { color: '#1a252f', fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' }, '& input::placeholder': { color: '#95a5a6', opacity: 0.8, fontWeight: 500 } } }}
              />
              <Typography variant="h5" sx={{ color: '#2c3e50', fontWeight: 500 }}>{currentLine.after}"</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block' }}>💡 Grammar: {currentLine.concept}</Typography>
          </Paper>
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button onClick={handlePrevious} disabled={currentLineIndex === 0} variant="outlined" sx={{ fontWeight: 700, borderColor: '#8e44ad', color: '#8e44ad', '&:hover': { borderColor: '#6c3483', bgcolor: 'rgba(142, 68, 173, 0.1)' } }}>← Previous</Button>
          {currentLineIndex === DEBATE_LINES.length - 1 ? (
            <Button onClick={handleSubmitAll} variant="contained" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #27ae60 30%, #229954 90%)', px: 4, '&:hover': { background: 'linear-gradient(45deg, #229954 30%, #1e8449 90%)' } }}>Submit All →</Button>
          ) : (
            <Button onClick={handleNext} variant="contained" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #8e44ad 30%, #3498db 90%)', '&:hover': { background: 'linear-gradient(45deg, #7d3c98 30%, #2980b9 90%)' } }}>Next →</Button>
          )}
        </Box>

        {/* Progress dots */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {DEBATE_LINES.map((line, idx) => (
            <Chip key={line.id} label={`${idx + 1}`} onClick={() => setCurrentLineIndex(idx)} sx={{ fontWeight: 700, cursor: 'pointer', bgcolor: idx === currentLineIndex ? '#8e44ad' : answers[line.id] ? '#27ae60' : '#e0e0e0', color: idx === currentLineIndex || answers[line.id] ? 'white' : '#7f8c8d', '&:hover': { bgcolor: idx === currentLineIndex ? '#7d3c98' : answers[line.id] ? '#229954' : '#d0d0d0' } }} />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
