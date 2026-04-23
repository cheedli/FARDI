import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'
import { requestPhase42TaskBScore } from '../../shared/routing.js'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 2, context: 'remedial_b2' });

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

  const [rewrittenPost, setRewrittenPost] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const faultyPost = `Festival is happening next week very good time
Come and enjoy lot of things we having
Music food dance all available in event
Tag friend who like this kind of thing
Post your photo with hashteg of event
We doing this for make people happy always
Very amazing festival you coming please
Share everyone who you knowing right now`;

  const handleSubmit = async () => {
    try {
      const data = await requestPhase42TaskBScore(5, 'B2', {
        text: rewrittenPost,
        faulty_post: faultyPost,
        criteria: 'rewrite the faulty social media post with correct grammar, coherence, and stronger promotional language',
      })

      setScore(data.score)
      setSubmitted(true)
      sessionStorage.setItem('phase4_2_step5_remedialB2_taskB', data.score.toString())
      saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: rewrittenPost, is_correct: true, score: data.score })
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 5, level: 'B2', task: 'B', score: data.score, max_score: 10, content: rewrittenPost })
      })
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('Evaluation failed. Please try again.')
    }
  };

  const handleNext = () => navigate('/phase4_2/step/5/remedial/b2/task/c');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message="Time for the Analysis Odyssey! You'll see a faulty 8-sentence social media post. Your job is to completely rewrite it with correct grammar, coherent structure, appropriate vocabulary, and an engaging tone. This is your chance to show your skills!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Task B: Analysis Odyssey
            </Typography>
            <Typography variant="body1" paragraph>Fully correct and rewrite this faulty social media post:</Typography>

            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '16px', p: 3, mb: 3, whiteSpace: 'pre-line' }}>
              <Typography variant="subtitle1" sx={{ color: P.red.shadow, mb: 2, fontWeight: 'bold' }}>Faulty Post:</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{faultyPost}</Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}><strong>Focus on:</strong></Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>Correct grammar (articles, verb forms, prepositions)</li>
              <li>Coherent structure (connectors, logical flow)</li>
              <li>Appropriate vocabulary (avoid repetition, use varied words)</li>
              <li>Engaging tone (friendly, inviting, professional)</li>
              <li>Proper hashtags and social media conventions</li>
            </Box>

            <TextField
              fullWidth multiline rows={10} label="Your Rewritten Post" variant="outlined"
              value={rewrittenPost} onChange={(e) => setRewrittenPost(e.target.value)} disabled={submitted}
              placeholder="Rewrite the entire post here with all corrections..."
            />

            {submitted && (
              <Box sx={{ bgcolor: score >= 7 ? P.green.bg : score >= 4 ? P.blue.bg : P.yellow.bg, border: `2px solid ${score >= 7 ? P.green.border : score >= 4 ? P.blue.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Your Score: {score}/10 points</Typography>
                <Typography variant="body2">
                  {score >= 8 ? 'Excellent rewrite! You made significant improvements in grammar, vocabulary, and coherence.'
                    : score >= 6 ? 'Good effort! You made several improvements, but some areas still need work.'
                    : 'Keep practicing! Focus on using articles, correct verb forms, and coherent structure.'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Example ideal rewrite:</strong> "The festival is happening next week at a great time. Come and enjoy the many things we have to offer. Music, food, and dance are all available at the event. Tag a friend who likes this kind of event! Post your photos using the event hashtag. We are doing this to make people happy. This is an amazing festival—please come and join us! Share this with everyone you know."
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/b2/task/a')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task A</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={rewrittenPost.trim().length < 50} sx={{
                  bgcolor: rewrittenPost.trim().length < 50 ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${rewrittenPost.trim().length < 50 ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${rewrittenPost.trim().length < 50 ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: rewrittenPost.trim().length < 50 ? 'not-allowed' : 'pointer',
                  color: rewrittenPost.trim().length < 50 ? '#999' : P.orange.shadow,
                  '&:hover': rewrittenPost.trim().length >= 50 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': rewrittenPost.trim().length >= 50 ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>Submit Rewrite</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>Continue to Task C</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskB;
