import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export default (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  req.user = jwt.verify(token, JWT_SECRET)
  next()
}
