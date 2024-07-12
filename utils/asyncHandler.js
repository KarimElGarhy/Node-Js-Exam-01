import { AppError } from "./appError.js"

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(new AppError(err.message, err.statusCode))
    })
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  return res
    .status(err.statusCode || 400)
    .json({ message: err.message, status: false })
}
