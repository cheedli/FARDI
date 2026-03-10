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
 * Phase 4.2 Step 2 - Level C1 - Task D: Critique Game
 * Critique 6 post elements with nuanced analysis
 */

const POST_ELEMENTS = [
  {
    id: 1,
    element: 'Hashtag Strategy',
    description: 'Using #food #yummy #delicious #tasty #foodie #instafood #foodporn #foodstagram #foodlover #foodgasm',
    prompt: 'Critique this hashtag strategy with nuanced analysis:'
  },
  {
    id: 2,
    element: 'Caption',
    description: 'Check out this event! It will be awesome. Come join us.',
    prompt: 'Critique this caption and suggest improvements:'
  },
  {
    id: 3,
    element: 'Emoji Usage',
    description: 'Global Cultures Festival 😀😀😀😀😀😀😀😀😀😀',
    prompt: 'Critique this emoji usage and suggest better alternatives:'
  },
  {
    id: 4,
    element: 'Call-to-Action',
    description: 'Maybe you could come if you want to.',
    prompt: 'Critique this call-to-action and rewrite it more effectively:'
  },
  {
    id: 5,
    element: 'Tagging Strategy',
    description: 'No user tags or location tags included in the post.',
    prompt: 'Critique this lack of tagging and explain its impact:'
  },
  {
    id: 6,
    element: 'Overall Post Coherence',
    description: 'A post with great visuals but generic caption, random hashtags, excessive emojis, weak CTA, and no tags.',
    prompt: 'Provide a comprehensive critique of this post structure:'
  }
]

export default function Phase4_2Step2RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleCritiqueChange = (id, text) => {
    setCritiques({ ...critiques, [id]: text })
  }

  const handleSubmit = () => {
    setShowResults(true)

    // Calculate score based on critique quality (word count and completeness)
    let totalScore = 0
    POST_ELEMENTS.forEach(element => {
      const critique = critiques[element.id] || ''
      const wordCount = critique.trim().split(/\s+/).filter(w => w.length > 0).length
      // Award points based on length and quality (max 10 points total, ~1.67 per critique)
      const itemScore = Math.min(wordCount / 30, 1.67)
      totalScore += itemScore
    })

    const finalScore = Math.min(totalScore, 10)

    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskD_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_c1_taskD_max', '10')

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
          step: 2,
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
    navigate('/phase4_2/step/2/remedial/c1/taskE')
  }

  const allCompleted = POST_ELEMENTS.every(element => {
    const critique = critiques[element.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 25
  })

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task D: Critique Game
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Demonstrate your mastery by providing nuanced critiques of these Instagram post elements. Analyze each element critically, identify weaknesses, and suggest sophisticated improvements. This requires advanced analytical thinking and deep understanding of social media strategy."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Critique each of the 6 post elements with detailed, nuanced analysis (minimum 25 words each).
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>What to include:</strong> Identify weaknesses, explain impact on engagement, suggest specific improvements, and justify your recommendations.
        </Typography>
      </Paper>

      {/* Critique Tasks */}
      <Box sx={{ mb: 4 }}>
        {POST_ELEMENTS.map((element, index) => {
          const wordCount = (critiques[element.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length

          return (
            <Card key={element.id} elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Element {index + 1} of {POST_ELEMENTS.length}: {element.element}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'warning.lighter', border: 1, borderColor: 'warning.main' }}>
                  <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                    POST ELEMENT TO CRITIQUE:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'warning.dark' }}>
                    {element.description}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  {element.prompt}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={critiques[element.id] || ''}
                  onChange={(e) => handleCritiqueChange(element.id, e.target.value)}
                  placeholder="Write your detailed critique here... Identify specific weaknesses, analyze the impact on engagement and reach, and suggest concrete improvements with justification."
                  variant="outlined"
                  disabled={showResults}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  color={wordCount >= 25 ? "success.main" : "text.secondary"}
                  sx={{ fontWeight: wordCount >= 25 ? 'bold' : 'normal' }}
                >
                  Words: {wordCount} {wordCount >= 25 && '✓'}
                </Typography>
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
            You've provided nuanced critiques for all {POST_ELEMENTS.length} post elements. Excellent demonstration of advanced analytical thinking and social media strategy expertise!
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
          Please complete all critiques (minimum 25 words each)
        </Typography>
      )}
    </Box>
  )
}
