import { User } from "../../../db/models/User.model.js"
import { AppError } from "../../../utils/appError.js"

import bcrypt from "bcrypt"
import { userString } from "../../../utils/constant.js"

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    password,
    email,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body
  //check mail and mobile number
  const exitMail = await User.findOne({ email: email })
  if (exitMail) {
    return next(new AppError(409, userString.mailExists))
  }
  const exitPhone = await User.findOne({ mobileNumber: mobileNumber })
  if (exitPhone) {
    return next(new AppError(409, userString.phoneExists))
  }
  //has password
  const hashPassword = bcrypt.hashSync(password, 8)
  //create user
  const user = await User.create({
    firstName,
    lastName,
    userName: firstName + " " + lastName,
    email,
    recoveryEmail,
    DOB,
    mobileNumber,
    password: hashPassword,
    role,
  })
  res
    .status(201)
    .json({ Message: userString.userCreated, success: true, data: user })
}
