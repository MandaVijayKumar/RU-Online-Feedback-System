import { Box, Typography, Paper, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import buildingImg from '../../assets/building.JPG'
import vcImg from '../../assets/vc.jpg'
import rectorImg from '../../assets/rector.jpg'
import registrarImg from '../../assets/registrar.jpg'

export default function Home() {
  const navigate = useNavigate()

  const leaders = [
    { img: vcImg, name: 'Prof. V. Venkata Basava Rao', title: 'Vice Chancellor' },
    { img: rectorImg, name: 'Prof. N.T.K. Naik', title: 'Rector' },
    { img: registrarImg, name: 'Dr. B. Vijaya Kumar Naidu', title: 'Registrar' }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: 400,
          backgroundImage: `url(${buildingImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(0,0,0,0.5)',
            p: 4,
            borderRadius: 2,
            color: '#edf0f2ff',
          }}
        >
          <Typography variant="h3" gutterBottom>
            Rayalaseema University, Kurnool
          </Typography>
          <Typography variant="h6" gutterBottom>
            Online Student Feedback System
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Submit confidential feedback on faculty performance using secure OTP-based authentication.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/student')} sx={{background:'#0B3C5D'}}
          >
            Submit Feedback
          </Button>
        </Box>
      </Box>

      {/* Leaders Section - Horizontal */}
      <Box sx={{ p: 4, bgcolor: '#f9f9f9' }}>
        <Grid container spacing={4} justifyContent="center">
          {leaders.map((leader, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <img
                  src={leader.img}
                  alt={leader.name}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{color:'#0B3C5D'}}>{leader.name}</Typography>
                  <Typography variant="subtitle2" sx={{ color: 'gray' }}>
                    {leader.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

{/* Instructions Section */}
<Box sx={{ p: 4 }}>
  <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
    <Typography 
      variant="h5" 
      gutterBottom 
      sx={{ fontWeight: 'bold', color: '#0B3C5D' }}
    >
      Instructions for Students
    </Typography>

    {/* General Instructions */}
    <Box sx={{ mt: 2, pl: 2 }}>
      <Typography sx={{ mb: 1 }}>
        • <strong>Use your official hall ticket number</strong> for OTP authentication.
      </Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>
        • మీ అధికారిక హాల్ టికెట్ నంబర్ ఉపయోగించి OTP ఆధారిత నిర్ధారణ చేయండి.
      </Typography>

      <Typography sx={{ mb: 1 }}>
        • <strong>Select the correct faculty, subject, and feedback type (Theory or Lab)</strong> before submitting feedback.
      </Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>
        • ఫీడ్‌బ్యాక్ సమర్పించడానికి సరియైన ఫ్యాకల్టీ, సబ్జెక్ట్, మరియు ఫీడ్‌బ్యాక్ రకాన్ని (థియరీ లేదా ల్యాబ్) ఎంచుకోండి.
      </Typography>

      <Typography sx={{ mb: 1 }}>
        • <strong>Answer all the questions honestly and completely</strong>.
      </Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>
        • అన్ని ప్రశ్నలకు నిజాయితీగా మరియు పూర్తిగా సమాధానమివ్వండి.
      </Typography>

      <Typography sx={{ mb: 1 }}>
        • <strong>Additional comments</strong> are optional but helpful for improving academic quality.
      </Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>
        • అదనపు కామెంట్లు ఐచ్ఛికం, కానీ విద్యాసంబంధిత నాణ్యత మెరుగుపరిచేందుకు ఉపయోగకరంగా ఉంటాయి.
      </Typography>
    </Box>

    {/* Theory Feedback */}
    <Box sx={{ mt: 3, pl: 2 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ fontWeight: 'bold', mb: 1, color: '#0B3C5D' }}
      >
        Theory Feedback
      </Typography>
      <Typography sx={{ mb: 1 }}>• Complete the Theory feedback form first.</Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>• మొదట థియరీ ఫీడ్‌బ్యాక్ ఫారం పూర్తి చేయండి.</Typography>

      <Typography sx={{ mb: 1 }}>• If the same faculty teaches multiple theory subjects, submit feedback separately for each subject.</Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>• ఒకే ఫ్యాకల్టీ ఒకటి కంటే ఎక్కువ థియరీ సబ్జెక్ట్ చదిస్తే, ప్రతి సబ్జెక్ట్ కోసం వేర్వేరు ఫీడ్‌బ్యాక్ సమర్పించండి.</Typography>
    </Box>

    {/* Lab Feedback */}
    <Box sx={{ mt: 3, pl: 2 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ fontWeight: 'bold', mb: 1, color: '#0B3C5D' }}
      >
        Lab Feedback
      </Typography>
      <Typography sx={{ mb: 1 }}>• Submit Lab feedback only if applicable.</Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>• ల్యాబ్ ఫీడ్‌బ్యాక్ అవసరమైతే మాత్రమే సమర్పించండి.</Typography>

      <Typography sx={{ mb: 1 }}>• Follow the same process: select correct faculty, subject, and Lab feedback type.</Typography>
      <Typography sx={{ mb: 1, ml: 3, color: 'gray' }}>• అదే ప్రక్రియను అనుసరించండి: సరైన ఫ్యాకల్టీ, సబ్జెక్ట్, మరియు ల్యాబ్ ఫీడ్‌బ్యాక్ రకాన్ని ఎంచుకోండి.</Typography>
    </Box>
  </Paper>
</Box>


    </Box>
  )
}
