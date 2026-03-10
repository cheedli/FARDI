import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Interaction 2: Social Media Post Discussion
 * Students suggest ideas for social media posts inspired by examples
 */

const GLOSSARY_TERMS = [
  'hashtag',
  'caption',
  'call-to-action',
  'engagement',
  'viral',
  'tag',
  'emoji',
  'story'
]

export default function Phase4_2Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'main' })
  const [response, setResponse] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!response.trim()) {
      alert('Please write your social media post idea.')
      return
    }

    setLoading(true)

    try {
      const apiResponse = await fetch('/api/phase4_2/step1/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 2,
          response: response.trim()
        })
      })

      const data = await apiResponse.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          details: data.details || {}
        })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step1_int2_score', data.score || 1)
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: data.feedback || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on CEFR criteria
      const responseLower = response.toLowerCase()
      const wordCount = response.trim().split(/\s+/).length
      const sentenceCount = response.split(/[.!?]+/).filter(s => s.trim().length > 0).length

      // Check for social media elements
      const mentionsPost = /\b(post|caption|instagram|twitter|facebook|social media)\b/i.test(response)
      const mentionsHashtag = /\b(hashtag|#)\b/i.test(response)
      const mentionsEmoji = /\b(emoji)\b/i.test(response) || /[\u{1F300}-\u{1F9FF}]/u.test(response)
      const mentionsCallToAction = /\b(call-to-action|call to action|join|visit|tag|share|save)\b/i.test(response)
      const mentionsEngagement = /\b(engagement|viral|like|share|comment|reach|audience|people)\b/i.test(response)

      // Count vocabulary terms used
      const termsUsed = GLOSSARY_TERMS.filter(term => {
        const regex = new RegExp('\\b' + term.replace(/-/g, '[-\\s]') + '\\b', 'i')
        return regex.test(response)
      }).length

      // Check for reasoning
      const hasReasoning = /\b(because|since|so|to|for|will|can|make|increase|attract|drive)\b/i.test(response)
      const hasComparison = /\b(like the example|similar to|based on|inspired by)\b/i.test(response)
      const hasStrategicThinking = /\b(strategy|discoverability|conversions|emotional connection|brand|visibility|reach|amplify)\b/i.test(response)
      const hasAdvancedVocab = /\b(leverage|optimize|maximize|resonate|cultivate|foster|enhance|align|strategic)\b/i.test(response)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Strategic analysis with advanced terminology
      if (wordCount >= 20 && termsUsed >= 3 &&
          mentionsPost && hasReasoning &&
          (hasStrategicThinking || hasAdvancedVocab) &&
          (mentionsCallToAction || mentionsEngagement)) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your response demonstrates sophisticated understanding of social media strategy. You used advanced terminology to analyze how posts work, explained strategic elements like hashtag discoverability or call-to-action conversions, and showed deep insight into audience engagement mechanics. This reflects C1-level analytical and persuasive writing.'
      }
      // B2: 4 points - Detailed explanation with comparison
      else if (wordCount >= 15 && termsUsed >= 2 &&
               mentionsPost && hasReasoning &&
               (hasComparison || mentionsEngagement || mentionsCallToAction)) {
        score = 4
        level = 'B2'
        feedback = 'Very good! You provided a detailed explanation of a social media post idea with clear reasoning. You referenced the examples effectively, used multiple social media terms, and explained how specific elements (hashtags, emojis, calls-to-action) work to drive engagement. To reach C1, incorporate more strategic language about brand alignment or conversion mechanics.'
      }
      // B1: 3 points - Clear explanation with reasoning
      else if (wordCount >= 10 && termsUsed >= 1 &&
               mentionsPost && hasReasoning &&
               (mentionsHashtag || mentionsCallToAction || mentionsEngagement)) {
        score = 3
        level = 'B1'
        feedback = 'Good! You clearly explained a social media post idea and provided reasoning for why it would work. You used at least one key term and connected it to engagement or reach. To improve, add more details about specific elements (hashtags, emojis, captions) and explain their strategic purpose.'
      }
      // A2: 2 points - Simple idea with connector
      else if (wordCount >= 5 && hasReasoning &&
               (mentionsPost || mentionsHashtag || mentionsEmoji)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You suggested a basic social media post idea and used a connector (like "because"). Try to expand by mentioning specific elements: What hashtags would you use? What would the caption say? Why would it attract people?'
      }
      // A1: 1 point - Very basic attempt
      else if (wordCount >= 2 && (mentionsPost || mentionsHashtag)) {
        score = 1
        level = 'A1'
        feedback = 'You made a basic attempt. Try to write more: Start with "Like the example, we can make a post with..." then add details about hashtags, captions, or emojis, and explain why it would work.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please suggest a social media post idea. Start with "Like the example, we can make a post with..." and mention elements like hashtags, captions, or calls-to-action.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback,
        termsUsed
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step1_int2_score', score)
        console.log(`[Phase 4.2 Step 1 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/1/interaction/3')
  }

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Discuss Social Media Post Ideas
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="Great! Now that we've activated some vocabulary with the game, inspired by the social media examples, how can posts attract our audience for the Global Cultures Festival?"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Suggest one idea for a social media post (Instagram caption, Twitter thread, etc.) based on the examples, and explain why it works.
        </Typography>
        <Typography variant="body2">
          Incorporate social media vocabulary terms: hashtag, caption, call-to-action, engagement, viral, tag, emoji, story
        </Typography>
      </Alert>

      {/* Vocabulary Reference */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          <TipsAndUpdatesIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Use These Social Media Terms:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {GLOSSARY_TERMS.map((term, index) => (
            <Chip
              key={index}
              label={term}
              color="warning"
              variant="outlined"
              size="small"
            />
          ))}
        </Stack>
      </Paper>


      {/* Writing Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Your Social Media Post Idea
          </Typography>

          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Hint:</strong> Start with "Like the example, we can make a post with..."
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Suggest a social media post idea and explain why it would attract the audience..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {wordCount}
            </Typography>
            <Typography variant="caption" color={wordCount >= 10 ? 'success.main' : 'text.secondary'}>
              {wordCount >= 10 ? '✓ Good length' : 'Try to write at least 10 words'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !response.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Response'}
          </Button>
        </Paper>
      )}

      {/* Evaluation Results */}
      {evaluation && submitted && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: 2,
            borderColor: evaluation.success ? 'success.main' : 'warning.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? 'success.main' : 'warning.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.dark' : 'warning.dark'}>
                {evaluation.success ? 'Response Submitted!' : 'Try Again'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label={`Level: ${evaluation.level}`} color="primary" sx={{ mr: 1 }} />
                <Chip label={`Score: +${evaluation.score} point${evaluation.score !== 1 ? 's' : ''}`} color="success" />
                {evaluation.termsUsed !== undefined && (
                  <Chip label={`Terms Used: ${evaluation.termsUsed}`} color="info" sx={{ ml: 1 }} />
                )}
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {/* Show user's response */}
          <Card elevation={2} sx={{ mb: 2, backgroundColor: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Your Response:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {response}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
          >
            Continue to Next Activity
          </Button>
        </Paper>
      )}
    </Box>
  )
}
