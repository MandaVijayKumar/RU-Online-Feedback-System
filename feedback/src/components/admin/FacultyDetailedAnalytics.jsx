import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../../api/api'

/* ---------------- QUESTIONS ---------------- */

const THEORY_QUESTIONS = [
  { id: 't1', text: 'The teacher explains concepts clearly.' },
  { id: 't2', text: 'The teacher is well prepared for the class.' },
  { id: 't3', text: 'The pace of teaching is appropriate.' },
  { id: 't4', text: 'Examples used are relevant and helpful.' },
  { id: 't5', text: 'The teacher encourages student interaction.' },
  { id: 't6', text: 'Doubts are clarified effectively.' },
  { id: 't7', text: 'The teacher motivates students to learn.' },
  { id: 't8', text: 'Internal evaluation is fair.' },
  { id: 't9', text: 'Coverage of syllabus is satisfactory.' },
  { id: 't10', text: 'Overall teaching effectiveness.' }
]

const LAB_QUESTIONS = [
  { id: 'l1', text: 'Lab objectives are clearly explained.' },
  { id: 'l2', text: 'Lab equipment and resources are adequate.' },
  { id: 'l3', text: 'Experiments are well demonstrated.' },
  { id: 'l4', text: 'Lab sessions enhance practical knowledge.' },
  { id: 'l5', text: 'Safety measures are properly followed.' },
  { id: 'l6', text: 'Lab instructions are clear and understandable.' },
  { id: 'l7', text: 'Faculty provides sufficient guidance during lab.' },
  { id: 'l8', text: 'Time allotted for lab is sufficient.' },
  { id: 'l9', text: 'Evaluation of lab work is fair.' },
  { id: 'l10', text: 'Overall lab effectiveness.' }
]

const RATING_MEANING = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

const RATING_COLOR = {
  1: '#DC2626', // red
  2: '#F97316', // orange
  3: '#EAB308', // yellow
  4: '#22C55E', // green
  5: '#16A34A'  // dark green
}

/* ---------------- COMPONENT ---------------- */

export default function FacultyDetailedAnalytics() {
  const { facultyId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)

  const course = params.get('course')
  const semester = params.get('semester')
  const year = params.get('year')

  const [faculty, setFaculty] = useState(null)
  const [subjectTab, setSubjectTab] = useState(0)
  const [typeTab, setTypeTab] = useState(0)

  useEffect(() => {
    fetchDetails()
    // eslint-disable-next-line
  }, [])

  const fetchDetails = async () => {
    const res = await api.get(
      `/admin/analytics/faculty/${facultyId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        params: { course, semester, year }
      }
    )
    setFaculty(res.data)
  }

  if (!faculty) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  const subject = faculty.subjects?.[subjectTab]
  const isTheory = typeTab === 0
  const feedback = isTheory ? subject?.theory : subject?.lab
  const questions = isTheory ? THEORY_QUESTIONS : LAB_QUESTIONS

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Typography variant="h5" fontWeight="bold">
        Faculty Detailed Feedback Report
      </Typography>

      <Typography sx={{ mb: 3,color:'#0B3C5D'}}>
        <b>{faculty.name}</b> ({faculty.designation}) <br />
        {faculty.department} | {course} | Semester {semester} | {year}
      </Typography>

      {/* SUBJECT TABS */}
      <Tabs
        value={subjectTab}
        onChange={(e, v) => {
          setSubjectTab(v)
          setTypeTab(0)
        }}
        sx={{ mb: 2 }}
      >
        {faculty.subjects.map((s, i) => (
          <Tab key={i} label={s.subject_name} />
        ))}
      </Tabs>

      {/* THEORY / LAB TABS */}
      <Tabs
        value={typeTab}
        onChange={(e, v) => setTypeTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="Theory" />
        <Tab label="Lab" />
      </Tabs>

      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {subject.subject_name} – {isTheory ? 'Theory' : 'Lab'}
        </Typography>

        {!feedback?.students?.length ? (
          <Typography>No feedback available</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Student</b></TableCell>
                <TableCell><b>Feedback Questions & Ratings</b></TableCell>
                <TableCell><b>Average</b></TableCell>
                <TableCell><b>Comments</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {feedback.students.map((s, idx) => {
                const avg = Number(s.avgRating || 0)

                return (
                  <TableRow key={idx}>
                    {/* STUDENT */}
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <Typography fontWeight="bold">
                        {s.student_name}
                      </Typography>
                      <Typography variant="body2">
                        {s.hall_ticket}
                      </Typography>
                    </TableCell>

                    {/* QUESTIONS */}
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      {questions.map((q, i) => {
                        const r = Number(s.ratings?.[q.id] || 0)
                        return (
                          <Box key={q.id} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {i + 1}. {q.text}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: `${r * 16}px`,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: RATING_COLOR[r] || '#E5E7EB'
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: RATING_COLOR[r] || 'text.secondary' }}
                              >
                                <b>{r}</b> / 5 {r ? `(${RATING_MEANING[r]})` : ''}
                              </Typography>
                            </Box>
                          </Box>
                        )
                      })}
                    </TableCell>

                    {/* AVG */}
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <b>{avg.toFixed(2)}</b>
                    </TableCell>

                    {/* COMMENT */}
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      {s.comment || '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Button variant="outlined" onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  )
}
