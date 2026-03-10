import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Level C1 - Task B: Analysis Odyssey
 * Correct 8 faulty sentences one by one for C1-level sophistication
 * Gamified as "Analysis Odyssey" - Odyssey journey with corrections
 * Score: +1 per correctly corrected sentence (8 total)
 */

const SENTENCE_CORRECTIONS = [
  {
    id: 1,
    faulty: 'Promotional advertising are fundamentally aim to drive sales but its effectiveness depend on execution quality.',
    correct: 'Promotional advertising, as outlined in video 1, fundamentally aims to drive sales and brand recognition, yet its effectiveness hinges on the quality of execution.'
  },
  {
    id: 2,
    faulty: 'Persuasive technique root in ethos pathos logos create compelling case but without overt coercion which video illustrate well.',
    correct: 'Persuasive techniques—rooted in ethos, pathos, and logos—create a compelling case for the product without overt coercion, a balance the video illustrates effectively.'
  },
  {
    id: 3,
    faulty: 'Targeted and personalize strategy enhance relevance by adress specific need but raise ethical concern about data privacy.',
    correct: 'Targeted and personalized strategies enhance relevance by addressing specific audience needs, although they raise legitimate ethical concerns regarding data privacy.'
  },
  {
    id: 4,
    faulty: 'Originality combine with creativity distinguish ad in oversaturated landscape but excessive novelty confuse audience sometimes.',
    correct: 'Originality, combined with creativity, distinguishes advertisements in an oversaturated media landscape, ensuring memorability and emotional resonance, though excessive novelty can confuse viewers.'
  },
  {
    id: 5,
    faulty: 'Consistent messaging across platform reinforce brand identity but rigid adherence may stifle adaptibility.',
    correct: 'Consistent messaging across platforms reinforces brand identity and trust, but rigid adherence may stifle adaptability in rapidly changing cultural contexts.'
  },
  {
    id: 6,
    faulty: 'Ethical advertising avoid deception and respect autonomy foster long-term loyalty instead short-term gain.',
    correct: 'Ethical advertising, by avoiding deception and respecting consumer autonomy, fosters long-term loyalty rather than short-term gains.'
  },
  {
    id: 7,
    faulty: 'Dramatisation in video 2 through structured story with clear goal and obstacle exemplify how narrative depth captivate viewer emotional.',
    correct: 'Dramatisation in video 2, through structured storytelling with clear goals and obstacles, exemplifies how narrative depth captivates viewers on an emotional level.'
  },
  {
    id: 8,
    faulty: 'Ultimately integration of these principle determine whether ad merely inform or truly persuade.',
    correct: 'Ultimately, the integration of these principles—promotional intent, persuasive balance, ethical responsibility, and creative storytelling—determines whether an advertisement merely informs or truly persuades.'
  }
]

export default function Phase4Step5RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_c1' })
  const [currentSentence, setCurrentSentence] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleCheckSentence = async () => {
    const faultySentence = SENTENCE_CORRECTIONS[currentSentence].faulty
    const userAnswerTrimmed = userAnswer.trim()

    // Disable the check button while evaluating
    setFeedback({ type: 'info', message: 'Evaluating your correction...' })

    try {
      // Use LLM to evaluate C1-level corrections
      const response = await fetch('/api/phase4/step5/remedial/evaluate-expansion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          faultySentence: faultySentence,
          userAnswer: userAnswerTrimmed,
          sentenceIndex: currentSentence
        })
      })

      const data = await response.json()
      const pointsEarned = data.correct ? 1 : 0

      if (data.correct) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Excellent C1-level correction! Odyssey continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: data.feedback || 'Not quite C1 level. Focus on: sophisticated vocabulary, complex syntax, precise connectors, and nuanced meaning.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = data.correct ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_c1_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback: Check basic C1 criteria if API fails
      const correctAnswer = SENTENCE_CORRECTIONS[currentSentence].correct
      const userLower = userAnswerTrimmed.toLowerCase()

      // Check if key C1 improvements were made
      const hasAdvancedVocab = /(hinges|rooted|compelling|legitimate|distinguishes|fosters|exemplifies|captivates|determines)/i.test(userAnswerTrimmed)
      const hasComplexStructure = userAnswerTrimmed.includes(',') && userAnswerTrimmed.includes('—') || userAnswerTrimmed.split(/\s+/).length >= 15
      const hasPrecision = /\b(although|yet|rather than|regarding|ensuring|through)\b/i.test(userAnswerTrimmed)
      const hasFixes = userLower !== faultySentence.toLowerCase()

      const pointsEarned = (hasAdvancedVocab && hasComplexStructure && hasPrecision && hasFixes) ? 1 : 0

      if (pointsEarned > 0) {
        setScore(score + pointsEarned)
        setFeedback({
          type: 'success',
          message: `Good C1-level improvement! Odyssey continues! +${pointsEarned} point`
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Remember to use sophisticated vocabulary, complex sentence structures, precise connectors, and nuanced expressions for C1 level.'
        })
      }

      // Move to next sentence after delay
      setTimeout(() => {
        if (currentSentence < SENTENCE_CORRECTIONS.length - 1) {
          const nextIndex = currentSentence + 1
          setCurrentSentence(nextIndex)
          setUserAnswer('')
          setFeedback(null)
        } else {
          // All sentences completed
          const finalScore = pointsEarned > 0 ? score + 1 : score
          sessionStorage.setItem('phase4_step5_remedial_c1_taskB_score', finalScore)
          logTaskCompletion(finalScore)
          setGameCompleted(true)
          setFeedback(null)
        }
      }, 2000)
    }
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: finalScore })
    try {
      const response = await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'B',
          score: finalScore,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('[Phase 4 Step 5] C1 Task B completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/c1/taskC')
  }

  const progress = ((currentSentence + 1) / SENTENCE_CORRECTIONS.length) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task B: Analysis Odyssey 📝
        </Typography>
        <Typography variant="body1">
          Journey through corrections! Rewrite faulty sentences with C1-level sophistication.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Analysis Odyssey! 📝 You have 8 faulty sentences to correct, one at a time. Your mission: completely rewrite each sentence with sophisticated vocabulary, complex syntax, and nuanced meaning. Each correct C1-level sentence earns you 1 point!"
        />
      </Paper>

      {/* What to Fix Guide */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec', border: '2px solid #c0392b' }}>
        <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }} gutterBottom>
          📝 What to Fix (C1 Level):
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Grammar:</strong> Subject-verb agreement, precise verb forms, proper tense usage
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Vocabulary:</strong> Sophisticated words (hinges, rooted, compelling, fosters, exemplifies, captivates)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Syntax:</strong> Complex structures with dashes (—), commas, subordinate clauses
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Connectors:</strong> Precise connectors (although, yet, rather than, regarding, ensuring, through)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Nuance:</strong> Add detail, context, and sophisticated meaning
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Coherence:</strong> Create elegant, flowing sentences with clear logical relationships
          </Typography>
        </Stack>
      </Paper>

      {/* Game Area */}
      {!gameCompleted && (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 3,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#f8bbd0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)'
              }
            }}
          />

          {/* Sentence Counter */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Sentence ${currentSentence + 1} of ${SENTENCE_CORRECTIONS.length}`}
              sx={{ bgcolor: '#c0392b', color: 'white', fontWeight: 'bold' }}
            />
            <Chip
              label={`Score: ${score}/${SENTENCE_CORRECTIONS.length}`}
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Faulty Sentence */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#ffebee', border: '2px solid #f44336' }}>
            <Typography variant="subtitle2" color="error.dark" fontWeight="bold" gutterBottom>
              ❌ Faulty Sentence (DO NOT copy - rewrite with C1 sophistication!):
            </Typography>
            <Typography variant="h6" sx={{ color: '#c62828', fontFamily: 'monospace', mt: 1 }}>
              {SENTENCE_CORRECTIONS[currentSentence].faulty}
            </Typography>
          </Paper>

          {/* User Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#6a1b9a' }}>
              ✏️ Your C1-level correction (use sophisticated vocabulary, complex syntax, precise connectors):
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rewrite the sentence with C1-level sophistication..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={feedback !== null}
              autoFocus
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  '& textarea': {
                    color: '#ffffff',
                    fontWeight: 500
                  }
                }
              }}
            />
          </Box>

          {/* Feedback */}
          {feedback && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor:
                  feedback.type === 'success'
                    ? '#d4edda'
                    : feedback.type === 'info'
                    ? '#d1ecf1'
                    : '#f8d7da',
                border: `2px solid ${
                  feedback.type === 'success'
                    ? '#28a745'
                    : feedback.type === 'info'
                    ? '#17a2b8'
                    : '#dc3545'
                }`
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color:
                    feedback.type === 'success'
                      ? '#155724'
                      : feedback.type === 'info'
                      ? '#0c5460'
                      : '#721c24',
                  fontWeight: 'bold'
                }}
              >
                {feedback.message}
              </Typography>
            </Paper>
          )}

          {/* Check Button */}
          {!feedback && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckSentence}
              disabled={!userAnswer.trim() || userAnswer.trim().split(/\s+/).length < 8}
              startIcon={<CheckCircleIcon />}
              sx={{
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a93226 0%, #7d3c98 100%)'
                },
                py: 1.5
              }}
            >
              {userAnswer.trim().split(/\s+/).length < 8 ? 'Write at least 8 words' : 'Check Sentence'}
            </Button>
          )}
        </Paper>
      )}

      {/* Navigation after game completion */}
      {gameCompleted && (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'success.lighter', textAlign: 'center' }}>
            <Typography variant="h5" color="success.dark" gutterBottom>
              📝 Analysis Odyssey Complete!
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Score: {score} / 8
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {score === 8 ? 'Perfect C1-level writing! All sentences corrected with sophistication!' : score >= 6 ? 'Great job! Strong C1-level improvements!' : 'Good effort! Keep practicing C1 writing skills!'}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
                }
              }}
            >
              Next: Task C →
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
