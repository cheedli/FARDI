import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, CircularProgress, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task B: Analysis Odyssey (Analytical Writing)
 * 8-sentence analytical paragraph on social media effectiveness with AI evaluation
 */

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

const GUIDED_QUESTIONS = [
  'How do hashtags impact organic reach and discoverability?',
  'What role does a concise caption play in audience retention?',
  'Why are emojis functional as emotional cues?',
  'How does a call-to-action create behavioral triggers?',
  'What benefits does strategic tagging provide for network expansion?',
  'How do timing and visual quality affect post performance?',
  'What analytics metrics measure social media success?',
  'How can optimization strategies amplify post effectiveness?'
]

const EXAMPLE_SENTENCES = [
  'Strategic hashtags amplify organic reach through targeted discoverability.',
  'Concise captions retain attention in fast-scrolling environments.',
  'Emojis function as visual emotional cues that enhance engagement.',
  'Direct call-to-action statements create measurable behavioral triggers.',
  'Strategic user tagging exponentially expands network reach.',
  'Visual quality and optimal timing synergistically boost performance.',
  'Analytics metrics provide quantifiable success indicators.',
  'Continuous optimization based on data drives sustained effectiveness.'
]

export default function Phase4_2Step3RemedialC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 2, context: 'remedial_c1' })
  const [analysis, setAnalysis] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [aiScore, setAiScore] = useState(null)
  const [aiFeedback, setAiFeedback] = useState('')
  const [evaluating, setEvaluating] = useState(false)

  const handleTextChange = (e) => {
    const text = e.target.value
    setAnalysis(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setWordCount(words.length)
    setSentenceCount(sentences.length)
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    try {
      // AI evaluation for C1 level analytical writing
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'B',
          text: analysis,
          criteria: 'sophisticated analytical paragraph on social media effectiveness with cohesive argumentation'
        })
      })

      const data = await response.json()
      setAiScore(data.score || 0)
      setAiFeedback(data.feedback || 'Analysis evaluated.')

      sessionStorage.setItem('phase4_2_step3_c1_taskB_score', data.score || 0)

    } catch (error) {
      console.error('AI evaluation failed:', error)
      // Fallback: sentence-based scoring
      const fallbackScore = Math.min((sentenceCount / 8) * 8, 8)
      setAiScore(fallbackScore)
      setAiFeedback('Evaluated based on sentence count.')
      sessionStorage.setItem('phase4_2_step3_c1_taskB_score', fallbackScore)
    }

    setEvaluating(false)
    setShowResults(true)
    logTaskCompletion()
  }

  const logTaskCompletion = async () => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: aiScore })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'B',
          score: aiScore,
          max_score: 8,
          content: analysis
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/taskC')
  }

  const isComplete = sentenceCount >= 8

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 4.2 · Step 3 · Level C1 · Task B
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>
              Analysis Odyssey
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Write a sophisticated 8-sentence analytical paragraph on social media effectiveness. Use the guided questions and examples to structure your analysis with advanced vocabulary, precise terminology, and cohesive argumentation. Your work will be evaluated by AI for C1-level sophistication."
            />
          </Box>

          {/* Guided Questions */}
          <Box sx={{ ...clayCard('blue'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 2 }}>
              Guided Questions (Answer each in your analysis):
            </Typography>
            {GUIDED_QUESTIONS.map((question, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2, color: isDark ? '#ccc' : '#333' }}>
                {idx + 1}. {question}
              </Typography>
            ))}
          </Box>

          {/* Example Sentences */}
          <Box sx={{ ...clayCard('green'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.green.border, mb: 2 }}>
              Example Sentences (Use as models for sophistication):
            </Typography>
            {EXAMPLE_SENTENCES.map((sentence, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2, color: isDark ? '#ccc' : '#333' }}>
                {idx + 1}. {sentence}
              </Typography>
            ))}
          </Box>

          {/* Instructions */}
          <Box sx={{ ...clayCard('yellow'), mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: P.yellow.border }}>
              Instructions:
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 0.5 }}>
              Write an 8-sentence analytical paragraph addressing each guided question. Use sophisticated vocabulary and demonstrate critical thinking.
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 1 }}>
              <strong>Key terms to include:</strong> strategic hashtags, organic reach, concise captions, emotional cues, behavioral triggers, network expansion, analytics metrics, optimization.
            </Typography>
          </Box>

          {/* Writing Area */}
          <Box sx={{ ...clayCard('purple'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>
              Your Analytical Paragraph
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={16}
              value={analysis}
              onChange={handleTextChange}
              placeholder="Write your analytical paragraph here... Address how strategic hashtags amplify reach, how concise captions retain attention, why emojis function as emotional cues, how CTAs trigger behavior, how tagging expands networks, how timing/quality affect performance, which metrics measure success, and how optimization drives effectiveness."
              variant="outlined"
              disabled={showResults}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#1a1a2e' : 'white',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                  '&:hover fieldset': { borderColor: P.purple.shadow },
                  '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                  '& textarea': { color: isDark ? '#eee' : '#1a252f', fontWeight: 500 }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>
                Words: {wordCount} | Sentences: {sentenceCount} | Target: 8 sentences (approx. 150-200 words)
              </Typography>
              {isComplete && !showResults && (
                <Typography variant="caption" sx={{ color: P.green.border, fontWeight: 'bold' }}>
                  Ready to submit!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Results */}
          {showResults && (
            <Box sx={{ ...clayCard(aiScore >= 7 ? 'green' : 'yellow'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: aiScore >= 7 ? P.green.border : P.yellow.border, mb: 1 }}>
                {aiScore >= 7 ? 'Excellent Analytical Writing!' : 'Good Effort!'}
              </Typography>
              <Typography sx={{ color: isDark ? '#ddd' : '#333' }}>AI Score: {aiScore}/8 points</Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: isDark ? '#bbb' : '#555' }}>
                {aiFeedback}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {!showResults && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={sentenceCount < 6 || evaluating}
                sx={{
                  ...clayCard('blue'),
                  cursor: sentenceCount >= 6 && !evaluating ? 'pointer' : 'not-allowed',
                  opacity: sentenceCount >= 6 && !evaluating ? 1 : 0.5,
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.blue.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': sentenceCount >= 6 && !evaluating ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                {evaluating && <CircularProgress size={20} sx={{ color: P.blue.border }} />}
                {evaluating ? 'Evaluating...' : 'Submit Analysis'}
              </Box>
            )}
            {showResults && (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task C <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
