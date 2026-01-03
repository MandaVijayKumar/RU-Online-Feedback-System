import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function ExcelUpload() {
  const [file, setFile] = useState(null)
  const [uploadType, setUploadType] = useState('')
  const navigate = useNavigate()

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) navigate('/admin')
  }, [navigate])

  const handleUpload = async () => {
    if (!file || !uploadType) {
      alert('Select upload type and file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post(
        `/admin/upload/${uploadType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      )

      alert(res.data.msg)
      setFile(null)
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload failed')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, width: 450 }}>
        <Typography variant="h6" gutterBottom>
          Upload Excel Data
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Upload Type</InputLabel>
          <Select
            value={uploadType}
            label="Upload Type"
            onChange={(e) => setUploadType(e.target.value)}
          >
            <MenuItem value="students">Students</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="subjects">Subjects</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          Choose Excel File
          <input
            type="file"
            hidden
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 1 }} variant="body2">
            Selected File: {file.name}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, backgroundColor: '#0B3C5D' }}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Paper>
    </Box>
  )
}
