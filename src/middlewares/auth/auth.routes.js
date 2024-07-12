import { Router } from "express"
import { signIn, signUp } from "./auth.controllers.js"
import { asyncHandler } from "../../../utils/asyncHandler.js"
import { validate } from "../validate.js"
import { userValidation } from "../../modules/users/user.validation.js"

export const authRoutes = Router()

authRoutes.post("/signup", validate(userValidation), asyncHandler(signUp))
authRoutes.post("/sign-in", asyncHandler(signIn))
