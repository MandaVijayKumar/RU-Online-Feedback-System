import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../../api/api'

export default function OtpVerify() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  const hallTicket = state?.hallTicket

  useEffect(() => {
    if (!hallTicket) {
      navigate('/student')
    }
  }, [hallTicket, navigate])

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Enter OTP')
      return
    }

    try {
      const res = await api.post('/student/verify-otp', {
        hallTicket,
        otp
      })

      // ✅ SAVE TOKEN
      localStorage.setItem('studentToken', res.data.token)

      alert(res.data.msg)

      // ❌ NO hallTicket passed now
      navigate('/feedback')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'OTP verification failed')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6">OTP Verification</Typography>

        <TextField
          label="Enter OTP"
          fullWidth
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#0B3C5D' }}
          onClick={handleVerifyOtp}
        >
          Verify OTP
        </Button>
      </Paper>
    </Box>
  )
}
