//services/whisperService.js

import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { gridFSBucket } from "../config/db.js";
import mongoose from "mongoose";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const getAudioBufferFromGridFS = async (fileId) => {
  return new Promise((resolve, reject) => {
    const _id = new mongoose.Types.ObjectId(fileId);
    const chunks = [];
    const downloadStream = gridFSBucket.openDownloadStream(_id);

    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("end", () => {
      console.log(`✅ Successfully retrieved audio file: ${fileId}`);
      resolve(Buffer.concat(chunks));
    });
    downloadStream.on("error", (error) => {
      console.error("❌ Error retrieving file:", error);
      reject(error);
    });
  });
};

// Transcribe audio using Whisper API
export const transcribeAudio = async (fileId) => {
  try {
    console.log("🔄 Retrieving audio for transcription...");
    const audioBuffer = await getAudioBufferFromGridFS(fileId);
    if (!audioBuffer) throw new Error("Failed to retrieve audio file");

    const formData = new FormData();
    formData.append("file", audioBuffer, { filename: "audio.mp3" });
    formData.append("model", "whisper-1");

    console.log("🔄 Sending audio to Whisper API...");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("❌ Whisper API Error:", error.response?.data || error);
    throw new Error("Error transcribing audio");
  }
};

