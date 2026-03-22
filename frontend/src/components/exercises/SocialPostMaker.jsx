/**
 * SocialPostMaker - Social Media Post Exercise Component (Clay/Bento Theme)
 *
 * A writing exercise styled as different social media platforms:
 * - Instagram, Facebook, X (Twitter), LinkedIn, Reddit
 * - Randomly selects platform on each load
 * - User fills in the post content
 */
import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Button,
    Stack,
    useTheme
} from '@mui/material'
// Icons
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import RepeatIcon from '@mui/icons-material/Repeat'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import PublicIcon from '@mui/icons-material/Public'
import VerifiedIcon from '@mui/icons-material/Verified'

const getClayColors = (dark) => {
    const t = dark
        ? { pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', divider: '#2A2A4A' }
        : { pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', divider: '#E0E0E0' }
    const pills = dark
        ? {
            blue: { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
            green: { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
            purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
            yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800', text: '#FFD54F' },
            teal: { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
            orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
            red: { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
        }
        : {
            blue: { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
            green: { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
            purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
            yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825', text: '#5D4037' },
            teal: { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
            orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
            red: { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
        }
    return { t, pills }
}

// Platform-to-color mapping for clay theme
const PLATFORM_COLORS = {
    instagram: 'red',
    facebook: 'blue',
    twitter: 'teal',
    linkedin: 'blue',
    reddit: 'orange'
}

const PLATFORM_NAMES = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'X',
    linkedin: 'LinkedIn',
    reddit: 'Reddit'
}

export default function SocialPostMaker({ exercise, onComplete, onProgress }) {
    const [postContent, setPostContent] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [platform, setPlatform] = useState(null)
    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'
    const { t, pills } = useMemo(() => getClayColors(dark), [dark])

    // Randomly select platform on mount
    useEffect(() => {
        const platforms = Object.keys(PLATFORM_NAMES)
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]
        setPlatform(randomPlatform)
    }, [])

    if (!platform) return null

    const c = pills[PLATFORM_COLORS[platform]]
    const platformName = PLATFORM_NAMES[platform]

    const userName = 'You'
    const instruction = exercise?.instruction || 'Write your post'
    const guidedQuestions = exercise?.guided_questions || []
    const exampleAnswers = exercise?.example_of_answers || []
    const minWords = 10

    const wordCount = postContent.trim().split(/\s+/).filter(w => w).length
    const isValid = wordCount >= minWords

    const handleSubmit = () => {
        if (isValid) {
            setIsSubmitted(true)
            onComplete?.({
                isPerfect: true,
                answer: postContent
            })
        }
    }

    // Report progress
    useEffect(() => {
        onProgress?.({ answer: postContent })
    }, [postContent, onProgress])

    const getTimeAgo = () => 'Just now'

    // Clay card wrapper
    const cardSx = {
        bgcolor: t.cardBg,
        border: `2px solid ${c.border}`,
        borderRadius: '20px',
        boxShadow: `4px 4px 0 ${c.shadow}`,
        overflow: 'hidden',
        width: '100%',
        maxWidth: { xs: '100%', sm: 520 },
    }

    // Clay icon button
    const clayIconBtn = {
        color: t.muted,
        minWidth: 44,
        minHeight: 44,
        '&:hover': { color: c.border }
    }

    // Clay text field
    const clayTextField = {
        '& .MuiOutlinedInput-root': {
            color: t.body,
            bgcolor: c.bg,
            borderRadius: '14px',
            border: `2px solid ${c.border}`,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            '& fieldset': { border: 'none' },
        }
    }

    // Guided questions
    const renderGuidedQuestions = () => {
        if (!guidedQuestions || guidedQuestions.length === 0) return null
        const accent = pills.yellow
        return (
            <Box sx={{
                bgcolor: accent.bg,
                border: `2px solid ${accent.border}`,
                borderRadius: '14px',
                boxShadow: `3px 3px 0 ${accent.shadow}`,
                p: { xs: 1.5, sm: 2 },
                mb: 1.5,
            }}>
                <Typography sx={{
                    color: accent.text || accent.border,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Consider these points:
                </Typography>
                <Stack spacing={0.75}>
                    {guidedQuestions.map((question, idx) => (
                        <Typography
                            key={idx}
                            sx={{
                                color: t.body,
                                fontSize: { xs: '0.78rem', sm: '0.82rem' },
                                pl: 1,
                                borderLeft: `3px solid ${accent.border}`
                            }}
                        >
                            {question}
                        </Typography>
                    ))}
                </Stack>
            </Box>
        )
    }

    const renderExampleAnswers = () => {
        if (!exampleAnswers || exampleAnswers.length === 0) return null
        const accent = pills.purple
        return (
            <Box sx={{
                bgcolor: accent.bg,
                border: `2px solid ${accent.border}`,
                borderRadius: '14px',
                boxShadow: `3px 3px 0 ${accent.shadow}`,
                p: { xs: 1.5, sm: 2 },
                mb: 1.5,
            }}>
                <Typography sx={{
                    color: accent.border,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Example responses:
                </Typography>
                <Stack spacing={0.75}>
                    {exampleAnswers.map((example, idx) => (
                        <Typography
                            key={idx}
                            sx={{
                                color: t.body,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                pl: 1,
                                borderLeft: `3px solid ${accent.border}`,
                                fontStyle: 'italic',
                                opacity: 0.85
                            }}
                        >
                            {example}
                        </Typography>
                    ))}
                </Stack>
            </Box>
        )
    }

    // Action bar item
    const ActionItem = ({ icon, label }) => (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{
            cursor: 'pointer',
            py: 0.75,
            px: { xs: 1, sm: 1.5 },
            borderRadius: '10px',
            minHeight: 44,
            '&:hover': { bgcolor: c.bg }
        }}>
            {icon}
            <Typography sx={{ color: t.muted, fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
                {label}
            </Typography>
        </Stack>
    )

    // --- Platform Renders ---

    const renderInstagram = () => (
        <Box sx={cardSx}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: c.border, fontWeight: 800 }}>Y</Avatar>
                <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.9rem', flex: 1 }}>
                    {userName}
                </Typography>
                <IconButton sx={clayIconBtn}><MoreHorizIcon /></IconButton>
            </Stack>

            <Box sx={{
                width: '100%',
                height: { xs: 200, sm: 280 },
                bgcolor: c.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTop: `2px solid ${c.border}`,
                borderBottom: `2px solid ${c.border}`,
            }}>
                <Typography sx={{ color: t.muted, fontWeight: 700, fontSize: '0.9rem' }}>Your photo here</Typography>
            </Box>

            <Stack direction="row" sx={{ p: 1 }}>
                <IconButton sx={clayIconBtn}><FavoriteBorderIcon /></IconButton>
                <IconButton sx={clayIconBtn}><ChatBubbleOutlineIcon /></IconButton>
                <IconButton sx={clayIconBtn}><SendIcon /></IconButton>
                <Box sx={{ flex: 1 }} />
                <IconButton sx={clayIconBtn}><BookmarkBorderIcon /></IconButton>
            </Stack>

            <Typography sx={{ px: 2, color: t.heading, fontWeight: 800, fontSize: '0.85rem' }}>
                0 likes
            </Typography>

            <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 1 }}>
                <Typography sx={{ color: t.muted, fontSize: { xs: '0.78rem', sm: '0.82rem' }, mb: 1.5, fontWeight: 600 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Write your caption..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={clayTextField}
                />
            </Box>
        </Box>
    )

    const renderFacebook = () => (
        <Box sx={cardSx}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: c.border, fontWeight: 800 }}>Y</Avatar>
                <Box>
                    <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.9rem' }}>
                        {userName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ color: t.muted, fontSize: '0.75rem', fontWeight: 600 }}>
                            {getTimeAgo()}
                        </Typography>
                        <PublicIcon sx={{ fontSize: 12, color: t.muted }} />
                    </Stack>
                </Box>
                <Box sx={{ flex: 1 }} />
                <IconButton sx={clayIconBtn}><MoreHorizIcon /></IconButton>
            </Stack>

            <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }}>
                <Typography sx={{ color: t.muted, fontSize: { xs: '0.78rem', sm: '0.82rem' }, mb: 1.5, fontWeight: 600 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={clayTextField}
                />
            </Box>

            <Box sx={{ borderTop: `2px solid ${t.divider}` }}>
                <Stack direction="row" justifyContent="space-around" sx={{ py: 0.5, px: 1 }}>
                    <ActionItem icon={<ThumbUpOutlinedIcon sx={{ fontSize: 18, color: t.muted }} />} label="Like" />
                    <ActionItem icon={<ChatBubbleOutlineIcon sx={{ fontSize: 18, color: t.muted }} />} label="Comment" />
                    <ActionItem icon={<ShareIcon sx={{ fontSize: 18, color: t.muted }} />} label="Share" />
                </Stack>
            </Box>
        </Box>
    )

    const renderTwitter = () => (
        <Box sx={cardSx}>
            <Stack direction="row" spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: c.border, fontWeight: 800 }}>Y</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                        <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.9rem' }}>
                            {userName}
                        </Typography>
                        <VerifiedIcon sx={{ fontSize: 16, color: c.border }} />
                        <Typography sx={{ color: t.muted, fontSize: '0.85rem', fontWeight: 600 }}>
                            @you · {getTimeAgo()}
                        </Typography>
                    </Stack>

                    <Typography sx={{ color: t.muted, fontSize: { xs: '0.78rem', sm: '0.82rem' }, mt: 0.5, mb: 1.5, fontWeight: 600 }}>
                        {instruction}
                    </Typography>
                    {renderGuidedQuestions()}
                    {renderExampleAnswers()}

                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="What's happening?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={isSubmitted}
                        inputProps={{ maxLength: 280 }}
                        sx={clayTextField}
                    />

                    <Typography sx={{ color: t.muted, fontSize: '0.75rem', textAlign: 'right', mt: 0.5, fontWeight: 700 }}>
                        {postContent.length}/280
                    </Typography>

                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <IconButton sx={clayIconBtn}><ChatBubbleOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton sx={clayIconBtn}><RepeatIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton sx={clayIconBtn}><FavoriteBorderIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton sx={clayIconBtn}><ShareIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )

    const renderLinkedIn = () => (
        <Box sx={cardSx}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: c.border, fontWeight: 800 }}>Y</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.9rem' }}>
                        {userName}
                    </Typography>
                    <Typography sx={{ color: t.muted, fontSize: '0.75rem', fontWeight: 600 }}>
                        Student | Learning English
                    </Typography>
                    <Typography sx={{ color: t.muted, fontSize: '0.7rem', fontWeight: 600 }}>
                        {getTimeAgo()} · Global
                    </Typography>
                </Box>
                <IconButton sx={clayIconBtn}><MoreHorizIcon /></IconButton>
            </Stack>

            <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }}>
                <Typography sx={{ color: t.muted, fontSize: { xs: '0.78rem', sm: '0.82rem' }, mb: 1.5, fontWeight: 600 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={5}
                    fullWidth
                    placeholder="Share your thoughts..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={clayTextField}
                />
            </Box>

            <Box sx={{ borderTop: `2px solid ${t.divider}` }}>
                <Stack direction="row" justifyContent="space-between" sx={{ px: { xs: 1, sm: 2 }, py: 0.5 }}>
                    <ActionItem icon={<ThumbUpOutlinedIcon sx={{ fontSize: 16, color: t.muted }} />} label="Like" />
                    <ActionItem icon={<ChatBubbleOutlineIcon sx={{ fontSize: 16, color: t.muted }} />} label="Comment" />
                    <ActionItem icon={<RepeatIcon sx={{ fontSize: 16, color: t.muted }} />} label="Repost" />
                    <ActionItem icon={<SendIcon sx={{ fontSize: 16, color: t.muted }} />} label="Send" />
                </Stack>
            </Box>
        </Box>
    )

    const renderReddit = () => (
        <Box sx={cardSx}>
            <Stack direction={{ xs: 'column', sm: 'row' }}>
                {/* Vote column */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'column' },
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                    p: 1,
                    bgcolor: c.bg,
                    borderRight: { sm: `2px solid ${c.border}` },
                    borderBottom: { xs: `2px solid ${c.border}`, sm: 'none' },
                    gap: 0.5,
                }}>
                    <IconButton sx={clayIconBtn}><ArrowUpwardIcon /></IconButton>
                    <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.85rem' }}>0</Typography>
                    <IconButton sx={clayIconBtn}><ArrowDownwardIcon /></IconButton>
                </Box>

                <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 } }}>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Avatar sx={{ width: 22, height: 22, bgcolor: c.border, fontSize: '0.6rem', fontWeight: 800 }}>r/</Avatar>
                        <Typography sx={{ color: t.heading, fontWeight: 800, fontSize: '0.78rem' }}>
                            r/EnglishLearning
                        </Typography>
                        <Typography sx={{ color: t.muted, fontSize: '0.7rem', fontWeight: 600 }}>
                            · u/{userName.toLowerCase()} · {getTimeAgo()}
                        </Typography>
                    </Stack>

                    <Typography sx={{ color: t.muted, fontSize: { xs: '0.78rem', sm: '0.82rem' }, mt: 1, mb: 1, fontWeight: 600 }}>
                        {instruction}
                    </Typography>
                    {renderGuidedQuestions()}
                    {renderExampleAnswers()}

                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Write your post..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={isSubmitted}
                        sx={{ ...clayTextField, mt: 1 }}
                    />

                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                        <Button size="small" startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />} sx={{
                            color: t.muted, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700,
                            minHeight: 44, borderRadius: '10px', '&:hover': { bgcolor: c.bg }
                        }}>
                            0 Comments
                        </Button>
                        <Button size="small" startIcon={<ShareIcon sx={{ fontSize: 16 }} />} sx={{
                            color: t.muted, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700,
                            minHeight: 44, borderRadius: '10px', '&:hover': { bgcolor: c.bg }
                        }}>
                            Share
                        </Button>
                        <Button size="small" startIcon={<BookmarkBorderIcon sx={{ fontSize: 16 }} />} sx={{
                            color: t.muted, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700,
                            minHeight: 44, borderRadius: '10px', '&:hover': { bgcolor: c.bg }
                        }}>
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )

    const renderPlatform = () => {
        switch (platform) {
            case 'instagram': return renderInstagram()
            case 'facebook': return renderFacebook()
            case 'twitter': return renderTwitter()
            case 'linkedin': return renderLinkedIn()
            case 'reddit': return renderReddit()
            default: return renderInstagram()
        }
    }

    const greenPill = pills.green
    const redPill = pills.red

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 2,
            px: { xs: 1, sm: 0 },
            width: '100%',
        }}>
            {/* Platform badge pill */}
            <Box sx={{
                px: 1.75,
                py: 0.4,
                borderRadius: '50px',
                bgcolor: c.bg,
                border: `2px solid ${c.border}`,
                boxShadow: `2px 2px 0 ${c.shadow}`,
                fontSize: '0.8rem',
                fontWeight: 800,
                color: c.text || c.border,
            }}>
                {platformName}
            </Box>

            {/* Platform UI */}
            {renderPlatform()}

            {/* Word count & Submit */}
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" justifyContent="center">
                <Box sx={{
                    px: 1.75,
                    py: 0.4,
                    borderRadius: '50px',
                    bgcolor: isValid ? greenPill.bg : redPill.bg,
                    border: `2px solid ${isValid ? greenPill.border : redPill.border}`,
                    boxShadow: `2px 2px 0 ${isValid ? greenPill.shadow : redPill.shadow}`,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: isValid ? greenPill.border : redPill.border,
                }}>
                    {wordCount} / {minWords} words min
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitted}
                    sx={{
                        bgcolor: c.border,
                        color: dark ? '#fff' : '#fff',
                        borderRadius: '14px',
                        border: `2px solid ${c.border}`,
                        boxShadow: `4px 4px 0 ${c.shadow}`,
                        fontWeight: 800,
                        minHeight: 44,
                        px: 3,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: c.border,
                            transform: 'translate(-2px,-2px)',
                            boxShadow: `6px 6px 0 ${c.shadow}`,
                        },
                        '&.Mui-disabled': {
                            bgcolor: t.divider,
                            color: t.muted,
                            border: `2px solid ${t.divider}`,
                            boxShadow: 'none',
                        }
                    }}
                >
                    {isSubmitted ? 'Posted!' : 'Post'}
                </Button>
            </Stack>
        </Box>
    )
}
