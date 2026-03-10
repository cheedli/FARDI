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
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 Interaction 1: Poster Description Writing
 * Students write a 4-8 sentence poster description using guided template with examples
 */

export default function Phase4Step4Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'main' })
  const [description, setDescription] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!description.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please write your poster description using the template.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step4/evaluate-poster-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          description: description.trim()
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
        sessionStorage.setItem('phase4_step4_interaction1_score', data.score || 1)
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
      const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = description.split(/\s+/).length
      const descLower = description.toLowerCase()

      // Check for template elements
      const hasTitle = descLower.includes('title') || descLower.includes('poster')
      const hasLayout = descLower.includes('gatefold') || descLower.includes('layout')
      const hasColors = descLower.includes('color') || descLower.includes('colour') || descLower.includes('bright') || descLower.includes('vibrant')
      const hasImages = descLower.includes('image') || descLower.includes('picture') || descLower.includes('photo')
      const hasSlogan = descLower.includes('slogan')
      const hasDate = descLower.includes('march') || descLower.includes('date')
      const hasPlace = descLower.includes('student center') || descLower.includes('place')
      const hasCallToAction = descLower.includes('join') || descLower.includes('come') || descLower.includes('don\'t miss')

      // Grammar indicators
      const hasSubjectVerb = /\b(it|poster|slogan|layout)\s+(is|has|uses|features|employs)\b/i.test(description)
      const hasArticles = /\b(a|an|the)\b/i.test(description)
      const hasBecause = descLower.includes('because')
      const hasEyeCatcher = descLower.includes('eye-catcher') || descLower.includes('eye catcher')

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated essay-like description
      if (sentenceCount >= 4 && wordCount >= 60 &&
          hasLayout && hasTitle && hasColors && hasSlogan &&
          (descLower.includes('unfold') || descLower.includes('narrative') ||
           descLower.includes('hierarchy') || descLower.includes('ethos') ||
           descLower.includes('authentic') || descLower.includes('persuasive') ||
           descLower.includes('encapsulate') || descLower.includes('culminat'))) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your description demonstrates sophisticated writing with advanced vocabulary, complex sentence structures, and essay-like narrative quality. You effectively described the poster\'s visual hierarchy and persuasive elements.'
      }
      // B2: 4 points - Detailed description with persuasive elements
      else if (sentenceCount >= 4 && wordCount >= 40 &&
               hasLayout && hasTitle && hasColors && hasSlogan && hasDate &&
               (descLower.includes('vibrant') || descLower.includes('elegant') ||
                descLower.includes('persuasive') || descLower.includes('immersive') ||
                descLower.includes('diverse') || descLower.includes('attract'))) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your description includes detailed elements with persuasive vocabulary. You featured the gatefold layout, vibrant colors, and compelling call to action with good grammar and structure.'
      }
      // B1: 3 points - Complete description following template
      else if (sentenceCount >= 4 && hasLayout && hasTitle && hasColors &&
               hasSlogan && hasDate && hasSubjectVerb) {
        score = 3
        level = 'B1'
        feedback = 'Good! You followed the template well with 4+ sentences describing layout, colors, slogan, and date. Your grammar shows subject-verb agreement and logical structure.'
      }
      // A2: 2 points - Basic template use with some elements
      else if (sentenceCount >= 3 && (hasTitle || hasLayout) &&
               (hasColors || hasSlogan) && hasSubjectVerb) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You used the template and included some poster elements. Try to add more details like date, place, and call to action. Check spelling (e.g., "gatefold").'
      }
      // A1: 1 point - Very basic attempt
      else if (sentenceCount >= 1 && (hasTitle || hasColors || descLower.includes('poster'))) {
        score = 1
        level = 'A1'
        feedback = 'You made an attempt at describing the poster. Try to follow the template more closely with title, layout, colors, slogan, and date. Use complete sentences with subject-verb structure.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try again following the template. Write 4-8 sentences describing: 1) Title/Layout, 2) Colors/Images, 3) Slogan/Lettering, 4) Date/Place/Call to Action. Use the examples as models.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_step4_interaction1_score', score)
        console.log(`[Phase 4 Step 4 - Interaction 1] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // TODO: Navigate to next interaction when created
    navigate('/phase4/step/4/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Interaction 1
        </Typography>
        <Typography variant="body1">
          Write a complete poster description using the guided template
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="First, write a description of your poster using this guided template with examples."
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2">
          Follow the template below to write 4-8 sentences describing poster elements (layout, colors, slogan).
          Adapt the examples to your ideas and check for grammar/spelling mistakes.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          <strong>Hint:</strong> Use the examples as models—change words to make it your own.
        </Typography>
      </Alert>

      {/* Template with Examples */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Poster Description Template with Examples
        </Typography>

        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Sentence 1 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Sentence 1 (Title/Layout):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                My poster has a [gatefold/layout] with title "[Your Title]".
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example (follow and adapt):
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                My poster has a gatefold layout with title "Global Cultures Festival".
              </Typography>
            </CardContent>
          </Card>

          {/* Sentence 2 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Sentence 2 (Colors/Images):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                It uses [colors/images] because eye-catcher.
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                It uses bright colors and cultural images because eye-catcher.
              </Typography>
            </CardContent>
          </Card>

          {/* Sentence 3 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Sentence 3 (Slogan/Lettering):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                The slogan is "[Your Slogan]" with bold lettering.
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                The slogan is "Discover the World Together" with bold lettering.
              </Typography>
            </CardContent>
          </Card>

          {/* Sentence 4 */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Sentence 4 (Details/Call to Action):
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 1, borderRadius: 1 }}>
                Date is March 8, place Student Center, come join!
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="success.dark" fontWeight="bold">
                Example:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Date is March 8 at Student Center—come join us!
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Write Your Poster Description
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Assessment Focus:</strong> Grammar (subject-verb agreement),
            Spelling (e.g., "gatefold"), Structure (logical flow),
            Vocabulary use, Following/adapting examples, Autonomous correction
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="Write your poster description here using the template above. Remember to include:
1. Title/Layout (e.g., gatefold)
2. Colors/Images (eye-catcher)
3. Slogan with lettering
4. Date, place, call to action

Example start: My poster has a gatefold layout with title..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {description.split(/\s+/).filter(w => w.length > 0).length} |
            Sentences: {description.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Poster Description'}
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
                {evaluation.success ? 'Poster Description Submitted!' : 'Try Again'}
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
              Continue to Video Script
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
