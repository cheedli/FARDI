import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, Chip } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useProgressSave } from '../../../hooks/useProgressSave'

/**
 * Phase 4 Step 4 - Remedial C1 - Task A: Analysis Odyssey
 * Drag and drop 8 sentences to rebuild analytical paragraph
 * Score: +1 for each correctly placed sentence (8 total)
 * Wordwall-inspired drag & drop design
 */

const CORRECT_SENTENCES = [
  {
    id: 's1',
    text: 'Promotional advertising, as outlined in video 1, fundamentally aims to drive sales and brand recognition, yet its effectiveness hinges on the quality of execution.',
    position: 1
  },
  {
    id: 's2',
    text: 'Persuasive techniques—rooted in ethos, pathos, and logos—create a compelling case for the product without overt coercion, a balance the video illustrates effectively.',
    position: 2
  },
  {
    id: 's3',
    text: 'Targeted and personalized strategies enhance relevance by addressing specific audience needs, although they raise legitimate ethical concerns regarding data privacy.',
    position: 3
  },
  {
    id: 's4',
    text: 'Originality, combined with creativity, distinguishes advertisements in an oversaturated media landscape, ensuring memorability and emotional resonance.',
    position: 4
  },
  {
    id: 's5',
    text: 'Consistent messaging across platforms reinforces brand identity and trust, a principle video 1 repeatedly emphasizes.',
    position: 5
  },
  {
    id: 's6',
    text: 'Ethical advertising, by avoiding deception and respecting consumer autonomy, fosters long-term loyalty rather than short-term gains.',
    position: 6
  },
  {
    id: 's7',
    text: 'Dramatisation in video 2, through structured storytelling with clear goals and obstacles, exemplifies how narrative depth captivates viewers on an emotional level.',
    position: 7
  },
  {
    id: 's8',
    text: 'Ultimately, the integration of these principles—promotional intent, persuasive balance, ethical responsibility, and creative storytelling—determines whether an advertisement merely informs or truly persuades.',
    position: 8
  }
]

const DISTRACTOR_SENTENCES = [
  {
    id: 'd1',
    text: 'The poster is very nice and colorful.'
  },
  {
    id: 'd2',
    text: 'Video 1 talks about money and sales all the time.'
  },
  {
    id: 'd3',
    text: 'I like the music in the second video.'
  },
  {
    id: 'd4',
    text: 'Advertising is sometimes boring.'
  }
]

export default function RemedialC1TaskA() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_c1' })

  // Shuffle all sentences together
  const [availableSentences] = useState(() => {
    const allSentences = [...CORRECT_SENTENCES, ...DISTRACTOR_SENTENCES]
    return allSentences.sort(() => Math.random() - 0.5)
  })

  const [essayBoxes, setEssayBoxes] = useState(Array(8).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  // Calculate remaining sentences
  const usedSentenceIds = new Set(essayBoxes.filter(s => s).map(s => s.id))
  const remainingSentences = availableSentences.filter(s => !usedSentenceIds.has(s.id))

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    // Moving from available to essay box
    if (source.droppableId === 'available' && destination.droppableId.startsWith('box-')) {
      const boxIndex = parseInt(destination.droppableId.split('-')[1])

      // Find the actual sentence from remainingSentences (filtered list)
      const draggedSentence = remainingSentences[source.index]

      const newEssayBoxes = [...essayBoxes]

      // If box already has a sentence, we cannot replace it (each sentence used once)
      if (newEssayBoxes[boxIndex] !== null) {
        return // Don't allow replacing - each sentence can only be used once
      }

      newEssayBoxes[boxIndex] = draggedSentence
      setEssayBoxes(newEssayBoxes)
    }
    // Moving from essay box back to available or between boxes
    else if (source.droppableId.startsWith('box-')) {
      const sourceBoxIndex = parseInt(source.droppableId.split('-')[1])

      if (destination.droppableId === 'available') {
        // Remove from box (send back to available)
        const newEssayBoxes = [...essayBoxes]
        newEssayBoxes[sourceBoxIndex] = null
        setEssayBoxes(newEssayBoxes)
      } else if (destination.droppableId.startsWith('box-')) {
        // Move between boxes (swap)
        const destBoxIndex = parseInt(destination.droppableId.split('-')[1])
        const newEssayBoxes = [...essayBoxes]
        const temp = newEssayBoxes[sourceBoxIndex]
        newEssayBoxes[sourceBoxIndex] = newEssayBoxes[destBoxIndex]
        newEssayBoxes[destBoxIndex] = temp
        setEssayBoxes(newEssayBoxes)
      }
    }
  }

  const handleSubmit = async () => {
    let correctCount = 0
    let almostCorrect = 0

    essayBoxes.forEach((sentence, index) => {
      if (sentence && sentence.position === index + 1) {
        correctCount++
      } else if (sentence && CORRECT_SENTENCES.find(s => s.id === sentence.id)) {
        almostCorrect++
      }
    })

    setScore(correctCount)

    // Generate feedback
    if (correctCount === 8) {
      setFeedback('Excellent! You have reconstructed a coherent, sophisticated C1-level analytical paragraph. Notice the logical flow, advanced connectors, precise vocabulary, and balanced evaluation — this is autonomous descriptive/analytical writing at C1 standard.')
    } else if (correctCount >= 7 || (correctCount + almostCorrect >= 7)) {
      setFeedback('Very close! You captured most elements. Review the progression from general promotional purpose → specific techniques → ethical considerations → conclusion.')
    } else {
      setFeedback('Good effort. Remember: start broad (promotional aim), move to techniques (persuasive, targeted, etc.), include ethics and dramatisation, and end with a strong evaluative conclusion.')
    }

    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_c1_taskA_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: 'C1',
          task: 'A',
          step: 4,
          score: score,
          max_score: 8,
          completed: true
        })
      })
    } catch (error) {
      console.error('Failed to log task completion:', error)
    }
  }

  const handleContinue = () => {
    navigate('/phase4/step/4/remedial/c1/taskB')
  }

  const allFilled = essayBoxes.every(box => box !== null)

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header - Wordwall inspired (blue theme) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4 - Step 4: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level C1 - Task A: Analysis Odyssey 🗺️
        </Typography>
        <Typography variant="body1">
          Rebuild a sophisticated analytical paragraph by dragging the correct 8 sentences in order!
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="Welcome to the Analysis Odyssey! You have 12 sentences below (8 correct + 4 distractors). Drag ONLY the 8 correct sentences into the numbered boxes to rebuild a coherent C1-level analytical paragraph. Pay attention to logical progression, cohesive devices (however, ultimately), and advanced vocabulary!"
        />
      </Paper>

      {!submitted ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Box>
            {/* Side by Side Layout */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              {/* LEFT: Available Sentences */}
              <Paper sx={{ p: 3, backgroundColor: '#fff9e6', flex: 1 }}>
                <Typography variant="h6" gutterBottom color="warning.dark" fontWeight="bold">
                  📚 Available Sentences
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Drag from here → (includes 4 distractors!)
                </Typography>

                <Droppable droppableId="available">
                  {(provided, snapshot) => (
                    <Stack
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      spacing={2}
                      sx={{
                        minHeight: 600,
                        p: 2,
                        backgroundColor: snapshot.isDraggingOver ? '#fff3cd' : 'transparent',
                        borderRadius: 1
                      }}
                    >
                      {remainingSentences.map((sentence, index) => (
                        <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                          {(provided, snapshot) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                cursor: 'grab',
                                backgroundColor: snapshot.isDragging ? '#fff3cd' : '#fffbf0',
                                border: '1px solid',
                                borderColor: 'warning.light',
                                '&:hover': {
                                  backgroundColor: '#fff9e6',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s'
                                }
                              }}
                            >
                              <Typography variant="body2">{sentence.text}</Typography>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </Paper>

              {/* RIGHT: Essay Construction Area */}
              <Paper sx={{ p: 3, backgroundColor: '#f0f4f8', flex: 1 }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  📝 Essay Construction Area
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Drop sentences in order (1-8)
                </Typography>

                <Stack spacing={2}>
                  {essayBoxes.map((sentence, index) => (
                  <Droppable key={`box-${index}`} droppableId={`box-${index}`}>
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          p: 2,
                          minHeight: 80,
                          backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'white',
                          border: '2px dashed',
                          borderColor: sentence ? 'success.main' : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Chip
                          label={index + 1}
                          color="primary"
                          sx={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: 40 }}
                        />
                        {sentence ? (
                          <Draggable draggableId={sentence.id} index={0}>
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  p: 1.5,
                                  backgroundColor: '#e8f5e9',
                                  borderRadius: 1,
                                  flex: 1,
                                  cursor: 'grab'
                                }}
                              >
                                <Typography variant="body1">{sentence.text}</Typography>
                              </Box>
                            )}
                          </Draggable>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Drop sentence {index + 1} here...
                          </Typography>
                        )}
                        {provided.placeholder}
                      </Paper>
                    )}
                  </Droppable>
                ))}
                </Stack>
              </Paper>
            </Stack>

            {/* Submit Button */}
            <Stack direction="row" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!allFilled}
                sx={{
                  background: allFilled ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : undefined,
                  minWidth: 200
                }}
              >
                {allFilled ? 'Submit Analysis 🗺️' : 'Fill All Boxes First'}
              </Button>
            </Stack>
          </Box>
        </DragDropContext>
      ) : (
        <Box>
          {/* Results */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              mb: 3,
              textAlign: 'center',
              backgroundColor: score === 8 ? 'success.light' : score >= 6 ? 'warning.light' : 'error.light'
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold" color={score === 8 ? 'success.dark' : 'warning.dark'}>
              {score === 8 ? '🗺️ Perfect Analysis! 🗺️' : score >= 6 ? '🌟 Good Effort! 🌟' : '📚 Keep Practicing! 📚'}
            </Typography>
            <Typography variant="h6" color="text.primary">
              You scored {score} out of 8 points!
            </Typography>
          </Paper>

          {/* Feedback */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Feedback:
            </Typography>
            <Alert severity={score === 8 ? 'success' : score >= 6 ? 'info' : 'warning'}>
              <Typography variant="body1">{feedback}</Typography>
            </Alert>
          </Paper>

          {/* Correct Order Display */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Correct Paragraph Order:
            </Typography>
            <Stack spacing={2}>
              {CORRECT_SENTENCES.map((sentence, index) => {
                const userSentence = essayBoxes[index]
                const isCorrect = userSentence && userSentence.id === sentence.id

                return (
                  <Paper
                    key={sentence.id}
                    sx={{
                      p: 2,
                      backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
                      border: '2px solid',
                      borderColor: isCorrect ? 'success.main' : 'error.main'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Chip
                        label={index + 1}
                        color={isCorrect ? 'success' : 'error'}
                        sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                      />
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {sentence.text}
                        </Typography>
                        {!isCorrect && userSentence && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            Your answer: "{userSentence.text}"
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              size="large"
            >
              Continue to Task B →
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
