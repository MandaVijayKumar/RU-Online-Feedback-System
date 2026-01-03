import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export default (req, res, next) => {
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
