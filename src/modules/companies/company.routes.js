import { Router } from "express"
import { verifyToken } from "../../middlewares/verfiyToken.js"
import {
  addCompany,
  deleteCompany,
  getCompanyInfo,
  searchForCompany,
  updateCompany,
} from "./company.controllers.js"

export const companiesRouter = Router()

companiesRouter.get("/", searchForCompany)

companiesRouter.post("/", verifyToken, addCompany)
companiesRouter.get("/:companyId", verifyToken, getCompanyInfo)
companiesRouter.put("/:companyId", verifyToken, updateCompany)
companiesRouter.delete("/:companyId", verifyToken, deleteCompany)
