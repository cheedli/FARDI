import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, TextField, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 5 - Remedial C1 - Task D: Tense Odyssey
 * Correct 6 sentences with mixed errors (tense, grammar, structure)
 * Gamified as "Tense Odyssey"
 * Score: +1 for each correct sentence (6 total)
 */

const MIXED_ERROR_SENTENCES = [
  {
    id: 1,
    faulty: 'Promotional advertising are to sell but it lack persuasive.',
    correctAnswer: 'Promotional advertising, which has been used to drive sales for decades, would be far more effective if it incorporated balanced persuasive techniques as video 1 suggests.',
    keyElements: ['has been used', 'would be', 'if it incorporated', 'as video 1 suggests']
  },
  {
    id: 2,
    faulty: 'The gatefold which provide space in posters are effective.',
    correctAnswer: 'The gatefold, which provides space in posters, would have been even more impactful had it been combined with targeted imagery.',
    keyElements: ['which provides', 'would have been', 'had it been combined']
  },
  {
    id: 3,
    faulty: 'Dramatisation in video 2 were used to engage but it feel contrived.',
    correctAnswer: 'Dramatisation in video 2 was employed to engage viewers emotionally, although it would have felt more authentic had the obstacles been portrayed more realistically.',
    keyElements: ['was employed', 'would have felt', 'had the obstacles been portrayed']
  },
  {
    id: 4,
    faulty: 'Persuasive appeals which is based on ethos pathos logos is powerful.',
    correctAnswer: 'Persuasive appeals, which are based on ethos, pathos, and logos, have proven powerful when balanced correctly, as video 1 illustrates.',
    keyElements: ['which are based', 'have proven', 'when balanced', 'as video 1 illustrates']
  },
  {
    id: 5,
    faulty: 'Targeted ads has become more precise but raise ethical issue.',
    correctAnswer: 'Targeted ads have become significantly more precise, yet they would raise fewer ethical issues if transparency were maintained.',
    keyElements: ['have become', 'would raise', 'if transparency were maintained']
  },
  {
    id: 6,
    faulty: 'Creative execution stand out but need consistent with brand.',
    correctAnswer: 'Creative execution stands out in oversaturated markets, but it would lose impact if it had not remained consistent with the brand identity.',
    keyElements: ['stands out', 'would lose', 'if it had not remained']
  }
]

export default function Phase4Step5RemedialC1TaskD() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_c1' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState([])
  const [score, setScore] = useState(0)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const checkAnswerFallback = (id) => {
    const userAnswer = answers[id]?.toLowerCase().trim()
    const sentence = MIXED_ERROR_SENTENCES.find(s => s.id === id)

    // Check if answer contains key elements (tense markers, conditionals, etc.)
    const hasKeyElements = sentence.keyElements.every(element =>
      userAnswer.includes(element.toLowerCase())
    )

    // Check basic improvements
    const hasProperLength = userAnswer.length >= 80
    const hasPunctuation = userAnswer.includes(',')
    const isNotFaulty = userAnswer !== sentence.faulty.toLowerCase()

    return hasKeyElements && hasProperLength && hasPunctuation && isNotFaulty
  }

  const handleSubmit = async () => {
    let correctCount = 0
    const evaluationResults = []

    // Evaluate each sentence using LLM
    for (const sentence of MIXED_ERROR_SENTENCES) {
      const userAnswer = answers[sentence.id] || ''
      let isCorrect = false

      try {
        // Use LLM to evaluate C1-level tense corrections
        const response = await fetch('/api/phase4/step5/remedial/evaluate-tense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            level: 'C1',
            faultySentence: sentence.faulty,
            userAnswer: userAnswer.trim(),
            expectedAnswer: sentence.correctAnswer,
            keyElements: sentence.keyElements,
            sentenceId: sentence.id
          })
        })

        const data = await response.json()
        isCorrect = data.correct

      } catch (error) {
        console.error('LLM evaluation error:', error)
        // Fallback to keyword checking
        isCorrect = checkAnswerFallback(sentence.id)
      }

      if (isCorrect) correctCount++

      evaluationResults.push({
        id: sentence.id,
        faulty: sentence.faulty,
        userAnswer: userAnswer,
        correctAnswer: sentence.correctAnswer,
        isCorrect,
        keyElements: sentence.keyElements
      })
    }

    setResults(evaluationResults)
    setScore(correctCount)
    setSubmitted(true)
    sessionStorage.setItem('phase4_step5_remedial_c1_taskD_score', correctCount)

    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskD', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/step5/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'D',
          score: score,
          max_score: 6,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/5/remedial/c1/taskE')
  }

  const allFilled = MIXED_ERROR_SENTENCES.every(s => answers[s.id] && answers[s.id].trim())

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task D: Tense Odyssey ⏰
        </Typography>
        <Typography variant="body1">
          Correct 6 sentences with mixed errors (tense, grammar, structure)!
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message="Welcome to the Tense Odyssey! ⏰ You have 6 faulty sentences with mixed errors. Your mission: completely rewrite each sentence correcting tense, grammar, and structure while adding C1-level sophistication. Focus on complex conditionals, perfect tenses, and sophisticated structures!"
        />
      </Paper>

      {/* What to Fix Guide */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fce4ec', border: '2px solid #c0392b' }}>
        <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }} gutterBottom>
          ⏰ What to Fix (C1 Level):
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Tense Accuracy:</strong> Use perfect tenses (has been used, have become, have proven), past perfect (had been, had it been)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Conditionals:</strong> Use complex conditionals (would be, would have been, would have felt, if it incorporated, had it been)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Subject-Verb Agreement:</strong> are→is, were→was, has→have, stand→stands
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Sophisticated Vocabulary:</strong> employed, portrayed, illustrates, oversaturated, authentic
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Complex Syntax:</strong> Use commas, dashes, subordinate clauses, relative clauses (which, although, yet)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6a1b9a', fontWeight: 700 }}>
            <strong>Video References:</strong> Include "as video 1 suggests", "in video 2", etc.
          </Typography>
        </Stack>
      </Paper>

      {!submitted && (
        <Box>
          <Stack spacing={3}>
            {MIXED_ERROR_SENTENCES.map((sentence, index) => (
              <Paper key={sentence.id} elevation={3} sx={{ p: 3, border: '2px solid #c0392b' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sentence {index + 1}
                </Typography>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee', border: '2px solid #f44336' }}>
                  <Typography variant="subtitle2" color="error.dark" fontWeight="bold" gutterBottom>
                    ❌ Faulty Sentence:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#c62828', fontFamily: 'monospace' }}>
                    {sentence.faulty}
                  </Typography>
                </Paper>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Your C1-level correction"
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
                  placeholder="Completely rewrite the sentence with proper tenses, conditionals, and sophisticated structure..."
                  variant="outlined"
                  helperText="Fix tense, grammar, add sophistication (min 80 characters)"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& textarea': {
                        color: '#ffffff',
                        fontWeight: 500
                      }
                    }
                  }}
                />
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!allFilled}
              sx={{
                background: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a93226 0%, #7d3c98 100%)'
                },
                py: 2,
                px: 6
              }}
            >
              {allFilled ? 'Submit Tense Odyssey ⏰' : 'Fill All Sentences First'}
            </Button>
          </Stack>
        </Box>
      )}

      {submitted && (
        <Box>
          {/* Results Summary */}
          <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: 'center', backgroundColor: score >= 5 ? 'success.light' : 'warning.light' }}>
            <Typography variant="h4" gutterBottom color={score >= 5 ? 'success.dark' : 'warning.dark'}>
              {score === 6 ? '⏰ Perfect Tense Mastery! ⏰' : score >= 5 ? '🌟 Great Work! 🌟' : '💪 Good Effort! 💪'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 6 points!
            </Typography>
          </Paper>

          {/* Detailed Results */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Review:
            </Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {results.map((result, index) => (
                <Alert key={result.id} severity={result.isCorrect ? 'success' : 'error'}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Sentence {index + 1}:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: '#d32f2f' }}>
                    Faulty: {result.faulty}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Your answer: {result.userAnswer || '(no answer)'}
                  </Typography>
                  {!result.isCorrect && (
                    <>
                      <Typography variant="body2" color="success.dark" fontWeight="bold" sx={{ mt: 1 }}>
                        ✓ Expected correction: {result.correctAnswer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Key elements needed: {result.keyElements.join(', ')}
                      </Typography>
                    </>
                  )}
                </Alert>
              ))}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
              sx={{ py: 2, px: 6 }}
            >
              Continue to Task E →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
