import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Grid, Container, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'
import { useProgressSave } from '../../../../hooks/useProgressSave'

// ── Clay palette ──────────────────────────────────────────────────────────────
const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
  muted: '#78909C', divider: '#E0E0E0',
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
  muted: '#607D8B', divider: '#2A2A4A',
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

const SECTIONS = [
  {
    key: 'executiveSummary',
    label: '1. Executive Summary',
    description: 'Provide an overview of the partnership opportunity and strategic alignment.',
    placeholder: 'Write your executive summary here...',
    colorKey: 'blue',
  },
  {
    key: 'financialAnalysis',
    label: '2. Financial Analysis',
    description: 'Present realistic budget breakdown and demonstrate financial logic.',
    placeholder: 'Write your financial analysis here...',
    colorKey: 'green',
  },
  {
    key: 'brandingStrategy',
    label: '3. Branding Strategy',
    description: "Explain how the sponsorship enhances the company's brand and values alignment.",
    placeholder: 'Write your branding strategy here...',
    colorKey: 'purple',
  },
  {
    key: 'impactMetrics',
    label: '4. Impact Metrics & Expected Outcomes',
    description: 'Define measurable outcomes and impact indicators.',
    placeholder: 'Write your impact metrics and expected outcomes here...',
    colorKey: 'orange',
  },
]

/**
 * Phase 3 Step 4 - Level C1 - Task A: Strategic Sponsorship Proposal
 * Create a comprehensive sponsorship proposal with financial realism and branding strategy
 */

export default function Phase3Step4RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveResponse } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 1, context: 'remedial_c1' })
  const [proposal, setProposal] = useState({ executiveSummary: '', financialAnalysis: '', brandingStrategy: '', impactMetrics: '' })
  const [showResults, setShowResults] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const handleProposalChange = (field, value) => setProposal({ ...proposal, [field]: value })

  const handleSubmit = () => {
    let totalScore = 0
    const sectionScores = {}

    // Executive Summary
    const summaryWords = proposal.executiveSummary.trim().split(/\s+/).length
    const summaryLower = proposal.executiveSummary.toLowerCase()
    if (summaryWords >= 40 && /\b(strategic|partnership|align|opportunity)\b/.test(summaryLower)) sectionScores.executiveSummary = 3
    else if (summaryWords >= 25) sectionScores.executiveSummary = 2
    else if (summaryWords >= 15) sectionScores.executiveSummary = 1
    else sectionScores.executiveSummary = 0
    totalScore += sectionScores.executiveSummary

    // Financial Analysis
    const financialWords = proposal.financialAnalysis.trim().split(/\s+/).length
    const financialLower = proposal.financialAnalysis.toLowerCase()
    const hasNumbers = /\b\d+\b/.test(proposal.financialAnalysis)
    if (financialWords >= 40 && hasNumbers && /\b(budget|cost|roi|investment|return)\b/.test(financialLower)) sectionScores.financialAnalysis = 3
    else if (financialWords >= 25 && hasNumbers) sectionScores.financialAnalysis = 2
    else if (financialWords >= 15) sectionScores.financialAnalysis = 1
    else sectionScores.financialAnalysis = 0
    totalScore += sectionScores.financialAnalysis

    // Branding Strategy
    const brandingWords = proposal.brandingStrategy.trim().split(/\s+/).length
    const brandingLower = proposal.brandingStrategy.toLowerCase()
    if (brandingWords >= 40 && /\b(brand|visibility|exposure|image|reputation|values)\b/.test(brandingLower)) sectionScores.brandingStrategy = 3
    else if (brandingWords >= 25) sectionScores.brandingStrategy = 2
    else if (brandingWords >= 15) sectionScores.brandingStrategy = 1
    else sectionScores.brandingStrategy = 0
    totalScore += sectionScores.brandingStrategy

    // Impact Metrics
    const metricsWords = proposal.impactMetrics.trim().split(/\s+/).length
    const metricsLower = proposal.impactMetrics.toLowerCase()
    const hasMetrics = /\b(attendees|reach|impressions|engagement|students)\b/.test(metricsLower)
    if (metricsWords >= 30 && hasMetrics && /\b\d+\b/.test(proposal.impactMetrics)) sectionScores.impactMetrics = 3
    else if (metricsWords >= 20 && hasMetrics) sectionScores.impactMetrics = 2
    else if (metricsWords >= 10) sectionScores.impactMetrics = 1
    else sectionScores.impactMetrics = 0
    totalScore += sectionScores.impactMetrics

    let feedback = ''
    if (totalScore >= 10) feedback = 'Outstanding! Your sponsorship proposal demonstrates professional-level strategic thinking, financial realism, and sophisticated branding analysis. This shows C1 mastery of persuasive business communication.'
    else if (totalScore >= 8) feedback = 'Very good! Your proposal is comprehensive and well-structured. Consider adding more specific metrics and deeper financial analysis to strengthen it further.'
    else if (totalScore >= 6) feedback = 'Good effort! Your proposal covers the key areas. To reach C1 level, add more sophisticated vocabulary, specific numbers, and strategic depth to each section.'
    else feedback = 'Your proposal needs more development. Each section should be detailed (20+ words), use professional vocabulary, and include specific examples or data.'

    setEvaluation({ score: totalScore, maxScore: 12, sectionScores, feedback })
    setShowResults(true)
    logTaskCompletion(totalScore, 12)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase3/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ level: 'C1', task: 'A', score: score, max_score: maxScore, time_taken: 0, step: 4 })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase3/step/4/interaction/1')

  const allSectionsComplete = Object.values(proposal).every(section => section.trim().split(/\s+/).length >= 15)
  const passThreshold = 8

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.cardBg,
      '& fieldset': { borderColor: D.divider },
      '&:hover fieldset': { borderColor: D.purple.border },
    },
    '& .MuiInputBase-input': { color: D.body },
    '& .MuiInputLabel-root': { color: D.muted },
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.red.bg, border: `2px solid ${D.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.red.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`, color: D.purple.border }}>C1 Level</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Remedial Practice</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Phase 3 Step 4 — Remedial Practice</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: D.body, mt: 0.5 }}>Level C1 — Task A: Strategic Sponsorship Proposal</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Create a comprehensive, professional sponsorship proposal. This should demonstrate strategic thinking, financial realism, and sophisticated branding analysis. Think like a business consultant!"
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body1" fontWeight={800} sx={{ color: D.heading }}>Instructions: Write a complete sponsorship proposal with four sections.</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: D.body, mb: 1 }}>
              Each section should be detailed (20-50 words), use professional vocabulary, and include specific examples or data.
            </Typography>
            <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>
              Passing score: Minimum 8/12 points (average 2/3 per section)
            </Box>
          </Box>
        </motion.div>

        {/* Proposal Sections */}
        {SECTIONS.map((section, idx) => {
          const c = D[section.colorKey]
          const wordCount = proposal[section.key].trim().split(/\s+/).filter(w => w.length > 0).length
          const sectionScore = showResults ? evaluation?.sectionScores[section.key] : null

          return (
            <motion.div key={section.key} variants={fadeUp} initial="hidden" animate="visible" custom={3 + idx}>
              <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ color: c.border }}>{section.label}</Typography>
                  {showResults && (
                    <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: c.bg, border: `2px solid ${c.border}`, color: c.border }}>
                      {sectionScore}/3
                    </Box>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: D.body, mb: 2 }}>{section.description}</Typography>
                <TextField
                  fullWidth multiline rows={4}
                  placeholder={section.placeholder}
                  value={proposal[section.key]}
                  onChange={(e) => handleProposalChange(section.key, e.target.value)}
                  disabled={showResults}
                  sx={inputSx}
                />
                <Typography variant="caption" sx={{ color: D.muted, mt: 1, display: 'block' }}>
                  Words: {wordCount}
                </Typography>
              </Box>
            </motion.div>
          )
        })}

        {/* Results */}
        {showResults && evaluation && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
            <Box sx={{
              bgcolor: evaluation.score >= passThreshold ? D.green.bg : D.yellow.bg,
              border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.score >= passThreshold ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>Task Complete!</Typography>
              <Box sx={{ display: 'inline-flex', px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, mb: 2, bgcolor: D.cardBg, border: `2px solid ${evaluation.score >= passThreshold ? D.green.border : D.yellow.border}`, color: evaluation.score >= passThreshold ? D.green.border : D.yellow.border }}>
                Total Score: {evaluation.score}/{evaluation.maxScore}
              </Box>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {[
                  ['Executive Summary', evaluation.sectionScores.executiveSummary],
                  ['Financial Analysis', evaluation.sectionScores.financialAnalysis],
                  ['Branding Strategy', evaluation.sectionScores.brandingStrategy],
                  ['Impact Metrics', evaluation.sectionScores.impactMetrics],
                ].map(([label, s], i) => (
                  <Grid item xs={6} key={i}>
                    <Box sx={{ px: 1.5, py: 0.5, bgcolor: D.cardBg, border: `1px solid ${D.divider}`, borderRadius: '10px' }}>
                      <Typography variant="caption" sx={{ color: D.muted }}>{label}</Typography>
                      <Typography variant="body2" fontWeight={800} sx={{ color: D.body }}>{s}/3</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="body1" sx={{ color: D.body }}>{evaluation.feedback}</Typography>
            </Box>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {!showResults && (
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!allSectionsComplete}
              sx={{
                px: 4, py: 1.5,
                bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${D.purple.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: !allSectionsComplete ? 'not-allowed' : 'pointer',
                color: D.purple.border, opacity: !allSectionsComplete ? 0.6 : 1,
                '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.purple.shadow}` },
              }}
            >
              Submit Sponsorship Proposal
            </Box>
          )}
          {showResults && (
            <Box
              component="button"
              onClick={handleNext}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 4, py: 1.5,
                bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: D.green.border,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
              }}
            >
              Retry Step 4 <ArrowForwardIcon fontSize="small" />
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  )
}
