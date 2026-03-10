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
  Stack,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 SubPhase 2 Step 1: Engage
 * Interaction 2: Volunteer Instructions
 * SKANDER: "What instructions would you give a volunteer who is welcoming guests at the entrance?"
 * Students write 2-4 short instructions with polite imperatives and sequencing words
 * Scoring: A2=1pt, B1=2pts, B2=3pts, C1=4pts (no A1 in SubPhase 2)
 */

const TARGET_VOCABULARY = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety']

const EXPECTED_EXAMPLES = {
  A2: 'Please welcome. Say hello. Thank you.',
  B1: 'First, say welcome to the festival. Then, check tickets. Please smile and be friendly. Thank you for helping!',
  B2: 'First, greet guests warmly: "Welcome to the Global Cultures Festival!" Then, check their tickets or registration. Please direct them to the information desk if they have questions. Thank you for your smile and patience - it makes a big difference!',
  C1: 'Begin by offering a warm, inclusive greeting: "Welcome to the Global Cultures Festival - we\'re delighted you\'re here!" Next, politely verify entry (tickets/registration) while maintaining eye contact and a friendly tone. Should guests have questions, guide them clearly to the appropriate booth or team member. Conclude each interaction with sincere appreciation: "Thank you for joining us - enjoy the celebration!" This sequence ensures efficiency, warmth, and professionalism.'
}

export default function Phase5SubPhase2Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 2, step: 1, interaction: 2, context: 'main' })
  const [instructions, setInstructions] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!instructions.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please write instructions for the volunteer.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateVolunteerInstructions(instructions.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good work!',
          vocabulary_used: data.vocabulary_used || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_score', data.score || 1)
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_level', data.level || 'A2')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on keywords
      const instructionsLower = instructions.toLowerCase()
      const hasPlease = instructionsLower.includes('please')
      const hasThankYou = instructionsLower.includes('thank you') || instructionsLower.includes('thank')
      const hasSequencing = instructionsLower.includes('first') || instructionsLower.includes('then') || instructionsLower.includes('next')
      const vocabularyCount = TARGET_VOCABULARY.filter(term => instructionsLower.includes(term)).length
      const wordCount = instructions.split(/\s+/).length

      let score = 1
      let level = 'A2'
      let feedback = ''

      // C1: 4 points
      if (wordCount >= 50 && vocabularyCount >= 4 && hasPlease && hasThankYou && hasSequencing) {
        score = 4
        level = 'C1'
        feedback = 'Excellent! Your instructions are sophisticated, professional, and show advanced understanding of polite communication and sequencing.'
      }
      // B2: 3 points
      else if (wordCount >= 30 && vocabularyCount >= 3 && hasPlease && hasSequencing) {
        score = 3
        level = 'B2'
        feedback = 'Very good! Your instructions are detailed, polite, and well-sequenced. Try adding more safety reminders or empathy.'
      }
      // B1: 2 points
      else if (wordCount >= 15 && vocabularyCount >= 2 && (hasPlease || hasThankYou) && hasSequencing) {
        score = 2
        level = 'B1'
        feedback = 'Good! You used sequencing words and polite language. Try to add more detail and use both "please" and "thank you".'
      }
      // A2: 1 point
      else if (wordCount >= 5 && (hasPlease || hasThankYou)) {
        score = 1
        level = 'A2'
        feedback = 'Good start! You used polite words. Try adding sequencing words like "first" and "then" to organize your instructions.'
      }
      else {
        score = 0
        level = 'Below A2'
        feedback = 'Please write instructions using polite words like "please" and "thank you", and sequencing words like "first" and "then".'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback,
        vocabulary_used: TARGET_VOCABULARY.filter(term => instructionsLower.includes(term))
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_score', score)
        sessionStorage.setItem('phase5_subphase2_step1_interaction2_level', level)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/2/step/1/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Write instructions for a volunteer welcoming guests
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="What instructions would you give a volunteer who is welcoming guests at the entrance?"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2">
          Suggest 2-4 short instructions for a volunteer (use polite imperatives and sequencing words).
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          <strong>Hint:</strong> Start with "First...", "Then...", "Please...", "Thank you..."
        </Typography>
      </Alert>

      {/* Vocabulary Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" color="primary">
            Instruction Vocabulary
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {TARGET_VOCABULARY.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Expected Response Examples */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Expected Response Examples (by level):
        </Typography>
        <Stack spacing={1}>
          {Object.entries(EXPECTED_EXAMPLES).map(([level, example]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                "{example}"
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Writing Area */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Volunteer Instructions
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Assessment Focus:</strong> Imperative form, Polite language ("please", "thank you"), 
            Basic sequencing ("first", "then"), Clarity
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Example: First, please welcome guests with a smile. Then, check their tickets. Please guide them to the booths. Thank you for helping!"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {instructions.split(/\s+/).filter(w => w.length > 0).length} |
            Vocabulary used: {TARGET_VOCABULARY.filter(term => 
              instructions.toLowerCase().includes(term)
            ).length}/{TARGET_VOCABULARY.length}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !instructions.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <LightbulbIcon />}
          >
            {loading ? 'Evaluating...' : 'Submit Instructions'}
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
            backgroundColor: evaluation.success ? 'success.lighter' : 'error.lighter',
            border: `2px solid ${evaluation.success ? 'success.main' : 'error.main'}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: evaluation.success ? 'success.main' : 'error.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={evaluation.success ? 'success.main' : 'error.main'}>
                Evaluation Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {evaluation.score}/4 points | Level: {evaluation.level}
              </Typography>
            </Box>
          </Box>

          <Alert severity={evaluation.success ? 'success' : 'warning'} sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Feedback:
            </Typography>
            <Typography variant="body2">{evaluation.feedback}</Typography>
          </Alert>

          {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Vocabulary Used:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.vocabulary_used.map((term, idx) => (
                  <Chip key={idx} label={term} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="success.main">
                Strengths:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {evaluation.strengths.map((strength, idx) => (
                  <Typography key={idx} component="li" variant="body2">
                    {strength}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="warning.main">
                Suggestions for Improvement:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {evaluation.improvements.map((improvement, idx) => (
                  <Typography key={idx} component="li" variant="body2">
                    {improvement}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {submitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Continue to Interaction 3
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
