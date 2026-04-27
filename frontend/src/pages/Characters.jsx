import React from 'react'
import { Box, Typography, Stack, Chip } from '@mui/material'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7', cardBg: '#ffffff', heading: '#1A237E', body: '#37474F', muted: '#78909C', border: '#E0E0E0',
  purple: { bg: '#E1BEE7', border: '#8E24AA', shadow: '#8E24AA' },
  blue:   { bg: '#BBDEFB', border: '#1976D2', shadow: '#1976D2' },
  yellow: { bg: '#FFF9C4', border: '#F9A825', shadow: '#F9A825' },
  green:  { bg: '#C8E6C9', border: '#388E3C', shadow: '#388E3C' },
  orange: { bg: '#FFE0B2', border: '#F57C00', shadow: '#F57C00' },
  teal:   { bg: '#B2EBF2', border: '#0097A7', shadow: '#0097A7' },
  red:    { bg: '#FFCDD2', border: '#C62828', shadow: '#C62828' },
  indigo: { bg: '#C5CAE9', border: '#3949AB', shadow: '#3949AB' },
  pink:   { bg: '#FCE4EC', border: '#C2185B', shadow: '#C2185B' },
}
const DARK = {
  pageBg: '#0F0F1A', cardBg: '#1A1A2E', heading: '#E8EAFF', body: '#B0BEC5', muted: '#607D8B', border: '#2A2A4A',
  purple: { bg: '#1E0A2E', border: '#CE93D8', shadow: '#7B1FA2' },
  blue:   { bg: '#0A1929', border: '#64B5F6', shadow: '#1565C0' },
  yellow: { bg: '#2A2200', border: '#F9A825', shadow: '#A06800' },
  green:  { bg: '#0A1F0A', border: '#81C784', shadow: '#2E7D32' },
  orange: { bg: '#1F1000', border: '#FFB74D', shadow: '#E65100' },
  teal:   { bg: '#001F22', border: '#4DD0E1', shadow: '#00695C' },
  red:    { bg: '#1F0000', border: '#EF9A9A', shadow: '#B71C1C' },
  indigo: { bg: '#0D0F2A', border: '#7986CB', shadow: '#283593' },
  pink:   { bg: '#1F0010', border: '#F48FB1', shadow: '#880E4F' },
}

const CHARACTERS = [
  {
    name: 'Ms. Mabrouki',
    avatar: '/images/avatars/mabrouki.svg',
    role: 'Event Coordinator',
    colorKey: 'purple',
    personality: 'Organized, encouraging, and detail-oriented',
    background: 'Has coordinated over 20 cultural events across Tunisia',
    bio: "You'll meet Ms. Mabrouki first. She leads the committee and asks clear, structured questions. Be careful: she expects more than short answers. She's looking at how well you explain your ideas and whether you can speak with confidence and clarity.",
    speaks: ['Arabic', 'French', 'English'],
    traits: ['Leadership', 'Mentorship', 'Planning'],
  },
  {
    name: 'SKANDER',
    avatar: '/images/avatars/ryan.svg',
    role: 'Student Council President',
    colorKey: 'blue',
    personality: 'Charismatic, energetic, and visionary',
    background: 'Third-year politics student with a passion for cultural heritage',
    bio: 'Skander brings energy to the group. He speaks quickly and shares ideas on the spot. Listen carefully—you may need to ask questions or react fast. This is your chance to show you can follow and respond in real conversations.',
    speaks: ['Arabic', 'English'],
    traits: ['Vision', 'Charisma', 'Advocacy'],
  },
  {
    name: 'Emna',
    avatar: '/images/avatars/emna.svg',
    role: 'Committee Member — Finance & Logistics',
    colorKey: 'green',
    personality: 'Practical, precise, and reliable',
    background: 'Business student who has worked on several community projects',
    bio: 'Emna is friendly and easy to talk to. She helps you practice everyday interaction. How you speak matters here—be polite, ask clear questions, and show interest in the conversation.',
    speaks: ['Arabic', 'French', 'English'],
    traits: ['Budgeting', 'Logistics', 'Reliability'],
  },
  {
    name: 'Ryan',
    avatar: '/images/avatars/ryan.svg',
    role: 'Committee Member — Social Media & Outreach',
    colorKey: 'orange',
    personality: 'Creative, tech-savvy, and social',
    background: 'Communications major with experience in digital marketing',
    bio: 'Ryan likes clear and logical answers. If your ideas are too general, he will ask you to explain more. Be ready to justify what you say and use precise language.',
    speaks: ['English', 'French'],
    traits: ['Marketing', 'Creativity', 'Communication'],
  },
  {
    name: 'Lilia',
    avatar: '/images/avatars/lilia.svg',
    role: 'Committee Member — Artistic Direction',
    colorKey: 'pink',
    personality: 'Artistic, thoughtful, and passionate about tradition',
    background: 'Art history student and part-time tour guide at a local museum',
    bio: 'Lilia focuses on how you express yourself. She pays attention to how engaging and well-structured your message is. This is your moment to go beyond basic sentences and make your English more impactful.',
    speaks: ['Arabic', 'French', 'English'],
    traits: ['Artistic Direction', 'Cultural Authenticity', 'Storytelling'],
  },
]

export default function Characters() {
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT
  const [selected, setSelected] = React.useState(0)

  const char = CHARACTERS[selected]
  const c = D[char.colorKey]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: D.pageBg, p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, color: D.heading, letterSpacing: '-0.02em' }}>
          Meet the Committee
        </Typography>
        <Typography sx={{ color: D.muted, fontSize: '0.95rem', mt: 0.5 }}>
          The people you'll work with throughout your language assessment journey
        </Typography>
      </Box>

      {/* Character picker row */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 4, flexWrap: 'wrap', gap: 1.5 }}>
        {CHARACTERS.map((ch, i) => {
          const cc = D[ch.colorKey]
          const active = i === selected
          return (
            <Box
              key={ch.name}
              onClick={() => setSelected(i)}
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                cursor: 'pointer',
                p: 1.5,
                borderRadius: '16px',
                border: active ? `2px solid ${cc.border}` : `2px solid ${D.border}`,
                bgcolor: active ? cc.bg : D.cardBg,
                boxShadow: active ? `4px 4px 0 ${cc.shadow}` : `3px 3px 0 ${D.border}`,
                transition: 'all 0.12s ease',
                minWidth: 80,
                '&:hover': active ? {} : {
                  border: `2px solid ${cc.border}`,
                  boxShadow: `4px 4px 0 ${cc.shadow}`,
                  transform: 'translate(-2px,-2px)',
                },
                '&:active': {
                  transform: 'translate(1px,1px)',
                  boxShadow: `2px 2px 0 ${cc.shadow}`,
                },
              }}
            >
              <Box sx={{
                width: 52, height: 52,
                borderRadius: '50%',
                border: `2px solid ${cc.border}`,
                boxShadow: `3px 3px 0 ${cc.shadow}`,
                overflow: 'hidden',
                bgcolor: cc.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: active ? 700 : 500, color: active ? cc.border : D.muted, textAlign: 'center', lineHeight: 1.2 }}>
                {ch.name.split(' ')[0]}
              </Typography>
            </Box>
          )
        })}
      </Stack>

      {/* Character detail card */}
      <Box sx={{
        borderRadius: '20px',
        border: `2px solid ${c.border}`,
        boxShadow: `6px 6px 0 ${c.shadow}`,
        bgcolor: D.cardBg,
        overflow: 'hidden',
      }}>
        {/* Top banner */}
        <Box sx={{
          bgcolor: c.bg,
          borderBottom: `2px solid ${c.border}`,
          p: { xs: 2.5, md: 4 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <Box sx={{
            width: { xs: 90, md: 120 },
            height: { xs: 90, md: 120 },
            borderRadius: '50%',
            border: `3px solid ${c.border}`,
            boxShadow: `5px 5px 0 ${c.shadow}`,
            overflow: 'hidden',
            bgcolor: D.pageBg,
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src={char.avatar}
              alt={char.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>

          {/* Name + role */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: D.heading, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {char.name}
            </Typography>
            <Typography sx={{ color: c.border, fontWeight: 600, fontSize: '0.95rem', mt: 0.5 }}>
              {char.role}
            </Typography>
            <Typography sx={{ color: D.muted, fontSize: '0.85rem', mt: 0.5, fontStyle: 'italic' }}>
              "{char.personality}"
            </Typography>
            {/* Trait chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.8 }}>
              {char.traits.map(t => (
                <Chip key={t} label={t} size="small" sx={{
                  bgcolor: D.cardBg,
                  border: `2px solid ${c.border}`,
                  color: c.border,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  borderRadius: '8px',
                  boxShadow: `2px 2px 0 ${c.shadow}`,
                  height: 26,
                }} />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ p: { xs: 2.5, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Bio */}
          <Box sx={{ flex: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
              Background
            </Typography>
            <Typography sx={{ color: D.body, fontSize: '0.95rem', lineHeight: 1.7 }}>
              {char.bio}
            </Typography>
          </Box>

          {/* Side info */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                Quick Note
              </Typography>
              <Box sx={{
                p: 1.5, borderRadius: '12px',
                bgcolor: D.pageBg,
                border: `2px solid ${D.border}`,
                boxShadow: `3px 3px 0 ${D.border}`,
              }}>
                <Typography sx={{ color: D.body, fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {char.background}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: D.muted, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                Languages
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ gap: 0.8 }}>
                {char.speaks.map(lang => (
                  <Chip key={lang} label={lang} size="small" sx={{
                    bgcolor: D.pageBg,
                    border: `2px solid ${D.border}`,
                    color: D.body,
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    borderRadius: '8px',
                    boxShadow: `2px 2px 0 ${D.border}`,
                    height: 24,
                  }} />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
