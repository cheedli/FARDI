import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Container,
  Stack
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 2 - Level B1 - Task B: Proposal Builder
 * Write 6 sentences proposing social media elements with reasons
 */

const PROMPTS = [
  'What hashtag should we use and why?',
  'What should the caption say and why?',
  'What emoji should we add and why?',
  'Who should we tag and why?',
  'What call-to-action (CTA) should we include and why?',
  'When should we post this and why?'
]

const EXAMPLES = [
  'We should use #TravelTunisia because it will help tourists find our post.',
  'The caption should be short and friendly because people read it quickly.',
  'We should add a smiling emoji because it makes the post more welcoming.',
  'We should tag the tourism office because they can share it with more people.',
  'The CTA should be "Visit us!" because it tells people what to do.',
  'We should post in the morning because more people check social media then.'
]

export default function Phase4_2Step2RemedialB1TaskB() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    purple: { bg: '#FAF5FF', border: '#A855F7', shadow: '#7E22CE' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    purple: { bg: '#3B1F6E', border: '#C084FC', shadow: '#6B21A8' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 2, interaction: 2, context: 'remedial_b1' })
  const [proposals, setProposals] = useState(Array(6).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleInputChange = (index, value) => {
    const newProposals = [...proposals]
    newProposals[index] = value
    setProposals(newProposals)
  }

  const evaluateProposal = (text) => {
    const words = text.trim().split(/\s+/)
    if (words.length < 8) return false
    const proposalWords = /\b(should|could|propose|suggest|recommend|would|might|can|we need|let's|why not|must)\b/i
    const reasoningWords = /\b(because|since|so that|to|for|as|that way|this will|in order to|which|that)\b/i
    return proposalWords.test(text) && reasoningWords.test(text)
  }

  const handleSubmit = () => {
    let correctCount = 0
    proposals.forEach(proposal => { if (evaluateProposal(proposal)) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskB_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_step2_remedial_b1_taskB_max', '10')
    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 2, level: 'B1', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase4_2/step/2/remedial/b1/taskC')

  const allFilled = proposals.every(proposal => proposal.trim().length >= 8)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>
              Phase 4.2 Step 2 - Remedial Practice
            </Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>
              Level B1 - Task B: Proposal Builder
            </Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3
          }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Write proposals for creating a social media post. Each sentence should answer the question and explain WHY it's a good idea!"
            />
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 2, mb: 3
          }}>
            <Typography variant="body1" sx={{ color: P.purple.shadow }}>
              <strong>Instructions:</strong> Write 6 complete sentences. Each should answer the question and give a reason.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.purple.shadow }}>
              <strong>Evaluation:</strong> Each sentence must have 8+ words, a proposal, and a reason.
            </Typography>
          </Box>

          {/* Examples */}
          <Box sx={{
            bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`,
            p: 3, mb: 3
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>
              Examples:
            </Typography>
            {EXAMPLES.slice(0, 2).map((example, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, color: P.yellow.shadow }}>
                {index + 1}. {example}
              </Typography>
            ))}
            <Typography variant="body2" sx={{ mt: 2, color: P.yellow.shadow }}>
              <strong>Helpful Words:</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
              <strong>Proposals:</strong> should, could, propose, suggest, recommend, we need to, let's, must
            </Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
              <strong>Reasons:</strong> because, since, so that, to, for, this will, in order to, which, that
            </Typography>
          </Box>

          {/* Proposal Items */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {PROMPTS.map((prompt, index) => {
              const isGood = showResults ? evaluateProposal(proposals[index]) : null
              return (
                <Box key={index} sx={{
                  bgcolor: showResults ? (isGood ? P.green.bg : P.red.bg) : (isDark ? '#1a1a2e' : 'white'),
                  border: `2px solid ${showResults ? (isGood ? P.green.border : P.red.border) : P.orange.border}`,
                  borderRadius: '20px',
                  boxShadow: `3px 3px 0 ${showResults ? (isGood ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                  p: 3
                }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isGood ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                    {index + 1}. {prompt}
                  </Typography>
                  <TextField
                    fullWidth multiline rows={2}
                    placeholder="Write your proposal with a reason (8+ words)..."
                    value={proposals[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={showResults}
                    sx={{
                      mt: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: showResults ? (isGood ? P.green.border : P.red.border) : P.orange.border },
                        '&.Mui-focused fieldset': { borderColor: P.orange.shadow },
                      }
                    }}
                  />
                  {showResults && (
                    <Box sx={{
                      mt: 1.5, p: 1.5,
                      bgcolor: isGood ? P.green.bg : P.yellow.bg,
                      border: `1px solid ${isGood ? P.green.border : P.yellow.border}`,
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body2" sx={{ color: isGood ? P.green.shadow : P.yellow.shadow }}>
                        {isGood ? 'Great proposal!' : 'This proposal needs improvement. Make sure it has a suggestion word and a reason word, with at least 8 words total.'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{
              bgcolor: score === PROMPTS.length ? P.green.bg : P.blue.bg,
              border: `2px solid ${score === PROMPTS.length ? P.green.border : P.blue.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${score === PROMPTS.length ? P.green.shadow : P.blue.shadow}`,
              p: 3, mb: 3
            }}>
              {score === PROMPTS.length ? (
                <Typography sx={{ color: P.green.shadow, fontWeight: 700 }}>Excellent! All {PROMPTS.length} proposals are well-written!</Typography>
              ) : (
                <Typography sx={{ color: P.blue.shadow }}>
                  You wrote {score}/{PROMPTS.length} acceptable proposals.
                  {score < PROMPTS.length && ' Review the feedback above to improve your proposals.'}
                </Typography>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{
                bgcolor: !allFilled ? (isDark ? '#2a2a3e' : '#e5e7eb') : P.blue.bg,
                border: `2px solid ${!allFilled ? (isDark ? '#444' : '#d1d5db') : P.blue.border}`,
                borderRadius: '12px', boxShadow: !allFilled ? 'none' : `3px 3px 0 ${P.blue.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !allFilled ? 'not-allowed' : 'pointer',
                color: !allFilled ? (isDark ? '#555' : '#9ca3af') : P.blue.shadow,
                opacity: !allFilled ? 0.6 : 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': !allFilled ? {} : { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` },
                '&:active': !allFilled ? {} : { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.blue.shadow}` }
              }}>
                Submit Proposals
              </Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Continue to Task C <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
