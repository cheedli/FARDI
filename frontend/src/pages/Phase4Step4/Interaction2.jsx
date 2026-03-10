import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 Interaction 2: Video Script Writing
 * Students write a 4-8 sentence video script using guided template with examples
 */

export default function Phase4Step4Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 2, context: 'main' })
  const [script, setScript] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!script.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please write your video script using the template.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step4/evaluate-video-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          script: script.trim()
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

        // Store score for later
        sessionStorage.setItem('phase4_step4_interaction2_score', data.score || 1)
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
      const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = script.split(/\s+/).length
      const scriptLower = script.toLowerCase()

      // Check for template elements
      const hasOpening = scriptLower.includes('video') && (scriptLower.includes('open') || scriptLower.includes('start') || scriptLower.includes('begin'))
      const hasAnimation = scriptLower.includes('animation') || scriptLower.includes('clip') || scriptLower.includes('sketch')
      const hasJingle = scriptLower.includes('jingle')
      const hasDramatisation = scriptLower.includes('dramatisation') || scriptLower.includes('dramatization') || scriptLower.includes('show')
      const hasCharacter = scriptLower.includes('character') || scriptLower.includes('student') || scriptLower.includes('people')
      const hasGoal = scriptLower.includes('goal') || scriptLower.includes('discover') || scriptLower.includes('unity')
      const hasObstacle = scriptLower.includes('obstacle') || scriptLower.includes('overcome') || scriptLower.includes('shy')
      const hasFeatures = scriptLower.includes('feature') || scriptLower.includes('detail')
      const hasDate = scriptLower.includes('march') || scriptLower.includes('date')
      const hasCallToAction = scriptLower.includes('come') || scriptLower.includes('join') || scriptLower.includes('don\'t miss')

      // Grammar indicators
      const hasTenseConsistency = true // Simplified check
      const hasSubjectVerb = /\b(video|scene|script)\s+(open|start|show|feature)/i.test(script)

      // Advanced vocabulary indicators
      const hasAdvancedVocab = scriptLower.includes('autonomous') || scriptLower.includes('commence') ||
                              scriptLower.includes('seamless') || scriptLower.includes('nuanced') ||
                              scriptLower.includes('transformative') || scriptLower.includes('convergence')
      const hasB2Vocab = scriptLower.includes('dynamic') || scriptLower.includes('transitioning') ||
                        scriptLower.includes('relatable') || scriptLower.includes('persuasive') ||
                        scriptLower.includes('memorability')

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Autonomous script with sophisticated vocabulary
      if (sentenceCount >= 4 && wordCount >= 60 &&
          hasOpening && hasAnimation && hasJingle && hasDramatisation &&
          hasGoal && hasFeatures && hasCallToAction && hasAdvancedVocab) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your script demonstrates autonomous, sophisticated writing with advanced vocabulary (seamless, nuanced, transformative), layered storytelling, and persuasive elements. The script shows deep understanding of video structure and narrative techniques.'
      }
      // B2: 4 points - Dynamic script with persuasive language
      else if (sentenceCount >= 4 && wordCount >= 40 &&
               hasOpening && hasAnimation && hasJingle && hasDramatisation &&
               hasCharacter && hasGoal && hasFeatures && hasCallToAction &&
               (hasB2Vocab || hasObstacle)) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your script includes dynamic transitions, relatable characters with clear goals and obstacles, and persuasive call to action. You used effective vocabulary and structured scenes logically.'
      }
      // B1: 3 points - Complete script following template
      else if (sentenceCount >= 3 &&
               hasOpening && hasDramatisation && hasFeatures &&
               hasSubjectVerb) {
        score = 3
        level = 'B1'
        feedback = 'Good! You followed the template with 3+ scenes: opening with animation/jingle, dramatisation with characters discovering traditions, and features with call to action. Your grammar shows good structure.'
      }
      // A2: 2 points - Basic template use with some scenes
      else if (sentenceCount >= 2 &&
               (hasOpening || hasAnimation) && (hasDramatisation || hasFeatures)) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You included some video scenes with animation and dramatisation. Try to add more details about characters, goals, obstacles, and a clear call to action. Check spelling (e.g., "dramatisation").'
      }
      // A1: 1 point - Very basic attempt
      else if (sentenceCount >= 1 && (hasOpening || scriptLower.includes('video') || scriptLower.includes('clip'))) {
        score = 1
        level = 'A1'
        feedback = 'You made an attempt at writing a video script. Try to follow the template more closely with: 1) Opening/Animation/Jingle, 2) Dramatisation with characters/goals/obstacles, 3) Features and call to action.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try again following the template. Write 4-8 sentences for video scenes: 1) Opening/Sketch with animation and jingle, 2) Dramatisation/Storytelling with characters/goals/obstacles, 3) Features/Call to Action with event details.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_step4_interaction2_score', score)
        console.log(`[Phase 4 Step 4 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Interaction 2
        </Typography>
        <Typography variant="body1">
          Write a complete video script using the guided template
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Emna"
          message="Now, write a script for your video using this guided template with examples."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2">
          Follow the template below to write 4-8 sentences scripting video scenes (animation, jingle, dramatisation).
          Adapt the examples to your ideas and self-detect/fix grammar/spelling/structure mistakes.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          <strong>Hint:</strong> Use the examples as models—change words to make it your own script.
        </Typography>
      </Alert>

      {/* Template with Examples */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VideoLibraryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" color="primary">
            Video Script Template with Examples
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Scene 1 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Scene 1 (Opening/Sketch):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                The video opens with [animation/clip] and jingle.
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example (follow and adapt):
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                The video opens with colorful animation of cultures dancing and a catchy jingle.
              </Typography>
            </CardContent>
          </Card>

          {/* Scene 2 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Scene 2 (Dramatisation/Storytelling):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                Show dramatisation with [character/goal/obstacles].
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Show dramatisation with students meeting cultures (goal) and overcoming shyness (obstacle).
              </Typography>
            </CardContent>
          </Card>

          {/* Scene 3 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Scene 3 (Features/Call to Action):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                Feature event details and end with "Come on March 8!".
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Feature food, music, date March 8 at Student Center—come join us!
              </Typography>
            </CardContent>
          </Card>

        </Stack>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Write Your Video Script
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Assessment Focus:</strong> Grammar (tense consistency),
            Spelling (e.g., "dramatisation"), Structure (scene sequence),
            Vocabulary use, Following/adapting examples, Autonomous improvement
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          placeholder="Write your video script here using the template above. Remember to include:
Scene 1: Opening with animation/clip and jingle
Scene 2: Dramatisation with characters, goal, and obstacles
Scene 3: Features and call to action (Come on March 8!)

Example start: The video opens with colorful animation..."
          value={script}
          onChange={(e) => setScript(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {script.split(/\s+/).filter(w => w.length > 0).length} |
            Sentences: {script.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !script.trim()}
            fullWidth
            size="large"
            startIcon={<VideoLibraryIcon />}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Video Script'}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: evaluation.success ? 'success.lighter' : 'warning.lighter',
            border: '2px solid',
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
                {evaluation.success ? 'Video Script Submitted!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.details && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Evaluation Details:
              </Typography>
              {evaluation.details.grammar && (
                <Typography variant="body2">
                  Grammar: {evaluation.details.grammar}
                </Typography>
              )}
              {evaluation.details.spelling && (
                <Typography variant="body2">
                  Spelling: {evaluation.details.spelling}
                </Typography>
              )}
              {evaluation.details.structure && (
                <Typography variant="body2">
                  Structure: {evaluation.details.structure}
                </Typography>
              )}
            </Box>
          )}

          {submitted && (
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Continue to Vocabulary Integration
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
