import express from 'express';
import { uploadAudio, getAudioFiles, getAudioFileById, updateAudioRecord, deleteAudioRecord } from '../controllers/audioController.js';
import authMiddleware from '../../middleware/authMiddleware.js'; 
import { upload } from '../../config/db.js'; 

const router = express.Router();


router.post("/audio/upload", authMiddleware, upload.single("audio"), uploadAudio);

router.get("/audio/files", authMiddleware, getAudioFiles);

router.get("/audio/file/:id", authMiddleware, getAudioFileById);
// Update audio record by ID

router.put("/audio/file/:id", authMiddleware, updateAudioRecord);

// Delete audio record by ID
router.delete("/audio/file/:id", authMiddleware, deleteAudioRecord);
export default router;
