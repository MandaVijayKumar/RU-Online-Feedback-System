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

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }

    fetchFaculty()
  }, [navigate])

  const fetchFaculty = async () => {
    try {
      const res = await api.get('/admin/faculty', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      setFaculty(res.data)
    } catch (err) {
      alert('Failed to load faculty')
    }
  }

  const handleDelete = async (id) => {
    console.log('Delete faculty id:', id)
    if (!window.confirm('Delete faculty and related subjects?')) return

    try {
      await api.delete(`/admin/faculty/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      alert('Faculty deleted')
      fetchFaculty()
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Faculty
      </Typography>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {faculty.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.department}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleDelete(f.faculty_id)}
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
