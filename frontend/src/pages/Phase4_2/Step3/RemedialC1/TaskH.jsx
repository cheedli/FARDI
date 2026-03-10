import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Link
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 Step 3 - Level C1 - Task H: Correction Crusade (Error Correction)
 * Correct errors in 6 advanced sentences
 */

const SENTENCES = [
  {
    id: 1,
    incorrect: 'Hashtags is powerful tool for discoverability.',
    errors: {'is': 'are', 'tool': 'tools'},
    correct: 'Hashtags are powerful tools for discoverability.',
    hint: 'Check subject-verb agreement (plural subject needs plural verb and noun)'
  },
  {
    id: 2,
    incorrect: 'Caption which engage audiences are typically concise.',
    errors: {'which': 'that', 'engage': 'engages'},
    correct: 'Caption that engages audiences is typically concise.',
    hint: 'Check relative pronoun choice and verb agreement with singular subject'
  },
  {
    id: 3,
    incorrect: 'Emoji add emotional context to posts.',
    errors: {'add': 'adds'},
    correct: 'Emoji adds emotional context to posts.',
    hint: 'Emoji (singular) requires singular verb form'
  },
  {
    id: 4,
    incorrect: 'Call-to-action drive conversion when clear.',
    errors: {'drive': 'drives'},
    correct: 'Call-to-action drives conversion when clear.',
    hint: 'Check subject-verb agreement with singular compound noun'
  },
  {
    id: 5,
    incorrect: 'Strategic tagging amplify network reach significantly.',
    errors: {'amplify': 'amplifies'},
    correct: 'Strategic tagging amplifies network reach significantly.',
    hint: 'Gerund subject (tagging) takes singular verb'
  },
  {
    id: 6,
    incorrect: 'Viral post spread rapidly through networks.',
    errors: {'post': 'posts', 'spread': 'spreads'},
    correct: 'Viral posts spread rapidly through networks.',
    hint: 'Check subject-verb agreement (singular post spreads OR plural posts spread)'
  }
]

export default function Phase4_2Step3RemedialC1TaskH() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 8, context: 'remedial_c1' })
  const [correctedSentences, setCorrectedSentences] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleCorrectionChange = (id, text) => {
    setCorrectedSentences({ ...correctedSentences, [id]: text })
  }

  const evaluateCorrection = (corrected, sentenceData) => {
    const text = corrected.toLowerCase().trim()
    const correctText = sentenceData.correct.toLowerCase().trim()

    // Check if correction is very similar to the correct answer
    // Allow for minor variations in punctuation/spacing
    const similarity = calculateSimilarity(text, correctText)
    return similarity > 0.85 // 85% similarity threshold
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
      if (evaluateCorrection(corrected, sentence)) {
        correctCount++
      }
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
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'C1',
          task: 'H',
          score: score,
          max_score: maxScore,
          correctedSentences: correctedSentences
        })
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

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 3 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level C1 - Task H: Correction Crusade
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message="Demonstrate your advanced grammar expertise by identifying and correcting errors in 6 sentences! Focus on subject-verb agreement, relative pronouns, and singular/plural consistency. Each sentence contains grammatical errors that a C1-level learner should recognize."
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Correct the grammatical errors in each sentence. Write the fully corrected sentence.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Common errors:</strong> Subject-verb agreement, relative pronoun choice, singular/plural consistency, gerund subjects.
        </Typography>
      </Paper>

      {/* External Resource Link */}
      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.dark" fontWeight="bold">
            Grammar Resources
          </Typography>
          <Link
            href="https://www.eslgamesplus.com/grammar-worksheets/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
          >
            <OpenInNewIcon fontSize="small" />
            ESL Games Plus - Grammar Practice
          </Link>
          <Typography variant="caption" color="text.secondary">
            Review grammar rules before completing this task
          </Typography>
        </CardContent>
      </Card>

      {/* Error Correction Tasks */}
      <Box sx={{ mb: 4 }}>
        {SENTENCES.map((sentence, index) => {
          const isCorrect = showResults && evaluateCorrection(correctedSentences[sentence.id] || '', sentence)

          return (
            <Card key={sentence.id} elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Sentence {index + 1} of {SENTENCES.length}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'error.lighter' }}>
                  <Typography variant="subtitle2" color="error.dark" gutterBottom>
                    Incorrect Sentence (contains errors):
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'error.dark', fontWeight: 'bold' }}>
                    {sentence.incorrect}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Hint: {sentence.hint}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" gutterBottom>
                  Your Correction:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={correctedSentences[sentence.id] || ''}
                  onChange={(e) => handleCorrectionChange(sentence.id, e.target.value)}
                  placeholder="Write the corrected sentence here..."
                  variant="outlined"
                  disabled={showResults}
                  sx={{ mb: 1 }}
                />

                {showResults && (
                  <Alert severity={isCorrect ? "success" : "info"} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {isCorrect ? '✓ Correct!' : 'Correct version:'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {sentence.correct}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Results */}
      {showResults && (
        <Alert severity={SENTENCES.every(s => evaluateCorrection(correctedSentences[s.id] || '', s)) ? "success" : "warning"} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Correction Task Complete!
          </Typography>
          <Typography>
            You correctly fixed {SENTENCES.filter(s => evaluateCorrection(correctedSentences[s.id] || '', s)).length}/{SENTENCES.length} sentences
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {SENTENCES.every(s => evaluateCorrection(correctedSentences[s.id] || '', s))
              ? 'Perfect! You have mastered advanced grammar error identification and correction!'
              : 'Review the correct versions and practice identifying subject-verb agreement and other grammatical patterns.'}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allCompleted}
          >
            Submit Corrections
          </Button>
        )}
        {showResults && (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            View Results
          </Button>
        )}
      </Box>

      {!showResults && !allCompleted && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          Please correct all sentences before submitting
        </Typography>
      )}
    </Box>
  )
}
