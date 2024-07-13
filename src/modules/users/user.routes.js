import { Router } from "express"
import { verifyToken } from "../../middlewares/verfiyToken.js"
import {
  deleteUser,
  forgetPassword,
  getAllUserWithRecoveryMail,
  getUserById,
  getUserInfo,
  updatePassword,
  updateUser,
} from "./user.controllers.js"
import { asyncHandler } from "../../../utils/asyncHandler.js"

export const userRoutes = Router()

userRoutes.get("/info", asyncHandler(getAllUserWithRecoveryMail))
userRoutes.get("/", asyncHandler(getUserInfo))
userRoutes.post("/forget-password", asyncHandler(forgetPassword))
userRoutes.get("/:id", verifyToken, asyncHandler(getUserById))
userRoutes.delete("/:id", verifyToken, asyncHandler(deleteUser))
userRoutes.put("/:id", verifyToken, asyncHandler(updateUser))
userRoutes.post("/update-password", verifyToken, asyncHandler(updatePassword))
