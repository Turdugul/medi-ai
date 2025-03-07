// api/controllers/audioController.js
import AudioRecord from "../../database/Audio.js";
import { transcribeAudio } from "../../services/whisperService.js";
import { gridFSBucket } from "../../config/db.js"; 
import mongoose from "mongoose";
import { generateReport } from "../../services/gptService.js";

export const uploadAudio = async (req, res) => {
  try {
    const { userId, patientId, title } = req.body;
    const audioFile = req.file;

    if (!userId || !patientId || !title || !audioFile) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("✅ Received file:", audioFile);

    const { originalname, buffer, mimetype } = audioFile;
    const uploadStream = gridFSBucket.openUploadStream(originalname, { contentType: mimetype });

    await new Promise((resolve, reject) => {
      uploadStream.end(buffer);
      uploadStream.on("finish", async () => {
        const fileId = uploadStream.id.toString();
        console.log(`🔍 File ID: ${fileId}`);

        const file = await gridFSBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (file.length === 0) {
          console.error("❌ Error: File not found in GridFS");
          return res.status(404).json({ error: "File not found in GridFS" });
        }

        const transcript = await transcribeAudio(fileId);
        if (!transcript) {
          return res.status(500).json({ error: "Error during transcription" });
        }

        const formattedReport = await generateReport(transcript);
        if (!formattedReport) {
          return res.status(500).json({ error: "Error generating report" });
        }

        const now = new Date();
        const createdDate = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        const createdTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        const newRecord = new AudioRecord({
          userId,
          patientId,
          title,
          filename: originalname,
          transcript,
          formattedReport,
          fileId,
          createdDate,
          createdTime,
        });
        await newRecord.save();

        res.status(201).json({
          message: "Audio uploaded and processed successfully",
          data: newRecord,
        });
        resolve();
      });

      uploadStream.on("error", (error) => {
        console.error("❌ Error during upload:", error);
        reject(error);
        return res.status(500).json({ error: "Error during file upload" });
      });
    });
  } catch (error) {
    console.error("❌ Upload Audio Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAudioFiles = async (req, res) => {
  try {
    const audioFiles = await AudioRecord.find()
      .sort({ createdAt: -1 })
      .exec();
      
    res.status(200).json({
      message: "✅ Audio records retrieved successfully",
      data: audioFiles,
    });
  } catch (error) {
    console.error("❌ Error retrieving audio records:", error);
    res.status(500).json({ error: "Error retrieving audio files" });
  }
};

export const getAudioFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await AudioRecord.findById(id);
    if (!record) {
      return res.status(404).json({ error: "Audio record not found" });
    }

    const fileId = record.fileId;
    if (!fileId) {
      return res.status(400).json({ error: "No fileId associated with this record" });
    }

    console.log("Fetching record with ID:", id);
    console.log("Associated fileId:", fileId);

    const file = await gridFSBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    if (!file.length) {
      return res.status(404).json({ error: "File not found in GridFS" });
    }

    const response = {
      message: "✅ Audio record retrieved successfully",
      data: {
        id: record._id,
        userId: record.userId,
        patientId: record.patientId,
        title: record.title,
        filename: record.filename,
        transcript: record.transcript,
        formattedReport: record.formattedReport,
        createdDate: record.createdDate,
        createdTime: record.createdTime,
        file: file[0],
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error retrieving file and record:", error);
    res.status(500).json({ error: "Error retrieving file and record" });
  }
};

export const getAudioRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await AudioRecord.findById(id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.status(200).json({ message: "✅ Audio record retrieved", data: record });
  } catch (error) {
    console.error("❌ Error retrieving record:", error);
    res.status(500).json({ error: "Error retrieving record" });
  }
};

// 🔹 UPDATE Audio Record
export const updateAudioRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, transcript } = req.body;

    const updatedRecord = await AudioRecord.findByIdAndUpdate(
      id,
      { title, transcript },
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Audio record not found" });
    }

    res.status(200).json({ message: "✅ Audio record updated", data: updatedRecord });
  } catch (error) {
    console.error("❌ Error updating record:", error);
    res.status(500).json({ error: "Error updating audio record" });
  }
};


// 🔹 DELETE Audio Record
export const deleteAudioRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await AudioRecord.findById(id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    const fileId = record.fileId;
    if (fileId) {
      await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
      console.log(`🗑️ File with ID ${fileId} deleted from GridFS.`);
    }

    await AudioRecord.findByIdAndDelete(id);

    res.status(200).json({ message: "✅ Audio record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting record:", error);
    res.status(500).json({ error: "Error deleting record" });
  }
};