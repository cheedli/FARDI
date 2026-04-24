import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BuildIcon from '@mui/icons-material/Build'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 3 Step 2 - Level A1 - Task A: Picture Sorting
 * Sort images into "Costs" (money out) and "Money In" (income)
 */

const ITEMS = [
  { id: 1, name: 'Venue rental', type: 'cost', icon: '🏢', description: 'Pay for building' },
  { id: 2, name: 'Ticket sales', type: 'income', icon: '🎫', description: 'People buy tickets' },
  { id: 3, name: 'Food costs', type: 'cost', icon: '🍽️', description: 'Buy food' },
  { id: 4, name: 'Sponsor money', type: 'income', icon: '💼', description: 'Company gives money' },
  { id: 5, name: 'Sound equipment', type: 'cost', icon: '🔊', description: 'Pay for speakers' },
  { id: 6, name: 'Donations', type: 'income', icon: '💝', description: 'People give money' },
  { id: 7, name: 'Decoration', type: 'cost', icon: '🎨', description: 'Buy decorations' },
  { id: 8, name: 'University grant', type: 'income', icon: '🏛️', description: 'School gives money' }
]

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

function clay(c) {
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${c.shadow}`,
  }
}

export default function Phase3Step2RemedialA1TaskA() {
  const navigate = useNavigate()
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase3/step/2/remedial/a2/taskA') }, [])
  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 2, interaction: 1, context: 'remedial_a1' })
  const [sortedItems, setSortedItems] = useState({ cost: [], income: [] })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const handleItemClick = (item) => {
    if (showResults) return
    const inCost = sortedItems.cost.find(i => i.id === item.id)
    const inIncome = sortedItems.income.find(i => i.id === item.id)
    if (inCost) {
      setSortedItems({ ...sortedItems, cost: sortedItems.cost.filter(i => i.id !== item.id) })
    } else if (inIncome) {
      setSortedItems({ ...sortedItems, income: sortedItems.income.filter(i => i.id !== item.id) })
    }
  }

  const handleDropZoneClick = (zone, item) => {
    if (showResults) return
    if (!item) return
    const newSorted = {
      cost: sortedItems.cost.filter(i => i.id !== item.id),
      income: sortedItems.income.filter(i => i.id !== item.id)
    }
    newSorted[zone].push(item)
    setSortedItems(newSorted)
  }

  const handleSubmit = () => {
    let correctCount = 0
    sortedItems.cost.forEach(item => { if (item.type === 'cost') correctCount++ })
    sortedItems.income.forEach(item => { if (item.type === 'income') correctCount++ })
    setScore(correctCount)
    setShowResults(true)
    logTaskCompletion(correctCount, ITEMS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: 'A1', task: 'A', score, max_score: maxScore, time_taken: 0, step: 2 })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase3/step/2/remedial/a2/taskA')
  }

  const allItemsSorted = sortedItems.cost.length + sortedItems.income.length === ITEMS.length
  const unsortedItems = ITEMS.filter(item =>
    !sortedItems.cost.find(i => i.id === item.id) &&
    !sortedItems.income.find(i => i.id === item.id)
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ ...clay(D.orange), p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <BuildIcon sx={{ fontSize: 40, color: D.orange.border }} />
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: D.heading, lineHeight: 1.2 }}>
                Phase 3 Step 2 — Remedial Practice
              </Typography>
              <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>
                Level A1 — Task A: Picture Sorting
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Character Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ ...clay(D.blue), p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Let's practice sorting budget items! Look at each item and decide: Does it COST money (money goes out) or does it bring MONEY IN? Click an item, then click the box where it belongs."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ ...clay(D.teal), p: 2.5, mb: 3 }}>
            <Typography variant="body1" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ color: D.body, mb: 0.5 }}>
              • <strong>COSTS:</strong> Things that need money to be paid (money goes OUT)
            </Typography>
            <Typography variant="body2" sx={{ color: D.body }}>
              • <strong>MONEY IN:</strong> Things that bring money (money comes IN)
            </Typography>
          </Box>
        </motion.div>

        {/* Unsorted Items */}
        {unsortedItems.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>
                  Items to Sort
                </Typography>
                <Box component="span" sx={{
                  px: 1.25, py: 0.25, borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800,
                  bgcolor: D.blue.bg, color: D.blue.border, border: `2px solid ${D.blue.border}`,
                }}>
                  {unsortedItems.length} remaining
                </Box>
              </Box>
              <Grid container spacing={2}>
                {unsortedItems.map((item, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={item.id}>
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4 + idx}>
                      <Box sx={{
                        ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }),
                        p: 2, textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `4px 4px 0 ${D.blue.shadow}`, border: `2px solid ${D.blue.border}` },
                      }}>
                        <Typography sx={{ fontSize: '2.5rem', mb: 0.5 }}>{item.icon}</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: D.heading }}>{item.name}</Typography>
                        <Typography variant="caption" sx={{ color: D.muted }}>{item.description}</Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}

        {/* Sorting Zones */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Costs Zone */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box sx={{
                ...clay(D.red),
                p: 3, minHeight: 280,
                borderStyle: 'dashed',
              }}>
                <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ color: D.red.border, mb: 0.5 }}>
                  💸 COSTS (Money Out)
                </Typography>
                <Typography variant="body2" textAlign="center" sx={{ color: D.muted, mb: 2 }}>
                  Things that cost money
                </Typography>

                <Grid container spacing={1}>
                  {sortedItems.cost.map(item => {
                    const isCorrect = showResults && item.type === 'cost'
                    const isWrong = showResults && item.type !== 'cost'
                    return (
                      <Grid item xs={6} key={item.id}>
                        <Box
                          onClick={() => handleItemClick(item)}
                          sx={{
                            ...clay(showResults ? (isCorrect ? D.green : D.red) : { bg: D.cardBg, border: D.divider, shadow: D.divider }),
                            p: 1.5, textAlign: 'center',
                            cursor: showResults ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Typography sx={{ fontSize: '1.8rem' }}>{item.icon}</Typography>
                          <Typography variant="caption" display="block" sx={{ color: D.body }}>{item.name}</Typography>
                          {showResults && isWrong && (
                            <Typography variant="caption" sx={{ color: D.red.border, fontWeight: 800 }}>✗ Wrong</Typography>
                          )}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>

                {sortedItems.cost.length === 0 && !showResults && (
                  <Box sx={{ textAlign: 'center', py: 4, color: D.muted, fontStyle: 'italic' }}>
                    <Typography variant="body2">Click items above, then click here to add them</Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Income Zone */}
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Box sx={{
                ...clay(D.green),
                p: 3, minHeight: 280,
                borderStyle: 'dashed',
              }}>
                <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ color: D.green.border, mb: 0.5 }}>
                  💰 MONEY IN (Income)
                </Typography>
                <Typography variant="body2" textAlign="center" sx={{ color: D.muted, mb: 2 }}>
                  Things that bring money
                </Typography>

                <Grid container spacing={1}>
                  {sortedItems.income.map(item => {
                    const isCorrect = showResults && item.type === 'income'
                    const isWrong = showResults && item.type !== 'income'
                    return (
                      <Grid item xs={6} key={item.id}>
                        <Box
                          onClick={() => handleItemClick(item)}
                          sx={{
                            ...clay(showResults ? (isCorrect ? D.green : D.red) : { bg: D.cardBg, border: D.divider, shadow: D.divider }),
                            p: 1.5, textAlign: 'center',
                            cursor: showResults ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Typography sx={{ fontSize: '1.8rem' }}>{item.icon}</Typography>
                          <Typography variant="caption" display="block" sx={{ color: D.body }}>{item.name}</Typography>
                          {showResults && isWrong && (
                            <Typography variant="caption" sx={{ color: D.red.border, fontWeight: 800 }}>✗ Wrong</Typography>
                          )}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>

                {sortedItems.income.length === 0 && !showResults && (
                  <Box sx={{ textAlign: 'center', py: 4, color: D.muted, fontStyle: 'italic' }}>
                    <Typography variant="body2">Click items above, then click here to add them</Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Tip */}
        {!showResults && unsortedItems.length < ITEMS.length && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <Box sx={{ ...clay(D.yellow), p: 2, mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: D.body }}>
                <strong>Tip:</strong> Click an item in the boxes above to remove it and sort it again
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Quick Sort */}
        {!showResults && unsortedItems.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
            <Box sx={{ ...clay({ bg: D.cardBg, border: D.divider, shadow: D.divider }), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>
                Quick Sort
              </Typography>
              <Grid container spacing={2}>
                {unsortedItems.map((item, idx) => (
                  <Grid item xs={12} sm={6} key={item.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: '1.8rem' }}>{item.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: D.heading }}>{item.name}</Typography>
                      </Box>
                      <Box
                        component="button"
                        onClick={() => handleDropZoneClick('cost', item)}
                        sx={{
                          bgcolor: D.red.bg, color: D.red.border,
                          border: `2px solid ${D.red.border}`,
                          borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem',
                          px: 1.25, py: 0.5, cursor: 'pointer',
                          transition: 'all 0.15s',
                          '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.red.shadow}` },
                        }}
                      >
                        COST
                      </Box>
                      <Box
                        component="button"
                        onClick={() => handleDropZoneClick('income', item)}
                        sx={{
                          bgcolor: D.green.bg, color: D.green.border,
                          border: `2px solid ${D.green.border}`,
                          borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem',
                          px: 1.25, py: 0.5, cursor: 'pointer',
                          transition: 'all 0.15s',
                          '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.green.shadow}` },
                        }}
                      >
                        INCOME
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Box sx={{ ...clay(score === ITEMS.length ? D.green : D.orange), p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>Results</Typography>
              <Typography variant="body1" sx={{ color: D.body, mb: 0.5 }}>
                <strong>Score:</strong> {score}/{ITEMS.length} correct
              </Typography>
              <Typography variant="body2" sx={{ color: D.body }}>
                {score === ITEMS.length
                  ? 'Perfect! You sorted all items correctly!'
                  : 'Good try! Look at the items marked wrong and learn the difference between costs and income.'}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allItemsSorted}
              sx={{
                bgcolor: allItemsSorted ? D.blue.bg : D.divider,
                color: allItemsSorted ? D.blue.border : D.muted,
                border: `2px solid ${allItemsSorted ? D.blue.border : D.divider}`,
                borderRadius: '14px',
                boxShadow: allItemsSorted ? `4px 4px 0 ${D.blue.shadow}` : 'none',
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: allItemsSorted ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
                '&:hover': allItemsSorted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.blue.shadow}` } : {},
              }}
            >
              Submit
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: D.green.bg, color: D.green.border,
                border: `2px solid ${D.green.border}`,
                borderRadius: '14px',
                boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem',
                px: 4, py: 1.5, cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Continue to A2 Practice <ArrowForwardIcon />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
