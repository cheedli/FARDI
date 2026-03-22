import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task B
 * Writing: "Executive Summary Odyssey"
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
}

const GUIDED_STRUCTURE = [
  { id: 0, point: 'Overall assessment of success', placeholder: 'The Global Cultures Festival achieved substantial success in promoting intercultural dialogue...' },
  { id: 1, point: 'Key achievement / impact', placeholder: 'The most impactful achievement was the high level of authentic cross-cultural engagement...' },
  { id: 2, point: 'Most significant challenge & response', placeholder: 'While the last-minute stage lighting failure posed a significant logistical challenge...' },
  { id: 3, point: 'Main strength of the project', placeholder: 'A core strength lay in the exceptional teamwork and adaptability demonstrated under pressure.' },
  { id: 4, point: 'Primary area requiring improvement', placeholder: 'However, time management and contingency planning require substantial enhancement.' },
  { id: 5, point: 'Summary of participant/stakeholder feedback', placeholder: 'Feedback highlighted appreciation for diversity but noted that the programme felt overly dense.' },
  { id: 6, point: 'Strategic recommendation #1', placeholder: 'It is strongly recommended that future events implement stricter time buffers between activities.' },
  { id: 7, point: 'Strategic recommendation #2 (long-term)', placeholder: 'Long-term, establishing a permanent risk-management protocol would significantly elevate organisational resilience.' }
]

export default function Phase6SP1Step1RemC1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 2, context: 'remedial_c1' })
  const [sentences, setSentences] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = GUIDED_STRUCTURE.every(s => (sentences[s.id] || '').trim().length > 0)

  const handleSubmit = async () => {
    let correct = 0
    GUIDED_STRUCTURE.forEach(s => {
      const words = (sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
      if (words >= 10) correct++ // C1 sentences should be more substantial
    })
    setScore(correct)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskb_score', correct.toString())
    try { await phase6API.logRemedialActivity(1, 'C1', 'B', correct, GUIDED_STRUCTURE.length, 0, 1) } catch (e) { console.error(e) }
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
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>Task B: Executive Summary Odyssey</Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>Write an 8-sentence formal "Conclusion & Recommendations" section</Typography>
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
              message="Executive Summary Odyssey! Write one sophisticated sentence for each point below to create a formal 'Conclusion & Recommendations' section for the post-event report. Use advanced vocabulary, formal tone, and evidence-based language!"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <Box sx={{
          bgcolor: P.blue.bg,
          border: `2px solid ${P.blue.border}`,
          borderRadius: '14px',
          boxShadow: `2px 2px 0 ${P.blue.shadow}`,
          p: 2,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: P.blue.shadow }}>
            <strong>Instructions:</strong> Write one formal sentence per point. Use sophisticated vocabulary
            (substantial, impactful, pivotal, contingency, resilience, strategic), formal connectors
            (while, however, furthermore, it is recommended), and evidence-based language. Aim for 10+ words per sentence.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {GUIDED_STRUCTURE.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + s.id * 0.03 }}>
              <Box sx={{
                bgcolor: P.yellow.bg,
                border: `2px solid ${P.yellow.border}`,
                borderRadius: '14px',
                boxShadow: `2px 2px 0 ${P.yellow.shadow}`,
                p: 2.5
              }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, color: P.yellow.shadow }}>
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Words: {(sentences[s.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length}
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
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              opacity: allAnswered ? 1 : 0.6,
              width: '100%', mt: 3, py: 1.5,
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '16px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
              '&:hover': { transform: allAnswered ? 'translate(-2px,-2px)' : 'none', boxShadow: allAnswered ? `6px 6px 0 ${P.orange.shadow}` : `4px 4px 0 ${P.orange.shadow}` },
              transition: 'all 0.15s'
            }}
          >
            Submit Executive Summary
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mt: 3, textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>Task B Complete!</Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>Score: {score}/{GUIDED_STRUCTURE.length} substantial sentences</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 7 ? 'Outstanding! A sophisticated and formal executive summary!' : score >= 5 ? 'Well done! Keep developing your formal writing skills.' : 'Good effort! Focus on using more sophisticated vocabulary and longer sentences.'}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate('/phase6/subphase/1/step/1/remedial/c1/task/c')}
                sx={{
                  cursor: 'pointer', mt: 2, px: 4, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Next: Task C →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
