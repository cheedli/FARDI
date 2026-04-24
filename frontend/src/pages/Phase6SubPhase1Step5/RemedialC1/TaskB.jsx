import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField } from '@mui/material'
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
}
const DARK = {
  pageBg: '#0F0F1A',
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const FAULTY_TEXT = 'Festival good. Many people come. Dances nice. Food good. Lights problem bad. We fix fast. People happy. Next time better.'

const MODEL_ANSWER = `The Global Cultures Festival achieved its core objectives of promoting intercultural dialogue, attracting over 200 participants and generating overwhelmingly positive qualitative feedback. High-impact elements — authentic performances and diverse cuisine — facilitated meaningful cross-cultural engagement. While a technical lighting failure presented a notable challenge, the rapid deployment of contingency protocols ensured continuity. Core organizational strengths included exceptional team resilience. However, schedule density reduced opportunities for deeper interaction, as noted in feedback. Evidence from attendance figures and participant comments supports the need for extended transition periods. It is strongly recommended that future iterations incorporate stricter time buffers. Long-term, formalizing a comprehensive risk-management framework would significantly enhance event quality.`

const GUIDED_POINTS = [
  { id: 0, point: 'Festival achieved core objectives (mention intercultural dialogue + 200+ participants)', placeholder: 'The Global Cultures Festival achieved its core objectives...' },
  { id: 1, point: 'High-impact elements (authentic performances + diverse cuisine)', placeholder: 'High-impact elements — authentic performances...' },
  { id: 2, point: 'Technical lighting failure + contingency deployed', placeholder: 'While a technical lighting failure presented...' },
  { id: 3, point: 'Core organizational strength (team resilience)', placeholder: 'Core organizational strengths included...' },
  { id: 4, point: 'Challenge: schedule density (from feedback)', placeholder: 'However, schedule density reduced...' },
  { id: 5, point: 'Evidence supporting need for improvement', placeholder: 'Evidence from attendance figures and participant comments...' },
  { id: 6, point: 'Strong recommendation for future events', placeholder: 'It is strongly recommended that future iterations...' },
  { id: 7, point: 'Long-term strategic framework recommendation', placeholder: 'Long-term, formalizing a comprehensive risk-management framework...' }
]

export default function Phase6SP1Step5RemC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/1/step/5/remedial/c1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 5, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_POINTS.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_POINTS.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 10) correct++ // C1 requires more substantial sentences
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step5_remedial_c1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'B', correct, GUIDED_POINTS.length, 0, 1) } catch (e) { console.error(e) }
  }

  const cardSx = (color) => ({
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
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>
              Phase 6: Reflection &amp; Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>Step 5: Remedial Practice — Level C1</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Task B: Analysis Odyssey</Typography>
            <Typography variant="body1" color="text.secondary">Rewrite 8 faulty sentences at C1 level with sophisticated language and balance</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Analysis Odyssey! Transform this informal, unbalanced report into a sophisticated C1-level document. Use advanced vocabulary (substantial, pivotal, contingency, resilience, stakeholder), formal connectors (while, however, furthermore), and evidence-based language. Aim for 10+ words per sentence!"
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx('red'), mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: P.red.border, fontWeight: 'bold' }} gutterBottom>Faulty Text to Transform:</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{FAULTY_TEXT}</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Typography variant="body2"><strong>C1 Instructions:</strong> Each sentence must be 10+ words. Use sophisticated vocabulary, formal structure (passive voice where appropriate), evidence-based language, and logical connectors. Balance successes and challenges.</Typography>
          </Box>
        </motion.div>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {GUIDED_POINTS.map((s, idx) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04 }}>
              <Box sx={{ ...cardSx('orange') }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {s.id + 1}. {s.point}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={sentences[s.id] || ''}
                  onChange={(e) => setSentences({ ...sentences, [s.id]: e.target.value })}
                  disabled={submitted}
                  placeholder={s.placeholder}
                />
                {submitted && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: ((sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 10) ? P.green.border : P.orange.border }}>
                    Words: {(sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length} {((sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length >= 10) ? '✓' : '(aim for 10+)'}
                  </Typography>
                )}
              </Box>
            </motion.div>
          ))}
        </Stack>

        {!submitted ? (
          <Box
            component="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              width: '100%', py: 1.5,
              bgcolor: P.orange.bg,
              border: `2px solid ${P.orange.border}`,
              borderRadius: '16px',
              boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              cursor: !allAnswered ? 'not-allowed' : 'pointer',
              opacity: !allAnswered ? 0.5 : 1,
              fontWeight: 'bold', fontSize: '1rem',
              color: P.orange.border,
              '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
              transition: 'all 0.15s ease',
            }}
          >
            Submit C1 Analysis
          </Box>
        ) : (
          <Box>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ ...cardSx('green'), mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: P.green.border, fontWeight: 'bold' }} gutterBottom>C1 Model Answer:</Typography>
                <Typography variant="body2" sx={{ lineHeight: 2 }}>{MODEL_ANSWER}</Typography>
              </Box>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Box sx={{ ...cardSx('green'), mt: 2, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
                <Typography variant="h5" sx={{ color: P.green.border }} gutterBottom>Task B Complete!</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>Score: {score}/{GUIDED_POINTS.length} sophisticated sentences</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {score >= 7 ? 'Outstanding! A sophisticated and balanced C1-level report.' : score >= 5 ? 'Well done! Compare your sentences with the model answer above.' : 'Good effort! Focus on using 10+ words with sophisticated vocabulary per sentence.'}
                </Typography>
                <Box
                  component="button"
                  onClick={() => navigate('/phase6/subphase/1/step/5/remedial/c1/task/c')}
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
                  Next: Task C →
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}
      </Container>
    </Box>
  )
}
