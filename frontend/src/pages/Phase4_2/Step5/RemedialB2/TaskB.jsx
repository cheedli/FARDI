import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';
import { useProgressSave } from '../../../../hooks/useProgressSave'

const TaskB = () => {
  const navigate = useNavigate()
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_b2' });
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

  const keyImprovements = [
    'the festival',
    'at a',
    'great time',
    'many',
    'to offer',
    'are available',
    'at the event',
    'a friend',
    'who likes',
    'hashtag',
    'we are doing',
    'to make',
    'please come',
    'share with'
  ];

  const evaluateRewrite = (userPost) => {
    const lowerPost = userPost.toLowerCase().trim();

    if (lowerPost.length < 100) return 2; // Too short

    let matches = 0;
    keyImprovements.forEach(improvement => {
      if (lowerPost.includes(improvement.toLowerCase())) {
        matches++;
      }
    });

    // Score based on how many key improvements were made
    if (matches >= 10) return 10;
    if (matches >= 8) return 8;
    if (matches >= 6) return 6;
    if (matches >= 4) return 4;
    return 2;
  };

  const handleSubmit = () => {
    const calculatedScore = evaluateRewrite(rewrittenPost);
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialB2_taskB', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/b2/task/c');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message="Time for the Analysis Odyssey! You'll see a faulty 8-sentence social media post. Your job is to completely rewrite it with correct grammar, coherent structure, appropriate vocabulary, and an engaging tone. This is your chance to show your skills!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task B: Analysis Odyssey
        </Typography>
        <Typography variant="body1" paragraph>
          Fully correct and rewrite this faulty social media post:
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            bgcolor: '#ffebee',
            whiteSpace: 'pre-line'
          }}
        >
          <Typography variant="subtitle1" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
            Faulty Post:
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {faultyPost}
          </Typography>
        </Paper>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          <strong>Focus on:</strong>
        </Typography>
        <Box component="ul" sx={{ mb: 3, pl: 3 }}>
          <li>Correct grammar (articles, verb forms, prepositions)</li>
          <li>Coherent structure (connectors, logical flow)</li>
          <li>Appropriate vocabulary (avoid repetition, use varied words)</li>
          <li>Engaging tone (friendly, inviting, professional)</li>
          <li>Proper hashtags and social media conventions</li>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={10}
          label="Your Rewritten Post"
          variant="outlined"
          value={rewrittenPost}
          onChange={(e) => setRewrittenPost(e.target.value)}
          disabled={submitted}
          placeholder="Rewrite the entire post here with all corrections..."
        />

        {submitted && (
          <Alert severity={score >= 7 ? 'success' : score >= 4 ? 'info' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score}/10 points
            </Typography>
            <Typography variant="body2">
              {score >= 8
                ? 'Excellent rewrite! You made significant improvements in grammar, vocabulary, and coherence.'
                : score >= 6
                ? 'Good effort! You made several improvements, but some areas still need work.'
                : 'Keep practicing! Focus on using articles, correct verb forms, and coherent structure.'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Example ideal rewrite:</strong> "The festival is happening next week at a great time. Come and enjoy the many things we have to offer. Music, food, and dance are all available at the event. Tag a friend who likes this kind of event! Post your photos using the event hashtag. We are doing this to make people happy. This is an amazing festival—please come and join us! Share this with everyone you know."
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/b2/task/a')}
            disabled={!submitted}
          >
            Back to Task A
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={rewrittenPost.trim().length < 50}
              size="large"
            >
              Submit Rewrite
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              size="large"
            >
              Continue to Task C
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskB;
