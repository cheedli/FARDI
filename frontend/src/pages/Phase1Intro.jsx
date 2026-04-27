import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Chip, Button } from '@mui/material'
import { useColorMode } from '../theme.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SchoolIcon from '@mui/icons-material/School'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  indigo: { bg: '#C5CAE9', border: '#3949AB', shadow: '#3949AB' },
  pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  indigo: { bg: '#0D0F2A', border: '#7986CB', shadow: '#283593' },
  pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
}

const CHARACTERS = [
  { name: 'Ms. Mabrouki', role: 'Event Coordinator',   avatar: '/images/avatars/mabrouki.svg', colorKey: 'purple' },
  { name: 'SKANDER',      role: 'Council President',    avatar: '/images/avatars/ryan.svg',     colorKey: 'blue'   },
  { name: 'Emna',         role: 'Finance & Logistics',  avatar: '/images/avatars/emna.svg',     colorKey: 'green'  },
  { name: 'Ryan',         role: 'Social Media',         avatar: '/images/avatars/ryan.svg',     colorKey: 'orange' },
  { name: 'Lilia',        role: 'Artistic Direction',   avatar: '/images/avatars/lilia.svg',    colorKey: 'pink'   },
]

const EXPECT = [
  { icon: ChatBubbleOutlineIcon, colorKey: 'blue',   title: 'A real conversation',  body: "You'll chat with committee members. Answer naturally — there are no trick questions, just talk." },
  { icon: TimerOutlinedIcon,     colorKey: 'orange', title: 'About 10 minutes',     body: 'The assessment moves at your pace. Take your time to think before you respond.' },
  { icon: EmojiEventsOutlinedIcon, colorKey: 'green', title: 'Your CEFR level',    body: "At the end you'll receive your English level from A1 to C1, with a skill breakdown." },
]

export default function Phase1Intro() {
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const scrollRef = React.useRef(null)
  const scrollDown = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Box sx={{ bgcolor: D.pageBg, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        px: { xs: 3, md: 8 },
        position: 'relative',
        borderBottom: `2px solid ${D.border}`,
      }}>
        {/* Phase badge */}
        <Chip
          icon={<SchoolIcon sx={{ fontSize: '14px !important', color: `${D.indigo.border} !important` }} />}
          label="Phase 1 · Language Assessment"
          size="small"
          sx={{
            mb: 3,
            fontWeight: 700, fontSize: '0.75rem',
            bgcolor: D.indigo.bg,
            border: `2px solid ${D.indigo.border}`,
            color: D.indigo.border,
            borderRadius: '50px',
            boxShadow: `3px 3px 0 ${D.indigo.shadow}`,
            px: 0.5,
          }}
        />

        <Typography sx={{
          fontWeight: 900,
          fontSize: { xs: '2.8rem', md: '4.5rem' },
          color: D.heading,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          mb: 2.5,
        }}>
          You've been
          <br />
          <Box component="span" sx={{ color: D.indigo.border }}>invited.</Box>
        </Typography>

        <Typography sx={{
          color: D.body,
          fontSize: { xs: '1rem', md: '1.2rem' },
          lineHeight: 1.7,
          maxWidth: 560,
          mb: 5,
        }}>
          The Cultural Event Planning Committee is looking for new members.
          Before you join, they need to know one thing —{' '}
          <Box component="span" sx={{ fontWeight: 700, color: D.heading }}>
            how well you communicate.
          </Box>
        </Typography>

        {/* Scroll cue */}
        <Box
          onClick={scrollDown}
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
            cursor: 'pointer', color: D.muted,
            transition: 'all 0.15s ease',
            '&:hover': { color: D.indigo.border, transform: 'translateY(3px)' },
          }}
        >
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Read the brief
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 24, animation: 'bounce 1.8s infinite' }} />
        </Box>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(6px); }
          }
        `}</style>
      </Box>

      {/* ── THE SETTING ──────────────────────────────────────────── */}
      <Box ref={scrollRef} sx={{ px: { xs: 3, md: 10 }, py: { xs: 6, md: 10 }, maxWidth: 900, mx: 'auto' }}>
        <Chip label="The Setting" size="small" sx={{
          mb: 2, fontWeight: 700, fontSize: '0.7rem',
          bgcolor: D.yellow.bg, border: `2px solid ${D.yellow.border}`,
          color: D.yellow.border, borderRadius: '50px',
          boxShadow: `2px 2px 0 ${D.yellow.shadow}`,
        }} />

        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.2rem' }, color: D.heading, letterSpacing: '-0.03em', mb: 3, lineHeight: 1.2 }}>
          A university. A committee.<br />A cultural event that needs to happen.
        </Typography>

        <Stack spacing={2.5}>
          {[
            "It's the weeks before ESPRIT University's biggest annual celebration — a cultural event bringing together students, faculty, and the local community to showcase Tunisian heritage through food, music, art, and performance.",
            "The planning committee is short on members. Ms. Mabrouki, the Event Coordinator, has put out a call for motivated students who can communicate clearly, think on their feet, and contribute meaningfully to the team.",
            "You've been selected for an informal interview. It's not a test in the traditional sense — it's a conversation. The committee will ask you questions, share ideas, and see how you engage. Your English will speak for itself.",
          ].map((text, i) => (
            <Box key={i} sx={{
              p: 2.5, borderRadius: '16px',
              bgcolor: D.cardBg,
              border: `2px solid ${D.border}`,
              boxShadow: `4px 4px 0 ${D.border}`,
            }}>
              <Typography sx={{ color: D.body, fontSize: '1rem', lineHeight: 1.75 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── MEET THE TEAM ────────────────────────────────────────── */}
      <Box sx={{
        borderTop: `2px solid ${D.border}`,
        borderBottom: `2px solid ${D.border}`,
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 10 },
        bgcolor: D.cardBg,
      }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Chip label="Meet the Team" size="small" sx={{
            mb: 2, fontWeight: 700, fontSize: '0.7rem',
            bgcolor: D.purple.bg, border: `2px solid ${D.purple.border}`,
            color: D.purple.border, borderRadius: '50px',
            boxShadow: `2px 2px 0 ${D.purple.shadow}`,
          }} />

          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: D.heading, letterSpacing: '-0.03em', mb: 1, lineHeight: 1.2 }}>
            The people in the room.
          </Typography>
          <Typography sx={{ color: D.muted, fontSize: '0.95rem', mb: 4 }}>
            You'll speak with five committee members. Each one looks for something different.
          </Typography>

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
            {CHARACTERS.map((ch) => {
              const c = D[ch.colorKey]
              return (
                <Box key={ch.name} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.5, borderRadius: '14px',
                  bgcolor: D.pageBg,
                  border: `2px solid ${c.border}`,
                  boxShadow: `4px 4px 0 ${c.shadow}`,
                  minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33% - 11px)' },
                  flex: '1 1 200px',
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${c.border}`,
                    boxShadow: `3px 3px 0 ${c.shadow}`,
                    overflow: 'hidden', bgcolor: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={ch.avatar} alt={ch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: D.heading, lineHeight: 1.2 }}>
                      {ch.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: c.border, fontWeight: 600 }}>
                      {ch.role}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </Box>
      </Box>

      {/* ── WHAT TO EXPECT ───────────────────────────────────────── */}
      <Box sx={{ px: { xs: 3, md: 10 }, py: { xs: 6, md: 8 }, maxWidth: 900, mx: 'auto' }}>
        <Chip label="What to Expect" size="small" sx={{
          mb: 2, fontWeight: 700, fontSize: '0.7rem',
          bgcolor: D.teal.bg, border: `2px solid ${D.teal.border}`,
          color: D.teal.border, borderRadius: '50px',
          boxShadow: `2px 2px 0 ${D.teal.shadow}`,
        }} />

        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: D.heading, letterSpacing: '-0.03em', mb: 4, lineHeight: 1.2 }}>
          Here's how it works.
        </Typography>

        <Stack spacing={2}>
          {EXPECT.map(({ icon: Icon, colorKey, title, body }) => {
            const c = D[colorKey]
            return (
              <Box key={title} sx={{
                display: 'flex', alignItems: 'flex-start', gap: 2.5,
                p: 2.5, borderRadius: '16px',
                bgcolor: D.cardBg,
                border: `2px solid ${D.border}`,
                boxShadow: `4px 4px 0 ${D.border}`,
              }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  bgcolor: c.bg,
                  border: `2px solid ${c.border}`,
                  boxShadow: `3px 3px 0 ${c.shadow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon sx={{ fontSize: 20, color: c.border }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: D.heading, mb: 0.4 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: D.body, fontSize: '0.92rem', lineHeight: 1.65 }}>
                    {body}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <Box sx={{
        borderTop: `2px solid ${D.border}`,
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 10 },
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.2rem' }, color: D.heading, letterSpacing: '-0.03em', mb: 1 }}>
          The committee is waiting.
        </Typography>
        <Typography sx={{ color: D.muted, fontSize: '0.95rem', mb: 4, maxWidth: 440 }}>
          Speak naturally, be yourself, and show them what you've got.
        </Typography>
        <Button
          onClick={() => navigate('/phase1/interaction/1')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            fontWeight: 800, fontSize: '1rem',
            textTransform: 'none',
            px: 4, py: 1.5,
            borderRadius: '14px',
            bgcolor: D.indigo.bg,
            color: D.indigo.border,
            border: `2px solid ${D.indigo.border}`,
            boxShadow: `5px 5px 0 ${D.indigo.shadow}`,
            transition: 'all 0.12s ease',
            '&:hover': {
              bgcolor: D.indigo.border,
              color: '#fff',
              transform: 'translate(-2px,-2px)',
              boxShadow: `7px 7px 0 ${D.indigo.shadow}`,
            },
            '&:active': {
              transform: 'translate(2px,2px)',
              boxShadow: `3px 3px 0 ${D.indigo.shadow}`,
            },
          }}
        >
          Enter the Room
        </Button>
      </Box>

    </Box>
  )
}
