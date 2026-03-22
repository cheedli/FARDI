import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = {
  pageBg: '#FFFDE7',
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const WORD_BANK = ['constructive', 'empathy', 'growth mindset', 'balanced', 'actionable', 'nuanced']

const CORRECT_ANSWERS = {
  gap1: 'balanced',
  gap2: 'empathy',
  gap3: 'actionable',
  gap4: 'growth mindset',
}

const DIALOGUE = [
  {
    speaker: 'Peer',
    role: 'peer',
    text: 'Why does feedback need to follow a positive sandwich? Isn\'t it just sugar-coating?',
    gap: null,
  },
  {
    speaker: 'You',
    role: 'you',
    textBefore: 'Not at all — ',
    gap: 'gap1',
    textAfter: ' feedback that opens and closes positively is more likely to be received well and acted upon.',
    multiGap: false,
  },
  {
    speaker: 'Peer',
    role: 'peer',
    text: 'But what if the work is genuinely poor? Don\'t you just say so?',
    gap: null,
  },
  {
    speaker: 'You',
    role: 'you',
    textBefore: 'With ',
    gap: 'gap2',
    textMiddle: ' you can be honest AND kind. The goal is ',
    gap2: 'gap3',
    textEnd: ' suggestions that drive a ',
    gap3: 'gap4',
    textFinal: ' rather than discouragement.',
    multiGap: true,
  },
]

export default function Phase6SP2Step3RemC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 1, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({ gap1: '', gap2: '', gap3: '', gap4: '' })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [usedWords, setUsedWords] = useState([])

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleSelect = (gapKey, value) => {
    if (submitted) return
    const prev = answers[gapKey]
    const newUsed = usedWords.filter(w => w !== prev)
    if (value) newUsed.push(value)
    setUsedWords(newUsed)
    setAnswers(p => ({ ...p, [gapKey]: value }))
  }

  const allFilled = Object.values(answers).every(v => v !== '')

  const handleSubmit = async () => {
    if (!allFilled) return
    let correct = 0
    Object.keys(CORRECT_ANSWERS).forEach(key => { if (answers[key] === CORRECT_ANSWERS[key]) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taska_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'A', correct, 4, 0, 2) } catch (e) { console.error(e) }
  }

  const GapSelect = ({ gapKey }) => {
    const isCorrect = submitted && answers[gapKey] === CORRECT_ANSWERS[gapKey]
    const isWrong = submitted && answers[gapKey] !== CORRECT_ANSWERS[gapKey]
    const col = isCorrect ? P.green : isWrong ? P.red : P.purple
    return (
      <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', mx: 0.5, verticalAlign: 'middle' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={answers[gapKey]}
            onChange={e => handleSelect(gapKey, e.target.value)}
            disabled={submitted}
            displayEmpty
            sx={{
              fontSize: '0.9rem',
              bgcolor: col.bg,
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: col.border, borderWidth: 2 },
            }}
          >
            <MenuItem value="" disabled><em>choose...</em></MenuItem>
            {WORD_BANK.map(word => (
              <MenuItem key={word} value={word} disabled={usedWords.includes(word) && answers[gapKey] !== word}>{word}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {submitted && (
          <Typography variant="caption" sx={{ color: isCorrect ? P.green.border : P.red.border, fontSize: '0.7rem', pl: 0.5 }}>
            {isCorrect ? '✓ Correct' : `✗ → ${CORRECT_ANSWERS[gapKey]}`}
          </Typography>
        )}
      </Box>
    )
  }

  const DialogueLine = ({ turn }) => {
    const isPeer = turn.role === 'peer'
    return (
      <Box sx={{ display: 'flex', justifyContent: isPeer ? 'flex-start' : 'flex-end', mb: 2 }}>
        <Box sx={{
          maxWidth: '80%',
          p: 2,
          borderRadius: '16px',
          bgcolor: isPeer ? P.teal.bg : P.purple.bg,
          border: `2px solid ${isPeer ? P.teal.border : P.purple.border}`,
          boxShadow: `3px 3px 0 ${isPeer ? P.teal.shadow : P.purple.shadow}`,
        }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: isPeer ? P.teal.border : P.purple.border, display: 'block', mb: 0.5 }}>
            {turn.speaker}
          </Typography>
          {turn.gap === null ? (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{turn.text}</Typography>
          ) : turn.multiGap ? (
            <Typography variant="body1" component="span" sx={{ lineHeight: 2.4 }}>
              {turn.textBefore}
              <GapSelect gapKey={turn.gap} />
              {turn.textMiddle}
              <GapSelect gapKey={turn.gap2} />
              {turn.textEnd}
              <GapSelect gapKey={turn.gap3} />
              {turn.textFinal}
            </Typography>
          ) : (
            <Typography variant="body1" component="span" sx={{ lineHeight: 2.4 }}>
              {turn.textBefore}
              <GapSelect gapKey={turn.gap} />
              {turn.textAfter}
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial C1 — Task A</Typography>
            <Typography>Debate Simulation — Defend the Positive Sandwich</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">You're in a debate about the positive sandwich feedback structure. Fill in the gaps in YOUR lines using the word bank. Each word can only be used once — choose carefully to make your argument as persuasive as possible!</Typography>
          </Box>

          {/* Word Bank */}
          <Box sx={{ ...cardSx('purple'), mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: P.purple.border, mb: 1 }}>Word Bank</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WORD_BANK.map(word => (
                <Box key={word} sx={{
                  px: 2, py: 0.5,
                  bgcolor: usedWords.includes(word) ? P.purple.border : P.purple.bg,
                  border: `1px solid ${P.purple.border}`,
                  borderRadius: '8px',
                  opacity: usedWords.includes(word) ? 0.5 : 1,
                  textDecoration: usedWords.includes(word) ? 'line-through' : 'none',
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: usedWords.includes(word) ? 'white' : P.purple.border }}>{word}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Dialogue */}
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.teal.border, mb: 0.5 }}>Debate Dialogue</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Select a word from the word bank for each gap in your lines (shown in purple).</Typography>
            {DIALOGUE.map((turn, i) => <DialogueLine key={i} turn={turn} />)}
          </Box>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allFilled}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: allFilled ? 'pointer' : 'not-allowed', opacity: allFilled ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': allFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit Answers
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 1 }}>Task A Complete! Score: {score}/4</Typography>
              <Typography sx={{ mb: 2 }}>
                {score === 4 ? 'Perfect! You used every term precisely in context.'
                  : score >= 3 ? 'Excellent — you grasp the core principles of effective peer feedback.'
                  : score >= 2 ? 'Good effort! Review the word meanings and try to match them to context clues.'
                  : 'Keep practising — re-read the dialogue and consider what each gap is describing.'}
              </Typography>

              <Stack spacing={1} sx={{ mb: 2, textAlign: 'left' }}>
                {Object.entries(CORRECT_ANSWERS).map(([key, correct], i) => (
                  <Box key={key} sx={{
                    p: 1.5, borderRadius: '12px',
                    bgcolor: answers[key] === correct ? P.green.bg : P.red.bg,
                    border: `1px solid ${answers[key] === correct ? P.green.border : P.red.border}`,
                  }}>
                    <Typography variant="body2">
                      <strong>Gap {i + 1}:</strong> {answers[key] === correct
                        ? `"${correct}" — correct!`
                        : `You chose "${answers[key]}" → correct answer: "${correct}"`}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/b')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task B
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
