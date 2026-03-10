import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import GapFillStory from '../../../components/GapFillStory.jsx'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 3 - Remedial A2 - Task A: Dialogue Adventure
 * Complete dialogue explaining video terms (8 blanks)
 * Score: +1 for each correct word (8 total)
 */

const WORD_BANK = [
  'promotional',
  'sell',
  'persuasive',
  'convince',
  'targeted',
  'group',
  'original',
  'new'
]

const DIALOGUE_SENTENCES = [
  'Lilia: What is promotional?',
  'You: _______ is to _______.',
  'Ms. Mabrouki: Persuasive?',
  'You: _______ is to _______.',
  'You: _______ for _______.',
  'You: _______ is _______ idea.'
]

// Define correct answers for each blank (in order)
const CORRECT_ANSWERS = [
  'promotional', 'sell',        // Line 1 (You): Promotional is to sell
  'persuasive', 'convince',     // Line 3 (You): Persuasive is to convince
  'targeted', 'group',          // Line 4 (You): Targeted for group
  'original', 'new'             // Line 5 (You): Original is new idea
]

export default function RemedialA2TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 3, interaction: 1, context: 'remedial_a2' })
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateScore = () => {
    let correctCount = 0
    let answerIndex = 0

    DIALOGUE_SENTENCES.forEach((sentence, sentenceIndex) => {
      // Count blanks in this sentence
      const blankCount = (sentence.match(/_______/g) || []).length

      // Check each blank in this sentence
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        const userAnswer = answers[key]?.toLowerCase().trim()
        const correctAnswer = CORRECT_ANSWERS[answerIndex]?.toLowerCase()

        if (userAnswer === correctAnswer) {
          correctCount++
        }
        answerIndex++
      }
    })

    return correctCount
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setSubmitted(true)

    // Store result
    sessionStorage.setItem('remedial_step3_a2_taskA_score', finalScore)

    // Log to backend
    await logTaskCompletion(finalScore)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      const response = await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          level: 'A2',
          task: 'A',
          step: 2,
          score: score,
          max_score: 8,
          completed: true
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 3 Task A completion logged to backend')
      }
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step3/remedial/a2/taskB')
  }

  // Check if all blanks are filled
  const allFilled = (() => {
    let blankIndex = 0
    return DIALOGUE_SENTENCES.every((sentence, sentenceIndex) => {
      const blankCount = (sentence.match(/_______/g) || []).length
      for (let i = 0; i < blankCount; i++) {
        const key = `g_${sentenceIndex}_${i}`
        if (!answers[key]) {
          return false
        }
        blankIndex++
      }
      return true
    })
  })()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4 - Step 3: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level A2 - Task A: Dialogue Adventure 🗣️
        </Typography>
        <Typography variant="body1">
          Complete the dialogue to adventure through the story! Fill in the blanks to help explain video terms.
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Dialogue Adventure! You're having a conversation about video terms with Lilia and me. Fill in the blanks using the word bank below. Click a word from the Word Bank, then click the blank space where it belongs. 🗣️"
        />
      </Paper>

      {/* Gap Fill Game */}
      {!submitted && (
        <Box>
          <GapFillStory
            templates={DIALOGUE_SENTENCES}
            wordBank={WORD_BANK}
            answers={answers}
            onChange={handleAnswerChange}
          />
        </Box>
      )}

      {/* Submit Button */}
      {!submitted && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="large"
            disabled={!allFilled}
          >
            {allFilled ? 'Submit Dialogue' : 'Fill All Gaps First'}
          </Button>
        </Stack>
      )}

      {/* Results */}
      {submitted && (
        <Box>
          <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: 'success.light' }}>
            <Typography variant="h4" gutterBottom color="success.dark">
              {score === 8 ? '🎉 Perfect Adventure! 🎉' : '🌟 Good Work! 🌟'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 8 points!
            </Typography>
          </Paper>

          {/* Show which answers were correct */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dialogue Review:
            </Typography>
            <Stack spacing={2}>
              {DIALOGUE_SENTENCES.map((sentence, sentenceIndex) => {
                const blankCount = (sentence.match(/_______/g) || []).length

                if (blankCount === 0) {
                  // No blanks - just show the sentence
                  return (
                    <Paper key={sentenceIndex} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Typography variant="body1">
                        {sentence}
                      </Typography>
                    </Paper>
                  )
                }

                // Calculate which global answer index this sentence starts at
                let answerStartIndex = 0
                for (let i = 0; i < sentenceIndex; i++) {
                  answerStartIndex += (DIALOGUE_SENTENCES[i].match(/_______/g) || []).length
                }

                // Build the sentence with filled blanks
                let displaySentence = sentence
                let allCorrect = true

                for (let i = 0; i < blankCount; i++) {
                  const key = `g_${sentenceIndex}_${i}`
                  const userAnswer = answers[key]?.trim() || '(empty)'
                  const correctAnswer = CORRECT_ANSWERS[answerStartIndex + i]
                  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()

                  if (!isCorrect) allCorrect = false

                  // Replace first occurrence of blank with user answer
                  displaySentence = displaySentence.replace('_______', `"${userAnswer}"`)
                }

                return (
                  <Alert
                    key={sentenceIndex}
                    severity={allCorrect ? 'success' : 'error'}
                    icon={allCorrect ? '✅' : '❌'}
                  >
                    <Typography variant="body2">
                      {displaySentence}
                    </Typography>
                    {!allCorrect && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {blankCount === 1 ? (
                          <>Correct: <strong>{CORRECT_ANSWERS[answerStartIndex]}</strong></>
                        ) : (
                          <>Correct: <strong>{CORRECT_ANSWERS.slice(answerStartIndex, answerStartIndex + blankCount).join(', ')}</strong></>
                        )}
                      </Typography>
                    )}
                  </Alert>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Next: Expand Empire →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
