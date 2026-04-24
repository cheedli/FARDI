import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'
import { requestPhase42StepScore } from '../shared/routing.js'

// Target words for Phase 4.2 - Social Media vocabulary
const TARGET_WORDS = [
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'tag',
  'story',
  'call-to-action'
]

function Phase4_2Step4Interaction3() {
  const navigate = useNavigate()
  useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/4/remedial/a2/taskA') }, [])
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
  const P = isDark ? DARK : LIGHT

  const [gameResult, setGameResult] = useState(null)
  const [spelledTerm, setSpelledTerm] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [originalPosts, setOriginalPosts] = useState({ instagram: '', twitter: '' })
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const instagramCaption = sessionStorage.getItem('phase4_2_step4_instagram_caption') || ''
    const twitterThread = JSON.parse(sessionStorage.getItem('phase4_2_step4_twitter_thread') || '[]')
    setOriginalPosts({
      instagram: instagramCaption,
      twitter: twitterThread.join(' ')
    })
  }, [])

  const handleGameComplete = (result) => {
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)

    const foundWordsCount = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase4_2_step4_int3_sushi_score', foundWordsCount)
    sessionStorage.setItem('phase4_2_step4_int3_sushi_time', timeElapsed)
    sessionStorage.setItem('phase4_2_step4_int3_sushi_words', JSON.stringify(result.foundWords || []))

    logGameCompletion(foundWordsCount, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (foundWordsCount, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step: 4,
          interaction: 3,
          score: foundWordsCount,
          max_score: TARGET_WORDS.length,
          time_taken: timeElapsed,
          found_words: foundWords,
          completed: true,
          game_type: 'sushi_spell'
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 3 (Sushi Spell) logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleSubmit = async () => {
    if (!spelledTerm.trim() || !revisedSentence.trim()) {
      setFeedback('Please enter the term you spelled and your revised sentence.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step4/evaluate-vocabulary-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spelled_term: spelledTerm,
          revised_sentence: revisedSentence,
          original_instagram: originalPosts.instagram,
          original_twitter: originalPosts.twitter
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        sessionStorage.setItem('phase4_2_step4_int3_score', data.score.toString())
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')
        const totalScore = currentScore + data.score
        sessionStorage.setItem('phase4_2_step4_score', totalScore.toString())

        await fetch('/api/phase4/4_2/interaction/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase: '4_2',
            step: '4',
            interaction: 'vocabulary_revision_complete',
            data: {
              total_score: totalScore,
              spelled_term: spelledTerm
            }
          })
        })
      } else {
        setFeedback(data.error || 'Evaluation failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    const int1Score = parseInt(sessionStorage.getItem('phase4_2_step4_int1_score') || '0')
    const int2Score = parseInt(sessionStorage.getItem('phase4_2_step4_int2_score') || '0')
    const int3Score = parseInt(sessionStorage.getItem('phase4_2_step4_int3_score') || '0')

    try {
      const data = await requestPhase42StepScore(4, {
        interaction1_score: int1Score,
        interaction2_score: int2Score,
        interaction3_score: int3Score,
      })
      sessionStorage.setItem('phase4_2_step4_total_score', data.total.score.toString())
      sessionStorage.setItem('phase4_2_step4_total_max', data.total.max_score.toString())
      sessionStorage.setItem('phase4_2_step4_next_url', data.total.next_url)
      sessionStorage.setItem('phase4_2_step4_remedial_level', data.total.remedial_level)
      navigate(data.total.next_url)
    } catch (error) {
      console.error('Failed to calculate Phase 4.2 Step 4 routing:', error)
      alert('Unable to calculate the next route right now. Please try again.')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <Box sx={{
            bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`,
            p: 3, mb: 3, textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: P.blue.shadow }}>
              Interaction 3: Polish Your Writing
            </Typography>
          </Box>

          <CharacterMessage
            character="Ryan"
            message="To polish your writing, play a game and integrate terms."
          />

          {/* Previous Posts */}
          <Box sx={{
            bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.teal.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.teal.shadow }}>
              Your Previous Posts
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 1 }}>
                Instagram Caption:
              </Typography>
              <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 2, border: `1px solid ${P.teal.border}` }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {originalPosts.instagram || 'No Instagram post yet'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.teal.shadow, mb: 1 }}>
                Twitter Thread:
              </Typography>
              <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 2, border: `1px solid ${P.teal.border}` }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {originalPosts.twitter || 'No Twitter thread yet'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{
            bgcolor: P.purple.bg, border: `2px solid ${P.purple.border}`,
            borderRadius: '20px', boxShadow: `4px 4px 0 ${P.purple.shadow}`,
            p: 3, mb: 3,
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: P.purple.shadow, mb: 1 }}>
              How to Play:
            </Typography>
            <Stack spacing={1}>
              {[
                'Click letters as they fall to spell words',
                'Think of words related to social media: hashtag, caption, viral, engagement, emoji, tag, story, call-to-action',
                'Longer words give more points!',
                'Click "Submit Word" when you\'re ready to check your spelling',
              ].map((tip, i) => (
                <Typography key={i} variant="body2" sx={{ color: P.purple.shadow }}>• {tip}</Typography>
              ))}
            </Stack>
          </Box>

          {/* Hint */}
          {!gameResult && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="body2" sx={{ color: P.green.shadow }}>
                <strong>Hint:</strong> Try longer words like "call-to-action" or "engagement" for higher scores.
              </Typography>
            </Box>
          )}

          {/* Sushi Spell Game */}
          <Box sx={{ mb: 4 }}>
            <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
          </Box>

          {/* Game Results Display */}
          {gameResult && (
            <Box sx={{
              bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.green.shadow}`,
              p: 4, mb: 3,
            }}>
              <Typography variant="h4" sx={{ textAlign: 'center', color: P.green.shadow, fontWeight: 'bold', mb: 3 }}>
                Game Complete!
              </Typography>

              <Typography variant="h5" sx={{ textAlign: 'center', color: P.green.shadow, mb: 2 }}>
                Your Performance
              </Typography>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: P.green.shadow }}>
                  {gameResult.foundWords?.length || 0}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Words Found
                </Typography>
              </Box>

              {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2, color: P.green.shadow }}>
                    Words You Spelled:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                    {gameResult.foundWords.map((word, index) => (
                      <Box key={index} component="span" sx={{
                        bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                        borderRadius: '999px', px: 2, py: 0.5,
                        fontSize: '0.85rem', fontWeight: 700, color: P.green.shadow,
                        display: 'inline-block', mb: 1,
                      }}>{word}</Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {gameResult.foundWords && gameResult.foundWords.length >= 5 && (
                <Typography variant="h6" sx={{ textAlign: 'center', color: P.green.shadow, mt: 2 }}>
                  Excellent spelling skills!
                </Typography>
              )}
            </Box>
          )}

          {/* Revision Task */}
          {gameResult && (
            <Box sx={{
              bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
              borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: P.orange.shadow }}>
                Revision Task
              </Typography>

              <Box sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px', p: 2, mb: 3,
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: P.yellow.shadow }}>
                  Hint: "Sushi Spell for 'call-to-action' because... then add to your post."
                </Typography>
                <Typography variant="body2" sx={{ color: P.yellow.shadow }}>
                  Use a spelled term in a revised sentence, fixing any grammar/spelling/structure mistakes.
                </Typography>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                label="Which term did you spell?"
                placeholder="hashtag, caption, call-to-action, engagement, or viral"
                value={spelledTerm}
                onChange={(e) => setSpelledTerm(e.target.value)}
                disabled={submitted}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Revise one sentence using the spelled term (fix any mistakes)"
                placeholder="Original: Tag friends viral&#10;Revised: Tag friends to help make this post go viral"
                value={revisedSentence}
                onChange={(e) => setRevisedSentence(e.target.value)}
                disabled={submitted}
                helperText="Show how you detected and corrected errors in grammar, spelling, or structure"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={loading || submitted || !spelledTerm.trim() || !revisedSentence.trim()}
                  sx={{
                    bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                    borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                    px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                    cursor: loading || submitted || !spelledTerm.trim() || !revisedSentence.trim() ? 'not-allowed' : 'pointer',
                    color: P.orange.shadow,
                    opacity: loading || submitted || !spelledTerm.trim() || !revisedSentence.trim() ? 0.5 : 1,
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                    '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Revision'}
                </Box>
              </Box>
            </Box>
          )}

          {feedback && (
            <Box sx={{
              bgcolor: score >= 4 ? P.green.bg : P.yellow.bg,
              border: `2px solid ${score >= 4 ? P.green.border : P.yellow.border}`,
              borderRadius: '20px',
              boxShadow: `4px 4px 0 ${score >= 4 ? P.green.shadow : P.yellow.shadow}`,
              p: 3, mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 4 ? P.green.shadow : P.yellow.shadow, mb: 1 }}>
                Evaluation Results
              </Typography>
              <Typography variant="body1" paragraph><strong>Score:</strong> {score}/5 points</Typography>
              <Typography variant="body1" paragraph><strong>CEFR Level:</strong> {level}</Typography>
              <Typography variant="body1" paragraph><strong>Feedback:</strong> {feedback}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                Total Step 4 Score: {parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')}/15 points
              </Typography>
            </Box>
          )}

          {submitted && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box
                component="button"
                onClick={handleFinish}
                sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 6, py: 2, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` },
                }}
              >
                Complete Step 4 - Return to Dashboard
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>
    </Box>
  )
}

export default Phase4_2Step4Interaction3
