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
  Paper,
  Alert
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskC = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 3, context: 'remedial_b1' });
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 'q1',
      sentence: "He dont like the post.",
      errorType: 'grammar',
      explanation: "Subject-verb agreement error: 'He doesn't like' (not 'He dont')"
    },
    {
      id: 'q2',
      sentence: "This event is very fantastik!",
      errorType: 'spelling',
      explanation: "Spelling error: 'fantastic' (not 'fantastik')"
    },
    {
      id: 'q3',
      sentence: "Tag you're friends now!",
      errorType: 'grammar',
      explanation: "Grammar error: 'your' (possessive) not 'you're' (you are)"
    },
    {
      id: 'q4',
      sentence: "The festival happen last week.",
      errorType: 'grammar',
      explanation: "Verb tense error: 'happened' (past tense) not 'happen'"
    },
    {
      id: 'q5',
      sentence: "Come to festival for having fun stuff.",
      errorType: 'vocabulary',
      explanation: "Vocabulary/tone too informal: 'to enjoy exciting activities' instead of 'for having fun stuff'"
    },
    {
      id: 'q6',
      sentence: "We has many activities available.",
      errorType: 'grammar',
      explanation: "Subject-verb agreement error: 'We have' (not 'We has')"
    }
  ];

  const errorTypes = [
    { value: 'spelling', label: 'Spelling Error' },
    { value: 'grammar', label: 'Grammar Error' },
    { value: 'vocabulary', label: 'Vocabulary/Tone Error' }
  ];

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.errorType) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB1_taskC', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b1/task/d');
  };

  const allAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Welcome to the Wordshake Quiz! Identify the type of error in each sentence. Is it spelling, grammar, or vocabulary/tone? This will help you become a better editor!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task C: Wordshake Quiz
        </Typography>
        <Typography variant="body1" paragraph>
          Read each sentence and identify what type of error it contains:
        </Typography>

        <Box sx={{ mt: 3 }}>
          {questions.map((question, index) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {index + 1}. Identify the error type in this sentence:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: '#fff3e0',
                  borderRadius: 1,
                  fontStyle: 'italic',
                  fontSize: '1.1rem'
                }}
              >
                "{question.sentence}"
              </Typography>
              <RadioGroup
                value={answers[question.id]}
                onChange={(e) => handleChange(question.id, e.target.value)}
              >
                {errorTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio />}
                    label={type.label}
                    disabled={submitted}
                  />
                ))}
              </RadioGroup>
              {submitted && (
                <Alert
                  severity={answers[question.id] === question.errorType ? 'success' : 'info'}
                  sx={{ mt: 1 }}
                >
                  {answers[question.id] === question.errorType
                    ? `Correct! ${question.explanation}`
                    : `Incorrect. ${question.explanation}`}
                </Alert>
              )}
            </Box>
          ))}
        </Box>

        {submitted && (
          <Alert severity={score >= 4 ? 'success' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score}/6 points
            </Typography>
            <Typography variant="body2">
              {score >= 4
                ? 'Great job identifying error types! This skill will help you edit posts effectively.'
                : 'Keep practicing! Learn to distinguish between spelling, grammar, and vocabulary errors.'}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/b1/task/b')}
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
