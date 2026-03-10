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
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Interaction 3: Revise & Improve
 * Play Sushi Spell again, then improve ONE sentence from original caption using a new term
 */

const TARGET_WORDS = ['hashtag', 'caption', 'emoji', 'tag', 'call-to-action']

export default function Phase4_2Step2Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 3, context: 'main' })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [revision, setRevision] = useState('')
  const [originalCaption, setOriginalCaption] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Get the caption from first interaction
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

  const handleGameComplete = (result) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: result })
    console.log('Sushi Spell completed:', result)
    setGameCompleted(true)
    setGameResult(result)
  }

  const handleSubmit = async () => {
    if (!revision.trim()) {
      alert('Please provide your revised sentence.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/4_2/step2/evaluate-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          interaction: 3,
          revision: revision.trim(),
          original_caption: originalCaption
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
        sessionStorage.setItem('phase4_2_step2_int3_score', data.score || 1)
        sessionStorage.setItem('phase4_2_step2_int3_revision', revision.trim())
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
      const revisionLower = revision.toLowerCase()
      const wordCount = revision.trim().split(/\s+/).length

      // Check for social media terms (especially new ones)
      const hasSocialTerm = /\b(hashtag|emoji|tag|call-to-action|cta|engagement|viral|reach|organic|immersive|experience|community|network|amplif|discover)\b/i.test(revision)

      // Check for improvement language
      const showsImprovement = /\b(add|replace|improve|change|use|integrate|include|enhance)\b/i.test(revision)

      // Check for sophisticated vocabulary
      const hasSophisticatedVocab = /\b(immersive|experience|authentic|network effects|global community|amplif|organic reach|strategic|viral loop)\b/i.test(revision)

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated revision with advanced vocabulary
      if (wordCount >= 12 && hasSocialTerm && showsImprovement && hasSophisticatedVocab) {
        score = 5
        level = 'C1'
        feedback = 'Outstanding! Your revision demonstrates sophisticated understanding of social media marketing. You integrated advanced vocabulary and showed how to strategically improve engagement. This shows C1-level mastery of promotional writing and social media strategy.'
      }
      // B2: 4 points - Strategic revision with strong vocabulary
      else if (wordCount >= 10 && hasSocialTerm && showsImprovement &&
               (revisionLower.includes('immersive') || revisionLower.includes('experience') ||
                revisionLower.includes('appeal') || revisionLower.includes('engagement'))) {
        score = 4
        level = 'B2'
        feedback = 'Excellent! Your revision shows strategic thinking about how to improve the post. You used strong social media vocabulary to create more compelling content. To reach C1, integrate concepts like "network effects" or "viral loops" into your revision.'
      }
      // B1: 3 points - Clear revision with new term
      else if (wordCount >= 8 && hasSocialTerm && showsImprovement) {
        score = 3
        level = 'B1'
        feedback = 'Good! You clearly showed how to improve the caption and used social media vocabulary. To reach B2, use more sophisticated terms like "immersive experience", "authentic", or "compelling content".'
      }
      // A2: 2 points - Basic revision attempt
      else if (wordCount >= 5 && (hasSocialTerm || showsImprovement)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You attempted to revise the caption. To improve, be more specific about WHAT you would change and WHY. Use social media terms like "engagement", "call-to-action", or "hashtag".'
      }
      // A1: 1 point - Very basic attempt
      else if (wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'Basic attempt. Try to explain HOW you would improve a sentence from your caption. Example: "Add call-to-action: Join us!" or "Replace fun with immersive experience".'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please write a longer revision. Show how you would improve ONE sentence from your caption using new social media vocabulary. Example: "Replace \'fun festival\' with \'immersive cultural experience\' for stronger appeal."'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_2_step2_int3_score', score)
        sessionStorage.setItem('phase4_2_step2_int3_revision', revision.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // Calculate total score from all 3 interactions in Step 2
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step2_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step2_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step2_int3_score') || '0')

    const totalScore = int1Score + int2Score + int3Score
    const totalMax = 15 // Each interaction max = 5
    const percentage = (totalScore / totalMax) * 100

    // Store total score for Step 2
    sessionStorage.setItem('phase4_2_step2_total_score', totalScore.toString())
    sessionStorage.setItem('phase4_2_step2_total_max', totalMax.toString())
    sessionStorage.setItem('phase4_2_step2_percentage', percentage.toFixed(2))

    console.log(`[Phase 4.2 Step 2 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    // Route based on 80% threshold
    if (percentage >= 80) {
      console.log('[Phase 4.2 Step 2] ≥80% → Proceeding to Step 3')
      navigate('/app/phase4_2/step/3/interaction/1')
    } else {
      console.log('[Phase 4.2 Step 2] <80% → Need to retry')
      alert(`Your score was ${percentage.toFixed(1)}%. You need 80% or higher to proceed to Step 3. Please review the material and try again.`)
      navigate('/app/phase4_2/step/2/interaction/1')
    }
  }

  const wordCount = revision.trim().split(/\s+/).filter(w => w.length > 0).length

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Interaction 3
        </Typography>
        <Typography variant="body1">
          Revise & improve your post
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Revise your post after the game."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Play Sushi Spell again to practice social media vocabulary
        </Typography>
        <Typography variant="body2">
          2. Improve ONE sentence from your original caption using a new term
        </Typography>
      </Alert>

      {/* Show Original Caption */}
      {originalCaption && (
        <Card elevation={2} sx={{ mb: 3, backgroundColor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
              Your Original Instagram Caption:
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'white' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {originalCaption}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Sushi Spell Game */}
      {!gameCompleted && (
        <Box sx={{ mb: 4 }}>
          <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
        </Box>
      )}

      {/* Game Complete Message */}
      {gameCompleted && !submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography>
            ✓ Sushi Spell completed! You spelled {gameResult?.foundWords?.length || 0} words. Now revise your caption below.
          </Typography>
        </Alert>
      )}

      {/* Revision Area */}
      {gameCompleted && !submitted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Revise & Improve Your Caption
          </Typography>

          <Card elevation={1} sx={{ mb: 3, backgroundColor: 'success.lighter' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="success.dark">
                Example Revisions:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>A2:</strong> "Add emoji 😊"
                </Typography>
                <Typography variant="body2">
                  <strong>B1:</strong> "Add call-to-action: 'Join us!'"
                </Typography>
                <Typography variant="body2">
                  <strong>B2:</strong> "Replace 'fun' with 'immersive experience' for stronger appeal."
                </Typography>
                <Typography variant="body2">
                  <strong>C1:</strong> "Integrate 'network effects' into CTA: 'Tag friends to expand our global community!'"
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Show how you would improve ONE sentence from your caption. Use new social media vocabulary you learned from Sushi Spell..."
            value={revision}
            onChange={(e) => setRevision(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {wordCount}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={/\b(add|replace|improve|change|integrate)\b/i.test(revision) ? "✓ Shows improvement" : "Add improvement"}
                color={/\b(add|replace|improve|change|integrate)\b/i.test(revision) ? "success" : "default"}
                size="small"
              />
              <Chip
                label={/\b(hashtag|emoji|tag|call-to-action|engagement|viral|immersive|experience)\b/i.test(revision) ? "✓ Uses new term" : "Use new term"}
                color={/\b(hashtag|emoji|tag|call-to-action|engagement|viral|immersive|experience)\b/i.test(revision) ? "success" : "default"}
                size="small"
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit}
            disabled={loading || !revision.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Revision'}
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
                {evaluation.success ? 'Revision Submitted!' : 'Try Again'}
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

          {/* Show user's revision */}
          <Card elevation={2} sx={{ mb: 2, backgroundColor: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Your Revision:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                  {revision}
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
            Return to Dashboard
          </Button>
        </Paper>
      )}
    </Box>
  )
}
