import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function StudentLogin() {
  const [hallTicket, setHallTicket] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (!hallTicket.trim()) {
      alert('Enter Hall Ticket Number')
      return
    }
   console.log('front end', hallTicket);
    try {
      const res = await api.post('/student/send-otp', {
        hallTicket
      })

      alert(res.data.msg)

      navigate('/otp', { state: { hallTicket } })
    } catch (err) {
      alert(err.response?.data?.msg || 'OTP failed')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6">Student Login</Typography>

        <TextField
          label="Hall Ticket Number"
          fullWidth
          margin="normal"
          value={hallTicket}
          onChange={(e) => setHallTicket(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
          onClick={handleSendOtp}
        >
          Send OTP
        </Button>
      </Paper>
    </Box>
  )
}
