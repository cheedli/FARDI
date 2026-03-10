import React, { useState, useEffect } from 'react'
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
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

/**
 * Phase 5 Step 5: Evaluate
 * Interaction 3: Wordshake + Overall Enhancement
 * Enhance coherence, tone, vocabulary, politeness, and play Wordshake
 */

const TARGET_WORDS = ['strength', 'weakness', 'calm', 'transparent', 'reassure', 'resolve', 'refine']

const EXPECTED_ENHANCEMENTS = {
  A2: 'Lights problem. We use backup. Festival start soon. Thank you 😊.',
  B1: 'Dear guests, there is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you very much for your patience.',
  B2: 'Dear festival community, a temporary technical issue has affected the main stage lighting. Our team is swiftly activating the backup system and expects full resolution within 20-30 minutes. The event will proceed as scheduled. We sincerely appreciate your understanding and patience during this short interruption. Thank you - see you soon!',
  C1: 'Immediate stakeholder update: An unforeseen technical malfunction has temporarily compromised the main stage lighting system one hour prior to opening. Our response team has promptly engaged the pre-tested contingency protocol, with the backup lighting array now fully deployed-restoration is projected within 20-25 minutes. The festival program remains entirely unchanged, and we remain fully committed to delivering the exceptional experience you expect. We deeply value your patience and continued trust during this brief disruption. Thank you for being part of this celebration of global unity.'
}

const ENHANCEMENT_AREAS = [
  'Coherence/Cohesion: Add connectors (however, therefore, meanwhile)',
  'Tone: Make it calm, reassuring, professional (not panic)',
  'Vocabulary: Upgrade terms (problem → technical issue, fix → resolve)',
  'Politeness: Add phrases (We sincerely appreciate..., Thank you for your patience)',
  'Crisis Effectiveness: Clear solution, timeline, CTA'
]

export default function Phase5Step5Interaction3() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 5, subphase: 1, step: 5, interaction: 3, context: 'main' })
  const [grammarCorrectedText, setGrammarCorrectedText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Load grammar-corrected text from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('phase5_step5_grammar_corrected_text')
    if (saved) {
      setGrammarCorrectedText(saved)
    } else {
      // Fallback to a default
      setGrammarCorrectedText('Dear guests, there is a lighting problem. We are using backup lights. The festival is ok. Thank you.')
    }
  }, [])

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!grammarCorrectedText.trim() || !enhancedText.trim()) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please provide both grammar-corrected and enhanced texts.'
      })
      return
    }

    if (!gameCompleted) {
      setEvaluation({
        success: false,
        score: 0,
        level: 'Below A2',
        feedback: 'Please complete the Wordshake game first.'
      })
      return
    }

    setLoading(true)

    try {
      const result = await phase5API.evaluateEnhancement(grammarCorrectedText.trim(), enhancedText.trim())

      if (result.success && result.data) {
        const data = result.data
        setEvaluation({
          success: true,
          score: data.score || 2,
          level: data.level || 'A2',
          feedback: data.feedback || 'Good enhancement!',
          improvements: data.improvements || {},
          enhancement_percentage: data.enhancement_percentage || 0
        })
        setSubmitted(true)

        sessionStorage.setItem('phase5_step5_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step5_interaction3_enhancement_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction3_level', data.level || 'A2')
      } else {
        setEvaluation({
          success: false,
          score: 0,
          level: 'Below A2',
          feedback: result.error || 'Please try again.'
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation
      const enhancedLower = enhancedText.toLowerCase()
      const grammarWords = grammarCorrectedText.split(/\s+/).length
      const enhancedWords = enhancedText.split(/\s+/).length

      const hasConnectors = ['however', 'therefore', 'meanwhile', 'furthermore', 'moreover'].some(word => enhancedLower.includes(word))
      const hasPolite = ['sincerely', 'appreciate', 'thank you', 'patience', 'understanding'].some(phrase => enhancedLower.includes(phrase))
      const hasVocabUpgrade = ['technical issue', 'resolve', 'restoration', 'contingency', 'stakeholder'].some(upgrade => enhancedLower.includes(upgrade))
      const hasTimeline = ['minutes', 'shortly', 'within', 'expected'].some(word => enhancedLower.includes(word))
      const isLonger = enhancedWords > grammarWords * 1.2

      const improvements = {
        coherence: hasConnectors,
        tone: hasPolite && !['panic', 'urgent', 'emergency'].some(word => enhancedLower.includes(word)),
        vocabulary: hasVocabUpgrade,
        politeness: hasPolite,
        effectiveness: hasTimeline && isLonger
      }

      const improvementCount = Object.values(improvements).filter(Boolean).length

      let score = 2
      let level = 'A2'
      if (improvementCount <= 2) {
        score = 2
        level = 'A2'
      } else if (improvementCount <= 3) {
        score = 3
        level = 'B1'
      } else if (improvementCount <= 4) {
        score = 4
        level = 'B2'
      } else {
        score = 5
        level = 'C1'
      }

      setEvaluation({
        success: true,
        score,
        level,
        feedback: `Your enhancements show ${level} level sophistication.`,
        improvements,
        enhancement_percentage: (improvementCount / 5) * 100
      })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step5_interaction3_enhancement_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction3_level', level)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/phase5/subphase/1/step/5/score')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Interaction 3
        </Typography>
        <Typography variant="body1">
          Enhance overall quality + Play Wordshake
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ryan"
          message="Great grammar work! Now improve coherence/cohesion, tone, vocabulary, politeness, and overall effectiveness in the corrected texts. Then play Wordshake to form feedback terms."
        />
      </Paper>

      {/* Enhancement Areas Reference */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Enhancement Areas
        </Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          {ENHANCEMENT_AREAS.map((area, idx) => (
            <Typography key={idx} variant="body2">
              • {area}
            </Typography>
          ))}
        </Stack>
      </Paper>

      {/* Expected Examples */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Expected Enhancement Examples (by level):
        </Typography>
        <Stack spacing={1}>
          {Object.entries(EXPECTED_ENHANCEMENTS).map(([level, enhancement]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>
                "{enhancement}"
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Wordshake Game Section */}
      {!gameCompleted && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Step 1: Play Wordshake (2 minutes)
          </Typography>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Form feedback terms like "strength", "weakness", "calm", "transparent", "reassure", "resolve", "refine" to refine your scores.
            </Typography>
          </Alert>
          <WordshakeGame
            step={5}
            interaction={3}
            targetTime={120} // 2 minutes
            targetWords={TARGET_WORDS}
            onComplete={handleGameComplete}
          />
        </Paper>
      )}

      {/* Enhancement Section */}
      {gameCompleted && !submitted && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Step 2: Enhance Your Text
            </Typography>
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Use your grammar-corrected text and enhance it with better coherence, tone, vocabulary, politeness, and overall effectiveness.
              </Typography>
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Grammar-Corrected Text (from Interaction 2)"
              value={grammarCorrectedText}
              onChange={(e) => setGrammarCorrectedText(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              label="Your Enhanced Text"
              placeholder="Write your enhanced version here with better coherence, tone, vocabulary, and politeness..."
              value={enhancedText}
              onChange={(e) => setEnhancedText(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !grammarCorrectedText.trim() || !enhancedText.trim()}
              fullWidth
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Evaluating...' : 'Submit Enhanced Text'}
            </Button>
          </Paper>
        </>
      )}

      {/* Evaluation Results */}
      {evaluation && submitted && (
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
                {evaluation.success ? 'Enhancement Evaluated!' : 'Try Again'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Enhancement: {evaluation.enhancement_percentage?.toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {evaluation.feedback}
          </Typography>

          {evaluation.improvements && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Improvements Made:
              </Typography>
              <Stack spacing={1}>
                {Object.entries(evaluation.improvements).map(([area, improved]) => (
                  <Box key={area} sx={{ display: 'flex', alignItems: 'center' }}>
                    {improved ? (
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                    ) : (
                      <Chip label="Not improved" color="default" size="small" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {area.replace('_', ' ')}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Continue to Score Calculation
          </Button>
        </Paper>
      )}
    </Box>
  )
}
