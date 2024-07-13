import multer from "multer"
import { Company } from "../../../db/models/Company.model.js"
import { Job } from "../../../db/models/Job.model.js"
import { AppError } from "../../../utils/appError.js"
import {
  companyString,
  jobString,
  userString,
} from "../../../utils/constant.js"
import { userData } from "../../../utils/model.data.js"

export const addJob = async (req, res, next) => {
  const payload = req.payload
  if (payload.roles != userData.role[1]) {
    return next(new AppError(409, userString.unauthorized))
  }

  const {
    jobTitle,
    jobLocation,
    workTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body
  const userId = req.payload.userId
  const newJob = new Job({
    jobTitle,
    jobLocation,
    workTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: userId,
  })
  await newJob.save()
  return res
    .status(201)
    .json({ data: newJob, message: jobString.jobAdded, success: true })
}

export const updateJob = async (req, res, next) => {
  const payload = req.payload
  const { jobId } = req.params
  const job = await Job.findById(jobId)
  if (!job) {
    return next(new AppError(404, jobString.jobNotFound))
  }
  if (payload.roles != userData.role[1] || job.addedBy != payload.userId) {
    return next(new AppError(409, userString.unauthorized))
  }
  const {
    jobTitle,
    jobLocation,
    workTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body

  const UpdatedJob = await Job.findByIdAndUpdate(
    job.id,
    {
      jobTitle,
      jobLocation,
      workTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  )
  return res.json({
    data: UpdatedJob,
    message: jobString.jobUpdated,
    success: true,
  })
}

export const deleteJob = async (req, res, next) => {
  const payload = req.payload
  const { jobId } = req.params
  const job = await Job.findById(jobId)
  if (!job) {
    return next(new AppError(404, jobString.jobNotFound))
  }
  if (payload.roles != userData.role[1] || job.addedBy != payload.userId) {
    return next(new AppError(409, userString.unauthorized))
  }
  await Job.findByIdAndDelete(jobId)
  return res.json({ message: jobString.jobDeleted, success: true })
}

export const getAllJobsWithCompanyInfo = async (req, res, next) => {
  const jobs = await Job.find()
    .select("jobTitle")
    .populate("addedBy", "userName")

  const newJobs = await Promise.all(
    jobs.map(async (job) => {
      const company = await Company.findOne({
        companyHR: job.addedBy._id,
      }).select("companyName industry")
      return { ...job._doc, company }
    })
  )
  return res.json({ data: newJobs, success: true })
}

export const getJobsByCompany = async (req, res, next) => {
  const { companyName } = req.query
  const company = await Company.findOne({ companyName })
  if (!company) {
    return next(new AppError(404, companyString.companyNotFound))
  }
  const jobs = await Job.find({ addedBy: company.companyHR }).select("jobTitle")
  return res.json({ data: jobs, success: true })
}

export const getFilteredJobs = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query
  const filter = {}
  if (workingTime) filter.workTime = workingTime
  if (jobLocation) filter.jobLocation = jobLocation
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel
  if (jobTitle) filter.jobTitle = jobTitle
  if (technicalSkills) filter.technicalSkills = { $in: technicalSkills }

  const jobs = await Job.find(filter).select(
    "jobTitle workingTime jobLocation technicalSkills"
  )
  if (jobs.length === 0) {
    return next(new AppError(404, jobString.jobNotFound))
  }
  return res.json({ data: jobs, success: true })
}

export const applyToJob = async (req, res, next) => {}
