// schema

import mongoose, { model, Schema } from "mongoose"

const companyModel = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
    },
    numberOfEmployees: {
      type: [Number, Number],
    },
    companyEmail: {
      type: String,
      unique: true,
    },
    companyHR: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

// model
export const Company = model("Company", companyModel)
