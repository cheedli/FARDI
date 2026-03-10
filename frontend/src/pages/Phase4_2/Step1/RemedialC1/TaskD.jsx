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
 * Phase 4.2 Step 1 - Level C1 - Task D: Critique Game
 * Critique 6 social media term uses in sentences
 */

const SENTENCES_TO_CRITIQUE = [
  {
    id: 1,
    sentence: 'The company posted on social media to get more followers.',
    term: 'organic reach',
    issue: 'Too vague - should specify strategy and metrics'
  },
  {
    id: 2,
    sentence: 'We used influencers because they are popular.',
    term: 'engagement rate',
    issue: 'Lacks analysis of effectiveness and ROI'
  },
  {
    id: 3,
    sentence: 'The viral video was successful.',
    term: 'viral content',
    issue: 'Does not explain why it went viral or metrics'
  },
  {
    id: 4,
    sentence: 'Analytics showed good numbers.',
    term: 'conversion analytics',
    issue: 'Too generic - needs specific metrics and interpretation'
  },
  {
    id: 5,
    sentence: 'We did targeting for our ads.',
    term: 'audience segmentation',
    issue: 'Lacks detail about criteria and strategy'
  },
  {
    id: 6,
    sentence: 'The post got a lot of engagement.',
    term: 'engagement metrics',
    issue: 'Does not specify types or quality of engagement'
  }
]

export default function Phase4_2RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleCritiqueChange = (id, text) => {
    setCritiques({ ...critiques, [id]: text })
  }

  const handleSubmit = () => {
    setShowResults(true)

    // Calculate score based on critique quality (word count)
    let totalScore = 0
    SENTENCES_TO_CRITIQUE.forEach(item => {
      const critique = critiques[item.id] || ''
      const wordCount = critique.trim().split(/\s+/).filter(w => w.length > 0).length
      // Award points based on critique length (max 10 points total, ~1.67 per critique)
      const itemScore = Math.min(wordCount / 20, 1.67)
      totalScore += itemScore
    })

    const finalScore = Math.min(totalScore, 10)

    sessionStorage.setItem('phase4_2_remedial_c1_taskD_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_c1_taskD_max', '10')

    logTaskCompletion(finalScore, 10)
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
          step: 1,
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
    navigate('/phase4_2/step/1/remedial/c1/taskE')
  }

  const allCritiqued = SENTENCES_TO_CRITIQUE.every(item => {
    const critique = critiques[item.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 15
  })

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 1 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task D: Critique Game
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Critique these vague social media statements. Identify what's missing, explain why the term is used poorly, and suggest specific improvements using C1-level vocabulary and analytical thinking."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> For each sentence, write a critique (minimum 15 words) explaining what's wrong and how to improve it.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Focus on:</strong> Lack of specificity, missing metrics, vague terminology, and absence of strategic analysis.
        </Typography>
      </Paper>

      {/* Critique Tasks */}
      <Box sx={{ mb: 4 }}>
        {SENTENCES_TO_CRITIQUE.map((item, index) => {
          const wordCount = (critiques[item.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length

          return (
            <Card key={item.id} elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Sentence {index + 1} of {SENTENCES_TO_CRITIQUE.length}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'grey.100' }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{item.sentence}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Key term to consider: <strong>{item.term}</strong>
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" gutterBottom>
                  Your critique (minimum 15 words):
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={critiques[item.id] || ''}
                  onChange={(e) => handleCritiqueChange(item.id, e.target.value)}
                  placeholder="Critique this sentence: What's missing? What's vague? How could it be improved? Use specific examples and sophisticated terminology..."
                  variant="outlined"
                  disabled={showResults}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  color={wordCount >= 15 ? "success.main" : "text.secondary"}
                  sx={{ fontWeight: wordCount >= 15 ? 'bold' : 'normal' }}
                >
                  Words: {wordCount} {wordCount >= 15 && '✓'}
                </Typography>

                {showResults && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Suggested focus:</Typography>
                    <Typography variant="body2">{item.issue}</Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Critique Task Complete!
          </Typography>
          <Typography>
            You've analyzed all {SENTENCES_TO_CRITIQUE.length} sentences. Your critiques demonstrate critical thinking and analytical skills.
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
            disabled={!allCritiqued}
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

      {!showResults && !allCritiqued && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          Please provide critiques for all sentences (minimum 15 words each)
        </Typography>
      )}
    </Box>
  )
}
