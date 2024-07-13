import { Router } from "express"
import { verifyToken } from "../../middlewares/verfiyToken.js"
import {
  addJob,
  applyToJob,
  deleteJob,
  getAllJobsWithCompanyInfo,
  getFilteredJobs,
  getJobsByCompany,
  updateJob,
} from "./jobs.controllers.js"

export const jopRoutes = Router()

jopRoutes.post("/", verifyToken, addJob)
jopRoutes.get("/get-all-jobs", verifyToken, getAllJobsWithCompanyInfo)
jopRoutes.get("/", verifyToken, getJobsByCompany)
jopRoutes.get("/search", verifyToken, getFilteredJobs)
jopRoutes.put("/:jobId", verifyToken, updateJob)
jopRoutes.delete("/:jobId", verifyToken, deleteJob)
