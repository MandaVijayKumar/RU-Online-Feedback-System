import { db } from '../config/db.js'

export const submitFeedback = (req, res) => {
  const { facultyId, subjectId, ratings, comments } = req.body
  const hallTicket = req.user.hallTicket

  db.query(
    `INSERT INTO feedback
    (hall_ticket, faculty_id, subject_id, ratings, comments)
    VALUES (?,?,?,?,?)`,
    [hallTicket, facultyId, subjectId, ratings, comments],
    (err) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      res.json({ msg: 'Feedback submitted successfully' })
    }
  )
}

export const getFacultySubjects = (req, res) => {
  const hallTicket = req.params.hallTicket

  db.query(
    'SELECT * FROM students WHERE hall_ticket=?',
    [hallTicket],
    (err, student) => {
      if (err || !student.length) return res.status(404).json({ msg: 'Student not found' })

      const course = student[0].course
      const semester = student[0].semester

      db.query(
        `SELECT subjects.id as subject_id, subjects.subject_name, subjects.semester, faculty.id as faculty_id, faculty.name as faculty_name
         FROM subjects
         LEFT JOIN faculty ON subjects.faculty_id = faculty.id
         WHERE subjects.course=? AND subjects.semester=?`,
        [course, semester],
        (err2, results) => {
          if (err2) return res.status(500).json({ msg: 'DB error' })

          const subjects = results.map(r => ({ id: r.subject_id, subject_name: r.subject_name, semester: r.semester }))
          const faculty = results.map(r => ({ id: r.faculty_id, name: r.faculty_name }))

          res.json({ subjects, faculty })
        }
      )
    }
  )
}
