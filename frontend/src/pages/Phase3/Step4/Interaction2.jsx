import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, CircularProgress, Grid, Container, useTheme, Stack
} from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import CampaignIcon from '@mui/icons-material/Campaign'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useProgressSave } from '../../../hooks/useProgressSave'

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
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } }),
}

/**
 * Phase 3 Step 4 - Interaction 2: Sponsor Pitch
 * Students write a persuasive sponsor pitch for the Global Cultures Festival
 */

const SPONSOR_PROFILES = [
  { id: 'tech', name: 'TechNova Solutions', type: 'Technology Company', values: 'Innovation, Diversity, Youth Empowerment', icon: '💻', colorKey: 'blue' },
  { id: 'culture', name: 'Cultural Heritage Foundation', type: 'Non-Profit Organization', values: 'Cultural Preservation, Education, Community', icon: '🎭', colorKey: 'purple' },
  { id: 'food', name: 'Global Tastes Restaurant Chain', type: 'Food & Beverage', values: 'Diversity, International Cuisine, Community Engagement', icon: '🍽️', colorKey: 'orange' },
]

const KEY_POINTS = [
  'What is the Global Cultures Festival?',
  'Why do you need funding?',
  'What will the sponsor gain? (visibility, brand image, values alignment)',
]

export default function Phase3Step4Interaction2() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const D = isDark ? DARK : LIGHT

  const { saveNow } = useProgressSave({ phase: 3, subphase: null, step: 4, interaction: 2, context: 'main' })
  const [selectedSponsor, setSelectedSponsor] = useState(null)
  const [pitch, setPitch] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSponsorSelect = (sponsorId) => {
    if (!submitted) { setSelectedSponsor(sponsorId); setPitch(''); setEvaluation(null) }
  }

  const handleSubmit = async () => {
    if (!pitch.trim()) { alert('Please write your sponsor pitch.'); return }
    if (!selectedSponsor) { alert('Please select a sponsor company.'); return }

    setLoading(true)
    try {
      const response = await fetch('/api/phase3/step4/evaluate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pitch: pitch.trim(), sponsor: selectedSponsor })
      })
      const data = await response.json()

      if (data.success !== false) {
        setEvaluation({ success: true, score: data.score || 1, level: data.level || 'A1', feedback: data.feedback || 'Good work on your pitch!', details: data.details || {} })
        setSubmitted(true)
        sessionStorage.setItem('phase3_step4_interaction2_score', data.score || 1)
      } else {
        setEvaluation({ success: false, score: 0, level: 'Below A1', feedback: data.feedback || 'Please try again with more detail.' })
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      const sentences = pitch.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const sentenceCount = sentences.length
      const wordCount = pitch.trim().split(/\s+/).length

      const mentionsFestival = /\b(festival|event|global cultures|cultural)\b/i.test(pitch)
      const mentionsFunding = /\b(need|funding|support|sponsor|money|cost|expense|budget)\b/i.test(pitch)
      const mentionsBenefits = /\b(visibility|image|brand|logo|poster|banner|gain|benefit|exposure|promotion)\b/i.test(pitch)
      const mentionsValues = /\b(values|diversity|culture|community|social|impact|mission)\b/i.test(pitch)
      const hasConnectors = /\b(because|so|since|therefore|due to|as|in order to)\b/i.test(pitch)
      const hasComparison = /\b(unlike|compared to|different|unique|special|exclusive)\b/i.test(pitch)
      const hasEmphasis = /\b(will|would|can|could|excellent|perfect|ideal|great|amazing)\b/i.test(pitch)
      const hasCallToAction = /\b(please|join|support|partner|collaborate|consider|invite)\b/i.test(pitch)
      const hasProfessionalTone = /\b(align|strategic|partnership|opportunity|mutually|beneficial|enhance|elevate)\b/i.test(pitch)
      const hasAdvancedVocab = /\b(encapsulate|resonate|amplify|cultivate|foster|demonstrate|embody|showcase)\b/i.test(pitch)

      let score = 0, level = 'Below A1', feedback = ''

      if (sentenceCount >= 5 && wordCount >= 60 &&
          mentionsFestival && mentionsFunding && mentionsBenefits && mentionsValues &&
          hasConnectors && hasProfessionalTone && (hasAdvancedVocab || hasComparison)) {
        score = 5; level = 'C1'
        feedback = "Excellent! Your sponsor pitch is professional and highly persuasive. You effectively aligned the sponsor's values with the festival's mission, demonstrated clear benefits, and used sophisticated language to create a compelling business case."
      } else if (sentenceCount >= 4 && wordCount >= 40 &&
          mentionsFestival && mentionsFunding && mentionsBenefits &&
          hasConnectors && hasEmphasis && (hasComparison || mentionsValues)) {
        score = 4; level = 'B2'
        feedback = "Very good! Your pitch is persuasive and well-structured. You clearly explained the festival, justified the funding need, and highlighted sponsor benefits with good use of connectors and emphasis."
      } else if (sentenceCount >= 3 && wordCount >= 25 &&
          mentionsFestival && mentionsFunding && mentionsBenefits && hasConnectors) {
        score = 3; level = 'B1'
        feedback = "Good! Your pitch clearly explains what the festival is, why funding is needed, and what the sponsor will gain. You used connectors effectively."
      } else if (sentenceCount >= 2 && mentionsFestival &&
          (mentionsFunding || mentionsBenefits) && hasConnectors) {
        score = 2; level = 'A2'
        feedback = "Good start! You explained the basic need for sponsorship using connectors. Try to expand your pitch by adding more details about the festival, specific funding needs, and clear benefits for the sponsor."
      } else if (sentenceCount >= 1 && (mentionsFestival || mentionsFunding)) {
        score = 1; level = 'A1'
        feedback = "You made a basic attempt at a sponsor pitch. Try to write more sentences explaining: 1) What is the festival? 2) Why do we need money? 3) What does the sponsor get?"
      } else {
        score = 0; level = 'Below A1'
        feedback = "Please write a sponsor pitch. Explain what the Global Cultures Festival is, why you need funding, and what the sponsor will gain."
      }

      setEvaluation({ success: score > 0, score, level, feedback })
      setSubmitted(score > 0)
      if (score > 0) {
        sessionStorage.setItem('phase3_step4_interaction2_score', score)
        console.log(`[Phase 3 Step 4 - Interaction 2] Score: ${score}/5 | Level: ${level}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { window.__remedialSkip = () => navigate('/phase3/step/4/score') }, [])

  const handleContinue = async () => {
    const int2Score = evaluation?.score || 0
    sessionStorage.setItem('phase3_step4_interaction2_score', int2Score.toString())
    await saveNow({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'Interaction2', is_correct: true, score: int2Score })
    navigate('/phase3/step/4/score')
  }

  const selectedSponsorData = SPONSOR_PROFILES.find(s => s.id === selectedSponsor)
  const wordCount = pitch.trim().split(/\s+/).filter(w => w.length > 0).length
  const sentenceCount = pitch.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: D.cardBg,
      '& fieldset': { borderColor: D.divider },
      '&:hover fieldset': { borderColor: D.green.border },
    },
    '& .MuiInputBase-input': { color: D.body },
    '& .MuiInputLabel-root': { color: D.muted },
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 6 }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.green.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.orange.bg, border: `2px solid ${D.orange.border}`, color: D.orange.border }}>Phase 3</Box>
              <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.teal.bg, border: `2px solid ${D.teal.border}`, color: D.teal.border }}>Step 4 — Interaction 2</Box>
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: D.heading }}>Sponsorship &amp; Budgeting</Typography>
            <Typography variant="body2" sx={{ color: D.body, mt: 0.5 }}>Write a Persuasive Sponsor Pitch</Typography>
          </Box>
        </motion.div>

        {/* Instructor Message */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3, mb: 3 }}>
            <CharacterMessage
              speaker="Ms. Mabrouki"
              message="Great work on your budget! Now let's convince a sponsor to support our festival. Choose a company below and write a persuasive pitch explaining why they should sponsor the Global Cultures Festival. Think about what they value and how the festival aligns with their brand."
            />
          </Box>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Box sx={{ bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.blue.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ color: D.blue.border, flexShrink: 0 }} />
              <Typography variant="body2" fontWeight={800} sx={{ color: D.heading }}>Instructions:</Typography>
            </Box>
            {[
              '1. Choose a potential sponsor company below',
              '2. Write a persuasive pitch (4-8 sentences) that includes:',
            ].map((t, i) => <Typography key={i} variant="body2" sx={{ color: D.body, mb: 0.5 }}>{t}</Typography>)}
            {['What the Global Cultures Festival is', 'Why you need funding', 'What the sponsor will gain (visibility, brand image, values alignment)'].map((t, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, pl: 2 }}>
                <Typography sx={{ color: D.blue.border, fontWeight: 800 }}>•</Typography>
                <Typography variant="body2" sx={{ color: D.body }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Key Points */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Box sx={{ bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.yellow.shadow}`, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TipsAndUpdatesIcon sx={{ color: D.yellow.border }} />
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: D.heading }}>Key Points to Address:</Typography>
            </Box>
            <Stack spacing={1}>
              {KEY_POINTS.map((point, index) => (
                <Box key={index} sx={{ px: 2, py: 1, bgcolor: D.cardBg, border: `2px solid ${D.yellow.border}`, borderRadius: '50px', display: 'inline-block' }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: D.body }}>{point}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Sponsor Selection */}
        {!selectedSponsor && (
          <Box sx={{ mb: 4 }}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, mb: 2 }}>Choose a Potential Sponsor:</Typography>
            </motion.div>
            <Grid container spacing={3}>
              {SPONSOR_PROFILES.map((sponsor, idx) => {
                const c = D[sponsor.colorKey]
                return (
                  <Grid item xs={12} md={4} key={sponsor.id}>
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5 + idx}>
                      <Box
                        onClick={() => handleSponsorSelect(sponsor.id)}
                        sx={{
                          bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`,
                          p: 3, cursor: 'pointer', height: '100%',
                          transition: 'all 0.15s',
                          '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${c.shadow}` },
                        }}
                      >
                        <Typography variant="h2" sx={{ textAlign: 'center', mb: 1 }}>{sponsor.icon}</Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ color: D.heading, textAlign: 'center', mb: 0.5 }}>{sponsor.name}</Typography>
                        <Typography variant="body2" sx={{ color: D.muted, textAlign: 'center', mb: 2 }}>{sponsor.type}</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ color: c.border }}>Company Values:</Typography>
                        <Typography variant="body2" sx={{ color: D.body, mt: 0.5, mb: 2 }}>{sponsor.values}</Typography>
                        <Box sx={{
                          width: '100%', py: 1, textAlign: 'center',
                          bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '14px',
                          fontWeight: 800, fontSize: '0.9rem', color: c.border,
                        }}>
                          Select This Sponsor
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )}

        {/* Writing Area */}
        {selectedSponsor && !submitted && (
          <Box sx={{ mb: 4 }}>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              {/* Selected Sponsor Info */}
              {(() => {
                const c = D[selectedSponsorData?.colorKey] || D.blue
                return (
                  <Box sx={{ bgcolor: c.bg, border: `2px solid ${c.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${c.shadow}`, p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h2">{selectedSponsorData?.icon}</Typography>
                      <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>Selected: {selectedSponsorData?.name}</Typography>
                        <Typography variant="body2" sx={{ color: D.muted }}>{selectedSponsorData?.type}</Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ color: c.border }}>Values: {selectedSponsorData?.values}</Typography>
                      </Box>
                    </Box>
                    <Box
                      component="button"
                      onClick={() => setSelectedSponsor(null)}
                      sx={{
                        px: 2, py: 0.75, bgcolor: 'transparent', border: `2px solid ${c.border}`,
                        borderRadius: '14px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: c.border,
                        '&:hover': { bgcolor: c.bg },
                      }}
                    >
                      Choose Different Sponsor
                    </Box>
                  </Box>
                )
              })()}
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <Box sx={{ bgcolor: D.cardBg, border: `2px solid ${D.divider}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${D.divider}`, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CampaignIcon sx={{ color: D.heading }} />
                  <Typography variant="h6" fontWeight={800} sx={{ color: D.heading }}>Write Your Sponsor Pitch</Typography>
                </Box>

                <Box sx={{ bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, borderRadius: '14px', p: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: D.green.border, mb: 1 }}>Tips for a Strong Pitch:</Typography>
                  {[
                    'Start with what the festival is and who it serves',
                    'Explain specific funding needs (refer to your budget)',
                    "Connect the sponsor's values to the festival's mission",
                    'Describe visibility benefits (logo on posters, banners, social media)',
                    'Use persuasive language: because, so, will, can, ideal, perfect, align',
                  ].map((tip, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                      <Typography sx={{ color: D.green.border, fontWeight: 800 }}>•</Typography>
                      <Typography variant="body2" sx={{ color: D.body }}>{tip}</Typography>
                    </Box>
                  ))}
                </Box>

                <TextField
                  fullWidth multiline rows={8} variant="outlined"
                  placeholder="Explain what the festival is, why you need funding, and what the sponsor will gain..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  sx={{ ...inputSx, mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: D.muted }}>
                    Words: {wordCount} | Sentences: {sentenceCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: wordCount >= 25 ? D.green.border : D.muted, fontWeight: wordCount >= 25 ? 800 : 400 }}>
                    {wordCount >= 25 ? '✓ Good length' : 'Write at least 25 words'}
                  </Typography>
                </Box>

                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={loading || !pitch.trim()}
                  sx={{
                    width: '100%', py: 1.5,
                    bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                    borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                    fontWeight: 800, fontSize: '1rem', cursor: (loading || !pitch.trim()) ? 'not-allowed' : 'pointer',
                    color: D.green.border, opacity: (loading || !pitch.trim()) ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '&:hover:not(:disabled)': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                  }}
                >
                  {loading ? <CircularProgress size={22} /> : 'Submit Sponsor Pitch'}
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}

        {/* Evaluation Results */}
        {evaluation && submitted && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Box sx={{
              bgcolor: evaluation.success ? D.green.bg : D.yellow.bg,
              border: `2px solid ${evaluation.success ? D.green.border : D.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${evaluation.success ? D.green.shadow : D.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: evaluation.success ? D.green.border : D.yellow.border }} />
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: evaluation.success ? D.green.border : D.yellow.border }}>
                    {evaluation.success ? 'Sponsor Pitch Submitted!' : 'Try Again'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.blue.bg, border: `2px solid ${D.blue.border}`, color: D.blue.border }}>Level: {evaluation.level}</Box>
                    <Box sx={{ px: 1.75, py: 0.4, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, bgcolor: D.green.bg, border: `2px solid ${D.green.border}`, color: D.green.border }}>Score: +{evaluation.score} point{evaluation.score !== 1 ? 's' : ''}</Box>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: D.body, mb: 2 }}>{evaluation.feedback}</Typography>

              {/* Show user's pitch */}
              <Box sx={{ bgcolor: D.cardBg, border: `1px solid ${D.divider}`, borderRadius: '14px', p: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: D.heading, mb: 1 }}>
                  Your Pitch to {selectedSponsorData?.name}:
                </Typography>
                <Box sx={{ p: 2, bgcolor: D.pageBg, borderRadius: '10px' }}>
                  <Typography variant="body2" sx={{ color: D.body, whiteSpace: 'pre-wrap' }}>{pitch}</Typography>
                </Box>
              </Box>

              {evaluation.details && (
                <Box sx={{ p: 2, bgcolor: D.cardBg, borderRadius: '12px', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: D.heading, mb: 1 }}>Evaluation Details:</Typography>
                  {evaluation.details.persuasiveness && <Typography variant="body2" sx={{ color: D.body }}>Persuasiveness: {evaluation.details.persuasiveness}</Typography>}
                  {evaluation.details.clarity && <Typography variant="body2" sx={{ color: D.body }}>Clarity: {evaluation.details.clarity}</Typography>}
                </Box>
              )}

              <Box
                component="button"
                onClick={handleContinue}
                sx={{
                  width: '100%', py: 1.5,
                  bgcolor: D.green.bg, border: `2px solid ${D.green.border}`,
                  borderRadius: '14px', boxShadow: `4px 4px 0 ${D.green.shadow}`,
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer', color: D.green.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${D.green.shadow}` },
                }}
              >
                Complete Step 4
              </Box>
            </Box>
          </motion.div>
        )}

      </Container>
    </Box>
  )
}
