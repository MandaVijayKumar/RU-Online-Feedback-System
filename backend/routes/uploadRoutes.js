import express from 'express'
import multer from 'multer'
import { uploadStudents, uploadFaculty, uploadSubjects } from '../controllers/uploadController.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/students', adminMiddleware, upload.single('file'), uploadStudents)
router.post('/faculty', adminMiddleware, upload.single('file'), uploadFaculty)
router.post('/subjects', adminMiddleware, upload.single('file'), uploadSubjects)

export default router
