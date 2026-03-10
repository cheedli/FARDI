import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Paper,
  Alert,
  Grid
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskC = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_c1' });
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

  const evaluateCorrection = (userCorrection, idealCorrection) => {
    const lowerUser = userCorrection.toLowerCase().trim();
    const lowerIdeal = idealCorrection.toLowerCase().trim();

    // Extract key differences between faulty and correct
    const keyPhrases = {
      q1: ['which'],
      q2: ['is successful'],
      q3: ['to register'],
      q4: ['suggest that', 'arrive'],
      q5: ['a success'],
      q6: ['despite the', 'not despite of']
    };

    return lowerUser.includes(lowerIdeal.substring(0, 20).toLowerCase()) ||
           (keyPhrases[userCorrection.match(/q\d/)?.[0]] || []).some(phrase => lowerUser.includes(phrase));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      // Check error type identification
      if (answers[`${question.id}_type`] === question.errorType) {
        calculatedScore += 1;
      }
      // Check correction
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CharacterMessage
        character="EMNA"
        message="Welcome to the Advanced Quiz! For each sentence, identify the error type AND write the corrected version. This tests your understanding of complex grammar: relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions. Precision is key!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task C: Advanced Quiz
        </Typography>
        <Typography variant="body1" paragraph>
          Identify the error type and fix each sentence with advanced errors:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {questions.map((question, index) => (
            <Paper
              key={question.id}
              variant="outlined"
              sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}
            >
              <Typography variant="h6" gutterBottom>
                {index + 1}. Sentence:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: '#fff3e0',
                  borderRadius: 1,
                  fontStyle: 'italic',
                  fontSize: '1.1rem'
                }}
              >
                "{question.sentence}"
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
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
                    <Alert
                      severity={answers[`${question.id}_type`] === question.errorType ? 'success' : 'error'}
                      sx={{ mt: 1 }}
                    >
                      {answers[`${question.id}_type`] === question.errorType
                        ? '✓ Correct!'
                        : `✗ Should be: ${question.errorType}`}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={7}>
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
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Correct version:</strong> {question.correction}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {question.explanation}
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
              (1 point for error type + 1 point for correction = 2 points per sentence)
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {score >= 9
                ? 'Excellent! You have mastered advanced grammar structures at C1 level.'
                : 'Keep studying! Review relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/b')}
            disabled={!submitted}
          >
            Back to Task B
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!allAnswered}
              size="large"
            >
              Submit Answers
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              size="large"
            >
              Continue to Task D
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskC;
