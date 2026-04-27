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
  React.useEffect(() => { window.__remedialSkip = () => navigate('/phase4_2/step/5/remedial/c1/task/a') }, [])
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 2, context: 'remedial_c1' });

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

  const faultyPost = `Festival occurring next week offer unique opportunity
Participants will expose to global traditions and customs
The event showcase music, cuisine, artistic expression from worldwide
We encouraging attendees for sharing experience on social platforms
Photographs should post with official event hashtag for maximum visibility
This initiative aims at promote intercultural understanding between communities
We anticipate that festival will receive positive response from public
Booking is necessary and available through our website immediately`;

  const handleSubmit = async () => {
    try {
      const data = await requestPhase42TaskBScore(5, 'C1', {
        text: rewrittenPost,
        faulty_post: faultyPost,
        criteria: 'rewrite the advanced faulty post with sophisticated grammar, discourse markers, and professional register',
      })

      setScore(data.score)
      setSubmitted(true)
      sessionStorage.setItem('phase4_2_step5_remedialC1_taskB', data.score.toString())
      saveResponse({ item_index: 0, item_id: 'completion', item_type: 'task_complete', prompt: 'Task completion', answer: rewrittenPost, is_correct: true, score: data.score })
      await fetch('/api/phase4/remedial/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phase: '4.2', step: 5, level: 'C1', task: 'B', score: data.score, max_score: 12, content: rewrittenPost })
      })
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('Evaluation failed. Please try again.')
    }
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/c1/task/c');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Phase 4.2 - Step 5: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Level C1 - Task B: Analysis Odyssey
            </Typography>
          </Box>

          <CharacterMessage
            character="EMNA"
            message="Time for the Analysis Odyssey at C1 level! You'll see a sophisticated but flawed social media post. Rewrite it with perfect grammar, sophisticated vocabulary, coherent structure, appropriate register, and persuasive tone. Use discourse markers and demonstrate advanced language skills!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="body1" paragraph>
              Completely rewrite this complex 8-sentence faulty social media post:
            </Typography>

            <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '16px', p: 3, mb: 3, whiteSpace: 'pre-line' }}>
              <Typography variant="subtitle1" sx={{ color: P.red.shadow, mb: 2, fontWeight: 'bold' }}>
                Faulty Post (Advanced Level Errors):
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                {faultyPost}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Required improvements:</strong>
            </Typography>
            <Box component="ul" sx={{ mb: 3, pl: 3 }}>
              <li>Perfect grammar (articles: a/the, passive voice, subject-verb agreement)</li>
              <li>Sophisticated vocabulary (avoid repetition, use advanced terms)</li>
              <li>Coherent structure with discourse markers (Furthermore, Moreover, Additionally)</li>
              <li>Appropriate register (professional yet engaging)</li>
              <li>Persuasive tone with effective CTAs</li>
              <li>Correct prepositions and infinitive structures</li>
              <li>Advanced connectors for logical flow</li>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={12}
              label="Your Sophisticated Rewrite"
              variant="outlined"
              value={rewrittenPost}
              onChange={(e) => setRewrittenPost(e.target.value)}
              disabled={submitted}
              placeholder="Rewrite the entire post here with all advanced corrections..."
            />

            {submitted && (
              <Box sx={{ bgcolor: score >= 9 ? P.green.bg : score >= 6 ? P.blue.bg : P.yellow.bg, border: `2px solid ${score >= 9 ? P.green.border : score >= 6 ? P.blue.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 9 ? P.green.shadow : score >= 6 ? P.blue.shadow : P.yellow.shadow }}>
                  Your Score: {score}/12 points
                </Typography>
                <Typography variant="body2">
                  {score >= 10
                    ? 'Outstanding! Your rewrite demonstrates C1-level mastery of grammar, vocabulary, and discourse.'
                    : score >= 7
                    ? 'Good effort! You made several improvements, but refine your use of articles, passive voice, and discourse markers.'
                    : 'Continue practicing! Focus on perfect grammar, sophisticated vocabulary, and coherent structure with connectors.'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Example ideal rewrite:</strong> "The festival, occurring next week, offers a unique opportunity to engage with global culture. Participants will be exposed to diverse traditions and customs from around the world. Furthermore, the event showcases music, cuisine, and artistic expression. We encourage attendees to share their experiences on social platforms. Additionally, photographs should be posted using the official event hashtag for maximum visibility. This initiative aims to promote intercultural understanding between communities. Moreover, we anticipate that the festival will receive a positive response from the public. Booking is necessary and available through our website."
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/a')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task A</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={rewrittenPost.trim().length < 100} sx={{
                  bgcolor: rewrittenPost.trim().length < 100 ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${rewrittenPost.trim().length < 100 ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${rewrittenPost.trim().length < 100 ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: rewrittenPost.trim().length < 100 ? 'not-allowed' : 'pointer',
                  color: rewrittenPost.trim().length < 100 ? '#999' : P.orange.shadow,
                  '&:hover': rewrittenPost.trim().length >= 100 ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': rewrittenPost.trim().length >= 100 ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>Submit Rewrite</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
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
