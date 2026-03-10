import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 4 - Level C1 - Task F: Complex Sentences (Relative Clauses)
 * Write 6 complex sentences with which/that clauses
 */

const PROMPTS = [
  {
    topic: 'Hashtags and discoverability',
    example: 'Hashtags, which are strategically deployed, significantly boost discoverability.'
  },
  {
    topic: 'Captions and engagement',
    example: 'Captions that engage audiences create lasting impressions.'
  },
  {
    topic: 'Emojis and emotional connection',
    example: 'Emojis, which convey emotion visually, enhance audience connection.'
  },
  {
    topic: 'Call-to-action and conversions',
    example: 'A call-to-action that is clear and compelling drives measurable conversions.'
  },
  {
    topic: 'Viral content and reach',
    example: 'Viral content, which spreads exponentially, maximizes reach.'
  },
  {
    topic: 'Analytics and optimization',
    example: 'Analytics metrics that are monitored consistently enable data-driven optimization.'
  }
]

export default function Phase4_2Step4RemedialC1TaskF() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 6, context: 'remedial_c1' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSentenceChange = (idx, value) => {
    setSentences({ ...sentences, [idx]: value })
  }

  const checkRelativeClause = (text) => {
    const lower = text.toLowerCase()

    // Check for relative pronouns
    const hasRelativePronoun = lower.includes(' which ') || lower.includes(' that ')

    // Check for clause structure (comma before which)
    const hasProperPunctuation = (lower.includes(', which ') || lower.includes(' that '))

    // Check for reasonable length (complex sentences are typically longer)
    const wordCount = text.trim().split(/\s+/).length
    const hasComplexity = wordCount >= 8

    return hasRelativePronoun && hasProperPunctuation && hasComplexity
  }

  const handleSubmit = () => {
    let correctCount = 0

    PROMPTS.forEach((_, idx) => {
      const userSentence = sentences[idx] || ''
      if (checkRelativeClause(userSentence)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)

    sessionStorage.setItem('phase4_2_step4_c1_taskF_score', correctCount)

    logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (finalScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskF', is_correct: true, score: finalScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 4,
          level: 'C1',
          task: 'F',
          score: finalScore,
          max_score: 6
        })
      })
    } catch (error) {
      console.error('Failed to log:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/4/remedial/c1/taskG')
  }

  const allAnswered = PROMPTS.every((_, idx) => sentences[idx]?.trim())

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 4 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task F: Complex Sentences (Relative Clauses)
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Write 6 complex sentences using relative clauses with 'which' or 'that'. Demonstrate sophisticated sentence structure with proper punctuation. Use ', which' for non-essential clauses and 'that' for essential clauses. Score 5/6 to pass!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write complex sentences on each topic using relative clauses. Use the examples as models for structure and sophistication.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Grammar:</strong> Non-essential info: ", which..." | Essential info: "that..."
        </Typography>
      </Paper>

      {/* Complex Sentence Prompts */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          {PROMPTS.map((prompt, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {idx + 1}. Topic: {prompt.topic}
              </Typography>
              <Typography variant="body2" color="success.dark" sx={{ mb: 1, fontStyle: 'italic' }}>
                Example: "{prompt.example}"
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Write your complex sentence here using 'which' or 'that'..."
                value={sentences[idx] || ''}
                onChange={(e) => handleSentenceChange(idx, e.target.value)}
                disabled={submitted}
                sx={{ mt: 1 }}
              />
              {submitted && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    color: checkRelativeClause(sentences[idx] || '') ? 'success.main' : 'error.main'
                  }}
                >
                  {checkRelativeClause(sentences[idx] || '')
                    ? 'Excellent complex sentence!'
                    : 'Needs relative clause (which/that) with proper punctuation'}
                </Typography>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {submitted && (
        <Alert severity={score >= 5 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {score >= 5 ? 'Excellent Complex Sentence Mastery!' : 'Good Effort!'}
          </Typography>
          <Typography>
            Score: {score}/6 points (Need 5/6 to pass)
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Sentences
          </Button>
        )}
        {submitted && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task G
          </Button>
        )}
      </Box>
    </Box>
  )
}
