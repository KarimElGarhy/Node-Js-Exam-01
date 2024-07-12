import express from "express"
import { dbConnection } from "./db/dbConnection.js"
const app = express()
import dotenv from "dotenv"
import { authRoutes } from "./src/middlewares/auth/auth.routes.js"
import { globalErrorHandler } from "./utils/asyncHandler.js"

dotenv.config()
app.use(express.json())
dbConnection()
app.use("/auth", authRoutes)

app.use(globalErrorHandler)
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server listening on port", port)
})
