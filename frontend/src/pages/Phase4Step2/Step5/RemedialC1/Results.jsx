import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
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

  const [scores, setScores] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    total: 0
  });

  useEffect(() => {
    const taskA = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskA') || '0');
    const taskB = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskB') || '0');
    const taskC = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskC') || '0');
    const taskD = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskD') || '0');
    const total = taskA + taskB + taskC + taskD;
    setScores({ taskA, taskB, taskC, taskD, total });
    requestPhase42FinalScore(5, 'c1', { total_score: total })
      .then((data) => {
        if (data.passed) sessionStorage.setItem('phase4_2_redirect_url', data.next_url);
        else sessionStorage.removeItem('phase4_2_redirect_url');
      })
      .catch((error) => console.error('Failed to calculate Phase 4.2 Step 5 C1 final score:', error));
  }, []);

  const maxScore = 40; // 4 + 12 + 12 + 12
  const passThreshold = 28; // 70%
  const passed = scores.total >= passThreshold;
  const percentage = ((scores.total / maxScore) * 100).toFixed(1);

  const handleRetry = () => {
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskA');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskB');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskC');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskD');
    navigate('/phase4_2/step/5/remedial/c1/task/a');
  };

  const handleDashboard = () => {
    navigate('/phase4/step/3');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <CharacterMessage
            character="EMNA"
            message={
              passed
                ? "Congratulations! You've successfully completed the C1 remedial activities. Your mastery of advanced grammar, sophisticated vocabulary, and critical analysis is exemplary. You demonstrate true C1-level proficiency!"
                : "You've completed all tasks at C1 level, which is highly challenging. Review the areas needing improvement, particularly advanced grammar structures, discourse markers, and critical analysis. With practice, you'll achieve mastery!"
            }
            variant={passed ? 'success' : 'info'}
          />

          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.blue.shadow, fontWeight: 'bold' }} align="center">
              C1 Remedial Activities - Results
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
                  <TableRow>
                    <TableCell>Task A</TableCell>
                    <TableCell>Debate Simulation (Advanced Dialogue)</TableCell>
                    <TableCell align="center">{scores.taskA}</TableCell>
                    <TableCell align="center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task B</TableCell>
                    <TableCell>Analysis Odyssey (Sophisticated Rewrite)</TableCell>
                    <TableCell align="center">{scores.taskB}</TableCell>
                    <TableCell align="center">12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task C</TableCell>
                    <TableCell>Advanced Quiz (Identify &amp; Fix Complex Errors)</TableCell>
                    <TableCell align="center">{scores.taskC}</TableCell>
                    <TableCell align="center">12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task D</TableCell>
                    <TableCell>Critique Game (Advanced Error Critique)</TableCell>
                    <TableCell align="center">{scores.taskD}</TableCell>
                    <TableCell align="center">12</TableCell>
                  </TableRow>
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
                <li>
                  <Typography variant="body1">
                    <strong>Task A (Debate Simulation):</strong> {scores.taskA >= 3 ? '✓ Excellent' : '✗ Needs improvement'} -
                    {scores.taskA >= 3
                      ? ' You understand advanced grammar structures including articles, passive voice, subjunctive mood, and conditionals.'
                      : ' Review articles (a, the), passive voice constructions, subjunctive mood, and conditional forms.'}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Task B (Analysis Odyssey):</strong> {scores.taskB >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                    {scores.taskB >= 9
                      ? ' Your sophisticated rewriting demonstrates C1-level mastery of grammar, vocabulary, and discourse.'
                      : ' Focus on perfect grammar, sophisticated vocabulary, coherent structure with discourse markers.'}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Task C (Advanced Quiz):</strong> {scores.taskC >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                    {scores.taskC >= 9
                      ? ' You excel at identifying and correcting complex grammatical errors.'
                      : ' Study relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions.'}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Task D (Critique Game):</strong> {scores.taskD >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                    {scores.taskD >= 9
                      ? ' Your critical analysis and correction skills are outstanding!'
                      : ' Develop ability to identify and explain errors in register, coherence, vocabulary, grammar, pragmatics, and style.'}
                  </Typography>
                </li>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box component="button" onClick={handleRetry} sx={{
                bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.orange.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.orange.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` }
              }}>Retry Remedial Activities</Box>
              <Box component="button" onClick={handleDashboard} sx={{
                bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', color: P.green.shadow,
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
              }}>Return to Dashboard</Box>
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default Results;
