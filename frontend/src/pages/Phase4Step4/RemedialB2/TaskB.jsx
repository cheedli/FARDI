import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, TextField, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial B2 - Task B: Critique Game (Kahoot-style)
 * Write 6 balanced critiques of advertising terms
 * Score: +1 for each critique (6 total)
 */

const CRITIQUE_TERMS = [
  {
    id: 1,
    term: 'Promotional',
    modelCritique: 'While undeniably effective for immediate sales impact, over-reliance on promotional messaging risks alienating audiences who perceive it as overly commercial.',
    keywords: ['effective', 'sales impact', 'over-reliance', 'alienating', 'commercial']
  },
  {
    id: 2,
    term: 'Persuasive',
    modelCritique: 'The use of ethos, pathos, and logos is powerful, but unbalanced pathos can border on emotional manipulation if not tempered with credibility.',
    keywords: ['ethos', 'pathos', 'logos', 'manipulation', 'credibility']
  },
  {
    id: 3,
    term: 'Targeted/Personalized',
    modelCritique: 'These strategies significantly increase relevance, yet they raise serious ethical questions concerning data privacy and consumer autonomy.',
    keywords: ['relevance', 'ethical questions', 'privacy', 'autonomy']
  },
  {
    id: 4,
    term: 'Original/Creative',
    modelCritique: 'Originality and creativity are vital for differentiation, but excessive novelty can confuse audiences if not aligned with brand identity.',
    keywords: ['differentiation', 'novelty', 'confuse', 'brand identity']
  },
  {
    id: 5,
    term: 'Consistent',
    modelCritique: 'Consistency strengthens brand recall and trust, although rigid adherence may stifle adaptability in rapidly changing cultural contexts.',
    keywords: ['brand recall', 'trust', 'rigid', 'adaptability']
  },
  {
    id: 6,
    term: 'Dramatisation',
    modelCritique: 'The narrative structure is emotionally compelling, yet over-dramatisation risks appearing contrived if the obstacles feel inauthentic.',
    keywords: ['narrative', 'compelling', 'contrived', 'inauthentic']
  }
]

export default function RemedialB2TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'remedial_b2' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [critiques, setCritiques] = useState(Array(CRITIQUE_TERMS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const currentTerm = CRITIQUE_TERMS[currentIndex]

  const handleCritiqueChange = (value) => {
    const newCritiques = [...critiques]
    newCritiques[currentIndex] = value
    setCritiques(newCritiques)
  }

  const handleNext = () => {
    if (currentIndex < CRITIQUE_TERMS.length - 1) {
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
      // Send all critiques to backend for AI evaluation
      const response = await fetch('/api/phase4/step4/remedial/b2/evaluate-critiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          critiques: critiques.map((critique, idx) => ({
            term: CRITIQUE_TERMS[idx].term,
            critique: critique,
            modelCritique: CRITIQUE_TERMS[idx].modelCritique
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        const totalScore = data.results.filter(r => r.passed).length
        setScore(totalScore)
        sessionStorage.setItem('remedial_step4_b2_taskB_score', totalScore)
        await logTaskCompletion(totalScore)
      } else {
        // Fallback: basic length and balance check
        const fallbackResults = critiques.map((critique) => {
          const wordCount = critique.trim().split(/\s+/).length
          const hasBalanced = critique.toLowerCase().includes('but') ||
                              critique.toLowerCase().includes('yet') ||
                              critique.toLowerCase().includes('although') ||
                              critique.toLowerCase().includes('however')
          const passed = wordCount >= 15 && hasBalanced
          return {
            passed,
            feedback: passed
              ? 'Good balanced critique with nuanced reasoning.'
              : 'Critique needs more balance (show both positives and negatives) and detail.'
          }
        })
        setResults(fallbackResults)
        const totalScore = fallbackResults.filter(r => r.passed).length
        setScore(totalScore)
        sessionStorage.setItem('remedial_step4_b2_taskB_score', totalScore)
        await logTaskCompletion(totalScore)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback on error
      const fallbackResults = critiques.map((critique) => {
        const wordCount = critique.trim().split(/\s+/).length
        const hasBalanced = critique.toLowerCase().includes('but') ||
                            critique.toLowerCase().includes('yet') ||
                            critique.toLowerCase().includes('although')
        const passed = wordCount >= 15 && hasBalanced
        return {
          passed,
          feedback: passed ? 'Critique accepted.' : 'Needs more balance and detail.'
        }
      })
      setResults(fallbackResults)
      const totalScore = fallbackResults.filter(r => r.passed).length
      setScore(totalScore)
      sessionStorage.setItem('remedial_step4_b2_taskB_score', totalScore)
      await logTaskCompletion(totalScore)
    }

    setEvaluating(false)
    setSubmitted(true)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'B2',
          task: 'B',
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
    navigate('/phase4/step/4/remedial/b2/taskC')
  }

  const allFilled = critiques.every(c => c.trim().length > 0)
  const progress = ((currentIndex + 1) / CRITIQUE_TERMS.length) * 100

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header - Kahoot-inspired colors */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Task B: Critique Game 🎯
        </Typography>
        <Typography variant="body1">
          Kahoot-style critique challenge! Write balanced, nuanced critiques of advertising terms.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Time to think critically! For each advertising term, write a balanced critique that shows BOTH strengths and weaknesses. Use advanced vocabulary and demonstrate nuanced reasoning. Remember: good critiques acknowledge positives before highlighting concerns!"
        />
      </Paper>

      {!submitted ? (
        <Box>
          {/* Progress Bar - Kahoot style */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
              Term {currentIndex + 1} of {CRITIQUE_TERMS.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 1,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #9c27b0 0%, #673ab7 100%)'
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {CRITIQUE_TERMS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: idx < currentIndex ? '#4caf50' :
                                    idx === currentIndex ? '#9c27b0' : '#e0e0e0'
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Term - Kahoot-style card */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
            }}
          >
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h3" color="white" fontWeight="bold">
                {currentTerm.term}
              </Typography>
            </Box>

            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              Write your balanced critique:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={critiques[currentIndex]}
              onChange={(e) => handleCritiqueChange(e.target.value)}
              placeholder="Write a balanced critique showing both strengths and weaknesses using advanced vocabulary..."
              variant="outlined"
              helperText={`Word count: ${critiques[currentIndex].trim().split(/\s+/).filter(w => w).length} (aim for 20-30 words)`}
            />

            {/* Hint */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                💡 Include in your critique:
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight="medium">
                {currentTerm.keywords.join(', ')}
              </Typography>
              <Typography variant="caption" color="text.primary" sx={{ display: 'block', mt: 1 }}>
                Use connecting words: "but", "yet", "although", "however" to show balance
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

              {currentIndex < CRITIQUE_TERMS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!critiques[currentIndex].trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
                  }}
                >
                  Next Term →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!allFilled || evaluating}
                >
                  {evaluating ? 'Evaluating...' : 'Submit Critiques 🎯'}
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Jump to term:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {CRITIQUE_TERMS.map((term, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant={idx === currentIndex ? 'contained' : 'outlined'}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: 60,
                    ...(idx === currentIndex && {
                      background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
                    })
                  }}
                >
                  {term.term.slice(0, 4)}... {critiques[idx].trim() && '✓'}
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
              {score === 6 ? '🎯 Perfect Critiques! 🎯' : '🌟 Critiques Complete! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Answer Review */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Critique Review:
            </Typography>
            <Stack spacing={2}>
              {CRITIQUE_TERMS.map((term, index) => {
                const result = results[index]
                return (
                  <Alert key={index} severity={result.passed ? 'success' : 'warning'}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {term.term}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Your critique: "{critiques[index]}"
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }} color={result.passed ? 'success.dark' : 'warning.dark'}>
                      {result.feedback}
                    </Typography>
                    {!result.passed && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Model critique: {term.modelCritique}
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
              Continue to Task C →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
