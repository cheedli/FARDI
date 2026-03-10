import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task D: Critique Kahoot (Critique Game)
 * Critique 6 social media elements with nuanced, balanced analysis
 */

const ELEMENTS = [
  {
    id: 1,
    element: 'Hashtag',
    expectedCritique: 'Powerful for reach but overuse reduces efficacy'
  },
  {
    id: 2,
    element: 'Caption',
    expectedCritique: 'Concise is optimal; lengthy captions lose attention'
  },
  {
    id: 3,
    element: 'Emoji',
    expectedCritique: 'Enhances tone but excess appears unprofessional'
  },
  {
    id: 4,
    element: 'Call-to-Action',
    expectedCritique: 'Direct CTAs convert; vague ones fail'
  },
  {
    id: 5,
    element: 'Tagging',
    expectedCritique: 'Strategic tagging expands reach; random tagging annoys'
  },
  {
    id: 6,
    element: 'Viral Content',
    expectedCritique: 'Highly desirable but largely unpredictable'
  }
]

export default function Phase4_2Step3RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (id, text) => {
    setCritiques({ ...critiques, [id]: text })
  }

  const evaluateCritique = (userCritique, element) => {
    const critique = userCritique.toLowerCase()

    // Keywords indicating balanced critique
    const positiveIndicators = ['powerful', 'effective', 'enhances', 'optimal', 'desirable', 'strategic', 'expands', 'converts']
    const negativeIndicators = ['overuse', 'excess', 'lengthy', 'vague', 'random', 'unpredictable', 'fails', 'reduces', 'lose']
    const balanceIndicators = ['but', 'however', 'although', 'yet', 'while']

    const hasPositive = positiveIndicators.some(word => critique.includes(word))
    const hasNegative = negativeIndicators.some(word => critique.includes(word))
    const hasBalance = balanceIndicators.some(word => critique.includes(word))

    // Award point if critique is balanced (has both positive and negative)
    return (hasPositive && hasNegative) || hasBalance
  }

  const handleSubmit = () => {
    let correctCount = 0
    ELEMENTS.forEach(element => {
      const userCritique = critiques[element.id] || ''
      if (evaluateCritique(userCritique, element.element)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    sessionStorage.setItem('phase4_2_step3_c1_taskD_score', correctCount)

    logTaskCompletion(correctCount, ELEMENTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'D',
          score: score,
          max_score: maxScore,
          critiques: critiques
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskE')
  }

  const allCompleted = ELEMENTS.every(element => {
    const critique = critiques[element.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 8
  })

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task D: Critique Kahoot
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Provide nuanced, balanced critiques of 6 social media elements. Each critique should acknowledge both strengths and limitations. Demonstrate sophisticated analytical thinking by examining multiple perspectives. Avoid one-sided judgments!"
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write balanced critiques for each element (minimum 8 words each). Include both positive aspects and limitations.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Critique structure:</strong> [Positive aspect] + [Transition word like 'but', 'however'] + [Limitation or caveat]
        </Typography>
      </Paper>

      {/* Example Critiques */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
            Example Balanced Critiques:
          </Typography>
          {ELEMENTS.map((element, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2 }}>
              <strong>{element.element}:</strong> {element.expectedCritique}
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Critique Tasks */}
      <Box sx={{ mb: 4 }}>
        {ELEMENTS.map((element, index) => {
          const wordCount = (critiques[element.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
          const isBalanced = showResults && evaluateCritique(critiques[element.id] || '', element.element)

          return (
            <Card key={element.id} elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Element {index + 1} of {ELEMENTS.length}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'primary.lighter' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Critique: {element.element}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Provide a balanced analysis that examines both strengths and limitations
                  </Typography>
                </Paper>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={critiques[element.id] || ''}
                  onChange={(e) => handleCritiqueChange(element.id, e.target.value)}
                  placeholder="Write a balanced critique that acknowledges both positive aspects and limitations..."
                  variant="outlined"
                  disabled={showResults}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  color={wordCount >= 8 ? "success.main" : "text.secondary"}
                  sx={{ fontWeight: wordCount >= 8 ? 'bold' : 'normal' }}
                >
                  Words: {wordCount} {wordCount >= 8 && '✓'}
                </Typography>

                {showResults && (
                  <Alert severity={isBalanced ? "success" : "info"} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {isBalanced ? '✓ Well-balanced critique!' : 'Example balanced critique:'}
                    </Typography>
                    <Typography variant="body2">
                      {element.expectedCritique}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={score >= 5 ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Critique Task Complete!
          </Typography>
          <Typography>
            You provided {score}/{ELEMENTS.length} balanced critiques ({((score / ELEMENTS.length) * 100).toFixed(0)}%)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {score >= 5 ? 'Excellent nuanced analysis with balanced perspectives!' : 'Try to include both strengths and limitations in each critique.'}
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
            disabled={!allCompleted}
          >
            Submit Critiques
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
            Continue to Task E
          </Button>
        )}
      </Box>

      {!showResults && !allCompleted && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          Please complete all critiques (minimum 8 words each)
        </Typography>
      )}
    </Box>
  )
}
