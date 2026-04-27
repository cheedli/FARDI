import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Divider,
  Stack,
  Container,
  useTheme
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3 Interaction 1: Poster Description Writing
 * Students write a 4-8 sentence poster description using guided template with examples
 */

export default function Phase4Step4Interaction1() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

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
    navigate('/phase4/step/3/interaction/2')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4: Marketing & Promotion
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.shadow }}>
              Step 3: Apply - Interaction 1
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Write a complete poster description using the guided template
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="First, write a description of your poster using this guided template with examples."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, display: 'flex', gap: 2, alignItems: 'flex-start',
          }}>
            <InfoIcon sx={{ color: P.blue.shadow, mt: 0.3 }} />
            <Box>
              <Typography variant="body2" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
                Instructions:
              </Typography>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                Follow the template below to write 4-8 sentences describing poster elements (layout, colors, slogan).
                Adapt the examples to your ideas and check for grammar/spelling mistakes.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: P.blue.shadow }}>
                <strong>Hint:</strong> Use the examples as models—change words to make it your own.
              </Typography>
            </Box>
          </Box>

          {/* Template with Examples */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 4,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.teal.shadow }}>
              Poster Description Template with Examples
            </Typography>

            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Sentence 1 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Sentence 1 (Title/Layout):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  My poster has a [gatefold/layout] with title "[Your Title]".
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example (follow and adapt):
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  My poster has a gatefold layout with title "Global Cultures Festival".
                </Typography>
              </Box>

              {/* Sentence 2 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Sentence 2 (Colors/Images):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  It uses [colors/images] because eye-catcher.
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  It uses bright colors and cultural images because eye-catcher.
                </Typography>
              </Box>

              {/* Sentence 3 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Sentence 3 (Slogan/Lettering):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  The slogan is "[Your Slogan]" with bold lettering.
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  The slogan is "Discover the World Together" with bold lettering.
                </Typography>
              </Box>

              {/* Sentence 4 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Sentence 4 (Details/Call to Action):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  Date is March 8, place Student Center, come join!
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  Date is March 8 at Student Center—come join us!
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Writing Area */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Write Your Poster Description
            </Typography>

            <Box sx={{
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '14px', boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
              p: 2, mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                <strong>Assessment Focus:</strong> Grammar (subject-verb agreement),
                Spelling (e.g., "gatefold"), Structure (logical flow),
                Vocabulary use, Following/adapting examples, Autonomous correction
              </Typography>
            </Box>

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
              <Box component="span" sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '999px', px: 2, py: 0.5,
                fontSize: '0.85rem', fontWeight: 700, color: P.yellow.shadow,
                display: 'inline-block'
              }}>
                Words: {description.split(/\s+/).filter(w => w.length > 0).length} | Sentences: {description.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
              </Box>
            </Box>

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !description.trim()} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || !description.trim()) ? 'not-allowed' : 'pointer',
                color: P.orange.shadow, width: '100%', opacity: (loading || !description.trim()) ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
              }}>
                {loading ? <CircularProgress size={24} /> : 'Submit Poster Description'}
              </Box>
            )}
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.yellow.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 40,
                    color: evaluation.success ? P.green.shadow : P.yellow.shadow,
                    mr: 2
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                    {evaluation.success ? 'Poster Description Submitted!' : 'Try Again'}
                  </Typography>
                  <Box component="span" sx={{
                    bgcolor: evaluation.success ? P.green.bg : P.yellow.bg,
                    border: `2px solid ${evaluation.success ? P.green.border : P.yellow.border}`,
                    borderRadius: '999px', px: 2, py: 0.5,
                    fontSize: '0.85rem', fontWeight: 700,
                    color: evaluation.success ? P.green.shadow : P.yellow.shadow,
                    display: 'inline-block', mt: 0.5
                  }}>
                    Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2, color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                {evaluation.feedback}
              </Typography>

              {evaluation.details && (
                <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                    Evaluation Details:
                  </Typography>
                  {evaluation.details.grammar && (
                    <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                      Grammar: {evaluation.details.grammar}
                    </Typography>
                  )}
                  {evaluation.details.spelling && (
                    <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                      Spelling: {evaluation.details.spelling}
                    </Typography>
                  )}
                  {evaluation.details.structure && (
                    <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.yellow.shadow }}>
                      Structure: {evaluation.details.structure}
                    </Typography>
                  )}
                </Box>
              )}

              {submitted && (
                <Box component="button" onClick={handleContinue} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow, width: '100%', mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>
                  Continue to Video Script
                </Box>
              )}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
