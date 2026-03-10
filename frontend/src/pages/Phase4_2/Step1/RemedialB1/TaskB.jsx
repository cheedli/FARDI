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
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useProgressSave } from '../../../../hooks/useProgressSave'

/**
 * Phase 4.2 - Level B1 - Task B: Writing Proposals
 * Write 8 sentences proposing social media elements with reasons
 */

const PROMPTS = [
  'Propose using a hashtag and explain why',
  'Propose adding emojis and give a reason',
  'Propose creating a caption and explain the benefit',
  'Propose tagging someone and say why it helps',
  'Propose using a call-to-action and justify it',
  'Propose going viral and explain how',
  'Propose sharing content and give a reason',
  'Propose creating a story and explain why'
]

export default function Phase4_2RemedialB1TaskB() {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 1, interaction: 2, context: 'remedial_b1' })
  const [proposals, setProposals] = useState(Array(8).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleInputChange = (index, value) => {
    const newProposals = [...proposals]
    newProposals[index] = value
    setProposals(newProposals)
  }

  const evaluateProposal = (text) => {
    // Check if sentence has:
    // 1. At least 8 words
    // 2. Contains proposal language (should, could, propose, suggest, recommend, etc.)
    // 3. Contains reasoning (because, since, so that, to, for, etc.)

    const words = text.trim().split(/\s+/)
    if (words.length < 8) return false

    const proposalWords = /\b(should|could|propose|suggest|recommend|would|might|can|we need|let's|why not)\b/i
    const reasoningWords = /\b(because|since|so that|to|for|as|that way|this will|in order to)\b/i

    return proposalWords.test(text) && reasoningWords.test(text)
  }

  const handleSubmit = () => {
    let correctCount = 0
    proposals.forEach(proposal => {
      if (evaluateProposal(proposal)) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)

    const scoreOutOf10 = (correctCount / PROMPTS.length) * 10
    sessionStorage.setItem('phase4_2_remedial_b1_taskB_score', scoreOutOf10.toFixed(1))
    sessionStorage.setItem('phase4_2_remedial_b1_taskB_max', '10')

    logTaskCompletion(correctCount, PROMPTS.length)
  }

  const logTaskCompletion = async (score, maxScore) => {
    saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: 'TaskB', is_correct: true, score: score })
    try {
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'B1',
          task: 'B',
          score: score,
          max_score: maxScore,
          time_taken: 0
        })
      })
    } catch (error) {
      console.error('Failed to log task:', error)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/1/remedial/b1/taskC')
  }

  const allFilled = proposals.every(proposal => proposal.trim().length >= 8)

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h5" gutterBottom>
          Phase 4.2 - Remedial Practice
        </Typography>
        <Typography variant="h6">
          Level B1 - Task B: Writing Proposals
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Write professional proposals for social media elements. Each sentence should make a suggestion and explain WHY it's a good idea!"
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="body1">
          <strong>Instructions:</strong> Write 8 complete sentences. Each should propose something AND give a reason.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Example:</strong> "We should use #SocialMedia because it will help more people find our post."
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Evaluation:</strong> Each sentence must have 8+ words, a proposal, and a reason.
        </Typography>
      </Paper>

      <Card elevation={2} sx={{ mb: 3, backgroundColor: 'warning.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.dark">
            Helpful Words:
          </Typography>
          <Typography variant="body2">
            <strong>Proposals:</strong> should, could, propose, suggest, recommend, we need to, let's
          </Typography>
          <Typography variant="body2">
            <strong>Reasons:</strong> because, since, so that, to, for, this will, in order to
          </Typography>
        </CardContent>
      </Card>

      <List sx={{ mb: 3 }}>
        {PROMPTS.map((prompt, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 2 }}>
            <Paper elevation={2} sx={{ p: 2, width: '100%' }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {index + 1}. {prompt}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write your proposal with a reason (8+ words)..."
                value={proposals[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={showResults}
                sx={{
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: showResults
                      ? (evaluateProposal(proposals[index])
                        ? 'success.lighter'
                        : 'error.lighter')
                      : 'white'
                  }
                }}
              />
              {showResults && !evaluateProposal(proposals[index]) && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  This proposal needs improvement. Make sure it has a suggestion word and a reason word, with at least 8 words total.
                </Alert>
              )}
              {showResults && evaluateProposal(proposals[index]) && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Great proposal!
                </Alert>
              )}
            </Paper>
          </ListItem>
        ))}
      </List>

      {showResults && (
        <Alert severity={score === PROMPTS.length ? "success" : "info"} sx={{ mb: 3 }}>
          {score === PROMPTS.length ? (
            <Typography>Excellent! All {PROMPTS.length} proposals are well-written!</Typography>
          ) : (
            <Typography>
              You wrote {score}/{PROMPTS.length} acceptable proposals.
              {score < PROMPTS.length && ' Review the feedback above to improve your proposals.'}
            </Typography>
          )}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!showResults && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!allFilled}
          >
            Submit Proposals
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
            Continue to Task C
          </Button>
        )}
      </Box>
    </Box>
  )
}
