/**
 * Debate Arena Component
 * An engaging negotiation game where student debates against SKANDER
 * Features: Visual battle arena, persuasion bar, gap-fill dialogue, power-ups
 * Clay/Bento themed, mobile-friendly
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, TextField, Button, IconButton,
    Tooltip, Fade, Grow, Zoom, Slide, Avatar, useTheme
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PersonIcon from '@mui/icons-material/Person';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import './DebateArena.css';

const CHARACTERS = {
    student: {
        name: 'You',
        color: '#4facfe',
        icon: PersonIcon
    },
    skander: {
        name: 'SKANDER',
        color: '#f093fb',
        icon: RecordVoiceOverIcon
    }
};

const POWER_UPS = {
    hint: { icon: <LightbulbIcon />, name: 'Hint', description: 'Reveal part of the answer' },
    skip: { icon: <SkipNextIcon />, name: 'Skip', description: 'Skip this question' },
    double: { icon: <StarIcon />, name: '2X Points', description: 'Double points for next answer' }
};

const useClayColors = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return {
        dark,
        pageBg: dark ? '#0F0F1A' : '#FFFDE7',
        cardBg: dark ? '#1A1A2E' : '#ffffff',
        heading: dark ? '#E8EAFF' : '#1A237E',
        body: dark ? '#B0BEC5' : '#37474F',
        muted: dark ? '#607D8B' : '#78909C',
        divider: dark ? '#2A2A4A' : '#E0E0E0',
        blue: dark
            ? { bg: '#1A2744', border: '#5C9CE6', shadow: '#1565C0' }
            : { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
        green: dark
            ? { bg: '#1A3A2A', border: '#66BB6A', shadow: '#2E7D32' }
            : { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
        purple: dark
            ? { bg: '#2A1A3A', border: '#BA68C8', shadow: '#7B1FA2' }
            : { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
        yellow: dark
            ? { bg: '#2A2A1A', border: '#FFD54F', shadow: '#F9A825', text: '#FFD54F' }
            : { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
        teal: dark
            ? { bg: '#1A2A2E', border: '#4DD0E1', shadow: '#00838F' }
            : { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
        orange: dark
            ? { bg: '#2A2218', border: '#FFB74D', shadow: '#EF6C00' }
            : { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        red: dark
            ? { bg: '#2A1A1A', border: '#EF5350', shadow: '#B71C1C' }
            : { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
    };
};

// Clay card sx helper
const clayCard = (c, color) => ({
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
});

// Clay pill sx helper
const clayPill = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    px: 1.75,
    py: 0.4,
    borderRadius: '50px',
    bgcolor: color.bg,
    border: `2px solid ${color.border}`,
    boxShadow: `2px 2px 0 ${color.shadow}`,
    fontSize: '0.8rem',
    fontWeight: 800,
    color: color.text || color.border,
});

// Clay button sx helper
const clayBtn = (color) => ({
    borderRadius: '14px',
    border: `2px solid ${color.border}`,
    boxShadow: `4px 4px 0 ${color.shadow}`,
    fontWeight: 800,
    textTransform: 'none',
    bgcolor: color.bg,
    color: color.text || color.border,
    minHeight: '44px',
    '&:hover': {
        bgcolor: color.bg,
        transform: 'translate(-2px,-2px)',
        boxShadow: `6px 6px 0 ${color.shadow}`,
    },
    '&:disabled': { opacity: 0.5 },
});

export default function DebateArena({ exercise, onComplete, onProgress }) {
    const c = useClayColors();

    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [persuasion, setPersuasion] = useState(50);
    const [answers, setAnswers] = useState({});
    const [showInput, setShowInput] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [gameState, setGameState] = useState('playing');
    const [combo, setCombo] = useState(0);
    const [doublePointsActive, setDoublePointsActive] = useState(false);
    const [hintsUsed, setHintsUsed] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [shakeCharacter, setShakeCharacter] = useState(null);

    const inputRefs = useRef({});
    const dialogueRef = useRef(null);

    const dialogueLines = exercise?.dialogue_lines || [];
    const correctAnswers = exercise?.correct_answers || [];
    const currentLine = dialogueLines[currentDialogueIndex];

    const currentAnswerIndex = dialogueLines
        .slice(0, currentDialogueIndex + 1)
        .filter(line => line.speaker === 'You').length - 1;

    useEffect(() => {
        if (!currentLine) return;
        setShowInput(false);
        if (currentLine.template) {
            const timer = setTimeout(() => setShowInput(true), 500);
            return () => clearTimeout(timer);
        }
    }, [currentDialogueIndex, currentLine]);

    useEffect(() => {
        if (showInput && inputRefs.current[0]) inputRefs.current[0].focus();
    }, [showInput]);

    useEffect(() => {
        if (dialogueRef.current) dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }, [currentDialogueIndex]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (persuasion >= 85) { setGameState('victory'); handleGameEnd(true); }
        else if (persuasion <= 15) { setGameState('defeat'); handleGameEnd(false); }
    }, [persuasion, gameState]);

    const handleGameEnd = (isVictory) => {
        const xpEarned = isVictory ? 100 + (combo * 10) + totalScore : 25;
        window.dispatchEvent(new CustomEvent('xp-awarded', {
            detail: { xp_amount: xpEarned, reason: isVictory ? 'debate_victory' : 'debate_attempt', new_total: xpEarned }
        }));
        if (onComplete) onComplete({ score: persuasion, isVictory, xpEarned, comboMax: combo, totalScore });
    };

    const getExpectedWords = (answerIndex) => {
        const answer = correctAnswers[answerIndex];
        if (!answer) return [];
        return answer.replace(/^\d+\.\s*/, '').toLowerCase().split(/\s+/).filter(word => word.length > 2);
    };

    const handleAnswerSubmit = () => {
        const userAnswer = Object.values(answers).join(' ').toLowerCase().trim();
        if (!userAnswer) return;
        const expectedWords = getExpectedWords(currentAnswerIndex);
        const matchedWords = expectedWords.filter(word => userAnswer.includes(word.toLowerCase()));
        const matchPercentage = expectedWords.length > 0 ? matchedWords.length / expectedWords.length : 0;
        const isCorrect = matchPercentage >= 0.5;
        const isPartiallyCorrect = matchPercentage >= 0.3;

        let points = 0;
        if (isCorrect) {
            points = doublePointsActive ? 20 : 10;
            setPersuasion(prev => Math.min(100, prev + (doublePointsActive ? 12 : 8)));
            setCombo(prev => prev + 1);
            setShakeCharacter('skander');
        } else if (isPartiallyCorrect) {
            points = 5;
            setPersuasion(prev => Math.min(100, prev + 3));
            setCombo(0);
        } else {
            setPersuasion(prev => Math.max(0, prev - 8));
            setCombo(0);
            setShakeCharacter('student');
        }

        setTotalScore(prev => prev + points);
        setDoublePointsActive(false);
        setFeedback({
            type: isCorrect ? 'success' : isPartiallyCorrect ? 'partial' : 'error',
            message: isCorrect ? `Great! +${points} points` : isPartiallyCorrect ? 'Close! +5 points' : 'Not quite right...',
            correctAnswer: correctAnswers[currentAnswerIndex]
        });

        setTimeout(() => setShakeCharacter(null), 500);
        setTimeout(() => { setFeedback(null); setAnswers({}); setShowHint(false); moveToNextDialogue(); }, 2000);
        if (onProgress) onProgress({ correct: isCorrect, points });
    };

    const moveToNextDialogue = () => {
        if (currentDialogueIndex < dialogueLines.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (gameState === 'playing') {
            if (persuasion >= 50) { setGameState('victory'); handleGameEnd(true); }
            else { setGameState('defeat'); handleGameEnd(false); }
        }
    };

    const handleInputChange = (gapIndex, value) => setAnswers(prev => ({ ...prev, [gapIndex]: value }));
    const handleKeyPress = (e) => { if (e.key === 'Enter') handleAnswerSubmit(); };
    const useHint = () => {
        if (hintsUsed.includes(currentAnswerIndex)) return;
        if (correctAnswers[currentAnswerIndex]) { setHintsUsed(prev => [...prev, currentAnswerIndex]); setShowHint(true); }
    };
    const useSkip = () => { setPersuasion(prev => Math.max(0, prev - 3)); setAnswers({}); moveToNextDialogue(); };
    const useDoublePoints = () => setDoublePointsActive(true);

    const renderTemplate = (template) => {
        if (!template) return null;
        const parts = template.split(/_{3,}/);
        const gapCount = parts.length - 1;
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5, mb: 1.5, flexDirection: { xs: 'column', sm: 'row' }, '& > *': { alignSelf: { xs: 'stretch', sm: 'center' } } }}>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <Typography component="span" sx={{ color: c.body, fontWeight: 600 }}>{part}</Typography>
                        {index < gapCount && (
                            <TextField
                                inputRef={el => inputRefs.current[index] = el}
                                size="small"
                                variant="outlined"
                                value={answers[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="type here..."
                                autoComplete="off"
                                sx={{
                                    mx: { xs: 0, sm: 1 }, minWidth: { xs: '100%', sm: 120 },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        border: `2px solid ${c.blue.border}`,
                                        bgcolor: c.blue.bg,
                                        fontWeight: 700,
                                        minHeight: '44px',
                                        '& fieldset': { border: 'none' },
                                    },
                                    '& .MuiOutlinedInput-input': { color: c.body, p: '8px 12px', fontSize: '0.9rem' },
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    const renderCharacterAvatar = (character) => {
        const CharIcon = CHARACTERS[character].icon;
        const isWinning = character === 'student' ? persuasion > 50 : persuasion < 50;
        const col = character === 'student' ? c.blue : c.purple;
        return (
            <Avatar sx={{
                width: { xs: 56, sm: 80 }, height: { xs: 56, sm: 80 },
                bgcolor: col.bg, border: `2px solid ${col.border}`,
                boxShadow: isWinning ? `0 0 16px ${col.border}` : `3px 3px 0 ${col.shadow}`,
                transition: 'all 0.3s ease',
            }}>
                <CharIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: col.border }} />
            </Avatar>
        );
    };

    const shakeKeyframes = {
        '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-8px)' },
            '50%': { transform: 'translateX(8px)' },
            '75%': { transform: 'translateX(-4px)' },
        },
        '@keyframes pulse': {
            from: { transform: 'scale(1)' },
            to: { transform: 'scale(1.05)' },
        },
        '@keyframes bounce': {
            from: { transform: 'translateY(0)' },
            to: { transform: 'translateY(-10px)' },
        },
    };

    const renderGameEnd = () => {
        const isVictory = gameState === 'victory';
        const col = isVictory ? c.green : c.red;
        return (
            <Zoom in>
                <Box sx={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                    bgcolor: c.dark ? 'rgba(15,15,26,0.92)' : 'rgba(255,253,231,0.92)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <Box sx={{
                        ...clayCard(c, col), p: { xs: 3, sm: 4 }, mx: 2, maxWidth: 400, width: '100%', textAlign: 'center',
                    }}>
                        <Box sx={{ mb: 2 }}>
                            {isVictory ? (
                                <EmojiEventsIcon sx={{ fontSize: { xs: '3.5rem', sm: '5rem' }, color: c.yellow.border, filter: `drop-shadow(0 4px 12px ${c.yellow.shadow})`, animation: 'bounce 0.6s ease infinite alternate', ...shakeKeyframes }} />
                            ) : (
                                <SentimentVeryDissatisfiedIcon sx={{ fontSize: { xs: '3.5rem', sm: '5rem' }, color: c.red.border, filter: `drop-shadow(0 4px 12px ${c.red.shadow})` }} />
                            )}
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: c.heading, mb: 0.5, fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                            {isVictory ? 'Victory!' : 'Nice Try!'}
                        </Typography>
                        <Typography sx={{ color: c.body, mb: 2, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                            {isVictory ? 'You convinced SKANDER with your negotiation skills!' : "SKANDER won this round. Practice makes perfect!"}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2.5 }}>
                            <Box sx={clayPill(c.blue)}><StarIcon sx={{ fontSize: 16 }} /> Score: {totalScore}</Box>
                            <Box sx={clayPill(c.purple)}>Max Combo: {combo}x</Box>
                            <Box sx={clayPill(isVictory ? c.green : c.orange)}>Persuasion: {Math.round(persuasion)}%</Box>
                        </Box>
                        <Button sx={clayBtn(c.purple)} onClick={() => {
                            setGameState('playing'); setCurrentDialogueIndex(0); setPersuasion(50);
                            setAnswers({}); setCombo(0); setTotalScore(0); setHintsUsed([]); setShowHint(false);
                        }}>
                            Play Again
                        </Button>
                    </Box>
                </Box>
            </Zoom>
        );
    };

    if (!exercise || dialogueLines.length === 0) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, ...clayCard(c, c.blue), p: 3 }}>
                <Typography sx={{ color: c.muted }}>No dialogue data available for this activity.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            position: 'relative', display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 },
            p: { xs: 1.5, sm: 2.5 }, minHeight: '80vh', bgcolor: c.pageBg, borderRadius: '20px', overflow: 'hidden',
            ...shakeKeyframes,
        }}>
            {/* Arena Header */}
            <Fade in timeout={500}>
                <Box sx={{ ...clayCard(c, c.purple), p: { xs: 1.5, sm: 2 }, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                        <RecordVoiceOverIcon sx={{ color: c.purple.border }} />
                        <Typography variant="h5" sx={{ fontWeight: 900, color: c.heading, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                            Debate Arena
                        </Typography>
                    </Box>
                    <Typography sx={{ color: c.muted, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {exercise.instruction}
                    </Typography>
                    {combo > 0 && (
                        <Grow in>
                            <Box sx={{ ...clayPill(c.orange), mt: 1, display: 'inline-flex', animation: 'pulse 0.5s ease-in-out infinite alternate' }}>
                                <LocalFireDepartmentIcon sx={{ fontSize: 16 }} /> {combo}x Combo!
                            </Box>
                        </Grow>
                    )}
                </Box>
            </Fade>

            {/* Character Arena */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: { xs: 1, sm: 2 }, p: { xs: 0.5, sm: 1 } }}>
                {/* Student */}
                <Grow in timeout={600}>
                    <Box sx={{
                        ...clayCard(c, c.blue), flex: 1, maxWidth: { xs: '100%', sm: 200 }, width: '100%',
                        p: { xs: 1.5, sm: 2 }, textAlign: { xs: 'left', sm: 'center' },
                        display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: 'center', gap: 1.5,
                        animation: shakeCharacter === 'student' ? 'shake 0.5s ease-in-out' : 'none',
                        transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-3px)' },
                    }}>
                        {renderCharacterAvatar('student')}
                        <Box>
                            <Typography sx={{ fontWeight: 800, color: c.heading, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>{CHARACTERS.student.name}</Typography>
                            <Typography variant="caption" sx={{ color: c.muted, fontWeight: 700 }}>Your Persuasion</Typography>
                            <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: c.divider, overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', width: `${Math.max(0, persuasion - 50) * 2}%`, bgcolor: c.blue.border, borderRadius: 3, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${c.blue.border}` }} />
                            </Box>
                        </Box>
                    </Box>
                </Grow>

                {/* VS Badge */}
                <Zoom in timeout={800}>
                    <Box sx={{
                        width: { xs: 44, sm: 60 }, height: { xs: 44, sm: 60 }, flexShrink: 0,
                        bgcolor: c.purple.bg, border: `2px solid ${c.purple.border}`, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `3px 3px 0 ${c.purple.shadow}`,
                    }}>
                        <Typography sx={{ fontWeight: 900, color: c.purple.border, fontSize: { xs: '1rem', sm: '1.3rem' } }}>VS</Typography>
                    </Box>
                </Zoom>

                {/* SKANDER */}
                <Grow in timeout={600}>
                    <Box sx={{
                        ...clayCard(c, c.red), flex: 1, maxWidth: { xs: '100%', sm: 200 }, width: '100%',
                        p: { xs: 1.5, sm: 2 }, textAlign: { xs: 'left', sm: 'center' },
                        display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: 'center', gap: 1.5,
                        animation: shakeCharacter === 'skander' ? 'shake 0.5s ease-in-out' : 'none',
                        transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-3px)' },
                    }}>
                        {renderCharacterAvatar('skander')}
                        <Box>
                            <Typography sx={{ fontWeight: 800, color: c.heading, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>{CHARACTERS.skander.name}</Typography>
                            <Typography variant="caption" sx={{ color: c.muted, fontWeight: 700 }}>SKANDER's Lead</Typography>
                            <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: c.divider, overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', width: `${Math.max(0, 50 - persuasion) * 2}%`, bgcolor: c.red.border, borderRadius: 3, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${c.red.border}`, ml: 'auto' }} />
                            </Box>
                        </Box>
                    </Box>
                </Grow>
            </Box>

            {/* Persuasion Tug-of-War Bar */}
            <Box sx={{
                ...clayCard(c, c.teal), p: { xs: 1.5, sm: 2 },
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1,
            }}>
                <Typography sx={{ fontWeight: 800, color: c.blue.border, fontSize: '0.8rem', minWidth: 60, textAlign: { xs: 'center', sm: 'right' } }}>You</Typography>
                <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                    <Box sx={{ height: 20, bgcolor: c.divider, borderRadius: '10px', position: 'relative', overflow: 'hidden', border: `2px solid ${c.teal.border}` }}>
                        <Box sx={{
                            position: 'absolute', left: 0, top: 0, height: '100%', width: `${persuasion}%`,
                            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '8px',
                            bgcolor: persuasion >= 50 ? c.blue.border : c.red.border,
                        }} />
                        <Box sx={{
                            position: 'absolute', top: -4, left: `${persuasion}%`, width: 4, height: 28,
                            bgcolor: c.heading, borderRadius: '2px', transform: 'translateX(-50%)',
                            transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: `0 0 8px ${c.heading}`,
                        }} />
                    </Box>
                </Box>
                <Typography sx={{ fontWeight: 800, color: c.red.border, fontSize: '0.8rem', minWidth: 60, textAlign: { xs: 'center', sm: 'left' } }}>SKANDER</Typography>
            </Box>

            {/* Dialogue Area */}
            <Box ref={dialogueRef} sx={{
                ...clayCard(c, { bg: c.cardBg, border: c.divider, shadow: c.divider }),
                flex: 1, minHeight: { xs: 200, sm: 250 }, maxHeight: { xs: 280, sm: 350 },
                overflowY: 'auto', p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': { bgcolor: c.divider, borderRadius: 3 },
                '&::-webkit-scrollbar-thumb': { bgcolor: c.muted, borderRadius: 3 },
            }}>
                {dialogueLines.slice(0, currentDialogueIndex + 1).map((line, index) => {
                    const isCurrentLine = index === currentDialogueIndex;
                    const isUserLine = line.speaker === 'You';
                    const bubbleColor = isUserLine ? c.blue : c.red;

                    return (
                        <Slide key={index} direction={isUserLine ? 'left' : 'right'} in timeout={400}>
                            <Box sx={{
                                maxWidth: { xs: '92%', sm: '80%' }, alignSelf: isUserLine ? 'flex-end' : 'flex-start',
                                p: { xs: 1.25, sm: 1.5 },
                                bgcolor: bubbleColor.bg, border: `2px solid ${bubbleColor.border}`,
                                borderRadius: '16px',
                                borderBottomRightRadius: isUserLine ? '4px' : '16px',
                                borderBottomLeftRadius: !isUserLine ? '4px' : '16px',
                                boxShadow: `3px 3px 0 ${bubbleColor.shadow}`,
                            }}>
                                <Typography sx={{ fontWeight: 800, color: bubbleColor.border, fontSize: '0.8rem', mb: 0.5 }}>
                                    {line.speaker}
                                </Typography>

                                {isUserLine && line.template ? (
                                    showInput ? (
                                        <>
                                            {renderTemplate(line.template)}
                                            {showHint && (
                                                <Fade in>
                                                    <Box sx={{
                                                        ...clayCard(c, c.yellow), p: 1, mt: 1,
                                                        display: 'flex', alignItems: 'center', gap: 0.5,
                                                        border: `2px dashed ${c.yellow.border}`,
                                                    }}>
                                                        <LightbulbIcon sx={{ fontSize: 16, color: c.yellow.border }} />
                                                        <Typography sx={{ fontSize: '0.8rem', color: c.yellow.text || c.yellow.border, fontWeight: 700 }}>
                                                            Hint: {correctAnswers[currentAnswerIndex]?.replace(/^\d+\.\s*/, '').split(' ').slice(0, 3).join(' ')}...
                                                        </Typography>
                                                    </Box>
                                                </Fade>
                                            )}
                                            <Button
                                                sx={{ ...clayBtn(c.green), mt: 1, width: { xs: '100%', sm: 'auto' }, px: 3 }}
                                                onClick={handleAnswerSubmit}
                                                disabled={Object.keys(answers).length === 0 || Object.values(answers).every(v => !v)}
                                            >
                                                Send Response
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography sx={{ color: c.muted, fontStyle: 'italic', fontSize: '0.9rem' }}>
                                            Your turn to respond...
                                        </Typography>
                                    )
                                ) : (
                                    <>
                                        <Typography sx={{ color: c.body, lineHeight: 1.6, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                                            {line.text}
                                        </Typography>
                                        {isCurrentLine && !isUserLine && (
                                            <Button
                                                sx={{ ...clayBtn(c.blue), mt: 1, minHeight: 36, fontSize: '0.8rem', px: 2 }}
                                                onClick={moveToNextDialogue}
                                            >
                                                Continue
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Slide>
                    );
                })}

                {/* Feedback popup */}
                {feedback && (
                    <Zoom in>
                        <Box sx={{
                            alignSelf: 'center',
                            ...(feedback.type === 'success' ? clayCard(c, c.green) : feedback.type === 'partial' ? clayCard(c, c.orange) : clayCard(c, c.red)),
                            p: 1.5, textAlign: 'center', mt: 1,
                        }}>
                            <Typography sx={{ fontWeight: 800, color: feedback.type === 'success' ? c.green.border : feedback.type === 'partial' ? c.orange.border : c.red.border }}>
                                {feedback.message}
                            </Typography>
                            {feedback.type !== 'success' && feedback.correctAnswer && (
                                <Typography sx={{ fontSize: '0.8rem', color: c.muted, mt: 0.5 }}>
                                    Correct: {feedback.correctAnswer?.replace(/^\d+\.\s*/, '') || feedback.correctAnswer}
                                </Typography>
                            )}
                        </Box>
                    </Zoom>
                )}
            </Box>

            {/* Power-ups Bar */}
            <Fade in timeout={900}>
                <Box sx={{
                    ...clayCard(c, { bg: c.cardBg, border: c.divider, shadow: c.divider }),
                    p: { xs: 1, sm: 1.5 }, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap',
                }}>
                    {[
                        { key: 'hint', col: c.yellow, onClick: useHint, disabled: hintsUsed.includes(currentAnswerIndex) || !showInput, label: 'Hint' },
                        { key: 'skip', col: c.purple, onClick: useSkip, disabled: !showInput, label: 'Skip' },
                        { key: 'double', col: c.orange, onClick: useDoublePoints, disabled: doublePointsActive || !showInput, label: '2X' },
                    ].map(({ key, col, onClick, disabled, label }) => (
                        <Tooltip key={key} title={POWER_UPS[key].description} arrow>
                            <span>
                                <Button
                                    sx={{
                                        ...clayBtn(col),
                                        flexDirection: 'column', gap: 0.25, px: { xs: 1.5, sm: 2 }, py: 1,
                                        minWidth: { xs: 60, sm: 72 }, minHeight: 56,
                                        ...(key === 'double' && doublePointsActive ? { bgcolor: col.bg, boxShadow: `0 0 12px ${col.border}, 4px 4px 0 ${col.shadow}` } : {}),
                                    }}
                                    onClick={onClick}
                                    disabled={disabled}
                                >
                                    <Box sx={{ color: col.border, display: 'flex' }}>{POWER_UPS[key].icon}</Box>
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: col.text || col.border }}>{label}</Typography>
                                </Button>
                            </span>
                        </Tooltip>
                    ))}

                    {doublePointsActive && (
                        <Box sx={{ ...clayPill(c.orange), animation: 'pulse 0.5s ease infinite alternate' }}>
                            2X Active!
                        </Box>
                    )}
                </Box>
            </Fade>

            {/* Score display */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={clayPill(c.blue)}>
                    <StarIcon sx={{ fontSize: 16 }} /> Score: {totalScore}
                </Box>
            </Box>

            {/* Victory/Defeat Overlay */}
            {(gameState === 'victory' || gameState === 'defeat') && renderGameEnd()}
        </Box>
    );
}
