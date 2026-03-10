import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, LinearProgress, Stack } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CreateIcon from '@mui/icons-material/Create'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Remedial B2 - Task B: Explain Expedition
 * Write an 8-sentence explanation of social media post elements
 * 8 guided questions to answer
 * AI evaluation for content quality at B2 level
 * Score: 0-8 points based on quality
 */

const GUIDED_QUESTIONS = [
  'What is the purpose of a hashtag in your post?',
  'How should you write an effective caption?',
  'What function do emojis serve in social media posts?',
  'Why is a call-to-action important in your post?',
  'How does tagging other accounts benefit your post?',
  'What effect does posting timing have on engagement?',
  'Why is visual quality important for social media?',
  'How do you measure engagement metrics effectively?'
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_b2' })
  const [explanation, setExplanation] = useState('')
  const [sentenceCount, setSentenceCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleTextChange = (e) => {
    const text = e.target.value
    setExplanation(text)

    // Count sentences (split by . ! ?)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      const response = await fetch('/api/phase4/4_2/step3/remedial/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
          paragraph: explanation,
          expected_sentences: 8,
          topic: 'social media post elements',
          guided_questions: GUIDED_QUESTIONS
        })
      })

      const data = await response.json()

      if (data.success) {
        setScore(data.score)
        setFeedback(data.feedback)
        sessionStorage.setItem('phase4_2_step3_b2_taskB', data.score)

        // Log to backend
        await fetch('/api/phase4/remedial/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            phase: '4.2',
            level: 'B2',
            task: 'B',
            step: 3,
            score: data.score,
            max_score: 8,
            completed: true
          })
        })
      } else {
        // Fallback scoring
        const fallbackScore = sentenceCount >= 8 ? 6 : Math.floor((sentenceCount / 8) * 6)
        setScore(fallbackScore)
        setFeedback('Good effort! Try to address more of the guided questions about social media post elements.')
        sessionStorage.setItem('phase4_2_step3_b2_taskB', fallbackScore)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback scoring
      const fallbackScore = sentenceCount >= 8 ? 6 : Math.floor((sentenceCount / 8) * 6)
      setScore(fallbackScore)
      setFeedback('Good effort! Your explanation shows understanding of social media post elements.')
      sessionStorage.setItem('phase4_2_step3_b2_taskB', fallbackScore)
    }

    setSubmitted(true)
    setEvaluating(false)
  }

  const handleContinue = () => {
    navigate('/phase4_2/step3/remedial/b2/taskC')
  }

  const canSubmit = sentenceCount >= 8 && explanation.trim().length >= 200

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Explain Expedition
        </Typography>
        <Typography variant="body1">
          Write an 8-sentence explanation of social media post elements!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to demonstrate your writing skills! Write a well-structured explanation (8 sentences minimum) about the key elements of social media posts. Answer the guided questions below in your explanation. Use clear examples and explain your ideas thoroughly with B2-level language!"
        />
      </Paper>

      {/* Guided Questions */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9', border: '3px solid #27ae60' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <QuizIcon sx={{ fontSize: 32, color: '#27ae60' }} />
          <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
            Guided Questions to Answer
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500, mb: 2 }}>
          Include answers to these 8 questions in your explanation:
        </Typography>
        <Stack spacing={1}>
          {GUIDED_QUESTIONS.map((question, idx) => (
            <Paper key={idx} elevation={1} sx={{ p: 2, backgroundColor: 'white', borderLeft: '4px solid #27ae60' }}>
              <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                <strong>{idx + 1}.</strong> {question}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Writing Prompt */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd', border: '3px solid #2196f3' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CreateIcon sx={{ fontSize: 32, color: '#2196f3' }} />
          <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
            Writing Prompt
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500, mb: 2 }}>
          <strong>Topic:</strong> What are the key elements that make a social media post effective?
        </Typography>
        <Typography variant="body2" sx={{ color: '#34495e' }}>
          Write a comprehensive explanation that covers hashtag strategy, caption writing, emoji usage,
          calls-to-action, tagging benefits, posting timing, visual quality, and engagement measurement.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #27ae60' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Your Explanation
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={16}
          value={explanation}
          onChange={handleTextChange}
          placeholder="Write your explanation here... Answer each of the 8 guided questions above. For example: 'Use relevant hashtags for discoverability. Keep captions short and engaging. Emojis add emotion and personality...' Continue developing your ideas with specific strategies and examples."
          variant="outlined"
          disabled={submitted || evaluating}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#27ae60',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: '#229954'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#229954'
              },
              '& textarea': {
                color: '#1a252f',
                fontWeight: 500,
                fontSize: '1.05rem',
                lineHeight: 1.8
              }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              label={`Sentences: ${sentenceCount} / 8`}
              sx={{
                backgroundColor: sentenceCount >= 8 ? '#27ae60' : '#e67e22',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                mr: 1
              }}
            />
            <Chip
              label={`Characters: ${explanation.length} / 200+`}
              sx={{
                backgroundColor: explanation.length >= 200 ? '#27ae60' : '#95a5a6',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            />
          </Box>
          {canSubmit && !submitted && (
            <Typography variant="body1" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
              Ready to submit!
            </Typography>
          )}
        </Box>

        {sentenceCount < 8 && explanation.length > 50 && !submitted && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              You need at least {8 - sentenceCount} more sentence{8 - sentenceCount !== 1 ? 's' : ''}. Keep writing!
            </Typography>
          </Alert>
        )}

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#2c3e50', fontWeight: 600 }}>
            Progress: {Math.min(100, (sentenceCount / 8) * 100).toFixed(0)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (sentenceCount / 8) * 100)}
            sx={{
              height: 10,
              borderRadius: 1,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#27ae60'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Results */}
      {submitted && (
        <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: score >= 6 ? '#d5f4e6' : '#fff3cd', border: `4px solid ${score >= 6 ? '#27ae60' : '#f39c12'}` }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: score >= 6 ? '#27ae60' : '#f39c12', mb: 1 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#1a252f', fontWeight: 'bold' }}>
              {score >= 6 ? 'Excellent Work!' : 'Good Effort!'}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 2 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 6 ? '#27ae60' : '#f39c12' }}>
                {score} / 8
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
          </Box>

          <Alert severity={score >= 6 ? 'success' : 'info'} sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 500 }}>
              <strong>Feedback:</strong> {feedback}
            </Typography>
          </Alert>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 1 }}>
              Your Statistics:
            </Typography>
            <Typography variant="body2" sx={{ color: '#34495e' }}>
              Sentences: {sentenceCount} | Characters: {explanation.length} | Words: {explanation.trim().split(/\s+/).length}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!canSubmit || evaluating}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: canSubmit && !evaluating
                ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
                : '#bdc3c7',
              '&:hover': {
                background: canSubmit && !evaluating
                  ? 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
                  : '#95a5a6'
              }
            }}
          >
            {evaluating ? 'Evaluating...' : canSubmit ? 'Submit Explanation' : `Write ${8 - sentenceCount} More Sentences`}
          </Button>
        )}
        {submitted && (
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2980b9 0%, #21618c 100%)'
              }
            }}
          >
            Continue to Task C: Kahoot Match
          </Button>
        )}
      </Box>
    </Box>
  )
}
