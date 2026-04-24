import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const FAULTY_TEXT =
  'Hey! Your report is ok. The sucesses part is good. The chalenge part needs work. You should fix the grammer. The recomendations are not specific. Do better next time. But good job anyway!'

const MODEL_ANSWER =
  "Your report demonstrates a commendable level of effort and a clear understanding of the event's key outcomes. The Successes section is particularly strong, effectively highlighting the main achievements with appropriate use of formal language. The Challenges section, whilst honest in its assessment, would benefit from more specific examples and a brief explanation of how each difficulty was addressed. To improve grammatical accuracy throughout, I suggest reviewing subject-verb agreement and tense consistency, particularly in the Methodology section. The Recommendations section would be significantly strengthened by the inclusion of specific, measurable targets — for example, 'increase volunteer recruitment by 20% for the next event'. I recognise that producing a thorough post-event report requires considerable time and analytical effort. Nevertheless, the clarity of your overall structure and the honesty of your self-assessment reflect genuine commitment to improvement. I look forward to seeing these refinements in your next draft."

const PROMPTS = [
  'Formal opening — replace "Hey! Your report is ok" with a specific, formal positive statement.',
  'Spelling-corrected praise for the successes section — correct "sucesses" and add detail.',
  'Formal transition to challenges — correct "chalenge" and use formal language.',
  'Grammar-corrected constructive suggestion — correct "grammer" errors in a full formal sentence.',
  'Specific recommendation fix — replace "recomendations are not specific" with a concrete suggestion.',
  'Empathetic statement — replace "Do better next time" with an empathetic, forward-looking suggestion.',
  'Balanced closing — replace "But good job anyway!" with a genuine, specific positive close.',
  'Professional sign-off sentence — add a final forward-looking statement.',
]

export default function Phase6SP2Step5RemB2TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/b2/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_b2' })
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)

  const cardSx = (color) => ({ bgcolor: color.bg, border: `2px solid ${color.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${color.shadow}`, p: 3 })

  const handleChange = (index, value) => {
    setAnswers(prev => { const updated = [...prev]; updated[index] = value; return updated })
  }

  const wordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const filled = answers.filter(a => wordCount(a) >= 8).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_b2_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'B2', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = answers.some(a => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial B2 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Analysis Odyssey — Rewrite a Flawed Peer Feedback Draft (B2 Level)</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.purple.border }}>Faulty Peer Feedback Draft</Typography>
            <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 2, borderRadius: '12px' }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{FAULTY_TEXT}</Typography>
            </Box>
            <Typography variant="body2">This draft has spelling errors, informal register, vague comments, and no constructive guidance. Rewrite each section using the 8 guided prompts below. Each answer must be at least 8 words.</Typography>
          </Box>
        </motion.div>

        {PROMPTS.map((prompt, index) => {
          const wc = wordCount(answers[index])
          const isSufficient = submitted && wc >= 8
          const isInsufficient = submitted && wc < 8
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.04 }}>
              <Box sx={{ ...cardSx(isSufficient ? P.green : isInsufficient ? P.red : P.blue), mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, color: P.blue.border }}>Sentence {index + 1}</Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }}>{prompt}</Typography>
                <TextField
                  fullWidth multiline rows={2}
                  value={answers[index]}
                  onChange={e => handleChange(index, e.target.value)}
                  disabled={submitted}
                  placeholder={`Write your revised sentence ${index + 1} here (min. 8 words)...`}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: submitted && wc < 8 ? P.red.border : 'text.secondary' }}>
                  Words: {wc}{submitted && wc < 8 ? ' (minimum 8 words required)' : ''}
                </Typography>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!anyFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !anyFilled ? 'not-allowed' : 'pointer', opacity: !anyFilled ? 0.6 : 1, '&:hover': anyFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit Rewrite
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(score >= 6 ? P.green : score >= 4 ? P.yellow : P.blue), mb: 2, p: 2 }}>
              <Typography variant="body2" sx={{ color: score >= 6 ? P.green.shadow : score >= 4 ? P.yellow.shadow : P.blue.shadow }}>
                You completed {score}/8 sentences with sufficient detail (8+ words each).{' '}
                {score === 8 ? 'Outstanding — full formal rewrite achieved!' : 'Review the model answer below for guidance on incomplete sentences.'}
              </Typography>
            </Box>

            <Box component="button" onClick={() => setShowModel(prev => !prev)} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, bgcolor: P.purple.bg, color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, py: 1.5, px: 3, fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` }, transition: 'all 0.15s' }}>
              <LightbulbIcon sx={{ fontSize: 18 }} />
              {showModel ? 'Hide Model Answer' : 'Show Model Answer'}
            </Box>

            <Collapse in={showModel}>
              <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.purple.border }}>Model Answer</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{MODEL_ANSWER}</Typography>
              </Box>
            </Collapse>

            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task B Complete! Score: {score}/8</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score >= 6 ? 'Excellent rewrite — formal language and constructive structure are clear.' : 'Good effort! Study the model answer to strengthen your formal peer feedback writing.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/b2/task/c')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
