import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function FacultyPerformance() {
  const { facultyId } = useParams()
  const navigate = useNavigate()
  const [faculty, setFaculty] = useState({ name: '', department: '' })
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchFacultyPerformance()
  }, [facultyId, navigate])

  const fetchFacultyPerformance = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      console.log(`Fetching performance details for faculty ID: ${facultyId}`)
      const res = await api.get(`/admin/analytics/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setFaculty({ name: res.data.name, department: res.data.department })
      setFeedbacks(res.data.feedbacks || [])
    } catch (err) {
      console.error(err)
      alert('Failed to load faculty performance')
    }
  }

  // ----------------- PDF DOWNLOAD -----------------
  const downloadPdf = () => {
    if (!faculty.name || feedbacks.length === 0) {
      alert('No data to generate PDF!')
      return
    }

    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Faculty Performance Report', 14, 22)
    doc.setFontSize(12)
    doc.text(`Faculty: ${faculty.name}`, 14, 32)
    doc.text(`Department: ${faculty.department}`, 14, 40)
    doc.text(`Total Feedbacks: ${feedbacks.length}`, 14, 48)

    const tableColumns = ['Student', 'Hall Ticket', 'Type', 'Questions & Ratings', 'Comments']
    const tableRows = []

    feedbacks.forEach(f => {
      const questionsRatings = Object.entries(f.ratings || {})
        .map(([qKey, val]) => `${f.questions?.[qKey] || qKey}: ${val}`)
        .join(', ')

      tableRows.push([
        f.student_name || '-',
        f.hall_ticket || '-',
        f.feedback_type || '-',
        questionsRatings,
        f.comments || '-'
      ])
    })

    doc.autoTable({
      startY: 55,
      head: [tableColumns],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [11, 60, 93], textColor: 255 },
      styles: { fontSize: 10 }
    })

    doc.save(`${faculty.name}_Performance.pdf`)
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0B3C5D' }}>
          {faculty.name || 'Faculty'} - Performance Details
        </Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 2 }} onClick={downloadPdf}>
            Download PDF
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/analytics')}>
            Back
          </Button>
        </Box>
      </Box>

      {/* Faculty Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Department: {faculty.department || '-'}</Typography>
        <Typography variant="subtitle1">Total Feedbacks: {feedbacks.length}</Typography>
      </Paper>

      {/* Feedback Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0B3C5D' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Student</TableCell>
              <TableCell sx={{ color: '#fff' }}>Hall Ticket</TableCell>
              <TableCell sx={{ color: '#fff' }}>Type</TableCell>
              <TableCell sx={{ color: '#fff' }}>Questions & Ratings</TableCell>
              <TableCell sx={{ color: '#fff' }}>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {feedbacks.map((f, idx) => {
    // Ensure ratings is an object
    const ratingsObj = typeof f.ratings === 'string' ? JSON.parse(f.ratings) : f.ratings;

    return (
      <TableRow key={idx}>
        <TableCell>{f.student_name || '-'}</TableCell>
        <TableCell>{f.hall_ticket || '-'}</TableCell>
        <TableCell>{f.feedback_type}</TableCell>
        <TableCell>
          {ratingsObj && Object.entries(ratingsObj).map(([qKey, val]) => (
            <Typography key={qKey} variant="body2">
              {f.questions?.[qKey] || qKey}: {val}
            </Typography>
          ))}
        </TableCell>
        <TableCell>{f.comments || '-'}</TableCell>
      </TableRow>
    );
  })}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  )
}
