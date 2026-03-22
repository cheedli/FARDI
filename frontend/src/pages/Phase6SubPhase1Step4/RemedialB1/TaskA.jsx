import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Stack,
  Select, MenuItem, FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const BLANK1_OPTIONS = ['success', 'failure', 'problem']
const BLANK2_OPTIONS = ['challenge', 'nothing', 'fun']
const BLANK3_OPTIONS = ['recommend', 'ignore', 'delete']

export default function Phase6SP1Step4RemB1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 4, interaction: 1, context: 'remedial_b1' })
  const [blank1, setBlank1] = useState('')
  const [blank2, setBlank2] = useState('')
  const [blank3, setBlank3] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    let correct = 0
    if (blank1 === 'success') correct++
    if (blank2 === 'challenge') correct++
    if (blank3 === 'recommend') correct++
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step4_remedial_b1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(4, 'B1', 'A', correct, 3, 0, 1) } catch (e) { console.error(e) }
  }

  const allFilled = blank1 && blank2 && blank3

  const cardSx = (color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: 3,
  })

  const gap = (value, setter, options, correct) => (
    <FormControl size="small" sx={{ minWidth: 130, mx: 0.5 }}>
      <Select
        value={value}
        onChange={(e) => setter(e.target.value)}
        disabled={submitted}
        displayEmpty
        sx={submitted ? {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: value === correct ? P.green.border : P.red.border,
            borderWidth: 2
          }
        } : {}}
      >
        <MenuItem value=""><em>choose...</em></MenuItem>
        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 4: Remedial Practice — Level B1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task A: Negotiation Gap Fill</Typography>
            <Typography variant="body1" color="text.secondary">Complete the dialogue with the correct report vocabulary</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx(P.teal), mb: 3 }}>
            <Typography variant="body2">Choose the correct word for each blank to complete the negotiation dialogue.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Line 1: SKANDER */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...cardSx(P.red) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.red.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>SKANDER</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>"What write first?"</Typography>
            </Box>
          </motion.div>

          {/* Line 2: You — BLANK1 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{
              ...cardSx(submitted ? (blank1 === 'success' ? P.green : P.red) : P.purple),
            }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.purple.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>You</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1">Write about</Typography>
                {gap(blank1, setBlank1, BLANK1_OPTIONS, 'success')}
                <Typography variant="body1">first.</Typography>
              </Box>
              {submitted && blank1 !== 'success' && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>Correct: <strong>success</strong></Typography>
              )}
            </Box>
          </motion.div>

          {/* Line 3: Emna */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ ...cardSx(P.orange) }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.orange.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Emna</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.05rem' }}>"Then?"</Typography>
            </Box>
          </motion.div>

          {/* Line 4: You — BLANK2 + BLANK3 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Box sx={{
              ...cardSx(submitted ? (blank2 === 'challenge' && blank3 === 'recommend' ? P.green : P.red) : P.purple),
            }}>
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: P.purple.border, borderRadius: '8px', display: 'inline-block', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>You</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body1">Then write</Typography>
                {gap(blank2, setBlank2, BLANK2_OPTIONS, 'challenge')}
                <Typography variant="body1">and</Typography>
                {gap(blank3, setBlank3, BLANK3_OPTIONS, 'recommend')}
                <Typography variant="body1">.</Typography>
              </Box>
              {submitted && (blank2 !== 'challenge' || blank3 !== 'recommend') && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Correct: <strong>challenge</strong> and <strong>recommend</strong>
                </Typography>
              )}
            </Box>
          </motion.div>
        </Stack>

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
            Submit
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(P.purple), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border }} gutterBottom>
                Task A Complete! Score: {score}/3
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {score === 3 ? 'Perfect! You know what to include in a report.' : 'Good effort! Review the correct answers above.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/4/remedial/b1/task/b')}
                sx={{
                  px: 6, py: 1.5,
                  bgcolor: P.purple.bg,
                  border: `2px solid ${P.purple.border}`,
                  borderRadius: '16px',
                  boxShadow: `4px 4px 0 ${P.purple.shadow}`,
                  cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '1rem',
                  color: P.purple.border,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                Continue to Task B →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
