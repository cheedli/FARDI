import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Collapse, Stack, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const LIGHT = { pageBg: '#FFFDE7', orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' }, green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' }, blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' }, yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' }, red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' }, purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' } }
const DARK = { pageBg: '#0F0F1A', orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' }, green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' }, blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' }, yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' }, red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' }, purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' } }

const FAULTY_TEXT =
  'This report is ok. Sucesses are good. Challange part needs work. Grammer errors. Recomendations not specific. Structure is bad. Do better. Good luck!'

const KEY_TERMS = ['credibility', 'objectivity', 'nuanced', 'accountability', 'evidence-based', 'growth mindset']

const MODEL_ANSWER =
  "This report reflects a commendable level of analytical effort and a genuine commitment to honest self-evaluation of the event's outcomes. The Successes section demonstrates strong evidence-based reasoning, effectively linking achievements to measurable outcomes such as attendance figures and satisfaction ratings. Furthermore, the overall organisational structure reflects a sophisticated understanding of academic report conventions, lending the document considerable credibility with its intended stakeholder audience. Notwithstanding these strengths, the Challenges section would benefit from a more nuanced and evidence-based analysis — supplementing the qualitative observations with quantitative data from participant exit surveys would significantly enhance the section's objectivity. Additionally, whilst the Recommendations are appropriate in their scope, greater specificity — for instance, replacing 'improve communication' with 'establish a weekly cross-departmental briefing protocol' — would render them substantially more actionable. I recognise that producing a report of this analytical depth requires sustained intellectual effort and careful management of competing responsibilities, particularly in a time-constrained context. Nevertheless, the quality of your reflective analysis and your evident accountability to the event's stakeholders demonstrate a level of professional maturity that is commendable. I am confident that with these targeted refinements, this report will exemplify best practice in evidence-based, analytically rigorous post-event evaluation."

const PROMPTS = [
  'Sophisticated positive opening — formal, specific, acknowledge overall quality (min. 10 words).',
  'Evidence-based strength — cite specific section/language with textual reference (min. 10 words).',
  'Second strength with stakeholder impact (min. 10 words).',
  'Nuanced transition — use: notwithstanding / whilst / it is worth noting (min. 10 words).',
  'Evidence-based constructive suggestion 1 — linked to a specific section (min. 10 words).',
  'Evidence-based constructive suggestion 2 — with audience/purpose rationale (min. 10 words).',
  'Empathetic acknowledgement — contextual, not generic (min. 10 words).',
  'Evaluative C1 close — synthesise findings, affirm potential, invite dialogue (min. 10 words).',
]

export default function Phase6SP2Step5RemC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/5/remedial/c1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 2, context: 'remedial_c1' })
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
    const filled = answers.filter(a => wordCount(a) >= 10).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taskb_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'B', filled, 8, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = answers.some(a => a.trim().length > 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx(P.orange), mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.orange.border }}>Step 5: Remedial C1 — Task B</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Analysis Odyssey — C1-Level Rewrite of a Severely Flawed Feedback Draft</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...cardSx(P.purple), mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: P.purple.border }}>C1 Key Terms to Use (incorporate where appropriate):</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {KEY_TERMS.map(t => (
                <Box key={t} sx={{ bgcolor: P.purple.border, color: 'white', fontWeight: 'bold', px: 2, py: 0.5, borderRadius: '10px', fontSize: '0.875rem' }}>{t}</Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{ ...cardSx(P.red), mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.red.border }}>Faulty Feedback Draft to Rewrite</Typography>
            <Box sx={{ ...cardSx(P.yellow), p: 2, mb: 2, borderRadius: '12px' }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{FAULTY_TEXT}</Typography>
            </Box>
            <Typography variant="body2">This draft contains spelling errors, fragmented sentences, vague language, and lacks analytical depth. Rewrite each part using the 8 prompts below. Each sentence must be at least 10 words and demonstrate C1-level precision.</Typography>
          </Box>
        </motion.div>

        {PROMPTS.map((prompt, index) => {
          const wc = wordCount(answers[index])
          const isSufficient = submitted && wc >= 10
          const isInsufficient = submitted && wc < 10
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
                  placeholder={`Write your C1-level sentence ${index + 1} here (min. 10 words)...`}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: submitted && wc < 10 ? P.red.border : 'text.secondary' }}>
                  Words: {wc}{submitted && wc < 10 ? ' (minimum 10 words required)' : ''}
                </Typography>
              </Box>
            </motion.div>
          )
        })}

        {!submitted ? (
          <Box component="button" onClick={handleSubmit} disabled={!anyFilled} sx={{ width: '100%', bgcolor: P.orange.border, color: 'white', border: `2px solid ${P.orange.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, py: 1.5, fontSize: '1rem', fontWeight: 'bold', cursor: !anyFilled ? 'not-allowed' : 'pointer', opacity: !anyFilled ? 0.6 : 1, '&:hover': anyFilled ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}, transition: 'all 0.15s' }}>
            Submit C1 Rewrite
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ ...cardSx(score >= 6 ? P.green : score >= 4 ? P.yellow : P.blue), mb: 2, p: 2 }}>
              <Typography variant="body2" sx={{ color: score >= 6 ? P.green.shadow : score >= 4 ? P.yellow.shadow : P.blue.shadow }}>
                You completed {score}/8 sentences with sufficient C1-level detail (10+ words each).{' '}
                {score === 8 ? 'Outstanding C1 analytical writing!' : 'Review the model answer below for guidance on sentence structure and key term usage.'}
              </Typography>
            </Box>

            <Box component="button" onClick={() => setShowModel(prev => !prev)} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, bgcolor: P.purple.bg, color: P.purple.border, border: `2px solid ${P.purple.border}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, py: 1.5, px: 3, fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.purple.shadow}` }, transition: 'all 0.15s' }}>
              <LightbulbIcon sx={{ fontSize: 18 }} />
              {showModel ? 'Hide Model Answer' : 'Show Model Answer'}
            </Box>

            <Collapse in={showModel}>
              <Box sx={{ ...cardSx(P.purple), mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: P.purple.border }}>Model Answer</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.9 }}>{MODEL_ANSWER}</Typography>
              </Box>
            </Collapse>

            <Box sx={{ ...cardSx(P.green), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.shadow }}>Task B Complete! Score: {score}/8</Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{score >= 6 ? 'Excellent C1 analytical writing — evidence-based, nuanced, and formally precise.' : 'Good effort! Study the model answer to deepen your command of C1 academic feedback discourse.'}</Typography>
              <Box component="button" onClick={() => navigate('/phase6/subphase/2/step/5/remedial/c1/task/c')} sx={{ bgcolor: P.green.border, color: 'white', border: `2px solid ${P.green.shadow}`, borderRadius: '14px', boxShadow: `4px 4px 0 ${P.green.shadow}`, py: 1.5, px: 4, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` }, transition: 'all 0.15s' }}>
                Continue to Task C
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
