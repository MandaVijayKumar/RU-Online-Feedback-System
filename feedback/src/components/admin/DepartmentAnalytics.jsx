import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function DepartmentAnalytics() {
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])
  const [filtersData, setFiltersData] = useState({})
  const [selectedFilters, setSelectedFilters] = useState({})

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchDepartments()
  }, [])

  // 1️⃣ Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/analytics/departments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      setDepartments(res.data.departments)
    } catch {
      alert('Failed to load departments')
    }
  }

  // 2️⃣ Fetch filters for each department
  const fetchFilters = async (dept) => {
    try {
      const res = await api.get(`/admin/analytics/filters/${dept}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      setFiltersData(prev => ({
        ...prev,
        [dept]: res.data
      }))
    } catch {
      console.error('Filter load failed for', dept)
    }
  }

  // Load filters after departments
  useEffect(() => {
    departments.forEach(dept => {
      fetchFilters(dept)
    })
  }, [departments])

  // 3️⃣ Handle dropdown changes
  const handleChange = (dept, field, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [field]: value
      }
    }))
  }

  // 4️⃣ Submit analytics view
  const handleSubmit = (dept) => {
    const filters = selectedFilters[dept]
    if (!filters?.course || !filters?.semester || !filters?.academic_year) {
      alert('Please select Course, Semester and Academic Year')
      return
    }

    navigate(
      `/admin/analytics/department/${dept}?course=${filters.course}&semester=${filters.semester}&year=${filters.academic_year}`
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 'bold', color: '#0B3C5D' }}
      >
        Faculty Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        {departments.map((dept) => (
          <Grid item xs={12} sm={6} md={4} key={dept}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.03)' }
              }}
            >
              <Typography variant="h6" align="center" sx={{ mb: 2,color:'#0B3C5D' }}>
                {dept}
              </Typography>

              {/* COURSE */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  label="Course"
                  value={selectedFilters[dept]?.course || ''}
                  onChange={(e) =>
                    handleChange(dept, 'course', e.target.value)
                  }
                >
                  {filtersData[dept]?.courses?.map(course => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* SEMESTER */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  label="Semester"
                  value={selectedFilters[dept]?.semester || ''}
                  onChange={(e) =>
                    handleChange(dept, 'semester', e.target.value)
                  }
                >
                  {filtersData[dept]?.semesters?.map(sem => (
                    <MenuItem key={sem} value={sem}>
                      {sem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* ACADEMIC YEAR */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  value={selectedFilters[dept]?.academic_year || ''}
                  onChange={(e) =>
                    handleChange(dept, 'academic_year', e.target.value)
                  }
                >
                  {filtersData[dept]?.academicYears?.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#0B3C5D' }}
                onClick={() => handleSubmit(dept)}
              >
                View Analytics
              </Button>
            </Paper>
          </Grid>
        ))}

        {departments.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center">
              No analytics data available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
