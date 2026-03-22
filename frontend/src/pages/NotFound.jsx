import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue: { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue: { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
}

export default function NotFound() {
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 8, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, p: 5, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontWeight: 'bold', color: P.blue.border, mb: 1 }}>404</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Page Not Found</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              The page you're looking for doesn't exist.
            </Typography>
            <Box
              component="button"
              onClick={() => navigate('/')}
              sx={{ bgcolor: P.orange.bg, border: `2px solid ${P.orange.border}`, borderRadius: '12px', boxShadow: `4px 4px 0 ${P.orange.shadow}`, px: 4, py: 1.5, cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'all 0.15s', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.orange.shadow}` } }}
            >
              Go Home
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
