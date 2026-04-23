import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, TextField, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task H: Correction Crusade (Error Correction)
 * Correct errors in 6 advanced sentences
 */

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

const SENTENCES = [
  { id: 1, incorrect: 'Hashtags is powerful tool for discoverability.', errors: {'is': 'are', 'tool': 'tools'}, correct: 'Hashtags are powerful tools for discoverability.', hint: 'Check subject-verb agreement (plural subject needs plural verb and noun)' },
  { id: 2, incorrect: 'Caption which engage audiences are typically concise.', errors: {'which': 'that', 'engage': 'engages'}, correct: 'Caption that engages audiences is typically concise.', hint: 'Check relative pronoun choice and verb agreement with singular subject' },
  { id: 3, incorrect: 'Emoji add emotional context to posts.', errors: {'add': 'adds'}, correct: 'Emoji adds emotional context to posts.', hint: 'Emoji (singular) requires singular verb form' },
  { id: 4, incorrect: 'Call-to-action drive conversion when clear.', errors: {'drive': 'drives'}, correct: 'Call-to-action drives conversion when clear.', hint: 'Check subject-verb agreement with singular compound noun' },
  { id: 5, incorrect: 'Strategic tagging amplify network reach significantly.', errors: {'amplify': 'amplifies'}, correct: 'Strategic tagging amplifies network reach significantly.', hint: 'Gerund subject (tagging) takes singular verb' },
  { id: 6, incorrect: 'Viral post spread rapidly through networks.', errors: {'post': 'posts', 'spread': 'spreads'}, correct: 'Viral posts spread rapidly through networks.', hint: 'Check subject-verb agreement (singular post spreads OR plural posts spread)' }
]

export default function Phase4_2Step3RemedialC1TaskH() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const P = isDark ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 3, interaction: 8, context: 'remedial_c1' })
  const [correctedSentences, setCorrectedSentences] = useState({})
  const [showResults, setShowResults] = useState(false)

  const clayCard = (color) => ({
    bgcolor: P[color].bg,
    border: `2px solid ${P[color].border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${P[color].shadow}`,
    p: 3,
  })

  const handleCorrectionChange = (id, text) => {
    setCorrectedSentences({ ...correctedSentences, [id]: text })
  }

  const evaluateCorrection = (corrected, sentenceData) => {
    const text = corrected.toLowerCase().trim()
    const correctText = sentenceData.correct.toLowerCase().trim()
    const similarity = calculateSimilarity(text, correctText)
    return similarity > 0.85
  }

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.split(/\s+/)
    const words2 = str2.split(/\s+/)
    if (words1.length !== words2.length) return 0.5
    let matchCount = 0
    for (let i = 0; i < words1.length; i++) {
      if (words1[i] === words2[i]) matchCount++
    }
    return matchCount / words1.length
  }

  const handleSubmit = () => {
    let correctCount = 0
    SENTENCES.forEach(sentence => {
      const corrected = correctedSentences[sentence.id] || ''
      if (evaluateCorrection(corrected, sentence)) correctCount++
    })
    setShowResults(true)
    sessionStorage.setItem('phase4_2_step3_c1_taskH_score', correctCount)
    logTaskCompletion(correctCount, SENTENCES.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskH', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 3, level: 'C1', task: 'H', score: score, max_score: maxScore, correctedSentences: correctedSentences })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/remedial/c1/results')
  }

  const allCompleted = SENTENCES.every(sentence => {
    const corrected = correctedSentences[sentence.id] || ''
    return corrected.trim().length > 0
  })

  const finalCorrectCount = showResults ? SENTENCES.filter(s => evaluateCorrection(correctedSentences[s.id] || '', s)).length : 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <Box sx={{ ...clayCard('orange'), mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.border }}>Phase 4.2 · Step 3 · Level C1 · Task H</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#fff' : '#1a252f', mt: 0.5 }}>Correction Crusade</Typography>
          </Box>

          {/* Instructor Message */}
          <Box sx={{ ...clayCard('teal'), mb: 3 }}>
            <CharacterMessage
              character="EMNA"
              message="Demonstrate your advanced grammar expertise by identifying and correcting errors in 6 sentences! Focus on subject-verb agreement, relative pronouns, and singular/plural consistency. Each sentence contains grammatical errors that a C1-level learner should recognize."
            />
          </Box>

          {/* Instructions */}
          <Box sx={{ ...clayCard('yellow'), mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ color: P.yellow.border }}>Instructions:</Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 0.5 }}>
              Correct the grammatical errors in each sentence. Write the fully corrected sentence.
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#444', mt: 1 }}>
              <strong>Common errors:</strong> Subject-verb agreement, relative pronoun choice, singular/plural consistency, gerund subjects.
            </Typography>
          </Box>

          {/* Grammar Resources */}
          <Box sx={{ ...clayCard('blue'), mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: P.blue.border, mb: 1 }}>Grammar Resources</Typography>
            <Box
              component="a"
              href="https://www.eslgamesplus.com/grammar-worksheets/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: P.blue.border,
                textDecoration: 'none',
                fontWeight: 600,
                mb: 0.5,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <OpenInNewIcon fontSize="small" />
              ESL Games Plus - Grammar Practice
            </Box>
            <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666' }}>Review grammar rules before completing this task</Typography>
          </Box>

          {/* Error Correction Tasks */}
          <Box sx={{ mb: 3 }}>
            {SENTENCES.map((sentence, index) => {
              const isCorrect = showResults && evaluateCorrection(correctedSentences[sentence.id] || '', sentence)
              return (
                <Box key={sentence.id} sx={{ ...clayCard('purple'), mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.border, mb: 2 }}>
                    Sentence {index + 1} of {SENTENCES.length}
                  </Typography>
                  <Box sx={{ ...clayCard('red'), mb: 2, p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: P.red.border, mb: 0.5 }}>Incorrect Sentence (contains errors):</Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: P.red.border, fontWeight: 'bold' }}>{sentence.incorrect}</Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#666', mt: 0.5, display: 'block' }}>Hint: {sentence.hint}</Typography>
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isDark ? '#ddd' : '#333', mb: 1 }}>Your Correction:</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={correctedSentences[sentence.id] || ''}
                    onChange={(e) => handleCorrectionChange(sentence.id, e.target.value)}
                    placeholder="Write the corrected sentence here..."
                    variant="outlined"
                    disabled={showResults}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? '#1a1a2e' : 'white',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: P.purple.border, borderWidth: 2 },
                        '&:hover fieldset': { borderColor: P.purple.shadow },
                        '&.Mui-focused fieldset': { borderColor: P.purple.shadow },
                        '& textarea': { color: isDark ? '#eee' : '#1a252f' }
                      }
                    }}
                  />
                  {showResults && (
                    <Box sx={{ ...clayCard(isCorrect ? 'green' : 'teal'), mt: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {isCorrect && <CheckCircleIcon sx={{ color: P.green.border, fontSize: 18 }} />}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isCorrect ? P.green.border : P.teal.border }}>
                          {isCorrect ? 'Correct!' : 'Correct version:'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: isDark ? '#ddd' : '#333' }}>{sentence.correct}</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Results Summary */}
          {showResults && (
            <Box sx={{ ...clayCard(finalCorrectCount === SENTENCES.length ? 'green' : 'yellow'), mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: finalCorrectCount === SENTENCES.length ? P.green.border : P.yellow.border, mb: 1 }}>
                Correction Task Complete!
              </Typography>
              <Typography sx={{ color: isDark ? '#ddd' : '#333' }}>
                You correctly fixed {finalCorrectCount}/{SENTENCES.length} sentences
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#bbb' : '#555', mt: 1 }}>
                {finalCorrectCount === SENTENCES.length
                  ? 'Perfect! You have mastered advanced grammar error identification and correction!'
                  : 'Review the correct versions and practice identifying subject-verb agreement and other grammatical patterns.'}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {!showResults && (
              <Box
                component="button"
                onClick={handleSubmit}
                disabled={!allCompleted}
                sx={{
                  ...clayCard('orange'),
                  cursor: allCompleted ? 'pointer' : 'not-allowed',
                  opacity: allCompleted ? 1 : 0.5,
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.orange.border,
                  display: 'inline-block',
                  '&:hover': allCompleted ? { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } : {},
                  transition: 'all 0.15s ease',
                }}
              >
                Submit Corrections
              </Box>
            )}
            {showResults && (
              <Box
                component="button"
                onClick={handleNext}
                sx={{
                  ...clayCard('green'),
                  cursor: 'pointer',
                  px: 6, py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: P.green.border,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` },
                  transition: 'all 0.15s ease',
                }}
              >
                View Results <ArrowForwardIcon fontSize="small" />
              </Box>
            )}
          </Box>

          {!showResults && !allCompleted && (
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', textAlign: 'center', mt: 2 }}>
              Please correct all sentences before submitting
            </Typography>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
