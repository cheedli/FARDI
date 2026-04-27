import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { requestPhase42FinalScore } from '../../shared/routing.js';

const Results = () => {
  const navigate = useNavigate();

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

  const [scores, setScores] = useState({ taskA: 0, taskB: 0, taskC: 0, total: 0 });

  useEffect(() => {
    const taskA = parseInt(sessionStorage.getItem('phase4_2_step5_remedialA2_taskA') || '0');
    const taskB = parseInt(sessionStorage.getItem('phase4_2_step5_remedialA2_taskB') || '0');
    const taskC = parseInt(sessionStorage.getItem('phase4_2_step5_remedialA2_taskC') || '0');
    const total = taskA + taskB + taskC;
    setScores({ taskA, taskB, taskC, total });
    requestPhase42FinalScore(5, 'a2', { total_score: total })
      .then((data) => {
        if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url);
        else sessionStorage.removeItem('phase4_2_redirect_url');
      })
      .catch((error) => console.error('Failed to calculate Phase 4.2 Step 5 A2 final score:', error));
  }, []);

  const maxScore = 20;
  const passThreshold = 14;
  const passed = scores.total >= passThreshold;
  const percentage = ((scores.total / maxScore) * 100).toFixed(1);

  const handleRetry = () => {
    sessionStorage.removeItem('phase4_2_step5_remedialA2_taskA');
    sessionStorage.removeItem('phase4_2_step5_remedialA2_taskB');
    sessionStorage.removeItem('phase4_2_step5_remedialA2_taskC');
    navigate('/phase4_2/step/5/remedial/a2/task/a');
  };

  const handleDashboard = () => navigate('/phase4_2/step/5/remedial/b1/taskA');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="Ms. Mabrouki"
            message={passed
              ? "Congratulations! You've successfully completed the A2 remedial activities. You're doing great with spelling and basic grammar!"
              : "You've completed all tasks, but you need more practice. Review the correct spellings and grammar rules, then try again. You can do it!"}
            variant={passed ? 'success' : 'info'}
          />

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.blue.shadow, fontWeight: 'bold' }} align="center">
              A2 Remedial Activities - Results
            </Typography>

            <Box sx={{ bgcolor: passed ? P.green.bg : P.yellow.bg, border: `2px solid ${passed ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: passed ? P.green.shadow : P.yellow.shadow, fontWeight: 'bold' }}>
                {passed ? '✓ Passed!' : '✗ Not Passed'}
              </Typography>
              <Typography variant="h6">Total Score: {scores.total}/{maxScore} ({percentage}%)</Typography>
              <Typography variant="body2">Pass Threshold: {passThreshold}/{maxScore} (70%)</Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1a1a2e' : '#f5f5f5' }}>
                    <TableCell><strong>Task</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell align="center"><strong>Your Score</strong></TableCell>
                    <TableCell align="center"><strong>Max Score</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Task A</TableCell><TableCell>Spelling Rescue (Matching)</TableCell><TableCell align="center">{scores.taskA}</TableCell><TableCell align="center">8</TableCell></TableRow>
                  <TableRow><TableCell>Task B</TableCell><TableCell>Fill Quest (Gap Fill)</TableCell><TableCell align="center">{scores.taskB}</TableCell><TableCell align="center">6</TableCell></TableRow>
                  <TableRow><TableCell>Task C</TableCell><TableCell>Sentence Builder (Grammar Correction)</TableCell><TableCell align="center">{scores.taskC}</TableCell><TableCell align="center">6</TableCell></TableRow>
                  <TableRow sx={{ bgcolor: isDark ? '#1a1a2e' : '#f5f5f5' }}>
                    <TableCell colSpan={2}><strong>TOTAL</strong></TableCell>
                    <TableCell align="center"><strong>{scores.total}</strong></TableCell>
                    <TableCell align="center"><strong>{maxScore}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: P.teal.shadow, fontWeight: 'bold' }}>Performance Analysis:</Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <li><Typography variant="body1"><strong>Task A (Spelling Rescue):</strong> {scores.taskA >= 6 ? '✓ Good' : '✗ Needs improvement'} - {scores.taskA >= 6 ? ' You know social media spelling well!' : ' Review common spellings: hashtag, caption, emoji, tagged, like, share.'}</Typography></li>
                <li><Typography variant="body1"><strong>Task B (Fill Quest):</strong> {scores.taskB >= 4 ? '✓ Good' : '✗ Needs improvement'} - {scores.taskB >= 4 ? ' You can choose the correct spellings!' : ' Practice the correct spellings of social media terms.'}</Typography></li>
                <li><Typography variant="body1"><strong>Task C (Sentence Builder):</strong> {scores.taskC >= 4 ? '✓ Good' : '✗ Needs improvement'} - {scores.taskC >= 4 ? ' You understand basic grammar!' : ' Review verb forms, articles (a, the), and prepositions (to, at, in).'}</Typography></li>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box component="button" onClick={handleRetry} sx={{
                bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.yellow.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.yellow.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.yellow.shadow}` }
              }}>
                Retry Remedial Activities
              </Box>
              <Box component="button" onClick={handleDashboard} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>
                Return to Dashboard
              </Box>
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default Results;
