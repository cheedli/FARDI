import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, TextField, Alert, Card, CardContent, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task B: Analysis Odyssey (Analytical Writing)
 * 8-sentence analytical paragraph on social media effectiveness with AI evaluation
 */

const GUIDED_QUESTIONS = [
  'How do hashtags impact organic reach and discoverability?',
  'What role does a concise caption play in audience retention?',
  'Why are emojis functional as emotional cues?',
  'How does a call-to-action create behavioral triggers?',
  'What benefits does strategic tagging provide for network expansion?',
  'How do timing and visual quality affect post performance?',
  'What analytics metrics measure social media success?',
  'How can optimization strategies amplify post effectiveness?'
]

const EXAMPLE_SENTENCES = [
  'Strategic hashtags amplify organic reach through targeted discoverability.',
  'Concise captions retain attention in fast-scrolling environments.',
  'Emojis function as visual emotional cues that enhance engagement.',
  'Direct call-to-action statements create measurable behavioral triggers.',
  'Strategic user tagging exponentially expands network reach.',
  'Visual quality and optimal timing synergistically boost performance.',
  'Analytics metrics provide quantifiable success indicators.',
  'Continuous optimization based on data drives sustained effectiveness.'
]

export default function Phase4_2Step3RemedialC1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [aiScore, setAiScore] = useState(null)
  const [aiFeedback, setAiFeedback] = useState('')
  const [evaluating, setEvaluating] = useState(false)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      // AI evaluation for C1 level analytical writing
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'B',
          text: analysis,
          criteria: 'sophisticated analytical paragraph on social media effectiveness with cohesive argumentation'
        })
      })

      const data = await response.json()
      setAiScore(data.score || 0)
      setAiFeedback(data.feedback || 'Analysis evaluated.')

      sessionStorage.setItem('phase4_2_step3_c1_taskB_score', data.score || 0)

    } catch (error) {
      console.error('AI evaluation failed:', error)
      // Fallback: sentence-based scoring
      const fallbackScore = Math.min((sentenceCount / 8) * 8, 8)
      setAiScore(fallbackScore)
      setAiFeedback('Evaluated based on sentence count.')
      sessionStorage.setItem('phase4_2_step3_c1_taskB_score', fallbackScore)
    }

    setEvaluating(false)
    setShowResults(true)
    logTaskCompletion()
  }

  const logTaskCompletion = async () => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'B',
          score: aiScore,
          max_score: 8,
          content: analysis
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskC')
  }

  const isComplete = sentenceCount >= 8

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task B: Analysis Odyssey
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Write a sophisticated 8-sentence analytical paragraph on social media effectiveness. Use the guided questions and examples to structure your analysis with advanced vocabulary, precise terminology, and cohesive argumentation. Your work will be evaluated by AI for C1-level sophistication."
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

      {/* Example Sentences */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
            Example Sentences (Use as models for sophistication):
          </Typography>
          {EXAMPLE_SENTENCES.map((sentence, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2 }}>
              {idx + 1}. {sentence}
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write an 8-sentence analytical paragraph addressing each guided question. Use sophisticated vocabulary and demonstrate critical thinking.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Key terms to include:</strong> strategic hashtags, organic reach, concise captions, emotional cues, behavioral triggers, network expansion, analytics metrics, optimization.
        </Typography>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Analytical Paragraph
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={16}
          value={analysis}
          onChange={handleTextChange}
          placeholder="Write your analytical paragraph here... Address how strategic hashtags amplify reach, how concise captions retain attention, why emojis function as emotional cues, how CTAs trigger behavior, how tagging expands networks, how timing/quality affect performance, which metrics measure success, and how optimization drives effectiveness."
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
        <Alert severity={aiScore >= 7 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {aiScore >= 7 ? 'Excellent Analytical Writing!' : 'Good Effort!'}
          </Typography>
          <Typography>
            AI Score: {aiScore}/8 points
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            {aiFeedback}
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
            disabled={sentenceCount < 6 || evaluating}
            startIcon={evaluating && <CircularProgress size={20} color="inherit" />}
          >
            {evaluating ? 'Evaluating...' : 'Submit Analysis'}
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
