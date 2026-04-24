import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, TextField, LinearProgress, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { CheckCircle, Cancel, Edit } from '@mui/icons-material'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A1 - Task C: Sentence Builder
 * Form 6 simple sentences using advertising terms
 * Score: +1 for each correct sentence (6 total)
 */

const SENTENCE_PROMPTS = [
  { term: 'promotional', hint: 'The ad is ___.', correctAnswer: 'The ad is promotional.', alternativeAnswers: ['The ad is promotional', 'Ad is promotional.', 'Ad is promotional'] },
  { term: 'persuasive', hint: 'Ad is ___.', correctAnswer: 'Ad is persuasive.', alternativeAnswers: ['The ad is persuasive.', 'The ad is persuasive', 'Ad is persuasive'] },
  { term: 'targeted', hint: 'Group is ___.', correctAnswer: 'Group is targeted.', alternativeAnswers: ['The group is targeted.', 'The group is targeted', 'Group is targeted'] },
  { term: 'original', hint: 'Idea is ___.', correctAnswer: 'Idea is original.', alternativeAnswers: ['The idea is original.', 'The idea is original', 'Idea is original'] },
  { term: 'creative', hint: 'Be ___.', correctAnswer: 'Be creative.', alternativeAnswers: ['Be creative'] },
  { term: 'dramatisation', hint: 'Video has ___.', correctAnswer: 'Video has dramatisation.', alternativeAnswers: ['The video has dramatisation.', 'The video has dramatisation', 'Video has dramatisation'] }
]

export default function RemedialA1TaskC() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/a2/taskA') }, [])
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 3, context: 'remedial_a1' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(SENTENCE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [finalScore, setFinalScore] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0, passed: false })

  const currentPrompt = SENTENCE_PROMPTS[currentIndex]

  const handleAnswerChange = (value) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < SENTENCE_PROMPTS.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const checkAnswer = (userAnswer, prompt) => {
    const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '')
    const termNormalized = prompt.term.toLowerCase()
    const hasTermOrClose = (text, term) => {
      if (text.includes(term)) return true
      const words = text.split(' ')
      for (const word of words) {
        if (Math.abs(word.length - term.length) <= 2) {
          let matches = 0
          const minLen = Math.min(word.length, term.length)
          for (let i = 0; i < minLen; i++) {
            if (word[i] === term[i]) matches++
          }
          if (matches >= minLen * 0.8) return true
        }
      }
      return false
    }
    const containsTerm = hasTermOrClose(normalized, termNormalized)
    const hasVerb = normalized.includes('is') || normalized.includes('be') ||
                    normalized.includes('has') || normalized.includes('are')
    const wordCount = normalized.split(' ').length
    const isSimple = wordCount >= 3 && wordCount <= 10
    return containsTerm && hasVerb && isSimple
  }

  const handleSubmit = async () => {
    const sentences = userAnswers.map((answer, index) => ({
      term: SENTENCE_PROMPTS[index].term,
      hint: SENTENCE_PROMPTS[index].hint,
      userAnswer: answer,
      correctAnswer: SENTENCE_PROMPTS[index].correctAnswer
    }))
    try {
      const response = await fetch('/api/phase4/evaluate-simple-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sentences })
      })
      const data = await response.json()
      if (data.success && data.results) {
        const checkResults = data.results.map((result, index) => ({
          userAnswer: userAnswers[index],
          correctAnswer: SENTENCE_PROMPTS[index].correctAnswer,
          isCorrect: result.isCorrect
        }))
        setResults(checkResults)
        const correctCount = checkResults.filter(r => r.isCorrect).length
        setScore(correctCount)
        setSubmitted(true)
        sessionStorage.setItem('remedial_step3_a1_taskC_score', correctCount)
        await logTaskCompletion(correctCount)
      } else {
        await handleSubmitLocal()
      }
    } catch (error) {
      console.error('AI evaluation error:', error)
      await handleSubmitLocal()
    }
  }

  const handleSubmitLocal = async () => {
    const checkResults = userAnswers.map((answer, index) => ({
      userAnswer: answer,
      correctAnswer: SENTENCE_PROMPTS[index].correctAnswer,
      isCorrect: checkAnswer(answer, SENTENCE_PROMPTS[index])
    }))
    setResults(checkResults)
    const correctCount = checkResults.filter(r => r.isCorrect).length
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('remedial_step3_a1_taskC_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskC', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'C', step: 2, score: score, max_score: SENTENCE_PROMPTS.length, completed: true })
      })
      const data = await response.json()
      if (data.success) console.log('Step 3 Task C completion logged to backend')
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_step3_a1_taskC_score') || '0')
    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= 18
    let nextUrl = passed ? '/phase4/step/4' : '/phase4/step3/remedial/a1/taskA'

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 2 - REMEDIAL A1 - FINAL RESULTS')
    console.log('Task A (Term Treasure Hunt):', taskAScore, '/8')
    console.log('Task B (Fill Quest):', taskBScore, '/8')
    console.log('Task C (Sentence Builder):', taskCScore, '/6')
    console.log('TOTAL SCORE:', totalScore, '/22')
    console.log('='.repeat(60) + '\n')

    try {
      const response = await fetch('/api/phase4/step3/remedial/a1/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore })
      })
      const data = await response.json()
      if (data?.success && data?.data?.next_url) {
        nextUrl = data.data.next_url.replace(/^\/app/, '')
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setFinalScore({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total: totalScore, passed })
    setShowFinalResults(true)

    setTimeout(() => {
      sessionStorage.removeItem('remedial_step3_a1_taskA_score')
      sessionStorage.removeItem('remedial_step3_a1_taskB_score')
      sessionStorage.removeItem('remedial_step3_a1_taskC_score')
      navigate(nextUrl)
    }, 5000)
  }

  const progress = ((currentIndex + 1) / SENTENCE_PROMPTS.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4 - Step 3: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Level A1 - Task C: Sentence Builder
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Build simple sentences using advertising terms! Stack sentences like blocks - correct grammar stacks higher!
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              character="MS. MABROUKI"
              message="Great work on the Fill Quest! Now let's build sentences! You need to write 6 simple sentences using the advertising terms. Look at each hint and write a complete sentence. Remember: use present simple tense (is, has, be). Don't worry about small spelling mistakes - focus on making clear, simple sentences!"
            />
          </Box>

          {!submitted ? (
            <Box>
              {/* Progress Bar */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 2, mb: 3,
              }}>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }} gutterBottom>
                  Sentence {currentIndex + 1} of {SENTENCE_PROMPTS.length}
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{
                  mb: 1, borderRadius: '4px',
                  '& .MuiLinearProgress-bar': { backgroundColor: P.yellow.shadow }
                }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {SENTENCE_PROMPTS.map((_, idx) => (
                    <Box key={idx} sx={{
                      width: '100%', height: 8, borderRadius: 1,
                      backgroundColor: idx < currentIndex ? P.green.shadow :
                                      idx === currentIndex ? P.blue.shadow : 'grey.300'
                    }} />
                  ))}
                </Box>
              </Box>

              {/* Current Sentence Builder */}
              <Box sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                p: 4, mb: 3,
              }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.orange.shadow }} gutterBottom>
                    Term: <strong>{currentPrompt.term}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ color: P.orange.shadow, opacity: 0.8 }} gutterBottom>
                    Hint: {currentPrompt.hint}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Write your sentence here"
                    placeholder="Type a simple sentence using the term..."
                    value={userAnswers[currentIndex]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    multiline
                    rows={2}
                    InputProps={{ startAdornment: <Edit sx={{ mr: 1, color: 'action.disabled' }} /> }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '& fieldset': { borderColor: P.orange.border },
                        '&:hover fieldset': { borderColor: P.orange.shadow },
                        '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                      }
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box component="button" onClick={handlePrevious} disabled={currentIndex === 0} sx={{
                    bgcolor: currentIndex === 0 ? 'grey.200' : P.blue.bg,
                    border: `2px solid ${currentIndex === 0 ? '#ccc' : P.blue.border}`,
                    borderRadius: '12px',
                    boxShadow: currentIndex === 0 ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                    px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    color: currentIndex === 0 ? 'grey.500' : P.blue.shadow,
                    '&:hover': currentIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                    '&:active': currentIndex === 0 ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                  }}>
                    ← Previous
                  </Box>

                  {currentIndex < SENTENCE_PROMPTS.length - 1 ? (
                    <Box component="button" onClick={handleNext} disabled={!userAnswers[currentIndex]} sx={{
                      bgcolor: !userAnswers[currentIndex] ? 'grey.200' : P.blue.bg,
                      border: `2px solid ${!userAnswers[currentIndex] ? '#ccc' : P.blue.border}`,
                      borderRadius: '12px',
                      boxShadow: !userAnswers[currentIndex] ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer',
                      color: !userAnswers[currentIndex] ? 'grey.500' : P.blue.shadow,
                      '&:hover': !userAnswers[currentIndex] ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                      '&:active': !userAnswers[currentIndex] ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
                    }}>
                      Next →
                    </Box>
                  ) : (
                    <Box component="button" onClick={handleSubmit} disabled={userAnswers.some(answer => !answer)} sx={{
                      bgcolor: userAnswers.some(answer => !answer) ? 'grey.200' : P.green.bg,
                      border: `2px solid ${userAnswers.some(answer => !answer) ? '#ccc' : P.green.border}`,
                      borderRadius: '12px',
                      boxShadow: userAnswers.some(answer => !answer) ? 'none' : `3px 3px 0 ${P.green.shadow}`,
                      px: 3, py: 1, fontWeight: 700, fontSize: '0.9rem',
                      cursor: userAnswers.some(answer => !answer) ? 'not-allowed' : 'pointer',
                      color: userAnswers.some(answer => !answer) ? 'grey.500' : P.green.shadow,
                      '&:hover': userAnswers.some(answer => !answer) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                      '&:active': userAnswers.some(answer => !answer) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                    }}>
                      Submit All Sentences
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Quick Navigation */}
              <Box sx={{
                bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                p: 2,
              }}>
                <Typography variant="body2" sx={{ color: P.purple.shadow }} gutterBottom>
                  Jump to sentence:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SENTENCE_PROMPTS.map((prompt, idx) => (
                    <Box key={idx} component="button" onClick={() => setCurrentIndex(idx)} sx={{
                      bgcolor: idx === currentIndex ? P.purple.shadow : P.purple.bg,
                      border: `2px solid ${P.purple.border}`,
                      borderRadius: '8px',
                      px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.8rem', minWidth: 40,
                      cursor: 'pointer',
                      color: idx === currentIndex ? 'white' : P.purple.shadow,
                      '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `2px 2px 0 ${P.purple.shadow}` },
                    }}>
                      {idx + 1} {userAnswers[idx] && '✓'}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : !showFinalResults ? (
            <Box>
              {/* Results */}
              <Box sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                p: 4, mb: 3, textAlign: 'center',
              }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                  {score === SENTENCE_PROMPTS.length ? 'Perfect Builder!' : 'Good Work!'}
                </Typography>
                <Typography variant="h6" sx={{ color: P.green.shadow }}>
                  You scored {score} out of {SENTENCE_PROMPTS.length} points!
                </Typography>
              </Box>

              {/* Answer Review */}
              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
                p: 3, mb: 3,
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
                  Sentence Review:
                </Typography>
                <Stack spacing={2}>
                  {results.map((result, index) => (
                    <Box key={index} sx={{
                      bgcolor: result.isCorrect ? P.green.bg : P.red.bg,
                      border: `2px solid ${result.isCorrect ? P.green.border : P.red.border}`,
                      borderRadius: '12px', p: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {result.isCorrect
                          ? <CheckCircle sx={{ color: P.green.shadow, fontSize: 18 }} />
                          : <Cancel sx={{ color: P.red.shadow, fontSize: 18 }} />}
                        <Typography variant="body2" fontWeight="bold" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                          Sentence {index + 1} ({SENTENCE_PROMPTS[index].term}):
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: result.isCorrect ? P.green.shadow : P.red.shadow }}>
                        Your answer: "{result.userAnswer}"
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="caption" sx={{ color: P.red.shadow, opacity: 0.8, display: 'block', mt: 0.5 }}>
                          Correct example: <strong>{result.correctAnswer}</strong>
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  View Final Results
                </Box>
              </Stack>
            </Box>
          ) : (
            /* Final Results - Pass/Fail */
            <Box sx={{
              bgcolor: finalScore.passed ? P.green.bg : P.orange.bg,
              border: `2px solid ${finalScore.passed ? P.green.border : P.orange.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${finalScore.passed ? P.green.shadow : P.orange.shadow}`,
              p: 5, textAlign: 'center',
            }}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                {finalScore.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Phase 4 Step 3 - Remedial A1 - Final Results
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Task A (Term Treasure Hunt): {finalScore.taskA} / 8
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Task B (Fill Quest): {finalScore.taskB} / 8
                </Typography>
                <Typography variant="h6" sx={{ color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Task C (Sentence Builder): {finalScore.taskC} / 6
                </Typography>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                  Total Score: {finalScore.total} / 22
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.orange.shadow, opacity: 0.8 }}>
                  Pass Threshold: 18 / 22
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.orange.shadow }}>
                {finalScore.passed ? 'You have passed Step 3 Remedial A1!' : 'Score below passing threshold'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: finalScore.passed ? P.green.shadow : P.orange.shadow, opacity: 0.8 }}>
                {finalScore.passed ? 'Proceeding to dashboard...' : 'Restarting Step 3 Remedial A1 to help you improve...'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 3, color: finalScore.passed ? P.green.shadow : P.orange.shadow, opacity: 0.7 }}>
                Redirecting in 5 seconds...
              </Typography>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
