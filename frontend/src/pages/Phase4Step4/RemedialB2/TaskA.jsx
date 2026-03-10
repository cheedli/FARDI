import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B2 - Task A: Debate Simulation
 * Write 6 debate responses with advanced vocabulary and argumentation
 * Score: +1 for each response (6 total)
 */

const DEBATE_PROMPTS = [
  {
    id: 1,
    opponent: 'Is promotional advertising still effective today?',
    modelAnswer: 'Yes, promotional advertising remains highly effective because it directly drives sales and brand visibility, as video 1 clearly demonstrates through its emphasis on promotion as a core function.',
    keywords: ['effective', 'drives sales', 'brand visibility', 'video 1', 'promotion']
  },
  {
    id: 2,
    opponent: "But isn't persuasive advertising manipulative?",
    modelAnswer: 'Not necessarily—when balanced with ethos, pathos, and logos as shown in video 1, persuasion builds genuine trust rather than manipulation.',
    keywords: ['ethos', 'pathos', 'logos', 'trust', 'video 1']
  },
  {
    id: 3,
    opponent: 'What about targeted and personalized approaches?',
    modelAnswer: 'Targeted and personalized strategies increase relevance dramatically, but they must be ethical and respect privacy, which video 1 implicitly supports by stressing fairness.',
    keywords: ['targeted', 'personalized', 'ethical', 'privacy', 'video 1']
  },
  {
    id: 4,
    opponent: 'How important is originality and creativity?',
    modelAnswer: 'Originality and creativity are essential for standing out in saturated media environments, exactly as video 1 argues when it highlights memorable and fresh ideas.',
    keywords: ['originality', 'creativity', 'standing out', 'memorable', 'video 1']
  },
  {
    id: 5,
    opponent: 'And what about consistency and ethics?',
    modelAnswer: 'Consistency reinforces brand identity over time, while ethical advertising—avoiding exaggeration or deception—ensures long-term credibility, both of which video 1 positions as non-negotiable.',
    keywords: ['consistency', 'ethical', 'credibility', 'video 1', 'brand identity']
  },
  {
    id: 6,
    opponent: 'How does dramatisation enhance advertising impact?',
    modelAnswer: 'Dramatisation creates emotional engagement through narrative structure, though it must feel authentic to avoid appearing contrived, as video 1 demonstrates.',
    keywords: ['dramatisation', 'emotional', 'narrative', 'authentic', 'video 1']
  }
]

export default function RemedialB2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState(Array(DEBATE_PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentPrompt = DEBATE_PROMPTS[currentIndex]

  const handleResponseChange = (value) => {
    const newResponses = [...responses]
    newResponses[currentIndex] = value
    setResponses(newResponses)
  }

  const handleNext = () => {
    if (currentIndex < DEBATE_PROMPTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      // Send all responses to backend for AI evaluation
      const response = await fetch('/api/phase4/step4/remedial/b2/evaluate-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          responses: responses.map((resp, idx) => ({
            prompt: DEBATE_PROMPTS[idx].opponent,
            response: resp,
            modelAnswer: DEBATE_PROMPTS[idx].modelAnswer
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        const totalScore = data.results.filter(r => r.passed).length
        setScore(totalScore)
        sessionStorage.setItem('remedial_step4_b2_taskA_score', totalScore)
        await logTaskCompletion(totalScore)
      } else {
        // Fallback: basic length check
        const fallbackResults = responses.map((resp, idx) => {
          const wordCount = resp.trim().split(/\s+/).length
          const passed = wordCount >= 15 // Minimum 15 words for B2 level
          return {
            passed,
            feedback: passed
              ? 'Good response with sufficient detail.'
              : 'Response too short. Provide more nuanced argumentation.'
          }
        })
        setResults(fallbackResults)
        const totalScore = fallbackResults.filter(r => r.passed).length
        setScore(totalScore)
        sessionStorage.setItem('remedial_step4_b2_taskA_score', totalScore)
        await logTaskCompletion(totalScore)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback on error
      const fallbackResults = responses.map((resp) => {
        const wordCount = resp.trim().split(/\s+/).length
        const passed = wordCount >= 15
        return {
          passed,
          feedback: passed
            ? 'Response accepted.'
            : 'Response needs more detail.'
        }
      })
      setResults(fallbackResults)
      const totalScore = fallbackResults.filter(r => r.passed).length
      setScore(totalScore)
      sessionStorage.setItem('remedial_step4_b2_taskA_score', totalScore)
      await logTaskCompletion(totalScore)
    }

    setEvaluating(false)
    setSubmitted(true)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'A',
          step: 4,
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/b2/taskB')
  }

  const allFilled = responses.every(r => r.trim().length > 0)
  const progress = ((currentIndex + 1) / DEBATE_PROMPTS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task A: Debate Simulation 💬
        </Typography>
        <Typography variant="body1">
          Engage in a sophisticated debate with nuanced arguments and advanced vocabulary!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to advanced debate! You'll respond to 6 challenging questions about advertising. Use sophisticated vocabulary, reference video 1, and provide nuanced arguments with clear reasoning. Aim for at least 20-30 words per response!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Debate Round {currentIndex + 1} of {DEBATE_PROMPTS.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {DEBATE_PROMPTS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? 'success.main' :
                                    idx === currentIndex ? 'primary.main' : 'grey.300'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Debate Prompt */}
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ mb: 3, p: 3, backgroundColor: 'error.light', borderRadius: 2 }}>
              <Typography variant="h6" color="error.dark" fontWeight="bold">
                Opponent says:
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, fontStyle: 'italic' }}>
                "{currentPrompt.opponent}"
              </Typography>
            </Box>

            <Typography variant="h6" color="success.dark" fontWeight="bold" gutterBottom>
              Your Response:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={responses[currentIndex]}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Write a sophisticated, nuanced response with advanced vocabulary and clear reference to video 1..."
              variant="outlined"
              helperText={`Word count: ${responses[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for 20-30 words)`}
            />

            {/* Model Answer Hint */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'info.light' }}>
              <Typography variant="subtitle2" color="info.dark" fontWeight="bold">
                💡 Tip: Include these concepts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentPrompt.keywords.join(', ')}
              </Typography>
            </Paper>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex < DEBATE_PROMPTS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!responses[currentIndex].trim()}
                >
                  Next Round →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!allFilled || evaluating}
                >
                  {evaluating ? 'Evaluating...' : 'Submit Debate 💬'}
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to round:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {DEBATE_PROMPTS.map((_, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{ minWidth: 40 }}
                >
                  {idx + 1} {responses[idx].trim() && '✓'}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box>
          {/* Results */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score === 6 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score === 6 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '💬 Perfect Debate! 💬' : '🌟 Debate Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Debate Review:
            </Typography>
            <Stack spacing={2}>
              {DEBATE_PROMPTS.map((prompt, index) => {
                const result = results[index]
                return (
                  <Alert key={index} severity={result.passed ? 'success' : 'warning'}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Round {index + 1}: {prompt.opponent}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Your response: "{responses[index]}"
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }} color={result.passed ? 'success.dark' : 'warning.dark'}>
                      {result.feedback}
                    </Typography>
                    {!result.passed && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Model answer: {prompt.modelAnswer}
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Continue to Task B →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
