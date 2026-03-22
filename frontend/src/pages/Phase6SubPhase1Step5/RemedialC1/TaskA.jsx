import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
}

const WORD_BANK = ['balanced evaluation', 'evidence-based', 'actionable', 'transparency']

const DIALOGUE = [
  { speaker: 'Opponent', text: 'Report too positive?' },
  {
    speaker: 'You',
    template: ['Lacks [', '].'],
    gaps: [{ id: 'g1', correct: 'balanced evaluation' }]
  },
  { speaker: 'Opponent', text: 'Why evidence?' },
  {
    speaker: 'You',
    template: ['Needs [', '] analysis for [', '] and [', '] recommendations.'],
    gaps: [
      { id: 'g2', correct: 'evidence-based' },
      { id: 'g3', correct: 'transparency' },
      { id: 'g4', correct: 'actionable' }
    ]
  }
]

export default function Phase6SP1Step5RemC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allGaps = ['g1', 'g2', 'g3', 'g4']
  const allFilled = allGaps.every(g => answers[g])

  const handleSubmit = async () => {
    let correct = 0
    if (answers['g1'] === 'balanced evaluation') correct++
    if (answers['g2'] === 'evidence-based') correct++
    if (answers['g3'] === 'transparency') correct++
    if (answers['g4'] === 'actionable') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'A', correct, 4, 0, 1) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const renderLine = (line, idx) => {
    if (line.gaps) {
      let gapIdx = 0
      return (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2, p: 1.5, bgcolor: P.green.bg, borderRadius: '12px', borderLeft: `3px solid ${P.green.border}` }}>
          <Typography variant="body2" sx={{ color: P.green.border, fontWeight: 'bold', mr: 1 }}>You:</Typography>
          {line.template.map((part, pi) => {
            if (part === '[') {
              const gap = line.gaps[gapIdx++]
              const isCorrect = submitted && answers[gap.id] === gap.correct
              const isWrong = submitted && answers[gap.id] !== gap.correct
              return (
                <React.Fragment key={pi}>
                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <Select value={answers[gap.id] || ''} onChange={(e) => setAnswers({ ...answers, [gap.id]: e.target.value })} disabled={submitted} displayEmpty>
                      <MenuItem value="" disabled><em>Choose...</em></MenuItem>
                      {WORD_BANK.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {submitted && isWrong && <Typography variant="caption" sx={{ color: P.red.border }}>→ {gap.correct}</Typography>}
                </React.Fragment>
              )
            }
            return <Typography key={pi} variant="body1">{part}</Typography>
          })}
        </Box>
      )
    }
    return (
      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2, p: 1.5, bgcolor: P.red.bg, borderRadius: '12px', borderLeft: `3px solid ${P.red.border}` }}>
        <Typography variant="body2" sx={{ color: P.red.border, fontWeight: 'bold', minWidth: 80 }}>{line.speaker}:</Typography>
        <Typography variant="body1">"{line.text}"</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Debate Simulation</Typography>
            <Typography variant="body1" color="text.secondary">Defend evidence-based, balanced report writing using advanced terminology</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Debate Simulation! An opponent challenges your report writing. Use advanced terminology to defend your approach. Use the word bank to argue for evidence-based, transparent, and balanced reporting!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('teal'), mb: 2 }}>
            <Typography variant="body2"><strong>Word Bank:</strong> {WORD_BANK.join(' | ')}</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="body2"><strong>Scenario:</strong> Your opponent claims your report is biased and too positive. Defend the need for balanced, evidence-based reporting with actionable recommendations.</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            {DIALOGUE.map((line, idx) => renderLine(line, idx))}
          </Box>
        </motion.div>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              opacity: !allFilled ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit Debate Response
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task A Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/4</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score === 4 ? 'Perfect! You argued for balanced, evidence-based reporting with precision.' : score >= 3 ? 'Excellent! Strong use of C1 terminology.' : 'Good effort! Review the correct terms — they are key for professional report writing.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/b')}
                sx={{
                  mt: 2, px: 6, py: 1.5,
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: P.green.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
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
