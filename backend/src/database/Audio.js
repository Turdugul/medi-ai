import mongoose from "mongoose";

const AudioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  transcript: { type: String, required: true },
  formattedReport: { type: String, required: true },
  createdDate: { type: String, required: true }, // Stores the date (e.g., "5 Jan 2025")
  createdTime: { type: String, required: true }, // Stores the time (e.g., "4:15 PM")
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true } // Link to GridFS file
});

// Pre-save middleware to set createdDate and createdTime
AudioSchema.pre("save", function (next) {
  const now = new Date();
  this.createdDate = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  this.createdTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  next();
});

const AudioRecord = mongoose.model("AudioRecord", AudioSchema);
export default AudioRecord;
