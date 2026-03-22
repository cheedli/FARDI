import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Container, Typography, Stack, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/api.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  blue:   { bg: '#EFF6FF', border: '#3B82F6', shadow: '#1D4ED8' },
  green:  { bg: '#F0FDF4', border: '#22C55E', shadow: '#15803D' },
  yellow: { bg: '#FEFCE8', border: '#EAB308', shadow: '#A16207' },
  teal:   { bg: '#F0FDFA', border: '#14B8A6', shadow: '#0F766E' },
  orange: { bg: '#FFF7ED', border: '#F97316', shadow: '#C2410C' },
  red:    { bg: '#FEF2F2', border: '#EF4444', shadow: '#B91C1C' },
}
const DARK = {
  pageBg: '#0F0F1A',
  blue:   { bg: '#1E3A5F', border: '#60A5FA', shadow: '#1E40AF' },
  green:  { bg: '#14532D', border: '#4ADE80', shadow: '#166534' },
  yellow: { bg: '#3D2E00', border: '#FACC15', shadow: '#854D0E' },
  teal:   { bg: '#134E4A', border: '#2DD4BF', shadow: '#0F766E' },
  orange: { bg: '#431407', border: '#FB923C', shadow: '#9A3412' },
  red:    { bg: '#450A0A', border: '#F87171', shadow: '#991B1B' },
}

export default function Certificate() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [certificateData, setCertificateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const theme = useTheme()
  const P = theme.palette.mode === 'dark' ? DARK : LIGHT

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }
    fetch(`/api/certificate?session_id=${encodeURIComponent(sessionId)}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load certificate'))
      .then(setCertificateData)
      .catch(e => setError(e.message || e))
      .finally(() => setLoading(false))
  }, [sessionId])

  const handlePrint = () => window.print()
  const handleDownload = () => {
    window.location.href = `/certificate-download?session_id=${encodeURIComponent(sessionId)}`
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', bgcolor: P.pageBg }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: P.red.bg, border: `2px solid ${P.red.border}`, borderRadius: '20px', boxShadow: `4px 4px 0 ${P.red.shadow}`, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: P.red.border }}>{error}</Typography>
        </Box>
      </Box>
    )
  }

  const playerName = certificateData?.player_name || user?.first_name || user?.username || 'Student'
  const level = certificateData?.overall_level || 'B1'
  const completionDate = certificateData?.completion_date || new Date().toLocaleDateString()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: P.pageBg, py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Action buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box
              component="button"
              onClick={handlePrint}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: P.teal.bg, border: `2px solid ${P.teal.border}`, borderRadius: '12px', boxShadow: `4px 4px 0 ${P.teal.shadow}`, px: 3, py: 1.2, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.15s', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.teal.shadow}` } }}
            >
              <PrintIcon fontSize="small" /> Print Certificate
            </Box>
            <Box
              component="button"
              onClick={handleDownload}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: P.blue.bg, border: `2px solid ${P.blue.border}`, borderRadius: '12px', boxShadow: `4px 4px 0 ${P.blue.shadow}`, px: 3, py: 1.2, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.15s', '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${P.blue.shadow}` } }}
            >
              <DownloadIcon fontSize="small" /> Download PDF
            </Box>
          </Stack>

          {/* Certificate */}
          <Box sx={{
            bgcolor: P.blue.bg,
            border: `4px solid ${P.blue.border}`,
            borderRadius: '24px',
            boxShadow: `6px 6px 0 ${P.blue.shadow}`,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            '@media print': { boxShadow: 'none' }
          }}>
            <Typography variant="h3" sx={{ fontFamily: 'serif', fontWeight: 'bold', color: P.blue.border, mb: 1 }}>
              Certificate of Achievement
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
              CEFR English Language Assessment
            </Typography>

            <Typography variant="h5" sx={{ mb: 2 }}>This is to certify that</Typography>

            <Box sx={{ bgcolor: P.yellow.bg, border: `2px solid ${P.yellow.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.yellow.shadow}`, display: 'inline-block', px: 4, py: 1.5, mb: 4 }}>
              <Typography variant="h4" sx={{ fontFamily: 'serif', fontWeight: 'bold', color: P.blue.border }}>
                {playerName}
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>has successfully completed the English language assessment</Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>and achieved</Typography>

            <Box sx={{ bgcolor: P.blue.border, color: 'white', py: 2, px: 5, borderRadius: '16px', mb: 4, display: 'inline-block', boxShadow: `4px 4px 0 ${P.blue.shadow}` }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>CEFR Level {level}</Typography>
            </Box>

            <Box sx={{ bgcolor: P.green.bg, border: `2px solid ${P.green.border}`, borderRadius: '12px', boxShadow: `3px 3px 0 ${P.green.shadow}`, display: 'inline-block', px: 4, py: 1, mb: 4 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Completion Date: {completionDate}</Typography>
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ borderTop: `2px solid ${P.blue.border}`, width: 180, mb: 1 }} />
                <Typography variant="body2">Assessment Authority</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ borderTop: `2px solid ${P.blue.border}`, width: 180, mb: 1 }} />
                <Typography variant="body2">Date</Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
