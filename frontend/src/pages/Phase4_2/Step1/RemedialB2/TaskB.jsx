import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Chip, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CreateIcon from '@mui/icons-material/Create'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Remedial B2 - Task B: Writing
 * Write an 8-sentence paragraph on effective social media posts
 * AI evaluation for content quality
 * Score: 0-10 points based on quality
 */

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b2' })
  const [paragraph, setParagraph] = useState('')
  const [sentenceCount, setSentenceCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleTextChange = (e) => {
    const text = e.target.value
    setParagraph(text)

    // Count sentences (split by . ! ?)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      const response = await fetch('/api/phase4/remedial/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B2',
          task: 'B',
          paragraph: paragraph,
          expected_sentences: 8,
          topic: 'effective social media posts'
        })
      })

      const data = await response.json()

      if (data.success) {
        setScore(data.score)
        setFeedback(data.feedback)
        sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', data.score)

        // Log to backend
        await fetch('/api/phase4/remedial/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            phase: '4.2',
            level: 'B2',
            task: 'B',
            step: 1,
            score: data.score,
            max_score: 10,
            completed: true
          })
        })
      } else {
        // Fallback scoring
        const fallbackScore = sentenceCount >= 8 ? 7 : Math.floor((sentenceCount / 8) * 7)
        setScore(fallbackScore)
        setFeedback('Good effort! Try to include more details about social media strategies.')
        sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', fallbackScore)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback scoring
      const fallbackScore = sentenceCount >= 8 ? 7 : Math.floor((sentenceCount / 8) * 7)
      setScore(fallbackScore)
      setFeedback('Good effort! Your paragraph shows understanding of social media concepts.')
      sessionStorage.setItem('remedial_phase4_2_step1_b2_taskB_score', fallbackScore)
    }

    setSubmitted(true)
    setEvaluating(false)
  }

  const handleContinue = () => {
    navigate('/phase4_2/step1/remedial/b2/taskC')
  }

  const canSubmit = sentenceCount >= 8 && paragraph.trim().length >= 200

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 1: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Writing
        </Typography>
        <Typography variant="body1">
          Write an 8-sentence paragraph on effective social media posts!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to showcase your writing skills! Write a well-structured paragraph (8 sentences minimum) about what makes social media posts effective. Include details about hashtags, captions, engagement, and calls-to-action. Use clear examples and explain your ideas thoroughly!"
        />
      </Paper>

      {/* Writing Prompt */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9', border: '3px solid #27ae60' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CreateIcon sx={{ fontSize: 32, color: '#27ae60' }} />
          <Typography variant="h6" sx={{ color: '#1a252f', fontWeight: 'bold' }}>
            Writing Prompt
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500, mb: 2 }}>
          <strong>Topic:</strong> What makes a social media post effective?
        </Typography>
        <Typography variant="body2" sx={{ color: '#34495e' }}>
          <strong>Include:</strong>
        </Typography>
        <Box component="ul" sx={{ color: '#34495e', mt: 1 }}>
          <li>The role of hashtags in discovery</li>
          <li>How captions engage readers</li>
          <li>Why emojis matter</li>
          <li>The importance of calls-to-action</li>
          <li>Tagging and engagement strategies</li>
          <li>The power of stories</li>
          <li>When content goes viral</li>
          <li>Best practices for posting</li>
        </Box>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: '#f8f9fa', border: '3px solid #27ae60' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Your Paragraph
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={14}
          value={paragraph}
          onChange={handleTextChange}
          placeholder="Write your paragraph here... Start with a clear topic sentence, develop your ideas with examples, and conclude with a strong statement about effective social media posting."
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
              label={`Characters: ${paragraph.length} / 200+`}
              sx={{
                backgroundColor: paragraph.length >= 200 ? '#27ae60' : '#95a5a6',
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

        {sentenceCount < 8 && paragraph.length > 50 && !submitted && (
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
        <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: score >= 8 ? '#d5f4e6' : '#fff3cd', border: `4px solid ${score >= 8 ? '#27ae60' : '#f39c12'}` }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: score >= 8 ? '#27ae60' : '#f39c12', mb: 1 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#1a252f', fontWeight: 'bold' }}>
              {score >= 8 ? 'Excellent Work!' : 'Good Effort!'}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', maxWidth: 300, mx: 'auto', my: 2 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: score >= 8 ? '#27ae60' : '#f39c12' }}>
                {score} / 10
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Points Earned
              </Typography>
            </Paper>
          </Box>

          <Alert severity={score >= 8 ? 'success' : 'info'} sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#1a252f', fontWeight: 500 }}>
              <strong>Feedback:</strong> {feedback}
            </Typography>
          </Alert>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 1 }}>
              Your Statistics:
            </Typography>
            <Typography variant="body2" sx={{ color: '#34495e' }}>
              Sentences: {sentenceCount} | Characters: {paragraph.length} | Words: {paragraph.trim().split(/\s+/).length}
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
            {evaluating ? 'Evaluating...' : canSubmit ? 'Submit Paragraph' : `Write ${8 - sentenceCount} More Sentences`}
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
            Continue to Task C: Matching Game
          </Button>
        )}
      </Box>
    </Box>
  )
}
