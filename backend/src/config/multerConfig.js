import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage });

export default upload;
