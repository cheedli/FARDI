import { useState, useEffect } from 'react'
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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Interaction 3: Coherence & Vocabulary Enhancement
 * Students improve structure/cohesion and vocabulary in grammar-corrected texts
 * Scoring: A1=1pt, A2=2pts, B1=3pts, B2=4pts, C1=5pts
 *
 * Total Possible Scores (varies by student level):
 * - Max for C1 student: 7 (spelling) + 6 (grammar) + 5 (enhancement) = 18 points
 * - Max for B2 student: 5 (spelling) + 5 (grammar) + 4 (enhancement) = 14 points
 * - Max for B1 student: 5 (spelling) + 4 (grammar) + 3 (enhancement) = 12 points
 * - Max for A2 student: 5 (spelling) + 3 (grammar) + 2 (enhancement) = 10 points
 * - Max for A1 student: 4 (spelling) + 2 (grammar) + 1 (enhancement) = 7 points
 *
 * Remedial Routing:
 * - Score ≤7: Remedial A1
 * - Score ≤10: Remedial A2
 * - Score ≤12: Remedial B1
 * - Score ≤14: Remedial B2
 * - Score ≤18: Remedial C1
 * - Score >18: Dashboard (shouldn't happen, max is 18)
 */

export default function Phase4Step5Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'main' })
  const [grammarCorrected, setGrammarCorrected] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  useEffect(() => {
    // Get grammar-corrected version from previous interaction
    const savedGrammar = sessionStorage.getItem('phase4_step5_grammar_corrected')
    if (savedGrammar) {
      setGrammarCorrected(savedGrammar)
      setEnhancedText(savedGrammar) // Pre-fill with grammar-corrected version
    }
  }, [])

  const handleSubmit = async () => {
    if (!enhancedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A1',
        feedback: 'Please enhance the text with connectors and better vocabulary.'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/phase4/step5/evaluate-enhancement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          enhancedText: enhancedText.trim()
        })
      })

      const data = await response.json()

      setEvaluation({
        success: true,
        score: data.score || 0,
        level: data.level || 'A1',
        feedback: data.feedback || 'Good work!',
        details: data.details || {}
      })
      setSubmitted(true)

      sessionStorage.setItem('phase4_step5_interaction3_score', data.score || 0)
      calculateFinalScore(data.score || 0)
    } catch (error) {
      console.error('Evaluation error:', error)

      // Fallback evaluation based on coherence/vocabulary enhancements
      const enhancedLower = enhancedText.toLowerCase().trim()
      const wordCount = enhancedText.split(/\s+/).length

      let score = 0
      let level = 'Below A1'
      let feedback = ''

      // Check for connectors
      const hasBasicConnectors =
        enhancedLower.includes('and') ||
        enhancedLower.includes('because')

      const hasIntermediateConnectors =
        enhancedLower.includes('first') ||
        enhancedLower.includes('then') ||
        enhancedLower.includes('while')

      const hasAdvancedConnectors =
        enhancedLower.includes('furthermore') ||
        enhancedLower.includes('moreover') ||
        enhancedLower.includes('coherently') ||
        enhancedLower.includes('seamlessly')

      // Check for vocabulary enhancements
      const hasBasicVocab =
        enhancedLower.includes('good') ||
        enhancedLower.includes('nice')

      const hasIntermediateVocab =
        enhancedLower.includes('eye-catching') ||
        enhancedLower.includes('eye-catcher') ||
        enhancedLower.includes('attract')

      const hasAdvancedVocab =
        enhancedLower.includes('persuasive') ||
        enhancedLower.includes('immersive') ||
        enhancedLower.includes('transitions') ||
        enhancedLower.includes('culminating')

      const hasSophisticatedVocab =
        enhancedLower.includes('seamlessly') ||
        enhancedLower.includes('complemented') ||
        enhancedLower.includes('autonomous') ||
        enhancedLower.includes('elevates') ||
        enhancedLower.includes('narrative depth')

      // Determine level and score
      if (hasSophisticatedVocab && hasAdvancedConnectors && wordCount >= 40) {
        score = 5
        level = 'C1'
        feedback = 'Excellent! You demonstrated autonomous descriptive writing at C1 level. Your text shows seamless coherence with sophisticated connectors ("seamlessly", "complemented", "culminating"), enriched vocabulary ("narrative depth", "visual hierarchy", "autonomous"), and logical progression. Outstanding enhancement of structure and vocabulary!'
      } else if (hasAdvancedVocab && (hasAdvancedConnectors || hasIntermediateConnectors) && wordCount >= 30) {
        score = 4
        level = 'B2'
        feedback = 'Very good! You improved structure and vocabulary effectively at B2 level. Your text shows good cohesion with connectors ("coherently", "transitions"), upgraded vocabulary ("persuasive", "immersive"), and clear flow from introduction to conclusion. Strong enhancement skills!'
      } else if (hasIntermediateVocab && hasIntermediateConnectors && wordCount >= 20) {
        score = 3
        level = 'B1'
        feedback = 'Good! You enhanced coherence and vocabulary at B1 level. Your text shows clear structure with connectors ("first", "then") and improved vocabulary ("eye-catching", "attract", "clear"). Keep working on more sophisticated language!'
      } else if ((hasIntermediateVocab || hasBasicConnectors) && wordCount >= 15) {
        score = 2
        level = 'A2'
        feedback = 'Good start! You added some connectors ("because") and vocabulary enhancements ("eye-catcher"). You\'re developing A2-level coherence awareness. Practice adding more connectors and upgrading more words!'
      } else if (hasBasicConnectors || hasBasicVocab) {
        score = 1
        level = 'A1'
        feedback = 'You made an attempt at basic enhancement. You used simple connectors like "and". Keep practicing to improve coherence and vocabulary!'
      } else {
        score = 0
        level = 'Below A1'
        feedback = 'Please try to improve the text. Add connectors ("because", "first", "then") and upgrade vocabulary ("good" → "eye-catching", "nice" → "persuasive").'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback
      })
      setSubmitted(true)
      sessionStorage.setItem('phase4_step5_interaction3_score', score)
      calculateFinalScore(score)
      console.log(`[Phase 4 Step 5 - Interaction 3] Score: ${score}/5 | Level: ${level}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateFinalScore = (interaction3Score) => {
    const interaction1Score = parseInt(sessionStorage.getItem('phase4_step5_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase4_step5_interaction2_score') || '0')

    const total = interaction1Score + interaction2Score + interaction3Score

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Interaction 1 (Spelling):', interaction1Score)
    console.log('Interaction 2 (Grammar):', interaction2Score)
    console.log('Interaction 3 (Enhancement):', interaction3Score)
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total)
    console.log('Max possible: 18 (for C1: 7+6+5)')
    console.log('-'.repeat(60))

    // Determine remedial level
    let remedialLevel = ''
    if (total <= 7) remedialLevel = 'A1'
    else if (total <= 10) remedialLevel = 'A2'
    else if (total <= 12) remedialLevel = 'B1'
    else if (total <= 14) remedialLevel = 'B2'
    else if (total <= 18) remedialLevel = 'C1'
    else remedialLevel = 'Dashboard (Excellent!)'

    console.log('Routing to: Remedial', remedialLevel)
    console.log('='.repeat(60) + '\n')

    setFinalScore({
      interaction1: interaction1Score,
      interaction2: interaction2Score,
      interaction3: interaction3Score,
      total
    })
  }

  const handleContinue = () => {
    // Determine remedial level based on total score
    const total = finalScore.total
    const interaction3Score = finalScore.interaction3

    // Clear Step 5 interaction scores
    sessionStorage.removeItem('phase4_step5_interaction1_score')
    sessionStorage.removeItem('phase4_step5_interaction2_score')
    sessionStorage.removeItem('phase4_step5_interaction3_score')
    sessionStorage.removeItem('phase4_step5_spelling_corrected')
    sessionStorage.removeItem('phase4_step5_grammar_corrected')

    // Check if student should proceed: I3 (sentence production) score >= 3 means B1+ level
    const shouldProceed = interaction3Score >= 3
    if (shouldProceed) {
      console.log(`[Phase 4 Step 5] I3 score ${interaction3Score}/5 >= 3 (B1+). Proceeding to Phase 4 Complete.`)
      navigate('/phase4/complete')
      return
    }

    // Route to appropriate remedial level based on score
    if (total <= 7) {
      // Score 0-7: Remedial A1
      navigate('/phase4/step/5/remedial/a1/taskA')
    } else if (total <= 10) {
      // Score 8-10: Remedial A2
      navigate('/phase4/step/5/remedial/a2/taskA')
    } else if (total <= 12) {
      // Score 11-12: Remedial B1
      navigate('/phase4/step/5/remedial/b1/taskA')
    } else if (total <= 14) {
      // Score 13-14: Remedial B2
      navigate('/phase4/step/5/remedial/b2/taskA')
    } else if (total <= 18) {
      // Score 15-18: Remedial C1 (max possible is 15, but keeping for safety)
      navigate('/phase4/step/5/remedial/c1/taskA')
    } else {
      // Score 19+: This shouldn't happen with max 15, but go to phase4 complete as fallback
      navigate('/phase4/complete')
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#27ae60', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 3 (Final)
        </Typography>
        <Typography variant="body1">
          Coherence & Vocabulary Enhancement Challenge
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="RYAN"
          message="Excellent grammar! Now, improve coherence/cohesion and vocabulary in the corrected texts—reorder/add connectors/enhance words for better flow and precision."
        />
      </Paper>

      {/* Previous Work Display */}
      {grammarCorrected && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9' }}>
          <Typography variant="subtitle1" color="success.dark" fontWeight="bold" gutterBottom>
            ✓ Your Grammar-Corrected Version
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#fff', border: '1px solid #4caf50' }}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#000' }}>
              {grammarCorrected}
            </Typography>
          </Paper>
        </Paper>
      )}

      {/* Enhancement Focus Display */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e9' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AutoFixHighIcon sx={{ color: '#27ae60' }} />
          <Typography variant="h6" color="#27ae60" fontWeight="bold">
            Focus: Coherence & Vocabulary
          </Typography>
        </Stack>

        <Alert severity="success">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Hint:
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Connectors:</strong> Add "because", "furthermore", "while", "first", "then" for logical flow
            <br />
            <strong>Vocabulary:</strong> Upgrade basic words:
            <ul style={{ marginTop: 4, marginBottom: 0 }}>
              <li>"good" → "eye-catching"</li>
              <li>"nice" → "persuasive"</li>
              <li>"show" → "illustrates", "demonstrates"</li>
              <li>"big" → "immersive", "expansive"</li>
            </ul>
          </Typography>
        </Alert>
      </Paper>

      {/* Enhancement Input */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Your Enhanced Version (add connectors & upgrade vocabulary)
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          placeholder="Improve coherence/cohesion with connectors and enhance vocabulary..."
          value={enhancedText}
          onChange={(e) => setEnhancedText(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        {!submitted && (
          <Button
            variant="contained"
            sx={{ backgroundColor: '#27ae60' }}
            onClick={handleSubmit}
            disabled={loading || !enhancedText.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={24} /> : <AutoFixHighIcon />}
          >
            {loading ? 'Evaluating...' : 'Submit Final Enhancement'}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && finalScore && (
        <>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'success.lighter',
              border: '2px solid',
              borderColor: 'success.main'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 40,
                  color: 'success.main',
                  mr: 2
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" color="success.dark">
                  Enhancement Complete!
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                  Score: {evaluation.score}/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CEFR Level: {evaluation.level}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {evaluation.feedback}
            </Typography>
          </Paper>

          {/* Final Summary */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              mb: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
              color: 'white'
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 80, mb: 2 }} />

            <Typography variant="h3" gutterBottom fontWeight="bold">
              🎉 Step 5 Complete! 🎉
            </Typography>

            <Paper elevation={4} sx={{ p: 3, backgroundColor: 'white', maxWidth: 500, mx: 'auto', my: 3 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ color: '#8e44ad' }}>
                {finalScore.total}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Points
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                (Max possible: 18 for C1 level)
              </Typography>
            </Paper>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                <Typography variant="body1">Interaction 1: Spelling Correction</Typography>
                <Chip label={`${finalScore.interaction1} pts`} sx={{ backgroundColor: 'white', color: '#8e44ad', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                <Typography variant="body1">Interaction 2: Grammar Correction</Typography>
                <Chip label={`${finalScore.interaction2} pts`} sx={{ backgroundColor: 'white', color: '#8e44ad', fontWeight: 'bold' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                <Typography variant="body1">Interaction 3: Coherence & Vocabulary</Typography>
                <Chip label={`${finalScore.interaction3} pts`} sx={{ backgroundColor: 'white', color: '#8e44ad', fontWeight: 'bold' }} />
              </Box>
            </Stack>

            <Typography variant="h6" sx={{ mb: 3 }}>
              You've successfully completed Phase 4 Step 5!<br />
              You've built autonomous writing skills through progressive error correction.
            </Typography>

            {finalScore.interaction3 >= 3 ? (
              <Typography variant="body1" sx={{ mb: 3 }}>
                Great job! Your sentence production score qualifies you to move on.
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ mb: 3 }}>
                You'll now complete remedial activities to strengthen your skills based on your performance.
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              sx={{
                backgroundColor: 'white',
                color: '#8e44ad',
                minWidth: 200,
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              {finalScore.interaction3 >= 3 ? 'Complete Phase 4' : 'Continue to Remedial Activities'}
            </Button>
          </Paper>
        </>
      )}
    </Box>
  )
}
