import React, { useState, useEffect } from 'react'
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Interaction 2: Explain Engagement Element
 * Students explain ONE element (hashtag, emoji, or CTA) and why it works
 */

export default function Phase4_2Step2Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 2, context: 'main' })
  const [explanation, setExplanation] = useState('')
  const [originalCaption, setOriginalCaption] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Get the caption from previous interaction
    const caption = sessionStorage.getItem('phase4_2_step2_int1_caption')
    if (caption) {
      setOriginalCaption(caption)
    } else {
      // Set a default caption for testing if none found
      setOriginalCaption('Sample Instagram caption for testing purposes. Join us at the Global Cultures Festival! 🌍 #GlobalCultures #Festival')
      // If no caption found, redirect back to interaction 1
      // navigate('/phase4_2/step/2/interaction/1')
    }
  }, [navigate])

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      alert('Please explain what makes your post engaging.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 2,
          explanation: explanation.trim(),
          caption: originalCaption
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          details: data.details || {}
        })
        setSubmitted(true)
        sessionStorage.setItem('phase4_2_step2_int2_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int2_explanation', explanation.trim())
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

      // Fallback evaluation
      const explanationLower = explanation.toLowerCase()
      const wordCount = explanation.trim().split(/\s+/).length

      // Check for engagement elements mentioned
      const mentionsHashtag = /\b(hashtag|#)\b/i.test(explanation)
      const mentionsEmoji = /\b(emoji|emoticon|smiley)\b/i.test(explanation)
      const mentionsCTA = /\b(call-to-action|cta|tag|join|come|share|save)\b/i.test(explanation)

      // Check for reasoning
      const hasReasoning = /\b(because|since|so|that|makes|creates|helps|increases)\b/i.test(explanation)

      // Check for social media vocabulary
      const hasSocialVocab = /\b(viral|engagement|reach|audience|discoverability|conversion|organic|network)\b/i.test(explanation)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated analysis
      if (wordCount >= 20 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
          hasReasoning && hasSocialVocab &&
          (explanationLower.includes('network') || explanationLower.includes('viral loop') ||
           explanationLower.includes('amplif') || explanationLower.includes('organic reach') ||
           explanationLower.includes('strategic'))) {
        score = 5
        level = 'C1'
        feedback = 'Outstanding! Your explanation demonstrates sophisticated understanding of social media strategy. You articulated how engagement elements create network effects and amplify reach. This shows C1-level mastery of marketing vocabulary and strategic thinking.'
      }
      // B2: 4 points - Strategic explanation
      else if (wordCount >= 15 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
               hasReasoning && hasSocialVocab) {
        score = 4
        level = 'B2'
        feedback = 'Excellent! You provided a strategic explanation of how the engagement element works, using appropriate social media vocabulary. To reach C1, discuss broader concepts like network effects, viral loops, or algorithmic amplification.'
      }
      // B1: 3 points - Clear explanation with reasoning
      else if (wordCount >= 10 && (mentionsHashtag || mentionsEmoji || mentionsCTA) &&
               hasReasoning) {
        score = 3
        level = 'B1'
        feedback = 'Good! You clearly explained which element you used and provided reasoning. To improve, use more social media vocabulary terms like "engagement", "reach", "viral", or "organic growth".'
      }
      // A2: 2 points - Basic mention with simple reasoning
      else if (wordCount >= 5 && (mentionsHashtag || mentionsEmoji || mentionsCTA)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You mentioned an engagement element. To improve, explain WHY it works using words like "because", "so", or "helps". Example: "Hashtags help because people can discover the post."'
      }
      // A1: 1 point - Very basic attempt
      else if (wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'Basic attempt. Try to explain which element (hashtag, emoji, or call-to-action) makes your post engaging and WHY it helps. Use words like "because" or "so".'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a longer explanation. Mention which element (hashtag, emoji, or CTA) you used and explain why it makes the post engaging. Example: "The hashtag #GlobalCultures helps because more people can find our post."'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int2_score', score)
        sessionStorage.setItem('phase4_2_step2_int2_explanation', explanation.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4_2/step/2/interaction/3')
  }

  const wordCount = explanation.trim().split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 2
        </Typography>
        <Typography variant="body1">
          Explain what makes your post engaging
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="What makes your post engaging?"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Look at your Instagram caption below
        </Typography>
        <Typography variant="body2">
          2. Explain ONE element (hashtag, emoji, or call-to-action) and WHY it makes your post engaging
        </Typography>
      </Alert>

      {/* Show Original Caption */}
      {originalCaption && (
        <Card elevation={2} sx={{ mb: 3, backgroundColor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
              Your Instagram Caption:
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'white' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {originalCaption}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Explanation Area */}
      {!submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Explain Your Engagement Element
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Explain which element (hashtag, emoji, or call-to-action) makes your post engaging and WHY it works..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {wordCount}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={/\b(hashtag|emoji|call-to-action|cta|tag)\b/i.test(explanation) ? "✓ Mentions element" : "Add element"}
                color={/\b(hashtag|emoji|call-to-action|cta|tag)\b/i.test(explanation) ? "success" : "default"}
                size="small"
              />
              <Chip
                label={/\b(because|since|so|helps|makes)\b/i.test(explanation) ? "✓ Has reasoning" : "Add reasoning"}
                color={/\b(because|since|so|helps|makes)\b/i.test(explanation) ? "success" : "default"}
                size="small"
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
            disabled={loading || !explanation.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Explanation'}
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
                {evaluation.success ? 'Explanation Submitted!' : 'Try Again'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label={`Level: ${evaluation.level}`} color="primary" sx={{ mr: 1 }} />
                <Chip label={`Score: +${evaluation.score} point${evaluation.score !== 1 ? 's' : ''}`} color="success" />
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {/* Show user's explanation */}
          <Card elevation={2} sx={{ mb: 2, backgroundColor: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Your Explanation:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {explanation}
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
