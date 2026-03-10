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
  const { saveResponse } = useProgressSave({ phase: 4, subphase: null, step: 5, interaction: 2, context: 'remedial_c1' });
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

  const keyImprovements = [
    'the festival',
    'occurring',
    'offers',
    'a unique',
    'will be exposed',
    'to global',
    'showcases',
    'from around the world',
    'encourage',
    'to share',
    'their experience',
    'should be posted',
    'aims to promote',
    'the festival',
    'a positive',
    'from the public',
    'furthermore',
    'moreover',
    'additionally'
  ];

  const evaluateRewrite = (userPost) => {
    const lowerPost = userPost.toLowerCase().trim();

    if (lowerPost.length < 150) return 3; // Too short for C1

    let matches = 0;
    keyImprovements.forEach(improvement => {
      if (lowerPost.includes(improvement.toLowerCase())) {
        matches++;
      }
    });

    // C1 level scoring - higher standards
    if (matches >= 14) return 12;
    if (matches >= 12) return 10;
    if (matches >= 10) return 8;
    if (matches >= 7) return 6;
    if (matches >= 5) return 4;
    return 2;
  };

  const handleSubmit = () => {
    const calculatedScore = evaluateRewrite(rewrittenPost);
    setScore(calculatedScore);
    setSubmitted(true);
    sessionStorage.setItem('phase4_2_step5_remedialC1_taskB', calculatedScore.toString());
  };

  const handleNext = () => {
    navigate('/phase4_2/step/5/remedial/c1/task/c');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="EMNA"
        message="Time for the Analysis Odyssey at C1 level! You'll see a sophisticated but flawed social media post. Rewrite it with perfect grammar, sophisticated vocabulary, coherent structure, appropriate register, and persuasive tone. Use discourse markers and demonstrate advanced language skills!"
        variant="info"
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Task B: Analysis Odyssey
        </Typography>
        <Typography variant="body1" paragraph>
          Completely rewrite this complex 8-sentence faulty social media post:
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
            Faulty Post (Advanced Level Errors):
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {faultyPost}
          </Typography>
        </Paper>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
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
          <Alert severity={score >= 9 ? 'success' : score >= 6 ? 'info' : 'warning'} sx={{ mt: 3 }}>
            <Typography variant="h6">
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
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/phase4_2/step/5/remedial/c1/task/a')}
            disabled={!submitted}
          >
            Back to Task A
          </Button>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={rewrittenPost.trim().length < 100}
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
