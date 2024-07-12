import jwt from "jsonwebtoken"
import { userString } from "../../utils/constant.js"

export const verifyToken = (req, res, next) => {
  const { token } = req.headers
  if (!token) {
    return res.status(401).json({ message: userString.userLogin })
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  if (!payload) {
    return res.status(403).json({ message: userString.invalidToken })
  }
  req.payload = payload
  next()
}
