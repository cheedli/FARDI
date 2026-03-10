import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  Grid
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskD = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 4, context: 'remedial_c1' });
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
    if (lowerCritique.length < 15) return false; // Too short

    return keywords.some(keyword => lowerCritique.includes(keyword.toLowerCase()));
  };

  const evaluateFix = (userFix) => {
    return userFix.trim().length >= 20; // Must provide substantial correction
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CharacterMessage
        character="EMNA"
        message="Welcome to the Critique Game! This is the most challenging task. For each error, write a critique explaining what's wrong, then provide the corrected version. You'll analyze register/tone, coherence, vocabulary, grammar, pragmatics, and style. Show your C1 mastery!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task D: Critique Game
        </Typography>
        <Typography variant="body1" paragraph>
          Critique and fix 6 advanced error types in social media posts:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {errors.map((error, index) => (
            <Paper
              key={error.id}
              variant="outlined"
              sx={{ p: 3, mb: 4, bgcolor: '#fafafa' }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                {index + 1}. {error.category}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: '#ffebee',
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}
              >
                <strong>Faulty:</strong> "{error.faulty}"
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                    <Alert
                      severity={evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords) ? 'success' : 'info'}
                      sx={{ mt: 1 }}
                    >
                      {evaluateCritique(answers[`${error.id}_critique`], error.critiqueKeywords)
                        ? '✓ Good critique!'
                        : `Key issue: ${error.issue}`}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
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
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Ideal correction:</strong> "{error.ideal}"
                      </Typography>
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {submitted && (
          <Alert severity={score >= 9 ? 'success' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
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
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/c')}
            disabled={!submitted}
          >
            Back to Task C
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!allAnswered}
              size="large"
            >
              Submit Critiques
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              size="large"
            >
              View Results
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskD;
