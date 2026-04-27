import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Container, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B1 - Task E: Tense Time Travel
 * Grammar exercise - Rewrite 6 social media sentences in past tense
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCES = [
  { id: 1, level: 'Level 1', before: 'Post has hashtag', answer: 'had', infinitive: 'have/has', after: '', concept: 'present has → past had' },
  { id: 2, level: 'Level 2', before: 'Caption uses emoji', answer: 'used', infinitive: 'use/uses', after: '', concept: 'present uses → past used' },
  { id: 3, level: 'Level 3', before: 'Tag friend', answer: 'tagged', infinitive: 'tag', after: '', concept: 'present tag → past tagged' },
  { id: 4, level: 'Level 4', before: 'Story shows event', answer: 'showed', infinitive: 'show/shows', after: '', concept: 'present shows → past showed' },
  { id: 5, level: 'Level 5', before: 'Call-to-action says join', answer: 'said', infinitive: 'say/says', after: '', concept: 'present says → past said' },
  { id: 6, level: 'Level 6', before: 'Like increases', answer: 'increased', infinitive: 'increase/increases', after: '', concept: 'present increases → past increased' }
]

const TIME_LIMIT = 300

export default function Phase4_2RemedialB1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 5, context: 'remedial_b1' })
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
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value })
  const handleNext = () => { if (currentSentenceIndex < SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer === correctAnswer || userAnswer.includes(correctAnswer)
      return {
        sentenceId: sentence.id, level: sentence.level,
        userAnswer: answers[sentence.id] || '', correctAnswer: sentence.answer,
        isCorrect, fullSentence: sentence.after ? `${sentence.before} ${sentence.answer} ${sentence.after}` : `${sentence.before} ${sentence.answer}`
      }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_remedial_b1_taskE_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'E', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const handleContinue = () => navigate('/phase4_2/step/1/remedial/b1/results')
  window.__remedialSkip = handleContinue
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  const allAnswered = SENTENCES.every(s => answers[s.id]?.trim())

  const clayBtn = (color, disabled = false) => ({
    bgcolor: P[color].bg, border: `2px solid ${P[color].border}`, borderRadius: '12px',
    boxShadow: `3px 3px 0 ${P[color].shadow}`, px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer', color: P[color].shadow,
    opacity: disabled ? 0.6 : 1,
    '&:hover': disabled ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P[color].shadow}` },
    '&:active': disabled ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P[color].shadow}` }
  })

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1: Engage - Remedial Practice</Typography>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Level B1 - Task E: Tense Time Travel</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow }}>Grammar exercise - Master past tense with social media terms!</Typography>
            </Box>
            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Tense Time Travel! Rewrite 6 social media sentences from present tense to past tense. Change each verb to its correct past form. Each correct sentence = 1 point. Total: 6 points! Ready to travel back in time?" />
            </Box>
            <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 4, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <EditNoteIcon sx={{ fontSize: 80, color: P.blue.shadow, mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Tense Time Travel</Typography>
                <Typography variant="h6" sx={{ color: P.blue.shadow, mb: 3 }}>6 Levels • 5 Minutes • Rewrite in Past Tense!</Typography>
              </Box>
              <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ color: P.yellow.shadow, fontWeight: 'bold', mb: 2 }}>Grammar Focus: Past Simple Tense</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                  <strong>Rules:</strong><br />
                  • Regular verbs: add -ed (use → used, show → showed)<br />
                  • Irregular verbs: change form (has → had, say → said)<br />
                  <br />
                  <strong>Example:</strong> "Post <u>has</u> hashtag" → "Post <u>had</u> hashtag"
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="button" onClick={() => setGameStarted(true)} sx={{ ...clayBtn('green'), px: 5, py: 2, fontSize: '1.2rem' }}>
                  START CHALLENGE!
                </Box>
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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Level B1 - Task E: Tense Time Travel - Results</Typography>
            </Box>
            <Box sx={{ bgcolor: score >= 5 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 5 ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : P.yellow.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: score >= 5 ? P.green.shadow : P.yellow.shadow, mb: 2 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>
                {score === 6 ? 'Perfect Grammar!' : 'Challenge Complete!'}
              </Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>{score} / 6</Typography>
              <Typography variant="body1" sx={{ color: score >= 5 ? P.green.shadow : P.yellow.shadow }}>Correct Sentences</Typography>
            </Box>
            <Box sx={{ mb: 4 }}>
              {results.map((result, index) => (
                <Box key={result.sentenceId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '20px', boxShadow: `4px 4px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3, mb: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.8rem', fontWeight: 700, color: P.blue.shadow }}>{result.level}</Box>
                    {result.isCorrect ? <CheckCircleIcon sx={{ color: P.green.shadow }} /> : <CancelIcon sx={{ color: P.red.shadow }} />}
                  </Box>
                  <Typography variant="body1" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, fontWeight: 600, mb: 1 }}>
                    Correct: <strong>{result.fullSentence}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                    Your answer: <strong>{SENTENCES[index].before} {result.userAnswer || '(no answer)'}</strong>
                  </Typography>
                  {!result.isCorrect && (
                    <Typography variant="caption" sx={{ color: P.red.shadow, display: 'block', mt: 1 }}>Remember: {SENTENCES[index].concept}</Typography>
                  )}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component="button" onClick={handleContinue} sx={{ ...clayBtn('green'), px: 5, py: 2 }}>View Final Results →</Box>
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
          {/* Header + Timer */}
          <Box sx={{ bgcolor: timeLeft <= 60 ? P.red.bg : P.orange.bg, border: `2px solid ${timeLeft <= 60 ? P.red.border : P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${timeLeft <= 60 ? P.red.shadow : P.orange.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.orange.shadow }}>{currentSentence.level} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.orange.shadow }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.orange.shadow }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(currentSentenceIndex + 1) / SENTENCES.length * 100} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Rewrite the sentence in past tense. Change the verb to its past form.</Typography>
          </Box>

          {/* Current Sentence */}
          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mb: 3 }}>
            <Box component="span" sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.9rem', fontWeight: 700, color: P.blue.shadow, display: 'inline-block', mb: 2 }}>{currentSentence.level}</Box>
            <Box sx={{ bgcolor: isDark ? '#1a1a2e' : 'white', border: `2px solid ${P.orange.border}`, borderRadius: '12px', p: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>{currentSentence.before}</Typography>
              <TextField value={answers[currentSentence.id] || ''} onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                placeholder={currentSentence.infinitive} variant="outlined" size="medium"
                sx={{ minWidth: 180, '& input': { fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' } }} />
              {currentSentence.after && <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>{currentSentence.after}</Typography>}
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{ ...clayBtn('blue', currentSentenceIndex === 0) }}>← Previous</Box>
            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === SENTENCES.length - 1} sx={{ ...clayBtn('blue', currentSentenceIndex === SENTENCES.length - 1) }}>Next →</Box>
          </Box>

          {/* Progress chips */}
          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>Your Progress:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {SENTENCES.map((sentence, index) => (
                <Box key={sentence.id} component="span" onClick={() => setCurrentSentenceIndex(index)} sx={{
                  bgcolor: answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.bg : P.blue.bg) : (index === currentSentenceIndex ? P.orange.bg : isDark ? '#2a2a3e' : '#e5e7eb'),
                  border: `2px solid ${answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.border : P.blue.border) : (index === currentSentenceIndex ? P.orange.border : '#9ca3af')}`,
                  borderRadius: '999px', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                  color: answers[sentence.id]?.trim() ? (index === currentSentenceIndex ? P.green.shadow : P.blue.shadow) : (index === currentSentenceIndex ? P.orange.shadow : 'text.secondary'),
                  display: 'inline-block',
                }}>L{index + 1}</Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: P.yellow.shadow }}>Answered: {Object.keys(answers).filter(k => answers[k]?.trim()).length} / 6</Typography>
          </Box>

          {/* Submit */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box component="button" onClick={handleSubmitAll} disabled={!allAnswered} sx={{ ...clayBtn('blue', !allAnswered), px: 5, py: 2, fontSize: '1.1rem' }}>
              {allAnswered ? 'Submit All Answers!' : `Answer All First (${Object.keys(answers).filter(k => answers[k]?.trim()).length}/6)`}
            </Box>
          </Box>

          {timeLeft <= 60 && (
            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 2, mt: 3 }}>
              <Typography sx={{ color: P.red.shadow, fontWeight: 700 }}>Hurry! Only {timeLeft} seconds left!</Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
