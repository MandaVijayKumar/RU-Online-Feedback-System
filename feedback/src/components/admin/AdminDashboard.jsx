import {
  Box,
  Typography,
  Paper,
  Grid,
  Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* DASHBOARD CARDS */}
      <Grid container spacing={3}>
        {/* UPLOAD EXCEL */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Upload Excel Data</Typography>
            <Typography sx={{ mt: 1 }}>
              Upload student, faculty and subject details.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
              variant="contained"
              onClick={() => navigate('/admin/upload')}
            >
              Upload Excel
            </Button>
          </Paper>
        </Grid>

        {/* MANAGE STUDENTS */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Students</Typography>
            <Typography sx={{ mt: 1 }}>
              View or delete student records.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
              variant="contained"
              onClick={() => navigate('/admin/students')}
            >
              Students
            </Button>
          </Paper>
        </Grid>

        {/* MANAGE FACULTY */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Faculty</Typography>
            <Typography sx={{ mt: 1 }}>
              View or delete faculty and subjects.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
              variant="contained"
              onClick={() => navigate('/admin/faculty')}
            >
              Faculty
            </Button>
          </Paper>
        </Grid>

        {/* 📊 FACULTY ANALYTICS (VC VIEW) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6">
              Faculty Performance Analytics
            </Typography>
            <Typography sx={{ mt: 1 }}>
              View faculty-wise feedback analysis and download PDF reports.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
              variant="contained"
              onClick={() => navigate('/admin/analytics')}
            >
              View Analytics Dashboard
            </Button>
          </Paper>
        </Grid>

        {/* 📄 REPORTS (OPTIONAL FUTURE USE) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6">
              Reports 
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Download consolidated feedback reports.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 2,background:'#0B3C5D' }}
              variant="contained"
              onClick={() => navigate('/admin/reports')}
            >
              Reports
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
