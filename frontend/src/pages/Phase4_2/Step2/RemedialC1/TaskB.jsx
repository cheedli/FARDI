import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level C1 - Task B: Analytical Writing
 * Write 8-sentence analysis of post effectiveness with guided questions
 */

const GUIDED_QUESTIONS = [
  'How do hashtags impact post discoverability and reach?',
  'What role does the caption play in engaging the audience?',
  'Why are emojis important for visual communication?',
  'How does tagging users increase engagement?',
  'What makes a call-to-action effective?',
  'How do these elements work together to create viral potential?',
  'What metrics would you use to measure post success?',
  'How can you optimize posts for maximum engagement?'
]

export default function Phase4_2Step2RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = () => {
    setShowResults(true)
    // Score based on sentence count (max 10 points)
    const score = Math.min((sentenceCount / 8) * 10, 10)

    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskB_score', score.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskB_max', '10')

    logTaskCompletion(sentenceCount, 8)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 2,
          level: 'C1',
          task: 'B',
          score: score,
          max_score: maxScore,
          content: analysis
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/2/remedial/c1/taskC')
  }

  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task B: Analytical Writing
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Write a sophisticated analysis of Instagram post effectiveness. Use the guided questions below to structure your 8-sentence analysis. Demonstrate critical thinking, precise terminology, and examine multiple perspectives on what makes social media posts successful."
        />
      </Paper>

      {/* Guided Questions */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'primary.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.dark" fontWeight="bold">
            Guided Questions (Answer each in your analysis):
          </Typography>
          {GUIDED_QUESTIONS.map((question, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2 }}>
              {idx + 1}. {question}
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write an 8-sentence analysis addressing each guided question above. Use sophisticated vocabulary and demonstrate critical thinking about post effectiveness.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Key terms to include:</strong> hashtag strategy, caption engagement, emoji psychology, user tagging, call-to-action effectiveness, viral potential, analytics metrics, optimization techniques.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Analysis
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={16}
          value={analysis}
          onChange={handleTextChange}
          placeholder="Write your analytical essay here... Address each of the 8 guided questions in a well-structured analysis. Examine how hashtags impact discoverability, how captions engage audiences, why emojis matter, how tagging increases reach, what makes CTAs effective, how elements combine for viral potential, which metrics measure success, and how to optimize posts for maximum engagement."
          variant="outlined"
          disabled={showResults}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences (approx. 150-200 words)
          </Typography>
          {isComplete && !showResults && (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
              ✓ Ready to submit!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Results */}
      {showResults && (
        <Alert severity={isComplete ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isComplete ? 'Excellent Analytical Writing!' : 'Good Start!'}
          </Typography>
          <Typography>
            You wrote {sentenceCount} sentences with {wordCount} words.
            {isComplete ? ' Your analysis demonstrates advanced critical thinking and sophisticated use of social media terminology.' : ' Try to reach the 8-sentence target for full credit.'}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={sentenceCount < 6}
          >
            Submit Analysis
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Continue to Task C
          </Button>
        )}
      </Box>
    </Box>
  )
}
