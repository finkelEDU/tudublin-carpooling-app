import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reason: String,
    comment: String,

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Report ||
  mongoose.model("Report", reportSchema);