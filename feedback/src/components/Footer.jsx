import { Box, Typography, Grid, Divider } from '@mui/material'

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#0B3C5D',
        color: '#fff',
        mt: 6,
        pt: 4,
        pb: 2
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        
        {/* University Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Rayalaseema University
          </Typography>
          <Typography>
            Kurnool, Andhra Pradesh
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Online Student Feedback System
          </Typography>
        </Grid>

        {/* Contact Us */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Contact Us
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Dr. M. Rajeswari</strong>
          </Typography>
          <Typography>
            Assistant Professor
          </Typography>
          <Typography>
            Department of Computer Science
          </Typography>
          <Typography sx={{ mt: 1 }}>
            📞 Mobile: 9030160281
          </Typography>
          <Typography>
            ✉️ Email: rajeswarirucs@gmail.com
          </Typography>
        </Grid>

        {/* NAAC / System Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            About the System
          </Typography>
          <Typography>
            This feedback system is developed as per NAAC guidelines to
            improve teaching quality and academic standards through
            confidential student feedback.
          </Typography>
        </Grid>

      </Grid>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', my: 3 }} />

      {/* Copyright */}
      <Typography align="center" sx={{ fontSize: 14 }}>
        © {new Date().getFullYear()} Rayalaseema University, Kurnool. All Rights Reserved.
      </Typography>
    </Box>
  )
}
