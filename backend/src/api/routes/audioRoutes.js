import express from 'express';
import { uploadAudio, getAudioFiles, getAudioFileById } from '../controllers/audioController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; 
import { upload } from '../../config/db.js'; 

const router = express.Router();


router.post("/audio/upload", authMiddleware, upload.single("audio"), uploadAudio);

router.get("/audio/files", authMiddleware, getAudioFiles);

router.get("/audio/file/:id", authMiddleware, getAudioFileById);

export default router;
