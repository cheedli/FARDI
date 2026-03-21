/**
 * Admin Student Progress Page
 * Comprehensive view of student progress, responses, and AI evaluations
 */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, LinearProgress, Accordion, AccordionSummary,
  AccordionDetails, Alert, Tabs, Tab, List, ListItem,
  ListItemText, Avatar, Tooltip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InfoIcon from '@mui/icons-material/Info'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useColorMode } from '../theme.jsx'

const LIGHT = {
  pageBg: '#FFFDE7',
  cardBg: '#ffffff',
  heading: '#1A237E',
  body: '#37474F',
  muted: '#78909C',
  border: '#1A237E',
  purple: { bg: '#F3E5F5', border: '#7B1FA2', shadow: '#7B1FA2' },
  blue:   { bg: '#E3F2FD', border: '#1565C0', shadow: '#1565C0' },
  green:  { bg: '#E8F5E9', border: '#2E7D32', shadow: '#2E7D32' },
  yellow: { bg: '#FFFDE7', border: '#F57F17', shadow: '#F57F17' },
  orange: { bg: '#FFF3E0', border: '#E65100', shadow: '#E65100' },
  red:    { bg: '#FFEBEE', border: '#C62828', shadow: '#C62828' },
  teal:   { bg: '#E0F2F1', border: '#00695C', shadow: '#00695C' },
  indigo: { bg: '#E8EAF6', border: '#283593', shadow: '#283593' },
}
const DARK = {
  pageBg: '#0F0F1A',
  cardBg: '#1A1A2E',
  heading: '#E8EAFF',
  body: '#B0BEC5',
  muted: '#607D8B',
  border: '#3A3A5C',
  purple: { bg: '#1A0A2E', border: '#CE93D8', shadow: '#9C27B0' },
  blue:   { bg: '#0A1A2E', border: '#90CAF9', shadow: '#1565C0' },
  green:  { bg: '#0A1A0A', border: '#A5D6A7', shadow: '#2E7D32' },
  yellow: { bg: '#1A1A00', border: '#FFF176', shadow: '#F57F17' },
  orange: { bg: '#1A0F00', border: '#FFCC80', shadow: '#E65100' },
  red:    { bg: '#1A0A0A', border: '#EF9A9A', shadow: '#C62828' },
  teal:   { bg: '#0A1A18', border: '#80CBC4', shadow: '#00695C' },
  indigo: { bg: '#0A0E1A', border: '#9FA8DA', shadow: '#283593' },
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminStudentProgress() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { mode } = useColorMode()
  const D = mode === 'dark' ? DARK : LIGHT

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    loadStudentData()
  }, [userId])

  const loadStudentData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/student/${userId}/progress`, {
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to load student data')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const claySx = {
    background: D.cardBg,
    border: `2px solid ${D.border}`,
    borderRadius: '20px',
    boxShadow: `4px 4px 0 ${D.border}`,
    transition: 'all 0.15s ease',
    '&:hover': {
      transform: 'translate(-2px, -2px)',
      boxShadow: `6px 6px 0 ${D.border}`,
    },
  }

  const accordionSx = {
    border: `2px solid ${D.border}`,
    borderRadius: '16px !important',
    boxShadow: `3px 3px 0 ${D.border}`,
    bgcolor: D.cardBg,
    mb: 1,
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
      borderLeft: `4px solid ${D.purple.border}`,
      boxShadow: `3px 3px 0 ${D.purple.shadow}`,
    },
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, color: D.muted }}>Loading student data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: D.pageBg, minHeight: '100vh' }}>
        <Alert
          severity="error"
          sx={{
            border: `2px solid ${D.red.border}`,
            borderRadius: '14px',
            bgcolor: D.red.bg,
            color: D.red.border,
            boxShadow: `3px 3px 0 ${D.red.shadow}`,
          }}
        >
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{
            mt: 2,
            color: D.purple.border,
            border: `2px solid ${D.purple.border}`,
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: `2px 2px 0 ${D.purple.shadow}`,
          }}
        >
          Back to Admin Dashboard
        </Button>
      </Box>
    )
  }

  if (!data) return null

  const { user, phase1_history, phase2_progress, responses_with_ai, remedial_with_ai, summary } = data

  const getScoreColor = (score, max = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'warning'
    return 'error'
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString()
  }

  const kpiCards = [
    {
      icon: <SchoolIcon />,
      label: 'Current CEFR Level',
      value: summary.current_level || 'Not Assessed',
      colorKey: 'blue',
    },
    {
      icon: <AssessmentIcon />,
      label: 'Phase 2 Score',
      value: `${summary.phase2_score} / ${summary.phase2_max}`,
      sub: `${summary.phase2_percentage}%`,
      colorKey: 'green',
    },
    {
      icon: <CheckCircleIcon />,
      label: 'Steps Completed',
      value: `${summary.steps_completed} / 4`,
      colorKey: 'teal',
    },
    {
      icon: <SmartToyIcon />,
      label: 'AI Evaluations',
      value: responses_with_ai.length + remedial_with_ai.filter(a => a.ai_evaluation).length,
      colorKey: 'purple',
    },
  ]

  return (
    <Box sx={{ p: 3, bgcolor: D.pageBg, minHeight: '100vh' }}>

      {/* ── Header ── */}
      <Box sx={{
        ...claySx,
        mb: 3, p: 2.5,
        '&:hover': undefined,
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => navigate('/admin')}
            sx={{
              color: D.muted,
              border: `2px solid ${D.border}`,
              borderRadius: '10px',
              boxShadow: `2px 2px 0 ${D.border}`,
              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.border}` },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{
            bgcolor: D.purple.border,
            width: 44, height: 44,
            border: `2px solid ${D.purple.shadow}`,
            boxShadow: `3px 3px 0 ${D.purple.shadow}`,
          }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: D.heading, lineHeight: 1.2 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: D.muted }}>
              @{user.username} • {user.email}
            </Typography>
          </Box>
          <Button
            onClick={loadStudentData}
            sx={{
              color: D.body,
              border: `2px solid ${D.border}`,
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: `2px 2px 0 ${D.border}`,
              '&:hover': { transform: 'translate(-1px,-1px)', boxShadow: `3px 3px 0 ${D.border}` },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* ── Summary KPI Cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiCards.map(({ icon, label, value, sub, colorKey }) => {
          const C = D[colorKey]
          return (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box sx={{
                background: C.bg,
                border: `2px solid ${C.border}`,
                borderRadius: '16px',
                boxShadow: `4px 4px 0 ${C.shadow}`,
                p: 2,
                transition: 'all 0.15s ease',
                '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${C.shadow}` },
              }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ color: C.border }}>
                    {React.cloneElement(icon, { sx: { fontSize: 28 } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.72rem', color: D.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: D.heading, lineHeight: 1.2 }}>
                      {value}
                    </Typography>
                    {sub && (
                      <Typography sx={{ fontSize: '0.75rem', color: C.border, fontWeight: 700 }}>
                        {sub}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            </Grid>
          )
        })}
      </Grid>

      {/* ── Tabs ── */}
      <Box sx={{
        ...claySx,
        mb: 3,
        '&:hover': undefined,
        borderRadius: '16px',
      }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              color: D.muted,
              fontSize: '0.82rem',
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: `${D.purple.border} !important`,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '2px',
              bgcolor: D.purple.border,
            },
          }}
        >
          <Tab label={`Phase 1 History (${phase1_history.length})`} />
          <Tab label={`Phase 2 Responses (${responses_with_ai.length})`} />
          <Tab label={`Remedial Activities (${remedial_with_ai.length})`} />
          <Tab label="AI Evaluations" />
        </Tabs>
      </Box>

      {/* ── Tab Panel 0: Phase 1 History ── */}
      <TabPanel value={tabValue} index={0}>
        {phase1_history.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              border: `2px solid ${D.blue.border}`,
              borderRadius: '14px',
              bgcolor: D.blue.bg,
              color: D.blue.border,
              boxShadow: `3px 3px 0 ${D.blue.shadow}`,
            }}
          >
            No Phase 1 assessments completed yet.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {phase1_history.map((attempt, idx) => (
              <Accordion key={idx} sx={accordionSx} disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: D.purple.border }} />}
                  sx={{ bgcolor: 'transparent', '& .MuiAccordionSummary-content': { m: '10px 0' } }}
                >
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip
                      label={attempt.overall_level}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: '0.7rem',
                        bgcolor: D.purple.bg, color: D.purple.border,
                        border: `1px solid ${D.purple.border}`,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: D.body }}>
                      {formatTimestamp(attempt.timestamp)}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 'auto', color: D.muted, fontWeight: 600 }}>
                      {attempt.total_xp} XP earned
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, bgcolor: 'transparent' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>Skill Levels:</Typography>
                      <Stack spacing={1}>
                        {Object.entries(attempt.skill_levels || {}).map(([skill, level]) => (
                          <Box key={skill}>
                            <Typography variant="caption" sx={{ color: D.muted }}>{skill}:</Typography>
                            <Chip label={level} size="small" sx={{
                              ml: 1, bgcolor: D.indigo.bg, color: D.indigo.border,
                              border: `1px solid ${D.indigo.border}`, fontWeight: 600,
                            }} />
                          </Box>
                        ))}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>Details:</Typography>
                      <Typography variant="body2" sx={{ color: D.body }}>Time taken: {Math.round(attempt.time_taken / 60)} minutes</Typography>
                      <Typography variant="body2" sx={{ color: D.body }}>Achievements: {attempt.achievements_earned?.length || 0}</Typography>
                      {attempt.ai_detected_percentage > 0 && (
                        <Alert
                          severity="warning"
                          sx={{
                            mt: 1,
                            border: `2px solid ${D.yellow.border}`,
                            borderRadius: '12px',
                            bgcolor: D.yellow.bg,
                            color: D.yellow.border,
                          }}
                        >
                          AI detection: {attempt.ai_detected_percentage}% of responses
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* ── Tab Panel 1: Phase 2 Responses ── */}
      <TabPanel value={tabValue} index={1}>
        {responses_with_ai.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              border: `2px solid ${D.blue.border}`,
              borderRadius: '14px',
              bgcolor: D.blue.bg,
              color: D.blue.border,
              boxShadow: `3px 3px 0 ${D.blue.shadow}`,
            }}
          >
            No Phase 2 responses yet.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {responses_with_ai.map((response, idx) => (
              <Accordion key={idx} sx={accordionSx} disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: D.purple.border }} />}
                  sx={{ bgcolor: 'transparent', '& .MuiAccordionSummary-content': { m: '10px 0' } }}
                >
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip label={response.step_id} size="small" sx={{ bgcolor: D.indigo.bg, color: D.indigo.border, border: `1px solid ${D.indigo.border}`, fontWeight: 700, fontSize: '0.7rem' }} />
                    <Typography variant="body2" sx={{ flex: 1, color: D.body }}>
                      {response.action_item_id}
                    </Typography>
                    {response.ai_evaluation && (
                      <Chip
                        icon={<SmartToyIcon sx={{ fontSize: '14px !important', color: `${D.purple.border} !important` }} />}
                        label="AI Evaluated"
                        size="small"
                        sx={{ bgcolor: D.purple.bg, color: D.purple.border, border: `1px solid ${D.purple.border}`, fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    )}
                    <Chip
                      label={`${response.score || 0}/10`}
                      color={getScoreColor(response.score || 0, 10)}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, bgcolor: 'transparent' }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>Student Response:</Typography>
                      <Box sx={{
                        p: 2,
                        bgcolor: D.cardBg,
                        border: `2px solid ${D.border}`,
                        borderRadius: '12px',
                        boxShadow: `2px 2px 0 ${D.border}`,
                      }}>
                        <Typography variant="body2" sx={{ color: D.body }}>{response.response_text}</Typography>
                      </Box>
                    </Box>

                    {response.ai_evaluation && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>
                          <SmartToyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: D.purple.border }} />
                          AI Evaluation:
                        </Typography>
                        <Box sx={{
                          p: 2,
                          bgcolor: D.blue.bg,
                          border: `2px solid ${D.blue.border}`,
                          borderRadius: '12px',
                          boxShadow: `2px 2px 0 ${D.blue.shadow}`,
                        }}>
                          <Stack spacing={1}>
                            <Box>
                              <Chip
                                label={`Score: ${response.ai_evaluation.score || 0}/100`}
                                color={getScoreColor(response.ai_evaluation.score || 0)}
                                size="small"
                                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                              />
                              {response.ai_evaluation.level_alignment && (
                                <Chip
                                  label={`Level: ${response.ai_evaluation.level_alignment}`}
                                  size="small"
                                  sx={{ ml: 1, bgcolor: D.indigo.bg, color: D.indigo.border, border: `1px solid ${D.indigo.border}`, fontWeight: 600, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>

                            {response.ai_evaluation.feedback && (
                              <Typography variant="body2" sx={{ color: D.body }}>
                                <strong>Feedback:</strong> {response.ai_evaluation.feedback}
                              </Typography>
                            )}

                            {response.ai_evaluation.strengths && response.ai_evaluation.strengths.length > 0 && (
                              <Box>
                                <Typography variant="caption" sx={{ color: D.green.border, fontWeight: 700 }}>
                                  <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  Strengths:
                                </Typography>
                                <List dense>
                                  {response.ai_evaluation.strengths.map((strength, i) => (
                                    <ListItem key={i} sx={{ py: 0 }}>
                                      <ListItemText primary={strength} primaryTypographyProps={{ fontSize: '0.82rem', color: D.body }} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}

                            {response.ai_evaluation.improvements && response.ai_evaluation.improvements.length > 0 && (
                              <Box>
                                <Typography variant="caption" sx={{ color: D.orange.border, fontWeight: 700 }}>
                                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  Areas for Improvement:
                                </Typography>
                                <List dense>
                                  {response.ai_evaluation.improvements.map((improvement, i) => (
                                    <ListItem key={i} sx={{ py: 0 }}>
                                      <ListItemText primary={improvement} primaryTypographyProps={{ fontSize: '0.82rem', color: D.body }} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    )}

                    <Typography variant="caption" sx={{ color: D.muted }}>
                      Submitted: {formatTimestamp(response.timestamp)}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* ── Tab Panel 2: Remedial Activities ── */}
      <TabPanel value={tabValue} index={2}>
        {remedial_with_ai.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              border: `2px solid ${D.blue.border}`,
              borderRadius: '14px',
              bgcolor: D.blue.bg,
              color: D.blue.border,
              boxShadow: `3px 3px 0 ${D.blue.shadow}`,
            }}
          >
            No remedial activities completed yet.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {remedial_with_ai.map((activity, idx) => (
              <Accordion key={idx} sx={accordionSx} disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: D.purple.border }} />}
                  sx={{ bgcolor: 'transparent', '& .MuiAccordionSummary-content': { m: '10px 0' } }}
                >
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip label={activity.step_id} size="small" sx={{ bgcolor: D.indigo.bg, color: D.indigo.border, border: `1px solid ${D.indigo.border}`, fontWeight: 700, fontSize: '0.7rem' }} />
                    <Chip label={activity.level} size="small" sx={{ bgcolor: D.purple.bg, color: D.purple.border, border: `1px solid ${D.purple.border}`, fontWeight: 700, fontSize: '0.7rem' }} />
                    <Typography variant="body2" sx={{ flex: 1, color: D.body }}>
                      Activity {activity.activity_index}
                    </Typography>
                    {activity.completed ? (
                      <CheckCircleIcon sx={{ color: D.green.border, fontSize: 20 }} />
                    ) : (
                      <AccessTimeIcon sx={{ color: D.muted, fontSize: 20 }} />
                    )}
                    {activity.ai_evaluation && (
                      <Chip
                        icon={<SmartToyIcon sx={{ fontSize: '14px !important', color: `${D.purple.border} !important` }} />}
                        label="AI Evaluated"
                        size="small"
                        sx={{ bgcolor: D.purple.bg, color: D.purple.border, border: `1px solid ${D.purple.border}`, fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, bgcolor: 'transparent' }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>Student Responses:</Typography>
                      <Box sx={{
                        p: 2,
                        bgcolor: D.cardBg,
                        border: `2px solid ${D.border}`,
                        borderRadius: '12px',
                        boxShadow: `2px 2px 0 ${D.border}`,
                      }}>
                        {Object.entries(activity.responses || {}).map(([key, value]) => (
                          <Box key={key} sx={{ mb: 1 }}>
                            <Typography variant="caption" sx={{ color: D.muted }}>{key}:</Typography>
                            <Typography variant="body2" sx={{ color: D.body }}>{value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {activity.ai_evaluation && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: D.heading, fontWeight: 700 }}>
                          <SmartToyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle', color: D.purple.border }} />
                          AI Evaluation:
                        </Typography>
                        <Box sx={{
                          p: 2,
                          bgcolor: D.teal.bg,
                          border: `2px solid ${D.teal.border}`,
                          borderRadius: '12px',
                          boxShadow: `2px 2px 0 ${D.teal.shadow}`,
                        }}>
                          <Stack spacing={1}>
                            <Chip
                              label={`Score: ${activity.ai_evaluation.score || activity.score || 0}`}
                              color={getScoreColor(activity.ai_evaluation.score || activity.score || 0)}
                              size="small"
                              sx={{ fontWeight: 700, fontSize: '0.7rem', alignSelf: 'flex-start' }}
                            />
                            {activity.ai_evaluation.feedback && (
                              <Typography variant="body2" sx={{ color: D.body }}>{activity.ai_evaluation.feedback}</Typography>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    )}

                    <Typography variant="caption" sx={{ color: D.muted }}>
                      Completed: {formatTimestamp(activity.timestamp)}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* ── Tab Panel 3: AI Evaluations ── */}
      <TabPanel value={tabValue} index={3}>
        <Stack spacing={3}>
          {/* Summary stat cards */}
          <Grid container spacing={2}>
            {[
              {
                label: 'Total AI Evaluations',
                value: responses_with_ai.filter(r => r.ai_evaluation).length +
                  remedial_with_ai.filter(a => a.ai_evaluation).length,
                colorKey: 'indigo',
              },
              {
                label: 'Average AI Score',
                value: (() => {
                  const scores = [
                    ...responses_with_ai.filter(r => r.ai_evaluation?.score).map(r => r.ai_evaluation.score),
                    ...remedial_with_ai.filter(a => a.ai_evaluation?.score).map(a => a.ai_evaluation.score),
                  ]
                  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
                })(),
                colorKey: 'blue',
              },
              {
                label: 'Success Rate',
                value: (() => {
                  const scores = [
                    ...responses_with_ai.filter(r => r.ai_evaluation?.score).map(r => r.ai_evaluation.score),
                    ...remedial_with_ai.filter(a => a.ai_evaluation?.score).map(a => a.ai_evaluation.score),
                  ]
                  const passing = scores.filter(s => s >= 70).length
                  return scores.length > 0 ? `${Math.round((passing / scores.length) * 100)}%` : '0%'
                })(),
                colorKey: 'green',
              },
            ].map(({ label, value, colorKey }) => {
              const C = D[colorKey]
              return (
                <Grid item xs={12} md={4} key={label}>
                  <Box sx={{
                    background: C.bg,
                    border: `2px solid ${C.border}`,
                    borderRadius: '16px',
                    boxShadow: `4px 4px 0 ${C.shadow}`,
                    p: 2.5,
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: `6px 6px 0 ${C.shadow}` },
                  }}>
                    <Typography sx={{ fontSize: '0.78rem', color: D.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: C.border, lineHeight: 1.2, mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* All evaluations combined */}
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: D.heading }}>All AI Evaluations</Typography>

          <Alert
            severity="info"
            icon={<InfoIcon />}
            sx={{
              border: `2px solid ${D.blue.border}`,
              borderRadius: '14px',
              bgcolor: D.blue.bg,
              color: D.blue.border,
              boxShadow: `2px 2px 0 ${D.blue.shadow}`,
            }}
          >
            This section shows all AI-powered evaluations for writing tasks and remedial activities.
          </Alert>

          {[...responses_with_ai.filter(r => r.ai_evaluation),
            ...remedial_with_ai.filter(a => a.ai_evaluation).map(a => ({
              ...a,
              response_text: JSON.stringify(a.responses),
              isRemedial: true,
            }))].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                ...claySx,
                p: 2.5,
                '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `6px 6px 0 ${D.border}` },
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  {item.isRemedial ? (
                    <>
                      <Chip label="Remedial" size="small" sx={{ bgcolor: D.teal.bg, color: D.teal.border, border: `1px solid ${D.teal.border}`, fontWeight: 700, fontSize: '0.7rem' }} />
                      <Chip label={item.level} size="small" sx={{ bgcolor: D.indigo.bg, color: D.indigo.border, border: `1px solid ${D.indigo.border}`, fontWeight: 600, fontSize: '0.7rem' }} />
                    </>
                  ) : (
                    <Chip label="Phase 2 Response" size="small" sx={{ bgcolor: D.purple.bg, color: D.purple.border, border: `1px solid ${D.purple.border}`, fontWeight: 700, fontSize: '0.7rem' }} />
                  )}
                  <Chip
                    label={`Score: ${item.ai_evaluation.score || 0}`}
                    color={getScoreColor(item.ai_evaluation.score || 0)}
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <Typography variant="caption" sx={{ ml: 'auto', color: D.muted }}>
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: D.blue.border, fontWeight: 500 }}>
                  {item.ai_evaluation.feedback}
                </Typography>

                {item.ai_evaluation.level_alignment && (
                  <Chip
                    label={`Level Alignment: ${item.ai_evaluation.level_alignment}`}
                    size="small"
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: D.indigo.bg,
                      color: D.indigo.border,
                      border: `1px solid ${D.indigo.border}`,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </TabPanel>

    </Box>
  )
}
