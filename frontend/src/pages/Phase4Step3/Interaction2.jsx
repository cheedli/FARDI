import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Grid,
  Container
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 Interaction 2: Watch Two Videos and Define "Dramatisation"
 * Students watch videos on film drama principles and successful ads, then define dramatisation
 */

const KEY_TERMS = [
  'dramatisation', 'character', 'goal', 'obstacles',
  'small ideas', 'friction'
]

const VIDEOS = [
  {
    title: "Film Drama Principles (3:30)",
    url: "https://www.youtube.com/embed/6xAmaJM84AU",
    description: "Learn about drama principles: character, goal, and obstacles"
  },
  {
    title: "Successful Ad Keys (5:30)",
    url: "https://www.youtube.com/embed/ugr2D4wYf2A",
    description: "Discover the keys to successful advertising with small ideas and friction"
  }
]

export default function Phase4Step3Interaction2() {
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

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'main' })
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please write your explanation of "dramatisation" for videos.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/evaluate-definition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: 'What is "dramatisation" in videos?',
          answer: answer.trim(),
          term: 'dramatisation',
          context: 'video advertising',
          expectedConcepts: ['story', 'character', 'goal', 'obstacles', 'small ideas', 'friction', 'engage', 'emotional'],
          level: 'B1'
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'B1',
          feedback: data.feedback || 'Good explanation!'
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase4_step3_interaction2_score', data.score || 1)
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
      const answerLower = answer.toLowerCase()
      const wordCount = answer.split(/\s+/).length

      // Key concepts check
      const hasStory = answerLower.includes('story') || answerLower.includes('drama')
      const hasCharacter = answerLower.includes('character') || answerLower.includes('relatable')
      const hasGoal = answerLower.includes('goal') || answerLower.includes('objective')
      const hasObstacles = answerLower.includes('obstacle') || answerLower.includes('challenge')
      const hasSmallIdeas = answerLower.includes('small') && answerLower.includes('idea')
      const hasEmotional = answerLower.includes('emotion') || answerLower.includes('emotional') || answerLower.includes('impact')
      const hasEngage = answerLower.includes('engage') || answerLower.includes('captivate')
      const hasVideo = answerLower.includes('video') || answerLower.includes('first') || answerLower.includes('second')
      const hasSketch = answerLower.includes('sketch') || answerLower.includes('script')
      const hasTry = answerLower.includes('try') || answerLower.includes('attempt')
      const hasTheatrical = answerLower.includes('theatrical') || answerLower.includes('persuasive')
      const hasFilmable = answerLower.includes('film') || answerLower.includes('visual')
      const hasFrictionless = answerLower.includes('friction') || answerLower.includes('seamless') || answerLower.includes('natural')

      let score = 1 // A1 baseline
      let level = 'A1'
      let feedback = ''

      // C1: 5 points - Theatrical storytelling with relatable characters, filmable goals/obstacles, captivate viewers, both videos referenced
      if (hasStory && hasCharacter && hasGoal && hasObstacles && (hasTheatrical || hasEngage) && (hasFilmable || hasFrictionless || hasSmallIdeas) && wordCount >= 25) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your explanation demonstrates sophisticated understanding of dramatisation using theatrical storytelling with relatable characters, goals, and obstacles, aligning perfectly with both videos\' principles.'
      }
      // B2: 4 points - Scripted scenes with character goals and visual obstacles for emotional impact, references video principles
      else if (hasStory && hasCharacter && hasGoal && hasObstacles && (hasEmotional || hasSketch) && wordCount >= 20) {
        score = 4
        level = 'B2'
        feedback = 'Very good! You explained dramatisation with scripted scenes, character goals, and obstacles for emotional impact, as illustrated in the video\'s drama principles.'
      }
      // B1: 3 points - Creating sketch with relatable character, clear goal, and obstacles to engage
      else if (hasStory && hasCharacter && hasGoal && hasObstacles && wordCount >= 15) {
        score = 3
        level = 'B1'
        feedback = 'Good! You understand dramatisation involves creating a sketch with relatable character, clear goal, and obstacles to engage viewers, as the first video explained.'
      }
      // A2: 2 points - Story with goal in video, mentions character trying something
      else if (hasStory && (hasGoal || hasCharacter) && (hasVideo || hasTry) && wordCount >= 10) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You mentioned story with a goal, like the first video explained about character trying something.'
      }
      // A1: 1 point - Basic attempt: story with people trying
      else if (hasStory || (hasCharacter && hasTry)) {
        score = 1
        level = 'A1'
        feedback = 'Your answer shows basic understanding. Try to include more details about character, goal, and obstacles from the videos.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try again. Reference what "dramatisation" means from the videos, mentioning concepts like story, character, goal, and obstacles.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_step3_interaction2_score', score)
        console.log(`[Phase 4 Step 3 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
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
      <Container maxWidth="lg">
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
              Step 3: Explain - Interaction 2
            </Typography>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}>
              Watch two videos and explain "dramatisation" in advertising
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <CharacterMessage
              speaker="Lilia"
              message="Now watch these two video ads (first 3:30 on film drama principles; second 5:30 on successful ad keys). Listen for 'dramatisation', 'character', 'goal', 'obstacles', 'small ideas', 'friction'. After, explain 'dramatisation' in videos."
            />
          </Box>

          {/* Key Terms */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: P.purple.shadow }}>
              Key Terms to Listen For:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {KEY_TERMS.map((term, index) => (
                <Box key={index} component="span" sx={{
                  bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
                  borderRadius: '999px', px: 2, py: 0.5,
                  fontSize: '0.85rem', fontWeight: 700, color: P.purple.shadow,
                  display: 'inline-block'
                }}>{term}</Box>
              ))}
            </Stack>
          </Box>

          {/* Videos Section */}
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow, mb: 2 }}>
            Educational Videos
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {VIDEOS.map((video, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  p: 3, overflow: 'hidden',
                }}>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', mb: 2 }}>
                    <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0
                      }}
                      src={video.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
                    {index + 1}. {video.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: P.orange.shadow, opacity: 0.8 }}>
                    {video.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Question Section */}
          <Box sx={{
            bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Question: What is "dramatisation" in videos and what is its purpose?
            </Typography>

            <Box sx={{
              bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
              borderRadius: '12px', p: 2, mb: 3,
            }}>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                <strong>Hint:</strong> Include "story in video because..." and reference character/goal/obstacles from the first video or small ideas from the second.
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="Explain dramatisation and describe its purpose. Use examples from the videos..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.orange.border },
                  '&:hover fieldset': { borderColor: P.orange.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                }
              }}
            />

            {!submitted && (
              <Box component="button" onClick={handleSubmit} disabled={loading || !answer.trim()} sx={{
                width: '100%',
                bgcolor: (loading || !answer.trim()) ? 'grey.200' : P.blue.bg,
                border: `2px solid ${(loading || !answer.trim()) ? '#ccc' : P.blue.border}`,
                borderRadius: '12px',
                boxShadow: (loading || !answer.trim()) ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: (loading || !answer.trim()) ? 'not-allowed' : 'pointer',
                color: (loading || !answer.trim()) ? 'grey.500' : P.blue.shadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': (loading || !answer.trim()) ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': (loading || !answer.trim()) ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` },
              }}>
                {loading ? <CircularProgress size={20} /> : 'Submit Answer'}
              </Box>
            )}
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{
              bgcolor: evaluation.success ? P.green.bg : P.red.bg,
              border: `2px solid ${evaluation.success ? P.green.border : P.red.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? P.green.shadow : P.red.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{
                  fontSize: 40,
                  color: evaluation.success ? P.green.shadow : P.red.shadow,
                  mr: 2
                }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow }}>
                    {evaluation.success ? 'Answer Submitted!' : 'Try Again'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, opacity: 0.8 }}>
                    Level: {evaluation.level} | Score: {evaluation.score}/5
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: evaluation.success ? P.green.shadow : P.red.shadow, mb: 2 }}>
                {evaluation.feedback}
              </Typography>

              {submitted && (
                <Box component="button" onClick={handleContinue} sx={{
                  width: '100%',
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}>
                  <PlayArrowIcon fontSize="small" />
                  Complete Step 3
                </Box>
              )}
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
