/**
 * Signal Decoder Component
 * Tech/Repair themed component for listening_dialogue_gap_fill and listening_role_play
 * Clay/Bento theme with dark mode support
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Box, Typography, TextField, Button, LinearProgress, useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StarIcon from '@mui/icons-material/Star';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import './SignalDecoder.css';

const useClayColors = () => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';
    return useMemo(() => ({
        pageBg: dark ? '#121212' : '#FFFDE7',
        cardBg: dark ? '#1e1e1e' : '#ffffff',
        heading: dark ? '#90CAF9' : '#1A237E',
        body: dark ? '#B0BEC5' : '#37474F',
        muted: dark ? '#607D8B' : '#78909C',
        divider: dark ? '#333' : '#E0E0E0',
        blue: { bg: dark ? '#1A237E' : '#BBDEFB', border: dark ? '#42A5F5' : '#1976D2', shadow: dark ? '#0D47A1' : '#1976D2' },
        green: { bg: dark ? '#1B5E20' : '#C8E6C9', border: dark ? '#66BB6A' : '#388E3C', shadow: dark ? '#2E7D32' : '#388E3C' },
        purple: { bg: dark ? '#4A148C' : '#E1BEE7', border: dark ? '#BA68C8' : '#8E24AA', shadow: dark ? '#6A1B9A' : '#8E24AA' },
        yellow: { bg: dark ? '#F57F17' : '#FFF9C4', border: dark ? '#FFD54F' : '#F9A825', shadow: dark ? '#E65100' : '#F9A825', text: dark ? '#FFF8E1' : '#5D4037' },
        teal: { bg: dark ? '#004D40' : '#B2EBF2', border: dark ? '#4DD0E1' : '#0097A7', shadow: dark ? '#00695C' : '#0097A7' },
        orange: { bg: dark ? '#BF360C' : '#FFE0B2', border: dark ? '#FF8A65' : '#F57C00', shadow: dark ? '#D84315' : '#F57C00' },
        red: { bg: dark ? '#B71C1C' : '#FFCDD2', border: dark ? '#EF5350' : '#C62828', shadow: dark ? '#C62828' : '#C62828' },
    }), [dark]);
};

const clayCard = (c, color) => ({
    bgcolor: c.cardBg,
    border: `2px solid ${color.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${color.shadow}`,
    p: { xs: 2.5, sm: 3 },
});

const clayPill = (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 0.5,
    px: 1.75, py: 0.4, borderRadius: '50px',
    bgcolor: color.bg, border: `2px solid ${color.border}`,
    boxShadow: `2px 2px 0 ${color.shadow}`,
    fontSize: '0.8rem', fontWeight: 800,
});

const clayBtn = (color) => ({
    borderRadius: '14px', border: `2px solid ${color.border}`,
    boxShadow: `4px 4px 0 ${color.shadow}`,
    fontWeight: 800, textTransform: 'none',
    bgcolor: color.bg, color: color.text || color.border,
    minHeight: '44px',
    '&:hover': {
        bgcolor: color.bg, transform: 'translate(-2px,-2px)',
        boxShadow: `6px 6px 0 ${color.shadow}`,
    },
});

export default function SignalDecoder({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [repairProgress, setRepairProgress] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [signalStrength, setSignalStrength] = useState(100);
    const [score, setScore] = useState(0);
    const [glitchEffect, setGlitchEffect] = useState(false);

    const inputRefs = useRef({});
    const c = useClayColors();

    const dialogueLines = exercise?.dialogue_lines || [];
    const wordBank = exercise?.word_bank || [];
    const correctAnswers = exercise?.correct_answers || [];
    const guidedQuestions = exercise?.guided_questions || [];

    // Get user lines (lines with templates)
    const userLines = dialogueLines.filter(line => line.template);

    // Calculate repair progress
    useEffect(() => {
        const filledCount = Object.values(answers).filter(v => v && v.trim()).length;
        const totalGaps = userLines.reduce((sum, line) => {
            const gaps = (line.template?.match(/_{3,}/g) || []).length;
            return sum + gaps;
        }, 0);
        setRepairProgress(totalGaps > 0 ? (filledCount / totalGaps) * 100 : 0);
    }, [answers, userLines]);

    const handlePlayAudio = useCallback(() => {
        if (!exercise?.audio_script) return;

        setAudioPlaying(true);
        setGlitchEffect(true);

        const interferenceInterval = setInterval(() => {
            setSignalStrength(prev => Math.max(20, prev - Math.random() * 30 + 15));
        }, 500);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(exercise.audio_script);
            utterance.rate = 0.85;
            utterance.onend = () => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setGlitchEffect(false);
                setSignalStrength(100);
                clearInterval(interferenceInterval);
            };
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setGlitchEffect(false);
                setSignalStrength(100);
                clearInterval(interferenceInterval);
            }, 4000);
        }
    }, [exercise?.audio_script]);

    const startGame = () => {
        setGameStarted(true);
        setCurrentLineIndex(0);
        setAnswers({});
        setScore(0);
        setFeedback(null);
    };

    const handleInputChange = (lineIndex, gapIndex, value) => {
        const key = `${lineIndex}-${gapIndex}`;
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleRepairLine = () => {
        const currentLine = userLines[currentLineIndex];
        if (!currentLine) return;

        const template = currentLine.template;
        const gaps = (template.match(/_{3,}/g) || []).length;

        let correctCount = 0;
        const correctAnswer = correctAnswers[currentLineIndex];

        for (let i = 0; i < gaps; i++) {
            const userAnswer = answers[`${currentLineIndex}-${i}`]?.toLowerCase().trim();
            if (userAnswer && correctAnswer?.toLowerCase().includes(userAnswer)) {
                correctCount++;
            }
        }

        const isFullyCorrect = correctCount === gaps;
        const points = isFullyCorrect ? 20 : correctCount * 5;

        setScore(prev => prev + points);

        if (isFullyCorrect) {
            setFeedback({ type: 'success', message: `Signal repaired! +${points} points` });
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        } else if (correctCount > 0) {
            setFeedback({ type: 'partial', message: `Partial repair: ${correctCount}/${gaps} gaps fixed` });
        } else {
            setFeedback({ type: 'error', message: 'Signal still corrupted...' });
            setGlitchEffect(true);
            setTimeout(() => setGlitchEffect(false), 500);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }

        if (onProgress) {
            onProgress({ correct: isFullyCorrect, points });
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentLineIndex < userLines.length - 1) {
                setCurrentLineIndex(prev => prev + 1);
            } else {
                if (onComplete) {
                    onComplete({
                        score,
                        correctCount: Math.round(repairProgress / 100 * userLines.length),
                        totalCount: userLines.length,
                        isPerfect: repairProgress === 100
                    });
                }
            }
        }, 1500);
    };

    // Render glitch text effect
    const renderGlitchText = (text) => {
        if (!glitchEffect) return text;
        const glitchChars = '\u2588\u2593\u2592\u2591\u2554\u2557\u255A\u255D\u2551\u2550';
        return text.split('').map((char, i) => {
            if (Math.random() > 0.7) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
    };

    // Render template with inputs
    const renderTemplate = (template, lineIndex) => {
        const parts = template.split(/_{3,}/);
        const gapCount = parts.length - 1;

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2.5 }}>
                {parts.map((part, idx) => (
                    <React.Fragment key={idx}>
                        <Typography
                            component="span"
                            sx={{
                                color: c.body, fontSize: '1rem', fontWeight: 600,
                                ...(glitchEffect && { animation: 'textGlitch 0.2s infinite', color: c.red.border }),
                            }}
                        >
                            {renderGlitchText(part)}
                        </Typography>
                        {idx < gapCount && (
                            <TextField
                                inputRef={el => inputRefs.current[`${lineIndex}-${idx}`] = el}
                                size="small"
                                variant="outlined"
                                value={answers[`${lineIndex}-${idx}`] || ''}
                                onChange={(e) => handleInputChange(lineIndex, idx, e.target.value)}
                                placeholder="[REPAIR]"
                                autoComplete="off"
                                sx={{
                                    minWidth: { xs: '100px', sm: '130px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        border: `2px solid ${c.teal.border}`,
                                        bgcolor: c.teal.bg,
                                        fontWeight: 700, textAlign: 'center',
                                        '& fieldset': { border: 'none' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: c.heading, fontWeight: 700, textAlign: 'center',
                                        minHeight: '44px', boxSizing: 'border-box',
                                        py: 1,
                                    },
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    const feedbackColors = { success: c.green, partial: c.yellow, error: c.red };

    // Audio instruction screen
    if (!audioPlayed && exercise?.audio_script) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 2.5 } }}>
                <Box sx={{ ...clayCard(c, c.purple), textAlign: 'center', p: { xs: 3, sm: 5 } }}>
                    {/* Signal icon */}
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                        <SignalWifiStatusbar4BarIcon
                            sx={{
                                fontSize: 72, color: c.purple.border,
                                ...(audioPlaying && { animation: 'pulse 1s infinite' }),
                            }}
                        />
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                            {[1, 2, 3].map(i => (
                                <Box key={i} sx={{
                                    position: 'absolute',
                                    border: `2px solid ${c.purple.border}`,
                                    borderRadius: '50%', opacity: 0,
                                    width: 60 + i * 40, height: 60 + i * 40,
                                    top: -(30 + i * 20), left: -(30 + i * 20),
                                    animation: audioPlaying ? `ringPulse 2s infinite ${(i - 1) * 0.4}s` : 'none',
                                }} />
                            ))}
                        </Box>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 900, color: c.heading, mb: 1 }}>
                        Incoming Signal
                    </Typography>
                    <Typography sx={{ color: c.muted, mb: 3, fontSize: '1rem' }}>
                        A corrupted transmission has been detected. Listen to decode the message.
                    </Typography>

                    {/* Signal strength meter */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mx: 'auto', maxWidth: 300, mb: 3 }}>
                        <Typography variant="caption" sx={{ color: c.muted, fontWeight: 700 }}>Signal</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={signalStrength}
                            sx={{
                                flex: 1, height: 10, borderRadius: 5,
                                bgcolor: c.divider,
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: signalStrength < 50 ? c.red.border : c.green.border,
                                    borderRadius: 5,
                                    ...(signalStrength < 50 && { animation: 'flicker 0.3s infinite' }),
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: c.muted, fontWeight: 700 }}>
                            {Math.round(signalStrength)}%
                        </Typography>
                    </Box>

                    {/* Waveform */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px', height: 60, mb: 3 }}>
                        {[...Array(20)].map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: { xs: 4, sm: 8 }, borderRadius: 4,
                                    bgcolor: c.purple.border,
                                    transition: 'height 0.1s ease',
                                    height: audioPlaying ? `${20 + Math.random() * 40}px` : '10px',
                                    ...(audioPlaying && { animation: `waveAnim 0.5s ease-in-out infinite alternate`, animationDelay: `${i * 0.05}s` }),
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={audioPlaying ? <VolumeUpIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayAudio}
                        disabled={audioPlaying}
                        sx={{
                            ...clayBtn(c.purple),
                            px: { xs: 3, sm: 5 }, py: 1.5,
                            fontSize: { xs: '0.95rem', sm: '1.1rem' },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        {audioPlaying ? 'Receiving...' : 'Receive Transmission'}
                    </Button>
                </Box>
            </Box>
        );
    }

    // Start game screen
    if (!gameStarted) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 2.5 } }}>
                <Box sx={{ ...clayCard(c, c.blue), textAlign: 'center', p: { xs: 3, sm: 5 } }}>
                    <BuildIcon sx={{ fontSize: 72, color: c.blue.border, mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: c.heading, mb: 1 }}>
                        Signal Decoder
                    </Typography>
                    <Typography sx={{ color: c.muted, mb: 2 }}>
                        {exercise?.instruction || 'Repair the corrupted transmission by filling in the missing words.'}
                    </Typography>
                    <Typography sx={{ color: c.body, mb: 3, fontWeight: 700 }}>
                        {userLines.length} corrupted segments to repair
                    </Typography>

                    {wordBank.length > 0 && (
                        <Box sx={{
                            bgcolor: c.blue.bg, border: `2px solid ${c.blue.border}`,
                            borderRadius: '16px', p: 2, mb: 3,
                        }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: c.blue.border }}>
                                Available repair tools:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: 'center' }}>
                                {wordBank.map((word, i) => (
                                    <Box key={i} sx={clayPill(c.teal)}>
                                        {word}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={startGame}
                        startIcon={<BuildIcon />}
                        sx={{
                            ...clayBtn(c.blue),
                            px: 4, py: 1.5,
                            fontSize: '1.05rem',
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        Begin Repair
                    </Button>
                </Box>
            </Box>
        );
    }

    // Game complete
    if (currentLineIndex >= userLines.length) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 2.5 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ ...clayCard(c, c.green), textAlign: 'center', p: { xs: 3, sm: 5 }, width: '100%' }}>
                    <CheckCircleIcon sx={{ fontSize: 88, color: c.green.border, mb: 2, animation: 'bounce 2s infinite' }} />
                    <Typography variant="h3" sx={{ fontWeight: 900, color: c.heading }}>
                        Transmission Restored!
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 800, color: c.body }}>
                        Score: {score}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 2 }}>
                        <Box sx={{
                            ...clayPill(repairProgress === 100 ? c.green : c.blue),
                            display: 'inline-flex', alignItems: 'center', gap: 0.5,
                        }}>
                            <StarIcon sx={{ fontSize: 16 }} />
                            {Math.round(repairProgress)}% Repaired
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => { setGameStarted(false); setAudioPlayed(false); }}
                        startIcon={<ReplayIcon />}
                        sx={{
                            ...clayBtn(c.green), mt: 3, px: 4, py: 1.5,
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        New Transmission
                    </Button>
                </Box>
            </Box>
        );
    }

    const currentLine = userLines[currentLineIndex];

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 2.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header */}
            <Box sx={{
                ...clayCard(c, c.purple),
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 1, p: { xs: 1.5, sm: 2 },
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SignalWifiStatusbar4BarIcon sx={{ color: c.purple.border }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: c.heading, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                        Signal Decoder
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={clayPill(c.yellow)}>
                        <StarIcon sx={{ fontSize: 14 }} /> {score}
                    </Box>
                    <Box sx={clayPill(c.blue)}>
                        {currentLineIndex + 1}/{userLines.length}
                    </Box>
                </Box>
            </Box>

            {/* Repair Progress */}
            <Box sx={{
                ...clayCard(c, c.green),
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: { xs: 1.5, sm: 2 },
            }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: c.green.border, whiteSpace: 'nowrap' }}>
                    Repair
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={repairProgress}
                    sx={{
                        flex: 1, height: 10, borderRadius: 5,
                        bgcolor: c.divider,
                        border: `1px solid ${c.green.border}`,
                        '& .MuiLinearProgress-bar': { bgcolor: c.green.border, borderRadius: 5 },
                    }}
                />
                <Typography variant="caption" sx={{ fontWeight: 800, color: c.green.border }}>
                    {Math.round(repairProgress)}%
                </Typography>
            </Box>

            {/* Word Bank */}
            {wordBank.length > 0 && (
                <Box sx={clayCard(c, c.teal)}>
                    <Typography sx={{ fontWeight: 800, color: c.teal.border, fontSize: '0.85rem', mb: 1 }}>
                        Repair Tools (Word Bank)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {wordBank.map((word, i) => (
                            <Box
                                key={i}
                                onClick={() => {
                                    const template = currentLine.template;
                                    const gaps = (template.match(/_{3,}/g) || []).length;
                                    for (let g = 0; g < gaps; g++) {
                                        if (!answers[`${currentLineIndex}-${g}`]) {
                                            handleInputChange(currentLineIndex, g, word);
                                            break;
                                        }
                                    }
                                }}
                                sx={{
                                    ...clayPill(c.green),
                                    cursor: 'pointer', minHeight: '44px', display: 'inline-flex', alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${c.green.shadow}` },
                                    '&:active': { transform: 'translate(1px,1px)', boxShadow: `1px 1px 0 ${c.green.shadow}` },
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Feedback */}
            {feedback && (
                <Box sx={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 4, py: 2.5, borderRadius: '20px', zIndex: 1000,
                    bgcolor: feedbackColors[feedback.type]?.bg,
                    border: `2px solid ${feedbackColors[feedback.type]?.border}`,
                    boxShadow: `4px 4px 0 ${feedbackColors[feedback.type]?.shadow}`,
                    animation: feedback.type === 'error' ? 'glitchShake 0.5s ease' : 'popIn 0.3s ease',
                }}>
                    {feedback.type === 'success' && <CheckCircleIcon sx={{ color: c.green.border }} />}
                    {feedback.type === 'error' && <ErrorIcon sx={{ color: c.red.border }} />}
                    <Typography sx={{ fontWeight: 800, color: c.heading }}>{feedback.message}</Typography>
                </Box>
            )}

            {/* Corrupted Line Display */}
            <Box sx={{
                ...clayCard(c, c.orange),
                ...(glitchEffect && { animation: 'glitchContainer 0.3s ease' }),
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography sx={{ fontWeight: 800, color: c.orange.border, fontSize: '0.95rem' }}>
                        {currentLine.speaker}:
                    </Typography>
                    <Box sx={clayPill(c.red)}>CORRUPTED</Box>
                </Box>

                {currentLine.template && renderTemplate(currentLine.template, currentLineIndex)}

                <Button
                    variant="contained"
                    onClick={handleRepairLine}
                    startIcon={<BuildIcon />}
                    fullWidth
                    sx={{
                        ...clayBtn(c.purple),
                        py: 1.5, fontSize: '1rem',
                    }}
                >
                    Repair Segment
                </Button>
            </Box>

            {/* All dialogue lines display */}
            <Box sx={clayCard(c, c.blue)}>
                <Typography sx={{ fontWeight: 800, color: c.blue.border, fontSize: '0.85rem', mb: 1.5 }}>
                    Full Transmission:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {dialogueLines.map((line, idx) => {
                        const isRepaired = idx < currentLineIndex && line.template;
                        const isCurrent = idx === currentLineIndex;
                        const needsRepair = !!line.template;
                        const lineColor = isRepaired ? c.green : isCurrent ? c.purple : needsRepair ? c.red : c.blue;

                        return (
                            <Box key={idx} sx={{
                                p: 1.5, borderRadius: '12px', position: 'relative',
                                bgcolor: lineColor.bg,
                                borderLeft: `4px solid ${lineColor.border}`,
                                ...(isCurrent && { boxShadow: `3px 3px 0 ${lineColor.shadow}` }),
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: lineColor.border }}>
                                    {line.speaker}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.body, mt: 0.25 }}>
                                    {line.text || (idx <= currentLineIndex ? line.template?.replace(/_{3,}/g, '[___]') : '[CORRUPTED]')}
                                </Typography>
                                {isRepaired && (
                                    <CheckCircleIcon sx={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)', color: c.green.border, fontSize: 20,
                                    }} />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
