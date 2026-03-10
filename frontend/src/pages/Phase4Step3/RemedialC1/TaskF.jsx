import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Chip, LinearProgress, Avatar } from '@mui/material'
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

const TIME_LIMIT = 420 // 7 minutes for all 6 sentences

export default function RemedialC1TaskF() {
  const navigate = useNavigate()
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

  // Timer
  useEffect(() => {
    if (!gameStarted || gameFinished || evaluating) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up! Auto-submit
      handleSubmitAll()
    }
  }, [timeLeft, gameStarted, gameFinished, evaluating])

  const handleAnswerChange = (sentenceId, blankId, value) => {
    setAnswers({
      ...answers,
      [`${sentenceId}_${blankId}`]: value
    })
  }

  const handleNext = () => {
    if (currentSentenceIndex < CLAUSE_SENTENCES.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1)
    }
  }

  const handleSubmitAll = async () => {
    setEvaluating(true)

    // Build complete sentences from blanks
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
        studentAnswer: studentAnswer,
        concept: clause.concept
      }
    })

    // Pre-validate: Check if answers contain relative pronouns
    const preValidatedSentences = sentences.map(sent => {
      const answer = sent.studentAnswer.toLowerCase()
      const hasRelativePronoun = answer.includes('which') || answer.includes('that') || answer.includes('who') || answer.includes('whom') || answer.includes('whose')
      const isNotJustInfinitive = !answer.match(/^to\s+\w+$/) // Reject if just "to verb"
      const isNotEmpty = answer.length > 0

      return {
        ...sent,
        passesPreValidation: hasRelativePronoun && isNotJustInfinitive && isNotEmpty
      }
    })

    // Evaluate with LLM (only for sentences that pass pre-validation)
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
          // If it failed pre-validation, automatic 0
          if (!sent.passesPreValidation) {
            let feedbackMsg = 'Missing relative clause.'
            if (sent.studentAnswer.length === 0) {
              feedbackMsg = 'Blank not filled. Please add a relative clause with "which", "that", or "by which".'
            } else if (sent.studentAnswer.match(/^to\s+\w+$/)) {
              feedbackMsg = 'You only wrote the infinitive. You need to create a full relative clause (e.g., "which is designed...").'
            } else {
              feedbackMsg = 'Missing relative pronoun. Your clause must include "which", "that", or another relative pronoun.'
            }

            return {
              ...sent,
              score: 0,
              feedback: feedbackMsg
            }
          }

          // Otherwise use LLM score
          return {
            ...sent,
            score: data.results[index]?.score || 0,
            feedback: data.results[index]?.feedback || 'Good effort!'
          }
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

      // Fallback: Use pre-validation only
      const evaluatedResults = preValidatedSentences.map(sent => {
        if (!sent.passesPreValidation) {
          let feedbackMsg = 'Missing relative clause.'
          if (sent.studentAnswer.length === 0) {
            feedbackMsg = 'Blank not filled. Please add a relative clause.'
          } else if (sent.studentAnswer.match(/^to\s+\w+$/)) {
            feedbackMsg = 'You only wrote the infinitive. You need a full relative clause.'
          } else {
            feedbackMsg = 'Missing relative pronoun (which, that, etc.).'
          }

          return {
            ...sent,
            score: 0,
            feedback: feedbackMsg
          }
        }

        // If pre-validation passed but LLM failed, give benefit of doubt with score 0 but encouraging message
        return {
          ...sent,
          score: 0,
          feedback: 'Unable to evaluate. Please check your grammar and try again.'
        }
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
        body: JSON.stringify({
          phase: 4,
          step: 2,
          level: 'C1',
          task: 'F',
          score: finalScore,
          maxScore: 6,
          timestamp: new Date().toISOString()
        })
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

  // Start screen
  if (!gameStarted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 700,
            width: '100%',
            padding: 6,
            textAlign: 'center',
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 4
          }}
        >
          <Box sx={{ mb: 3 }}>
            <AccountTreeIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              ⚔️ Clause Conquest
            </Typography>
            <Typography variant="h6" sx={{ color: '#5a6c7d', mb: 3 }}>
              Level C1 - Task F: Advanced Grammar
            </Typography>
          </Box>

          <CharacterMessage character="Grammar Knight" avatar="⚔️" direction="left">
            Complete 6 complex sentences by filling in the blanks. Use advanced grammar structures with relative clauses and passive voice!
          </CharacterMessage>

          <Box sx={{ mt: 4, mb: 4, p: 3, bgcolor: '#e8eaf6', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3f51b5', mb: 2 }}>
              📋 Mission Objectives
            </Typography>
            <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>✏️ Fill in Blanks:</strong> Complete each sentence with appropriate words
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>📚 Grammar Focus:</strong> Relative clauses (which, that) and passive voice
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>⏱️ Time Limit:</strong> 7 minutes total
              </Typography>
              <Typography sx={{ color: '#2c3e50' }}>
                <strong>🏆 Scoring:</strong> +1 for each correct sentence (max 6 points)
              </Typography>
            </Stack>
          </Box>

          <Button
            onClick={() => setGameStarted(true)}
            variant="contained"
            size="large"
            startIcon={<AccountTreeIcon />}
            sx={{
              fontSize: '1.3rem',
              py: 2,
              px: 6,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5568d3 30%, #653a8b 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(102, 126, 234, 0.5)'
              }
            }}
          >
            Start Clause Conquest
          </Button>
        </Paper>
      </Box>
    )
  }

  // Results screen
  if (gameFinished && !evaluating) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 3
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 900,
            margin: '0 auto',
            padding: 4,
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 4
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: '#f39c12', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>
              Conquest Complete!
            </Typography>
            <Typography variant="h4" sx={{ color: score >= 5 ? '#27ae60' : score >= 3 ? '#f39c12' : '#e74c3c', fontWeight: 700 }}>
              Score: {score}/6
            </Typography>
          </Box>

          <Stack spacing={3}>
            {results.map((result) => (
              <Paper
                key={result.sentenceId}
                elevation={3}
                sx={{
                  p: 3,
                  borderLeft: `6px solid ${result.score >= 1 ? '#27ae60' : '#e74c3c'}`,
                  bgcolor: result.score >= 1 ? '#d5f4e6' : '#fadbd8'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: result.score >= 1 ? '#27ae60' : '#e74c3c', width: 40, height: 40 }}>
                    {result.score >= 1 ? <CheckCircleIcon /> : <CancelIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      {result.conquest} - {result.character}
                    </Typography>
                    <Chip
                      label={result.concept}
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#667eea', color: 'white', fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Your Sentence:
                  </Typography>
                  <Typography sx={{ color: '#2c3e50', fontWeight: 500, fontSize: '1.1rem' }}>
                    {result.completeSentence}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                    Feedback:
                  </Typography>
                  <Typography sx={{ color: '#5a6c7d' }}>
                    {result.feedback}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => navigate('/phase4/step3/remedial/c1/taskG')}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                fontWeight: 700,
                px: 4
              }}
            >
              Next Task: Grammar Guardian →
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Game screen
  const progress = ((currentSentenceIndex + 1) / CLAUSE_SENTENCES.length) * 100

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: 4,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 4
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>
              ⚔️ Clause Conquest
            </Typography>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeLeft)}
              color={timeLeft < 60 ? 'error' : 'primary'}
              sx={{ fontSize: '1.1rem', fontWeight: 700, px: 2 }}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 2,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              Conquest {currentSentenceIndex + 1} of {CLAUSE_SENTENCES.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Box>

        {/* Current Sentence */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#667eea', width: 60, height: 60, fontSize: '2rem' }}>
              {currentClause.avatar}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                {currentClause.character}
              </Typography>
              <Chip
                label={currentClause.conquest}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Paper sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 2 }}>
              Fill in the blanks to complete the sentence:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              {currentClause.sentenceParts.map((part, idx) => (
                <Box key={idx} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  {part.type === 'text' ? (
                    <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 500, display: 'inline' }}>
                      {part.content}
                    </Typography>
                  ) : (
                    <TextField
                      value={answers[`${currentClause.id}_${part.id}`] || ''}
                      onChange={(e) => handleAnswerChange(currentClause.id, part.id, e.target.value)}
                      placeholder={part.placeholder}
                      variant="outlined"
                      fullWidth
                      sx={{
                        minWidth: 300,
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f3e5f5',
                          '& fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#5568d3'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#5568d3'
                          },
                          '& input': {
                            color: '#1a252f',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            padding: '12px 14px'
                          },
                          '& input::placeholder': {
                            color: '#95a5a6',
                            opacity: 0.6,
                            fontStyle: 'italic'
                          }
                        }
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>

            <Typography variant="caption" sx={{ color: '#7f8c8d', mt: 2, display: 'block' }}>
              Grammar Concept: {currentClause.concept}
            </Typography>
          </Paper>
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handlePrevious}
            disabled={currentSentenceIndex === 0}
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                bgcolor: 'rgba(102, 126, 234, 0.1)'
              }
            }}
          >
            ← Previous
          </Button>

          {currentSentenceIndex === CLAUSE_SENTENCES.length - 1 ? (
            <Button
              onClick={handleSubmitAll}
              disabled={evaluating}
              variant="contained"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #27ae60 30%, #229954 90%)',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(45deg, #229954 30%, #1e8449 90%)'
                }
              }}
            >
              {evaluating ? 'Evaluating...' : 'Submit All →'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5568d3 30%, #653a8b 90%)'
                }
              }}
            >
              Next →
            </Button>
          )}
        </Box>

        {/* Progress indicator for all sentences */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CLAUSE_SENTENCES.map((clause, idx) => {
            const hasBlanks = clause.sentenceParts.filter(p => p.type === 'blank')
            const filledBlanks = hasBlanks.filter(b => answers[`${clause.id}_${b.id}`]?.trim())
            const isComplete = filledBlanks.length === hasBlanks.length

            return (
              <Chip
                key={clause.id}
                label={`${idx + 1}`}
                onClick={() => setCurrentSentenceIndex(idx)}
                sx={{
                  fontWeight: 700,
                  cursor: 'pointer',
                  bgcolor: idx === currentSentenceIndex ? '#667eea' : isComplete ? '#27ae60' : '#e0e0e0',
                  color: idx === currentSentenceIndex || isComplete ? 'white' : '#7f8c8d',
                  '&:hover': {
                    bgcolor: idx === currentSentenceIndex ? '#5568d3' : isComplete ? '#229954' : '#d0d0d0'
                  }
                }}
              />
            )
          })}
        </Box>
      </Paper>
    </Box>
  )
}
