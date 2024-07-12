import { Router } from "express"
import { verifyToken } from "../../middlewares/verfiyToken.js"
import {
  deleteUser,
  getUserById,
  getUserInfo,
  updateUser,
} from "./user.controllers.js"
import { asyncHandler } from "../../../utils/asyncHandler.js"

export const userRoutes = Router()

userRoutes.get("/:id", verifyToken, asyncHandler(getUserById))
userRoutes.delete("/:id", verifyToken, asyncHandler(deleteUser))
userRoutes.put("/:id", verifyToken, asyncHandler(updateUser))
userRoutes.get("/",  asyncHandler(getUserInfo))
