import { jobData } from "../../utils/model.data.js"
import { model, Schema } from "mongoose"

// schema
const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: jobData.jobLocation,
    },
    workTime: {
      type: String,
      enum: jobData.workTime,
    },
    seniorityLevel: {
      type: String,
      enum: jobData.seniorityLevel,
    },
    jobDescription: {
      type: String,
    },
    technicalSkills: {
      type: [String],
    },
    softSkills: {
      type: [String],
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

// model
export const Job = model("Job", jobSchema)
