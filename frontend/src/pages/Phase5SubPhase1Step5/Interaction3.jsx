import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, CircularProgress, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { phase5API } from '../../lib/phase5_api.jsx'
import { useProgressSave } from '../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

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
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const [grammarCorrectedText, setGrammarCorrectedText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('phase5_step5_grammar_corrected_text')
    if (saved) { setGrammarCorrectedText(saved) }
    else { setGrammarCorrectedText('Dear guests, there is a lighting problem. We are using backup lights. The festival is ok. Thank you.') }
  }, [])

  const clay = (color) => ({
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3,
  })

  const handleGameComplete = (gameData) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction3', is_correct: true, score: gameData })
    setGameCompleted(true)
  }

  const handleSubmit = async () => {
    if (!grammarCorrectedText.trim() || !enhancedText.trim()) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please provide both grammar-corrected and enhanced texts.' })
      return
    }
    if (!gameCompleted) {
      setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: 'Please complete the Wordshake game first.' })
      return
    }
    setLoading(true)
    try {
      const result = await phase5API.evaluateEnhancement(grammarCorrectedText.trim(), enhancedText.trim())
      if (result.success && result.data) {
        const data = result.data
        setEvaluation({ success: true, score: data.score || 2, level: data.level || 'A2', feedback: data.feedback || 'Good enhancement!', improvements: data.improvements || {}, enhancement_percentage: data.enhancement_percentage || 0 })
        setSubmitted(true)
        sessionStorage.setItem('phase5_step5_interaction3_game_score', '1')
        sessionStorage.setItem('phase5_step5_interaction3_enhancement_score', (data.score || 2).toString())
        sessionStorage.setItem('phase5_step5_interaction3_level', data.level || 'A2')
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A2', feedback: result.error || 'Please try again.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      const enhancedLower = enhancedText.toLowerCase()
      const grammarWords = grammarCorrectedText.split(/\s+/).length
      const enhancedWords = enhancedText.split(/\s+/).length
      const hasConnectors = ['however', 'therefore', 'meanwhile', 'furthermore', 'moreover'].some(word => enhancedLower.includes(word))
      const hasPolite = ['sincerely', 'appreciate', 'thank you', 'patience', 'understanding'].some(phrase => enhancedLower.includes(phrase))
      const hasVocabUpgrade = ['technical issue', 'resolve', 'restoration', 'contingency', 'stakeholder'].some(upgrade => enhancedLower.includes(upgrade))
      const hasTimeline = ['minutes', 'shortly', 'within', 'expected'].some(word => enhancedLower.includes(word))
      const isLonger = enhancedWords > grammarWords * 1.2
      const improvements = { coherence: hasConnectors, tone: hasPolite && !['panic', 'urgent', 'emergency'].some(word => enhancedLower.includes(word)), vocabulary: hasVocabUpgrade, politeness: hasPolite, effectiveness: hasTimeline && isLonger }
      const improvementCount = Object.values(improvements).filter(Boolean).length
      let score = 2; let level = 'A2'
      if (improvementCount <= 2) { score = 2; level = 'A2' }
      else if (improvementCount <= 3) { score = 3; level = 'B1' }
      else if (improvementCount <= 4) { score = 4; level = 'B2' }
      else { score = 5; level = 'C1' }
      setEvaluation({ success: true, score, level, feedback: `Your enhancements show ${level} level sophistication.`, improvements, enhancement_percentage: (improvementCount / 5) * 100 })
      setSubmitted(true)
      sessionStorage.setItem('phase5_step5_interaction3_game_score', '1')
      sessionStorage.setItem('phase5_step5_interaction3_enhancement_score', score.toString())
      sessionStorage.setItem('phase5_step5_interaction3_level', level)
    } finally { setLoading(false) }
  }

  const handleContinue = () => { navigate('/phase5/subphase/1/step/5/score') }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.blue.border }}>Phase 5: Execution & Problem-Solving</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.blue.border }}>Step 5: Evaluate - Interaction 3</Typography>
            <Typography variant="body1">Enhance overall quality + Play Wordshake</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...clay(P.teal), mb: 3 }}>
            <CharacterMessage speaker="Ryan" message="Great grammar work! Now improve coherence/cohesion, tone, vocabulary, politeness, and overall effectiveness in the corrected texts. Then play Wordshake to form feedback terms." />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...clay(P.blue), mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Enhancement Areas</Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {ENHANCEMENT_AREAS.map((area, idx) => <Typography key={idx} variant="body2">• {area}</Typography>)}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Box sx={{ ...clay(P.orange), mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.orange.border }}>Expected Enhancement Examples (by level):</Typography>
            <Stack spacing={1}>
              {Object.entries(EXPECTED_ENHANCEMENTS).map(([level, enhancement]) => (
                <Box key={level}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.orange.border }}>{level}:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 2 }}>"{enhancement}"</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {!gameCompleted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{ ...clay(P.teal), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.teal.border }}>Step 1: Play Wordshake (2 minutes)</Typography>
              <Box sx={{ bgcolor: P.teal.bg, border: `1px solid ${P.teal.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.teal.border, fontSize: 20 }} />
                <Typography variant="body2">Form feedback terms like "strength", "weakness", "calm", "transparent", "reassure", "resolve", "refine" to refine your scores.</Typography>
              </Box>
              <WordshakeGame step={5} interaction={3} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
            </Box>
          </motion.div>
        )}

        {gameCompleted && !submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(P.blue), mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.blue.border }}>Step 2: Enhance Your Text</Typography>
              <Box sx={{ bgcolor: P.blue.bg, border: `1px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 1 }}>
                <InfoIcon sx={{ color: P.blue.border, fontSize: 20 }} />
                <Typography variant="body2">Use your grammar-corrected text and enhance it with better coherence, tone, vocabulary, politeness, and overall effectiveness.</Typography>
              </Box>
              <TextField fullWidth multiline rows={4} variant="outlined" label="Grammar-Corrected Text (from Interaction 2)" value={grammarCorrectedText} onChange={(e) => setGrammarCorrectedText(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={8} variant="outlined" label="Your Enhanced Text" placeholder="Write your enhanced version here with better coherence, tone, vocabulary, and politeness..." value={enhancedText} onChange={(e) => setEnhancedText(e.target.value)} sx={{ mb: 2 }} />
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={loading || !grammarCorrectedText.trim() || !enhancedText.trim()}
                sx={{
                  ...clay(P.blue), cursor: 'pointer', width: '100%',
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` },
                  transition: 'all 0.15s', opacity: (loading || !grammarCorrectedText.trim() || !enhancedText.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: P.blue.border }} /> : <Typography variant="button" fontWeight="bold" sx={{ color: P.blue.border }}>Submit Enhanced Text</Typography>}
              </Box>
            </Box>
          </motion.div>
        )}

        {evaluation && submitted && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...clay(evaluation.success ? P.green : P.orange), mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? P.green.border : P.orange.border, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: evaluation.success ? P.green.border : P.orange.border }}>{evaluation.success ? 'Enhancement Evaluated!' : 'Try Again'}</Typography>
                  <Typography variant="body2">Level: {evaluation.level} | Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''} | Enhancement: {evaluation.enhancement_percentage?.toFixed(0)}%</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{evaluation.feedback}</Typography>
              {evaluation.improvements && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Improvements Made:</Typography>
                  <Stack spacing={1}>
                    {Object.entries(evaluation.improvements).map(([area, improved]) => (
                      <Box key={area} sx={{ display: 'flex', alignItems: 'center' }}>
                        {improved
                          ? <CheckCircleIcon sx={{ color: P.green.border, mr: 1, fontSize: 20 }} />
                          : <Box sx={{ width: 20, height: 20, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '6px', mr: 1, display: 'inline-block' }} />
                        }
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{area.replace('_', ' ')}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  ...clay(P.green), cursor: 'pointer', width: '100%', mt: 2,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s',
                }}
              >
                <Typography variant="button" fontWeight="bold" sx={{ color: P.green.border }}>Continue to Score Calculation</Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
