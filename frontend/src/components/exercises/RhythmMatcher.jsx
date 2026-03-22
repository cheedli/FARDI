/**
 * Rhythm Matcher Component
 * Audio-Visual Matching game for listening_drag_drop exercises
 * Features: Card flip animation, Audio playback on hover, Combo counter
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const keyframes = `
@keyframes rm-wave { 0%,100%{height:10px} 50%{height:40px} }
@keyframes rm-popIn { 0%{transform:translate(-50%,-50%) scale(0);opacity:0} 50%{transform:translate(-50%,-50%) scale(1.1)} 100%{transform:translate(-50%,-50%) scale(1);opacity:1} }
@keyframes rm-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
@keyframes rm-checkIn { 0%{transform:scale(0) rotate(-180deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes rm-victoryPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
@keyframes rm-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
@keyframes rm-comboGlow { 0%,100%{box-shadow:0 0 0 rgba(255,152,0,0)} 50%{box-shadow:0 0 20px rgba(255,152,0,0.8)} }
@keyframes rm-glow { 0%,100%{box-shadow:0 0 0 transparent} 50%{box-shadow:0 0 16px} }
@keyframes rm-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
@media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
`;

export default function RhythmMatcher({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [matches, setMatches] = useState({});
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shuffledTerms, setShuffledTerms] = useState([]);
    const [shuffledDefinitions, setShuffledDefinitions] = useState([]);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [wrongMatch, setWrongMatch] = useState(null);

    const audioRef = useRef(null);
    const pairs = exercise?.pairs || [];
    const guidedQuestions = exercise?.guided_questions || [];

    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const c = dark
        ? {
            pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A',
            blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
            green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
            red: { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
            yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
            orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
            purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#6A1B9A' },
            teal: { bg: '#001A1F', border: '#4DD0E1', shadow: '#00695C' },
        }
        : {
            pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0',
            blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
            green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
            red: { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
            yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
            orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
            purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
            teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        };

    // Clay card base
    const clayCard = (color) => ({
        bgcolor: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${color.shadow}`,
    });

    // Clay pill base
    const clayPill = (color) => ({
        px: 1.75, py: 0.4, borderRadius: '50px',
        bgcolor: color.bg, border: `2px solid ${color.border}`,
        boxShadow: `2px 2px 0 ${color.shadow}`,
        fontSize: '0.8rem', fontWeight: 800,
        display: 'inline-flex', alignItems: 'center', gap: 0.5,
    });

    // Clay button base
    const clayBtn = (color) => ({
        borderRadius: '14px',
        border: `2px solid ${color.border}`,
        bgcolor: color.bg,
        color: color.text || c.heading,
        boxShadow: `4px 4px 0 ${color.shadow}`,
        fontWeight: 800,
        textTransform: 'none',
        minHeight: '44px',
        '&:hover': {
            bgcolor: color.bg,
            transform: 'translate(-2px,-2px)',
            boxShadow: `6px 6px 0 ${color.shadow}`,
        },
    });

    // Shuffle arrays on mount
    useEffect(() => {
        if (pairs.length > 0) {
            const terms = pairs.map(p => p.term);
            const definitions = pairs.map(p => p.definition);
            setShuffledTerms(shuffleArray([...terms]));
            setShuffledDefinitions(shuffleArray([...definitions]));
        }
    }, [pairs]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handlePlayAudio = useCallback(() => {
        if (!exercise?.audio_script) return;
        setAudioPlaying(true);
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(exercise.audio_script);
            utterance.rate = 0.9;
            utterance.onend = () => { setAudioPlaying(false); setAudioPlayed(true); };
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => { setAudioPlaying(false); setAudioPlayed(true); }, 3000);
        }
    }, [exercise?.audio_script]);

    const startGame = () => {
        setGameStarted(true); setMatches({}); setScore(0); setCombo(0);
        setSelectedTerm(null); setFlippedCards(new Set());
    };

    const handleTermClick = (term) => {
        if (matches[term]) return;
        setSelectedTerm(term);
        setFlippedCards(prev => new Set([...prev, `term-${term}`]));
        if (navigator.vibrate) navigator.vibrate(30);
    };

    const handleDefinitionClick = (definition) => {
        if (!selectedTerm) return;
        const correctPair = pairs.find(p => p.term === selectedTerm);
        const isCorrect = correctPair?.definition === definition;
        setFlippedCards(prev => new Set([...prev, `def-${definition}`]));

        if (isCorrect) {
            const newCombo = combo + 1;
            const points = 10 + (newCombo * 5);
            setMatches(prev => ({ ...prev, [selectedTerm]: definition }));
            setScore(prev => prev + points);
            setCombo(newCombo);
            setFeedback({ type: 'success', message: `+${points} points!`, combo: newCombo });
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            const newMatchCount = Object.keys(matches).length + 1;
            if (newMatchCount === pairs.length) {
                setTimeout(() => {
                    const finalScore = score + points;
                    if (onComplete) {
                        onComplete({ score: finalScore, correctCount: pairs.length, totalCount: pairs.length, isPerfect: true });
                    }
                }, 1000);
            }
            if (onProgress) onProgress({ correct: true, points });
        } else {
            setCombo(0);
            setWrongMatch({ term: selectedTerm, definition });
            setFeedback({ type: 'error', message: 'Not a match!' });
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            setTimeout(() => {
                setFlippedCards(prev => {
                    const next = new Set(prev);
                    next.delete(`term-${selectedTerm}`);
                    next.delete(`def-${definition}`);
                    return next;
                });
                setWrongMatch(null);
            }, 800);
            if (onProgress) onProgress({ correct: false });
        }

        setTimeout(() => { setFeedback(null); setSelectedTerm(null); }, 800);
    };

    const isTermMatched = (term) => !!matches[term];
    const isDefinitionMatched = (definition) => Object.values(matches).includes(definition);
    const allMatched = Object.keys(matches).length === pairs.length && pairs.length > 0;

    // Wrapper
    const Wrapper = ({ children, sx }) => (
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 2.5, ...sx }}>
            <style>{keyframes}</style>
            {children}
        </Box>
    );

    // Audio instruction screen
    if (!audioPlayed && exercise?.audio_script) {
        return (
            <Wrapper>
                <Box sx={{ ...clayCard(c.purple), p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
                    <VolumeUpIcon sx={{ fontSize: 80, color: c.purple.border, mb: 2, animation: 'rm-pulse 2s infinite' }} />
                    <Typography sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' }, fontWeight: 800, color: c.heading, mb: 1 }}>
                        Listen First!
                    </Typography>
                    <Typography sx={{ color: c.muted, mb: 3 }}>
                        Listen to the audio carefully before matching the cards.
                    </Typography>

                    <Box sx={{ ...clayCard(c.teal), p: 2, mb: 3 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: c.muted, mb: 0.5 }}>
                            Audio content preview:
                        </Typography>
                        <Typography sx={{ fontStyle: 'italic', color: c.body, fontSize: '0.9rem' }}>
                            "{exercise.audio_script.substring(0, 100)}..."
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={audioPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayAudio}
                        disabled={audioPlaying}
                        sx={{
                            ...clayBtn(c.blue),
                            px: 4, py: 1.5, fontSize: '1.1rem',
                        }}
                    >
                        {audioPlaying ? 'Playing...' : 'Play Audio'}
                    </Button>

                    {audioPlaying && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3, height: 40 }}>
                            {[...Array(5)].map((_, i) => (
                                <Box key={i} sx={{
                                    width: 8, bgcolor: c.purple.border, borderRadius: 1,
                                    animation: 'rm-wave 0.8s ease-in-out infinite',
                                    animationDelay: `${i * 0.1}s`,
                                }} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Wrapper>
        );
    }

    // Start game screen
    if (!gameStarted) {
        return (
            <Wrapper>
                <Box sx={{ ...clayCard(c.orange), p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' }, fontWeight: 800, color: c.heading, mb: 1 }}>
                        Rhythm Matcher
                    </Typography>
                    <Typography sx={{ color: c.muted, mb: 2 }}>
                        {exercise?.instruction || 'Match the terms with their definitions!'}
                    </Typography>
                    <Box sx={{ ...clayPill(c.yellow), mx: 'auto', mb: 3 }}>
                        {pairs.length} pairs to match
                    </Box>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={startGame}
                        startIcon={<PlayArrowIcon />}
                        sx={{ ...clayBtn(c.green), px: 4, py: 1.5, fontSize: '1rem' }}
                    >
                        Start Matching
                    </Button>
                </Box>
            </Wrapper>
        );
    }

    // Victory screen
    if (allMatched) {
        return (
            <Wrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{
                    ...clayCard(c.green), p: { xs: 3, sm: 5 }, textAlign: 'center', width: '100%',
                    animation: 'rm-victoryPop 0.5s ease',
                }}>
                    <EmojiEventsIcon sx={{ fontSize: 100, color: '#ffd700', mb: 2, animation: 'rm-bounce 2s infinite' }} />
                    <Typography sx={{ fontSize: { xs: '1.6rem', sm: '2rem' }, fontWeight: 800, color: c.heading }}>
                        Perfect Match!
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: c.body, mt: 1 }}>
                        Score: {score}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Box sx={{ ...clayPill(c.green), gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16 }} />
                            {pairs.length}/{pairs.length} Matched
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={() => {
                            setGameStarted(false); setMatches({}); setScore(0); setCombo(0);
                            setShuffledTerms(shuffleArray(pairs.map(p => p.term)));
                            setShuffledDefinitions(shuffleArray(pairs.map(p => p.definition)));
                        }}
                        startIcon={<ReplayIcon />}
                        sx={{ ...clayBtn(c.blue), px: 4, py: 1.5, mt: 3 }}
                    >
                        Play Again
                    </Button>
                </Box>
            </Wrapper>
        );
    }

    // Main game
    return (
        <Wrapper>
            {/* Header */}
            <Box sx={{
                ...clayCard(c.purple), p: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 3 }, mb: 3,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 1,
            }}>
                <Box>
                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: c.heading }}>
                        Rhythm Matcher
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: c.muted }}>
                        {exercise?.instruction}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box sx={clayPill(c.blue)}>
                        <StarIcon sx={{ fontSize: 14 }} /> {score}
                    </Box>
                    {combo > 1 && (
                        <Box sx={{ ...clayPill(c.orange), animation: 'rm-comboGlow 0.5s ease' }}>
                            <LocalFireDepartmentIcon sx={{ fontSize: 14 }} /> {combo}x Combo
                        </Box>
                    )}
                    <Box sx={clayPill(c.teal)}>
                        {Object.keys(matches).length}/{pairs.length}
                    </Box>
                </Box>
            </Box>

            {/* Feedback popup */}
            {feedback && (
                <Box sx={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)', zIndex: 1000,
                    px: 4, py: 2,
                    ...(feedback.type === 'success' ? clayCard(c.green) : clayCard(c.red)),
                    animation: feedback.type === 'success' ? 'rm-popIn 0.3s ease' : 'rm-shake 0.5s ease',
                }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: c.heading }}>
                        {feedback.message}
                    </Typography>
                </Box>
            )}

            {/* Game Board */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, sm: 3 },
                mb: 3,
            }}>
                {/* Terms Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography sx={{
                        textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2,
                        color: c.muted, fontWeight: 800, fontSize: '0.75rem', mb: 0.5,
                    }}>
                        Terms
                    </Typography>
                    {shuffledTerms.map((term, index) => {
                        const isMatched = isTermMatched(term);
                        const isSelected = selectedTerm === term;
                        const isWrong = wrongMatch?.term === term;

                        const cardColor = isMatched ? c.green : isSelected ? c.purple : isWrong ? c.red : c.blue;

                        return (
                            <Box
                                key={`term-${index}`}
                                onClick={() => !isMatched && handleTermClick(term)}
                                sx={{
                                    ...clayCard(cardColor),
                                    p: { xs: 1.5, sm: 2 },
                                    minHeight: 44,
                                    display: 'flex', alignItems: 'center',
                                    position: 'relative',
                                    cursor: isMatched ? 'default' : 'pointer',
                                    opacity: isMatched ? 0.75 : 1,
                                    transition: 'all 0.2s ease',
                                    ...(isSelected && {
                                        transform: { xs: 'scale(1.02)', sm: 'translateX(8px) scale(1.02)' },
                                        boxShadow: `6px 6px 0 ${cardColor.shadow}`,
                                    }),
                                    ...(isWrong && { animation: 'rm-shake 0.5s ease' }),
                                    ...(!isMatched && !isSelected && {
                                        '&:hover': {
                                            transform: { xs: 'scale(1.02)', sm: 'translateX(6px)' },
                                            boxShadow: `6px 6px 0 ${cardColor.shadow}`,
                                        },
                                    }),
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, color: c.heading, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                    {term}
                                </Typography>
                                {isMatched && (
                                    <CheckCircleIcon sx={{
                                        position: 'absolute', top: 8, right: 8,
                                        color: c.green.border, fontSize: 22,
                                        animation: 'rm-checkIn 0.5s ease',
                                    }} />
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* Definitions Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography sx={{
                        textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2,
                        color: c.muted, fontWeight: 800, fontSize: '0.75rem', mb: 0.5,
                    }}>
                        Definitions
                    </Typography>
                    {shuffledDefinitions.map((definition, index) => {
                        const isMatched = isDefinitionMatched(definition);
                        const isWrong = wrongMatch?.definition === definition;
                        const isClickable = selectedTerm && !isMatched;

                        const cardColor = isMatched ? c.green : isWrong ? c.red : c.orange;

                        return (
                            <Box
                                key={`def-${index}`}
                                onClick={() => !isMatched && selectedTerm && handleDefinitionClick(definition)}
                                sx={{
                                    ...clayCard(cardColor),
                                    p: { xs: 1.5, sm: 2 },
                                    minHeight: 44,
                                    display: 'flex', alignItems: 'center',
                                    position: 'relative',
                                    cursor: isClickable ? 'pointer' : isMatched ? 'default' : 'default',
                                    opacity: isMatched ? 0.75 : 1,
                                    transition: 'all 0.2s ease',
                                    ...(isClickable && {
                                        borderColor: c.orange.border,
                                        animationName: 'rm-glow',
                                        animationDuration: '1s',
                                        animationIterationCount: 'infinite',
                                        animationTimingFunction: 'ease',
                                        '&:hover': {
                                            transform: { xs: 'scale(1.02)', sm: 'translateX(-6px)' },
                                            boxShadow: `6px 6px 0 ${cardColor.shadow}`,
                                        },
                                    }),
                                    ...(isWrong && { animation: 'rm-shake 0.5s ease' }),
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, color: c.body, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                                    {definition}
                                </Typography>
                                {isMatched && (
                                    <CheckCircleIcon sx={{
                                        position: 'absolute', top: 8, right: 8,
                                        color: c.green.border, fontSize: 22,
                                        animation: 'rm-checkIn 0.5s ease',
                                    }} />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Instructions */}
            <Box sx={{ ...clayCard(c.yellow), p: 2, textAlign: 'center' }}>
                <Typography sx={{ color: c.yellow.text || c.body, fontSize: '0.85rem', fontWeight: 600 }}>
                    {selectedTerm
                        ? `Selected: "${selectedTerm}" — Now click its matching definition`
                        : 'Click a term on the left to select it, then click its matching definition on the right'}
                </Typography>
            </Box>
        </Wrapper>
    );
}
