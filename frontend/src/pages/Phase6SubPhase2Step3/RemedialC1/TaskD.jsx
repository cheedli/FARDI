import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, TextField, Alert,
  Chip, Divider, Collapse, LinearProgress
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BuildIcon from '@mui/icons-material/Build'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { phase6API } from '../../../lib/phase6_api.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

const EXTRACTS = [
  {
    id: 1,
    extract: '"Your report is fine but the recommendations are weak."',
    critiqueChip: 'Vague + no empathy',
    fixChip: 'Specific + empathetic',
    weakness:
      'Vague, unempathetic, and opens with a lukewarm qualifier that undermines the positive intent.',
    modelFix:
      '"Your report demonstrates solid analytical structure; to strengthen it further, the Recommendations section would benefit from measurable, specific targets linked directly to your findings."',
    fixKeyWords: ['recommendations', 'specific', 'measurable', 'benefit', 'strengthen', 'analytical'],
    critiqueKeyWords: ['vague', 'lukewarm', 'weak', 'unspecific', 'empathy', 'negative', 'qualifier'],
  },
  {
    id: 2,
    extract: '"I think maybe you could possibly consider adding more details."',
    critiqueChip: 'Over-hedged + vague',
    fixChip: 'Confident + specific',
    weakness:
      'Excessive hedging makes the feedback uncertain and unhelpful — the writer cannot act on vague suggestions.',
    modelFix:
      '"To enhance the credibility of your Successes section, I recommend including specific data such as attendance figures or satisfaction scores."',
    fixKeyWords: ['recommend', 'specific', 'data', 'attendance', 'scores', 'credibility', 'successes', 'include'],
    critiqueKeyWords: ['hedge', 'vague', 'uncertain', 'unhelpful', 'cannot act', 'excessive', 'over-hedged', 'hedging'],
  },
  {
    id: 3,
    extract: '"Good job! But everything needs to be redone."',
    critiqueChip: 'Contradictory + harsh',
    fixChip: 'Balanced positive sandwich',
    weakness:
      'Contradictory opening and closing; the sweeping negative ("everything") is discouraging and unhelpful.',
    modelFix:
      '"Your introduction is clear and well-structured. To develop the report further, the Challenges section would benefit from more specific examples, and the Recommendations from clearer action points."',
    fixKeyWords: ['introduction', 'well-structured', 'challenges', 'specific', 'examples', 'recommendations', 'action'],
    critiqueKeyWords: ['contradictory', 'sweeping', 'discouraging', 'harsh', 'everything', 'negative'],
  },
  {
    id: 4,
    extract: '"The vocabulary is good."',
    critiqueChip: 'Vague praise',
    fixChip: 'Evidence-based praise',
    weakness:
      'Unspecific praise offers no insight — the writer cannot learn from or build on it.',
    modelFix:
      '"Your use of formal register throughout — particularly phrases such as \'it is recommended that\' and \'the data suggests\' — demonstrates a strong command of academic report language."',
    fixKeyWords: ['formal register', 'recommended', 'data suggests', 'academic', 'demonstrates', 'command', 'particularly'],
    critiqueKeyWords: ['vague', 'unspecific', 'no insight', 'generic', 'hollow', 'cannot learn'],
  },
  {
    id: 5,
    extract: '"You should fix the grammar and spelling before submitting this."',
    critiqueChip: 'No balance + blunt',
    fixChip: 'Balanced + empathetic',
    weakness:
      'Opens negatively with no acknowledgement of strengths; blunt tone risks discouraging the writer.',
    modelFix:
      '"The content of your report is thoughtful and well-researched. Before final submission, a careful proofreading pass would help eliminate minor grammatical inconsistencies and further strengthen the professional impression."',
    fixKeyWords: ['thoughtful', 'well-researched', 'proofreading', 'submission', 'professional', 'strengthen', 'eliminate'],
    critiqueKeyWords: ['negative', 'blunt', 'no strength', 'no acknowledgement', 'discouraging', 'harsh'],
  },
]

function scoreTextField(text, keyWords) {
  if (!text || text.trim().length < 15) return false
  const lower = text.toLowerCase()
  return keyWords.some(kw => lower.includes(kw.toLowerCase()))
}

export default function Phase6SP2Step3RemC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 6, subphase: 2, step: 3, interaction: 4, context: 'remedial_c1' })
  const [critiques, setCritiques] = useState(Array(5).fill(''))
  const [fixes, setFixes] = useState(Array(5).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showModels, setShowModels] = useState(Array(5).fill(false))

  const totalFilled = [...critiques, ...fixes].filter(v => v.trim().length >= 15).length
  const progress = (totalFilled / 10) * 100

  const toggleModel = (i) => {
    setShowModels(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  const handleSubmit = async () => {
    if (totalFilled < 10) return
    let correct = 0
    critiques.forEach((c, i) => {
      if (scoreTextField(c, EXTRACTS[i].critiqueKeyWords)) correct++
    })
    fixes.forEach((f, i) => {
      if (scoreTextField(f, EXTRACTS[i].fixKeyWords)) correct++
    })
    // Score out of 5: one point per extract (critique + fix together)
    let extractScore = 0
    EXTRACTS.forEach((_, i) => {
      const critiqueOk = scoreTextField(critiques[i], EXTRACTS[i].critiqueKeyWords)
      const fixOk = scoreTextField(fixes[i], EXTRACTS[i].fixKeyWords)
      if (critiqueOk || fixOk) extractScore++
    })
    setScore(extractScore)
    setSubmitted(true)
    sessionStorage.setItem('phase6_sp2_step3_remedial_c1_taskd_score', extractScore.toString())
    try {
      await phase6API.logRemedialActivity(3, 'C1', 'D', extractScore, 5, 0, 2)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <BuildIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Step 3 · Remedial C1 · Task D
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Critique Kahoot — Identify Weaknesses and Rewrite Flawed Feedback
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          SubPhase 2: Peer Feedback Discussion
        </Typography>
      </Paper>

      {/* Instructions */}
      <CharacterMessage
        message="Five flawed peer feedback extracts are shown below. For each one: (1) write a critique explaining what is wrong with it, and (2) rewrite it as effective C1-level positive sandwich feedback. Be specific in both your critique and your fix!"
        character="teacher"
      />

      {/* Progress */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Fields completed (critiques + fixes)</Typography>
          <Typography variant="body2" fontWeight="bold" color="#6c3483">
            {totalFilled}/10
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#f3e5f5',
            '& .MuiLinearProgress-bar': { bgcolor: '#8e44ad' },
          }}
        />
      </Paper>

      {/* Extract Cards */}
      {EXTRACTS.map((item, i) => {
        const critiqueOk = submitted && scoreTextField(critiques[i], item.critiqueKeyWords)
        const fixOk = submitted && scoreTextField(fixes[i], item.fixKeyWords)

        return (
          <Paper key={item.id} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            {/* Extract Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  bgcolor: '#8e44ad',
                  color: 'white',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                {item.id}
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#6c3483">
                Extract {item.id}
              </Typography>
              <Chip label={item.critiqueChip} size="small" sx={{ bgcolor: '#fdecea', color: '#c0392b', fontWeight: 'bold' }} />
              <Chip label={item.fixChip} size="small" sx={{ bgcolor: '#e8f8f0', color: '#1a7a45', fontWeight: 'bold' }} />
            </Box>

            {/* Original Extract */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                bgcolor: '#fff3e0',
                border: '1px solid #ffb74d',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" fontWeight="bold" color="#e65100" sx={{ display: 'block', mb: 0.5 }}>
                Flawed Extract:
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                {item.extract}
              </Typography>
            </Paper>

            <Divider sx={{ mb: 2 }} />

            {/* Critique Field */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#c0392b" gutterBottom>
                Your Critique — What is wrong with this feedback?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Explain the specific weakness(es) using analytical language.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={critiques[i]}
                onChange={e => setCritiques(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                disabled={submitted}
                placeholder="e.g. This extract is problematic because…"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#c0392b' },
                  },
                }}
              />
              {submitted && (
                <Alert severity={critiqueOk ? 'success' : 'warning'} sx={{ mt: 1 }}>
                  {critiqueOk
                    ? 'Good — your critique identifies the key weakness.'
                    : `Strong critiques mention: ${item.critiqueKeyWords.slice(0, 3).join(', ')}. The core issue: ${item.weakness}`}
                </Alert>
              )}
            </Box>

            {/* Fix Field */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="#1a7a45" gutterBottom>
                Your Rewrite — Improve it using the positive sandwich structure
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Write a C1-level version that is balanced, specific, and empathetic.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={fixes[i]}
                onChange={e => setFixes(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                disabled={submitted}
                placeholder="e.g. Your report demonstrates… To strengthen it further…"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#27ae60' },
                  },
                }}
              />
              {submitted && (
                <Alert severity={fixOk ? 'success' : 'warning'} sx={{ mt: 1 }}>
                  {fixOk
                    ? 'Excellent rewrite — you applied the positive sandwich structure effectively.'
                    : `Effective rewrites include: ${item.fixKeyWords.slice(0, 3).join(', ')}.`}
                </Alert>
              )}
            </Box>

            {/* Model Answer Toggle */}
            {submitted && (
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  startIcon={<LightbulbIcon />}
                  onClick={() => toggleModel(i)}
                  sx={{ color: '#8e44ad' }}
                >
                  {showModels[i] ? 'Hide Model Answer' : 'View Model Answer'}
                </Button>
                <Collapse in={showModels[i]}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mt: 1,
                      bgcolor: '#f3e5f5',
                      border: '1px solid #ce93d8',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" color="#6c3483" display="block" gutterBottom>
                      Model Critique:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, fontStyle: 'italic' }}>
                      {item.weakness}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color="#6c3483" display="block" gutterBottom>
                      Model Rewrite:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {item.modelFix}
                    </Typography>
                  </Paper>
                </Collapse>
              </Box>
            )}
          </Paper>
        )
      })}

      {/* Submit / Result */}
      {!submitted ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={totalFilled < 10}
          fullWidth
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            '&:hover': { opacity: 0.9 },
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Submit All Critiques & Rewrites ({totalFilled}/10 filled)
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5', borderRadius: 2, mt: 2 }}
        >
          <CheckCircleIcon sx={{ fontSize: 50, color: '#8e44ad', mb: 1 }} />
          <Typography variant="h5" color="#6c3483" fontWeight="bold">
            Task D Complete! Score: {score}/5
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            {score === 5
              ? 'Outstanding — you identified every flaw and produced genuinely C1-level rewrites!'
              : score >= 4
              ? 'Excellent work — your critiques and rewrites demonstrate strong analytical ability.'
              : score >= 3
              ? 'Good effort! Review the model answers to sharpen your language for the weaker extracts.'
              : score >= 2
              ? 'Reasonable — compare your rewrites carefully with the model answers and note key phrases.'
              : 'Keep practising — study each model answer closely to understand what makes feedback effective at C1 level.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use the "View Model Answer" buttons above to compare your responses with the model critiques and rewrites.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/phase6/subphase/2/step/4')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
              '&:hover': { opacity: 0.9 },
              px: 4,
            }}
          >
            Continue to Step 4
          </Button>
        </Paper>
      )}
    </Box>
  )
}
