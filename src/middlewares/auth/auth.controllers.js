import { User } from "../../../db/models/User.model.js"
import { AppError } from "../../../utils/appError.js"

import bcrypt from "bcrypt"
import { userString } from "../../../utils/constant.js"
import jwt from "jsonwebtoken"

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

export const signIn = async (req, res, next) => {
  const { email, password, mobileNumber } = req.body
  //check mail and password
  const user = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  }).select("password userName")
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError(401, userString.invalidCredentials))
  }
  //generate token
  const token = await jwt.sign(
    { userId: user._id, userName: user.userName },
    process.env.JWT_SECRET
  )
  user.status = "Online"
  user.save()
  res
    .status(200)
    .json({ Message: userString.loginSuccess, success: true, token })
}
