import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Container, useTheme } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useProgressSave } from '../../../hooks/useProgressSave'
import { motion } from 'framer-motion'

/**
 * Phase 4 Step 4 - Remedial C1 - Task A: Analysis Odyssey
 * Drag and drop 8 sentences to rebuild analytical paragraph
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

const CORRECT_SENTENCES = [
  { id: 's1', text: 'Promotional advertising, as outlined in video 1, fundamentally aims to drive sales and brand recognition, yet its effectiveness hinges on the quality of execution.', position: 1 },
  { id: 's2', text: 'Persuasive techniques—rooted in ethos, pathos, and logos—create a compelling case for the product without overt coercion, a balance the video illustrates effectively.', position: 2 },
  { id: 's3', text: 'Targeted and personalized strategies enhance relevance by addressing specific audience needs, although they raise legitimate ethical concerns regarding data privacy.', position: 3 },
  { id: 's4', text: 'Originality, combined with creativity, distinguishes advertisements in an oversaturated media landscape, ensuring memorability and emotional resonance.', position: 4 },
  { id: 's5', text: 'Consistent messaging across platforms reinforces brand identity and trust, a principle video 1 repeatedly emphasizes.', position: 5 },
  { id: 's6', text: 'Ethical advertising, by avoiding deception and respecting consumer autonomy, fosters long-term loyalty rather than short-term gains.', position: 6 },
  { id: 's7', text: 'Dramatisation in video 2, through structured storytelling with clear goals and obstacles, exemplifies how narrative depth captivates viewers on an emotional level.', position: 7 },
  { id: 's8', text: 'Ultimately, the integration of these principles—promotional intent, persuasive balance, ethical responsibility, and creative storytelling—determines whether an advertisement merely informs or truly persuades.', position: 8 },
]

const DISTRACTOR_SENTENCES = [
  { id: 'd1', text: 'The poster is very nice and colorful.' },
  { id: 'd2', text: 'Video 1 talks about money and sales all the time.' },
  { id: 'd3', text: 'I like the music in the second video.' },
  { id: 'd4', text: 'Advertising is sometimes boring.' },
]

export default function RemedialC1TaskA() {
  const navigate = useNavigate()
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 4, interaction: 1, context: 'remedial_c1' })

  const [availableSentences] = useState(() => {
    const all = [...CORRECT_SENTENCES, ...DISTRACTOR_SENTENCES]
    return all.sort(() => Math.random() - 0.5)
  })

  const [essayBoxes, setEssayBoxes] = useState(Array(8).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const usedIds = new Set(essayBoxes.filter(Boolean).map(s => s.id))
  const remainingSentences = availableSentences.filter(s => !usedIds.has(s.id))

  const onDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId === 'available' && destination.droppableId.startsWith('box-')) {
      const boxIndex = parseInt(destination.droppableId.split('-')[1])
      if (essayBoxes[boxIndex] !== null) return
      const dragged = remainingSentences[source.index]
      const newBoxes = [...essayBoxes]
      newBoxes[boxIndex] = dragged
      setEssayBoxes(newBoxes)
    } else if (source.droppableId.startsWith('box-')) {
      const srcIdx = parseInt(source.droppableId.split('-')[1])
      if (destination.droppableId === 'available') {
        const newBoxes = [...essayBoxes]; newBoxes[srcIdx] = null; setEssayBoxes(newBoxes)
      } else if (destination.droppableId.startsWith('box-')) {
        const destIdx = parseInt(destination.droppableId.split('-')[1])
        const newBoxes = [...essayBoxes]
        const temp = newBoxes[srcIdx]; newBoxes[srcIdx] = newBoxes[destIdx]; newBoxes[destIdx] = temp
        setEssayBoxes(newBoxes)
      }
    }
  }

  const handleSubmit = async () => {
    let correctCount = 0; let almostCorrect = 0
    essayBoxes.forEach((sentence, index) => {
      if (sentence && sentence.position === index + 1) correctCount++
      else if (sentence && CORRECT_SENTENCES.find(s => s.id === sentence.id)) almostCorrect++
    })
    setScore(correctCount)
    if (correctCount === 8) setFeedback('Excellent! You reconstructed a coherent C1-level analytical paragraph. Notice logical flow, advanced connectors, precise vocabulary, and balanced evaluation.')
    else if (correctCount >= 7 || correctCount + almostCorrect >= 7) setFeedback('Very close! Review the progression: general promotional purpose → specific techniques → ethical considerations → conclusion.')
    else setFeedback('Good effort. Start broad (promotional aim), move to techniques, include ethics and dramatisation, end with an evaluative conclusion.')
    setSubmitted(true)
    sessionStorage.setItem('remedial_step4_c1_taskA_score', correctCount)
    await logTaskCompletion(correctCount)
  }

  const logTaskCompletion = async (score) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskA', is_correct: true, score })
    try { await fetch('/api/phase4/remedial/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ level: 'C1', task: 'A', step: 4, score, max_score: 8, completed: true }) }) } catch (e) { console.error(e) }
  }

  const handleContinue = () => navigate('/phase4/step/4/remedial/c1/taskB')
  const allFilled = essayBoxes.every(box => box !== null)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: P.orange.shadow }}>Phase 4 - Step 4: Remedial Activities</Typography>
            <Typography variant="h6" sx={{ color: P.orange.border }}>Level C1 - Task A: Analysis Odyssey 🗺️</Typography>
            <Typography variant="body2" sx={{ color: P.orange.shadow, mt: 0.5 }}>Rebuild a sophisticated analytical paragraph by dragging the correct 8 sentences in order!</Typography>
          </Box>

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
            <CharacterMessage character="MS. MABROUKI" message="Welcome to the Analysis Odyssey! You have 12 sentences (8 correct + 4 distractors). Drag ONLY the 8 correct sentences into the numbered boxes to rebuild a coherent C1-level analytical paragraph. Pay attention to logical progression, cohesive devices, and advanced vocabulary!" />
          </Box>

          {!submitted ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                {/* Available Sentences */}
                <Box sx={{ flex: 1, bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.yellow.shadow}`, p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.yellow.shadow, mb: 0.5 }}>📚 Available Sentences</Typography>
                  <Typography variant="body2" sx={{ color: P.yellow.shadow, mb: 2 }}>Drag from here → (includes 4 distractors!)</Typography>
                  <Droppable droppableId="available">
                    {(provided, snapshot) => (
                      <Stack ref={provided.innerRef} {...provided.droppableProps} spacing={2} sx={{ minHeight: 500, p: 1, bgcolor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent', borderRadius: '12px' }}>
                        {remainingSentences.map((sentence, index) => (
                          <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                            {(provided, snapshot) => (
                              <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                sx={{ bgcolor: snapshot.isDragging ? P.yellow.border : P.pageBg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', p: 2, cursor: 'grab', boxShadow: snapshot.isDragging ? `4px 4px 0 ${P.yellow.shadow}` : `2px 2px 0 ${P.yellow.shadow}` }}>
                                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>{sentence.text}</Typography>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Stack>
                    )}
                  </Droppable>
                </Box>

                {/* Essay Construction */}
                <Box sx={{ flex: 1, bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`, p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: P.purple.shadow, mb: 0.5 }}>📝 Essay Construction Area</Typography>
                  <Typography variant="body2" sx={{ color: P.purple.shadow, mb: 2 }}>Drop sentences in order (1-8)</Typography>
                  <Stack spacing={2}>
                    {essayBoxes.map((sentence, index) => (
                      <Droppable key={`box-${index}`} droppableId={`box-${index}`}>
                        {(provided, snapshot) => (
                          <Box ref={provided.innerRef} {...provided.droppableProps}
                            sx={{ minHeight: 60, bgcolor: snapshot.isDraggingOver ? P.teal.bg : (sentence ? P.green.bg : P.pageBg), border: `2px ${sentence ? 'solid' : 'dashed'} ${sentence ? P.green.border : P.purple.border}`, borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ bgcolor: P.purple.border, borderRadius: '8px', px: 1.5, py: 0.5, minWidth: 32, textAlign: 'center' }}>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff' }}>{index + 1}</Typography>
                            </Box>
                            {sentence ? (
                              <Draggable draggableId={sentence.id} index={0}>
                                {(provided) => (
                                  <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ flex: 1, cursor: 'grab' }}>
                                    <Typography variant="body2" sx={{ color: P.green.shadow }}>{sentence.text}</Typography>
                                  </Box>
                                )}
                              </Draggable>
                            ) : (
                              <Typography variant="body2" sx={{ color: P.purple.border, fontStyle: 'italic' }}>Drop sentence {index + 1} here...</Typography>
                            )}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    ))}
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="center">
                <Box component="button" onClick={handleSubmit} disabled={!allFilled} sx={{ bgcolor: allFilled ? P.blue.bg : P.yellow.bg, border: `2px solid ${allFilled ? P.blue.border : P.yellow.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${allFilled ? P.blue.shadow : P.yellow.shadow}`, px: 4, py: 1.5, cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold', color: allFilled ? P.blue.shadow : P.yellow.shadow, opacity: allFilled ? 1 : 0.6 }}>
                  {allFilled ? 'Submit Analysis 🗺️' : 'Fill All Boxes First'}
                </Box>
              </Stack>
            </DragDropContext>
          ) : (
            <Box>
              <Box sx={{ bgcolor: score === 8 ? P.green.bg : score >= 6 ? P.yellow.bg : P.orange.bg, border: `2px solid ${score === 8 ? P.green.border : score >= 6 ? P.yellow.border : P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${score === 8 ? P.green.shadow : score >= 6 ? P.yellow.shadow : P.orange.shadow}`, p: 4, textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: score === 8 ? P.green.shadow : P.yellow.shadow }}>{score === 8 ? '🗺️ Perfect Analysis! 🗺️' : score >= 6 ? '🌟 Good Effort! 🌟' : '📚 Keep Practicing! 📚'}</Typography>
                <Typography variant="h6" sx={{ color: score === 8 ? P.green.shadow : P.yellow.shadow }}>You scored {score} out of 8 points!</Typography>
              </Box>

              <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: P.teal.shadow, mb: 1 }}>Feedback:</Typography>
                <Typography variant="body1" sx={{ color: P.teal.shadow }}>{feedback}</Typography>
              </Box>

              <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: P.blue.shadow }}>Correct Paragraph Order:</Typography>
                <Stack spacing={2}>
                  {CORRECT_SENTENCES.map((sentence, index) => {
                    const userSentence = essayBoxes[index]
                    const isCorrect = userSentence && userSentence.id === sentence.id
                    return (
                      <Box key={sentence.id} sx={{ bgcolor: isCorrect ? P.green.bg : P.yellow.bg, border: `2px solid ${isCorrect ? P.green.border : P.yellow.border}`, borderRadius: '12px', p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box sx={{ bgcolor: isCorrect ? P.green.border : P.yellow.border, borderRadius: '8px', px: 1.5, py: 0.5, minWidth: 32, textAlign: 'center' }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff' }}>{index + 1}</Typography>
                          </Box>
                          <Box flex={1}>
                            <Typography variant="body2" sx={{ color: isCorrect ? P.green.shadow : P.yellow.shadow }}>{sentence.text}</Typography>
                            {!isCorrect && userSentence && (
                              <Typography variant="body2" sx={{ mt: 1, color: P.red.border }}>Your answer: "{userSentence.text}"</Typography>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Box component="button" onClick={handleContinue} sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '16px', boxShadow: `4px 4px 0 ${P.green.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: P.green.shadow, '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.green.shadow}` } }}>Continue to Task B →</Box>
              </Stack>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}
