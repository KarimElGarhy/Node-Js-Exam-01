import Joi from "joi"

export const userValidation = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .message("Password is Weak ! ")
    .required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required(),
  recoveryEmail: Joi.string(),
  DOB: Joi.date(),
  role: Joi.string(),
})
