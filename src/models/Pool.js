import mongoose from "mongoose";

const PoolSchema = new mongoose.Schema({
	groupName:{
		type: String,
		required: true
	},
	location:{
		type: String,
		required: true
	},
	destination:{
		type: String,
		required: true
	},
	time:{
		type: Date,
		required: true
	}
});

export default mongoose.models.Pool || mongoose.model("Pool", PoolSchema);