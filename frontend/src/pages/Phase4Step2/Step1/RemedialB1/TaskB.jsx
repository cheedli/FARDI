import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task B: Writing Proposals
 * Write 8 sentences proposing social media elements with reasons
 */

const PROMPTS = [
  'Propose using a hashtag and explain why',
  'Propose adding emojis and give a reason',
  'Propose creating a caption and explain the benefit',
  'Propose tagging someone and say why it helps',
  'Propose using a call-to-action and justify it',
  'Propose going viral and explain how',
  'Propose sharing content and give a reason',
  'Propose creating a story and explain why'
]

export default function Phase4_2RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 1, interaction: 2, context: 'remedial_b1' })
  const [proposals, setProposals] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const LIGHT = {
    pageBg: '#FFFDE7',
    blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
    green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
    yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
    teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
    orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
    red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
  }
  const DARK = {
    pageBg: '#0F0F1A',
    blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
    green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
    yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
    teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
    orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
    red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
  }
  const P = isDark ? DARK : LIGHT

  const evaluateProposal = (text) => {
    const words = text.trim().split(/\s+/)
    if (words.length < 8) return false
    const proposalWords = /\b(should|could|propose|suggest|recommend|would|might|can|we need|let's|why not)\b/i
    const reasoningWords = /\b(because|since|so that|to|for|as|that way|this will|in order to)\b/i
    return proposalWords.test(text) && reasoningWords.test(text)
  }

  const handleInputChange = (index, value) => {
    const newProposals = [...proposals]
    newProposals[index] = value
    setProposals(newProposals)
  }

  const handleSubmit = () => {
    let correctCount = 0
    proposals.forEach(proposal => { if (evaluateProposal(proposal)) correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    const scoreOutOf10 = (correctCount / PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskB_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskB_max', '10')
    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'B1', task: 'B', score, max_score: maxScore, time_taken: 0 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => { navigate('/phase4_2/step/1/remedial/b1/taskC') }
  const allFilled = proposals.every(p => p.trim().length >= 8)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Phase 4.2 - Remedial Practice</Typography>
            <Typography variant="h6" sx={{ color: P.blue.shadow }}>Level B1 - Task B: Writing Proposals</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage speaker="Ms. Mabrouki" message="Write professional proposals for social media elements. Each sentence should make a suggestion and explain WHY it's a good idea!" />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> Write 8 complete sentences. Each should propose something AND give a reason.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Example:</strong> "We should use #SocialMedia because it will help more people find our post."</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Evaluation:</strong> Each sentence must have 8+ words, a proposal, and a reason.</Typography>
          </Box>

          <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.yellow.shadow }}>Helpful Words:</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow }}><strong>Proposals:</strong> should, could, propose, suggest, recommend, we need to, let's</Typography>
            <Typography variant="body2" sx={{ color: P.yellow.shadow, mt: 1 }}><strong>Reasons:</strong> because, since, so that, to, for, this will, in order to</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {PROMPTS.map((prompt, index) => {
              const isCorrect = showResults && evaluateProposal(proposals[index])
              const isWrong = showResults && !evaluateProposal(proposals[index])
              return (
                <Grid item xs={12} key={index}>
                  <Box sx={{
                    bgcolor: showResults ? (isCorrect ? P.green.bg : P.red.bg) : P.orange.bg,
                    border: `2px solid ${showResults ? (isCorrect ? P.green.border : P.red.border) : P.orange.border}`,
                    borderRadius: '20px', boxShadow: `4px 4px 0 ${showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow}`,
                    p: 3,
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: showResults ? (isCorrect ? P.green.shadow : P.red.shadow) : P.orange.shadow }}>
                      {index + 1}. {prompt}
                    </Typography>
                    <TextField fullWidth multiline rows={2} placeholder="Write your proposal with a reason (8+ words)..."
                      value={proposals[index]} onChange={(e) => handleInputChange(index, e.target.value)} disabled={showResults} />
                    {showResults && (
                      <Box sx={{ mt: 2, bgcolor: isCorrect ? P.green.bg : P.red.bg, border: `2px solid ${isCorrect ? P.green.border : P.red.border}`, borderRadius: '12px', p: 2 }}>
                        {isCorrect ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: P.green.shadow }} />
                            <Typography sx={{ color: P.green.shadow, fontWeight: 600 }}>Great proposal!</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ color: P.red.shadow, fontWeight: 600 }}>This proposal needs improvement. Make sure it has a suggestion word and a reason word, with at least 8 words total.</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {showResults && (
            <Box sx={{ bgcolor: score === PROMPTS.length ? P.green.bg : P.yellow.bg, border: `2px solid ${score === PROMPTS.length ? P.green.border : P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === PROMPTS.length ? P.green.shadow : P.yellow.shadow}`, p: 3, mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: score === PROMPTS.length ? P.green.shadow : P.yellow.shadow }}>
                {score === PROMPTS.length ? `Excellent! All ${PROMPTS.length} proposals are well-written!` : `You wrote ${score}/${PROMPTS.length} acceptable proposals. Review the feedback above.`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {!showResults && (
              <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{
                bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allFilled ? 'not-allowed' : 'pointer',
                color: P.blue.shadow, opacity: !allFilled ? 0.6 : 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` }
              }}>Submit Proposals</Box>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task C</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
