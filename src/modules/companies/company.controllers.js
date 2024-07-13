import { Company } from "../../../db/models/Company.model.js"
import { Job } from "../../../db/models/Job.model.js"
import { AppError } from "../../../utils/appError.js"
import { companyString, userString } from "../../../utils/constant.js"
import { userData } from "../../../utils/model.data.js"

export const addCompany = async (req, res, next) => {
  const payload = req.payload
  console.log(payload)
  if (payload.roles != userData.role[1]) {
    return next(new AppError(409, userString.unauthorized))
  }
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body

  const companyExists = await Company.findOne({
    $or: [{ companyEmail: companyEmail }, { companyName: companyName }],
  })
  if (companyExists) {
    return next(new AppError(409, companyString.companyExists))
  }
  const company = new Company({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: payload.userId,
  })
  await company.save()

  res.status(201).json({
    data: company,
    success: true,
    message: companyString.companyCreated,
  })
}

export const updateCompany = async (req, res, next) => {
  const payload = req.payload
  const { companyId } = req.params
  const company = await Company.findById(companyId)
  if (
    payload.roles != userData.role[1] ||
    company.companyHR != payload.userId
  ) {
    return next(new AppError(409, userString.unauthorized))
  }
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body
  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { new: true }
  )
  res.status(200).json({
    data: updatedCompany,
    success: true,
    message: companyString.companyUpdated,
  })
}

export const deleteCompany = async (req, res, next) => {
  const payload = req.payload
  const { companyId } = req.params
  const company = await Company.findById(companyId)

  if (!company) {
    return next(new AppError(404, companyString.companyNotFound))
  }
  if (
    payload.roles != userData.role[1] ||
    company.companyHR != payload.userId
  ) {
    return next(new AppError(409, userString.unauthorized))
  }
  await Company.findByIdAndDelete(companyId)
  res.status(200).json({
    success: true,
    message: companyString.companyDeleted,
  })
}

export const getCompanyInfo = async (req, res, next) => {
  const payload = req.payload
  const { companyId } = req.params
  const company = await Company.findById(companyId)
  if (!company) {
    return next(new AppError(404, companyString.companyNotFound))
  }

  const jobCompany = await Job.find({ addedBy: company.companyHR }).select(
    "jobTitle"
  )

  return res.status(200).json({
    message: companyString.companyFound,
    data: { company, jobCompany },
    success: true,
  })
}

export const searchForCompany = async (req, res, next) => {
  const payload = req.payload
  const { searchTerm } = req.query
  const searchResult = await Company.findOne({ companyName: searchTerm })
  if (!searchResult) {
    return res
      .status(404)
      .json({ message: companyString.companyNotFound, success: false })
  }
  return res.json({
    message: companyString.companyFound,
    data: searchResult,
    success: true,
  })
}
