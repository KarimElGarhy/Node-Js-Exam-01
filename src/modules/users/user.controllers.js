import { User } from "../../../db/models/User.model.js"
import { AppError } from "../../../utils/appError.js"
import { userString } from "../../../utils/constant.js"

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
  const user = await User.findById(payload.userId)
  if (!user) {
    return next(new AppError(404, userString.userNotFound))
  }
  await user.remove()
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
  console.log(req.query)
  const user = await User.findById(userId).select("userName email mobileNumber")
  if (!user) {
    return next(new AppError(404, userString.userNotFound))
  }
  return res
    .status(200)
    .json({ message: userString.userFound, data: user, success: true })
}
