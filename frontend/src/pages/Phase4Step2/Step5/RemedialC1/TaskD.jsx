import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: 2, step: 5, interaction: 4, context: 'remedial_c1' });

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

  const [answers, setAnswers] = useState({
    e1_critique: '',
    e1_fix: '',
    e2_critique: '',
    e2_fix: '',
    e3_critique: '',
    e3_fix: '',
    e4_critique: '',
    e4_fix: '',
    e5_critique: '',
    e5_fix: '',
    e6_critique: '',
    e6_fix: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const errors = [
    {
      id: 'e1',
      category: 'Register/Tone',
      faulty: 'Hey guys! Super excited about the festival! Gonna be lit! 🔥',
      issue: 'Too informal for professional event announcement',
      ideal: 'We are delighted to announce the upcoming festival, which promises to be an exceptional cultural experience.',
      critiqueKeywords: ['informal', 'unprofessional', 'slang', 'casual']
    },
    {
      id: 'e2',
      category: 'Coherence',
      faulty: 'The festival features music, dance, food. Come join us.',
      issue: 'Missing discourse markers and logical connectors',
      ideal: 'The festival features music, dance, and culinary delights. Furthermore, we invite you to join us for this enriching experience.',
      critiqueKeywords: ['connectors', 'coherence', 'flow', 'discourse markers']
    },
    {
      id: 'e3',
      category: 'Vocabulary',
      faulty: 'We utilize this opportunity to fabricate memories.',
      issue: 'Inappropriate word choice: "utilize" → "use", "fabricate" → "create"',
      ideal: 'We use this opportunity to create lasting memories.',
      critiqueKeywords: ['word choice', 'vocabulary', 'inappropriate', 'unnatural']
    },
    {
      id: 'e4',
      category: 'Grammar (Tense)',
      faulty: 'By the time you will arrive, we already started.',
      issue: 'Incorrect tense: need future perfect "will have started"',
      ideal: 'By the time you arrive, we will have already started.',
      critiqueKeywords: ['tense', 'future perfect', 'aspect', 'timing']
    },
    {
      id: 'e5',
      category: 'Pragmatics (CTA)',
      faulty: 'Check out the festival.',
      issue: 'Weak call-to-action, lacks persuasive appeal',
      ideal: 'Join us for an unforgettable cultural experience that will broaden your horizons.',
      critiqueKeywords: ['weak', 'cta', 'call-to-action', 'persuasive', 'appeal']
    },
    {
      id: 'e6',
      category: 'Style (Redundancy)',
      faulty: 'This annual yearly festival that happens every year...',
      issue: 'Redundant repetition of "annual", "yearly", "every year"',
      ideal: 'This annual festival...',
      critiqueKeywords: ['redundant', 'repetition', 'repetitive', 'wordiness']
    }
  ];

  const handleChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const evaluateCritique = (userCritique, keywords) => {
    const lowerCritique = userCritique.toLowerCase().trim();
    if (lowerCritique.length < 15) return false;
    return keywords.some(keyword => lowerCritique.includes(keyword.toLowerCase()));
  };

  const evaluateFix = (userFix) => {
    return userFix.trim().length >= 20;
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    errors.forEach(error => {
      const critiqueCorrect = evaluateCritique(
        answers[`${error.id}_critique`],
        error.critiqueKeywords
      );
      const fixCorrect = evaluateFix(answers[`${error.id}_fix`]);
      if (critiqueCorrect) calculatedScore += 1;
      if (fixCorrect) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialC1_taskD', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/c1/results');
  };

  const allAnswered = errors.every(error =>
    answers[`${error.id}_critique`]?.trim() !== '' &&
    answers[`${error.id}_fix`]?.trim() !== ''
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
              Phase 4.2 - Step 5: Remedial Activities
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: P.orange.border }}>
              Level C1 - Task D: Critique Game
            </Typography>
          </Box>

          <CharacterMessage
            character="EMNA"
            message="Welcome to the Critique Game! This is the most challenging task. For each error, write a critique explaining what's wrong, then provide the corrected version. You'll analyze register/tone, coherence, vocabulary, grammar, pragmatics, and style. Show your C1 mastery!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="body1" paragraph>
              Critique and fix 6 advanced error types in social media posts:
            </Typography>

            <Box sx={{ mt: 3 }}>
              {errors.map((error, index) => (
                <Box
                  key={error.id}
                  sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3, mb: 4 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: P.orange.shadow, fontWeight: 'bold' }}>
                    {index + 1}. {error.category}
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '12px', fontStyle: 'italic' }}>
                    <Typography variant="body1">
                      <strong>Faulty:</strong> "{error.faulty}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Your Critique (explain what's wrong):
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={answers[`${error.id}_critique`]}
                        onChange={(e) => handleChange(`${error.id}_critique`, e.target.value)}
                        disabled={submitted}
                        multiline
                        rows={3}
                        placeholder="Explain the error..."
                      />
                      {submitted && (
                        <Box sx={{
                          bgcolor: evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords) ? P.green.bg : P.teal.bg,
                          border: `2px solid ${evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords) ? P.green.border : P.teal.border}`,
                          borderRadius: '12px', p: 1.5, mt: 1
                        }}>
                          <Typography variant="body2" sx={{ color: evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords) ? P.green.shadow : P.teal.shadow }}>
                            {evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords)
                              ? '✓ Good critique!'
                              : `Key issue: ${error.issue}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Your Corrected Version:
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={answers[`${error.id}_fix`]}
                        onChange={(e) => handleChange(`${error.id}_fix`, e.target.value)}
                        disabled={submitted}
                        multiline
                        rows={3}
                        placeholder="Write the corrected version..."
                      />
                      {submitted && (
                        <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', p: 1.5, mt: 1 }}>
                          <Typography variant="body2" sx={{ color: P.teal.shadow }}>
                            <strong>Ideal correction:</strong> "{error.ideal}"
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{
                bgcolor: score >= 9 ? P.green.bg : P.yellow.bg,
                border: `2px solid ${score >= 9 ? P.green.border : P.yellow.border}`,
                borderRadius: '16px', p: 3, mt: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 9 ? P.green.shadow : P.yellow.shadow }}>
                  Your Score: {score}/12 points
                </Typography>
                <Typography variant="body2">
                  (1 point for critique + 1 point for fix = 2 points per error)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {score >= 9
                    ? 'Outstanding! You demonstrate C1-level critical analysis and correction skills.'
                    : 'Keep practicing! Develop your ability to identify and explain errors in register, coherence, vocabulary, grammar, pragmatics, and style.'}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/c')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task C</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                  bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${!allAnswered ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allAnswered ? 'not-allowed' : 'pointer', color: !allAnswered ? '#999' : P.orange.shadow,
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>Submit Critiques</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>View Results</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskD;
