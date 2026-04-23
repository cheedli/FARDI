import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, TextField, Stack
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { resolveSubphase1RemedialNextUrl } from '../../Phase6SubPhase1/shared/routing.js'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 6 SubPhase 1 Step 1 - Level C1 - Task D: Critique Game
 */

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green: { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  teal: { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  red: { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green: { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  teal: { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  red: { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

const WEAKNESSES = [
  {
    id: 1,
    label: 'Only positive content',
    example: '"The festival was amazing. Everyone had fun. Everything went perfectly. The food was great."',
    critique: 'Lacks credibility',
    fix: 'Include balanced evaluation — add specific challenges and how they were addressed.',
    explanation: 'A report that only mentions positives seems unrealistic and reduces stakeholder trust.'
  },
  {
    id: 2,
    label: 'No data or evidence',
    example: '"We think the marketing was successful and people really liked the event."',
    critique: 'Feels subjective',
    fix: 'Add attendance numbers, feedback quotes, survey data (e.g., "200 attendees, 85% satisfaction rate").',
    explanation: 'Evidence-based claims are more credible and show professionalism.'
  },
  {
    id: 3,
    label: 'Vague recommendations',
    example: '"We should do better next time and improve things."',
    critique: 'Not actionable',
    fix: 'Make specific and measurable (e.g., "Install backup lighting system and appoint a dedicated technical coordinator").',
    explanation: 'Actionable recommendations give readers clear steps to follow for future improvement.'
  },
  {
    id: 4,
    label: 'Poor structure',
    example: '"Festival good. Lights failed. Food nice. People happy. Budget OK. Team worked."',
    critique: 'Hard to follow',
    fix: 'Use clear headings and logical flow with connectors (firstly, however, in addition, therefore).',
    explanation: 'Professional reports require organised sections and connective language for clarity.'
  },
  {
    id: 5,
    label: 'Emotional tone',
    example: '"The DJ was super cool and everyone had an absolutely amazing blast!"',
    critique: 'Unprofessional',
    fix: 'Maintain objective, formal style (e.g., "The musical entertainment was well-received by attendees").',
    explanation: 'Formal reports require professional language — avoid colloquialisms and enthusiastic expressions.'
  },
  {
    id: 6,
    label: 'No future orientation',
    example: '"The Global Cultures Festival took place on March 8. There were performances and food stalls. It ended at 8pm."',
    critique: 'Misses value',
    fix: 'End with strategic recommendations that address lessons learned and provide a roadmap for future events.',
    explanation: 'A report without future-oriented recommendations fails its core purpose of enabling continuous improvement.'
  }
]

export default function Phase6SP1Step1RemC1TaskD() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 1, step: 1, interaction: 4, context: 'remedial_c1' })
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userCritiques, setUserCritiques] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [score, setScore] = useState(0)

  const current = WEAKNESSES[currentIdx]

  const handleSubmitCritique = () => {
    const userText = userCritiques[current.id] || ''
    if (userText.trim().length < 10) return
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (currentIdx < WEAKNESSES.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      let total = 0
      WEAKNESSES.forEach(w => {
        const critique = (userCritiques[w.id] || '').toLowerCase()
        const words = critique.split(/\s+/).filter(x => x.length > 0).length
        if (words >= 15) total += 1
      })
      setScore(total)
      setAllDone(true)
      sessionStorage.setItem('phase6_sp1_step1_remedial_c1_taskd_score', total.toString())
      try {
        phase6API.logRemedialActivity(1, 'C1', 'D', total, WEAKNESSES.length, 0, 1)
      } catch (e) {
        console.error('Failed to log:', e)
      }
    }
  }

  const handleContinue = async () => {
    navigate(await resolveSubphase1RemedialNextUrl(1, 'C1'))
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
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: P.orange.shadow }}>
              Phase 6: Reflection and Evaluation
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Step 1: Remedial Practice - Level C1
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow }}>
              Task D: Critique Game
            </Typography>
            <Typography variant="body1" sx={{ color: P.orange.shadow }}>
              Critique 6 common weaknesses found in post-event reports and suggest fixes
            </Typography>
          </Box>
        </motion.div>

        {/* Instructor */}
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
              message="Time for the Critique Game! You'll see 6 common weaknesses in post-event reports. For each one, critique the problem and explain how to fix it. Show your advanced analytical skills!"
            />
          </Box>
        </motion.div>

        {!allDone ? (
          <>
            {/* Progress */}
            <Box sx={{
              bgcolor: P.blue.bg,
              border: `2px solid ${P.blue.border}`,
              borderRadius: '14px',
              boxShadow: `2px 2px 0 ${P.blue.shadow}`,
              p: 2,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: P.blue.shadow }}>
                <strong>Weakness {currentIdx + 1} of {WEAKNESSES.length}:</strong> {current.label}
              </Typography>
            </Box>

            {/* Weakness Card */}
            <motion.div key={currentIdx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{
                bgcolor: P.red.bg,
                border: `2px solid ${P.red.border}`,
                borderRadius: '20px',
                boxShadow: `4px 4px 0 ${P.red.shadow}`,
                p: 3,
                mb: 3
              }}>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{
                      display: 'inline-block', mb: 1,
                      px: 1.5, py: 0.5,
                      bgcolor: P.red.bg,
                      border: `2px solid ${P.red.border}`,
                      borderRadius: '10px',
                      fontSize: '0.85rem', fontWeight: 'bold', color: P.red.shadow
                    }}>
                      {current.label}
                    </Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                      Example of poor writing:
                    </Typography>
                    <Box sx={{
                      p: 2,
                      bgcolor: P.yellow.bg,
                      border: `2px solid ${P.yellow.border}`,
                      borderRadius: '12px',
                      fontStyle: 'italic'
                    }}>
                      <Typography variant="body1">{current.example}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                      Your critique: Why is this weak? How should it be improved?
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={userCritiques[current.id] || ''}
                      onChange={(e) => setUserCritiques({ ...userCritiques, [current.id]: e.target.value })}
                      disabled={showFeedback}
                      placeholder="Explain the weakness and suggest a specific improvement..."
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Words: {(userCritiques[current.id] || '').split(/\s+/).filter(w => w.length > 0).length}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </motion.div>

            {!showFeedback ? (
              <Box
                component="button"
                onClick={handleSubmitCritique}
                disabled={(userCritiques[current.id] || '').trim().length < 10}
                sx={{
                  cursor: (userCritiques[current.id] || '').trim().length >= 10 ? 'pointer' : 'not-allowed',
                  opacity: (userCritiques[current.id] || '').trim().length >= 10 ? 1 : 0.6,
                  width: '100%', py: 1.5,
                  bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.orange.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Submit Critique
              </Box>
            ) : (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{
                  bgcolor: P.green.bg,
                  border: `2px solid ${P.green.border}`,
                  borderRadius: '20px',
                  boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  p: 3,
                  mb: 3
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.green.shadow }}>
                    Model Answer
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                    Critique: {current.critique}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                    Fix:
                  </Typography>
                  <Box sx={{
                    p: 2, mb: 2,
                    bgcolor: P.teal.bg,
                    border: `2px solid ${P.teal.border}`,
                    borderRadius: '12px'
                  }}>
                    <Typography variant="body1">{current.fix}</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Explanation:</strong> {current.explanation}
                  </Typography>
                  <Box
                    component="button"
                    onClick={handleNext}
                    sx={{
                      cursor: 'pointer',
                      width: '100%', py: 1.5,
                      bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                      borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                      fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                      '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                      transition: 'all 0.15s'
                    }}
                  >
                    {currentIdx < WEAKNESSES.length - 1 ? `Next Weakness (${currentIdx + 2}/${WEAKNESSES.length})` : 'See Results'}
                  </Box>
                </Box>
              </motion.div>
            )}
          </>
        ) : (
          /* Results */
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{
              bgcolor: P.green.bg,
              border: `2px solid ${P.green.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4,
              textAlign: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: P.green.border, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: P.green.shadow }}>
                Task D Complete!
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: P.green.shadow }}>
                Score: {score} / {WEAKNESSES.length}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {score >= 5
                  ? 'Outstanding! Your analytical skills are excellent.'
                  : score >= 3
                  ? 'Good work! You identified most weaknesses effectively.'
                  : 'Keep practising your critical analysis skills.'}
              </Typography>
              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  cursor: 'pointer', mt: 3, px: 6, py: 1.5,
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
                  fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s'
                }}
              >
                Continue →
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
