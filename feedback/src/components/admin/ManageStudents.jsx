import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }

    fetchStudents()
  }, [navigate])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      setStudents(res.data)
    } catch (err) {
      alert('Failed to load students')
    }
  }

  const handleDelete = async (hallTicket) => {
    if (!window.confirm('Are you sure to delete this student?')) return

    try {
      await api.delete(`/admin/student/${hallTicket}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      alert('Student deleted')
      fetchStudents()
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Students
      </Typography>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hall Ticket</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((s) => (
              <TableRow key={s.hall_ticket}>
                <TableCell>{s.hall_ticket}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.course}</TableCell>
                <TableCell>{s.department}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleDelete(s.hall_ticket)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
