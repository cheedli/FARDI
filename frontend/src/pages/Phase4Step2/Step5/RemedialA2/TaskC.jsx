import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Alert, Avatar, Container, Stack } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BuildIcon from '@mui/icons-material/Build'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 5 - Remedial A2 - Task C: Sentence Builder
 */

const GRAMMAR_SENTENCES = [
  { id: 1, sentence: 'Sentence 1', character: 'Grammar Builder', avatar: '🏗️', faulty: 'Festival are fun.', correct: 'Festival is fun.', errorType: 'Subject-Verb Agreement', hint: 'Use "is" for singular subject "Festival"' },
  { id: 2, sentence: 'Sentence 2', character: 'Preposition Pro', avatar: '📍', faulty: 'Come March 8!', correct: 'Come on March 8!', errorType: 'Missing Preposition', hint: 'Add preposition "on" before dates' },
  { id: 3, sentence: 'Sentence 3', character: 'Article Expert', avatar: '📝', faulty: 'Use hashtag.', correct: 'Use a hashtag.', errorType: 'Missing Article', hint: 'Add article "a" before singular countable nouns' },
  { id: 4, sentence: 'Sentence 4', character: 'Article Master', avatar: '✍️', faulty: 'Add emogi.', correct: 'Add an emoji.', errorType: 'Missing Article & Spelling', hint: 'Add article "an" before vowel sounds and fix spelling' },
  { id: 5, sentence: 'Sentence 5', character: 'Article Ace', avatar: '📌', faulty: 'Tag frend.', correct: 'Tag a friend.', errorType: 'Missing Article & Spelling', hint: 'Add article "a" and fix spelling of "friend"' },
  { id: 6, sentence: 'Sentence 6', character: 'Article Champion', avatar: '🎯', faulty: 'Post photo.', correct: 'Post a photo.', errorType: 'Missing Article', hint: 'Add article "a" before singular countable nouns' }
]

const TIME_LIMIT = 300

export default function Phase4_2Step5RemedialA2TaskC() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_a2' })

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

  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentSentence = GRAMMAR_SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => {
    setAnswers({ ...answers, [sentenceId]: value })
  }

  const handleNext = () => {
    if (currentSentenceIndex < GRAMMAR_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1)
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1)
  }

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim().replace(/[.,!?;]/g, '')
    const s2 = str2.toLowerCase().trim().replace(/[.,!?;]/g, '')
    if (s1 === s2) return 1.0
    const words1 = s1.split(/\s+/)
    const words2 = s2.split(/\s+/)
    let matchCount = 0
    const maxLength = Math.max(words1.length, words2.length)
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) matchCount++
    }
    return matchCount / maxLength
  }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = GRAMMAR_SENTENCES.map(sentence => {
      const userAnswer = answers[sentence.id] || ''
      const similarity = calculateSimilarity(userAnswer, sentence.correct)
      const isCorrect = similarity >= 0.85
      return { sentenceId: sentence.id, sentence: sentence.sentence, character: sentence.character, avatar: sentence.avatar, userAnswer: userAnswer || '(no answer)', correctAnswer: sentence.correct, faultySentence: sentence.faulty, errorType: sentence.errorType, isCorrect, similarity, hint: sentence.hint }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_step5_remedial_a2_taskC_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 5, level: 'A2', task: 'C', score: finalScore, max_score: 6, completed: true, time_taken: TIME_LIMIT - timeLeft })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleStartGame = () => setGameStarted(true)

  const handleContinue = () => navigate('/app/phase4_2/step/5/remedial/a2/results')

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = GRAMMAR_SENTENCES.every(s => answers[s.id]?.trim())

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Step 5: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Level A2 - Task C: Sentence Builder 🏗️</Typography>
              <Typography variant="body1">Correct 6 simple grammar mistakes in social media sentences!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage speaker="Ms. Mabrouki" message="Welcome to Sentence Builder! 🏗️ Fix grammar mistakes in 6 simple social media sentences. Focus on subject-verb agreement, articles (a, an, the), and prepositions. Each correct sentence = 1 point. Ready to build perfect sentences? Let's go! 🚀" />
            </Box>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, textAlign: 'center' }}>
              <BuildIcon sx={{ fontSize: 80, color: P.orange.border, mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Sentence Builder Challenge</Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow, mb: 4 }}>6 Sentences • Simple Grammar • 5 Minutes • Fix the Mistakes!</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', borderRadius: '16px', p: 3, mb: 4, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Grammar Focus</Typography>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  <strong>Errors You'll Fix:</strong><br />
                  • <strong>Subject-Verb Agreement:</strong> Matching singular/plural subjects with correct verbs<br />
                  • <strong>Articles:</strong> Using a, an, the correctly<br />
                  • <strong>Prepositions:</strong> Using on, at, in for time and place<br />
                  • <strong>Spelling:</strong> Fixing common misspellings
                </Typography>
              </Box>
              <Box component="button" onClick={handleStartGame} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 8, py: 2, fontWeight: 700, fontSize: '1.3rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                START BUILDING! 🎮
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished) {
    const perfectScore = score === 6
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Step 5: Remedial Activities</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Level A2 - Task C: Sentence Builder - Results 🏆</Typography>
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.border, mb: 2 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
                {perfectScore ? 'Building Mastered! 🎉' : 'Building Complete! 🎊'}
              </Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '16px', p: 4, maxWidth: 300, mx: 'auto', my: 3, border: `2px solid ${P.purple.border}` }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>{score} / 6</Typography>
                <Typography variant="h6" color="text.secondary">Sentences Corrected</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.yellow.shadow }} fontWeight="bold">Sentence Review</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {results.map((result) => (
                  <Box key={result.sentenceId} sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '16px', p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, fontSize: '1.8rem', bgcolor: P.blue.bg }}>{result.avatar}</Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block' }}>{result.sentence}</Box>
                          <Box component="span" sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: P.red.shadow, display: 'inline-block' }}>{result.errorType}</Box>
                          <Box component="span" sx={{ bgcolor: result.isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, color: result.isCorrect ? P.green.shadow : P.red.shadow, display: 'inline-block' }}>
                            {result.isCorrect ? '+1 Point ✓' : '+0 Points ✗'}
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>{result.character}</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Faulty: <span style={{ color: P.red.shadow }}>"{result.faultySentence}"</span></Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Correct: <span style={{ color: P.green.shadow }}>"{result.correctAnswer}"</span></Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Your Answer: <span style={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>"{result.userAnswer}"</span></Typography>
                    {!result.isCorrect && <Alert severity="info" sx={{ mt: 1 }}><strong>Hint:</strong> {result.hint}</Alert>}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                View Final Results →
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  const progress = ((currentSentenceIndex + 1) / GRAMMAR_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Sentence {currentSentenceIndex + 1} / 6
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.border : P.blue.border }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.blue.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 2, height: 8, borderRadius: 1, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: P.green.border, borderRadius: 1, transition: 'width 0.3s' }} />
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Instructions:</strong> Read the faulty sentence and write the corrected version. Your correction must be at least 85% accurate.
          </Alert>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, fontSize: '2rem', bgcolor: P.blue.bg }}>{currentSentence.avatar}</Avatar>
              <Box>
                <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '1rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block', mr: 1 }}>{currentSentence.sentence}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>{currentSentence.character}</Typography>
              </Box>
            </Stack>

            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '16px', p: 3, mb: 3 }}>
              <BuildIcon sx={{ fontSize: 32, color: P.red.border, mb: 1 }} />
              <Typography variant="body2" sx={{ color: P.red.shadow, fontWeight: 'bold', mb: 1 }}>
                FAULTY SENTENCE (Error Type: {currentSentence.errorType}):
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>"{currentSentence.faulty}"</Typography>
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '16px', p: 3 }}>
              <Typography variant="body2" sx={{ color: P.purple.shadow, fontWeight: 'bold', mb: 2 }}>YOUR CORRECTED SENTENCE:</Typography>
              <TextField
                value={answers[currentSentence.id] || ''}
                onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                placeholder="Type the corrected sentence here..."
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                Hint: {currentSentence.hint}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: currentSentenceIndex === 0 ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
              border: `2px solid ${currentSentenceIndex === 0 ? '#999' : P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${currentSentenceIndex === 0 ? '#999' : P.blue.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              color: currentSentenceIndex === 0 ? '#999' : P.blue.shadow
            }}>← Previous</Box>

            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === GRAMMAR_SENTENCES.length - 1} sx={{
              bgcolor: currentSentenceIndex === GRAMMAR_SENTENCES.length - 1 ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
              border: `2px solid ${currentSentenceIndex === GRAMMAR_SENTENCES.length - 1 ? '#999' : P.blue.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${currentSentenceIndex === GRAMMAR_SENTENCES.length - 1 ? '#999' : P.blue.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
              cursor: currentSentenceIndex === GRAMMAR_SENTENCES.length - 1 ? 'not-allowed' : 'pointer',
              color: currentSentenceIndex === GRAMMAR_SENTENCES.length - 1 ? '#999' : P.blue.shadow
            }}>Next →</Box>
          </Stack>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.yellow.shadow, fontWeight: 'bold' }}>Sentence Progress:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {GRAMMAR_SENTENCES.map((sentence, index) => (
                <Box key={sentence.id} component="span" onClick={() => setCurrentSentenceIndex(index)} sx={{
                  bgcolor: answers[sentence.id]?.trim()
                    ? (index === currentSentenceIndex ? P.green.bg : P.blue.bg)
                    : (index === currentSentenceIndex ? P.orange.bg : isDark ? '#333' : '#e0e0e0'),
                  border: `2px solid ${answers[sentence.id]?.trim()
                    ? (index === currentSentenceIndex ? P.green.border : P.blue.border)
                    : (index === currentSentenceIndex ? P.orange.border : '#999')}`,
                  borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700,
                  color: answers[sentence.id]?.trim()
                    ? (index === currentSentenceIndex ? P.green.shadow : P.blue.shadow)
                    : (index === currentSentenceIndex ? P.orange.shadow : '#666'),
                  cursor: 'pointer', display: 'inline-block'
                }}>S{index + 1}</Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Corrected: {Object.keys(answers).filter(key => answers[key]?.trim()).length} / 6
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{
              bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.purple.bg,
              border: `2px solid ${!allAnswered ? '#999' : P.purple.border}`,
              borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.purple.shadow}`,
              px: 8, py: 2, fontWeight: 700, fontSize: '1.2rem',
              cursor: !allAnswered ? 'not-allowed' : 'pointer',
              color: !allAnswered ? '#999' : P.purple.shadow,
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {},
              '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.purple.shadow}` } : {}
            }}>
              {allAnswered ? 'Complete Building! 🏗️' : `Fix All First (${Object.keys(answers).filter(key => answers[key]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Hurry!</strong> Only {timeLeft} seconds left!
            </Alert>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
