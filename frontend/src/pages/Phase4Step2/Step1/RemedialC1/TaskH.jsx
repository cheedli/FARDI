import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BuildIcon from '@mui/icons-material/Build'
import ErrorIcon from '@mui/icons-material/Error'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial C1 - Task H: Correction Crusade
 */

const ERROR_SENTENCES = [
  { id: 1, crusader: 'Grammar Detective', avatar: '🔍', before: 'Hashtag campaign', infinitive: 'to be', wrongWord: 'are', after: 'viral.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "Hashtag campaign" requires singular verb "is"' },
  { id: 2, crusader: 'Syntax Fixer', avatar: '🔧', before: 'Caption strategy', infinitive: 'to use', wrongWord: 'use', after: 'emoji.', answer: 'uses', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "Caption strategy" requires third-person singular "uses"' },
  { id: 3, crusader: 'Error Hunter', avatar: '🎯', before: 'Viral content', infinitive: 'to be', wrongWord: 'are', after: 'engaging.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "content" requires singular verb "is"' },
  { id: 4, crusader: 'Correction Master', avatar: '⚡', before: 'Story format', infinitive: 'to be', wrongWord: 'are', after: 'interactive.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "format" requires singular verb "is"' },
  { id: 5, crusader: 'Grammar Guardian', avatar: '🛡️', before: 'Creative tags', infinitive: 'to make', wrongWord: 'makes', after: 'posts memorable.', answer: 'make', errorType: 'Subject-Verb Agreement', concept: 'Plural subject "tags" requires plural verb "make"' },
  { id: 6, crusader: 'Accuracy Champion', avatar: '👑', before: 'Authentic engagement', infinitive: 'to be', wrongWord: 'are', after: 'valuable.', answer: 'is', errorType: 'Subject-Verb Agreement', concept: 'Singular subject "engagement" requires singular verb "is"' }
]

const TIME_LIMIT = 300

export default function Phase4_2RemedialC1TaskH() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 8, context: 'remedial_c1' })
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

  const currentSentence = ERROR_SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || submitted) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else { handleSubmitAll() }
  }, [timeLeft, gameStarted, gameFinished, submitted])

  const handleAnswerChange = (sentenceId, value) => setAnswers({ ...answers, [sentenceId]: value })
  const handleNext = () => { if (currentSentenceIndex < ERROR_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1) }
  const handlePrevious = () => { if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1) }

  const handleSubmitAll = async () => {
    setSubmitted(true)
    const evaluatedResults = ERROR_SENTENCES.map(sentence => {
      const userAnswer = (answers[sentence.id] || '').trim().toLowerCase()
      const correctAnswer = sentence.answer.toLowerCase()
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer
      return { sentenceId: sentence.id, crusader: sentence.crusader, before: sentence.before, wrongWord: sentence.wrongWord, after: sentence.after, userAnswer: answers[sentence.id] || '(No answer provided)', correctAnswer: sentence.answer, isCorrect, errorType: sentence.errorType, concept: sentence.concept }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_remedial_c1_taskH_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'H', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task H: Correction Crusade</Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="Grammar Detective" message="Welcome to Correction Crusade! Hunt down and fix 6 grammar errors in social media sentences. Each sentence has ONE wrong verb that needs correction!" />
            </Box>

            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <BuildIcon sx={{ fontSize: 80, color: P.red.shadow, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.red.shadow }}>Correction Crusade</Typography>
              <Typography variant="h6" sx={{ color: P.red.shadow, mb: 3 }}>Level C1 - Task H: Error Correction</Typography>

              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${P.red.border}`, borderRadius: '12px', p: 3, mb: 2, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.red.shadow, fontWeight: 'bold', mb: 2 }}>Mission Objectives</Typography>
                <Typography variant="body1" sx={{ color: P.red.shadow }}>
                  • Find & Fix Errors: Each sentence has ONE verb that's wrong<br />
                  • Write Correct Form: Use the infinitive hint to conjugate correctly<br />
                  • Time Limit: 5 minutes total<br />
                  • Scoring: +1 for each correct fix (max 6 points)
                </Typography>
              </Box>

              <Box sx={{ bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow, mb: 1 }}>Grammar Focus:</Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                  • Check if the subject is singular or plural<br />
                  • Singular subjects: use "is", "uses", "makes" (with -s/-es)<br />
                  • Plural subjects: use "are", "use", "make" (no -s)
                </Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                display: 'inline-flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><BuildIcon /> Start Correction Crusade</Box>
            </Box>

          </motion.div>
        </Container>
      </Box>
    )
  }

  if (gameFinished && submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.orange.shadow }}>Crusade Complete!</Typography>
            </Box>

            <Box sx={{ bgcolor: score >= 5 ? P.green.bg : score >= 3 ? P.yellow.bg : P.red.bg, border: `2px solid ${score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow, mb: 2 }} />
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow }}>{score} / 6</Typography>
                <Typography variant="h6" sx={{ color: score >= 5 ? P.green.shadow : score >= 3 ? P.yellow.shadow : P.red.shadow }}>Score</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              {results.map((result) => (
                <Box key={result.sentenceId} sx={{
                  bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                  border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                  borderRadius: '20px', boxShadow: `4px 4px 0 ${result.isCorrect ? P.green.shadow : P.red.shadow}`,
                  p: 3, mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: result.isCorrect ? P.green.border : P.red.border }}>
                      {result.isCorrect ? <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'white', fontSize: 20 }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>{result.crusader}</Typography>
                      <Box sx={{ bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px', px: 1.5, py: 0.25, display: 'inline-block', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: P.red.shadow, fontWeight: 700 }}>{result.errorType}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)', borderRadius: '10px', p: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.shadow, mb: 0.5 }}>Original (with error): {result.before} <s>{result.wrongWord}</s> {result.after}</Typography>
                    <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>Your correction: {result.before} <strong>{result.userAnswer}</strong> {result.after}</Typography>
                  </Box>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', borderRadius: '10px', p: 2, mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow, mb: 0.5 }}>Correct: {result.before} {result.correctAnswer} {result.after}</Typography>
                      <Typography variant="caption" sx={{ color: P.blue.shadow }}>{result.concept}</Typography>
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.red.shadow }}>Correction Crusade</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: timeLeft < 60 ? P.red.bg : P.orange.bg, border: `1px solid ${timeLeft < 60 ? P.red.border : P.orange.border}`, borderRadius: '10px', px: 1.5, py: 0.5 }}>
                <TimerIcon sx={{ color: timeLeft < 60 ? P.red.shadow : P.orange.shadow, fontSize: 18 }} />
                <Typography variant="body1" fontWeight="bold" sx={{ color: timeLeft < 60 ? P.red.shadow : P.orange.shadow }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${((currentSentenceIndex + 1) / ERROR_SENTENCES.length) * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: P.red.shadow }}>Sentence {currentSentenceIndex + 1} of {ERROR_SENTENCES.length}</Typography>
              <Typography variant="caption" sx={{ color: P.red.shadow }}>{Math.round(((currentSentenceIndex + 1) / ERROR_SENTENCES.length) * 100)}% Complete</Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.red.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{currentSentence.avatar}</Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: P.red.shadow }}>{currentSentence.crusader}</Typography>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)', border: `1px solid ${P.red.border}`, borderRadius: '8px', px: 1.5, py: 0.25, display: 'inline-block', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: P.red.shadow, fontWeight: 700 }}>{currentSentence.errorType}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '10px', p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon sx={{ color: P.red.shadow, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.red.shadow }}>FIND THE ERROR:</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: P.orange.shadow, fontStyle: 'italic' }}>
                "{currentSentence.before} <s style={{ color: P.red.shadow, fontWeight: 700 }}>{currentSentence.wrongWord}</s> {currentSentence.after}"
              </Typography>
            </Box>

            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.red.border}`, borderRadius: '12px', p: 3 }}>
              <Typography variant="body2" sx={{ color: P.red.shadow, fontWeight: 600, mb: 2 }}>Fix the error - write the correct form:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ color: P.red.shadow }}>"{currentSentence.before}</Typography>
                <TextField
                  value={answers[currentSentence.id] || ''}
                  onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 150,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? 'rgba(34,197,94,0.1)' : P.green.bg,
                      '& fieldset': { borderColor: P.green.border, borderWidth: 2 },
                      '& input': { color: P.green.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: P.red.shadow }}>{currentSentence.after}"</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', boxShadow: currentSentenceIndex === 0 ? 'none' : `3px 3px 0 ${P.red.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.red.shadow, opacity: currentSentenceIndex === 0 ? 0.4 : 1,
              '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.red.shadow}` } : {}
            }}>← Previous</Box>

            {currentSentenceIndex === ERROR_SENTENCES.length - 1 ? (
              <Box component="button" onClick={handleSubmitAll} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>Submit All →</Box>
            ) : (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.red.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, cursor: 'pointer', color: P.red.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.red.shadow}` }
              }}>Next →</Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ERROR_SENTENCES.map((sentence, idx) => {
              const isCurrent = idx === currentSentenceIndex
              const isAnswered = !!answers[sentence.id]
              const btnColor = isCurrent ? P.red : isAnswered ? P.green : P.yellow
              return (
                <Box key={sentence.id} component="button" onClick={() => setCurrentSentenceIndex(idx)} sx={{
                  bgcolor: btnColor.bg, border: `2px solid ${btnColor.border}`, borderRadius: '10px', boxShadow: `2px 2px 0 ${btnColor.shadow}`,
                  px: 2, py: 0.75, fontWeight: 700, cursor: 'pointer', color: btnColor.shadow,
                  '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${btnColor.shadow}` }
                }}>{idx + 1}</Box>
              )
            })}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
