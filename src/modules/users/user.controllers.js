import { User } from "../../../db/models/User.model.js"
import { AppError } from "../../../utils/appError.js"
import { userString } from "../../../utils/constant.js"
import { userData } from "../../../utils/model.data.js"
import { sendMail } from "../../../utils/sendmails.js"

export const getUserById = async (req, res, next) => {
  const { id } = req.params
  const payload = req.payload
  if (payload.userId != id) {
    return next(new AppError(409, userString.unauthorized))
  }
  const user = await User.findById(payload.userId).select(
    "userName email mobileNumber"
  )
  return res
    .status(200)
    .json({ message: userString.userFound, data: user, success: true })
}

export const deleteUser = async (req, res, next) => {
  const { id } = req.params
  const payload = req.payload
  if (payload.userId != id) {
    return next(new AppError(409, userString.unauthorized))
  }

  await User.deleteOne({ _id: id })
  return res
    .status(200)
    .json({ message: userString.userDeleted, success: true })
}

export const updateUser = async (req, res, next) => {
  const { id } = req.params
  const payload = req.payload
  if (payload.userId != id) {
    return next(new AppError(409, userString.unauthorized))
  }
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body

  const mailExists = await User.findOne({ email: email })
  if (mailExists && mailExists._id.toString() !== id) {
    return next(new AppError(409, userString.mailExists))
  }
  const mobileExists = await User.findOne({ mobileNumber: mobileNumber })
  if (mobileExists && mobileExists._id.toString() !== id) {
    return next(new AppError(409, userString.phoneExists))
  }

  const user = await User.findByIdAndUpdate(
    payload.userId,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    {
      new: true,
    }
  )
  if (!user) {
    return next(new AppError(404, userString.userNotFound))
  }
  return res
    .status(200)
    .json({ message: userString.userUpdated, data: user, success: true })
}

export const getUserInfo = async (req, res, next) => {
  const { userId } = req.query
  console.log(userId)
  const user = await User.findById(userId).select("userName email mobileNumber")
  if (!user) {
    return next(new AppError(404, userString.userNotFound))
  }
  return res
    .status(200)
    .json({ message: userString.userFound, data: user, success: true })
}

export const updatePassword = async (req, res, next) => {
  const { userId } = req.params
  const payload = req.payload
  if (payload.userId != id) {
    return next(new AppError(409, userString.unauthorized))
  }
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(payload.userId)
  if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
    return next(new AppError(401, userString.invalidCredentials))
  }
  const hashPassword = bcrypt.hashSync(newPassword, 8)
  await User.findByIdAndUpdate(
    payload.userId,
    { password: hashPassword },
    { new: true }
  )
}

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body
  //check mail
  const user = await User.findOne({ email: email })
  if (!user) {
    return next(new AppError(404, userString.invalidCredentials))
  }
  //generate new password
  const newPassword = bcrypt.hashSync(
    Math.random().toString(36).substr(2, 10),
    8
  )
  //update password
  user.password = newPassword
  await user.save()
  //send new password
  sendMail(
    email,
    `Job Search App New Password `,
    `your new password is ${newPassword}`
  )
  res.status(200).json({ Message: userString.passwordReset, success: true })
}

export const getAllUserWithRecoveryMail = async (req, res, next) => {
  const { recoveryEmail } = req.query
  const users = await User.find({ recoveryEmail: recoveryEmail })
    .select("userName email recoveryEmail role")
    .select({ role: userData.role[0] })

  if (users.length <= 0) {
    return next(new AppError(404, userString.userNotFound))
  }
  res.status(200).json({
    data: users,
    success: true,
    Message: userString.allUserWithRecoveryMail,
  })
}
