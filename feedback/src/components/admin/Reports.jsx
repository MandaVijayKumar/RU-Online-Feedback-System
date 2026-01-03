import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  LinearProgress,
  Tooltip
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function Reports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState('')

  // 🔐 Protect Route
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    loadReports()
  }, [navigate])

  const loadReports = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await api.get('/admin/reports/faculty', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load reports')
    }
  }

  const filteredReports = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const downloadPdf = (facultyId) => {
    const token = localStorage.getItem('adminToken')
    window.open(
      `${process.env.REACT_APP_API_URL}/admin/reports/faculty/${facultyId}/pdf?token=${token}`,
      '_blank'
    )
  }

  /* ---------- ANALYTICS HELPERS ---------- */

  const calcOverallAvg = (subjects = []) => {
    if (!subjects.length) return 0
    const total = subjects.reduce((s, x) => s + Number(x.avgRating || 0), 0)
    return (total / subjects.length).toFixed(2)
  }

  const positivePercentage = (subjects = []) => {
    if (!subjects.length) return 0
    const positive = subjects.filter(s => Number(s.avgRating) >= 4).length
    return Math.round((positive / subjects.length) * 100)
  }

  const ratingColor = (val) => {
    if (val >= 4.5) return 'success'
    if (val >= 3.5) return 'info'
    if (val >= 2.5) return 'warning'
    return 'error'
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#0B3C5D">
          Faculty Reports – Analytics Overview
        </Typography>

        <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
          Back
        </Button>
      </Box>

      {/* SEARCH */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Search Faculty"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* TABLE */}
      <Paper elevation={4}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0B3C5D' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Faculty</TableCell>
              <TableCell sx={{ color: '#fff' }}>Department</TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Subjects
              </TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Responses
              </TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Avg Rating
              </TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Positive %
              </TableCell>
              {/* <TableCell sx={{ color: '#fff' }} align="center">
                Report
              </TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Analytics
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReports.map(r => {
              const avg = calcOverallAvg(r.subjects)
              const positive = positivePercentage(r.subjects)

              return (
                <TableRow key={r.faculty_id}>
                  <TableCell>
                    <Typography fontWeight="bold">{r.name}</Typography>
                  </TableCell>

                  <TableCell>{r.department}</TableCell>

                  <TableCell align="center">
                    {r.subjects?.length || 0}
                  </TableCell>

                  <TableCell align="center">{r.responses}</TableCell>

                  {/* AVG RATING */}
                  <TableCell align="center">
                    <Tooltip title={`Average rating across subjects`}>
                      <Typography fontWeight="bold">
                        {avg}
                      </Typography>
                    </Tooltip>
                    <LinearProgress
                      variant="determinate"
                      value={(avg / 5) * 100}
                      color={ratingColor(avg)}
                      sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                    />
                  </TableCell>

                  {/* POSITIVE % */}
                  <TableCell align="center">
                    <Typography fontWeight="bold">
                      {positive}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={positive}
                      color={positive >= 75 ? 'success' : 'warning'}
                      sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                    />
                  </TableCell>

                  {/* PDF */}
                  {/* <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#0B3C5D' }}
                      onClick={() => downloadPdf(r.faculty_id)}
                    >
                      PDF
                    </Button>
                  </TableCell> */}

                  {/* VIEW */}
                  {/* <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/admin/analytics/${r.faculty_id}`)
                      }
                    >
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              )
            })}

            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
