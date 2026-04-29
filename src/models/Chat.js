import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
	message: {type: String, required: true, maxlength: 200},
	createdAt: {type: Date, default: Date.now}
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);