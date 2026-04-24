import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Stack, LinearProgress, Grid, useTheme } from '@mui/material'

/**
 * Proposal Builder Game Component
 * Write proposals like puzzle pieces - reveal picture as you complete them
 */

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#2E7D32' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1565C0' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#006064' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#E65100' },
  purple: { bg: '#E8EAF6', border: '#3949AB', shadow: '#283593' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#B71C1C' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F57F17' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  purple: { bg: '#0D0D2B', border: '#7986CB', shadow: '#283593' },
  red:    { bg: '#2A0A0A', border: '#E57373', shadow: '#B71C1C' },
  yellow: { bg: '#2A2200', border: '#FFD54F', shadow: '#F57F17' },
}
const clay = (c, extra = {}) => ({
  bgcolor: c.bg,
  border: `2px solid ${c.border}`,
  borderRadius: '16px',
  boxShadow: `4px 4px 0 ${c.shadow}`,
  ...extra,
})

const ProposalBuilderGame = ({ questions = [], onComplete }) => {
  const muiTheme = useTheme()
  const D = muiTheme.palette.mode === 'dark' ? DARK : LIGHT

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [completedProposals, setCompletedProposals] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [skippedQuestions, setSkippedQuestions] = useState([])

  const currentQuestion = questions[currentQuestionIndex]
  const revealPercentage = (completedProposals.length / questions.length) * 100

  const handleSkip = () => {
    // Mark as skipped
    setSkippedQuestions([...skippedQuestions, currentQuestionIndex])
    setUserInput('')
    setFeedback('')

    // Move to next question
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Game complete!
      setGameComplete(true)
      if (onComplete) {
        onComplete({
          score: completedProposals.length,
          totalQuestions: questions.length,
          completed: true
        })
      }
    }
  }

  const handleSubmit = () => {
    if (!userInput.trim()) {
      setFeedback('Please write a proposal.')
      return
    }

    const input = userInput.toLowerCase().trim()

    // Check if includes "because" (reason)
    const hasReason = input.includes('because')

    // Check if includes relevant terms (poster, video, slogan, etc.)
    const relevantTerms = ['poster', 'video', 'slogan', 'billboard', 'commercial', 'feature', 'eye-catcher', 'ad']
    const hasRelevantTerm = relevantTerms.some(term => input.includes(term))

    // Check if sentence is substantial (B1 level)
    const wordCount = input.split(/\s+/).length
    const isSubstantial = wordCount >= 5

    if (hasReason && hasRelevantTerm && isSubstantial) {
      // Good proposal!
      const newCompletedProposals = [...completedProposals, {
        question: currentQuestion.question,
        userAnswer: userInput,
        questionIndex: currentQuestionIndex
      }]

      setCompletedProposals(newCompletedProposals)
      setFeedback('')
      setUserInput('')

      // Move to next or complete
      if (currentQuestionIndex + 1 < questions.length) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }, 800)
      } else {
        // Game complete!
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: completedProposals.length + 1,
              totalQuestions: questions.length,
              completed: true
            })
          }
        }, 1000)
      }
    } else {
      // Give specific feedback
      if (!hasReason) {
        setFeedback('Include "because" to explain your reason.')
      } else if (!hasRelevantTerm) {
        setFeedback('Include promotion terms like poster, video, slogan, etc.')
      } else if (!isSubstantial) {
        setFeedback('Write a more detailed proposal (at least 5 words).')
      }
    }
  }

  if (gameComplete) {
    return (
      <Box sx={{ ...clay(D.green), p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: D.green.border }}>
          🎉 Proposal Builder Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: D.body }}>
          You completed {completedProposals.length} out of {questions.length} proposals!
        </Typography>

        {/* Progress Summary */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            p: 4,
            bgcolor: D.cardBg,
            borderRadius: '16px',
            border: `4px solid ${D.green.border}`,
            boxShadow: `4px 4px 0 ${D.green.shadow}`
          }}
        >
          <Typography variant="h4" sx={{ color: D.green.border }} fontWeight="bold">
            Final Score
          </Typography>
          <Typography variant="h2" sx={{ color: D.green.border, my: 2 }}>
            {completedProposals.length} / {questions.length}
          </Typography>
          <Typography variant="body1" sx={{ color: D.muted }}>
            {skippedQuestions.length} skipped
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Progress */}
      <Box sx={{ ...clay(D.blue), p: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" sx={{ color: D.blue.border }}>
            Proposals: {completedProposals.length} / {questions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={revealPercentage}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
          />
          <Typography variant="body2" fontWeight="bold" sx={{ color: D.blue.border }}>
            {Math.round(revealPercentage)}% Revealed
          </Typography>
        </Stack>
      </Box>

      {/* Picture Reveal Area */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: D.heading }}>
          Proposal Progress
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            height: 200,
            mx: 'auto',
            bgcolor: D.divider,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Puzzle Pieces Grid */}
          <Grid container sx={{ height: '100%' }}>
            {Array.from({ length: questions.length }).map((_, index) => {
              // Check if this specific question index was completed (not skipped)
              const isCompleted = completedProposals.some(proposal => proposal.questionIndex === index)
              const isSkipped = skippedQuestions.includes(index)

              return (
                <Grid
                  item
                  key={index}
                  xs={questions.length <= 4 ? 6 : 3}
                  sx={{
                    border: '2px solid white',
                    backgroundColor: isCompleted ? D.green.border : (isSkipped ? D.red.bg : D.divider),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.5s'
                  }}
                >
                  {isCompleted && (
                    <Typography sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
                      ✓
                    </Typography>
                  )}
                  {isSkipped && (
                    <Typography sx={{ color: D.red.border, fontSize: '3rem', fontWeight: 'bold' }}>
                      ✕
                    </Typography>
                  )}
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: D.muted }}>
          Complete proposals to earn checkmarks!
        </Typography>
      </Box>

      {/* Current Question */}
      <Box sx={{ ...clay(D.teal), p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: D.teal.border }}>
          Question {currentQuestionIndex + 1} of {questions.length}:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: D.heading }}>
          {currentQuestion?.question}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: D.teal.border }}>
          Write a complete proposal sentence explaining your idea and why it would work.
        </Typography>
      </Box>

      {/* Input Area */}
      <Box sx={{ ...clay(D.blue), p: 3, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Your proposal"
          placeholder="Write your proposal with a reason (use 'because')..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        {feedback && (
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
            {feedback}
          </Typography>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleSkip}
            size="large"
            sx={{ minWidth: 100 }}
          >
            Skip ✕
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            size="large"
            fullWidth
            sx={{
              bgcolor: D.blue.border, color: '#fff', borderRadius: '12px',
              boxShadow: '4px 4px 0 ' + D.blue.shadow, fontWeight: 800,
              '&:hover': { bgcolor: D.blue.border, transform: 'translate(-2px,-2px)', boxShadow: '6px 6px 0 ' + D.blue.shadow }
            }}
          >
            Submit Proposal
          </Button>
        </Stack>
      </Box>

      {/* Completed Proposals */}
      {completedProposals.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: D.heading }}>
            Completed Proposals:
          </Typography>
          <Stack spacing={2}>
            {completedProposals.map((item, index) => (
              <Box
                key={index}
                sx={{ ...clay(D.green), p: 2 }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Typography sx={{ color: D.green.border, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    ✓
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: D.muted }}>
                      Q{index + 1}: {item.question}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ color: D.body }}>
                      {item.userAnswer}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ProposalBuilderGame
