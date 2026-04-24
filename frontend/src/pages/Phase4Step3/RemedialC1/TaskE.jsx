import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, TextField, LinearProgress, Avatar, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import ExploreIcon from '@mui/icons-material/Explore'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task E: Tense Odyssey
 * Mixed tenses grammar exercise - Complete 6 sentences using different tenses
 * Score: +1 for each correct tense (6 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#1a1a2e',
  purple: { bg: '#2d1b4e', border: '#A855F7', shadow: '#7E22CE' },
  green: { bg: '#052e16', border: '#22C55E', shadow: '#15803D' },
  blue: { bg: '#1e3a5f', border: '#3B82F6', shadow: '#1D4ED8' },
  teal: { bg: '#042f2e', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#F97316', shadow: '#C2410C' },
  red: { bg: '#450a0a', border: '#EF4444', shadow: '#B91C1C' },
}

const cardSx = (color) => ({
  bgcolor: color.bg,
  border: `2px solid ${color.border}`,
  borderRadius: '20px',
  boxShadow: `4px 4px 0 ${color.shadow}`,
  p: 3,
})

const TENSE_SENTENCES = [
  { id: 1, odyssey: 'Odyssey 1', character: 'Marketing Historian', avatar: '📜', before: 'Promotional is to sell', infinitive: 'to use', answer: 'has been used', tenseType: 'Present Perfect', after: 'since early ads.', concept: 'present perfect for actions started in past and continuing' },
  { id: 2, odyssey: 'Odyssey 2', character: 'Video Analyst', avatar: '📹', before: 'Persuasive uses logos', infinitive: 'to use', answer: 'used', tenseType: 'Simple Past', after: 'in video 1.', concept: 'simple past for completed action in video' },
  { id: 3, odyssey: 'Odyssey 3', character: 'Data Scientist', avatar: '📊', before: 'Targeted group is specific', infinitive: 'to become', answer: 'has become', tenseType: 'Present Perfect', after: 'more with data.', concept: 'present perfect for change over time' },
  { id: 4, odyssey: 'Odyssey 4', character: 'Campaign Director', avatar: '🎬', before: 'Original idea is new', infinitive: 'to be', answer: 'was', tenseType: 'Simple Past', after: 'key in past campaigns.', concept: 'simple past for historical campaigns' },
  { id: 5, odyssey: 'Odyssey 5', character: 'Creative Director', avatar: '🎨', before: 'Creative ads make memorable', infinitive: 'to stand', answer: 'have always stood', tenseType: 'Present Perfect', after: 'out.', concept: 'present perfect with "always" for ongoing truth' },
  { id: 6, odyssey: 'Odyssey 6', character: 'Ethics Officer', avatar: '⚖️', before: 'Ethical is honest', infinitive: 'to remain', answer: 'remains', tenseType: 'Simple Present', after: 'important today.', concept: 'simple present for current truth/fact' }
]

const TIME_LIMIT = 300

export default function RemedialC1TaskE() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/c1/taskF') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 5, context: 'remedial_c1' })
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
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value })
  const handleNext = () => { if (currentSentenceIndex < TENSE_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = TENSE_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && (userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer))
      return { sentenceId: sentence.id, odyssey: sentence.odyssey, character: sentence.character, avatar: sentence.avatar, userAnswer: answers[sentence.id] || '', correctAnswer: sentence.answer, tenseType: sentence.tenseType, isCorrect, fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}` }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('remedial_step3_c1_taskE_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'E', step: 2, score: finalScore, max_score: 6, completed: true }) })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>Phase 4 - Step 3: Remedial Activities</Typography>
              <Typography variant="h5" sx={{ color: P.purple.border, mb: 0.5 }}>Level C1 - Task E: Tense Odyssey 🗺️</Typography>
              <Typography variant="body1" color="text.secondary">Mixed tenses grammar exercise - Master verb tenses with video contexts!</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Tense Odyssey! 🗺️ Embark on a journey through different verb tenses. Complete 6 sentences using the correct tense (present perfect, simple past, simple present, etc.). Each correct tense = 1 point. Total: 6 points! Ready to navigate through time? 🚀" />
            </Box>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center', py: 4 }}>
              <ExploreIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 1 }}>Tense Odyssey</Typography>
              <Typography variant="h6" sx={{ color: P.purple.border, mb: 3 }}>6 Odysseys • Mixed Tenses • 5 Minutes • Navigate Through Time!</Typography>
              <Box sx={{ ...cardSx(P.blue), maxWidth: 600, mx: 'auto', mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 1 }}>📚 Grammar Focus: Mixed Tenses</Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Present Perfect:</strong> has/have + past participle (for ongoing or recent actions)<br />
                  • <strong>Simple Past:</strong> verb + -ed (for completed actions)<br />
                  • <strong>Simple Present:</strong> base verb (for facts/routines)
                </Typography>
              </Box>
              <Box component="button" onClick={() => setGameStarted(true)}
                sx={{ px: 8, py: 2, fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
                START ODYSSEY! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {score === 6 ? 'Odyssey Mastered! 🎉' : 'Odyssey Complete! 🎊'}
              </Typography>
            </Box>
            <Box sx={{ ...cardSx(P.green), mb: 3, textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: P.green.shadow }}>{score} / 6</Typography>
              <Typography variant="h6" color="text.secondary">Correct Tenses</Typography>
            </Box>
            <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 2 }}>Tense Review</Typography>
              <Stack spacing={2}>
                {results.map((result, index) => (
                  <Box key={result.sentenceId} sx={{ p: 3, borderRadius: '14px', bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: P.purple.border, fontSize: '1.2rem', width: 44, height: 44 }}>{result.avatar}</Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box sx={{ px: 1.5, py: 0.25, borderRadius: '8px', bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>{result.odyssey}</Box>
                          <Box sx={{ px: 1.5, py: 0.25, borderRadius: '8px', bgcolor: P.blue.border, color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>{result.tenseType}</Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{result.character}</Typography>
                      </Box>
                      {result.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow, ml: 'auto' }} /> : <CancelIcon sx={{ color: P.red.shadow, ml: 'auto' }} />}
                    </Box>
                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '10px', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: P.green.shadow, fontWeight: 'bold' }}>"{result.fullSentence}"</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                      <Typography variant="h6" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 'bold' }}>
                        Your answer: "{result.userAnswer || '(no answer)'}"
                      </Typography>
                    </Box>
                    {!result.isCorrect && (
                      <Box sx={{ mt: 1, p: 2, bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '10px' }}>
                        <Typography variant="body2" fontWeight={500} sx={{ color: P.blue.shadow }}>
                          Remember: {TENSE_SENTENCES[index].concept}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4/step3/remedial/c1/taskF')}
                sx={{ px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', bgcolor: P.green.border, color: '#fff', border: `2px solid ${P.green.shadow}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>
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
          {/* Header with timer */}
          <Box sx={{ ...cardSx(P.purple), mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {currentSentence.odyssey} / 6
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '10px', bgcolor: timeLeft <= 60 ? P.red.bg : P.teal.bg, border: `2px solid ${timeLeft <= 60 ? P.red.border : P.teal.border}` }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.teal.shadow, fontSize: 20 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.teal.shadow }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(currentSentenceIndex + 1) / TENSE_SENTENCES.length * 100}
              sx={{ height: 8, borderRadius: '8px', bgcolor: 'rgba(168,85,247,0.15)', '& .MuiLinearProgress-bar': { bgcolor: P.purple.border, borderRadius: '8px' } }} />
          </Box>

          {/* Instructions */}
          <Box sx={{ ...cardSx(P.blue), mb: 3 }}>
            <Typography variant="body1" fontWeight={600}>
              <strong>Instructions:</strong> Fill in the blank with the correct verb tense based on the context. Navigate between odysseys using the arrows below.
            </Typography>
          </Box>

          {/* Current sentence */}
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, fontSize: '2rem', bgcolor: P.purple.border }}>{currentSentence.avatar}</Avatar>
              <Box>
                <Box sx={{ px: 2, py: 0.5, borderRadius: '10px', bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', fontSize: '1rem', display: 'inline-block', mb: 0.5 }}>{currentSentence.odyssey}</Box>
                <Typography variant="h6" fontWeight="bold">{currentSentence.character} says:</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '14px', border: `2px solid ${P.purple.border}`, mb: 2 }}>
              <RecordVoiceOverIcon sx={{ color: P.purple.border, mb: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>"{currentSentence.before}</Typography>
                <TextField value={answers[currentSentence.id] || ''} onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive} variant="outlined"
                  sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: P.purple.bg, '& fieldset': { borderColor: P.purple.border, borderWidth: 3 }, '&:hover fieldset': { borderColor: P.purple.shadow }, '&.Mui-focused fieldset': { borderColor: P.purple.shadow }, '& input': { fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' } } }}
                />
                <Typography variant="h5" sx={{ fontWeight: 500 }}>{currentSentence.after}"</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2, bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '10px' }}>
              <Typography variant="body1" fontWeight={500} sx={{ color: P.green.shadow }}>
                <strong>Concept:</strong> {currentSentence.concept}
              </Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0}
              sx={{ px: 3, py: 1.5, fontWeight: 'bold', cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer', bgcolor: 'transparent', color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '12px', opacity: currentSentenceIndex === 0 ? 0.4 : 1, '&:hover': { bgcolor: P.purple.bg } }}>
              ← Previous Odyssey
            </Box>
            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1}
              sx={{ px: 3, py: 1.5, fontWeight: 'bold', cursor: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'not-allowed' : 'pointer', bgcolor: 'transparent', color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '12px', opacity: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 0.4 : 1, '&:hover': { bgcolor: P.purple.bg } }}>
              Next Odyssey →
            </Box>
          </Box>

          {/* Progress dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {TENSE_SENTENCES.map((s, idx) => (
              <Box key={s.id} component="button" onClick={() => setCurrentSentenceIndex(idx)}
                sx={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${idx === currentSentenceIndex ? P.purple.shadow : P.purple.border}`, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', bgcolor: idx === currentSentenceIndex ? P.purple.border : answers[s.id]?.trim() ? P.green.border : 'transparent', color: idx === currentSentenceIndex || answers[s.id]?.trim() ? 'white' : P.purple.border }}>
                {s.avatar}
              </Box>
            ))}
          </Box>

          {/* Submit */}
          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered}
              sx={{ px: 8, py: 2, fontSize: '1.3rem', fontWeight: 'bold', cursor: !allAnswered ? 'not-allowed' : 'pointer', bgcolor: allAnswered ? P.purple.border : 'grey.400', color: '#fff', border: `2px solid ${allAnswered ? P.purple.shadow : '#999'}`, borderRadius: '16px', boxShadow: allAnswered ? `4px 4px 0 ${P.purple.shadow}` : 'none', '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none' } }}>
              {allAnswered ? 'Complete Odyssey! 🗺️' : `Answer All First (${Object.keys(answers).filter(k => answers[k]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.shadow }}>Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
