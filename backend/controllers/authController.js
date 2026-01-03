import { db } from '../config/db.js'
import { transporter } from '../config/mail.js'
import { generateOTP } from '../utils/otp.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export const sendOTP = (req, res) => {
  const { hallTicket } = req.body
  const otp = generateOTP()

  db.query('SELECT * FROM students WHERE hall_ticket=?', [hallTicket], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error' })
    if (!result.length) return res.status(404).json({ msg: 'Invalid Hall Ticket' })

    const email = result[0].email
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
}


export const verifyOTP = (req, res) => {
  const { hallTicket, otp } = req.body

  db.query(
    'SELECT * FROM students WHERE hall_ticket=? AND otp=?',
    [hallTicket, otp],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'DB error' })
      if (!result.length) return res.status(401).json({ msg: 'Invalid OTP' })

      const token = jwt.sign({ hallTicket }, JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    }
  )
}
