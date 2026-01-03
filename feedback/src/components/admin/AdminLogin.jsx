import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Enter username and password')
      return
    }

    try {
      const res = await api.post('/admin/login', {
        username,
        password
      })

      // store token
      localStorage.setItem('adminToken', res.data.token)

      alert('Login successful')
      navigate('/admin/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6">Admin Login</Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  )
}
