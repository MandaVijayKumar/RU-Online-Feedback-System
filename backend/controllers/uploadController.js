import { readExcel } from '../utils/excelReader.js'
import { db } from '../config/db.js'

export const uploadStudents = (req, res) => {
  const data = readExcel(req.file.path)
  data.forEach(s => {
    db.query(
      `INSERT INTO students
      (hall_ticket,name,course,department,semester,phone,email,academic_year)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        s.hall_ticket, s.name, s.course, s.department,
        s.semester, s.phone, s.email, s.academic_year
      ]
    )
  })
  res.json({ message: 'Students uploaded' })
}

export const uploadFaculty = (req, res) => {
  const data = readExcel(req.file.path)
  data.forEach(f => {
    db.query(
      'INSERT INTO faculty (name,department,designation) VALUES (?,?,?)',
      [f.name, f.department, f.designation]
    )
  })
  res.json({ message: 'Faculty uploaded' })
}

export const uploadSubjects = (req, res) => {
  const data = readExcel(req.file.path)
  data.forEach(s => {
    db.query(
      'INSERT INTO subjects (subject_name,course,semester,faculty_id) VALUES (?,?,?,?)',
      [s.subject_name, s.course, s.semester, s.faculty_id]
    )
  })
  res.json({ message: 'Subjects uploaded' })
}
