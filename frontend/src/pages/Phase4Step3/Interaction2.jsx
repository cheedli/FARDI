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
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { useProgressSave } from '../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 3 Interaction 2: Video Script Writing
 * Students write a 4-8 sentence video script using guided template with examples
 */

export default function Phase4Step4Interaction2() {
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
    navigate('/phase4/step/3/interaction/3')
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
              Step 3: Apply - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Write a complete video script using the guided template
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Emna"
              message="Now, write a script for your video using this guided template with examples."
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
                Follow the template below to write 4-8 sentences scripting video scenes (animation, jingle, dramatisation).
                Adapt the examples to your ideas and self-detect/fix grammar/spelling/structure mistakes.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: P.blue.shadow }}>
                <strong>Hint:</strong> Use the examples as models—change words to make it your own script.
              </Typography>
            </Box>
          </Box>

          {/* Template with Examples */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VideoLibraryIcon sx={{ fontSize: 40, color: P.teal.shadow, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.shadow }}>
                Video Script Template with Examples
              </Typography>
            </Box>

            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Scene 1 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Scene 1 (Opening/Sketch):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  The video opens with [animation/clip] and jingle.
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example (follow and adapt):
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  The video opens with colorful animation of cultures dancing and a catchy jingle.
                </Typography>
              </Box>

              {/* Scene 2 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Scene 2 (Dramatisation/Storytelling):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  Show dramatisation with [character/goal/obstacles].
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  Show dramatisation with students meeting cultures (goal) and overcoming shyness (obstacle).
                </Typography>
              </Box>

              {/* Scene 3 */}
              <Box sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
                borderRadius: '14px', boxShadow: `3px 3px 0 ${P.blue.shadow}`, p: 2,
              }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: P.blue.shadow }} gutterBottom>
                  Scene 3 (Features/Call to Action):
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, color: P.blue.shadow }}>
                  Feature event details and end with "Come on March 8!".
                </Typography>
                <Divider sx={{ my: 1, borderColor: P.blue.border }} />
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.green.shadow }}>
                  Example:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: P.blue.shadow }}>
                  Feature food, music, date March 8 at Student Center—come join us!
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
              Write Your Video Script
            </Typography>

            <Box sx={{
              bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
              borderRadius: '14px', boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
              p: 2, mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                <strong>Assessment Focus:</strong> Grammar (tense consistency),
                Spelling (e.g., "dramatisation"), Structure (scene sequence),
                Vocabulary use, Following/adapting examples, Autonomous improvement
              </Typography>
            </Box>

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
              <Box component="span" sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '999px', px: 2, py: 0.5,
                fontSize: '0.85rem', fontWeight: 700, color: P.yellow.shadow,
                display: 'inline-block'
              }}>
                Words: {script.split(/\s+/).filter(w => w.length > 0).length} | Sentences: {script.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
              </Box>
            </Box>

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !script.trim()} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || !script.trim()) ? 'not-allowed' : 'pointer',
                color: P.orange.shadow, width: '100%', opacity: (loading || !script.trim()) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
              }}>
                <VideoLibraryIcon />
                {loading ? <CircularProgress size={24} /> : 'Submit Video Script'}
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
                    {evaluation.success ? 'Video Script Submitted!' : 'Try Again'}
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
                  Continue to Vocabulary Integration
                </Box>
              )}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
