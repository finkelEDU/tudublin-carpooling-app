import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
	reviewer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	rating: {type: Number, min: 1, max: 5},
	comment: String,
	createdAt: {type: Date, default: Date.now}
});

const DriverInfoSchema = new mongoose.Schema({
	startTime:{
		type: String,
		default: ""
	},
	endTime:{
		type: String,
		default: ""
	},
	locationArea:{
		type: String,
		default: ""
	}
});

const UserSchema = new mongoose.Schema({
	//supabase auth setup to link with supabase
	supabase_id: {type: String, required: true, unique},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	
	email: {
		type: String,
		required: true,
		unique: true,
	},
	profilePic: {
		type: String,
		default: "/images/avatar-placeholder.png"
	},
	userType: {
		type: String,
		enum: ["Student", "Driver", "Admin"],
		required: true
	},
	about: {
		type: String,
		default: "No information provided."
	},
	
	reviews: [ReviewSchema],
	
	driverInfo: [DriverInfoSchema]
});

//Prevent model overwrite in development
export default mongoose.models.User || mongoose.model("User", UserSchema);