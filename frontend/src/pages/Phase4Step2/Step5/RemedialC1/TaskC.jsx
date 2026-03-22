import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, Alert } from '@mui/material';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskC = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_c1' });

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
    q1_type: '',
    q1_correction: '',
    q2_type: '',
    q2_correction: '',
    q3_type: '',
    q3_correction: '',
    q4_type: '',
    q4_correction: '',
    q5_type: '',
    q5_correction: '',
    q6_type: '',
    q6_correction: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 'q1',
      sentence: 'The festival, that takes place annually, attracts thousands.',
      errorType: 'relative clause',
      correction: 'The festival, which takes place annually, attracts thousands.',
      explanation: 'Use "which" (not "that") in non-restrictive relative clauses with commas'
    },
    {
      id: 'q2',
      sentence: 'If the event would be successful, we will organize more.',
      errorType: 'conditional',
      correction: 'If the event is successful, we will organize more.',
      explanation: 'First conditional uses present simple (not "would") in if-clause'
    },
    {
      id: 'q3',
      sentence: 'Participants are required that they register online.',
      errorType: 'infinitive',
      correction: 'Participants are required to register online.',
      explanation: 'Use infinitive structure "to register" (not "that they register")'
    },
    {
      id: 'q4',
      sentence: 'The organizers suggest attendees to arrive early.',
      errorType: 'subjunctive',
      correction: 'The organizers suggest that attendees arrive early.',
      explanation: 'Use subjunctive "suggest that + subject + base verb" (not "to arrive")'
    },
    {
      id: 'q5',
      sentence: 'Having been organized by professionals, the event was success.',
      errorType: 'article',
      correction: 'Having been organized by professionals, the event was a success.',
      explanation: 'Need indefinite article "a" before "success" (countable noun)'
    },
    {
      id: 'q6',
      sentence: 'Despite of the rain, the festival continued.',
      errorType: 'preposition',
      correction: 'Despite the rain, the festival continued.',
      explanation: 'Use "Despite" alone (not "Despite of")'
    }
  ];

  const errorTypes = [
    'relative clause',
    'conditional',
    'infinitive',
    'subjunctive',
    'article',
    'preposition'
  ];

  const handleChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (answers[`${question.id}_type`] === question.errorType) {
        calculatedScore += 1;
      }
      const userCorrection = answers[`${question.id}_correction`];
      if (userCorrection && userCorrection.toLowerCase().includes(question.correction.toLowerCase().substring(0, 30))) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialC1_taskC', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/c1/task/d');
  };

  const allAnswered = questions.every(q =>
    answers[`${q.id}_type`] !== '' && answers[`${q.id}_correction`]?.trim() !== ''
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
              Level C1 - Task C: Advanced Quiz
            </Typography>
          </Box>

          <CharacterMessage
            character="EMNA"
            message="Welcome to the Advanced Quiz! For each sentence, identify the error type AND write the corrected version. This tests your understanding of complex grammar: relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions. Precision is key!"
            variant="info"
          />

          <Box sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, p: 4, mt: 3 }}>
            <Typography variant="body1" paragraph>
              Identify the error type and fix each sentence with advanced errors:
            </Typography>

            <Box sx={{ mt: 3 }}>
              {questions.map((question, index) => (
                <Box key={question.id} sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '16px', p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. Sentence:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, p: 2, bgcolor: P.orange.bg, border: `1px solid ${P.orange.border}`, borderRadius: '8px', fontStyle: 'italic', fontSize: '1.1rem' }}>
                    "{question.sentence}"
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Error Type:
                      </Typography>
                      <RadioGroup
                        value={answers[`${question.id}_type`]}
                        onChange={(e) => handleChange(`${question.id}_type`, e.target.value)}
                      >
                        {errorTypes.map((type) => (
                          <FormControlLabel
                            key={type}
                            value={type}
                            control={<Radio />}
                            label={type}
                            disabled={submitted}
                          />
                        ))}
                      </RadioGroup>
                      {submitted && (
                        <Box sx={{ bgcolor: answers[`${question.id}_type`] === question.errorType ? P.green.bg : P.red.bg, border: `2px solid ${answers[`${question.id}_type`] === question.errorType ? P.green.border : P.red.border}`, borderRadius: '8px', p: 1.5, mt: 1 }}>
                          <Typography variant="body2" sx={{ color: answers[`${question.id}_type`] === question.errorType ? P.green.shadow : P.red.shadow, fontWeight: 700 }}>
                            {answers[`${question.id}_type`] === question.errorType
                              ? 'Correct!'
                              : `Should be: ${question.errorType}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Corrected Sentence:
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={answers[`${question.id}_correction`]}
                        onChange={(e) => handleChange(`${question.id}_correction`, e.target.value)}
                        disabled={submitted}
                        multiline
                        rows={3}
                        placeholder="Write the corrected sentence..."
                      />
                      {submitted && (
                        <Box sx={{ bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '8px', p: 1.5, mt: 1 }}>
                          <Typography variant="body2" sx={{ color: P.teal.shadow }}>
                            <strong>Correct version:</strong> {question.correction}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: P.teal.shadow }}>
                            {question.explanation}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {submitted && (
              <Box sx={{ bgcolor: score >= 9 ? P.green.bg : P.yellow.bg, border: `2px solid ${score >= 9 ? P.green.border : P.yellow.border}`, borderRadius: '16px', p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: score >= 9 ? P.green.shadow : P.yellow.shadow }}>
                  Your Score: {score}/12 points
                </Typography>
                <Typography variant="body2">
                  (1 point for error type + 1 point for correction = 2 points per sentence)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {score >= 9
                    ? 'Excellent! You have mastered advanced grammar structures at C1 level.'
                    : 'Keep studying! Review relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions.'}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box component="button" onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/b')} disabled={!submitted} sx={{
                bgcolor: !submitted ? (isDark ? '#333' : '#e0e0e0') : P.blue.bg,
                border: `2px solid ${!submitted ? '#999' : P.blue.border}`,
                borderRadius: '12px', boxShadow: `3px 3px 0 ${!submitted ? '#999' : P.blue.shadow}`,
                px: 3, py: 1.5, fontWeight: 700, fontSize: '1rem',
                cursor: !submitted ? 'not-allowed' : 'pointer', color: !submitted ? '#999' : P.blue.shadow
              }}>Back to Task B</Box>
              {!submitted ? (
                <Box component="button" onClick={handleSubmit} disabled={!allAnswered} sx={{
                  bgcolor: !allAnswered ? (isDark ? '#333' : '#e0e0e0') : P.orange.bg,
                  border: `2px solid ${!allAnswered ? '#999' : P.orange.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${!allAnswered ? '#999' : P.orange.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: !allAnswered ? 'not-allowed' : 'pointer', color: !allAnswered ? '#999' : P.orange.shadow,
                  '&:hover': allAnswered ? { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.orange.shadow}` } : {},
                  '&:active': allAnswered ? { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.orange.shadow}` } : {}
                }}>Submit Answers</Box>
              ) : (
                <Box component="button" onClick={handleNext} sx={{
                  bgcolor: P.green.bg, border: `2px solid ${P.green.border}`,
                  borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`,
                  px: 4, py: 1.5, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', color: P.green.shadow,
                  '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${P.green.shadow}` },
                  '&:active': { transform: 'translate(0,0)', boxShadow: `1px 1px 0 ${P.green.shadow}` }
                }}>Continue to Task D</Box>
              )}
            </Box>
          </Box>

        </motion.div>
      </Container>
    </Box>
  );
};

export default TaskC;
