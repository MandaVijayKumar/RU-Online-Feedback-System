import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function FacultyAnalytics() {
    const navigate = useNavigate()
    const [facultyData, setFacultyData] = useState([])

    // 🔐 Protect Route
    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin')
            return
        }

        loadAnalytics()
    }, [navigate])

    const loadAnalytics = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const res = await api.get('/admin/analytics/faculty', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFacultyData(res.data)
        } catch (err) {
            console.error(err)
            alert('Failed to load analytics')
        }
    }

    const getPerformanceChip = (score) => {
        if (score >= 4.5) return <Chip label="Excellent" color="success" />
        if (score >= 4.0) return <Chip label="Very Good" color="primary" />
        if (score >= 3.0) return <Chip label="Good" color="warning" />
        return <Chip label="Needs Improvement" color="error" />
    }

    const viewDetails = (facultyId) => {
        navigate(`/admin/faculty/${facultyId}`)
    }



    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0B3C5D' }}>
                    Faculty Performance Analytics
                </Typography>

                <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
                    Back
                </Button>
            </Box>

            {/* TABLE */}
            <TableContainer component={Paper} elevation={4}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#0B3C5D' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Faculty Name</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">
                                Total Responses
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">
                                Average Score
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">
                                Performance
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">
                                Report
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {facultyData.map((f) => (
                            <TableRow key={f.faculty_id}>
                                <TableCell>{f.name}</TableCell>
                                <TableCell align="center">{f.responses}</TableCell>
                                <TableCell align="center">
                                    {Number(f.average_score).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    {getPerformanceChip(f.average_score)}
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ backgroundColor: '#0B3C5D' }}
                                        onClick={() => viewDetails(f.faculty_id)}
                                    >
                                        View
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}

                        {facultyData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No feedback data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
