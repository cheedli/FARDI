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
 * Phase 5 Step 1: Engage
 * Interaction 2: Solution Suggestion
 * SKANDER: "The singer canceled! How can we solve this last-minute problem?"
 * Students suggest a solution with problem-solving vocabulary
 */

const TARGET_VOCABULARY = ['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent']

const EXPECTED_EXAMPLES = {
  A1: 'Find new singer.',
  A2: 'Find alternative singer because urgent.',
  B1: 'We can find another singer as an alternative because it is urgent and keeps the program.',
  B2: 'I suggest finding a backup performer or local talent as a quick alternative, since this solution is urgent and maintains the event quality.',
  C1: 'A feasible solution would be to secure a substitute artist immediately while sending an apologetic update to attendees, ensuring minimal disruption and preserving trust.'
}

export default function Phase5Step1Interaction2() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 1, interaction: 2, context: 'main' })
  const [solution, setSolution] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!solution.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please suggest a solution to the problem.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateSolution(solution.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 1,
          level: data.level || 'A1',
          feedback: data.feedback || 'Good work!',
          vocabulary_used: data.vocabulary_used || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        })
        setSubmitted(true)

        // Store score for later
        sessionStorage.setItem('phase5_step1_interaction2_score', data.score || 1)
        sessionStorage.setItem('phase5_step1_interaction2_level', data.level || 'A1')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A1',
          feedback: result.error || 'Please try again with more detail.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on keywords
      const solutionLower = solution.toLowerCase()
      const hasSolution = solutionLower.includes('solution') || 
                         solutionLower.includes('find') || 
                         solutionLower.includes('alternative') ||
                         solutionLower.includes('fix')
      const hasAlternative = solutionLower.includes('alternative') || 
                            solutionLower.includes('backup') || 
                            solutionLower.includes('substitute')
      const hasUrgent = solutionLower.includes('urgent') || 
                       solutionLower.includes('quick') || 
                       solutionLower.includes('immediately')
      const hasReasoning = solutionLower.includes('because') || 
                         solutionLower.includes('since') || 
                         solutionLower.includes('so that')
      
      const wordCount = solution.split(/\s+/).length
      const vocabularyCount = TARGET_VOCABULARY.filter(term => 
        solutionLower.includes(term)
      ).length

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // C1: 5 points - Sophisticated solution
      if (wordCount >= 20 && vocabularyCount >= 3 && hasAlternative && hasReasoning &&
          (solutionLower.includes('feasible') || solutionLower.includes('secure') || 
           solutionLower.includes('mitigate') || solutionLower.includes('preserve'))) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! Your solution demonstrates sophisticated problem-solving with advanced vocabulary and strategic thinking. You provided a comprehensive approach that considers multiple aspects of the situation.'
      }
      // B2: 4 points - Detailed solution
      else if (wordCount >= 15 && vocabularyCount >= 2 && hasAlternative && hasReasoning) {
        score = 4
        level = 'B2'
        feedback = 'Very good! Your solution is detailed and logical, using multiple vocabulary terms effectively. You showed good reasoning and consideration of the problem.'
      }
      // B1: 3 points - Clear solution with reasoning
      else if (wordCount >= 10 && vocabularyCount >= 2 && hasSolution && hasReasoning) {
        score = 3
        level = 'B1'
        feedback = 'Good! You provided a clear solution with reasoning and used problem-solving vocabulary. Try to include more details about why your solution works.'
      }
      // A2: 2 points - Simple solution with vocabulary
      else if (wordCount >= 5 && vocabularyCount >= 1 && hasSolution) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You suggested a solution and used some vocabulary. Try to add reasoning with "because" or "since" to explain why your solution works.'
      }
      // A1: 1 point - Basic solution mention
      else if (hasSolution && wordCount >= 3) {
        score = 1
        level = 'A1'
        feedback = 'You mentioned a solution. Try to use vocabulary terms like "alternative", "urgent", or "solution" and explain why it works with "because".'
      }
      else {
        score = 0
        level = 'Below A1'
        feedback = 'Please suggest a solution to the problem. Use vocabulary terms like "alternative", "urgent", or "solution" and explain why it works.'
      }

      setEvaluation({
        success: score > 0,
        score,
        level,
        feedback,
        vocabulary_used: TARGET_VOCABULARY.filter(term => solutionLower.includes(term))
      })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase5_step1_interaction2_score', score)
        sessionStorage.setItem('phase5_step1_interaction2_level', level)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/1/interaction/3')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 2
        </Typography>
        <Typography variant="body1">
          Suggest a solution to the last-minute problem
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="SKANDER"
          message="The singer canceled! How can we solve this last-minute problem for the festival?"
        />
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Instructions:
        </Typography>
        <Typography variant="body2">
          Suggest one solution (e.g., find alternative performer, change schedule) and explain why it works.
          Use vocabulary terms like: <strong>{TARGET_VOCABULARY.join(', ')}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          <strong>Hint:</strong> Start with "We can..." or "I suggest..." and use "because" to explain your reasoning.
        </Typography>
      </Alert>

      {/* Vocabulary Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" color="primary">
            Problem-Solving Vocabulary
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
          Your Solution Suggestion
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Assessment Focus:</strong> Grammar (connectors like "because"), 
            Problem-solving language, Logical reasoning, Vocabulary usage
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Example: We can find another singer as an alternative because it is urgent and keeps the program running..."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Words: {solution.split(/\s+/).filter(w => w.length > 0).length} |
            Vocabulary used: {TARGET_VOCABULARY.filter(term => 
              solution.toLowerCase().includes(term)
            ).length}/{TARGET_VOCABULARY.length}
          </Typography>
        </Box>

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !solution.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <LightbulbIcon />}
          >
            {loading ? 'Evaluating...' : 'Submit Solution'}
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
                {evaluation.success ? 'Solution Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.vocabulary_used && evaluation.vocabulary_used.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vocabulary Terms Used:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evaluation.vocabulary_used.map((term, idx) => (
                  <Chip
                    key={idx}
                    label={term}
                    color="success"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="success.dark">
                Strengths:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {evaluation.strengths.map((strength, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{strength}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="warning.dark">
                Suggestions for Improvement:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {evaluation.improvements.map((improvement, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{improvement}</Typography>
                  </li>
                ))}
              </ul>
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
              Continue to Interaction 3
            </Button>
          )}
        </Paper>
      )}
    </Box>
  )
}
