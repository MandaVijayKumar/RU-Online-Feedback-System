import express from 'express'
import { submitFeedback, getFacultySubjects } from '../controllers/feedbackController.js'
import auth from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/faculty-subjects/:hallTicket', getFacultySubjects)
router.post('/submit-feedback', auth, submitFeedback)

export default router
