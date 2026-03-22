/**
 * Chat Messenger Sim Component
 * Digital Communication themed component for listening_story_writing, listening_research, listening_reflection
 * Features: Chat bubble interface, Typing indicators, Emoji reactions, Voice notes
 * Clay/Bento theme with dark mode support
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, TextField, Button, IconButton, Avatar,
    LinearProgress, useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';

// Team avatars
const TEAM_AVATARS = {
    'Emna': { color: '#FF6B9D', initials: 'EM' },
    'Ryan': { color: '#4D96FF', initials: 'RY' },
    'Lilia': { color: '#6BCF7F', initials: 'LI' },
    'SKANDER': { color: '#FFD93D', initials: 'SK' },
    'Ms. Mabrouki': { color: '#9D84B7', initials: 'MM' },
    'Team': { color: '#667eea', initials: 'TM' },
    'Manager': { color: '#f5576c', initials: 'MG' }
};

const EMOJI_REACTIONS = ['👍', '❤️', '🎉', '🔥', '👏'];

export default function ChatMessengerSim({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [score, setScore] = useState(0);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    const c = dark
        ? {
            pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5',
            muted: '#607D8B', divider: '#2A2A4A',
            blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
            green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
            purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#6A1B9A' },
            yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
            teal: { bg: '#001A1F', border: '#4DD0E1', shadow: '#00695C' },
            orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
        }
        : {
            pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F',
            muted: '#78909C', divider: '#E0E0E0',
            blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
            green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
            purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
            yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
            teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
            orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
        };

    const audioScript = exercise?.audio_script || '';
    const templates = exercise?.templates || [];
    const guidedQuestions = exercise?.guided_questions || [];

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle audio playback
    const handlePlayAudio = useCallback(() => {
        setAudioPlaying(true);

        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'voice',
            sender: 'Team',
            content: audioScript,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'playing'
        }]);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(audioScript);
            utterance.rate = 0.9;
            utterance.onend = () => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setMessages(prev => prev.map(msg =>
                    msg.type === 'voice' ? { ...msg, status: 'played' } : msg
                ));
                setTimeout(() => { addPromptMessage(); }, 1000);
            };
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setMessages(prev => prev.map(msg =>
                    msg.type === 'voice' ? { ...msg, status: 'played' } : msg
                ));
                setTimeout(() => { addPromptMessage(); }, 1000);
            }, 3000);
        }
    }, [audioScript]);

    const addPromptMessage = () => {
        const prompt = guidedQuestions[currentPromptIndex] || templates[currentPromptIndex];
        if (!prompt) return;

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'prompt',
                sender: 'Team',
                content: prompt,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: []
            }]);
            inputRef.current?.focus();
        }, 1500);
    };

    const handleSendMessage = () => {
        if (!currentInput.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            sender: 'You',
            content: currentInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            reactions: []
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentInput('');

        const exampleAnswer = exercise?.example_of_answers?.[currentPromptIndex] || '';
        const keywords = exampleAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchedKeywords = keywords.filter(kw => currentInput.toLowerCase().includes(kw));
        const points = Math.min(20, 5 + matchedKeywords.length * 3 + Math.floor(currentInput.length / 20));

        setScore(prev => prev + points);

        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
            ));
        }, 500);

        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
            ));
            if (points >= 10) {
                setMessages(prev => prev.map(msg =>
                    msg.id === userMessage.id ? { ...msg, reactions: ['👍', '🎉'] } : msg
                ));
            }
        }, 1000);

        if (onProgress) {
            onProgress({ correct: points >= 10, points });
        }

        const nextIndex = currentPromptIndex + 1;
        if (nextIndex < Math.max(templates.length, guidedQuestions.length)) {
            setCurrentPromptIndex(nextIndex);
            setTimeout(() => { addPromptMessage(); }, 2000);
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'system',
                    content: 'Great conversation! All questions answered.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                if (onComplete) {
                    onComplete({
                        score,
                        correctCount: currentPromptIndex + 1,
                        totalCount: Math.max(templates.length, guidedQuestions.length),
                        isPerfect: true
                    });
                }
            }, 1500);
        }
    };

    const handleReaction = (messageId, emoji) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                if (reactions.includes(emoji)) {
                    return { ...msg, reactions: reactions.filter(r => r !== emoji) };
                } else {
                    return { ...msg, reactions: [...reactions, emoji] };
                }
            }
            return msg;
        }));
        setShowEmojiPicker(null);
        if (navigator.vibrate) navigator.vibrate(30);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /* ─── shared clay card style ─── */
    const cardSx = {
        bgcolor: c.cardBg,
        border: `2px solid ${c.purple.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${c.purple.shadow}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'calc(100dvh - 32px)', sm: 600 },
        maxHeight: { xs: 700, sm: 600 },
    };

    /* ─── clay header ─── */
    const headerSx = {
        display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5,
        bgcolor: c.purple.bg,
        borderBottom: `2px solid ${c.purple.border}`,
    };

    /* ─── pill ─── */
    const pillSx = {
        display: 'inline-flex', alignItems: 'center', gap: 0.5,
        px: 1.75, py: 0.4, borderRadius: '50px',
        bgcolor: c.yellow.bg, border: `2px solid ${c.yellow.border}`,
        boxShadow: `2px 2px 0 ${c.yellow.shadow}`,
        fontSize: '0.8rem', fontWeight: 800,
        color: c.yellow.text || c.heading,
    };

    /* ─── keyframes (injected once) ─── */
    const keyframes = `
        @keyframes cm-msgIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes cm-wave { 0%{height:5px} 100%{height:28px} }
        @keyframes cm-typeBounce { 0%,80%,100%{transform:scale(.6);opacity:.5} 40%{transform:scale(1);opacity:1} }
        @keyframes cm-reactPop { 0%{transform:scale(0)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes cm-pickerIn { 0%{opacity:0;transform:scale(.8) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
    `;

    /* ─── bubble colours ─── */
    const incomingBubble = {
        bgcolor: c.blue.bg,
        border: `2px solid ${c.blue.border}`,
        borderRadius: '18px',
        borderTopLeftRadius: '4px',
        boxShadow: `3px 3px 0 ${c.blue.shadow}`,
        color: c.body,
    };
    const outgoingBubble = {
        bgcolor: c.teal.bg,
        border: `2px solid ${c.teal.border}`,
        borderRadius: '18px',
        borderTopRightRadius: '4px',
        boxShadow: `3px 3px 0 ${c.teal.shadow}`,
        color: c.body,
    };

    // ─── Audio instruction screen ───
    if (!audioPlayed) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', p: { xs: 1, sm: 2.5 } }}>
                <style>{keyframes}</style>
                <Box sx={{ ...cardSx, justifyContent: 'center' }}>
                    <Box sx={headerSx}>
                        <Avatar sx={{ bgcolor: TEAM_AVATARS['Team'].color, width: 36, height: 36, fontWeight: 800, fontSize: '0.8rem' }}>
                            {TEAM_AVATARS['Team'].initials}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 800, color: c.heading, fontSize: '0.95rem' }}>Team Chat</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: c.muted }}>
                                {audioPlaying ? 'Recording...' : 'Voice message received'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 4 } }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 2,
                            px: 4, py: 2.5,
                            bgcolor: c.orange.bg,
                            border: `2px solid ${c.orange.border}`,
                            borderRadius: '20px',
                            boxShadow: `4px 4px 0 ${c.orange.shadow}`,
                        }}>
                            <MicIcon sx={{ color: c.purple.border, fontSize: 32 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', height: 40 }}>
                                {[...Array(20)].map((_, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 4, borderRadius: 1,
                                            bgcolor: c.purple.border, height: 10,
                                            transition: 'height 0.1s ease',
                                            ...(audioPlaying && {
                                                animation: 'cm-wave 0.5s ease-in-out infinite alternate',
                                                animationDelay: `${i * 0.05}s`,
                                            }),
                                        }}
                                    />
                                ))}
                            </Box>
                            <IconButton
                                onClick={handlePlayAudio}
                                disabled={audioPlaying}
                                sx={{
                                    bgcolor: c.green.bg, border: `2px solid ${c.green.border}`,
                                    boxShadow: `3px 3px 0 ${c.green.shadow}`,
                                    borderRadius: '14px', color: c.green.border,
                                    minWidth: 44, minHeight: 44,
                                    '&:hover': { bgcolor: c.green.bg, transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${c.green.shadow}` },
                                }}
                            >
                                {audioPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                        </Box>

                        <Typography sx={{ mt: 2, color: c.muted, fontSize: '0.85rem', fontWeight: 600 }}>
                            {audioPlaying ? 'Playing voice message...' : 'Tap to play voice message'}
                        </Typography>
                        <Typography sx={{ mt: 1, color: c.muted, fontSize: '0.75rem', textAlign: 'center' }}>
                            {exercise?.instruction || 'Listen and respond to the team message'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    // ─── Main chat view ───
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: { xs: 1, sm: 2.5 } }}>
            <style>{keyframes}</style>
            <Box sx={cardSx}>
                {/* Header */}
                <Box sx={headerSx}>
                    <Avatar sx={{ bgcolor: TEAM_AVATARS['Team'].color, width: 36, height: 36, fontWeight: 800, fontSize: '0.8rem' }}>
                        {TEAM_AVATARS['Team'].initials}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 800, color: c.heading, fontSize: '0.95rem' }}>Team Chat</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: isTyping ? c.green.border : c.muted, fontWeight: isTyping ? 700 : 400 }}>
                            {isTyping ? 'typing...' : 'Online'}
                        </Typography>
                    </Box>
                    <Box sx={pillSx}>
                        <StarIcon sx={{ fontSize: 16 }} />
                        {score}
                    </Box>
                </Box>

                {/* Messages */}
                <Box sx={{
                    flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: c.divider, borderRadius: 3 },
                }}>
                    {messages.map((message) => {
                        const isOutgoing = message.sender === 'You';
                        return (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex', gap: 1,
                                    maxWidth: { xs: '92%', sm: '85%' },
                                    alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
                                    flexDirection: isOutgoing ? 'row-reverse' : 'row',
                                    animation: 'cm-msgIn 0.3s ease',
                                }}
                            >
                                {!isOutgoing && message.type !== 'system' && (
                                    <Avatar sx={{
                                        bgcolor: TEAM_AVATARS[message.sender]?.color || '#667eea',
                                        width: 32, height: 32, fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
                                    }}>
                                        {TEAM_AVATARS[message.sender]?.initials || message.sender[0]}
                                    </Avatar>
                                )}

                                <Box sx={{
                                    position: 'relative',
                                    p: '12px 16px',
                                    ...(message.type === 'system' ? {} : isOutgoing ? outgoingBubble : incomingBubble),
                                    '&:hover .cm-react-btn': { opacity: 1 },
                                }}>
                                    {/* Voice message */}
                                    {message.type === 'voice' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}>
                                            <MicIcon sx={{ color: c.purple.border, fontSize: 20 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', height: 20 }}>
                                                {[...Array(10)].map((_, i) => (
                                                    <Box key={i} sx={{
                                                        width: 3, borderRadius: 1, bgcolor: c.purple.border, height: 8,
                                                        ...(message.status === 'playing' && {
                                                            animation: 'cm-wave 0.5s ease-in-out infinite alternate',
                                                            animationDelay: `${i * 0.05}s`,
                                                        }),
                                                    }} />
                                                ))}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.muted }}>
                                                {message.status === 'playing' ? 'Playing...' : 'Voice message'}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* System message */}
                                    {message.type === 'system' && (
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', gap: 1,
                                            bgcolor: c.green.bg, border: `2px solid ${c.green.border}`,
                                            borderRadius: '14px', boxShadow: `3px 3px 0 ${c.green.shadow}`,
                                            px: 2, py: 1.5, mx: 'auto',
                                        }}>
                                            <CelebrationIcon sx={{ color: c.green.border }} />
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.green.border }}>
                                                {message.content}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Text messages */}
                                    {(message.type === 'prompt' || message.type === 'user') && (
                                        <>
                                            <Typography sx={{ fontSize: '0.9rem', color: c.body, lineHeight: 1.5 }}>
                                                {message.content}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, justifyContent: 'flex-end' }}>
                                                <Typography sx={{ fontSize: '0.65rem', color: c.muted }}>{message.time}</Typography>
                                                {isOutgoing && (
                                                    <Box component="span" sx={{ display: 'inline-flex' }}>
                                                        {message.status === 'read' ? (
                                                            <DoneAllIcon sx={{ fontSize: 14, color: c.blue.border }} />
                                                        ) : message.status === 'delivered' ? (
                                                            <DoneAllIcon sx={{ fontSize: 14, color: c.muted }} />
                                                        ) : (
                                                            <CheckIcon sx={{ fontSize: 14, color: c.muted }} />
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    )}

                                    {/* Reactions */}
                                    {message.reactions?.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                            {message.reactions.map((emoji, i) => (
                                                <Box component="span" key={i} sx={{
                                                    fontSize: 14, bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                                                    borderRadius: '10px', px: 0.75, py: 0.25,
                                                    animation: 'cm-reactPop 0.3s ease',
                                                }}>
                                                    {emoji}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {/* Emoji trigger */}
                                    {message.type !== 'system' && message.type !== 'voice' && (
                                        <IconButton
                                            className="cm-react-btn"
                                            size="small"
                                            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                                            sx={{
                                                position: 'absolute', right: -8, bottom: -8, opacity: 0,
                                                transition: 'opacity 0.2s',
                                                bgcolor: c.cardBg, border: `1px solid ${c.divider}`,
                                                boxShadow: `2px 2px 0 ${c.divider}`,
                                                minWidth: 28, minHeight: 28,
                                                '&:hover': { bgcolor: c.cardBg },
                                            }}
                                        >
                                            <EmojiEmotionsIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    )}

                                    {/* Emoji picker */}
                                    {showEmojiPicker === message.id && (
                                        <Box sx={{
                                            position: 'absolute', bottom: '100%', right: 0, display: 'flex', gap: 0.5,
                                            bgcolor: c.cardBg, border: `2px solid ${c.orange.border}`,
                                            borderRadius: '16px', boxShadow: `3px 3px 0 ${c.orange.shadow}`,
                                            p: 1, animation: 'cm-pickerIn 0.2s ease', zIndex: 10,
                                        }}>
                                            {EMOJI_REACTIONS.map(emoji => (
                                                <Box
                                                    component="span"
                                                    key={emoji}
                                                    onClick={() => handleReaction(message.id, emoji)}
                                                    sx={{
                                                        cursor: 'pointer', fontSize: 20, p: 0.5,
                                                        borderRadius: '50%', transition: 'all 0.2s',
                                                        minWidth: 36, minHeight: 36,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        '&:hover': { transform: 'scale(1.3)', bgcolor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
                                                    }}
                                                >
                                                    {emoji}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}

                    {/* Typing indicator */}
                    {isTyping && (
                        <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start', animation: 'cm-msgIn 0.3s ease' }}>
                            <Avatar sx={{ bgcolor: TEAM_AVATARS['Team'].color, width: 32, height: 32, fontSize: '0.7rem', fontWeight: 800 }}>
                                TM
                            </Avatar>
                            <Box sx={{
                                display: 'flex', gap: 0.5, p: '12px 16px',
                                ...incomingBubble,
                            }}>
                                {[0, 1, 2].map(i => (
                                    <Box key={i} component="span" sx={{
                                        width: 8, height: 8, bgcolor: c.muted, borderRadius: '50%',
                                        animation: 'cm-typeBounce 1.4s infinite ease-in-out both',
                                        animationDelay: `${-0.32 + i * 0.16}s`,
                                    }} />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>

                {/* Input */}
                <Box sx={{
                    display: 'flex', alignItems: 'flex-end', gap: 1, px: 2, py: 1.5,
                    bgcolor: c.cardBg, borderTop: `2px solid ${c.divider}`,
                }}>
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        multiline
                        maxRows={3}
                        placeholder="Type your response..."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '14px',
                                bgcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                fontWeight: 600, fontSize: '0.9rem',
                                minHeight: 44,
                                '& fieldset': { border: `2px solid ${c.divider}` },
                                '&:hover fieldset': { borderColor: c.purple.border },
                                '&.Mui-focused fieldset': { borderColor: c.purple.border },
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!currentInput.trim()}
                        sx={{
                            bgcolor: c.purple.bg, border: `2px solid ${c.purple.border}`,
                            borderRadius: '14px', boxShadow: `3px 3px 0 ${c.purple.shadow}`,
                            color: c.purple.border, minWidth: 44, minHeight: 44,
                            fontWeight: 800,
                            '&:hover': { bgcolor: c.purple.bg, transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${c.purple.shadow}` },
                            '&.Mui-disabled': { bgcolor: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', border: `2px solid ${c.divider}`, boxShadow: 'none', color: c.muted },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>

                {/* Progress */}
                <LinearProgress
                    variant="determinate"
                    value={(currentPromptIndex / Math.max(templates.length, guidedQuestions.length, 1)) * 100}
                    sx={{
                        height: 4,
                        bgcolor: c.divider,
                        '& .MuiLinearProgress-bar': { bgcolor: c.green.border },
                    }}
                />
            </Box>
        </Box>
    );
}
