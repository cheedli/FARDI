import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task A
 * Debate Simulation: "Report Defense Debate"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const WORD_BANK = [
  'balanced evaluation', 'lessons learned', 'stakeholder accountability',
  'continuous improvement', 'evidence-based', 'transparency', 'actionable recommendations'
]

const DIALOGUE = [
  { speaker: 'Skeptical Sponsor', text: 'Why do we need a report with weaknesses?' },
  {
    speaker: 'You',
    template: 'A ___ shows ___ and builds trust.',
    gaps: [
      { id: 'g1', options: ['balanced evaluation', 'simple summary', 'positive report'], correct: 'balanced evaluation' },
      { id: 'g2', options: ['transparency', 'weakness', 'evidence-based'], correct: 'transparency' }
    ]
  },
  { speaker: 'Skeptical Sponsor', text: 'Just tell us it was good.' },
  {
    speaker: 'You',
    template: 'Identifying ___ allows ___ and ___.',
    gaps: [
      { id: 'g3', options: ['lessons learned', 'good results', 'stakeholder accountability'], correct: 'lessons learned' },
      { id: 'g4', options: ['continuous improvement', 'balanced evaluation', 'transparency'], correct: 'continuous improvement' },
      { id: 'g5', options: ['actionable recommendations', 'evidence-based', 'stakeholder accountability'], correct: 'actionable recommendations' }
    ]
  },
  { speaker: 'Skeptical Sponsor', text: "Isn't that negative?" },
  {
    speaker: 'You',
    template: 'No — honest analysis with ___ strengths and weaknesses demonstrates ___.',
    gaps: [
      { id: 'g6', options: ['evidence-based', 'balanced evaluation', 'continuous improvement'], correct: 'evidence-based' },
      { id: 'g7', options: ['stakeholder accountability', 'transparency', 'lessons learned'], correct: 'stakeholder accountability' }
    ]
  }
]

export default function Phase6SP1Step1RemC1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/1/remedial/c1/task/b') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = DIALOGUE.filter(d => d.gaps).flatMap(d => d.gaps)
  const allAnswered = allGaps.every(g => answers[g.id])

  const handleSubmit = async () => {
    let correct = 0
    allGaps.forEach(g => { if (answers[g.id] === g.correct) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'A', correct, allGaps.length, 0, 1) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{
            bgcolor: P.orange.bg,
            border: `2px solid ${P.orange.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.orange.shadow}`,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 6: Reflection and Evaluation</Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 1: Remedial Practice - Level C1</Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task A: Report Defense Debate</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Defend the value of a balanced post-event report to a skeptical sponsor</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{
            bgcolor: P.teal.bg,
            border: `2px solid ${P.teal.border}`,
            borderRadius: '20px',
            boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3,
            mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Report Defense Debate! You need to convince a skeptical sponsor why your post-event report should include weaknesses and challenges. Use the advanced vocabulary words below to complete the debate!"
            />
          </Box>
        </motion.div>

        {/* Advanced Word Bank */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 1 }}>Advanced Word Bank:</Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {WORD_BANK.map(w => (
              <Box key={w} sx={{
                px: 1.5, py: 0.5,
                bgcolor: P.purple.bg,
                border: `2px solid ${P.purple.border}`,
                borderRadius: '10px',
                boxShadow: `2px 2px 0 ${P.purple.shadow}`,
                fontSize: '0.8rem', fontWeight: 'bold', color: P.purple.shadow
              }}>{w}</Box>
            ))}
          </Stack>
        </Box>

        {/* Dialogue */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          {DIALOGUE.map((line, idx) => {
            if (!line.gaps) {
              return (
                <Box key={idx} sx={{
                  bgcolor: P.yellow.bg,
                  border: `2px solid ${P.yellow.border}`,
                  borderRadius: '14px',
                  boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
                  p: 2
                }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: P.yellow.shadow }}>{line.speaker}:</Typography>
                  <Typography variant="body1" fontStyle="italic">"{line.text}"</Typography>
                </Box>
              )
            }
            const parts = line.template.split('___')
            return (
              <Box key={idx} sx={{
                bgcolor: P.blue.bg,
                border: `2px solid ${P.blue.border}`,
                borderRadius: '14px',
                boxShadow: `2px 2px 0 ${P.blue.shadow}`,
                p: 2
              }}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: P.blue.shadow, mb: 1 }}>{line.speaker} (your turn):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  {parts.map((part, pi) => (
                    <React.Fragment key={pi}>
                      <Typography variant="body1">{part}</Typography>
                      {pi < line.gaps.length && (
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <Select
                            value={answers[line.gaps[pi].id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [line.gaps[pi].id]: e.target.value })}
                            disabled={submitted}
                            displayEmpty
                            renderValue={(v) => v || '___'}
                          >
                            {line.gaps[pi].options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                          </Select>
                        </FormControl>
                      )}
                      {submitted && pi < line.gaps.length && answers[line.gaps[pi].id] !== line.gaps[pi].correct && (
                        <Typography variant="body2" color="error" sx={{ fontStyle: 'italic' }}>
                          (correct: {line.gaps[pi].correct})
                        </Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            )
          })}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              opacity: allAnswered ? 1 : 0.6,
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '16px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
              '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit Debate
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task A Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{allGaps.length}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 6 ? 'Outstanding! Excellent use of advanced reporting vocabulary!' : 'Good work! Review the correct terms and their usage.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/b')}
                sx={{
                  cursor: 'pointer', mt: 2, px: 4, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
