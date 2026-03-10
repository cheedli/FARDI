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
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 Interaction 1: Watch Video and Define "Persuasive"
 * Students watch a video on advertising characteristics and define "persuasive" for posters
 */

const KEY_TERMS = [
  'promotional', 'persuasive', 'targeted', 'original',
  'creative', 'consistent', 'personalized', 'ethical'
]

export default function Phase4Step3Interaction1() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'main' })
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
        feedback: 'Please write your definition of "persuasive" for posters.'
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
          question: 'What is "persuasive" for posters?',
          answer: answer.trim(),
          term: 'persuasive',
          context: 'advertising and posters',
          expectedConcepts: ['convince', 'ethos', 'pathos', 'logos', 'emotional', 'logical', 'credible'],
          level: 'B1'
        })
      })

      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'B1',
          feedback: data.feedback || 'Good definition!'
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase4_step3_interaction1_score', data.score || 1)
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
      const hasConvince = answerLower.includes('convince') || answerLower.includes('persuade')
      const hasBuy = answerLower.includes('buy') || answerLower.includes('purchase')
      const hasVideo = answerLower.includes('video')
      const hasEthos = answerLower.includes('ethos') || answerLower.includes('credible') || answerLower.includes('authority')
      const hasPathos = answerLower.includes('pathos') || answerLower.includes('emotion') || answerLower.includes('feeling')
      const hasLogos = answerLower.includes('logos') || answerLower.includes('logic') || answerLower.includes('reason')
      const hasSuperior = answerLower.includes('superior') || answerLower.includes('better') || answerLower.includes('competitor')
      const hasInfluence = answerLower.includes('influence') || answerLower.includes('impact')

      let score = 1 // A1 baseline
      let level = 'A1'
      let feedback = ''

      // C1: 5 points - Persuasive techniques for posters draw on ethos/pathos/logos, influence purchasing habits, product superiority
      if (hasConvince && (hasEthos || hasPathos || hasLogos) && (hasInfluence || hasSuperior) && wordCount >= 20) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your definition demonstrates sophisticated understanding of persuasive techniques, including ethos/pathos/logos and their influence on purchasing habits.'
      }
      // B2: 4 points - Persuasive involves emotional/logical/credible appeals, demonstrates superiority
      else if (hasConvince && ((hasEthos && hasPathos) || (hasPathos && hasLogos) || (hasEthos && hasLogos)) && hasSuperior && wordCount >= 15) {
        score = 4
        level = 'B2'
        feedback = 'Very good! You mentioned multiple persuasive appeals and product superiority as detailed in the video.'
      }
      // B1: 3 points - Persuasive means using ethos/pathos/logos to convince, references video
      else if (hasConvince && (hasEthos || hasPathos || hasLogos) && wordCount >= 12) {
        score = 3
        level = 'B1'
        feedback = 'Good! You understand persuasive techniques and referenced the video\'s explanation of ethos, pathos, or logos.'
      }
      // A2: 2 points - Persuasive is to convince people to buy, mentions feelings/video
      else if (hasConvince && (hasBuy || hasPathos || hasVideo) && wordCount >= 8) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You mentioned convincing and buying with some reference to the video concepts.'
      }
      // A1: 1 point - Basic attempt
      else if (hasConvince || hasBuy) {
        score = 1
        level = 'A1'
        feedback = 'Your answer shows basic understanding. Try to include more details about ethos, pathos, or logos from the video.'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try again. Reference what "persuasive" means from the video, mentioning concepts like convince, ethos, pathos, or logos.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase4_step3_interaction1_score', score)
        console.log(`[Phase 4 Step 3 - Interaction 1] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // TODO: Navigate to next interaction when created
    navigate('/phase4/step/3/interaction/2')
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Interaction 1
        </Typography>
        <Typography variant="body1">
          Watch the video and define "persuasive" for posters
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Watch this video on 10 advertising characteristics (4:30). Listen for 'promotional', 'persuasive', 'targeted', 'original', 'creative', 'consistent', 'personalized', 'ethical'. After, answer: What is 'persuasive' for posters?"
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

      {/* Video Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
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
            src="https://www.youtube.com/embed/5Bu6qE9E7oo"
            title="10 Advertising Characteristics"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            10 Advertising Characteristics (4:30)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Watch this video to learn about the key characteristics of effective advertising, including persuasive techniques.
          </Typography>
        </CardContent>
      </Card>

      {/* Question Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Question: What is "persuasive" for posters?
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Hint:</strong> Use "It is to convince..." and mention ethos/pathos/logos from the video.
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Write your definition of 'persuasive' for posters here. Reference what you learned from the video..."
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
              Continue to Next Activity
            </Button>
          )}
        </Paper>
      )}

    </Box>
  )
}
