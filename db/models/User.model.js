//schema

import { model, Schema } from "mongoose"
import { userData } from "../../utils/model.data.js"

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: { type: String },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    recoveryEmail: {
      type: String,
    },
    DOB: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userData.role,
      default: userData.role[0],
    },
    status: {
      type: String,
      enum: userData.status,
      default: userData.status[1],
    },
  },
  { timestamps: true }
)
//model
export const User = model("User", userSchema)
