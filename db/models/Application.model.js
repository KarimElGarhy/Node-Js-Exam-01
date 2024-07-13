import mongoose, { model, Schema } from "mongoose"

//schema
const AppSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userTechSkills: { type: [String] },
    userSoftSkills: { type: [String] },
    userResume: { type: String },
  },
  { timestamps: true }
)
//model
export const Application = model("Application", AppSchema)
