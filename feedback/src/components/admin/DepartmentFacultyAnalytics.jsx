import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Divider
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/api'

export default function DepartmentFacultyAnalytics() {
  const { department } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)

  const course = params.get('course')
  const semester = params.get('semester')
  const year = params.get('year')

  const [faculty, setFaculty] = useState([])

  useEffect(() => {
    fetchFacultyAnalytics()
  }, [])

  const fetchFacultyAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics/faculty', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        params: { department, course, semester, year }
      })

      setFaculty(res.data.facultyAnalytics || [])
    } catch (err) {
      alert('Failed to load faculty analytics')
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
        {department} – Faculty Performance
      </Typography>

      <Typography sx={{ mb: 3 }}>
        Course: <b>{course}</b> | Semester: <b>{semester}</b> | Academic Year: <b>{year}</b>
      </Typography>

      <Grid container spacing={3}>
        {faculty.map(f => (
          <Grid item xs={12} md={6} key={f.faculty_id}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              {/* FACULTY INFO */}
              <Typography variant="h6">{f.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {f.designation}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* SUBJECT-WISE */}
              {f.subjects.map((sub, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {sub.subject_name}
                  </Typography>

                  {/* THEORY */}
                  {sub.theory && (
                    <Chip
                      label={`Theory: ${sub.theory.avgRating} / 5 (${sub.theory.feedbackCount})`}
                      color="primary"
                      size="small"
                      sx={{ mr: 1, mt: 0.5 }}
                    />
                  )}

                  {/* LAB */}
                  {sub.lab && (
                    <Chip
                      label={`Lab: ${sub.lab.avgRating} / 5 (${sub.lab.feedbackCount})`}
                      color="success"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              ))}

              <Button
                fullWidth
                sx={{ mt: 2,background:'#0B3C5D' }}
                variant="contained"
                onClick={() =>
                  navigate(
                    `/admin/analytics/faculty/${f.faculty_id}?course=${course}&semester=${semester}&year=${year}`
                  )
                }
              >
                View Detailed Report
              </Button>
            </Paper>
          </Grid>
        ))}

        {faculty.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center">
              No feedback data available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
