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
  Chip,
  Stack,
  Grid
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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
    // Navigate to Interaction 3
    navigate('/phase4/step/3/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 2
        </Typography>
        <Typography variant="body1">
          Watch two videos and explain "dramatisation" in advertising
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Lilia"
          message="Now watch these two video ads (first 3:30 on film drama principles; second 5:30 on successful ad keys). Listen for 'dramatisation', 'character', 'goal', 'obstacles', 'small ideas', 'friction'. After, explain 'dramatisation' in videos."
        />
      </Paper>

      {/* Key Terms to Listen For */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          Key Terms to Listen For:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {KEY_TERMS.map((term, index) => (
            <Chip key={index} label={term} color="primary" variant="outlined" />
          ))}
        </Stack>
      </Paper>

      {/* Videos Section */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Educational Videos
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {VIDEOS.map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={3}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
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
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Question Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Question: What is "dramatisation" in videos and what is its purpose?
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Hint:</strong> Include "story in video because..." and reference character/goal/obstacles from the first video or small ideas from the second.
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          placeholder="Explain dramatisation and describe its purpose. Use examples from the videos..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Answer'}
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
                {evaluation.success ? 'Answer Submitted!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: {evaluation.score}/5
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {submitted && (
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
              fullWidth
            >
              Complete Step 3
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
