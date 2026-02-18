import mongoose from "mongoose";

const CarpoolSchema = new mongoose.Schema({
    origin: String,
    originLat: Number,
    originLng: Number,
    destination: String,
    destinationLat: Number,
    destinationLng: Number,
    date: {type: Date, required: true, default: Date.now},
    seatsAvailable: Number,

    
}, {timestamps: true});

export default mongoose.models.Carpool || mongoose.model("Carpool", CarpoolSchema);