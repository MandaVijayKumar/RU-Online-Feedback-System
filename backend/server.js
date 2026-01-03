import express from 'express'
import mysql from 'mysql2'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import cors from 'cors'
import multer from 'multer'
import XLSX from 'xlsx'
import { randomInt } from 'crypto'
import path from 'path'
import PDFDocument from 'pdfkit';
import fs from 'fs';


const app = express()
const PORT = 5000
const JWT_SECRET = 'RAYALASEEMA_FEEDBACK_SECRET'

app.use(cors())
app.use(express.json())

// ===== MySQL Pool =====
export const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'kalam', // your MySQL password
  database: 'feedback_db1'
})

// ===== Email Transporter =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mandavijaykumar40@gmail.com',
    pass: 'wmof chmd wjfm nrlj'
  }
})
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error)
  } else {
    console.log('Email transporter ready')
  }
})


// ===== Utils =====
const generateOTP = () => String(randomInt(100000, 999999))
const readExcel = (filePath) => {
  const wb = XLSX.readFile(filePath)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet)
}

// ===== Middleware =====
const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ msg: 'No token provided' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded.isAdmin) return res.status(403).json({ msg: 'Forbidden' })
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ msg: 'Invalid token' })
  }
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ msg: 'Invalid token' })
  }
}

// ===== Admin Routes =====
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  db.query('SELECT * FROM admin WHERE username=?', [username], async (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    if (!result.length) return res.status(401).json({ msg: 'Invalid username' })

    const valid = await bcrypt.compare(password, result[0].password)
    if (!valid) return res.status(401).json({ msg: 'Invalid password' })

    const token = jwt.sign({ id: result[0].id, isAdmin: true }, JWT_SECRET, { expiresIn: '8h' })
    res.json({ token })
  })
})

app.get('/api/admin/students',  (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    res.json(results)
  })
})

app.get('/api/admin/faculty',  (req, res) => {
  db.query('SELECT * FROM faculty', (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    res.json(results)
  })
})

app.delete('/api/admin/student/:hallTicket',  (req, res) => {
  db.query('DELETE FROM students WHERE hall_ticket=?', [req.params.hallTicket], (err) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    res.json({ msg: 'Student deleted' })
  })
})

app.delete('/api/admin/faculty/:facultyId', (req, res) => {
  const facultyId = req.params.facultyId

  // Optional: delete subjects first (recommended)
  db.query(
    'DELETE FROM subjects WHERE faculty_id=?',
    [facultyId],
    (err1) => {
      if (err1) {
        console.error('Delete subjects error:', err1)
        return res.status(500).json({ msg: 'DB error' })
      }

      // Delete faculty
      db.query(
        'DELETE FROM faculty WHERE faculty_id=?',
        [facultyId],
        (err2) => {
          if (err2) {
            console.error('Delete faculty error:', err2)
            return res.status(500).json({ msg: 'DB error' })
          }

          res.json({ msg: 'Faculty deleted successfully' })
        }
      )
    }
  )
})


// ===== Student OTP Routes =====
app.post('/api/student/send-otp', (req, res) => {
  const { hallTicket } = req.body
  console.log(hallTicket);
  if (!hallTicket) return res.status(400).json({ msg: 'Hall Ticket required' })

  const otp = generateOTP()
  console.log(otp);

  db.query('SELECT * FROM students WHERE hall_ticket=?', [hallTicket], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error' })
    if (!result.length) return res.status(404).json({ msg: 'Invalid Hall Ticket' })

    const email = result[0].email
    console.log(email);
    if (!email) return res.status(500).json({ msg: 'Email not found for student' })

    db.query('UPDATE students SET otp=? WHERE hall_ticket=?', [otp, hallTicket], (err2) => {
      if (err2) return res.status(500).json({ msg: 'Failed to save OTP' })

      transporter.sendMail({
        to: email,
        subject: 'Feedback OTP',
        text: `Your OTP is ${otp}`
      }, (mailErr) => {
        if (mailErr) return res.status(500).json({ msg: 'Failed to send OTP email' })
        res.json({ msg: 'OTP sent successfully' })
      })
    })
  })
})

app.post('/api/student/verify-otp', (req, res) => {
  const { hallTicket, otp } = req.body

  if (!hallTicket || !otp) {
    return res.status(400).json({ msg: 'Hall Ticket and OTP required' })
  }

  db.query(
    'SELECT * FROM students WHERE hall_ticket=? AND otp=?',
    [hallTicket, otp],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database error' })
      if (!result.length) return res.status(401).json({ msg: 'Invalid OTP' })

      // 🔐 Clear OTP after verification
      db.query(
        'UPDATE students SET otp=NULL WHERE hall_ticket=?',
        [hallTicket]
      )

      // 🔑 Generate JWT
      const token = jwt.sign(
        { hallTicket },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      res.json({
        msg: 'OTP verified successfully',
        token
      })
    }
  )
})


// ===== Feedback Routes =====
// app.post('/api/feedback/submit-feedback', authMiddleware, (req, res) => {
//   const { facultyId, subjectId, ratings, comments } = req.body
//   const hallTicket = req.user.hallTicket

//   db.query(
//     'INSERT INTO feedback (hall_ticket, faculty_id, subject_id, ratings, comments) VALUES (?,?,?,?,?)',
//     [hallTicket, facultyId, subjectId, ratings, comments],
//     (err) => {
//       if (err) return res.status(500).json({ msg: 'DB error' })
//       res.json({ msg: 'Feedback submitted successfully' })
//     }
//   )
// })

app.get('/api/feedback/faculty-subjects', authMiddleware, (req, res) => {
  const hallTicket = req.user.hallTicket

  // 1️⃣ Get student details
  db.query(
    `SELECT 
       hall_ticket,
       name,
       department,
       course,
       semester,
       academic_year
     FROM students 
     WHERE hall_ticket=?`,
    [hallTicket],
    (err, student) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      if (!student.length) return res.status(404).json({ msg: 'Student not found' })

      const studentDetails = student[0]
      const { department, course, semester } = studentDetails

      // 2️⃣ Get faculty & subjects
      db.query(
        `SELECT 
           f.faculty_id,
           f.name AS faculty_name,
           f.department AS faculty_department,
           f.designation AS faculty_designation,
           s.subject_id,
           s.subject_name,
           s.semester,
           s.course
         FROM faculty f
         JOIN subjects s ON s.faculty_id = f.faculty_id
         WHERE f.department = ?
           AND s.course = ?
           AND s.semester = ?`,
        [department, course, semester],
        (err2, results) => {
          if (err2) {
            console.error(err2)
            return res.status(500).json({ msg: 'DB error' })
          }

          const faculty = []
          const subjects = []

          results.forEach(r => {
            if (!faculty.find(f => f.faculty_id === r.faculty_id)) {
              faculty.push({
                faculty_id: r.faculty_id,
                name: r.faculty_name,
                department: r.faculty_department,
                designation: r.faculty_designation
              })
            }

            subjects.push({
              subject_id: r.subject_id,
              subject_name: r.subject_name,
              semester: r.semester,
              course: r.course,
              faculty_id: r.faculty_id
            })
          })

          // ✅ FINAL RESPONSE
          res.json({
            student: studentDetails,
            faculty,
            subjects
          })
        }
      )
    }
  )
})

app.post('/api/feedback/submit-feedback', authMiddleware, (req, res) => {
  const hallTicket = req.user.hallTicket
  const { facultyId, subjectId, type, ratings, comments } = req.body

  if (!facultyId || !subjectId || !type || !ratings) {
    return res.status(400).json({ msg: 'Missing required fields' })
  }

  // 1️⃣ Get student details
  db.query(
    `SELECT name ,department, course, semester,academic_year

     FROM students
     WHERE hall_ticket=?`,
    [hallTicket],
    (err, student) => {
      if (err || !student.length)
        return res.status(500).json({ msg: 'Student not found' })

      const { name, department, course, semester, academic_year } = student[0]

      // 2️⃣ Get faculty + subject details
      db.query(
        `SELECT 
           f.name AS faculty_name,
           f.department AS faculty_department,
           f.designation AS faculty_designation,
           s.subject_name,
           s.semester AS subject_semester,
           s.course AS subject_course
         FROM faculty f
         JOIN subjects s ON s.faculty_id = f.faculty_id
         WHERE f.faculty_id=? AND s.subject_id=?`,
        [facultyId, subjectId],
        (err2, details) => {
          if (err2 || !details.length)
            return res.status(500).json({ msg: 'Faculty/Subject not found' })

          const d = details[0]

          // 3️⃣ Duplicate check
          db.query(
            `SELECT id FROM feedback
             WHERE hall_ticket=? AND subject_id=? AND feedback_type=?`,
            [hallTicket, subjectId, type],
            (err3, existing) => {
              if (err3) return res.status(500).json({ msg: 'DB error' })

              if (existing.length) {
                return res.status(409).json({
                  msg: `You already submitted ${type} feedback for this subject`
                })
              }

              // 4️⃣ Insert feedback with FULL DETAILS
              db.query(
                `INSERT INTO feedback (
                  hall_ticket,
                  student_name, student_department, student_course, student_semester,
                  faculty_id, faculty_name, faculty_department, faculty_designation,
                  subject_id, subject_name, subject_semester, subject_course,
                  feedback_type, ratings, academic_year, comments
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [
                  hallTicket, name,
                  department, course, semester,
                  facultyId, d.faculty_name, d.faculty_department, d.faculty_designation,
                  subjectId, d.subject_name, d.subject_semester, d.subject_course,
                  type, JSON.stringify(ratings), academic_year
                  , comments || null
                ],
                (err4) => {
                  if (err4) {
                    console.error(err4)
                    return res.status(500).json({ msg: 'Failed to submit feedback' })
                  }

                  res.json({ msg: 'Feedback submitted successfully' })
                }
              )
            }
          )
        }
      )
    }
  )
})

app.get('/api/admin/reports/faculty', (req, res) => {
  console.log('Reports request received')

  const sql = `
    SELECT
      f.faculty_id,
      f.name,
      f.department,
      fd.subject_name,
      fd.ratings
    FROM faculty f
    LEFT JOIN feedback fd 
      ON f.faculty_id = fd.faculty_id
    ORDER BY f.name
  `

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Reports error:', err)
      return res.status(500).json({ msg: 'Database error' })
    }

    /* ================= GROUP DATA ================= */

    const facultyMap = {}

    rows.forEach(r => {
      if (!facultyMap[r.faculty_id]) {
        facultyMap[r.faculty_id] = {
          faculty_id: r.faculty_id,
          name: r.name,
          department: r.department,
          responses: 0,
          subjects: {}
        }
      }

      if (!r.ratings || !r.subject_name) return

      let ratings
      try {
        ratings = JSON.parse(r.ratings)
      } catch {
        return
      }

      facultyMap[r.faculty_id].responses += 1

      if (!facultyMap[r.faculty_id].subjects[r.subject_name]) {
        facultyMap[r.faculty_id].subjects[r.subject_name] = {
          subject_name: r.subject_name,
          total: 0,
          count: 0
        }
      }

      Object.values(ratings).forEach(v => {
        facultyMap[r.faculty_id].subjects[r.subject_name].total += Number(v)
        facultyMap[r.faculty_id].subjects[r.subject_name].count += 1
      })
    })

    /* ================= FORMAT OUTPUT ================= */

    const result = Object.values(facultyMap).map(f => {
      const subjects = Object.values(f.subjects).map(s => ({
        subject_name: s.subject_name,
        avgRating: s.count ? (s.total / s.count).toFixed(2) : 0,
        feedbackCount: s.count
      }))

      return {
        faculty_id: f.faculty_id,
        name: f.name,
        department: f.department,
        responses: f.responses,
        subjects
      }
    })

    res.json(result)
  })
})




app.get('/api/admin/analytics/faculty', authMiddleware, (req, res) => {
  const { department, course, semester, year } = req.query

  if (!department || !course || !semester || !year) {
    return res.status(400).json({ msg: 'Missing filters' })
  }

  db.query(
    `
    SELECT 
      faculty_id,
      faculty_name,
      faculty_designation,
      subject_name,
      feedback_type,
      ratings
    FROM feedback
    WHERE faculty_department = ?
      AND subject_course = ?
      AND subject_semester = ?
      AND academic_year = ?
    `,
    [department, course, semester, year],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ msg: 'DB error' })
      }

      const facultyMap = {}

      rows.forEach(r => {
        if (!facultyMap[r.faculty_id]) {
          facultyMap[r.faculty_id] = {
            faculty_id: r.faculty_id,
            name: r.faculty_name,
            designation: r.faculty_designation,
            subjects: new Set(),
            feedbackCount: 0,
            totalRating: 0,
            ratingItems: 0
          }
        }

        facultyMap[r.faculty_id].subjects.add(r.subject_name)
        facultyMap[r.faculty_id].feedbackCount++

        const ratingObj = JSON.parse(r.ratings || '{}')
        Object.values(ratingObj).forEach(val => {
          facultyMap[r.faculty_id].totalRating += Number(val)
          facultyMap[r.faculty_id].ratingItems++
        })
      })

      const facultyAnalytics = Object.values(facultyMap).map(f => ({
        faculty_id: f.faculty_id,
        name: f.name,
        designation: f.designation,
        subjects: Array.from(f.subjects),
        feedbackCount: f.feedbackCount,
        avgRating:
          f.ratingItems > 0
            ? (f.totalRating / f.ratingItems).toFixed(2)
            : 0
      }))

      res.json({ facultyAnalytics })
    }
  )
})

app.get('/api/admin/analytics/faculty/:facultyId', (req, res) => {
  const { facultyId } = req.params
  const { course, semester, year } = req.query

  db.query(
    `SELECT
        faculty_name,
        faculty_designation,
        faculty_department,
        subject_name,
        feedback_type,
        ratings,
        comments,
        student_name,
        hall_ticket
     FROM feedback
     WHERE faculty_id = ?
       AND subject_course = ?
       AND subject_semester = ?
       AND academic_year = ?
     ORDER BY subject_name, feedback_type`,
    [facultyId, course, semester, year],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ msg: 'DB error' })
      }

      if (!rows.length) {
        return res.json({
          name: '',
          designation: '',
          department: '',
          subjects: []
        })
      }

      /* ============ FACULTY META ============ */
      const faculty = {
        name: rows[0].faculty_name,
        designation: rows[0].faculty_designation,
        department: rows[0].faculty_department,
        subjects: []
      }

      /* ============ SUBJECT MAP ============ */
      const subjectMap = {}

      rows.forEach(r => {
        if (!subjectMap[r.subject_name]) {
          subjectMap[r.subject_name] = {
            subject_name: r.subject_name,
            theory: { students: [] },
            lab: { students: [] }
          }
        }

        const ratingsObj =
          typeof r.ratings === 'string'
            ? JSON.parse(r.ratings)
            : r.ratings

        const values = Object.values(ratingsObj || {})
        const avg =
          values.length > 0
            ? values.reduce((a, b) => a + Number(b), 0) / values.length
            : 0

        const studentFeedback = {
          student_name: r.student_name,
          hall_ticket: r.hall_ticket,
          ratings: ratingsObj,
          avgRating: Number(avg.toFixed(2)),
          comment: r.comments
        }

        if (r.feedback_type === 'THEORY') {
          subjectMap[r.subject_name].theory.students.push(studentFeedback)
        }

        if (r.feedback_type === 'LAB') {
          subjectMap[r.subject_name].lab.students.push(studentFeedback)
        }
      })

      faculty.subjects = Object.values(subjectMap)

      res.json(faculty)
    }
  )
})


// ===== File Uploads =====
const upload = multer({ dest: 'uploads/' })

app.post('/api/admin/upload/students',
  adminMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      const data = readExcel(req.file.path)

      for (const s of data) {
        if (!s.hall_ticket) continue

        await db.promise().query(
          `INSERT IGNORE INTO students
          (hall_ticket, name, course, department, semester, phone, email, academic_year)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.hall_ticket,
            s.name,
            s.course,
            s.department,
            s.semester,
            s.phone,
            s.email,
            s.academic_year
          ]
        )
      }

      res.json({ msg: 'Students uploaded successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Student upload failed' })
    }
  }
)


app.post('/api/admin/upload/faculty',
  adminMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      const data = readExcel(req.file.path)

      for (const f of data) {
        if (!f.faculty_id) continue

        await db.promise().query(
          `INSERT IGNORE INTO faculty
          (faculty_id, name, department, designation)
          VALUES (?, ?, ?, ?)`,
          [f.faculty_id, f.name, f.department, f.designation]
        )
      }

      res.json({ msg: 'Faculty uploaded successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Faculty upload failed' })
    }
  }
)


app.post('/api/admin/upload/subjects',
  adminMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      const data = readExcel(req.file.path)
      console.log(data);

      for (const s of data) {
        // if (!s.subject_id) continue

        await db.promise().query(
          `INSERT INTO subjects
          (subject_id, subject_name, course, semester, faculty_id)
          VALUES (?, ?, ?, ?, ?)`,
          [
            s.subject_id,
            s.subject_name,
            s.course,
            s.semester,
            s.faculty_id
          ]
        )
      }

      res.json({ msg: 'Subjects uploaded successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Subject upload failed' })
    }
  }
)
//pdf reports



app.get('/api/admin/analytics/faculty/:facultyId/pdf', (req, res) => {
  const { facultyId } = req.params;
  console.log(`Generating PDF report for faculty ID: ${facultyId}`);

  const sql = `
    SELECT fd.*, f.name, f.department
    FROM feedback fd
    JOIN faculty f ON fd.faculty_id = f.faculty_id
    WHERE fd.faculty_id = ?
  `;

  db.query(sql, [facultyId], (err, rows) => {
    if (err) return res.status(500).send('Database error');
    if (rows.length === 0) return res.status(404).send('No feedback found');

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set headers BEFORE piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="Faculty_${facultyId}_Report.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // PDF content
    doc.fontSize(18).text('Faculty Feedback Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Faculty Name: ${rows[0].name}`);
    doc.text(`Department: ${rows[0].department}`);
    doc.moveDown();
    doc.fontSize(12).text('Feedback Details:', { underline: true });
    doc.moveDown(0.5);

    rows.forEach((row, index) => {
      let ratings = {};
      try {
        ratings = JSON.parse(row.ratings);
      } catch (e) { }
      doc.fontSize(10).text(`Feedback #${index + 1} (Type: ${row.feedback_type})`);
      Object.entries(ratings).forEach(([q, val]) => {
        doc.text(`- ${q}: ${val}`);
      });
      if (row.comments) doc.text(`Comments: ${row.comments}`);
      doc.moveDown();
    });

    doc.end();
  });
});

// view departments analysis
app.get('/api/admin/analytics/departments',  (req, res) => {
  db.query(
    `SELECT DISTINCT faculty_department
     FROM feedback
     WHERE faculty_department IS NOT NULL
     ORDER BY faculty_department`,
    (err, results) => {
      if (err) {
        console.error('Department analytics error:', err)
        return res.status(500).json({ msg: 'DB error' })
      }

      res.json({
        departments: results.map(r => r.faculty_department)
      })
    }
  )
})
// Get courses, semesters, academic years by department
app.get('/api/admin/analytics/filters/:department',  (req, res) => {
  const { department } = req.params

  db.query(
    `
    SELECT 
      DISTINCT student_course,
      student_semester,
      academic_year
    FROM feedback
    WHERE faculty_department = ?
    ORDER BY academic_year DESC, student_course, student_semester
    `,
    [department],
    (err, results) => {
      if (err) {
        console.error('Filter fetch error:', err)
        return res.status(500).json({ msg: 'DB error' })
      }

      const courses = [...new Set(results.map(r => r.student_course))]
      const semesters = [...new Set(results.map(r => r.student_semester))]
      const academicYears = [...new Set(results.map(r => r.academic_year))]

      res.json({
        courses,
        semesters,
        academicYears
      })
    }
  )
})


// ===== Start Server =====
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
