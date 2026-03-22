import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField } from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 1 - Level C1 - Task D: Critique Game
 * Critique 6 social media term uses in sentences
 */

const SENTENCES_TO_CRITIQUE = [
  { id: 1, sentence: 'The company posted on social media to get more followers.', term: 'organic reach', issue: 'Too vague - should specify strategy and metrics' },
  { id: 2, sentence: 'We used influencers because they are popular.', term: 'engagement rate', issue: 'Lacks analysis of effectiveness and ROI' },
  { id: 3, sentence: 'The viral video was successful.', term: 'viral content', issue: 'Does not explain why it went viral or metrics' },
  { id: 4, sentence: 'Analytics showed good numbers.', term: 'conversion analytics', issue: 'Too generic - needs specific metrics and interpretation' },
  { id: 5, sentence: 'We did targeting for our ads.', term: 'audience segmentation', issue: 'Lacks detail about criteria and strategy' },
  { id: 6, sentence: 'The post got a lot of engagement.', term: 'engagement metrics', issue: 'Does not specify types or quality of engagement' }
]

export default function Phase4_2RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState({})
  const [showResults, setShowResults] = useState(false)
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

  const handleCritiqueChange = (id, text) => setCritiques({ ...critiques, [id]: text })

  const handleSubmit = () => {
    setShowResults(true)
    let totalScore = 0
    SENTENCES_TO_CRITIQUE.forEach(item => {
      const critique = critiques[item.id] || ''
      const wordCount = critique.trim().split(/\s+/).filter(w => w.length > 0).length
      const itemScore = Math.min(wordCount / 20, 1.67)
      totalScore += itemScore
    })
    const finalScore = Math.min(totalScore, 10)
    sessionStorage.setItem('phase4_2_remedial_c1_taskD_score', finalScore.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_c1_taskD_max', '10')
    logTaskCompletion(finalScore, 10)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 1, level: 'C1', task: 'D', score, max_score: maxScore, critiques })
      })
    } catch (error) { console.error('Failed to log task:', error) }
  }

  const handleNext = () => navigate('/phase4_2/step/1/remedial/c1/taskE')

  const allCritiqued = SENTENCES_TO_CRITIQUE.every(item => {
    const critique = critiques[item.id] || ''
    return critique.trim().split(/\s+/).filter(w => w.length > 0).length >= 15
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.shadow }}>Phase 4.2 Step 1 - Remedial Practice</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: P.orange.shadow }}>Level C1 - Task D: Critique Game</Typography>
          </Box>

          <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="EMNA" message="Critique these vague social media statements. Identify what's missing, explain why the term is used poorly, and suggest specific improvements using C1-level vocabulary and analytical thinking." />
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 2, mb: 3 }}>
            <Typography variant="body1" sx={{ color: P.blue.shadow }}><strong>Instructions:</strong> For each sentence, write a critique (minimum 15 words) explaining what's wrong and how to improve it.</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: P.blue.shadow }}><strong>Focus on:</strong> Lack of specificity, missing metrics, vague terminology, and absence of strategic analysis.</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {SENTENCES_TO_CRITIQUE.map((item, index) => {
              const wordCount = (critiques[item.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length
              const cardColor = showResults ? P.green : P.orange
              return (
                <Box key={item.id} sx={{ bgcolor: cardColor.bg, border: `2px solid ${cardColor.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${cardColor.shadow}`, p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: cardColor.shadow }}>Sentence {index + 1} of {SENTENCES_TO_CRITIQUE.length}</Typography>

                  <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', border: `1px solid ${cardColor.border}`, borderRadius: '12px', p: 2, mb: 2 }}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: cardColor.shadow }}>"{item.sentence}"</Typography>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: cardColor.shadow }}>
                      Key term to consider: <strong>{item.term}</strong>
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom sx={{ color: cardColor.shadow }}>Your critique (minimum 15 words):</Typography>
                  <TextField fullWidth multiline rows={4} value={critiques[item.id] || ''} onChange={(e) => handleCritiqueChange(item.id, e.target.value)}
                    placeholder="Critique this sentence: What's missing? What's vague? How could it be improved? Use specific examples and sophisticated terminology..."
                    variant="outlined" disabled={showResults}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', '& fieldset': { borderColor: cardColor.border } } }}
                  />
                  <Typography variant="caption" sx={{ color: wordCount >= 15 ? P.green.shadow : cardColor.shadow, fontWeight: wordCount >= 15 ? 'bold' : 'normal' }}>
                    Words: {wordCount} {wordCount >= 15 && '✓'}
                  </Typography>

                  {showResults && (
                    <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', p: 2, mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: P.blue.shadow }}>Suggested focus:</Typography>
                      <Typography variant="body2" sx={{ color: P.blue.shadow }}>{item.issue}</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {showResults && (
            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`, p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.green.shadow }}>Critique Task Complete!</Typography>
              <Typography sx={{ color: P.green.shadow }}>You've analyzed all {SENTENCES_TO_CRITIQUE.length} sentences. Your critiques demonstrate critical thinking and analytical skills.</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 4 }}>
            {!showResults && (
              <>
                <Box component="button" onClick={handleSubmit} disabled={!allCritiqued} sx={{
                  bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.blue.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: !allCritiqued ? 'not-allowed' : 'pointer',
                  color: P.blue.shadow, opacity: !allCritiqued ? 0.6 : 1,
                  '&:hover': allCritiqued ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.blue.shadow}` } : {}
                }}>Submit Critiques</Box>
                {!allCritiqued && <Typography variant="body2" sx={{ color: 'text.secondary' }}>Please provide critiques for all sentences (minimum 15 words each)</Typography>}
              </>
            )}
            {showResults && (
              <Box component="button" onClick={handleNext} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` }
              }}><ArrowForwardIcon /> Continue to Task E</Box>
            )}
          </Box>

        </motion.div>
      </Container>
    </Box>
  )
}
