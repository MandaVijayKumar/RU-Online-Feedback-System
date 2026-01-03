import express from 'express'
import {
  adminLogin, deleteStudent, deleteFaculty, getAllStudents, getAllFaculty
} from '../controllers/adminController.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router = express.Router()

router.post('/login', adminLogin)
router.get('/students', adminMiddleware, getAllStudents)
router.get('/faculty', adminMiddleware, getAllFaculty)
router.delete('/student/:hallTicket', adminMiddleware, deleteStudent)
router.delete('/faculty/:id', adminMiddleware, deleteFaculty)

export default router
