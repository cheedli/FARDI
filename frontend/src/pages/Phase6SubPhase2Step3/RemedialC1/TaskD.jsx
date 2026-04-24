import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, TextField, LinearProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase2RemedialNextUrl } from '../../Phase6SubPhase2/shared/routing.js'
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
  purple: { bg: '#3B0764', border: '#C084FC', shadow: '#6B21A8' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const EXTRACTS = [
  { id: 1, extract: '"Your report is fine but the recommendations are weak."', critiqueChip: 'Vague + no empathy', fixChip: 'Specific + empathetic', weakness: 'Vague, unempathetic, and opens with a lukewarm qualifier that undermines the positive intent.', modelFix: '"Your report demonstrates solid analytical structure; to strengthen it further, the Recommendations section would benefit from measurable, specific targets linked directly to your findings."', fixKeyWords: ['recommendations', 'specific', 'measurable', 'benefit', 'strengthen', 'analytical'], critiqueKeyWords: ['vague', 'lukewarm', 'weak', 'unspecific', 'empathy', 'negative', 'qualifier'] },
  { id: 2, extract: '"I think maybe you could possibly consider adding more details."', critiqueChip: 'Over-hedged + vague', fixChip: 'Confident + specific', weakness: 'Excessive hedging makes the feedback uncertain and unhelpful — the writer cannot act on vague suggestions.', modelFix: '"To enhance the credibility of your Successes section, I recommend including specific data such as attendance figures or satisfaction scores."', fixKeyWords: ['recommend', 'specific', 'data', 'attendance', 'scores', 'credibility', 'successes', 'include'], critiqueKeyWords: ['hedge', 'vague', 'uncertain', 'unhelpful', 'cannot act', 'excessive', 'over-hedged', 'hedging'] },
  { id: 3, extract: '"Good job! But everything needs to be redone."', critiqueChip: 'Contradictory + harsh', fixChip: 'Balanced positive sandwich', weakness: 'Contradictory opening and closing; the sweeping negative ("everything") is discouraging and unhelpful.', modelFix: '"Your introduction is clear and well-structured. To develop the report further, the Challenges section would benefit from more specific examples, and the Recommendations from clearer action points."', fixKeyWords: ['introduction', 'well-structured', 'challenges', 'specific', 'examples', 'recommendations', 'action'], critiqueKeyWords: ['contradictory', 'sweeping', 'discouraging', 'harsh', 'everything', 'negative'] },
  { id: 4, extract: '"The vocabulary is good."', critiqueChip: 'Vague praise', fixChip: 'Evidence-based praise', weakness: 'Unspecific praise offers no insight — the writer cannot learn from or build on it.', modelFix: '"Your use of formal register throughout — particularly phrases such as \'it is recommended that\' and \'the data suggests\' — demonstrates a strong command of academic report language."', fixKeyWords: ['formal register', 'recommended', 'data suggests', 'academic', 'demonstrates', 'command', 'particularly'], critiqueKeyWords: ['vague', 'unspecific', 'no insight', 'generic', 'hollow', 'cannot learn'] },
  { id: 5, extract: '"You should fix the grammar and spelling before submitting this."', critiqueChip: 'No balance + blunt', fixChip: 'Balanced + empathetic', weakness: 'Opens negatively with no acknowledgement of strengths; blunt tone risks discouraging the writer.', modelFix: '"The content of your report is thoughtful and well-researched. Before final submission, a careful proofreading pass would help eliminate minor grammatical inconsistencies and further strengthen the professional impression."', fixKeyWords: ['thoughtful', 'well-researched', 'proofreading', 'submission', 'professional', 'strengthen', 'eliminate'], critiqueKeyWords: ['negative', 'blunt', 'no strength', 'no acknowledgement', 'discouraging', 'harsh'] },
]

function scoreTextField(text, keyWords) {
  if (!text || text.trim().length < 15) return false
  const lower = text.toLowerCase()
  return keyWords.some(kw => lower.includes(kw.toLowerCase()))
}

export default function Phase6SP2Step3RemC1TaskD() {
  const navigate = useNavigate()
  React.useEffect(() => { resolveSubphase2RemedialNextUrl(3, 'C1').then(url => { window.__remedialSkip = () => navigate(url) }) }, [])
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(5).fill(''))
  const [fixes, setFixes] = useState(Array(5).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModels, setShowModels] = useState(Array(5).fill(false))

  const cardSx = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const totalFilled = [...critiques, ...fixes].filter(v => v.trim().length >= 15).length
  const progress = (totalFilled / 10) * 100

  const toggleModel = (i) => setShowModels(prev => prev.map((v, idx) => idx === i ? !v : v))

  const handleSubmit = async () => {
    if (totalFilled < 10) return
    let extractScore = 0
    EXTRACTS.forEach((_, i) => {
      const critiqueOk = scoreTextField(critiques[i], EXTRACTS[i].critiqueKeyWords)
      const fixOk = scoreTextField(fixes[i], EXTRACTS[i].fixKeyWords)
      if (critiqueOk || fixOk) extractScore++
    })
    setScore(extractScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskd_score', extractScore.toString())
    try { await phase6API.logRemedialActivity(3, 'C1', 'D', extractScore, 5, 0, 2) } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...cardSx('orange'), mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: P.orange.border, mb: 0.5 }}>Step 3: Remedial C1 — Task D</Typography>
            <Typography>Critique Kahoot — Identify Weaknesses and Rewrite Flawed Feedback</Typography>
          </Box>

          <Box sx={{ ...cardSx('blue'), mb: 3 }}>
            <Typography variant="body2">Five flawed peer feedback extracts are shown below. For each one: (1) write a critique explaining what is wrong with it, and (2) rewrite it as effective C1-level positive sandwich feedback. Be specific in both your critique and your fix!</Typography>
          </Box>

          {/* Progress */}
          <Box sx={{ ...cardSx('teal'), mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Fields completed (critiques + fixes)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: P.purple.border }}>{totalFilled}/10</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4, bgcolor: P.purple.bg, '& .MuiLinearProgress-bar': { bgcolor: P.purple.border } }}
            />
          </Box>

          <Stack spacing={3} sx={{ mb: 3 }}>
            {EXTRACTS.map((item, i) => {
              const critiqueOk = submitted && scoreTextField(critiques[i], item.critiqueKeyWords)
              const fixOk = submitted && scoreTextField(fixes[i], item.fixKeyWords)
              return (
                <Box key={item.id} sx={cardSx('teal')}>
                  {/* Extract header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ bgcolor: P.purple.border, color: 'white', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                      {item.id}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: P.purple.border }}>Extract {item.id}</Typography>
                    <Box sx={{ px: 1.5, py: 0.3, bgcolor: P.red.bg, border: `1px solid ${P.red.border}`, borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: P.red.border }}>{item.critiqueChip}</Typography>
                    </Box>
                    <Box sx={{ px: 1.5, py: 0.3, bgcolor: P.green.bg, border: `1px solid ${P.green.border}`, borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: P.green.shadow }}>{item.fixChip}</Typography>
                    </Box>
                  </Box>

                  {/* Flawed extract */}
                  <Box sx={{ p: 2, mb: 2.5, bgcolor: P.yellow.bg, border: `1px solid ${P.yellow.border}`, borderRadius: '12px' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: P.orange.shadow, display: 'block', mb: 0.5 }}>Flawed Extract:</Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>{item.extract}</Typography>
                  </Box>

                  <Box sx={{ borderTop: `1px solid ${P.teal.border}`, mb: 2 }} />

                  {/* Critique field */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: P.red.border, mb: 0.5 }}>Your Critique — What is wrong with this feedback?</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Explain the specific weakness(es) using analytical language.</Typography>
                    <TextField
                      fullWidth multiline rows={3}
                      value={critiques[i]}
                      onChange={e => setCritiques(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                      disabled={submitted}
                      placeholder="e.g. This extract is problematic because…"
                      sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.red.border } } }}
                    />
                    {submitted && (
                      <Box sx={{ mt: 1, p: 1.5, borderRadius: '12px', bgcolor: critiqueOk ? P.green.bg : P.orange.bg, border: `1px solid ${critiqueOk ? P.green.border : P.orange.border}` }}>
                        <Typography variant="body2" sx={{ color: critiqueOk ? P.green.shadow : P.orange.shadow }}>
                          {critiqueOk ? 'Good — your critique identifies the key weakness.'
                            : `Strong critiques mention: ${item.critiqueKeyWords.slice(0, 3).join(', ')}. The core issue: ${item.weakness}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Fix field */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: P.green.shadow, mb: 0.5 }}>Your Rewrite — Improve it using the positive sandwich structure</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Write a C1-level version that is balanced, specific, and empathetic.</Typography>
                    <TextField
                      fullWidth multiline rows={3}
                      value={fixes[i]}
                      onChange={e => setFixes(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                      disabled={submitted}
                      placeholder="e.g. Your report demonstrates… To strengthen it further…"
                      sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: P.green.border } } }}
                    />
                    {submitted && (
                      <Box sx={{ mt: 1, p: 1.5, borderRadius: '12px', bgcolor: fixOk ? P.green.bg : P.orange.bg, border: `1px solid ${fixOk ? P.green.border : P.orange.border}` }}>
                        <Typography variant="body2" sx={{ color: fixOk ? P.green.shadow : P.orange.shadow }}>
                          {fixOk ? 'Excellent rewrite — you applied the positive sandwich structure effectively.'
                            : `Effective rewrites include: ${item.fixKeyWords.slice(0, 3).join(', ')}.`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Model answer toggle */}
                  {submitted && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        component="button"
                        onClick={() => toggleModel(i)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.5,
                          px: 2, py: 0.75, borderRadius: '10px', cursor: 'pointer',
                          bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`,
                          fontWeight: 600, color: P.purple.border, fontSize: '0.875rem',
                          '&:hover': { bgcolor: P.purple.border, color: 'white' }
                        }}
                      >
                        <LightbulbIcon sx={{ fontSize: 16 }} />
                        {showModels[i] ? 'Hide Model Answer' : 'View Model Answer'}
                      </Box>
                      {showModels[i] && (
                        <Box sx={{ mt: 1, p: 2, bgcolor: P.purple.bg, border: `1px solid ${P.purple.border}`, borderRadius: '12px' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: P.purple.border, display: 'block', mb: 0.5 }}>Model Critique:</Typography>
                          <Typography variant="body2" sx={{ mb: 1.5, fontStyle: 'italic' }}>{item.weakness}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: P.purple.border, display: 'block', mb: 0.5 }}>Model Rewrite:</Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{item.modelFix}</Typography>
                        </Box>
                      )}
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
              disabled={totalFilled < 10}
              sx={{
                ...cardSx('orange'),
                width: '100%', cursor: totalFilled >= 10 ? 'pointer' : 'not-allowed', opacity: totalFilled >= 10 ? 1 : 0.6,
                textAlign: 'center', fontWeight: 700, fontSize: '1.1rem',
                '&:hover': totalFilled >= 10 ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {}
              }}
            >
              Submit All Critiques &amp; Rewrites ({totalFilled}/10 filled)
            </Box>
          ) : (
            <Box sx={{ ...cardSx('green'), textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" sx={{ color: P.green.border, fontWeight: 700, mb: 1 }}>Task D Complete! Score: {score}/5</Typography>
              <Typography sx={{ mb: 2 }}>
                {score === 5 ? 'Outstanding — you identified every flaw and produced genuinely C1-level rewrites!'
                  : score >= 4 ? 'Excellent work — your critiques and rewrites demonstrate strong analytical ability.'
                  : score >= 3 ? 'Good effort! Review the model answers to sharpen your language for the weaker extracts.'
                  : score >= 2 ? 'Reasonable — compare your rewrites carefully with the model answers and note key phrases.'
                  : 'Keep practising — study each model answer closely to understand what makes feedback effective at C1 level.'}
              </Typography>

              <Box sx={{ borderTop: `1px solid ${P.green.border}`, pt: 2, mb: 2 }} />

              <Typography variant="body2" sx={{ mb: 2 }}>Use the "View Model Answer" buttons above to compare your responses with the model critiques and rewrites.</Typography>

              <Box
                component="button"
                onClick={async () => navigate(await resolveSubphase2RemedialNextUrl(3, 'C1'))}
                sx={{ ...cardSx('blue'), cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
              >
                Continue
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}
