import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Alert, TextField, Collapse, Chip, Stack, Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import BuildIcon from '@mui/icons-material/Build'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const EXTRACTS = [
  {
    extract: '"Your reprot has alot of good ideers but the recomendations need work and you should fix grammer."',
    critiqueChip: 'Multiple spelling + grammar errors',
    fixChip: 'Proofread + formalise',
    weakness:
      'Multiple spelling errors (reprot, alot, ideers, recomendations, grammer) and informal register undermine credibility.',
    expertFix:
      '"Your report contains a number of insightful ideas and demonstrates a commendable understanding of the event\'s key outcomes. To strengthen the overall impact, I recommend refining the Recommendations section with specific, measurable targets and reviewing the report for grammatical consistency."',
  },
  {
    extract: '"This is fine. Could be better. The end."',
    critiqueChip: 'Telegraphic + no substance',
    fixChip: 'Full sentences + specific',
    weakness:
      'Fragmented, content-free feedback that offers no actionable guidance or balanced evaluation.',
    expertFix:
      '"Your report is clearly structured and addresses the key areas expected of a post-event evaluation. To further develop its analytical depth, I suggest expanding the Challenges section with specific examples and supplementing the Successes section with quantitative evidence."',
  },
  {
    extract: '"I feel like maybe your tone is sometimes a bit off in some places. Just my opinion."',
    critiqueChip: 'Over-hedged + vague + disclaiming',
    fixChip: 'Confident + evidence-based',
    weakness:
      'Excessive hedging and the disclaimer "Just my opinion" undermine accountability and provide no specific guidance.',
    expertFix:
      '"In certain passages — particularly the opening of the Challenges section — the tone shifts from formal to conversational, which disrupts the register consistency expected of a professional post-event report. I recommend reviewing these sections to ensure a uniformly formal and objective voice throughout."',
  },
  {
    extract: '"Great report!!! You are so talented!!! Keep it up!!!"',
    critiqueChip: 'Unsubstantiated + informal',
    fixChip: 'Evidence-based + professional',
    weakness:
      'Excessive enthusiasm and lack of specificity signal that the reviewer has not engaged analytically with the work.',
    expertFix:
      '"Your report reflects considerable analytical talent, particularly in the precision and clarity of the executive summary and the logical coherence of the overall structure. I look forward to seeing how you continue to develop your capacity for evidence-based, nuanced evaluation in future work."',
  },
  {
    extract: '"The structure is confusing, the vocabulary is basic, the tone is wrong, and the recommendations make no sense."',
    critiqueChip: 'All negative + no balance',
    fixChip: 'Positive sandwich + specific fixes',
    weakness:
      'Wholly negative feedback with no acknowledgement of strengths; each criticism is vague and potentially demoralising.',
    expertFix:
      '"Your report demonstrates genuine commitment to honest self-reflection and covers all the required sections comprehensively. To strengthen its analytical impact, I suggest: (1) restructuring the Challenges section to follow a problem-resolution format, (2) replacing general vocabulary (\'good\', \'bad\') with domain-specific terms (\'well-received\', \'logistical challenges\'), and (3) linking each recommendation directly to a specific finding to ensure clarity and actionability."',
  },
]

export default function Phase6SP2Step5RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 5, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(EXTRACTS.length).fill(''))
  const [revealed, setRevealed] = useState(Array(EXTRACTS.length).fill(false))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleCritiqueChange = (index, value) => {
    setCritiques(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const toggleReveal = (index) => {
    setRevealed(prev => {
      const updated = [...prev]
      updated[index] = !updated[index]
      return updated
    })
  }

  const wordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleSubmit = async () => {
    const filled = critiques.filter(c => wordCount(c) >= 5).length
    setScore(filled)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step5_remedial_c1_taskd_score', filled.toString())
    try { await phase6API.logRemedialActivity(5, 'C1', 'D', filled, 5, 0, 2) } catch (e) { console.error(e) }
  }

  const anyFilled = critiques.some(c => c.trim().length > 0)

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Step 5: Remedial C1 — Task D</Typography>
        <Typography variant="body1">Critique Kahoot — Critique and Fix 5 Severely Flawed Peer Feedback Extracts</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f9f0ff', border: '1px solid #d7bde2' }}>
        <Typography variant="body2" sx={{ color: '#6c3483', fontWeight: 'bold' }}>
          Instructions: For each flawed extract, (1) write your critique identifying the weakness (at least 5 words), then (2) reveal the expert fix and model response. After critiquing all 5 extracts, submit your final evaluation.
        </Typography>
      </Paper>

      {EXTRACTS.map((item, index) => {
        const wc = wordCount(critiques[index])
        const isSufficient = submitted && wc >= 5
        const isInsufficient = submitted && wc < 5

        return (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3, mb: 3, borderRadius: 2,
              border: submitted
                ? isSufficient ? '2px solid #27ae60' : '2px solid #e74c3c'
                : '2px solid transparent',
            }}
          >
            {/* Extract header */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#6c3483', mb: 2 }}>
              Extract {index + 1}
            </Typography>

            {/* Chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                icon={<CrisisAlertIcon />}
                label={item.critiqueChip}
                size="small"
                sx={{ bgcolor: '#fdecea', color: '#922b21', border: '1px solid #f5b7b1' }}
              />
              <Chip
                icon={<BuildIcon />}
                label={item.fixChip}
                size="small"
                sx={{ bgcolor: '#e8f5e9', color: '#1e8449', border: '1px solid #a9dfbf' }}
              />
            </Stack>

            {/* Flawed extract */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fdecea', borderRadius: 1, mb: 2, border: '1px solid #f5b7b1' }}>
              <Typography variant="body2" sx={{ color: '#922b21', fontWeight: 'bold', mb: 0.5 }}>Flawed extract:</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{item.extract}</Typography>
            </Paper>

            {/* Weakness summary */}
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">Key weakness:</Typography>
              <Typography variant="body2">{item.weakness}</Typography>
            </Alert>

            {/* Student critique input */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#6c3483' }}>
              Write your critique of this extract (min. 5 words):
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={critiques[index]}
              onChange={e => handleCritiqueChange(index, e.target.value)}
              disabled={submitted}
              placeholder="Explain what is wrong with this feedback and why it fails at C1 level..."
              sx={{ mb: 1 }}
            />
            <Typography
              variant="caption"
              color={submitted && wc < 5 ? 'error' : 'text.secondary'}
            >
              Words: {wc} {submitted && wc < 5 ? '(minimum 5 words required)' : ''}
            </Typography>

            {/* Reveal expert fix button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => toggleReveal(index)}
                sx={{ borderColor: '#8e44ad', color: '#8e44ad', '&:hover': { bgcolor: '#f9f0ff' } }}
              >
                {revealed[index] ? 'Hide Expert Fix' : 'Reveal Expert Fix'}
              </Button>

              <Collapse in={revealed[index]}>
                <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #a9dfbf' }}>
                  <Typography variant="body2" sx={{ color: '#1e8449', fontWeight: 'bold', mb: 1 }}>Expert rewrite:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>{item.expertFix}</Typography>
                </Paper>
              </Collapse>
            </Box>
          </Paper>
        )
      })}

      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!anyFilled}
          fullWidth
          size="large"
          sx={{ background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
        >
          Submit Final Critique
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f0ff', borderRadius: 2, mt: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#6c3483' }}>Task D Complete! Score: {score}/5</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {score === 5
              ? 'Outstanding — you critiqued all 5 extracts with C1-level analytical precision. You are ready to produce exemplary peer feedback!'
              : score >= 3
              ? 'Strong performance! Review the expert fixes above to consolidate your understanding of rigorous peer feedback revision.'
              : 'Good effort! Study the expert rewrites carefully — they model the precision, empathy, and evidence-based approach required at C1 level.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/phase6/complete')}
            size="large"
            sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}
          >
            Complete Phase 6
          </Button>
        </Paper>
      )}
    </Box>
  )
}
