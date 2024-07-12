import jwt from "jsonwebtoken"

export const verifyToken = () => {
  jwt.sign(token, process.env.JWT_SECRET)
}
