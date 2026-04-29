import mongoose from "mongoose";

const PoolRequestSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	location: {
		type: String,
		required: true,
	},

	destination: {
		type: String,
		required: true,
	},

	time: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ["pending", "accepted"],
		default: "pending",
	},
	driver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
});

export default mongoose.models.PoolRequest ||
  mongoose.model("PoolRequest", PoolRequestSchema);