import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

/* ================= QUESTIONS ================= */

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

/* ================= COMPONENT ================= */

export default function FeedbackForm() {
  const navigate = useNavigate()

  const [facultyList, setFacultyList] = useState([])
  const [subjectList, setSubjectList] = useState([])

  const [faculty, setFaculty] = useState('')
  const [subject, setSubject] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [answers, setAnswers] = useState({})
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const token = localStorage.getItem('studentToken')
    if (!token) {
      navigate('/student')
      return
    }

    const loadData = async () => {
      try {
        const res = await api.get('/feedback/faculty-subjects', {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log(res.data)
        setFacultyList(res.data.faculty)
        setSubjectList(res.data.subjects)
      } catch (err) {
        alert('Failed to load faculty and subjects')
      }
    }

    loadData()
  }, [navigate])

  /* ================= HELPERS ================= */
  const filteredSubjects = subjectList.filter(
    s => s.faculty_id === faculty
  )

  const QUESTIONS =
    feedbackType === 'LAB' ? LAB_QUESTIONS : THEORY_QUESTIONS

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (
      !faculty ||
      !subject ||
      !feedbackType ||
      Object.keys(answers).length !== QUESTIONS.length
    ) {
      alert('Please answer all questions')
      return
    }

    try {
      const token = localStorage.getItem('studentToken')

      const res = await api.post(
        '/feedback/submit-feedback',
        {
          facultyId: faculty,
          subjectId: subject,
          type: feedbackType,
          ratings: answers,
          comments
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      alert(res.data.msg || 'Feedback submitted successfully')
      setSubmitted(true)
    } catch (err) {
      alert(err.response?.data?.msg || 'Feedback submission failed')
    }
  }

  const handleAnotherFeedback = () => {
    setFaculty('')
    setSubject('')
    setFeedbackType('')
    setAnswers({})
    setComments('')
    setSubmitted(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('studentToken')
    navigate('/')
  }

  /* ================= UI ================= */
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, width: 650 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#0B3C5D', fontWeight: 'bold' }}>
          Student Feedback Form
        </Typography>

        {/* FACULTY */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Faculty</InputLabel>
          <Select value={faculty} label="Select Faculty"
            onChange={(e) => {
              setFaculty(e.target.value)
              setSubject('')
              setFeedbackType('')
              setAnswers({})
              setComments('')
            }}
          >
            {facultyList.map(f => (
              <MenuItem key={f.faculty_id} value={f.faculty_id}>
                {f.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SUBJECT */}
        <FormControl fullWidth margin="normal" disabled={!faculty}>
          <InputLabel>Select Subject</InputLabel>
          <Select value={subject} label="Select Subject"
            onChange={(e) => {
              setSubject(e.target.value)
              setFeedbackType('')
              setAnswers({})
              setComments('')
            }}
          >
            {filteredSubjects.map(s => (
              <MenuItem key={s.subject_id} value={s.subject_id}>
                {s.subject_name} (Sem {s.semester})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TYPE */}
        <FormControl fullWidth margin="normal" disabled={!subject}>
          <InputLabel>Feedback Type</InputLabel>
          <Select value={feedbackType} label="Feedback Type"
            onChange={(e) => {
              setFeedbackType(e.target.value)
              setAnswers({})
              setComments('')
            }}
          >
            <MenuItem value="THEORY">Theory</MenuItem>
            <MenuItem value="LAB">Lab</MenuItem>
          </Select>
        </FormControl>

        {/* QUESTIONS */}
        {feedbackType && QUESTIONS.map((q, i) => (
          <Box key={q.id} sx={{ mb: 2 }}>
            <Typography>{i + 1}. {q.text}</Typography>
            <RadioGroup
              row
              value={answers[q.id] || ''}
              onChange={(e) =>
                setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))
              }
            >
              <FormControlLabel value="5" control={<Radio />} label="Excellent" />
              <FormControlLabel value="4" control={<Radio />} label="Very Good" />
              <FormControlLabel value="3" control={<Radio />} label="Good" />
              <FormControlLabel value="2" control={<Radio />} label="Average" />
              <FormControlLabel value="1" control={<Radio />} label="Poor" />
            </RadioGroup>
          </Box>
        ))}

        {/* COMMENTS */}
        {feedbackType && (
          <TextField
            label="Additional Comments (Optional)"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        )}

        {/* ACTIONS */}
        {!submitted ? (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: '#0B3C5D' }}
            onClick={handleSubmit}
          >
            Submit Feedback
          </Button>
        ) : (
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#0B3C5D' }}
              onClick={handleAnotherFeedback}
            >
              Submit Another Feedback
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleLogout}
            >
              Logout & Go Home
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
