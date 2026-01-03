import { db } from '../config/db.js'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export const adminLogin = (req, res) => {
  const { username, password } = req.body
  db.query(
    'SELECT * FROM admin WHERE username=?',
    [username],
    async (err, result) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      if (!result.length) return res.status(401).json({ msg: 'Invalid username' })

      const valid = await bcrypt.compare(password, result[0].password)
      if (!valid) return res.status(401).json({ msg: 'Invalid password' })

      const token = jwt.sign({ id: result[0].id, isAdmin: true }, JWT_SECRET, { expiresIn: '8h' })
      res.json({ token })
    }
  )
}

export const deleteStudent = (req, res) => {
  db.query(
    'DELETE FROM students WHERE hall_ticket=?',
    [req.params.hallTicket],
    (err) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      res.json({ msg: 'Student deleted' })
    }
  )
}

export const deleteFaculty = (req, res) => {
  db.query(
    'DELETE FROM faculty WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      res.json({ msg: 'Faculty deleted' })
    }
  )
}

export const getAllStudents = (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    res.json(results)
  })
}

export const getAllFaculty = (req, res) => {
  db.query('SELECT * FROM faculty', (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' })
    res.json(results)
  })
}
