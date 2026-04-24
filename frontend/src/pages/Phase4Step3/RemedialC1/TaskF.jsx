import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial C1 - Task F: Clause Conquest
 * Advanced writing grammar - Fill in blanks to complete 6 complex sentences with passive/relative clauses
 * Inspired by British Council relative clauses exercises
 * Score: +1 for each correct sentence with proper relative clause structure (6 total)
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const CLAUSE_SENTENCES = [
  {
    id: 1,
    conquest: 'Conquest 1',
    character: 'Grammar Knight',
    avatar: '⚔️',
    sentenceParts: [
      { type: 'text', content: 'Promotional,' },
      { type: 'blank', id: 'clause', placeholder: 'to design' },
      { type: 'text', content: ', in ads.' }
    ],
    concept: 'Non-defining relative clause with "which" + passive voice',
    expectedAnswer: 'which is designed to sell'
  },
  {
    id: 2,
    conquest: 'Conquest 2',
    character: 'Syntax Warrior',
    avatar: '🛡️',
    sentenceParts: [
      { type: 'text', content: 'Persuasive techniques' },
      { type: 'blank', id: 'clause', placeholder: 'to employ' },
      { type: 'text', content: ' convince.' }
    ],
    concept: 'Defining relative clause with "that" + passive voice',
    expectedAnswer: 'that are employed effectively'
  },
  {
    id: 3,
    conquest: 'Conquest 3',
    character: 'Clause Champion',
    avatar: '🏆',
    sentenceParts: [
      { type: 'text', content: 'Targeted ads' },
      { type: 'blank', id: 'clause', placeholder: 'to focus' },
      { type: 'text', content: ' increase relevance.' }
    ],
    concept: 'Non-defining relative clause with "which" + active voice',
    expectedAnswer: 'which focus on groups'
  },
  {
    id: 4,
    conquest: 'Conquest 4',
    character: 'Structure Master',
    avatar: '🎯',
    sentenceParts: [
      { type: 'text', content: 'Original ideas' },
      { type: 'blank', id: 'clause', placeholder: 'to create' },
      { type: 'text', content: ' stand out.' }
    ],
    concept: 'Defining relative clause with "that" + passive voice',
    expectedAnswer: 'that are created freshly'
  },
  {
    id: 5,
    conquest: 'Conquest 5',
    character: 'Grammar Guardian',
    avatar: '👑',
    sentenceParts: [
      { type: 'text', content: 'Creative campaigns' },
      { type: 'blank', id: 'clause', placeholder: 'to develop' },
      { type: 'text', content: ' memorable.' }
    ],
    concept: 'Non-defining relative clause with "which" + present perfect passive',
    expectedAnswer: 'which have been developed'
  },
  {
    id: 6,
    conquest: 'Conquest 6',
    character: 'Clause Conqueror',
    avatar: '🏅',
    sentenceParts: [
      { type: 'text', content: 'Dramatisation' },
      { type: 'blank', id: 'clause', placeholder: 'to tell' },
      { type: 'text', content: ' engages.' }
    ],
    concept: 'Preposition + "which" relative clause + passive voice',
    expectedAnswer: 'by which stories are told'
  }
]

const TIME_LIMIT = 420

export default function RemedialC1TaskF() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4/step3/remedial/c1/taskG') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 6, context: 'remedial_c1' })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)

  const currentClause = CLAUSE_SENTENCES[currentSentenceIndex]

  useEffect(() => {
    if (!gameStarted || gameFinished || evaluating) return
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, evaluating])

  const handleAnswerChange = (sentenceId, blankId, value) => {
    setAnswers({ ...answers, [`${sentenceId}_${blankId}`]: value })
  }

  const handleNext = () => {
    if (currentSentenceIndex < CLAUSE_SENTENCES.length - 1) setCurrentSentenceIndex(currentSentenceIndex + 1)
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) setCurrentSentenceIndex(currentSentenceIndex - 1)
  }

  const handleSubmitAll = async () => {
    setEvaluating(true)
    const sentences = CLAUSE_SENTENCES.map(clause => {
      let completeSentence = ''
      let studentAnswer = ''
      clause.sentenceParts.forEach(part => {
        if (part.type === 'text') {
          completeSentence += part.content
        } else if (part.type === 'blank') {
          const answer = answers[`${clause.id}_${part.id}`] || ''
          studentAnswer = answer.trim()
          completeSentence += ` ${answer} `
        }
      })
      return {
        sentenceId: clause.id,
        conquest: clause.conquest,
        character: clause.character,
        completeSentence: completeSentence.replace(/\s+/g, ' ').trim(),
        studentAnswer,
        concept: clause.concept
      }
    })

    const preValidatedSentences = sentences.map(sent => {
      const answer = sent.studentAnswer.toLowerCase()
      const hasRelativePronoun = answer.includes('which') || answer.includes('that') || answer.includes('who') || answer.includes('whom') || answer.includes('whose')
      const isNotJustInfinitive = !answer.match(/^to\s+\w+$/)
      const isNotEmpty = answer.length > 0
      return { ...sent, passesPreValidation: hasRelativePronoun && isNotJustInfinitive && isNotEmpty }
    })

    try {
      const response = await fetch('/api/phase4/step3/remedial/c1/evaluate-clauses-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sentences: preValidatedSentences.map(s => ({
            sentenceId: s.sentenceId,
            sentence: s.completeSentence,
            concept: s.concept
          }))
        })
      })
      const data = await response.json()
      if (data.success && data.results) {
        const evaluatedResults = preValidatedSentences.map((sent, index) => {
          if (!sent.passesPreValidation) {
            let feedbackMsg = 'Missing relative clause.'
            if (sent.studentAnswer.length === 0) feedbackMsg = 'Blank not filled. Please add a relative clause with "which", "that", or "by which".'
            else if (sent.studentAnswer.match(/^to\s+\w+$/)) feedbackMsg = 'You only wrote the infinitive. You need to create a full relative clause (e.g., "which is designed...").'
            else feedbackMsg = 'Missing relative pronoun. Your clause must include "which", "that", or another relative pronoun.'
            return { ...sent, score: 0, feedback: feedbackMsg }
          }
          return { ...sent, score: data.results[index]?.score || 0, feedback: data.results[index]?.feedback || 'Good effort!' }
        })
        setResults(evaluatedResults)
        const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
        setScore(totalScore)
        sessionStorage.setItem('remedial_step3_c1_taskF_score', totalScore)
        await logTaskCompletion(totalScore)
      } else {
        throw new Error('Batch evaluation failed')
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const evaluatedResults = preValidatedSentences.map(sent => {
        if (!sent.passesPreValidation) {
          let feedbackMsg = 'Missing relative clause.'
          if (sent.studentAnswer.length === 0) feedbackMsg = 'Blank not filled. Please add a relative clause.'
          else if (sent.studentAnswer.match(/^to\s+\w+$/)) feedbackMsg = 'You only wrote the infinitive. You need a full relative clause.'
          else feedbackMsg = 'Missing relative pronoun (which, that, etc.).'
          return { ...sent, score: 0, feedback: feedbackMsg }
        }
        return { ...sent, score: 0, feedback: 'Unable to evaluate. Please check your grammar and try again.' }
      })
      setResults(evaluatedResults)
      const totalScore = evaluatedResults.reduce((sum, r) => sum + r.score, 0)
      setScore(totalScore)
      sessionStorage.setItem('remedial_step3_c1_taskF_score', totalScore)
      await logTaskCompletion(totalScore)
    }
    setEvaluating(false)
    setGameFinished(true)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: 4, step: 2, level: 'C1', task: 'F', score: finalScore, maxScore: 6, timestamp: new Date().toISOString() })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  // Start screen
  if (!gameStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('orange'), textAlign: 'center', mb: 3 }}>
              <AccountTreeIcon sx={{ fontSize: 64, color: P.orange.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: P.orange.border, mb: 1 }}>
                ⚔️ Clause Conquest
              </Typography>
              <Typography variant="h6" sx={{ color: P.orange.shadow, mb: 3 }}>
                Level C1 - Task F: Advanced Grammar
              </Typography>
            </Box>

            <Box sx={{ ...cardSx('blue'), mb: 3 }}>
              <CharacterMessage character="Grammar Knight" avatar="⚔️" direction="left">
                Complete 6 complex sentences by filling in the blanks. Use advanced grammar structures with relative clauses and passive voice!
              </CharacterMessage>
            </Box>

            <Box sx={{ ...cardSx('purple'), mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: P.purple.border, mb: 2 }}>
                Mission Objectives
              </Typography>
              <Stack spacing={1.5}>
                <Typography sx={{ color: P.purple.shadow }}><strong>Fill in Blanks:</strong> Complete each sentence with appropriate words</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Grammar Focus:</strong> Relative clauses (which, that) and passive voice</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Time Limit:</strong> 7 minutes total</Typography>
                <Typography sx={{ color: P.purple.shadow }}><strong>Scoring:</strong> +1 for each correct sentence (max 6 points)</Typography>
              </Stack>
            </Box>

            <Box
              component="button"
              onClick={() => setGameStarted(true)}
              sx={{
                ...cardSx('orange'),
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                color: P.orange.shadow,
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` }
              }}
            >
              <AccountTreeIcon /> Start Clause Conquest
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && !evaluating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(score >= 5 ? 'green' : score >= 3 ? 'yellow' : 'red'), textAlign: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: P.yellow.border, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Conquest Complete!</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: score >= 5 ? P.green.border : score >= 3 ? P.yellow.border : P.red.border }}>
                Score: {score}/6
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {results.map((result) => (
                <Box key={result.sentenceId} sx={cardSx(result.score >= 1 ? 'green' : 'red')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ fontSize: '1.5rem' }}>{result.score >= 1 ? '✅' : '❌'}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {result.conquest} - {result.character}
                      </Typography>
                      <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {result.concept}
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Your Sentence:</Typography>
                  <Typography sx={{ fontWeight: 500, mb: 1 }}>{result.completeSentence}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Feedback:</Typography>
                  <Typography variant="body2">{result.feedback}</Typography>
                </Box>
              ))}
            </Stack>

            <Box
              component="button"
              onClick={() => navigate('/phase4/step3/remedial/c1/taskG')}
              sx={{
                ...cardSx('blue'),
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
              }}
            >
              Next Task: Grammar Guardian →
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Game screen
  const progress = ((currentSentenceIndex + 1) / CLAUSE_SENTENCES.length) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: P.orange.border }}>
                ⚔️ Clause Conquest
              </Typography>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: timeLeft < 60 ? P.red.bg : P.blue.bg,
                border: `2px solid ${timeLeft < 60 ? P.red.border : P.blue.border}`,
                borderRadius: '12px', px: 2, py: 0.5,
                color: timeLeft < 60 ? P.red.border : P.blue.border,
                fontWeight: 700
              }}>
                <TimerIcon fontSize="small" /> {formatTime(timeLeft)}
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 2, bgcolor: P.orange.bg, '& .MuiLinearProgress-bar': { bgcolor: P.orange.border, borderRadius: 2 } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Conquest {currentSentenceIndex + 1} of {CLAUSE_SENTENCES.length}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{Math.round(progress)}% Complete</Typography>
            </Box>
          </Box>

          {/* Current Sentence */}
          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ fontSize: '2.5rem' }}>{currentClause.avatar}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentClause.character}</Typography>
                <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {currentClause.conquest}
                </Box>
              </Box>
            </Box>

            <Box sx={{ ...cardSx('purple'), mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>Fill in the blanks to complete the sentence:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                {currentClause.sentenceParts.map((part, idx) => (
                  <Box key={idx} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {part.type === 'text' ? (
                      <Typography variant="h6" sx={{ fontWeight: 500, display: 'inline' }}>{part.content}</Typography>
                    ) : (
                      <TextField
                        value={answers[`${currentClause.id}_${part.id}`] || ''}
                        onChange={(e) => handleAnswerChange(currentClause.id, part.id, e.target.value)}
                        placeholder={part.placeholder}
                        variant="outlined"
                        fullWidth
                        sx={{
                          minWidth: 300, flex: 1,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: P.purple.bg,
                            '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                            '&:hover fieldset': { borderColor: P.purple.shadow },
                            '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                            '& input': { fontWeight: 600, fontSize: '1.1rem', padding: '12px 14px' },
                          }
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ mt: 2, display: 'block', color: P.purple.shadow }}>
                Grammar Concept: {currentClause.concept}
              </Typography>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              component="button"
              onClick={handlePrevious}
              disabled={currentSentenceIndex === 0}
              sx={{
                ...cardSx('teal'),
                cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSentenceIndex === 0 ? 0.5 : 1,
                fontWeight: 700, px: 3,
                '&:hover': currentSentenceIndex === 0 ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` }
              }}
            >
              ← Previous
            </Box>

            {currentSentenceIndex === CLAUSE_SENTENCES.length - 1 ? (
              <Box
                component="button"
                onClick={handleSubmitAll}
                disabled={evaluating}
                sx={{
                  ...cardSx('green'),
                  cursor: evaluating ? 'not-allowed' : 'pointer',
                  fontWeight: 700, px: 4,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }
                }}
              >
                {evaluating ? 'Evaluating...' : 'Submit All →'}
              </Box>
            ) : (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...cardSx('blue'),
                  cursor: 'pointer',
                  fontWeight: 700, px: 4,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` }
                }}
              >
                Next →
              </Box>
            )}
          </Box>

          {/* Progress indicator */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {CLAUSE_SENTENCES.map((clause, idx) => {
              const hasBlanks = clause.sentenceParts.filter(p => p.type === 'blank')
              const filledBlanks = hasBlanks.filter(b => answers[`${clause.id}_${b.id}`]?.trim())
              const isComplete = filledBlanks.length === hasBlanks.length
              const color = idx === currentSentenceIndex ? 'blue' : isComplete ? 'green' : 'yellow'
              return (
                <Box
                  key={clause.id}
                  component="button"
                  onClick={() => setCurrentSentenceIndex(idx)}
                  sx={{
                    ...cardSx(color),
                    width: 40, height: 40, p: 0,
                    cursor: 'pointer', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P[color].shadow}` }
                  }}
                >
                  {idx + 1}
                </Box>
              )
            })}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
