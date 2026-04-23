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
import ExploreIcon from '@mui/icons-material/Explore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial C1 - Task E: Tense Odyssey
 */

const TENSE_SENTENCES = [
  { id: 1, odyssey: 'Odyssey 1', character: 'Social Media Historian', avatar: '📱', before: 'Hashtag for organizing', infinitive: 'to be', answer: 'has been used', tenseType: 'Present Perfect', after: 'since 2007.', concept: 'present perfect for actions started in past and continuing' },
  { id: 2, odyssey: 'Odyssey 2', character: 'Content Strategist', avatar: '✍️', before: 'Caption engagement', infinitive: 'to increase', answer: 'increased', tenseType: 'Simple Past', after: 'last quarter.', concept: 'simple past for completed action in specific past time' },
  { id: 3, odyssey: 'Odyssey 3', character: 'Emoji Expert', avatar: '😊', before: 'Emoji make posts', infinitive: 'to become', answer: 'have become', tenseType: 'Present Perfect', after: 'more expressive.', concept: 'present perfect for change over time' },
  { id: 4, odyssey: 'Odyssey 4', character: 'Viral Campaign Manager', avatar: '🚀', before: 'Viral content spread', infinitive: 'to be', answer: 'was', tenseType: 'Simple Past', after: 'key in 2023 campaign.', concept: 'simple past for historical specific event' },
  { id: 5, odyssey: 'Odyssey 5', character: 'Influencer Analyst', avatar: '⭐', before: 'Tag strategy boost reach', infinitive: 'to help', answer: 'has always helped', tenseType: 'Present Perfect', after: 'influencers grow.', concept: 'present perfect with "always" for ongoing truth' },
  { id: 6, odyssey: 'Odyssey 6', character: 'Engagement Specialist', avatar: '💬', before: 'Story format is interactive', infinitive: 'to remain', answer: 'remains', tenseType: 'Simple Present', after: 'popular today.', concept: 'simple present for current truth/fact' }
]

const TIME_LIMIT = 300

export default function Phase4_2RemedialC1TaskE() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 5, context: 'remedial_c1' })
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
      const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswer.replace(' ', '') || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)
      return { sentenceId: sentence.id, odyssey: sentence.odyssey, character: sentence.character, avatar: sentence.avatar, userAnswer: answers[sentence.id] || '', correctAnswer: sentence.answer, tenseType: sentence.tenseType, isCorrect, fullSentence: `${sentence.before} ${sentence.answer} ${sentence.after}` }
    })
    setResults(evaluatedResults)
    const totalScore = evaluatedResults.filter(r => r.isCorrect).length
    setScore(totalScore)
    sessionStorage.setItem('phase4_2_remedial_c1_taskE_score', totalScore)
    await logTaskCompletion(totalScore)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskE', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'E', score: finalScore, max_score: 6, completed: true })
      })
    } catch (error) { console.error('Failed to log task completion:', error) }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allAnswered = TENSE_SENTENCES.every(s => answers[s.id]?.trim())
  const answeredCount = Object.keys(answers).filter(key => answers[key]?.trim()).length

  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task E: Tense Odyssey</Typography>
              <Typography variant="body1" sx={{ color: P.orange.shadow, mt: 1 }}>Mixed tenses grammar exercise - Master verb tenses with social media contexts!</Typography>
            </Box>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
              <CharacterMessage character="MS. MABROUKI" message="Welcome to Tense Odyssey! Embark on a journey through different verb tenses with social media terms. Complete 6 sentences using the correct tense. Each correct tense = 1 point. Total: 6 points! Ready to navigate through time?" />
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <ExploreIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: P.purple.shadow }}>Tense Odyssey</Typography>
              <Typography variant="h6" sx={{ color: P.purple.shadow, mb: 3 }}>6 Odysseys · Mixed Tenses · 5 Minutes · Navigate Through Time!</Typography>

              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${P.purple.border}`, borderRadius: '12px', p: 3, mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold', mb: 2 }}>Grammar Focus: Mixed Tenses</Typography>
                <Typography variant="body1" sx={{ color: P.purple.shadow }}>
                  <strong>Tenses You'll Use:</strong><br />
                  • <strong>Present Perfect:</strong> has/have + past participle (for ongoing or recent actions)<br />
                  • <strong>Simple Past:</strong> verb + -ed (for completed actions)<br />
                  • <strong>Simple Present:</strong> base verb (for facts/routines)<br /><br />
                  <strong>Context Clues:</strong><br />
                  • "since 2007" → Present Perfect · "last quarter" → Simple Past · "today" → Simple Present
                </Typography>
              </Box>

              <Box component="button" onClick={() => setGameStarted(true)} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 6, py: 2, fontWeight: 700, fontSize: '1.3rem', cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}>START ODYSSEY!</Box>
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
              <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task E: Tense Odyssey - Results</Typography>
            </Box>

            <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3, textAlign: 'center' }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: P.purple.shadow, mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: P.purple.shadow }}>
                {score === 6 ? 'Odyssey Mastered!' : 'Odyssey Complete!'}
              </Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: '16px', p: 3, maxWidth: 250, mx: 'auto', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: P.purple.shadow }}>{score} / 6</Typography>
                <Typography variant="h6" sx={{ color: P.purple.shadow }}>Correct Tenses</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              {results.map((result, index) => (
                <Box key={result.sentenceId} sx={{
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
                          <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{result.odyssey}</Typography>
                        </Box>
                        <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', px: 1.5, py: 0.5 }}>
                          <Typography variant="caption" sx={{ color: P.blue.shadow, fontWeight: 700 }}>{result.tenseType}</Typography>
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
                    <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow, mb: 0.5 }}>Correct: "{result.fullSentence}"</Typography>
                    <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>Your answer: "{TENSE_SENTENCES[index].before} <strong>{result.userAnswer || '(no answer)'}</strong> {TENSE_SENTENCES[index].after}"</Typography>
                  </Box>

                  {!result.isCorrect && (
                    <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '10px', p: 2, mt: 1 }}>
                      <Typography variant="body2" sx={{ color: P.blue.shadow }}><strong>Remember:</strong> {TENSE_SENTENCES[index].concept}</Typography>
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
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow }}>{currentSentence.odyssey} / 6</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow }} />
                <Typography variant="h6" sx={{ color: timeLeft <= 60 ? P.red.shadow : P.purple.shadow, fontWeight: timeLeft <= 60 ? 'bold' : 'normal' }}>{formatTime(timeLeft)}</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(currentSentenceIndex + 1) / TENSE_SENTENCES.length * 100}%`, bgcolor: P.green.border, borderRadius: '4px', transition: 'width 0.3s' }} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Fill in the blank with the correct verb tense. Navigate between odysseys using the arrows below.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem' }}>{currentSentence.avatar}</Box>
              <Box>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)', border: `1px solid ${P.purple.border}`, borderRadius: '8px', px: 1.5, py: 0.5, display: 'inline-block', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: P.purple.shadow, fontWeight: 700 }}>{currentSentence.odyssey}</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: P.purple.shadow, fontWeight: 'bold' }}>{currentSentence.character} says:</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `2px solid ${P.purple.border}`, borderRadius: '12px', p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>"{currentSentence.before}</Typography>
                <TextField
                  value={answers[currentSentence.id] || ''}
                  onChange={(e) => handleAnswerChange(currentSentence.id, e.target.value)}
                  placeholder={currentSentence.infinitive}
                  variant="outlined"
                  sx={{
                    minWidth: 220,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? 'rgba(139,92,246,0.1)' : '#F5F3FF',
                      '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                      '& input': { color: P.purple.shadow, fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }
                    }
                  }}
                />
                <Typography variant="h5" sx={{ color: P.purple.shadow }}>{currentSentence.after}"</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box component="button" onClick={handlePrevious} disabled={currentSentenceIndex === 0} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: currentSentenceIndex === 0 ? 'none' : `3px 3px 0 ${P.purple.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '0.9rem', cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: currentSentenceIndex === 0 ? 0.4 : 1,
              '&:hover': currentSentenceIndex > 0 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>← Previous Odyssey</Box>
            <Box component="button" onClick={handleNext} disabled={currentSentenceIndex === TENSE_SENTENCES.length - 1} sx={{
              bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '12px', boxShadow: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'none' : `3px 3px 0 ${P.purple.shadow}`,
              px: 3, py: 1.5, fontWeight: 700, fontSize: '0.9rem', cursor: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 'not-allowed' : 'pointer',
              color: P.purple.shadow, opacity: currentSentenceIndex === TENSE_SENTENCES.length - 1 ? 0.4 : 1,
              '&:hover': currentSentenceIndex < TENSE_SENTENCES.length - 1 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.purple.shadow}` } : {}
            }}>Next Odyssey →</Box>
          </Box>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: P.yellow.shadow }}>Odyssey Progress:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {TENSE_SENTENCES.map((sentence, index) => {
                const isAnswered = !!answers[sentence.id]?.trim()
                const isCurrent = index === currentSentenceIndex
                const btnColor = isAnswered ? (isCurrent ? P.green : P.purple) : (isCurrent ? P.orange : P.yellow)
                return (
                  <Box key={sentence.id} component="button" onClick={() => setCurrentSentenceIndex(index)} sx={{
                    bgcolor: btnColor.bg, border: `2px solid ${btnColor.border}`, borderRadius: '10px', boxShadow: `2px 2px 0 ${btnColor.shadow}`,
                    px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: btnColor.shadow,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${btnColor.shadow}` }
                  }}>{sentence.avatar} O{index + 1}</Box>
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
            }}>{allAnswered ? 'Complete Odyssey!' : `Answer All First (${answeredCount}/6)`}</Box>
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
