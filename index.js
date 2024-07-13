import express from "express"
import { dbConnection } from "./db/dbConnection.js"
const app = express()
import dotenv from "dotenv"
import { authRoutes } from "./src/middlewares/auth/auth.routes.js"
import { globalErrorHandler } from "./utils/asyncHandler.js"
import { userRoutes } from "./src/modules/users/user.routes.js"
import { companiesRouter } from "./src/modules/companies/company.routes.js"
import { jopRoutes } from "./src/modules/jobs/jobs.routes.js"

dotenv.config()

app.use(express.json())

dbConnection()

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/companies", companiesRouter)
app.use("/jobs", jopRoutes)

app.use(globalErrorHandler)
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server listening on port", port)
})
