import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
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

const PROMPTS = [
  { id: 1, label: 'Sophisticated positive opening', instruction: 'Open with a genuine strength. Use words like "demonstrates", "commendable", or "analytical depth".', hint: 'e.g. "Your report demonstrates a sophisticated command of formal register and a commendable capacity for self-critical analysis."', keyWords: ['demonstrates', 'commendable', 'analytical depth', 'analytical'] },
  { id: 2, label: 'Specific strength with evidence', instruction: 'Identify a specific section or feature of their work and explain why it is strong.', hint: 'e.g. "The Challenges section, in particular, is notable for its nuanced and balanced treatment of the logistical difficulties encountered."', keyWords: ['section', 'notable', 'nuanced', 'balanced', 'particular'] },
  { id: 3, label: 'Second strength with impact on reader/audience', instruction: 'Name a second strength and explain its effect on the reader or audience.', hint: 'e.g. "The use of passive voice throughout lends the report an appropriate level of objectivity and academic detachment."', keyWords: ['lends', 'objectivity', 'detachment', 'reader', 'effect', 'audience', 'academic'] },
  { id: 4, label: 'Nuanced transition', instruction: 'Bridge to your constructive suggestions using a sophisticated connector: "Notwithstanding", "Whilst", or "It is worth noting".', hint: 'e.g. "Notwithstanding these strengths, the Recommendations section would benefit from greater specificity…"', keyWords: ['notwithstanding', 'whilst', 'it is worth noting', 'however', 'nevertheless'] },
  { id: 5, label: 'Constructive suggestion 1 — specific and linked', instruction: 'Give a specific improvement suggestion linked to a named section or finding.', hint: 'e.g. "…replacing \'improve communication\' with measurable targets such as \'hold weekly briefings\'."', keyWords: ['specific', 'recommend', 'suggest', 'such as', 'for instance', 'measurable', 'replacing'] },
  { id: 6, label: 'Constructive suggestion 2 — with rationale', instruction: 'Give a second suggestion and explain WHY it would strengthen the work.', hint: 'e.g. "…the Successes section would be further strengthened by the inclusion of comparative data from previous events to contextualise the achievements."', keyWords: ['strengthen', 'contextualise', 'comparative', 'data', 'inclusion', 'rationale', 'because', 'would'] },
  { id: 7, label: 'Empathetic acknowledgement', instruction: 'Acknowledge the writer\'s effort or context with empathy before closing.', hint: 'e.g. "I recognise that gathering such longitudinal data is time-intensive, particularly in a context where resources are limited."', keyWords: ['recognise', 'acknowledge', 'understand', 'appreciate', 'context', 'effort', 'time'] },
  { id: 8, label: 'Forward-looking positive close', instruction: 'End on a positive, forward-looking note. Use "I look forward to" or "I am confident that".', hint: 'e.g. "I am confident that with these refinements, the report will serve as an exemplary model for future events."', keyWords: ['i look forward', 'i am confident', 'confident that', 'look forward', 'future', 'exemplary'] },
]

const MODEL_ANSWER = `Your report demonstrates a sophisticated command of formal register and a commendable capacity for self-critical analysis. The Challenges section, in particular, is notable for its nuanced and balanced treatment of the logistical difficulties encountered. The use of passive voice throughout lends the report an appropriate level of objectivity and academic detachment. Notwithstanding these strengths, the Recommendations section would benefit from greater specificity — for instance, replacing 'improve communication' with measurable targets such as 'hold weekly briefings'. Additionally, the Successes section, whilst comprehensive, would be further strengthened by the inclusion of comparative data from previous events to contextualise the achievements. I recognise that gathering such longitudinal data is time-intensive, particularly in a context where resources are limited. Nevertheless, your analytical rigour and commitment to honest evaluation are clearly evident throughout. I am confident that with these refinements, the report will serve as an exemplary model for future events.`

function scorePromptResponse(text, prompt) {
  if (!text || text.trim().length < 10) return false
  const lower = text.toLowerCase()
  return prompt.keyWords.some(kw => lower.includes(kw.toLowerCase()))
}

export default function Phase6SP2Step3RemC1TaskB() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase6/subphase/2/step/3/remedial/c1/task/c') }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 2, context: 'remedial_c1' })
  const [responses, setResponses] = useState(Array(8).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModel, setShowModel] = useState(false)
  const [showHints, setShowHints] = useState(Array(8).fill(false))

  const filledCount = responses.filter(r => r.trim().length >= 10).length
  const progress = (filledCount / 8) * 100

  const toggleHint = (i) => setShowHints(prev => prev.map((v, idx) => idx === i ? !v : v))
  const handleChange = (i, val) => setResponses(prev => prev.map((v, idx) => idx === i ? val : v))

  const handleSubmit = async () => {
    if (filledCount < 8) return
    let correct = 0
    responses.forEach((resp, i) => { if (scorePromptResponse(resp, PROMPTS[i])) correct++ })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'B', correct, 8, 0, 2) } catch (e) { console.error(e) }
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial C1 — Task B</Typography>
            <Typography>Analysis Odyssey — Write Sophisticated Positive Sandwich Feedback</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">You are writing full C1-level peer feedback using the positive sandwich structure. Complete all 8 sections in sequence — each builds on the last to create a cohesive, sophisticated paragraph. Use the hints if you need guidance, but try on your own first!</Typography>
          </Box>

          {/* Progress */}
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: P.purple.border }}>{filledCount}/8 sections completed</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4, bgcolor: P.purple.bg, '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }}
            />
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {PROMPTS.map((prompt, i) => {
              const isOk = submitted && scorePromptResponse(responses[i], prompt)
              const isTip = submitted && !scorePromptResponse(responses[i], prompt)
              return (
                <Box key={prompt.id} sx={{
                  bgcolor: submitted ? (isOk ? P.green.bg : P.yellow.bg) : P.teal.bg,
                  border: `2px solid ${submitted ? (isOk ? P.green.border : P.yellow.border) : P.teal.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${submitted ? (isOk ? P.green.shadow : P.yellow.shadow) : P.teal.shadow}`,
                  p: 3,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ px: 1.5, py: 0.3, bgcolor: P.purple.border, color: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem' }}>
                        {prompt.id}/8
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: P.purple.border }}>{prompt.label}</Typography>
                    </Box>
                    {!submitted && (
                      <Box
                        component="button"
                        onClick={() => toggleHint(i)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.5,
                          px: 1.5, py: 0.5, borderRadius: '8px',
                          bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`,
                          cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: P.yellow.shadow,
                          '&:hover': { bgcolor: P.yellow.border, color: 'white' }
                        }}
                      >
                        <LightbulbIcon sx={{ fontSize: 14 }} />
                        {showHints[i] ? 'Hide' : 'Hint'}
                      </Box>
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>{prompt.instruction}</Typography>

                  {showHints[i] && (
                    <Box sx={{ p: 1.5, mb: 1.5, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px' }}>
                      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>{prompt.hint}</Typography>
                    </Box>
                  )}

                  <TextField
                    fullWidth multiline rows={3}
                    value={responses[i]}
                    onChange={e => handleChange(i, e.target.value)}
                    disabled={submitted}
                    placeholder="Write your sentence(s) here…"
                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.purple.border } } }}
                  />

                  {submitted && (
                    <Box sx={{ mt: 1, p: 1.5, borderRadius: '12px', bgcolor: isOk ? P.green.bg : P.orange.bg, border: `1px solid ${isOk ? P.green.border : P.orange.border}` }}>
                      <Typography variant="body2" sx={{ color: isOk ? P.green.shadow : P.orange.shadow }}>
                        {isOk ? 'Good — your response demonstrates the required element.'
                          : `Tip: Try to include key language such as: ${prompt.keyWords.slice(0, 3).join(', ')}.`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>

          {!submitted ? (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={filledCount < 8}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: filledCount >= 8 ? 'pointer' : 'not-allowed', opacity: filledCount >= 8 ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': filledCount >= 8 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit All 8 Sections ({filledCount}/8 filled)
            </Box>
          ) : (
            <Box sx={{ ...cardSx('purple'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.purple.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.purple.border, fontWeight: 700, mb: 1 }}>Task B Complete! Score: {score}/8</Typography>
              <Typography sx={{ mb: 2 }}>
                {score >= 7 ? 'Outstanding — your feedback is truly C1-level!'
                  : score >= 5 ? 'Strong work! A few sections could use more sophisticated language.'
                  : score >= 3 ? 'Good effort — review the model answer to see how key phrases are deployed.'
                  : 'Keep practising — study the model answer carefully and note the structural flow.'}
              </Typography>

              <Box sx={{ borderTop: `1px solid ${P.purple.border}`, pt: 2, mb: 2 }} />

              <Box
                component="button"
                onClick={() => setShowModel(v => !v)}
                sx={{ ...cardSx('teal'), cursor: 'pointer', fontWeight: 600, mb: 2, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } }}
              >
                {showModel ? 'Hide Model Answer' : 'View Model Answer'}
              </Box>

              {showModel && (
                <Box sx={{ p: 2.5, mb: 2, bgcolor: P.teal.bg, border: `1px solid ${P.teal.border}`, borderRadius: '12px', textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Model Answer:</Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.9, fontStyle: 'italic' }}>{MODEL_ANSWER}</Typography>
                </Box>
              )}

              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/2/step/3/remedial/c1/task/c')}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue to Task C
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
